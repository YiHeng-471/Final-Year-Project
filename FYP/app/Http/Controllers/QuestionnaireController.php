<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class QuestionnaireController extends Controller
{
    private const SCENT_CHARACTERS = [
        'floral' => 'floral',
        'woody' => 'woody',
        'fresh' => 'fresh',
        'citrus' => 'citrus',
        'sweet' => 'sweet',
        'warm_spicy' => 'warm and spicy',
        'aquatic_clean' => 'aquatic and clean',
    ];

    private const NOTES = [
        'vanilla' => 'vanilla',
        'bergamot' => 'bergamot',
        'rose' => 'rose',
        'jasmine' => 'jasmine',
        'lavender' => 'lavender',
        'sandalwood' => 'sandalwood',
        'musk' => 'musk',
        'amber' => 'amber',
        'citrus' => 'citrus notes',
        'oud' => 'oud',
        'vetiver' => 'vetiver',
        'patchouli' => 'patchouli',
    ];

    private const OCCASIONS = [
        'everyday' => 'everyday wear',
        'work_office' => 'professional office and daytime use',
        'date_romantic' => 'dates and romantic occasions',
        'evening_night' => 'evening and nighttime wear',
        'special_occasion' => 'special occasions and celebrations',
        'sport_outdoors' => 'sport and outdoor activities',
    ];

    private const FEELINGS = [
        'clean_refreshing' => 'clean and refreshing',
        'soft_comforting' => 'soft and comforting',
        'elegant_sophisticated' => 'elegant and sophisticated',
        'sweet_cozy' => 'sweet and cozy',
        'bold_sensual' => 'bold and sensual',
        'warm_luxurious' => 'warm and luxurious',
        'energetic_uplifting' => 'energetic and uplifting',
    ];

    private const BUDGETS = [
        'budget_friendly' => ['min' => 50, 'max' => 150],
        'mid_range' => ['min' => 150, 'max' => 350],
        'premium' => ['min' => 350, 'max' => 600],
        'luxury' => ['min' => 600, 'max' => null],
    ];

    public function show(Request $request): Response
    {
        return Inertia::render('Questionnaire', [
            'savedPreferences' => $request->user()->questionnairePreference,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'scent_characters' => ['required', 'array', 'min:1', 'max:3'],
            'scent_characters.*' => ['string', Rule::in(array_keys(self::SCENT_CHARACTERS))],
            'preferred_notes' => ['present', 'array', 'max:5'],
            'preferred_notes.*' => ['string', Rule::in(array_keys(self::NOTES))],
            'occasions' => ['required', 'array', 'min:1', 'max:3'],
            'occasions.*' => ['string', Rule::in(array_keys(self::OCCASIONS))],
            'desired_feelings' => ['required', 'array', 'min:1', 'max:3'],
            'desired_feelings.*' => ['string', Rule::in(array_keys(self::FEELINGS))],
            'budget_key' => ['required', 'string', Rule::in(array_keys(self::BUDGETS))],
            'marketed_gender' => ['nullable', 'string', Rule::in(['men', 'women', 'unisex'])],
        ]);

        $budget = self::BUDGETS[$validated['budget_key']];
        $semanticProfile = $this->buildSemanticProfile($validated);

        $request->user()->questionnairePreference()->updateOrCreate(
            ['user_id' => $request->user()->id],
            [
                ...$validated,
                'budget_min' => $budget['min'],
                'budget_max' => $budget['max'],
                'semantic_profile' => $semanticProfile,
            ]
        );

        $request->user()->forceFill(['has_completed_questionnaire' => true])->save();

        return to_route('recommendations.index')->with('success', 'Your fragrance preferences have been saved.');
    }

    private function buildSemanticProfile(array $answers): string
    {
        $scents = $this->labelsFor($answers['scent_characters'], self::SCENT_CHARACTERS);
        $occasions = $this->labelsFor($answers['occasions'], self::OCCASIONS);
        $feelings = $this->labelsFor($answers['desired_feelings'], self::FEELINGS);

        $profile = "The user prefers a {$scents} fragrance";

        if ($answers['preferred_notes'] !== []) {
            $notes = $this->labelsFor($answers['preferred_notes'], self::NOTES);
            $profile .= " featuring {$notes}";
        }

        return $profile.". They want something {$feelings} for {$occasions}.";
    }

    private function labelsFor(array $keys, array $labels): string
    {
        $values = array_map(fn (string $key) => $labels[$key], $keys);

        if (count($values) === 1) {
            return $values[0];
        }

        $last = array_pop($values);

        return implode(', ', $values).' and '.$last;
    }
}
