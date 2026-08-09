<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuestionnaireTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_login(): void
    {
        $this->get('/questionnaire')->assertRedirect('/auth/login');
    }

    public function test_authenticated_user_can_view_questionnaire(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/questionnaire')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Questionnaire'));
    }

    public function test_authenticated_user_can_save_and_update_preferences(): void
    {
        $user = User::factory()->create();

        $answers = [
            'scent_characters' => ['fresh', 'citrus'],
            'preferred_notes' => ['bergamot', 'vetiver', 'musk'],
            'occasions' => ['everyday', 'work_office'],
            'desired_feelings' => ['clean_refreshing', 'elegant_sophisticated'],
            'budget_key' => 'mid_range',
            'marketed_gender' => null,
        ];

        $this->actingAs($user)
            ->post('/questionnaire', $answers)
            ->assertRedirect(route('recommendations.index'));

        $this->assertDatabaseHas('questionnaire_preferences', [
            'user_id' => $user->id,
            'budget_key' => 'mid_range',
            'budget_min' => 150,
            'budget_max' => 350,
            'marketed_gender' => null,
        ]);

        $this->assertStringContainsString(
            'fresh and citrus fragrance featuring bergamot, vetiver and musk',
            $user->questionnairePreference()->value('semantic_profile')
        );

        $this->assertTrue($user->fresh()->has_completed_questionnaire);

        $this->actingAs($user)->post('/questionnaire', [
            ...$answers,
            'budget_key' => 'premium',
            'marketed_gender' => 'unisex',
        ]);

        $this->assertDatabaseCount('questionnaire_preferences', 1);
        $this->assertDatabaseHas('questionnaire_preferences', [
            'user_id' => $user->id,
            'budget_key' => 'premium',
            'marketed_gender' => 'unisex',
        ]);
    }

    public function test_selection_limits_and_allowed_values_are_validated(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post('/questionnaire', [
            'scent_characters' => ['fresh', 'citrus', 'floral', 'woody'],
            'preferred_notes' => ['not-a-real-note'],
            'occasions' => [],
            'desired_feelings' => ['clean_refreshing'],
            'budget_key' => 'invalid-budget',
            'marketed_gender' => 'invalid-category',
        ])->assertSessionHasErrors([
            'scent_characters',
            'preferred_notes.0',
            'occasions',
            'budget_key',
            'marketed_gender',
        ]);

        $this->assertDatabaseCount('questionnaire_preferences', 0);
    }
}
