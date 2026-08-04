<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\PerfumeItem;
use App\Models\User;

class RecommendationController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $personalizedPerfumes = [];

        // If user has completed their questionnaire, fetch personalized data
        if ($user && $user->has_completed_questionnaire) {
            $personalizedPerfumes = $this->fetchAIRecommendations($user);
        } else {
            // Fallback to top products for guests or users who haven't taken the quiz
            $personalizedPerfumes = PerfumeItem::with('category')->take(3)->get();
        }

        return Inertia::render('HomePage', [
            'auth' => [
                'user' => $user
            ],
            'personalizedPerfumes' => $personalizedPerfumes
        ]);
    }

    public function submitQuiz(Request $request)
    {
        $request->validate([
            'family' => 'required|string',
            'occasion' => 'required|string',
            'gender' => 'required|string',
        ]);

        $user = Auth::user();
        if ($user) {
            $user->update([
                'pref_scent_type' => $request->family,
                'pref_occasion' => $request->occasion,
                'pref_gender' => $request->gender,
                'has_completed_questionnaire' => true,
            ]);
        }

        return redirect()->route('dashboard');
    }

    private function fetchAIRecommendations($user)
    {
        $quizAnswers = [
            'preferred_scent_type' => $user->pref_scent_type,
            'preferred_occasion' => $user->pref_occasion,
            'preferred_gender' => $user->pref_gender,
        ];

        // Fetch your database perfume choices (alias hyphenated column to safe key)
        $perfumes = PerfumeItem::selectRaw("id, name, description, `scent-notes` as scent_notes, tags")
            ->get()->toArray();

        $prompt = "You are an expert AI Perfume Personalization Assistant for a Malaysian audience. " .
                  "A customer has these fragrance preferences: " . json_encode($quizAnswers) . ". " .
                  "Here is our store inventory list: " . json_encode($perfumes) . ". " .
                  "Analyze the items and select the top 3 best matching perfume IDs. " .
                  "Respond ONLY with a valid JSON array containing the matching perfume item IDs, like this:. " .
                  "Do not include any formatting, markdown blocks, backticks, or conversational text.";

        $apiKey = env('GEMINI_API_KEY');
        
        try {
            $response = Http::post("https://googleapis.com{$apiKey}", [
                'contents' => [
                    ['parts' => [['text' => $prompt]]]
                ]
            ]);

            if ($response->successful()) {
                $aiData = $response->json();
                $text = $aiData['candidates'][0]['content']['parts'][0]['text'] ?? '[]';
                
                // Strip out markdown code blocks if the AI accidentally appends them
                $cleanText = trim(str_replace(['```json', '```'], '', $text));
                $recommendedIds = json_decode($cleanText, true);

                if (is_array($recommendedIds) && !empty($recommendedIds)) {
                    return PerfumeItem::whereIn('id', $recommendedIds)
                        ->orderByRaw("FIELD(id, " . implode(',', $recommendedIds) . ")")
                        ->get();
                }
            }
        } catch (\Exception $e) {
            // Log error or let it default fallback gracefully
        }

        return PerfumeItem::take(3)->get();
    }
}
