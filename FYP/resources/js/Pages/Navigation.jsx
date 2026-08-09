import { Link, usePage, router } from '@inertiajs/react';
import { Sparkles, ShoppingCart, User, LogOut, BookOpen } from 'lucide-react';

export default function Navigation({ children }) {
    const { auth, cart = [] } = usePage().props || {};
    const user = auth?.user;

    const cartItemCount = (cart || []).reduce((sum, item) => sum + (item.quantity || 0), 0);

    const handleLogout = () => {
      setUser(null);
      router.visit('/login');
    };

    return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl">Essence</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {user && (
              <Link href="/recommendations" className="text-gray-700 hover:text-purple-600 transition">
                For You
              </Link>
            )}
            <Link href="/products" className="text-gray-700 hover:text-purple-600 transition">
              Shop
            </Link>
            <div className="relative group">
              <button className="text-gray-700 hover:text-purple-600 transition flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                Learn
              </button>
              <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg py-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                <Link
                  href="/guide/scent-types"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                >
                  Scent Types
                </Link>
                <Link
                  href="/guide/fragrance-notes"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                >
                  Fragrance Notes
                </Link>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/cart"
              className="relative p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>

            <div className="relative group">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <User className="w-5 h-5 text-gray-700" />
              </button>
              <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-lg py-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
