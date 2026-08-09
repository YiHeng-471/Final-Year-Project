import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Search, Sparkles, Star } from 'lucide-react';
import Navigation from './Navigation';

export default function ProductListing({ perfumeItems, filters = {} }) {
  const [search, setSearch] = useState(filters.search ?? '');
  const products = perfumeItems?.data ?? [];

  const visitWithFilters = (nextFilters) => {
    router.get('/products', {
      search: nextFilters.search || undefined,
      sort: nextFilters.sort === 'name' ? undefined : nextFilters.sort,
    }, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  };

  const submitSearch = (event) => {
    event.preventDefault();
    visitWithFilters({ search, sort: filters.sort ?? 'name' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="Discover Perfumes" />
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-purple-600">The Essence catalogue</p>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Discover perfumes</h1>
            <p className="mt-2 text-gray-500">Explore {perfumeItems.total.toLocaleString()} available fragrances.</p>
          </div>
          <Link href="/questionnaire" className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition hover:bg-purple-700">
            <Sparkles className="h-4 w-4" /> Find my matches
          </Link>
        </div>

        <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row">
            <form onSubmit={submitSearch} className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by perfume or brand" className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-24 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100" />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">Search</button>
            </form>
            <select value={filters.sort ?? 'name'} onChange={(event) => visitWithFilters({ search: filters.search ?? '', sort: event.target.value })} className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-purple-500">
              <option value="name">Name: A–Z</option>
              <option value="price-low">Price: Low to high</option>
              <option value="price-high">Price: High to low</option>
              <option value="rating">Highest rated</option>
            </select>
          </div>
        </div>

        {products.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`} className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="flex h-52 items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
                  {product.image_url ? <img src={product.image_url} alt={product.name} className="h-full w-full object-contain p-5" loading="lazy" /> : <Sparkles className="h-16 w-16 text-purple-300" />}
                </div>
                <div className="p-5">
                  <p className="truncate text-xs font-semibold uppercase tracking-wider text-purple-600">{product.brand}</p>
                  <h2 className="mt-1 line-clamp-2 min-h-12 font-semibold leading-6 text-gray-900 transition group-hover:text-purple-700">{product.name}</h2>
                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                    <Star className={`h-4 w-4 ${product.perfume_reviews_count ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                    <span>{product.perfume_reviews_count ? `${Number(product.average_rating).toFixed(1)} (${product.perfume_reviews_count})` : 'Not reviewed'}</span>
                  </div>
                  <div className="mt-4 flex items-end justify-between border-t border-gray-100 pt-4">
                    <div><p className="text-xs text-gray-400">From</p><p className="text-lg font-semibold text-gray-900">RM {Number(product.minimum_price).toFixed(2)}</p></div>
                    <span className="text-sm font-medium text-purple-600">View scent</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center">
            <Search className="mx-auto h-10 w-10 text-gray-300" />
            <h2 className="mt-4 font-semibold text-gray-900">No perfumes found</h2>
            <p className="mt-1 text-sm text-gray-500">Try another perfume or brand name.</p>
          </div>
        )}

        {perfumeItems.last_page > 1 && (
          <nav className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm" aria-label="Product pagination">
            <p className="text-sm text-gray-500">Showing {perfumeItems.from}–{perfumeItems.to} of {perfumeItems.total}</p>
            <div className="flex items-center gap-2">
              {perfumeItems.prev_page_url ? <Link href={perfumeItems.prev_page_url} preserveScroll className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:border-purple-300 hover:text-purple-700"><ArrowLeft className="h-4 w-4" /> Previous</Link> : <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-gray-100 px-3 py-2 text-sm text-gray-300"><ArrowLeft className="h-4 w-4" /> Previous</span>}
              <span className="px-2 text-sm font-medium text-gray-600">Page {perfumeItems.current_page} of {perfumeItems.last_page}</span>
              {perfumeItems.next_page_url ? <Link href={perfumeItems.next_page_url} preserveScroll className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:border-purple-300 hover:text-purple-700">Next <ArrowRight className="h-4 w-4" /></Link> : <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-gray-100 px-3 py-2 text-sm text-gray-300">Next <ArrowRight className="h-4 w-4" /></span>}
            </div>
          </nav>
        )}
      </main>
    </div>
  );
}
