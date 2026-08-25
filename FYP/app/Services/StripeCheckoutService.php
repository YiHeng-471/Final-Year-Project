<?php

namespace App\Services;

use App\Models\Order;
use Stripe\Checkout\Session;
use Stripe\Event;
use Stripe\StripeClient;
use Stripe\Webhook;

class StripeCheckoutService
{
    public function __construct(private readonly StripeClient $stripe) {}

    public function createSession(Order $order): Session
    {
        $currency = strtolower((string) config('services.stripe.currency', 'myr'));
        $lineItems = $order->orderItems->map(fn ($item) => [
            'quantity' => $item->quantity,
            'price_data' => [
                'currency' => $currency,
                'unit_amount' => (int) round((float) $item->unit_price * 100),
                'product_data' => [
                    'name' => $item->product_name.' ('.$item->size_name.')',
                ],
            ],
        ])->values()->all();

        if ((float) $order->shipping_amount > 0) {
            $lineItems[] = [
                'quantity' => 1,
                'price_data' => [
                    'currency' => $currency,
                    'unit_amount' => (int) round((float) $order->shipping_amount * 100),
                    'product_data' => ['name' => 'Shipping'],
                ],
            ];
        }

        return $this->stripe->checkout->sessions->create([
            'mode' => 'payment',
            'customer_email' => $order->shipping_email,
            'line_items' => $lineItems,
            'success_url' => route('checkout.success').'?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('checkout.cancel', ['order_id' => $order->id]),
            'metadata' => [
                'order_id' => (string) $order->id,
                'user_id' => (string) $order->user_id,
            ],
        ], [
            'idempotency_key' => 'order-'.$order->id,
        ]);
    }

    public function constructWebhookEvent(string $payload, string $signature): Event
    {
        return Webhook::constructEvent(
            $payload,
            $signature,
            (string) config('services.stripe.webhook_secret'),
        );
    }
}
