<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Size;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $cart = Cart::with(['cartItems.perfumeItem', 'cartItems.size'])
            ->where('user_id', Auth::id())
            ->first();

        $cartItems = $cart ? $cart->cartItems : collect([]);

        if ($request->wantsJson()) {
            return response()->json($cartItems, 200);
        }

        return Inertia::render('CartPage', [
            'auth' => ['user' => Auth::user()],
            'cart' => $cartItems,
        ]);
    }

    public function create(Request $request)
    {
        $validated =$request->validate([
            'size_id' => 'required|exists:sizes,id',
            'perfume_item_id' => 'required|exists:perfume_items,id',
            'quantity' => 'required|integer|min:1',
        ]);

        // Get the perfume item size
        $perfumeItemSize = Size::find($validated['size_id']);

        // Find or create a cart for user
        $cart = Cart::firstOrCreate(['user_id' => Auth::id()]);

        // Try to find an existing cart item
        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('perfume_item_id', $validated['perfume_item_id'])
            ->where('size_id', $validated['size_id'])
            ->first();

        if ($cartItem) {
            $cartItem->quantity = $cartItem->quantity + $validated['quantity'];
            $cartItem->save();
        } else {
            $cartItem = CartItem::create([
                'cart_id' => $cart->id,
                'perfume_item_id' => $validated['perfume_item_id'],
                'size_id' => $validated['size_id'],
                'quantity' => $validated['quantity'],
            ]);
        }

        return redirect()->back()->with('success', 'Successfully added to cart.');
    }

    public function update(Request $request, CartItem $cartItem)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1|max:99',
        ]);

        if (!$cartItem) {
            return response()->json([
                'success' => false,
                'message' => 'Cart item not found.',
            ], 404);
        }

        $cartItem->quantity = $validated['quantity'];
        $cartItem->save();

        return response()->json([
            'success' => true,
            'message' => 'Cart item updated successfully.',
        ]);
    }

    public function delete(CartItem $cartItem)
    {
        if (!$cartItem) {
            session()->flash('error', 'Cart item not found.');

            return response()->json([
                'success' => false,
                'message' => 'Cart item not found.',
            ], 404);
        }

        $cartItem->delete();

        session()->flash('success', 'Cart item deleted successfully.');
        return response()->json([
            'success' => true,
            'message' => 'Cart item deleted successfully.',
        ]);
    }

    public function checkout(Request $request)
    {
        // Display checkout page with current user cart
        $cart = Cart::with(['cartItems.perfumeItem', 'cartItems.size'])
            ->where('user_id', Auth::id())
            ->first();

        $cartItems = $cart ? $cart->cartItems : collect([]);

        return Inertia::render('CheckoutPage', [
            'auth' => ['user' => Auth::user()],
            'cart' => $cartItems,
        ]);
    }
}
