<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PerfumeCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name'
    ];

    public function perfumeItems(): HasMany
    {
        return $this->hasMany(PerfumeItem::class);
    }
}
