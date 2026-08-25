<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Services\StripeCheckoutService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Throwable;

class OrderController extends Controller
{
    public function __construct(private readonly StripeCheckoutService $stripe) {}

    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'address' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:100'],
            'state' => ['required', 'string', 'max:100'],
            'postcode' => ['required', 'string', 'max:10'],
        ]);

        $cart = Cart::with(['cartItems.perfumeItem.sizes'])
            ->where('user_id', Auth::id())
            ->first();

        if (! $cart || $cart->cartItems->isEmpty()) {
            return redirect()->back()->with('error', 'Cart is empty.');
        }

        [$order, $payment] = DB::transaction(function () use ($cart, $validated): array {
            $snapshots = $cart->cartItems->map(function ($item): array {
                $size = $item->perfumeItem->sizes->firstWhere('id', $item->size_id);
                abort_unless($size, 422, 'A selected product size is no longer available.');

                return [
                    'perfume_item_id' => $item->perfume_item_id,
                    'size_id' => $item->size_id,
                    'quantity' => $item->quantity,
                    'unit_price' => (float) $size->pivot->price,
                    'product_name' => $item->perfumeItem->name,
                    'size_name' => $size->name,
                    'source_cart_item_id' => $item->id,
                ];
            });

            $subtotal = $snapshots->sum(fn (array $item): float => $item['unit_price'] * $item['quantity']);
            $shipping = $subtotal >= 300 ? 0 : 15;

            $order = Order::create([
                'user_id' => Auth::id(),
                'order_type' => 'online',
                'order_status' => 'pending_payment',
                'subtotal' => $subtotal,
                'shipping_amount' => $shipping,
                'total_amount' => $subtotal + $shipping,
                'shipping_name' => $validated['full_name'],
                'shipping_email' => $validated['email'],
                'shipping_phone' => $validated['phone'],
                'shipping_address' => $validated['address'],
                'shipping_city' => $validated['city'],
                'shipping_state' => $validated['state'],
                'shipping_postcode' => $validated['postcode'],
            ]);

            $now = now();
            OrderItem::insert($snapshots->map(fn (array $item) => [
                ...$item,
                'order_id' => $order->id,
                'created_at' => $now,
                'updated_at' => $now,
            ])->all());

            $payment = Payment::create([
                'order_id' => $order->id,
                'user_id' => Auth::id(),
                'amount' => $order->total_amount,
                'payment_status' => 'pending',
                'payment_method' => 'stripe',
            ]);

            return [$order->load('orderItems'), $payment];
        });

        try {
            $session = $this->stripe->createSession($order);
            $payment->update(['stripe_checkout_session_id' => $session->id]);

            return Inertia::location($session->url);
        } catch (Throwable $exception) {
            report($exception);
            $payment->update([
                'payment_status' => 'failed',
                'failure_message' => 'Stripe Checkout could not be started.',
            ]);
            $order->update(['order_status' => 'payment_failed']);

            return redirect()->back()->with('error', 'Payment could not be started. Please try again.');
        }
    }

    public function success(Request $request)
    {
        $payment = Payment::query()
            ->with('order')
            ->where('user_id', $request->user()->id)
            ->where('stripe_checkout_session_id', $request->string('session_id'))
            ->firstOrFail();

        return Inertia::render('CheckoutResult', [
            'result' => 'success',
            'orderId' => $payment->order_id,
            'paymentStatus' => $payment->payment_status,
        ]);
    }

    public function cancel(Request $request)
    {
        $payment = Payment::query()
            ->where('user_id', $request->user()->id)
            ->where('order_id', $request->integer('order_id'))
            ->firstOrFail();

        return Inertia::render('CheckoutResult', [
            'result' => 'cancelled',
            'orderId' => $payment->order_id,
            'paymentStatus' => $payment->payment_status,
        ]);
    }
}
