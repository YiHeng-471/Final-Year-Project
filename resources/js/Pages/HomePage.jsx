import { Link, router } from '@inertiajs/react';
import { useApp } from '../AppContext';
import Navigation from './Navigation';
import { Sparkles, Heart, Search, TrendingUp } from 'lucide-react';

export default function HomePage() {
  const { user } = useApp();
  const hasPreferences = user?.preferences !== undefined;

  const featuredCategories = [
    { name: 'Floral', image: '🌸', description: 'Romantic & Delicate' },
    { name: 'Woody', image: '🌲', description: 'Warm & Sophisticated' },
    { name: 'Fresh', image: '🍃', description: 'Clean & Energizing' },
    { name: 'Oriental', image: '✨', description: 'Exotic & Luxurious' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 text-white mb-12">
          <h1 className="text-4xl md:text-5xl mb-4">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-lg text-purple-100 mb-8">
            {hasPreferences
              ? 'Discover fragrances tailored just for you'
              : 'Complete your preference profile to get personalized recommendations'}
          </p>
          {!hasPreferences ? (
            <Link
              to="/questionnaire"
              className="inline-flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition"
            >
              <Sparkles className="w-5 h-5" />
              Take Preference Quiz
            </Link>
          ) : (
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition"
            >
              <Search className="w-5 h-5" />
              Explore Products
            </Link>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg mb-2">Personalized Recommendations</h3>
            <p className="text-sm text-gray-600">
              Get perfume suggestions based on your unique preferences
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-lg mb-2">Curated Collections</h3>
            <p className="text-sm text-gray-600">
              Explore hand-picked fragrances for every occasion
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg mb-2">Expert Guidance</h3>
            <p className="text-sm text-gray-600">
              Learn about scent families and fragrance notes
            </p>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl">Explore By Category</h2>
            <Link to="/products" className="text-purple-600 hover:text-purple-700 text-sm">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredCategories.map((category) => (
              <Link
                key={category.name}
                to={`/products?category=${category.name.toLowerCase()}`}
                className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition group"
              >
                <div className="text-4xl mb-3">{category.image}</div>
                <h3 className="mb-1 group-hover:text-purple-600 transition">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-3xl mb-4">Not Sure Where to Start?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our fragrance guides help you understand scent families, notes, and how to choose
            the perfect perfume for any occasion.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/guide/scent-types"
              className="bg-white px-6 py-3 rounded-lg hover:shadow-lg transition"
            >
              Learn About Scent Types
            </Link>
            <Link
              to="/guide/fragrance-notes"
              className="bg-white px-6 py-3 rounded-lg hover:shadow-lg transition"
            >
              Understand Fragrance Notes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
