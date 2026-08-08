import { useMemo, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CircleHelp,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import Navigation from './Navigation';

const steps = [
  { number: 1, short: 'Character', title: 'What kind of scent appeals to you?', subtitle: 'Choose up to 3 scent characters that feel most like you.' },
  { number: 2, short: 'Notes', title: 'Which fragrance notes do you enjoy?', subtitle: 'Choose up to 5, or skip this step if you are not sure yet.' },
  { number: 3, short: 'Occasion', title: 'When will you mainly wear it?', subtitle: 'Choose up to 3 situations so we can understand the setting.' },
  { number: 4, short: 'Feeling', title: 'How should your fragrance feel?', subtitle: 'Choose up to 3 qualities you want the fragrance to express.' },
  { number: 5, short: 'Budget', title: 'Set your shopping preferences', subtitle: 'Your budget filters shop products; marketed category is optional.' },
];

const scentCharacters = [
  { id: 'floral', name: 'Floral', emoji: '🌸', description: 'Petal-soft, romantic and elegant' },
  { id: 'woody', name: 'Woody', emoji: '🌲', description: 'Earthy, grounded and sophisticated' },
  { id: 'fresh', name: 'Fresh', emoji: '🍃', description: 'Crisp, airy and energising' },
  { id: 'citrus', name: 'Citrus', emoji: '🍊', description: 'Bright, zesty and uplifting' },
  { id: 'sweet', name: 'Sweet', emoji: '🍦', description: 'Creamy, delicious and comforting' },
  { id: 'warm_spicy', name: 'Warm / Spicy', emoji: '🌶️', description: 'Rich, warming and expressive' },
  { id: 'aquatic_clean', name: 'Aquatic / Clean', emoji: '🌊', description: 'Cool, watery and refreshing' },
];

const fragranceNotes = [
  { id: 'vanilla', name: 'Vanilla', description: 'Sweet, creamy and comforting' },
  { id: 'bergamot', name: 'Bergamot', description: 'Bright, fresh and citrusy' },
  { id: 'rose', name: 'Rose', description: 'Classic, romantic and velvety' },
  { id: 'jasmine', name: 'Jasmine', description: 'Rich, floral and luminous' },
  { id: 'lavender', name: 'Lavender', description: 'Clean, calming and aromatic' },
  { id: 'sandalwood', name: 'Sandalwood', description: 'Smooth, woody and creamy' },
  { id: 'musk', name: 'Musk', description: 'Soft, warm and skin-like' },
  { id: 'amber', name: 'Amber', description: 'Warm, resinous and sensual' },
  { id: 'citrus', name: 'Citrus', description: 'Juicy, sparkling and lively' },
  { id: 'oud', name: 'Oud', description: 'Deep, smoky and luxurious' },
  { id: 'vetiver', name: 'Vetiver', description: 'Dry, green and earthy' },
  { id: 'patchouli', name: 'Patchouli', description: 'Earthy, woody and rich' },
];

const occasions = [
  { id: 'everyday', name: 'Everyday', emoji: '☀️', description: 'Easy, versatile daily wear' },
  { id: 'work_office', name: 'Work / Office', emoji: '💼', description: 'Polished and professional' },
  { id: 'date_romantic', name: 'Date / Romantic', emoji: '❤️', description: 'Intimate and memorable' },
  { id: 'evening_night', name: 'Evening / Night', emoji: '🌙', description: 'Confident after-dark wear' },
  { id: 'special_occasion', name: 'Special Occasion', emoji: '🎉', description: 'Celebrations and important events' },
  { id: 'sport_outdoors', name: 'Sport / Outdoors', emoji: '⚡', description: 'Active and energising moments' },
];

const feelings = [
  { id: 'clean_refreshing', name: 'Clean & refreshing', description: 'Crisp, light and effortless' },
  { id: 'soft_comforting', name: 'Soft & comforting', description: 'Gentle, calming and familiar' },
  { id: 'elegant_sophisticated', name: 'Elegant & sophisticated', description: 'Refined, polished and timeless' },
  { id: 'sweet_cozy', name: 'Sweet & cozy', description: 'Warm, delicious and inviting' },
  { id: 'bold_sensual', name: 'Bold & sensual', description: 'Striking, confident and magnetic' },
  { id: 'warm_luxurious', name: 'Warm & luxurious', description: 'Rich, opulent and enveloping' },
  { id: 'energetic_uplifting', name: 'Energetic & uplifting', description: 'Bright, lively and optimistic' },
];

const budgets = [
  { id: 'budget_friendly', name: 'Budget friendly', range: 'RM 50 – RM 150' },
  { id: 'mid_range', name: 'Mid-range', range: 'RM 150 – RM 350' },
  { id: 'premium', name: 'Premium', range: 'RM 350 – RM 600' },
  { id: 'luxury', name: 'Luxury', range: 'RM 600+' },
];

const genderOptions = [
  { id: null, name: 'No preference' },
  { id: 'men', name: "Men's" },
  { id: 'women', name: "Women's" },
  { id: 'unisex', name: 'Unisex' },
];

function ChoiceCard({ item, selected, onClick, compact = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group relative w-full rounded-2xl border p-4 text-left transition duration-200 ${
        selected
          ? 'border-purple-500 bg-purple-50 shadow-sm ring-1 ring-purple-500'
          : 'border-gray-200 bg-white hover:-translate-y-0.5 hover:border-purple-300 hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-3">
        {item.emoji && <span className={compact ? 'text-2xl' : 'text-3xl'}>{item.emoji}</span>}
        <div className="min-w-0 flex-1">
          <p className="font-medium text-gray-900">{item.name}</p>
          {item.description && <p className="mt-1 text-sm leading-5 text-gray-500">{item.description}</p>}
        </div>
        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ${selected ? 'border-purple-600 bg-purple-600 text-white' : 'border-gray-300 text-transparent'}`}>
          <Check className="h-4 w-4" />
        </span>
      </div>
    </button>
  );
}

export default function Questionnaire({ savedPreferences = null }) {
  const [step, setStep] = useState(1);
  const { data, setData, post, processing, errors } = useForm({
    scent_characters: savedPreferences?.scent_characters ?? [],
    preferred_notes: savedPreferences?.preferred_notes ?? [],
    occasions: savedPreferences?.occasions ?? [],
    desired_feelings: savedPreferences?.desired_feelings ?? [],
    budget_key: savedPreferences?.budget_key ?? '',
    marketed_gender: savedPreferences?.marketed_gender ?? null,
  });

  const selectedCount = useMemo(() => ({
    1: data.scent_characters.length,
    2: data.preferred_notes.length,
    3: data.occasions.length,
    4: data.desired_feelings.length,
  }), [data]);

  const toggle = (field, id, limit) => {
    const values = data[field];
    if (values.includes(id)) {
      setData(field, values.filter((value) => value !== id));
      return;
    }
    if (values.length >= limit) {
      toast.error(`You can select up to ${limit} options.`);
      return;
    }
    setData(field, [...values, id]);
  };

  const canContinue = () => {
    if (step === 1 && data.scent_characters.length === 0) return 'Select at least one scent character.';
    if (step === 3 && data.occasions.length === 0) return 'Select at least one occasion.';
    if (step === 4 && data.desired_feelings.length === 0) return 'Select at least one desired feeling.';
    if (step === 5 && !data.budget_key) return 'Choose a budget range.';
    return null;
  };

  const next = () => {
    const message = canContinue();
    if (message) {
      toast.error(message);
      return;
    }
    setStep((current) => Math.min(5, current + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const back = () => {
    setStep((current) => Math.max(1, current - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = (event) => {
    event.preventDefault();
    const message = canContinue();
    if (message) {
      toast.error(message);
      return;
    }
    post('/questionnaire', {
      preserveScroll: true,
      onError: () => toast.error('Please review your selections and try again.'),
    });
  };

  const current = steps[step - 1];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-gray-50 to-pink-50">
      <Head title="Find Your Scent" />
      <Navigation />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-200">
            <Sparkles className="h-6 w-6" />
          </div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-purple-600">Personal scent profile</p>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">Find a fragrance that feels like you</h1>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600">Five quick steps help us understand your taste. There are no wrong answers, and you can update them anytime.</p>
        </div>

        <div className="mb-8 rounded-2xl border border-white/80 bg-white/80 p-4 shadow-sm backdrop-blur sm:p-5">
          <div className="flex items-center gap-2 sm:gap-3">
            {steps.map((item, index) => (
              <div key={item.number} className="flex flex-1 items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => item.number < step && setStep(item.number)}
                  disabled={item.number > step}
                  className="flex min-w-0 flex-1 flex-col items-center gap-2 sm:flex-row"
                >
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition ${item.number < step ? 'bg-emerald-500 text-white' : item.number === step ? 'bg-purple-600 text-white ring-4 ring-purple-100' : 'bg-gray-100 text-gray-400'}`}>
                    {item.number < step ? <Check className="h-4 w-4" /> : item.number}
                  </span>
                  <span className={`hidden truncate text-xs sm:block ${item.number === step ? 'font-semibold text-purple-700' : 'text-gray-500'}`}>{item.short}</span>
                </button>
                {index < steps.length - 1 && <div className={`hidden h-px flex-1 sm:block ${item.number < step ? 'bg-emerald-300' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={submit} className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-purple-100/60">
          <div className="border-b border-gray-100 px-6 py-6 sm:px-10 sm:py-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="mb-2 text-sm font-medium text-purple-600">Step {step} of 5</p>
                <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">{current.title}</h2>
                <p className="mt-2 text-gray-500">{current.subtitle}</p>
              </div>
              {step < 5 && (
                <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
                  {step === 2 ? `${selectedCount[step]}/5 selected` : `${selectedCount[step]}/3 selected`}
                </span>
              )}
            </div>
          </div>

          <div className="min-h-[390px] px-6 py-7 sm:px-10 sm:py-9">
            {step === 1 && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{scentCharacters.map((item) => <ChoiceCard key={item.id} item={item} selected={data.scent_characters.includes(item.id)} onClick={() => toggle('scent_characters', item.id, 3)} />)}</div>}

            {step === 2 && (
              <>
                <div className="mb-5 flex items-start gap-3 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
                  <CircleHelp className="mt-0.5 h-5 w-5 shrink-0" />
                  <p>Not familiar with fragrance notes? That is completely fine—leave this step empty and we will recommend from your other preferences.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{fragranceNotes.map((item) => <ChoiceCard key={item.id} item={item} compact selected={data.preferred_notes.includes(item.id)} onClick={() => toggle('preferred_notes', item.id, 5)} />)}</div>
              </>
            )}

            {step === 3 && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{occasions.map((item) => <ChoiceCard key={item.id} item={item} selected={data.occasions.includes(item.id)} onClick={() => toggle('occasions', item.id, 3)} />)}</div>}

            {step === 4 && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{feelings.map((item) => <ChoiceCard key={item.id} item={item} selected={data.desired_feelings.includes(item.id)} onClick={() => toggle('desired_feelings', item.id, 3)} />)}</div>}

            {step === 5 && (
              <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                <section>
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900">Your budget</h3>
                    <p className="mt-1 text-sm text-gray-500">Choose the amount you are comfortable spending.</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {budgets.map((budget) => <ChoiceCard key={budget.id} item={{ ...budget, description: budget.range }} selected={data.budget_key === budget.id} onClick={() => setData('budget_key', budget.id)} />)}
                  </div>
                </section>
                <section className="rounded-2xl bg-gray-50 p-5 sm:p-6">
                  <h3 className="font-semibold text-gray-900">Marketed category <span className="font-normal text-gray-400">(optional)</span></h3>
                  <p className="mt-1 text-sm leading-5 text-gray-500">This is a light shopping preference, not a judgment about which scents suit you.</p>
                  <div className="mt-5 space-y-2">
                    {genderOptions.map((option) => (
                      <button key={option.name} type="button" onClick={() => setData('marketed_gender', option.id)} className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition ${data.marketed_gender === option.id ? 'border-purple-500 bg-white font-medium text-purple-700 shadow-sm' : 'border-gray-200 bg-white/60 text-gray-700 hover:border-purple-300'}`}>
                        {option.name}
                        {data.marketed_gender === option.id && <CheckCircle2 className="h-5 w-5 text-purple-600" />}
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {Object.keys(errors).length > 0 && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {Object.values(errors)[0]}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/70 px-6 py-5 sm:px-10">
            <button type="button" onClick={back} disabled={step === 1 || processing} className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            {step < 5 ? (
              <button type="button" onClick={next} className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition hover:bg-purple-700">
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button type="submit" disabled={processing} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition hover:from-purple-700 hover:to-pink-600 disabled:cursor-wait disabled:opacity-60">
                <Sparkles className="h-4 w-4" /> {processing ? 'Saving…' : savedPreferences ? 'Update my profile' : 'Find my fragrances'}
              </button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}
