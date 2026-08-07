<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Size extends Model
{
    use HasFactory;

    protected $fillable = [
        'name'
    ];

    public function perfumeItems(): BelongsToMany
    {
        return $this->belongsToMany(PerfumeItem::class, 'perfume_item_sizes')
                    ->withPivot('price')
                    ->withTimestamps();
    }

    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }
}