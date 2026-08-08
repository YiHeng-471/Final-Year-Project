<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('questionnaire_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->json('scent_characters');
            $table->json('preferred_notes');
            $table->json('occasions');
            $table->json('desired_feelings');
            $table->string('budget_key');
            $table->unsignedInteger('budget_min');
            $table->unsignedInteger('budget_max')->nullable();
            $table->string('marketed_gender')->nullable();
            $table->text('semantic_profile');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('questionnaire_preferences');
    }
};
