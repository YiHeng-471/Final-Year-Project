<?php

use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\QuestionnaireController;
use App\Http\Controllers\RecommendationController;
use App\Http\Controllers\VerificationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
// HomePage
Route::get('/', function () {
    return Inertia::render('HomePage');
})->name('home');

// Products
Route::get('/products', [ProductController::class, 'index'])->name('products');
Route::get('/product/{id}', [ProductController::class, 'show'])->name('product.detail');

// Educational Guides
Route::get('/guide/scent-types', fn () => Inertia::render('ScentTypesGuide'))->name('guide.scent-types');
Route::get('/guide/fragrance-notes', fn () => Inertia::render('FragranceNotesGuide'))->name('guide.fragrance-notes');

/*
|--------------------------------------------------------------------------
| Authentication Routes for Guest
|--------------------------------------------------------------------------
*/
Route::middleware('guest')->prefix('auth')->group(function () {
    Route::prefix('login')->group(function () {
        Route::get('/', fn () => Inertia::render('LoginPage'))->name('login');
        Route::post('/', [LoginController::class, 'check'])->name('login.submit');
    });

    Route::prefix('register')->group(function () {
        Route::get('/', [RegisterController::class, 'index'])->name('register');
        Route::post('/', [RegisterController::class, 'create'])->name('register.submit');
    });

    Route::prefix('forgot-password')->group(function () {
        Route::get('/', [ForgotPasswordController::class, 'create'])->name('password.request');
        Route::post('/', [ForgotPasswordController::class, 'store'])->name('password.email');
    });

    Route::prefix('reset-password')->group(function () {
        Route::get('/{token}', [ResetPasswordController::class, 'create'])->name('password.reset');
        Route::post('/', [ResetPasswordController::class, 'store'])->name('password.update');
    });
});

/*
|--------------------------------------------------------------------------
| Email Verification Routes
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->group(function () {
    Route::get('/verify', [VerificationController::class, 'show'])->name('verification.show');
    Route::post('/verify', [VerificationController::class, 'verify'])->name('verification.verify');
    Route::post('/verify/resend', [VerificationController::class, 'sendVerificationCode'])->name('verification.resend');
});

/*
|--------------------------------------------------------------------------
| Protected Routes (Authentication Required)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->group(function () {
    // Logout
    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

    Route::controller(CartController::class)->group(function () {
        Route::get('/cart', 'index')->name('cart');
        Route::post('/cart', 'create')->name('cart.create');
        Route::patch('/cart/{cartItem}', 'update')->name('cart.update');
        Route::delete('/cart/{cartItem}', 'delete')->name('cart.delete');
    });

    // Checkout & Order Actions
    Route::get('/checkout', [CartController::class, 'checkout'])->name('checkout');
    Route::post('/checkout', [OrderController::class, 'store'])->name('checkout.store');
    Route::get('/checkout/success', [OrderController::class, 'success'])->name('checkout.success');

    // User Data
    Route::get('/profile', [ProfileController::class, 'index'])->name('profile');

    // Fragrance preference questionnaire
    Route::get('/questionnaire', [QuestionnaireController::class, 'show'])->name('questionnaire.show');
    Route::post('/questionnaire', [QuestionnaireController::class, 'store'])->name('questionnaire.store');
    Route::get('/recommendations', [RecommendationController::class, 'index'])->name('recommendations.index');
});
