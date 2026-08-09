<?php

namespace App\Services;

use App\Models\QuestionnairePreference;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class RecommendationService
{
    public function recommend(
        QuestionnairePreference $preferences,
        array $candidateDatasetIds,
        int $topK = 12
    ): array {
        try {
            $response = Http::acceptJson()
                ->timeout((int) config('services.recommendations.timeout', 30))
                ->post(rtrim(config('services.recommendations.url'), '/').'/recommend', [
                    'semantic_profile' => $preferences->semantic_profile,
                    'preferred_notes' => $preferences->preferred_notes,
                    'candidate_dataset_ids' => array_values($candidateDatasetIds),
                    'top_k' => $topK,
                ]);
        } catch (ConnectionException $exception) {
            throw new RuntimeException('The recommendation service is currently unavailable.', previous: $exception);
        }

        if ($response->failed()) {
            throw new RuntimeException('The recommendation service returned an invalid response.');
        }

        return $response->json('results', []);
    }
}
