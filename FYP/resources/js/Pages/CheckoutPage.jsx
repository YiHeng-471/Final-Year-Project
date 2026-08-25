import { useEffect, useState } from 'react';
import { router, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, CreditCard, MapPin } from 'lucide-react';
import Navigation from './Navigation';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const { auth, cart = [] } = usePage().props;
  const [reviewing, setReviewing] = useState(false);
  const { data, setData, post, processing, errors } = useForm({
    full_name: auth?.user?.name ?? '',
    email: auth?.user?.email ?? '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postcode: '',
  });

  const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const shipping = subtotal >= 300 ? 0 : 15;
  const total = subtotal + shipping;

  useEffect(() => {
    if (cart.length === 0) router.visit('/cart');
  }, [cart.length]);

  const update = (event) => setData(event.target.name, event.target.value);

  const proceedToReview = (event) => {
    event.preventDefault();
    const required = ['full_name', 'email', 'phone', 'address', 'city', 'state', 'postcode'];
    if (required.some((field) => !data[field].trim())) {
      toast.error('Please complete all shipping fields.');
      return;
    }
    setReviewing(true);
  };

  const submit = () => post('/checkout', {
    preserveScroll: true,
    onError: () => toast.error('Please check your checkout details and try again.'),
  });

  if (cart.length === 0) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="mb-8 text-3xl">Checkout</h1>
        <div className="grid gap-8 lg:grid-cols-3">
          <section className="lg:col-span-2">
            {!reviewing ? (
              <form onSubmit={proceedToReview} className="rounded-2xl bg-white p-8 shadow-sm">
                <div className="mb-6 flex items-center gap-3"><MapPin className="h-6 w-6 text-purple-600" /><h2 className="text-xl">Shipping information</h2></div>
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    ['full_name', 'Full name', 'text'], ['email', 'Email', 'email'],
                    ['phone', 'Phone', 'tel'], ['address', 'Street address', 'text'],
                    ['city', 'City', 'text'], ['state', 'State', 'text'], ['postcode', 'Postcode', 'text'],
                  ].map(([name, label, type]) => (
                    <label key={name} className={name === 'address' ? 'md:col-span-2' : ''}>
                      <span className="mb-2 block text-sm text-gray-700">{label}</span>
                      <input name={name} type={type} value={data[name]} onChange={update} className={`w-full rounded-lg border px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 ${errors[name] ? 'border-red-500' : 'border-gray-200'}`} required />
                      {errors[name] && <span className="mt-1 block text-sm text-red-600">{errors[name]}</span>}
                    </label>
                  ))}
                </div>
                <button type="submit" className="mt-6 w-full rounded-lg bg-purple-600 py-3 text-white hover:bg-purple-700">Review order</button>
              </form>
            ) : (
              <div className="rounded-2xl bg-white p-8 shadow-sm">
                <h2 className="mb-6 text-xl">Review and pay</h2>
                <div className="mb-6 rounded-xl bg-gray-50 p-5 text-sm leading-6">
                  <p className="font-medium">{data.full_name}</p><p>{data.email} · {data.phone}</p><p>{data.address}, {data.city}, {data.state} {data.postcode}</p>
                </div>
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-purple-100 bg-purple-50 p-4 text-sm text-purple-900">
                  <CreditCard className="mt-0.5 h-5 w-5 shrink-0" />
                  <p>You will be redirected to Stripe’s secure hosted checkout. This application does not receive or store your card details.</p>
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setReviewing(false)} disabled={processing} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 py-3"><ArrowLeft className="h-4 w-4" />Back</button>
                  <button type="button" onClick={submit} disabled={processing} className="flex-1 rounded-lg bg-purple-600 py-3 text-white disabled:opacity-50">{processing ? 'Opening Stripe…' : `Pay RM ${total.toFixed(2)}`}</button>
                </div>
              </div>
            )}
          </section>

          <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl">Order summary</h2>
            <div className="space-y-4">{cart.map((item) => <div key={item.id} className="flex gap-3"><img src={item.image_url} alt="" className="h-14 w-14 rounded-lg object-cover" /><div className="flex-1"><p className="text-sm">{item.name}</p><p className="text-xs text-gray-500">{item.size} × {item.quantity}</p></div><p className="text-sm">RM {(Number(item.price) * item.quantity).toFixed(2)}</p></div>)}</div>
            <div className="mt-6 space-y-2 border-t pt-5 text-sm"><p className="flex justify-between"><span>Subtotal</span><span>RM {subtotal.toFixed(2)}</span></p><p className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `RM ${shipping.toFixed(2)}`}</span></p><p className="flex justify-between border-t pt-3 text-lg"><span>Total</span><span>RM {total.toFixed(2)}</span></p></div>
          </aside>
        </div>
      </main>
    </div>
  );
}
