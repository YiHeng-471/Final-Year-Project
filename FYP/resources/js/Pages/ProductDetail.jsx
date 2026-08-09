import { useMemo, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Heart, ShoppingCart, Sparkles, Star } from 'lucide-react';
import { toast } from 'sonner';
import Navigation from './Navigation';

export default function ProductDetail({ product }) {
  const [selectedSizeId, setSelectedSizeId] = useState(product.sizes?.[0]?.id ?? null);
  const [quantity, setQuantity] = useState(1);

  const selectedSize = product.sizes?.find((size) => size.id === selectedSizeId);
  const notes = useMemo(
    () => (product.scent_notes || '').split(',').map((note) => note.trim()).filter(Boolean),
    [product.scent_notes],
  );
  const ratings = (product.perfume_reviews || []).map((review) => Number(review.rating)).filter(Boolean);
  const averageRating = ratings.length
    ? ratings.reduce((total, rating) => total + rating, 0) / ratings.length
    : 0;

  const addToCart = () => {
    if (!selectedSizeId) {
      toast.error('Please choose a size.');
      return;
    }

    router.post('/cart', {
      perfume_item_id: product.id,
      size_id: selectedSizeId,
      quantity,
    }, {
      preserveScroll: true,
      onSuccess: () => toast.success('Added to cart.'),
      onError: () => toast.error('Sign in and select an available size to add this fragrance.'),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title={product.name} />
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-8">
        <Link href="/products" className="mb-7 inline-flex items-center gap-2 text-sm text-gray-600 transition hover:text-purple-600">
          <ArrowLeft className="h-4 w-4" /> Back to products
        </Link>

        <div className="grid gap-10 lg:grid-cols-2">
          <section className="flex min-h-[480px] items-center justify-center overflow-hidden rounded-3xl border border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50 p-8">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="max-h-[520px] w-full object-contain" />
            ) : (
              <Sparkles className="h-28 w-28 text-purple-300" />
            )}
          </section>

          <section className="py-2">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-purple-600">{product.brand}</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-gray-900">{product.name}</h1>

            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <Star className={`h-5 w-5 ${ratings.length ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
              <span>{ratings.length ? `${averageRating.toFixed(1)} from ${ratings.length} review${ratings.length === 1 ? '' : 's'}` : 'Not reviewed yet'}</span>
            </div>

            <p className="mt-7 leading-7 text-gray-600">{product.description}</p>

            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Choose a size</h2>
                {selectedSize && <span className="text-xl font-semibold text-purple-700">RM {Number(selectedSize.pivot.price).toFixed(2)}</span>}
              </div>
              <div className="flex flex-wrap gap-3">
                {(product.sizes || []).map((size) => (
                  <button key={size.id} type="button" onClick={() => setSelectedSizeId(size.id)} className={`rounded-xl border px-5 py-3 text-sm font-medium transition ${selectedSizeId === size.id ? 'border-purple-600 bg-purple-50 text-purple-700 ring-1 ring-purple-600' : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300'}`}>
                    {size.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-7 flex items-center gap-4">
              <div className="flex items-center rounded-xl border border-gray-200 bg-white">
                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="h-12 w-12 text-xl text-gray-600 hover:bg-gray-50">−</button>
                <span className="w-10 text-center font-medium">{quantity}</span>
                <button type="button" onClick={() => setQuantity(Math.min(99, quantity + 1))} className="h-12 w-12 text-xl text-gray-600 hover:bg-gray-50">+</button>
              </div>
              <button type="button" onClick={addToCart} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-3.5 font-semibold text-white shadow-lg shadow-purple-200 transition hover:from-purple-700 hover:to-pink-600">
                <ShoppingCart className="h-5 w-5" /> Add to cart
              </button>
              <button type="button" aria-label="Save fragrance" className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-pink-300 hover:text-pink-500">
                <Heart className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-9 rounded-2xl border border-gray-100 bg-white p-5">
              <h2 className="font-semibold text-gray-900">Fragrance notes</h2>
              {notes.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {notes.map((note, index) => <span key={`${note}-${index}`} className="rounded-full bg-purple-50 px-3 py-1.5 text-sm text-purple-800">{note}</span>)}
                </div>
              ) : <p className="mt-2 text-sm text-gray-500">Detailed notes are not available for this fragrance.</p>}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
