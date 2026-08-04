<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\User;

class VerificationController extends Controller
{
    public function show(Request $request)
    {
        $email = $request->query('email');
        return Inertia::render('VerifyEmail', ['email' => $email]);
    }

    public function verify(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'code' => 'required|digits:6',
        ]);

        $cached = Cache::get('email_verification:'.$validated['email']);
        if (!$cached || $cached != $validated['code']) {
            return redirect()->back()->with('error', 'Invalid or expired verification code');
        }

        $user = User::where('email', $validated['email'])->first();
        if ($user) {
            $user->email_verified_at = now();
            $user->save();
            // auto login
            Auth::login($user);
            Cache::forget('email_verification:'.$validated['email']);
            return redirect()->route('home')->with('success', 'Email verified');
        }

        return redirect()->back()->with('error', 'User not found');
    }
}
