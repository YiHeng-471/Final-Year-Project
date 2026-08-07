<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\State;
use App\Models\Address;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Http\Request;

class RegisterController extends Controller
{
    public function index()
    {
        $states = State::all();
        return Inertia::render('RegisterPage', ['states' => $states]);
    }

    public function create(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'password_confirmation' => 'required'
        ]);

        // Create the user (do not auto-login)
        $newUser = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
        ]);

        // Optionally create address if provided
        if ($request->filled('street_address') && $request->filled('postcode') && $request->filled('state_id')) {
            Address::create([
                'user_id' => $newUser->id,
                'street_address' => $request->input('street_address'),
                'postcode' => $request->input('postcode'),
                'state_id' => $request->input('state_id'),
            ]);
        }

        // Send verification code via User helper
        $newUser->sendEmailVerificationCode();

        // store email in session so verification page prefills
        session(['email' => $newUser->email]);

        return redirect()->route('verification.show');
    }
}
