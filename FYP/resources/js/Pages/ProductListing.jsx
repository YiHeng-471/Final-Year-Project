import { useState, useMemo } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Navigation from './Navigation';
import { Search, Filter, Star, Sparkles, Heart } from 'lucide-react';

const mockProducts = [
  {
    id: '1',
    name: 'Midnight Rose',
    brand: 'Essence Luxe',
    price: 289,
    image: '🌹',
    rating: 4.8,
    reviews: 234,
    scentType: ['floral', 'oriental'],
    occasion: ['evening', 'romantic'],
    gender: 'women',
    priceRange: 'mid',
  },
  {
    id: '2',
    name: 'Ocean Breeze',
    brand: 'Aqua Vida',
    price: 195,
    image: '🌊',
    rating: 4.6,
    reviews: 189,
    scentType: ['aquatic', 'fresh'],
    occasion: ['daily', 'sport'],
    gender: 'men',
    priceRange: 'mid',
  },
  {
    id: '3',
    name: 'Citrus Sunrise',
    brand: 'Fresh Notes',
    price: 129,
    image: '🍊',
    rating: 4.5,
    reviews: 312,
    scentType: ['citrus', 'fresh'],
    occasion: ['daily', 'work'],
    gender: 'unisex',
    priceRange: 'budget',
  },
  {
    id: '4',
    name: 'Sandalwood Elite',
    brand: 'Woody Essence',
    price: 445,
    image: '🌲',
    rating: 4.9,
    reviews: 156,
    scentType: ['woody', 'oriental'],
    occasion: ['work', 'evening'],
    gender: 'men',
    priceRange: 'premium',
  },
  {
    id: '5',
    name: 'Garden Bloom',
    brand: 'Petals & Co',
    price: 249,
    image: '🌸',
    rating: 4.7,
    reviews: 278,
    scentType: ['floral', 'fresh'],
    occasion: ['daily', 'work', 'romantic'],
    gender: 'women',
    priceRange: 'mid',
  },
  {
    id: '6',
    name: 'Amber Nights',
    brand: 'Oriental Charm',
    price: 699,
    image: '✨',
    rating: 4.9,
    reviews: 98,
    scentType: ['oriental'],
    occasion: ['evening', 'special'],
    gender: 'unisex',
    priceRange: 'luxury',
  },
  {
    id: '7',
    name: 'Sport Active',
    brand: 'Energy Line',
    price: 89,
    image: '⚡',
    rating: 4.3,
    reviews: 421,
    scentType: ['fresh', 'citrus'],
    occasion: ['sport', 'daily'],
    gender: 'men',
    priceRange: 'budget',
  },
  {
    id: '8',
    name: 'Lavender Dreams',
    brand: 'Calm Essence',
    price: 169,
    image: '💜',
    rating: 4.6,
    reviews: 267,
    scentType: ['floral', 'fresh'],
    occasion: ['daily', 'evening'],
    gender: 'women',
    priceRange: 'mid',
  },
];

export default function ProductListing() {
  const { auth, perfumeItems = null } = usePage().props || {};
  const user = auth?.user;
  const serverProducts = perfumeItems ? perfumeItems.map(p => ({
    id: p.id,
    name: p.name,
    brand: p.perfume_category?.name || '',
    price: p.sizes && p.sizes.length ? p.sizes[0].pivot.price : p.price || 0,
    image: p.image_url || '✨',
    rating: 4.5,
    reviews: 100,
    scentType: p.scent_notes ? p.scent_notes.split(',') : [],
    occasion: [],
    gender: p.tags ? p.tags.split(',')[0] : 'unisex',
  })) : null;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScentFilter, setSelectedScentFilter] = useState([]);
  const [selectedGenderFilter, setSelectedGenderFilter] = useState('');
  const [sortBy, setSortBy] = useState('recommended');

  const sourceProducts = serverProducts || mockProducts;

  const recommendedProducts = useMemo(() => {
    if (!user?.preferences) return sourceProducts;

    return sourceProducts.map(product => {
      let score = 0;

      const scentMatch = product.scentType.some(scent =>
        user.preferences?.scentTypes.includes(scent)
      );
      if (scentMatch) score += 3;

      const occasionMatch = product.occasion.some(occ =>
        user.preferences?.occasions.includes(occ)
      );
      if (occasionMatch) score += 2;

      if (product.gender === user.preferences?.gender || product.gender === 'unisex') {
        score += 2;
      }

      if (product.priceRange === user.preferences?.priceRange) {
        score += 1;
      }

      return {
        ...product,
        isPersonalized: score >= 4,
        matchScore: score,
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }, [user?.preferences]);

  const filteredProducts = useMemo(() => {
    let products = [...recommendedProducts];

    if (searchQuery) {
      products = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedScentFilter.length > 0) {
      products = products.filter(p =>
        p.scentType.some(scent => selectedScentFilter.includes(scent))
      );
    }

    if (selectedGenderFilter) {
      products = products.filter(p =>
        p.gender === selectedGenderFilter || p.gender === 'unisex'
      );
    }

    if (sortBy === 'price-low') {
      products.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      products.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      products.sort((a, b) => b.rating - a.rating);
    }

    return products;
  }, [recommendedProducts, searchQuery, selectedScentFilter, selectedGenderFilter, sortBy]);

  const personalizedCount = filteredProducts.filter(p => p.isPersonalized).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Discover Perfumes</h1>
          <p className="text-gray-600">
            {user?.preferences
              ? `${personalizedCount} perfumes matched to your preferences`
              : 'Browse our collection'}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search perfumes or brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 outline-none"
          >
            <option value="recommended">Recommended</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-64 space-y-6">
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-gray-700" />
                <h3>Filters</h3>
              </div>

              <div className="mb-6">
                <h4 className="text-sm mb-3 text-gray-700">Scent Type</h4>
                <div className="space-y-2">
                  {['floral', 'woody', 'fresh', 'oriental', 'citrus', 'aquatic'].map(scent => (
                    <label key={scent} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedScentFilter.includes(scent)}
                        onChange={() => {
                          if (selectedScentFilter.includes(scent)) {
                            setSelectedScentFilter(selectedScentFilter.filter(s => s !== scent));
                          } else {
                            setSelectedScentFilter([...selectedScentFilter, scent]);
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm capitalize">{scent}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm mb-3 text-gray-700">Gender</h4>
                <div className="space-y-2">
                  {['men', 'women', 'unisex'].map(gender => (
                    <label key={gender} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        checked={selectedGenderFilter === gender}
                        onChange={() => setSelectedGenderFilter(gender)}
                      />
                      <span className="text-sm capitalize">{gender}</span>
                    </label>
                  ))}
                </div>
                {selectedGenderFilter && (
                  <button
                    onClick={() => setSelectedGenderFilter('')}
                    className="text-sm text-purple-600 mt-2"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition group"
                >
                  <div className="relative">
                    {product.isPersonalized && (
                      <div className="absolute top-3 left-3 bg-purple-600 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        For You
                      </div>
                    )}
                    <button className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition">
                      <Heart className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="h-48 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 rounded-t-xl">
                      <span className="text-7xl">{product.image}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
                    <h3 className="mb-2 group-hover:text-purple-600 transition">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{product.rating}</span>
                      </div>
                      <span className="text-xs text-gray-400">({product.reviews})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg">RM {product.price}</span>
                      <span className="text-xs text-gray-500 capitalize">
                        {product.scentType[0]}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500 mb-4">No products found.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedScentFilter([]);
                    setSelectedGenderFilter('');
                  }}
                  className="text-purple-600 hover:text-purple-700"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
