import { Head, Link, router } from '@inertiajs/react';
import { AlertCircle, ArrowRight, Check, RefreshCw, SlidersHorizontal, Sparkles, Star } from 'lucide-react';
import Navigation from './Navigation';

const label = (value) => value?.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

function ProductImage({ product }) {
  if (product.image_url) {
    return <img src={product.image_url} alt={product.name} className="h-full w-full object-contain p-6" loading="lazy" />;
  }

  return <Sparkles className="h-16 w-16 text-purple-300" />;
}

export default function Recommendations({ preferences, recommendations = [], candidateCount = 0, serviceUnavailable = false }) {
  const hasPreferredNotes = (preferences.preferred_notes ?? []).length > 0;
  const budget = preferences.budget_max
    ? `RM ${preferences.budget_min} \u2013 RM ${preferences.budget_max}`
    : `RM ${preferences.budget_min}+`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="Your Recommendations" />
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-10">
        <section className="relative mb-9 overflow-hidden rounded-3xl bg-gradient-to-br from-purple-700 via-purple-600 to-pink-500 px-6 py-9 text-white shadow-xl shadow-purple-200 sm:px-10">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10" />
          <div className="relative max-w-4xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-sm backdrop-blur">
              <Sparkles className="h-4 w-4" /> Your personalised edit
            </div>
            <h1 className="text-3xl font-semibold sm:text-4xl">Fragrances selected for you</h1>
            <p className="mt-3 max-w-3xl leading-7 text-purple-100">
              {hasPreferredNotes
                ? `We compared your scent profile semantically, rewarded exact preferred-note matches, and kept only purchasable sizes within ${budget}.`
                : `We compared your scent profile semantically and kept only purchasable sizes within ${budget}.`}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {(preferences.scent_characters ?? []).map((item) => <span key={`scent-${item}`} className="rounded-full bg-white/15 px-3 py-1 text-sm">Scent: {label(item)}</span>)}
              {(preferences.occasions ?? []).map((item) => <span key={`occasion-${item}`} className="rounded-full bg-white/15 px-3 py-1 text-sm">Occasion: {label(item)}</span>)}
              {(preferences.desired_feelings ?? []).map((item) => <span key={`feeling-${item}`} className="rounded-full bg-white/15 px-3 py-1 text-sm">Feeling: {label(item)}</span>)}
              {(preferences.preferred_notes ?? []).map((item) => <span key={`note-${item}`} className="rounded-full bg-white/15 px-3 py-1 text-sm">Note: {label(item)}</span>)}
              <span className="rounded-full bg-white/15 px-3 py-1 text-sm">Budget: {budget}</span>
              {preferences.marketed_gender && <span className="rounded-full bg-white/15 px-3 py-1 text-sm">Shopping preference only: {label(preferences.marketed_gender)} (not used for ranking or filtering)</span>}
            </div>
          </div>
        </section>

        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Your top matches</h2>
            <p className="mt-1 text-sm text-gray-500">Ranked from {candidateCount.toLocaleString()} budget-eligible products.</p>
          </div>
          <Link href="/questionnaire" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-purple-300 hover:text-purple-700">
            <SlidersHorizontal className="h-4 w-4" /> Update preferences
          </Link>
        </div>

        {serviceUnavailable && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <h3 className="font-semibold">Recommendation service is not running</h3>
                <p className="mt-1 text-sm text-amber-800">Start the Python service on port 8001, then retry this page.</p>
                <button type="button" onClick={() => router.reload()} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-900 px-4 py-2 text-sm font-medium text-white"><RefreshCw className="h-4 w-4" /> Retry</button>
              </div>
            </div>
          </div>
        )}

        {!serviceUnavailable && recommendations.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
            <h3 className="font-semibold text-gray-900">No products fit this budget yet</h3>
            <p className="mt-2 text-sm text-gray-500">Try broadening your budget in the questionnaire.</p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {recommendations.map((product, index) => {
            const matchedNotes = product.matched_notes ?? [];
            const matchScore = Math.max(0, Math.min(100, Math.round(Number(product.score) * 100)));
            const minimumPrice = Number(product.min_price ?? 0);

            return (
              <article key={product.id} className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="relative flex h-56 items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
                  <ProductImage product={product} />
                  <span className="absolute left-4 top-4 rounded-full bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white shadow">#{index + 1} match</span>
                  <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-purple-700 shadow-sm">Match score: {matchScore}/100</span>
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-purple-600">{product.brand}</p>
                  <h3 className="mt-1 line-clamp-1 text-lg font-semibold text-gray-900">{product.name}</h3>
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                    <Star className={`h-4 w-4 ${product.review_count ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                    <span>{product.review_count ? `${product.average_rating} (${product.review_count})` : 'Not reviewed yet'}</span>
                  </div>
                  <p className="mt-4 line-clamp-2 text-sm leading-6 text-gray-600">{product.description}</p>

                  <div className="mt-4 rounded-xl bg-purple-50 p-3 text-sm text-purple-900">
                    <div className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-purple-600" /><p>{product.explanation}</p></div>
                    {matchedNotes.length > 0 && <div className="mt-2 flex flex-wrap gap-1.5">{matchedNotes.map((note) => <span key={note} className="rounded-full bg-white px-2 py-1 text-xs font-medium capitalize text-purple-700">{note}</span>)}</div>}
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <div><p className="text-xs text-gray-400">From</p><p className="text-lg font-semibold text-gray-900">RM {minimumPrice.toFixed(2)}</p></div>
                    <Link href={`/product/${product.id}`} className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-purple-700">View scent <ArrowRight className="h-4 w-4" /></Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}
