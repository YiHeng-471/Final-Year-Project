<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use App\Models\User;
use App\Mail\VerificationCodeMail;

class RegistrationController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // generate verification code
        $code = rand(100000, 999999);
        Cache::put('email_verification:'.$user->email, $code, now()->addMinutes(15));

        // send email
        try {
            Mail::to($user->email)->send(new VerificationCodeMail($code));
        } catch (\Exception $e) {
            // ignore mail failures for now
        }

        return redirect()->route('verify.email', ['email' => $user->email]);
    }

    public function resend(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return redirect()->back()->with('error', 'User not found');
        }

        $code = rand(100000, 999999);
        Cache::put('email_verification:'.$user->email, $code, now()->addMinutes(15));

        try {
            Mail::to($user->email)->send(new VerificationCodeMail($code));
        } catch (\Exception $e) {
        }

        return redirect()->back()->with('success', 'Verification code resent');
    }
}
