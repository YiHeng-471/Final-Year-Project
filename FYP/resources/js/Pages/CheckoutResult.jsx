import { Link } from '@inertiajs/react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import Navigation from './Navigation';

export default function CheckoutResult({ result, orderId, paymentStatus }) {
  const paid = paymentStatus === 'paid';
  const cancelled = result === 'cancelled';
  const Icon = cancelled ? XCircle : paid ? CheckCircle : Clock;
  const title = cancelled ? 'Checkout cancelled' : paid ? 'Payment confirmed' : 'Payment is being confirmed';
  const message = cancelled
    ? 'No confirmed payment was recorded. Your cart remains available.'
    : paid
      ? 'Your order is now being processed.'
      : 'Stripe has returned you to the shop. The secure webhook is still confirming the payment; refresh your profile shortly.';

  return <div className="min-h-screen bg-gray-50"><Navigation /><main className="mx-auto max-w-xl px-4 py-24 text-center"><Icon className={`mx-auto mb-5 h-16 w-16 ${cancelled ? 'text-red-500' : paid ? 'text-green-600' : 'text-amber-500'}`} /><h1 className="mb-3 text-3xl">{title}</h1><p className="mb-2 text-gray-600">Order #{orderId}</p><p className="mb-8 text-gray-600">{message}</p><div className="flex justify-center gap-4"><Link href="/profile" className="rounded-lg bg-purple-600 px-5 py-3 text-white">View orders</Link>{cancelled && <Link href="/checkout" className="rounded-lg border border-gray-300 px-5 py-3">Return to checkout</Link>}</div></main></div>;
}
