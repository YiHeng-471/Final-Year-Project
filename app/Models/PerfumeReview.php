<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PerfumeReview extends Model
{
    use HasFactory;

    protected $fillable = [
        'content'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function perfumeItem(): BelongsTo
    {
        return $this->belongsTo(PerfumeItem::class);
    }
}
