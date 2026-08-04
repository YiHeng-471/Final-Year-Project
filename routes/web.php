<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\RecommendationController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\VerificationController;
use App\Http\Controllers\Auth\LoginController;

Route::get('/', [RecommendationController::class, 'index'])->name('home');
Route::get('/login', fn() => Inertia::render('LoginPage'))->name('login');
Route::post('/login', [LoginController::class, 'check'])->name('login.submit');
Route::get('/register', fn() => Inertia::render('RegisterPage'))->name('register');
Route::post('/register', [RegistrationController::class, 'store'])->name('register.submit');
Route::get('/verify', [VerificationController::class, 'show'])->name('verify.email');
Route::post('/verify', [VerificationController::class, 'verify'])->name('verify.submit');
Route::get('/questionnaire', fn() => Inertia::render('Questionnaire'))->name('questionnaire');
Route::post('/questionnaire', [RecommendationController::class, 'submitQuiz'])->name('questionnaire.submit');
Route::get('/products', [ProductController::class, 'index'])->name('products');
Route::get('/product/{id}', [ProductController::class, 'show'])->name('product.detail');
Route::get('/guide/scent-types', fn() => Inertia::render('ScentTypesGuide'))->name('guide.scent-types');
Route::get('/guide/fragrance-notes', fn() => Inertia::render('FragranceNotesGuide'))->name('guide.fragrance-notes');
Route::get('/cart', [CartController::class, 'index'])->name('cart');
Route::post('/cart', [CartController::class, 'create'])->name('cart.create');
Route::patch('/cart/{cartItem}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/{cartItem}', [CartController::class, 'delete'])->name('cart.delete');
Route::get('/checkout', [CartController::class, 'checkout'])->name('checkout');
Route::post('/checkout', [OrderController::class, 'store'])->name('checkout.store');
Route::get('/checkout/success', [OrderController::class, 'success'])->name('checkout.success');
Route::get('/profile', [App\Http\Controllers\ProfileController::class, 'index'])->name('profile');