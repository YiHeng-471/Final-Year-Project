<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Cart;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'payment_method' => 'required|string',
            'address_id' => 'nullable|integer'
        ]);

        $cart = Cart::with(['cartItems'])->where('user_id', Auth::id())->first();

        if (!$cart || $cart->cartItems->isEmpty()) {
            return redirect()->back()->with('error', 'Cart is empty');
        }

        $subtotal = 0;
        foreach ($cart->cartItems as $ci) {
            // price resolved via AppServiceProvider shared cart; approximate by qty*1 for now
            $subtotal += 0; // will compute below via order items
        }

        $order = Order::create([
            'user_id' => Auth::id(),
            'order_type' => 'online',
            'order_status' => 'processing',
            'subtotal' => 0,
            'total_amount' => 0,
        ]);

        $total = 0;

        foreach ($cart->cartItems as $ci) {
            // get current price from perfume_item_sizes pivot
            $perfume = $ci->perfumeItem()->with('sizes')->first();
            $matched = $perfume->sizes->firstWhere('id', $ci->size_id);
            $price = $matched ? $matched->pivot->price : 0;

            OrderItem::create([
                'order_id' => $order->id,
                'perfume_item_id' => $ci->perfume_item_id,
                'size_id' => $ci->size_id,
                'quantity' => $ci->quantity,
            ]);

            $total += $price * $ci->quantity;
        }

        $order->subtotal = $total;
        $order->total_amount = $total; // no shipping/discounts for now
        $order->save();

        // create a payment stub
        $payment = Payment::create([
            'order_id' => $order->id,
            'user_id' => Auth::id(),
            'amount' => $order->total_amount,
            'status' => 'paid',
            'method' => $request->payment_method,
        ]);

        // clear cart
        foreach ($cart->cartItems as $ci) {
            $ci->delete();
        }

        return redirect()->route('checkout.success')->with('success', 'Order placed successfully');
    }

    public function success()
    {
        return Inertia::render('CheckoutPage', [
            'success' => true,
        ]);
    }
}

