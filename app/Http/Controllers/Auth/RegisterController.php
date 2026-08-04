<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\State;
use App\Models\Address;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class RegisterController extends Controller
{
    public function index()
    {
        $states = State::all();
        return view('auth.register', compact('states'));
    }

    public function create(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'street_address' => 'required',
            'postcode' => 'required|digits:5',
            'state_id' => 'required|exists:states,id',
        ]);

        // Create the user
        $newUser = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
        ]);

        Address::create([
            'user_id' => $newUser->id,
            'street_address' => $validatedData['street_address'],
            'postcode' => $validatedData['postcode'],
            'state_id' => $validatedData['state_id'],
        ]);

        Auth::login($newUser);

        return redirect('/auth/dashboard');
    }
}
