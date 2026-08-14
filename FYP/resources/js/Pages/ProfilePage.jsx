import { Link, usePage } from '@inertiajs/react';
import Navigation from './Navigation';
import { Package, Sparkles, User } from 'lucide-react';

const labels = (values = []) => values.map((value) => value.replaceAll('_', ' '));

export default function ProfilePage() {
  const { auth, preference, orders } = usePage().props;
  const user = auth?.user;
  const orderList = orders?.data ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 py-12">
        <h1 className="mb-8 text-3xl">My Profile</h1>
        <div className="grid gap-8 lg:grid-cols-3">
          <aside className="space-y-6">
            <section className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div><h2 className="text-xl">{user?.name}</h2><p className="text-sm text-gray-500">{user?.email}</p></div>
              </div>
            </section>

            <section className="rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 p-6">
              <div className="mb-4 flex items-center gap-2"><Sparkles className="h-5 w-5 text-purple-600" /><h3>Your Preferences</h3></div>
              {preference ? (
                <div className="space-y-4 text-sm">
                  {[
                    ['Scent character', preference.scent_characters],
                    ['Preferred notes', preference.preferred_notes],
                    ['Occasions', preference.occasions],
                    ['Desired feeling', preference.desired_feelings],
                  ].map(([title, values]) => values?.length > 0 && (
                    <div key={title}><p className="mb-2 text-gray-600">{title}</p><div className="flex flex-wrap gap-2">{labels(values).map((value) => <span key={value} className="rounded-full bg-white px-3 py-1 capitalize text-purple-700">{value}</span>)}</div></div>
                  ))}
                  <p className="text-gray-600">Budget: RM {preference.budget_min}{preference.budget_max ? `–${preference.budget_max}` : '+'}</p>
                  {preference.marketed_gender && preference.marketed_gender !== 'no_preference' && <p className="text-gray-600">Stated shopping preference: <span className="capitalize">{preference.marketed_gender}</span></p>}
                </div>
              ) : <p className="text-sm text-gray-600">You have not completed the questionnaire yet.</p>}
              <Link href="/questionnaire" className="mt-5 block text-sm text-purple-700">{preference ? 'Update preferences' : 'Complete questionnaire'}</Link>
            </section>
          </aside>

          <section className="rounded-xl bg-white p-8 shadow-sm lg:col-span-2">
            <div className="mb-6 flex items-center gap-3"><Package className="h-6 w-6 text-purple-600" /><h2 className="text-xl">Order History</h2></div>
            {orderList.length === 0 ? (
              <div className="py-12 text-center"><Package className="mx-auto mb-4 h-16 w-16 text-gray-300" /><p className="mb-4 text-gray-500">No orders yet</p><Link href="/products" className="inline-block rounded-lg bg-purple-600 px-6 py-3 text-white">Start Shopping</Link></div>
            ) : (
              <div className="space-y-5">{orderList.map((order) => (
                <article key={order.id} className="rounded-xl border border-gray-200 p-5">
                  <div className="mb-4 flex justify-between"><div><h3>Order #{order.id}</h3><p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString('en-MY')}</p></div><span className="capitalize text-purple-700">{order.order_status}</span></div>
                  <div className="space-y-3">{order.order_items.map((item) => <div key={item.id} className="flex items-center gap-3"><img src={item.perfume_item?.image_url} alt="" className="h-12 w-12 rounded object-cover" /><div><p>{item.perfume_item?.name}</p><p className="text-sm text-gray-500">{item.size?.name} × {item.quantity}</p></div></div>)}</div>
                  <p className="mt-4 border-t pt-4 text-right">Total: RM {Number(order.total_amount).toFixed(2)}</p>
                </article>
              ))}</div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
