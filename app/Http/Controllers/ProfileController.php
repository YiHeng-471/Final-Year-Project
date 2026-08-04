<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = auth()->user();

        $orders = [];
        if ($user) {
            $orders = $user->orders()->with('orderItems.perfumeItem')->get();
        }

        return \Inertia\Inertia::render('ProfilePage', [
            'auth' => ['user' => $user],
            'orders' => $orders,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required'
        ]);

        $user = User::find(Auth::id());

        $user->update([
            'name' => $validated['name']
        ]);

        return redirect()->back()->with('success', 'Successfully updated name');
    }

    public function addAddress(Request $request)
    {
        $validated = $request->validate([
            'street_address' => 'required',
            'postcode' => 'required|digits:5',
            'state_id' => 'required|exists:states,id'
        ]);

        Address::create([
            'street_address' => $validated['street_address'],
            'postcode' => $validated['postcode'],
            'state_id' => $validated['state_id'],
            'user_id' => Auth::id()
        ]);

        return redirect()->back()->with('success', 'Successfully added new address');
    }

    public function updateAddress(Request $request)
    {
        $validated = $request->validate([
            'edit_address_id' => 'required|exists:addresses,id',
            'edit_street_address' => 'required',
            'edit_postcode' => 'required|digits:5',
            'edit_state_id' => 'required|exists:states,id'
        ]);


        $address = Address::find($validated['edit_address_id']);


        if (!$address) {
            return redirect()->back()->with('error', 'Address not found');
        }

        $address->update([
            'street_address' => $validated['edit_street_address'],
            'postcode' => $validated['edit_postcode'],
            'state_id' => $validated['edit_state_id']
        ]);

        return redirect()->back()->with('success', 'Successfully updated address');
    }

    public function deleteAddress(Address $address)
    {
        if (!$address) {
            return redirect()->back()->with('error', 'Address not found');
        }

        $addressCount = Address::where('user_id', Auth::id())->count();

        if ($addressCount <= 1) {
            return redirect()->back()->with('error', 'You must have at least 1 address');
        }

        $address->delete();

        return redirect()->back()->with('success', 'Address deleted successfully');
    }
}
