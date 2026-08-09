<?php

namespace Tests\Feature;

use App\Models\PerfumeCategory;
use App\Models\PerfumeItem;
use App\Models\QuestionnairePreference;
use App\Models\Size;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class RecommendationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_without_preferences_is_sent_to_questionnaire(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/recommendations')
            ->assertRedirect(route('questionnaire.show'));
    }

    public function test_only_available_budget_eligible_products_are_sent_for_ranking(): void
    {
        Http::fake([
            '*/recommend' => Http::response([
                'results' => [[
                    'dataset_id' => 7,
                    'score' => 0.91,
                    'semantic_score' => 0.89,
                    'note_score' => 1.0,
                    'explanation' => 'Matches bergamot.',
                ]],
            ]),
        ]);

        $user = User::factory()->create();
        QuestionnairePreference::create([
            'user_id' => $user->id,
            'scent_characters' => ['fresh'],
            'preferred_notes' => ['bergamot'],
            'occasions' => ['everyday'],
            'desired_feelings' => ['clean_refreshing'],
            'budget_key' => 'mid_range',
            'budget_min' => 150,
            'budget_max' => 350,
            'semantic_profile' => 'The user prefers a fresh fragrance featuring bergamot for everyday wear.',
        ]);

        $category = PerfumeCategory::create(['name' => 'Uncategorised']);
        $size = Size::create(['name' => '30ml']);
        $eligible = $this->product($category, 7, true);
        $tooExpensive = $this->product($category, 8, true);
        $unavailable = $this->product($category, 9, false);
        $eligible->sizes()->attach($size, ['price' => 220]);
        $tooExpensive->sizes()->attach($size, ['price' => 500]);
        $unavailable->sizes()->attach($size, ['price' => 200]);

        $this->actingAs($user)
            ->get('/recommendations')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Recommendations')
                ->where('candidateCount', 1)
                ->has('recommendations', 1)
                ->where('recommendations.0.dataset_id', 7)
                ->where('recommendations.0.matched_notes', [])
            );

        Http::assertSent(function ($request): bool {
            $payload = $request->data();

            return str_ends_with($request->url(), '/recommend')
                && ($payload['candidate_dataset_ids'] ?? null) === [7]
                && ($payload['preferred_notes'] ?? null) === ['bergamot'];
        });
    }

    private function product(PerfumeCategory $category, int $datasetId, bool $available): PerfumeItem
    {
        return PerfumeItem::create([
            'dataset_id' => $datasetId,
            'category_id' => $category->id,
            'brand' => 'Test Brand',
            'name' => "Perfume {$datasetId}",
            'description' => 'A test perfume description.',
            'scent_notes' => 'Bergamot, musk',
            'image_url' => '',
            'availability_status' => $available,
        ]);
    }
}
