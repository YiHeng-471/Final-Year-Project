<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PerfumeItemSize extends Model
{
    use HasFactory;

    protected $fillable = [
        'perfume_item_id',
        'size_id'
    ];

    public function perfumeItem(): BelongsTo
    {
        return $this->belongsTo(PerfumeItem::class);
    }

    public function size(): BelongsTo
    {
        return $this->belongsTo(Size::class);
    }
}