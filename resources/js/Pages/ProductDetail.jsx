import { useState } from 'react';
import { Link } from '@inertiajs/react';
import Navigation from './Navigation';
import { Star, Heart, ShoppingCart, Info, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const productData = {
  '1': {
    id: '1',
    name: 'Midnight Rose',
    brand: 'Essence Luxe',
    price: 289,
    image: '🌹',
    rating: 4.8,
    reviews: 234,
    description: 'A captivating blend of rose petals and warm amber, perfect for evening wear. This luxurious fragrance opens with notes of Bulgarian rose and jasmine, settling into a deep, sensual base of amber and vanilla.',
    scentType: ['Floral', 'Oriental'],
    occasion: ['Evening', 'Romantic'],
    gender: 'Women',
    sizes: ['30ml', '50ml', '100ml'],
    notes: {
      top: ['Bulgarian Rose', 'Bergamot', 'Pink Pepper'],
      middle: ['Jasmine', 'Peony', 'Damask Rose'],
      base: ['Amber', 'Vanilla', 'Musk'],
    },
    longevity: '8-10 hours',
    sillage: 'Moderate to Heavy',
  },
};

export default function ProductDetail() {
  const id = null; // Inertia will supply props if necessary; default to demo id
  const [selectedSize, setSelectedSize] = useState('50ml');
  const [quantity, setQuantity] = useState(1);
  const addToCart = (item) => {
    // placeholder: in a full app this would call a cart action
    console.log('addToCart', item);
  };

  const product = productData[id || '1'] || productData['1'];

  const handleAddToCart = () => {
    addToCart({
      id: `${product.id}-${selectedSize}`,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
    });
    toast.success('Added to cart!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-white rounded-2xl p-8">
            <div className="aspect-square flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl mb-6">
              <span className="text-9xl">{product.image}</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-square flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg cursor-pointer hover:opacity-75 transition"
                >
                  <span className="text-4xl">{product.image}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-6">
              <p className="text-gray-500 mb-2">{product.brand}</p>
              <h1 className="text-4xl mb-4">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
              <p className="text-3xl text-purple-600 mb-6">RM {product.price}</p>
              <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>
            </div>

            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-sm mb-3">Size</label>
                <div className="flex gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 rounded-lg border-2 transition ${
                        selectedSize === size
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm mb-3">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button className="w-14 h-14 border-2 border-gray-300 rounded-lg hover:border-purple-600 hover:bg-purple-50 transition flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="mb-1">Scent Profile</h4>
                  <p className="text-sm text-gray-600">
                    {product.scentType.join(', ')}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="mb-1">Best For</h4>
                  <p className="text-sm text-gray-600">
                    {product.occasion.join(', ')} • {product.gender}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="mb-1">Performance</h4>
                  <p className="text-sm text-gray-600">
                    Longevity: {product.longevity} • Sillage: {product.sillage}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6">
            <h3 className="mb-4">Top Notes</h3>
            <div className="space-y-2">
              {product.notes.top.map((note) => (
                <div key={note} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full" />
                  <span className="text-sm text-gray-700">{note}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6">
            <h3 className="mb-4">Middle Notes</h3>
            <div className="space-y-2">
              {product.notes.middle.map((note) => (
                <div key={note} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-600 rounded-full" />
                  <span className="text-sm text-gray-700">{note}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6">
            <h3 className="mb-4">Base Notes</h3>
            <div className="space-y-2">
              {product.notes.base.map((note) => (
                <div key={note} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-900 rounded-full" />
                  <span className="text-sm text-gray-700">{note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
