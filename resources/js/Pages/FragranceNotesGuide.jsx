import Navigation from './Navigation';
import { Head } from '@inertiajs/react';

const topics = [
    { title: 'Fragrance Families', description: 'Understand the most popular scent families and what they mean.', emoji: '🌺' },
    { title: 'How to Layer Scents', description: 'Learn how to blend fragrances for a unique aroma.', emoji: '🧪' },
    { title: 'Seasonal Picks', description: 'Choose perfumes that match the season and occasion.', emoji: '🍂' },
];

export default function Learn() {
    return (
        <EssenceLayout>
            <Head title="Learn" />

            <div className="space-y-8">
                <section className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-600">Learn</p>
                            <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900">Perfume tips and inspiration</h1>
                            <p className="mt-4 text-slate-500 max-w-2xl">Discover helpful fragrance guides, expert tips, and how to shop smarter.</p>
                        </div>
                        <div className="rounded-3xl bg-purple-50 p-6 text-center text-sm font-semibold text-purple-700">
                            Fresh fragrance wisdom
                        </div>
                    </div>
                </section>

                <div className="grid gap-6 md:grid-cols-3">
                    {topics.map((topic) => (
                        <article key={topic.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-2xl">{topic.emoji}</div>
                            <h2 className="mt-5 text-xl font-semibold text-slate-900">{topic.title}</h2>
                            <p className="mt-3 text-sm leading-6 text-slate-500">{topic.description}</p>
                            <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-purple-600">Read more →</div>
                        </article>
                    ))}
                </div>

                <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="rounded-3xl bg-gradient-to-br from-purple-600 to-pink-500 p-8 text-white shadow-lg">
                        <p className="text-sm uppercase tracking-[0.25em] text-purple-200">Style guide</p>
                        <h2 className="mt-4 text-3xl font-bold">Choose the right fragrance for every mood</h2>
                        <p className="mt-4 text-sm leading-7 text-purple-100">Whether you want a fresh daytime scent or a warm evening aroma, these quick pointers help you shop with confidence.</p>
                        <div className="mt-8 space-y-4 text-sm text-purple-100/90">
                            <div className="rounded-3xl bg-white/10 p-4">• Pick lighter citrus and aquatic scents for daytime.</div>
                            <div className="rounded-3xl bg-white/10 p-4">• Choose woody or oriental fragrances for special evenings.</div>
                            <div className="rounded-3xl bg-white/10 p-4">• Match your perfume to the season and occasion.</div>
                        </div>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">Need help?</p>
                        <h2 className="mt-4 text-2xl font-bold text-slate-900">Ask our fragrance expert</h2>
                        <p className="mt-3 text-slate-500">Take the quiz and receive tailored recommendations based on your preferences.</p>
                        <div className="mt-8 space-y-4">
                            <div className="rounded-3xl bg-slate-50 p-5">
                                <p className="text-sm font-semibold text-slate-900">Quiz guidance</p>
                                <p className="mt-2 text-sm text-slate-500">Answer a few simple questions, and we’ll match you with the right scents.</p>
                            </div>
                            <div className="rounded-3xl bg-slate-50 p-5">
                                <p className="text-sm font-semibold text-slate-900">Shop smarter</p>
                                <p className="mt-2 text-sm text-slate-500">Learn what scents work best for different seasons and occasions.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </EssenceLayout>
    );
}
