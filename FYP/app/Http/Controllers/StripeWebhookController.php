<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Payment;
use App\Services\StripeCheckoutService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Stripe\Exception\SignatureVerificationException;
use UnexpectedValueException;

class StripeWebhookController extends Controller
{
    public function __construct(private readonly StripeCheckoutService $stripe) {}

    public function __invoke(Request $request)
    {
        try {
            $event = $this->stripe->constructWebhookEvent(
                $request->getContent(),
                (string) $request->header('Stripe-Signature'),
            );
        } catch (UnexpectedValueException|SignatureVerificationException) {
            return response()->json(['message' => 'Invalid Stripe webhook signature.'], 400);
        }

        $session = $event->data->object;

        if (in_array($event->type, ['checkout.session.completed', 'checkout.session.async_payment_succeeded'], true)
            && $session->payment_status === 'paid') {
            $this->markPaid($session);
        } elseif ($event->type === 'checkout.session.async_payment_failed') {
            $this->markFailed((string) $session->id, 'Stripe reported that the payment failed.');
        } elseif ($event->type === 'checkout.session.expired') {
            $this->markFailed((string) $session->id, 'The Stripe Checkout session expired.', 'expired');
        }

        return response()->json(['received' => true]);
    }

    private function markPaid(object $session): void
    {
        DB::transaction(function () use ($session): void {
            $payment = Payment::query()
                ->with('order.orderItems')
                ->where('stripe_checkout_session_id', (string) $session->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($payment->payment_status === 'paid') {
                return;
            }

            $expectedAmount = (int) round((float) $payment->amount * 100);
            $expectedCurrency = strtolower((string) config('services.stripe.currency', 'myr'));
            $metadataOrderId = (int) ($session->metadata->order_id ?? 0);

            abort_unless(
                (int) $session->amount_total === $expectedAmount
                && strtolower((string) $session->currency) === $expectedCurrency
                && $metadataOrderId === $payment->order_id,
                422,
                'Stripe payment details do not match the pending order.',
            );

            $payment->update([
                'payment_status' => 'paid',
                'stripe_payment_intent_id' => (string) $session->payment_intent,
                'failure_message' => null,
                'paid_at' => now(),
            ]);
            $payment->order->update(['order_status' => 'processing']);

            $sourceIds = $payment->order->orderItems->pluck('source_cart_item_id')->filter();
            CartItem::query()
                ->whereIn('id', $sourceIds)
                ->whereHas('cart', fn ($query) => $query->where('user_id', $payment->user_id))
                ->delete();
        });
    }

    private function markFailed(string $sessionId, string $message, string $status = 'failed'): void
    {
        DB::transaction(function () use ($sessionId, $message, $status): void {
            $payment = Payment::query()
                ->with('order')
                ->where('stripe_checkout_session_id', $sessionId)
                ->lockForUpdate()
                ->first();

            if (! $payment || $payment->payment_status === 'paid') {
                return;
            }

            $payment->update([
                'payment_status' => $status,
                'failure_message' => $message,
            ]);
            $payment->order->update(['order_status' => 'payment_'.$status]);
        });
    }
}
