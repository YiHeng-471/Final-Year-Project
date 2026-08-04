<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function index()
    {
        return view('auth.login');
    }

    public function check(Request $request)
    {
        $validatedCredentials = $request->validate([
            'email' => 'required|email|exists:users,email',
            'password' => 'required|min:8',
        ]);

        if (Auth::attempt($validatedCredentials)) {
            $request->session()->regenerate();
            return redirect('/menu');
        }
        // does not match
        return back()->withErrors(['invalid' => 'Incorrect email or password.']);
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
