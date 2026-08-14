<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'payment_method' => 'required|string',
            'address_id' => 'nullable|integer',
        ]);

        $cart = Cart::with(['cartItems.perfumeItem.sizes'])
            ->where('user_id', Auth::id())
            ->first();

        if (! $cart || $cart->cartItems->isEmpty()) {
            return redirect()->back()->with('error', 'Cart is empty');
        }

        DB::transaction(function () use ($cart, $request): void {
            $total = $cart->cartItems->sum(function ($item): float {
                $size = $item->perfumeItem->sizes->firstWhere('id', $item->size_id);

                abort_unless($size, 422, 'A selected product size is no longer available.');

                return (float) $size->pivot->price * $item->quantity;
            });

            $order = Order::create([
                'user_id' => Auth::id(),
                'order_type' => 'online',
                'order_status' => 'processing',
                'subtotal' => $total,
                'total_amount' => $total,
            ]);

            $now = now();
            OrderItem::insert($cart->cartItems->map(fn ($item) => [
                'order_id' => $order->id,
                'perfume_item_id' => $item->perfume_item_id,
                'size_id' => $item->size_id,
                'quantity' => $item->quantity,
                'created_at' => $now,
                'updated_at' => $now,
            ])->all());

            // This remains a simulated payment until a payment gateway is integrated.
            Payment::create([
                'order_id' => $order->id,
                'user_id' => Auth::id(),
                'amount' => $order->total_amount,
                'payment_status' => 'paid',
                'payment_method' => $request->payment_method,
            ]);

            $cart->cartItems()->delete();
        });

        return redirect()->route('checkout.success')->with('success', 'Order placed successfully');
    }

    public function success()
    {
        return Inertia::render('CheckoutPage', [
            'success' => true,
        ]);
    }
}
