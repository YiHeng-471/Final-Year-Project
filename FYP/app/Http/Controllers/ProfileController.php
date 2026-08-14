<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        return Inertia::render('ProfilePage', [
            'preference' => $user->questionnairePreference,
            'orders' => $user->orders()
                ->with([
                    'orderItems.perfumeItem:id,name,image_url',
                    'orderItems.size:id,name',
                ])
                ->latest()
                ->paginate(10),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
        ]);

        $user = User::findOrFail(Auth::id());

        $user->update([
            'name' => $validated['name'],
        ]);

        return redirect()->back()->with('success', 'Successfully updated name');
    }

    public function addAddress(Request $request)
    {
        $validated = $request->validate([
            'street_address' => 'required',
            'postcode' => 'required|digits:5',
            'state_id' => 'required|exists:states,id',
        ]);

        Address::create([
            'street_address' => $validated['street_address'],
            'postcode' => $validated['postcode'],
            'state_id' => $validated['state_id'],
            'user_id' => Auth::id(),
        ]);

        return redirect()->back()->with('success', 'Successfully added new address');
    }

    public function updateAddress(Request $request)
    {
        $validated = $request->validate([
            'edit_address_id' => 'required|exists:addresses,id',
            'edit_street_address' => 'required',
            'edit_postcode' => 'required|digits:5',
            'edit_state_id' => 'required|exists:states,id',
        ]);

        $address = Address::where('user_id', Auth::id())
            ->findOrFail($validated['edit_address_id']);

        $address->update([
            'street_address' => $validated['edit_street_address'],
            'postcode' => $validated['edit_postcode'],
            'state_id' => $validated['edit_state_id'],
        ]);

        return redirect()->back()->with('success', 'Successfully updated address');
    }

    public function deleteAddress(Address $address)
    {
        abort_unless($address->user_id === Auth::id(), 403);

        $addressCount = Address::where('user_id', Auth::id())->count();

        if ($addressCount <= 1) {
            return redirect()->back()->with('error', 'You must have at least 1 address');
        }

        $address->delete();

        return redirect()->back()->with('success', 'Address deleted successfully');
    }
}
