<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class PerfumeItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'perfume_category_id',
        'name',
        'description',
        'image_url',
        'price',
        'availability_status'
    ];

    public function perfumeCategory(): BelongsTo
    {
        return $this->belongsTo(PerfumeCategory::class);
    }

    public function sizes(): BelongsToMany
    {
        return $this->belongsToMany(Size::class, 'perfume_item_sizes')
                    ->withPivot('price')
                    ->withTimestamps();
    }

    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function perfumeReviews(): HasMany
    {
        return $this->hasMany(PerfumeReview::class);
    }
}
