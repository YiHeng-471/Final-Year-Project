<?php

namespace Tests\Feature;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\PerfumeCategory;
use App\Models\PerfumeItem;
use App\Models\Size;
use App\Models\User;
use App\Services\StripeCheckoutService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery\MockInterface;
use Stripe\Checkout\Session;
use Stripe\Event;
use Tests\TestCase;

class StripeCheckoutTest extends TestCase
{
    use RefreshDatabase;

    public function test_checkout_uses_database_prices_and_creates_a_pending_stripe_payment(): void
    {
        [$user, $cartItem] = $this->cartFixture(120.50, 2);
        $session = Session::constructFrom([
            'id' => 'cs_test_checkout',
            'url' => 'https://checkout.stripe.com/c/pay/cs_test_checkout',
        ]);

        $this->mock(StripeCheckoutService::class, function (MockInterface $mock) use ($session): void {
            $mock->shouldReceive('createSession')
                ->once()
                ->withArgs(fn (Order $order) => (float) $order->subtotal === 241.0
                    && (float) $order->shipping_amount === 15.0
                    && (float) $order->total_amount === 256.0)
                ->andReturn($session);
        });

        $this->actingAs($user)
            ->withHeader('X-Inertia', 'true')
            ->post('/checkout', $this->shippingDetails())
            ->assertStatus(409)
            ->assertHeader('X-Inertia-Location', $session->url);

        $this->assertDatabaseHas('orders', [
            'user_id' => $user->id,
            'order_status' => 'pending_payment',
            'shipping_name' => 'Test Customer',
        ]);
        $this->assertDatabaseHas('order_items', [
            'source_cart_item_id' => $cartItem->id,
            'unit_price' => 120.50,
            'product_name' => 'Test Perfume',
            'size_name' => '50ml',
        ]);
        $this->assertDatabaseHas('payments', [
            'payment_status' => 'pending',
            'stripe_checkout_session_id' => 'cs_test_checkout',
        ]);
        $this->assertDatabaseHas('cart_items', ['id' => $cartItem->id]);
    }

    public function test_paid_webhook_is_idempotent_and_clears_only_the_ordered_cart_item(): void
    {
        [$user, $orderedCartItem] = $this->cartFixture(100, 1);
        $cart = $orderedCartItem->cart;
        $secondCartItem = CartItem::create([
            'cart_id' => $cart->id,
            'perfume_item_id' => $orderedCartItem->perfume_item_id,
            'size_id' => $orderedCartItem->size_id,
            'quantity' => 3,
        ]);
        $order = $this->pendingOrder($user, $orderedCartItem);

        $event = Event::constructFrom([
            'id' => 'evt_checkout_paid',
            'type' => 'checkout.session.completed',
            'data' => ['object' => [
                'id' => 'cs_test_paid',
                'payment_status' => 'paid',
                'payment_intent' => 'pi_test_paid',
                'amount_total' => 11500,
                'currency' => 'myr',
                'metadata' => ['order_id' => (string) $order->id],
            ]],
        ]);

        $this->mock(StripeCheckoutService::class, function (MockInterface $mock) use ($event): void {
            $mock->shouldReceive('constructWebhookEvent')->twice()->andReturn($event);
        });

        $this->postJson('/stripe/webhook', [], ['Stripe-Signature' => 'test'])->assertOk();
        $this->postJson('/stripe/webhook', [], ['Stripe-Signature' => 'test'])->assertOk();

        $this->assertDatabaseHas('payments', [
            'order_id' => $order->id,
            'payment_status' => 'paid',
            'stripe_payment_intent_id' => 'pi_test_paid',
        ]);
        $this->assertDatabaseHas('orders', ['id' => $order->id, 'order_status' => 'processing']);
        $this->assertDatabaseMissing('cart_items', ['id' => $orderedCartItem->id]);
        $this->assertDatabaseHas('cart_items', ['id' => $secondCartItem->id]);
    }

    public function test_invalid_webhook_signature_is_rejected(): void
    {
        $this->mock(StripeCheckoutService::class, function (MockInterface $mock): void {
            $mock->shouldReceive('constructWebhookEvent')->once()->andThrow(new \UnexpectedValueException);
        });

        $this->postJson('/stripe/webhook', [], ['Stripe-Signature' => 'invalid'])->assertStatus(400);
    }

    private function cartFixture(float $price, int $quantity): array
    {
        $user = User::factory()->create();
        $category = PerfumeCategory::create(['name' => 'Uncategorised']);
        $size = Size::create(['name' => '50ml']);
        $product = PerfumeItem::create([
            'dataset_id' => 1,
            'category_id' => $category->id,
            'brand' => 'Test House',
            'name' => 'Test Perfume',
            'description' => 'A test perfume.',
            'image_url' => '',
            'availability_status' => true,
        ]);
        $product->sizes()->attach($size, ['price' => $price]);
        $cart = Cart::create(['user_id' => $user->id]);
        $cartItem = CartItem::create([
            'cart_id' => $cart->id,
            'perfume_item_id' => $product->id,
            'size_id' => $size->id,
            'quantity' => $quantity,
        ]);

        return [$user, $cartItem];
    }

    private function pendingOrder(User $user, CartItem $cartItem): Order
    {
        $order = Order::create([
            'user_id' => $user->id,
            'order_type' => 'online',
            'order_status' => 'pending_payment',
            'subtotal' => 100,
            'shipping_amount' => 15,
            'total_amount' => 115,
            'shipping_name' => 'Test Customer',
            'shipping_email' => 'customer@example.com',
            'shipping_phone' => '0123456789',
            'shipping_address' => '1 Test Street',
            'shipping_city' => 'Kuala Lumpur',
            'shipping_state' => 'Kuala Lumpur',
            'shipping_postcode' => '50000',
        ]);
        OrderItem::create([
            'order_id' => $order->id,
            'perfume_item_id' => $cartItem->perfume_item_id,
            'size_id' => $cartItem->size_id,
            'quantity' => 1,
            'unit_price' => 100,
            'product_name' => 'Test Perfume',
            'size_name' => '50ml',
            'source_cart_item_id' => $cartItem->id,
        ]);
        Payment::create([
            'order_id' => $order->id,
            'user_id' => $user->id,
            'payment_method' => 'stripe',
            'payment_status' => 'pending',
            'amount' => 115,
            'stripe_checkout_session_id' => 'cs_test_paid',
        ]);

        return $order;
    }

    private function shippingDetails(): array
    {
        return [
            'full_name' => 'Test Customer',
            'email' => 'customer@example.com',
            'phone' => '0123456789',
            'address' => '1 Test Street',
            'city' => 'Kuala Lumpur',
            'state' => 'Kuala Lumpur',
            'postcode' => '50000',
        ];
    }
}
