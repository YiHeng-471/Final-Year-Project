<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class VerificationController extends Controller
{
    public function show(Request $request)
    {
        $email = session('email') ?? $request->query('email');

        if (! $email) {
            return redirect()->route('login')->withErrors([
                'email' => 'Please sign in or sign up to verify your account.',
            ]);
        }

        return Inertia::render('VerifyEmail', [
            'email' => $email,
        ]);
    }

    public function verify(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'code' => 'required|digits:6',
        ]);

        $cached = Cache::get('email_verification:'.$validated['email']);

        if (! $cached || (string) $cached !== (string) $validated['code']) {
            return redirect()->back()->withErrors([
                'code' => 'Invalid or expired verification code.',
            ]);
        }

        $user = User::where('email', $validated['email'])->first();

        if ($user) {
            $user->email_verified_at = now();
            $user->save();

            Auth::login($user);
            $request->session()->regenerate();

            Cache::forget('email_verification:'.$validated['email']);

            return redirect()->route('home')->with('success', 'Email verified successfully!');
        }

        return redirect()->back()->withErrors([
            'email' => 'Account matching this verification session could not be found.',
        ]);
    }

    public function sendVerificationCode(Request $request)
    {
        $validated = $request->validate(['email' => 'required|email']);

        $user = User::where('email', $validated['email'])->first();

        if (! $user) {
            return redirect()->back()->withErrors(['email' => 'User account not found.']);
        }

        if (! $user->sendEmailVerificationCode()) {
            return redirect()->back()->withErrors(['email' => 'Failed to send mail. Try again.']);
        }

        return redirect()->route('verification.show')->with('email', $user->email)->with('success', 'Code resent!');
    }
}
