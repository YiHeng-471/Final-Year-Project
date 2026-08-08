<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuestionnairePreference extends Model
{
    protected $fillable = [
        'scent_characters',
        'preferred_notes',
        'occasions',
        'desired_feelings',
        'budget_key',
        'budget_min',
        'budget_max',
        'marketed_gender',
        'semantic_profile',
    ];

    protected $casts = [
        'scent_characters' => 'array',
        'preferred_notes' => 'array',
        'occasions' => 'array',
        'desired_feelings' => 'array',
        'budget_min' => 'integer',
        'budget_max' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
