<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Cart;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191);
        // Share auth and cart data with all Inertia responses
        Inertia::share([
            'auth' => function () {
                return [
                    'user' => Auth::user(),
                ];
            },
            'cart' => function () {
                if (!Auth::check()) {
                    return null;
                }

                $cart = Cart::with(['cartItems.perfumeItem.sizes', 'cartItems.size'])
                    ->where('user_id', Auth::id())
                    ->first();

                if (!$cart) return [];

                return $cart->cartItems->map(function ($ci) {
                    $perfume = $ci->perfumeItem;
                    $size = $ci->size;

                    $price = null;
                    if ($perfume && $perfume->sizes) {
                        $matched = $perfume->sizes->firstWhere('id', $ci->size_id);
                        $price = $matched ? $matched->pivot->price : null;
                    }

                    return [
                        'id' => $ci->id,
                        'perfume_item_id' => $ci->perfume_item_id,
                        'size_id' => $ci->size_id,
                        'quantity' => $ci->quantity,
                        'name' => $perfume->name ?? null,
                        'image_url' => $perfume->image_url ?? null,
                        'size' => $size->name ?? null,
                        'price' => $price ?? 0,
                    ];
                })->toArray();
            },
        ]);
    }
}
