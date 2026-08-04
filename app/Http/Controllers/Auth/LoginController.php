<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    public function index()
    {
        return view('auth.login');
    }

    public function check(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|exists:users,email',
            'password' => 'required|min:8',
        ]);

        $user = User::where('email', $validated['email'])->first();
        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return back()->withErrors(['email' => 'Incorrect email or password.'])->onlyInput('email');
        }

        if (!$user->email_verified_at) {
            return redirect()->route('verify.email', ['email' => $user->email]);
        }

        Auth::login($user, $request->boolean('remember'));
        $request->session()->regenerate();

        return redirect()->intended('/');
    }

    public function logout(Request $request)
    {
        // logout the user
        Auth::logout();

        // remove existing session data and create new one
        $request->session()->invalidate();

        // regenerate the CSRF token
        $request->session()->regenerateToken();

        return redirect('/auth/login');
    }
}
