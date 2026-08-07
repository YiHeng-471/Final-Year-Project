import Navigation from './Navigation';
import { Link, Head } from '@inertiajs/react';
import { ArrowLeft, Layers } from 'lucide-react';

export default function FragranceNotesGuide() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-8 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
            <Layers className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl mb-4">Understanding Fragrance Notes</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Perfumes are composed of three layers of notes that unfold over time, creating a unique olfactory experience.
          </p>
        </div>

        <div className="space-y-6 mb-12">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                🔝
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-2xl">Top Notes</h2>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                    First 5-15 minutes
                  </span>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Top notes are the initial scents you smell when you first spray a perfume. They are typically
                  light, fresh, and evaporate quickly. These notes create the first impression and entice you
                  to explore the fragrance further.
                </p>
                <div>
                  <h4 className="text-sm text-gray-500 mb-3">Common Top Notes</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h5 className="mb-2">Citrus</h5>
                      <p className="text-sm text-gray-600">Lemon, Orange, Bergamot, Grapefruit</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h5 className="mb-2">Herbal</h5>
                      <p className="text-sm text-gray-600">Basil, Mint, Sage, Lavender</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h5 className="mb-2">Fruity</h5>
                      <p className="text-sm text-gray-600">Apple, Pear, Berries, Peach</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-pink-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                ❤️
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-2xl">Middle Notes (Heart Notes)</h2>
                  <span className="px-3 py-1 bg-pink-100 text-pink-700 text-sm rounded-full">
                    20 minutes - 3 hours
                  </span>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  The middle notes form the heart of the fragrance. They emerge after the top notes dissipate
                  and make up the main body of the perfume. These notes are more rounded and last longer than
                  top notes, defining the fragrance's character.
                </p>
                <div>
                  <h4 className="text-sm text-gray-500 mb-3">Common Middle Notes</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-pink-50 rounded-lg p-4">
                      <h5 className="mb-2">Floral</h5>
                      <p className="text-sm text-gray-600">Rose, Jasmine, Lily, Ylang-Ylang</p>
                    </div>
                    <div className="bg-pink-50 rounded-lg p-4">
                      <h5 className="mb-2">Spicy</h5>
                      <p className="text-sm text-gray-600">Cinnamon, Nutmeg, Cardamom, Pepper</p>
                    </div>
                    <div className="bg-pink-50 rounded-lg p-4">
                      <h5 className="mb-2">Green</h5>
                      <p className="text-sm text-gray-600">Green Tea, Violet Leaf, Geranium</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-purple-900 bg-opacity-10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                🎯
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-2xl">Base Notes</h2>
                  <span className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                    4+ hours
                  </span>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Base notes are the foundation of the fragrance. They are rich, deep, and long-lasting,
                  providing depth and resonance. These notes emerge fully after the middle notes fade and
                  can linger on the skin for hours or even days.
                </p>
                <div>
                  <h4 className="text-sm text-gray-500 mb-3">Common Base Notes</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gray-100 rounded-lg p-4">
                      <h5 className="mb-2">Woody</h5>
                      <p className="text-sm text-gray-600">Sandalwood, Cedarwood, Vetiver, Oud</p>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-4">
                      <h5 className="mb-2">Sweet</h5>
                      <p className="text-sm text-gray-600">Vanilla, Tonka Bean, Amber, Honey</p>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-4">
                      <h5 className="mb-2">Musky</h5>
                      <p className="text-sm text-gray-600">Musk, Patchouli, Leather, Moss</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 mb-8">
          <h3 className="text-2xl mb-4 text-center">The Fragrance Pyramid</h3>
          <div className="max-w-md mx-auto">
            <div className="relative">
              <div className="bg-purple-200 h-24 flex items-center justify-center rounded-t-full">
                <span>Top Notes</span>
              </div>
              <div className="bg-pink-200 h-32 flex items-center justify-center">
                <span>Middle Notes</span>
              </div>
              <div className="bg-gray-300 h-40 flex items-center justify-center rounded-b-lg">
                <span>Base Notes</span>
              </div>
            </div>
          </div>
          <p className="text-center text-gray-600 mt-6">
            The fragrance pyramid illustrates how perfume notes unfold over time, with top notes at the peak,
            followed by heart notes, and anchored by base notes at the foundation.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h3 className="text-2xl mb-4">Tips for Testing Fragrances</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="mb-2">Test on Skin, Not Paper</h4>
                <p className="text-sm text-gray-600">
                  Fragrances interact with your body chemistry. Always test on your wrist or inner elbow.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="mb-2">Wait 30 Minutes</h4>
                <p className="text-sm text-gray-600">
                  Allow the fragrance to develop through all three note phases before making a decision.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="mb-2">Limit Testing to 3-4 Scents</h4>
                <p className="text-sm text-gray-600">
                  Your nose can get overwhelmed. Test only a few fragrances at a time for accurate assessment.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                4
              </div>
              <div>
                <h4 className="mb-2">Consider the Occasion</h4>
                <p className="text-sm text-gray-600">
                  Think about when and where you'll wear the fragrance to ensure it matches the setting.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl mb-4">Explore Our Collection</h3>
          <p className="mb-6 text-purple-100">
            Now that you understand fragrance notes, discover perfumes with detailed note breakdowns.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}