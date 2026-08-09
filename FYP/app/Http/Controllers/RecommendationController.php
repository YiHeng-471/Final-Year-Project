<?php

namespace App\Http\Controllers;

use App\Models\PerfumeItem;
use App\Services\RecommendationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;

class RecommendationController extends Controller
{
    public function __construct(private readonly RecommendationService $recommendations)
    {
    }

    public function index(Request $request): Response|\Illuminate\Http\RedirectResponse
    {
        $preferences = $request->user()->questionnairePreference;

        if (! $preferences) {
            return to_route('questionnaire.show')
                ->with('error', 'Complete your scent profile before requesting recommendations.');
        }

        $candidateQuery = PerfumeItem::query()
            ->whereNotNull('dataset_id')
            ->where('availability_status', true)
            ->whereHas('sizes', function ($query) use ($preferences): void {
                $query->where('perfume_item_sizes.price', '>=', $preferences->budget_min);

                if ($preferences->budget_max !== null) {
                    $query->where('perfume_item_sizes.price', '<=', $preferences->budget_max);
                }
            });

        $candidateDatasetIds = $candidateQuery->pluck('dataset_id')->map(fn ($id) => (int) $id)->all();

        if ($candidateDatasetIds === []) {
            return Inertia::render('Recommendations', [
                'preferences' => $preferences,
                'recommendations' => [],
                'candidateCount' => 0,
                'serviceUnavailable' => false,
            ]);
        }

        try {
            $ranked = $this->recommendations->recommend($preferences, $candidateDatasetIds);
        } catch (RuntimeException $exception) {
            Log::warning('Recommendation request failed.', ['message' => $exception->getMessage()]);

            return Inertia::render('Recommendations', [
                'preferences' => $preferences,
                'recommendations' => [],
                'candidateCount' => count($candidateDatasetIds),
                'serviceUnavailable' => true,
            ]);
        }

        $ranking = collect($ranked)->keyBy('dataset_id');
        $products = PerfumeItem::query()
            ->with(['sizes', 'perfumeReviews'])
            ->whereIn('dataset_id', $ranking->keys())
            ->get()
            ->sortBy(fn (PerfumeItem $item) => array_search($item->dataset_id, $ranking->keys()->all(), true))
            ->values()
            ->map(function (PerfumeItem $item) use ($ranking, $preferences): array {
                $recommendation = $ranking->get($item->dataset_id);
                $eligibleSizes = $item->sizes->filter(function ($size) use ($preferences): bool {
                    $price = (float) $size->pivot->price;

                    return $price >= $preferences->budget_min
                        && ($preferences->budget_max === null || $price <= $preferences->budget_max);
                });

                return [
                    'id' => $item->id,
                    'dataset_id' => $item->dataset_id,
                    'name' => $item->name,
                    'brand' => $item->brand,
                    'description' => $item->description,
                    'scent_notes' => $item->scent_notes,
                    'image_url' => $item->image_url,
                    'min_price' => (float) $eligibleSizes->min(fn ($size) => $size->pivot->price),
                    'sizes' => $eligibleSizes->map(fn ($size) => [
                        'id' => $size->id,
                        'name' => $size->name,
                        'price' => (float) $size->pivot->price,
                    ])->values(),
                    'average_rating' => round((float) $item->perfumeReviews->avg('rating'), 1),
                    'review_count' => $item->perfumeReviews->count(),
                    'score' => $recommendation['score'],
                    'semantic_score' => $recommendation['semantic_score'],
                    'note_score' => $recommendation['note_score'],
                    'matched_notes' => $recommendation['matched_notes'] ?? [],
                    'explanation' => $recommendation['explanation'],
                ];
            });

        return Inertia::render('Recommendations', [
            'preferences' => $preferences,
            'recommendations' => $products,
            'candidateCount' => count($candidateDatasetIds),
            'serviceUnavailable' => false,
        ]);
    }
}
