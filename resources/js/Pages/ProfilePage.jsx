import { Link, usePage } from '@inertiajs/react';
import Navigation from './Navigation';
import { User, Settings, Package, Heart, Sparkles } from 'lucide-react';

export default function ProfilePage() {
  const { auth } = usePage().props || {};
  const user = auth?.user;

  const mockOrders = [
    {
      id: 'ORD-001',
      date: '2026-04-15',
      status: 'Delivered',
      total: 578,
      items: [
        { name: 'Midnight Rose', image: '🌹', price: 289 },
        { name: 'Ocean Breeze', image: '🌊', price: 195 },
      ],
    },
    {
      id: 'ORD-002',
      date: '2026-03-28',
      status: 'Delivered',
      total: 445,
      items: [
        { name: 'Sandalwood Elite', image: '🌲', price: 445 },
      ],
    },
  ];

  const preferences = user?.preferences;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl mb-8">My Profile</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl">{user?.name}</h2>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition text-left">
                  <User className="w-5 h-5 text-gray-600" />
                  <span>Account Settings</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition text-left">
                  <Settings className="w-5 h-5 text-gray-600" />
                  <span>Preferences</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition text-left">
                  <Heart className="w-5 h-5 text-gray-600" />
                  <span>Wishlist</span>
                </button>
              </div>
            </div>

            {preferences && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h3>Your Preferences</h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Scent Types</p>
                    <div className="flex flex-wrap gap-2">
                      {preferences.scentTypes.map((scent) => (
                        <span
                          key={scent}
                          className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full capitalize"
                        >
                          {scent}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Occasions</p>
                    <div className="flex flex-wrap gap-2">
                      {preferences.occasions.map((occasion) => (
                        <span
                          key={occasion}
                          className="px-3 py-1 bg-pink-100 text-pink-700 text-sm rounded-full capitalize"
                        >
                          {occasion}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Category</p>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full capitalize">
                      {preferences.gender}
                    </span>
                  </div>
                </div>

                <Link
                  href="/questionnaire"
                  className="w-full mt-4 text-center text-purple-600 hover:text-purple-700 text-sm block"
                >
                  Update Preferences
                </Link>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Package className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl">Order History</h2>
              </div>

              {mockOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No orders yet</p>
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition"
                    >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {mockOrders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-xl p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="mb-1">Order {order.id}</h3>
                          <p className="text-sm text-gray-500">
                            Placed on {new Date(order.date).toLocaleDateString('en-MY', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                          {order.status}
                        </span>
                      </div>

                      <div className="space-y-3 mb-4">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg flex items-center justify-center">
                              <span className="text-3xl">{item.image}</span>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm">{item.name}</h4>
                              <p className="text-sm text-gray-500">
                                RM {item.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <span className="text-lg">
                          Total: RM {order.total.toFixed(2)}
                        </span>
                        <button className="text-purple-600 hover:text-purple-700 text-sm">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
