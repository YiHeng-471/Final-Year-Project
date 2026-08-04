import { Link } from '@inertiajs/react';
import Navigation from './Navigation';
import { ArrowLeft, Sparkles } from 'lucide-react';

const scentTypes = [
  {
    name: 'Floral',
    emoji: '🌸',
    description: 'The most popular fragrance family, floral scents evoke the essence of flowers. They range from light and delicate to rich and opulent.',
    characteristics: ['Romantic', 'Feminine', 'Fresh', 'Elegant'],
    notes: ['Rose', 'Jasmine', 'Lily', 'Peony', 'Violet', 'Gardenia'],
    bestFor: 'Daytime wear, romantic occasions, spring and summer',
    examples: ['Chanel No. 5', 'Marc Jacobs Daisy', 'Viktor & Rolf Flowerbomb'],
  },
  {
    name: 'Woody',
    emoji: '🌲',
    description: 'Woody fragrances are warm, sophisticated, and grounding. They often feature cedarwood, sandalwood, and patchouli.',
    characteristics: ['Warm', 'Sophisticated', 'Earthy', 'Sensual'],
    notes: ['Sandalwood', 'Cedarwood', 'Vetiver', 'Patchouli', 'Oud', 'Pine'],
    bestFor: 'Evening wear, professional settings, fall and winter',
    examples: ['Tom Ford Oud Wood', 'Santal 33', 'Gucci Guilty'],
  },
  {
    name: 'Fresh',
    emoji: '🍃',
    description: 'Clean, crisp, and energizing, fresh scents capture the feeling of a cool breeze or ocean spray. Perfect for everyday wear.',
    characteristics: ['Clean', 'Crisp', 'Energizing', 'Light'],
    notes: ['Green Tea', 'Cucumber', 'Mint', 'Lavender', 'Cotton', 'Herbs'],
    bestFor: 'Daily wear, office, active lifestyle, spring',
    examples: ['CK One', 'Light Blue', 'Acqua di Gio'],
  },
  {
    name: 'Oriental',
    emoji: '✨',
    description: 'Exotic and luxurious, oriental fragrances are rich, spicy, and warm. They make a bold statement and are perfect for special occasions.',
    characteristics: ['Exotic', 'Spicy', 'Warm', 'Luxurious'],
    notes: ['Amber', 'Vanilla', 'Cinnamon', 'Incense', 'Cardamom', 'Clove'],
    bestFor: 'Evening events, cold weather, making a statement',
    examples: ['Yves Saint Laurent Opium', 'Thierry Mugler Angel', 'Tom Ford Black Orchid'],
  },
  {
    name: 'Citrus',
    emoji: '🍊',
    description: 'Bright, zesty, and uplifting, citrus fragrances are refreshing and invigorating. They provide an instant mood boost.',
    characteristics: ['Bright', 'Zesty', 'Uplifting', 'Refreshing'],
    notes: ['Lemon', 'Orange', 'Bergamot', 'Grapefruit', 'Lime', 'Mandarin'],
    bestFor: 'Morning wear, summer, energizing your day',
    examples: ['Dolce & Gabbana Light Blue', 'Versace Bright Crystal', 'Hermès Eau d\'Orange Verte'],
  },
  {
    name: 'Aquatic',
    emoji: '🌊',
    description: 'Inspired by the ocean and water, aquatic fragrances are cool, clean, and refreshing. They evoke feelings of freedom and adventure.',
    characteristics: ['Cool', 'Marine', 'Refreshing', 'Airy'],
    notes: ['Sea Salt', 'Marine Notes', 'Water Lily', 'Aquatic Accord', 'Ozone'],
    bestFor: 'Summer, sports, casual wear, beach vacations',
    examples: ['Davidoff Cool Water', 'Issey Miyake L\'Eau d\'Issey', 'Giorgio Armani Acqua di Gioia'],
  },
];

export default function ScentTypesGuide() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <Link
          href="/home"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-8 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl mb-4">Guide to Scent Types</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Understanding different fragrance families will help you discover scents that match your personality and lifestyle.
          </p>
        </div>

        <div className="space-y-8">
          {scentTypes.map((scent, index) => (
            <div
              key={scent.name}
              className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-md transition"
            >
              <div className="flex items-start gap-6">
                <div className="text-6xl">{scent.emoji}</div>
                <div className="flex-1">
                  <h2 className="text-2xl mb-3">{scent.name}</h2>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {scent.description}
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <h4 className="text-sm text-gray-500 mb-2">Characteristics</h4>
                      <div className="flex flex-wrap gap-2">
                        {scent.characteristics.map((char) => (
                          <span
                            key={char}
                            className="px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full"
                          >
                            {char}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm text-gray-500 mb-2">Common Notes</h4>
                      <div className="flex flex-wrap gap-2">
                        {scent.notes.map((note) => (
                          <span
                            key={note}
                            className="px-3 py-1 bg-pink-50 text-pink-700 text-sm rounded-full"
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4 mt-4">
                    <h4 className="text-sm text-gray-500 mb-2">Best For</h4>
                    <p className="text-sm text-gray-700">{scent.bestFor}</p>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm text-gray-500 mb-2">Popular Examples</h4>
                    <p className="text-sm text-gray-700">
                      {scent.examples.join(' • ')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl mb-4">Ready to Find Your Signature Scent?</h3>
          <p className="mb-6 text-purple-100">
            Take our personalized quiz to discover fragrances that match your preferences.
          </p>
          <Link
            href="/questionnaire"
            className="inline-flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            <Sparkles className="w-5 h-5" />
            Start Preference Quiz
          </Link>
        </div>
      </div>
    </div>
  );
}
