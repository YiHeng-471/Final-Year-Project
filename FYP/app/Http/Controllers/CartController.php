<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $cartItems = $this->cartItems();

        if ($request->wantsJson()) {
            return response()->json($cartItems, 200);
        }

        return Inertia::render('CartPage', [
            'cart' => $cartItems,
        ]);
    }

    public function create(Request $request)
    {
        $validated = $request->validate([
            'size_id' => [
                'required',
                Rule::exists('perfume_item_sizes', 'size_id')
                    ->where('perfume_item_id', $request->integer('perfume_item_id')),
            ],
            'perfume_item_id' => 'required|exists:perfume_items,id',
            'quantity' => 'required|integer|min:1',
        ]);

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

        $this->ensureOwnedByCurrentUser($cartItem);

        $cartItem->quantity = $validated['quantity'];
        $cartItem->save();

        return redirect()->back()->with('success', 'Cart item updated successfully.');
    }

    public function delete(CartItem $cartItem)
    {
        $this->ensureOwnedByCurrentUser($cartItem);

        $cartItem->delete();

        return redirect()->back()->with('success', 'Cart item deleted successfully.');
    }

    public function checkout(Request $request)
    {
        return Inertia::render('CheckoutPage', [
            'cart' => $this->cartItems(),
        ]);
    }

    private function cartItems()
    {
        $cart = Cart::query()
            ->with([
                'cartItems.perfumeItem:id,name,image_url',
                'cartItems.size:id,name',
            ])
            ->where('user_id', Auth::id())
            ->first();

        if (! $cart) {
            return collect();
        }

        $prices = DB::table('perfume_item_sizes')
            ->whereIn('perfume_item_id', $cart->cartItems->pluck('perfume_item_id'))
            ->whereIn('size_id', $cart->cartItems->pluck('size_id'))
            ->get()
            ->keyBy(fn ($row) => $row->perfume_item_id.'-'.$row->size_id);

        return $cart->cartItems->map(fn (CartItem $item) => [
            'id' => $item->id,
            'perfume_item_id' => $item->perfume_item_id,
            'size_id' => $item->size_id,
            'quantity' => $item->quantity,
            'name' => $item->perfumeItem?->name,
            'image_url' => $item->perfumeItem?->image_url,
            'size' => $item->size?->name,
            'price' => (float) ($prices->get($item->perfume_item_id.'-'.$item->size_id)?->price ?? 0),
        ]);
    }

    private function ensureOwnedByCurrentUser(CartItem $cartItem): void
    {
        abort_unless($cartItem->cart()->where('user_id', Auth::id())->exists(), 403);
    }
}
