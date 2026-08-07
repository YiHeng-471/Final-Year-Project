<?php

namespace App\Http\Controllers;

use App\Models\PerfumeItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class RecommendationController extends Controller
{
    public function getRecommendations(Request $request)
    {
        // Compile quiz answers into a unified semantic description string
        $quizString = "Prefers " . $request->scent_family . " scents. Ideal wear: " . $request->occasion . ". Likes notes of " . $request->favorite_notes;

        // Call your dedicated Python Machine Learning engine
        $response = Http::post('http://127.0.0.1', [
            'preferences_text' => $quizString
        ]);

        if ($response->successful()) {
            $recommendedIds = collect($response->json())->pluck('id')->toArray();

            // Use MySQL Eloquent to fetch the matching items ordered exactly by similarity rank
            $perfumes = PerfumeItem::whereIn('id', $recommendedIds)
                ->orderByRaw("FIELD(id, " . implode(',', $recommendedIds) . ")")
                ->get();

            return view('recommendations.results', compact('perfumes'));
        }

        return back()->withErrors('The recommendation engine is currently offline.');
    }
}