import { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import EssenceLayout from '@/Layouts/EssenceLayout';

const scentOptions = [
    { label: 'Floral', value: 'Floral', description: 'Romantic, feminine, elegant', icon: '🌸' },
    { label: 'Woody', value: 'Woody', description: 'Warm, sophisticated, earthy', icon: '🌲' },
    { label: 'Fresh', value: 'Fresh', description: 'Clean, crisp, energizing', icon: '🌿' },
    { label: 'Oriental', value: 'Oriental', description: 'Exotic, spicy, luxurious', icon: '✨' },
    { label: 'Citrus', value: 'Citrus', description: 'Bright, zesty, uplifting', icon: '🍊' },
    { label: 'Aquatic', value: 'Aquatic', description: 'Cool, marine, refreshing', icon: '🌊' },
];

const occasionOptions = [
    { label: 'Daily Wear', value: 'Daily Wear', description: 'For everyday use', icon: '☀️' },
    { label: 'Work/Office', value: 'Work/Office', description: 'Professional settings', icon: '💼' },
    { label: 'Evening/Night', value: 'Evening/Night', description: 'Dinner, parties', icon: '🌙' },
    { label: 'Special Occasions', value: 'Special Occasions', description: 'Weddings, events', icon: '🎉' },
    { label: 'Sport/Active', value: 'Sport/Active', description: 'Gym, outdoors', icon: '⚡' },
    { label: 'Date Night', value: 'Date Night', description: 'Romantic occasions', icon: '💖' },
];

const genderOptions = [
    { label: 'Men', value: 'Men', icon: '👨' },
    { label: 'Women', value: 'Women', icon: '👩' },
    { label: 'Unisex', value: 'Unisex', icon: '✨' },
];

const budgetOptions = [
    { label: 'Budget Friendly', value: 'Budget Friendly', description: 'RM 50 - RM 150', icon: '💵' },
    { label: 'Mid-Range', value: 'Mid-Range', description: 'RM 150 - RM 350', icon: '🪙' },
    { label: 'Premium', value: 'Premium', description: 'RM 350 - RM 600', icon: '💎' },
    { label: 'Luxury', value: 'Luxury', description: 'RM 600+', icon: '👑' },
];

export default function Quiz() {
    const [step, setStep] = useState(1);
    const [selectedScents, setSelectedScents] = useState([]);
    const [selectedOccasions, setSelectedOccasions] = useState([]);
    const [selectedGender, setSelectedGender] = useState('');
    const [selectedBudget, setSelectedBudget] = useState('');
    const [formError, setFormError] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        family: '',
        occasion: '',
        gender: '',
        budget: '',
    });

    const toggleSelection = (value, selected, setSelected) => {
        setSelected(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]);
    };

    const handleNext = () => {
        setFormError('');

        if (step === 1 && selectedScents.length === 0) {
            setFormError('Please choose at least one scent type.');
            return;
        }

        if (step === 2 && selectedOccasions.length === 0) {
            setFormError('Please choose at least one occasion.');
            return;
        }

        if (step === 3 && !selectedGender) {
            setFormError('Please choose a category.');
            return;
        }

        if (step === 4 && !selectedBudget) {
            setFormError('Please choose your preferred budget.');
            return;
        }

        if (step === 4) {
            submitQuiz();
            return;
        }

        setStep((current) => current + 1);
    };

    const handleBack = () => {
        setFormError('');
        if (step > 1) {
            setStep((current) => current - 1);
        }
    };

    const submitQuiz = () => {
        setData('family', selectedScents.join(', '));
        setData('occasion', selectedOccasions.join(', '));
        setData('gender', selectedGender);
        setData('budget', selectedBudget);

        post('/quiz/submit', {
            onError: () => {
                setFormError('Please review your answers and try again.');
            },
        });
    };

    const stepTitle = {
        1: 'What scent types do you prefer?',
        2: 'When will you wear this fragrance?',
        3: 'Which category do you prefer?',
        4: "What's your budget?",
    };

    const stepSubtitle = {
        1: 'Select all that appeal to you',
        2: 'Select all occasions that apply',
        3: 'Choose one',
        4: 'Select your preferred price range',
    };

    return (
        <EssenceLayout>
            <Head title="Find Your Perfect Scent" />

            <div className="mx-auto max-w-5xl space-y-8">
                <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-600">Find Your Perfect Scent</p>
                            <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900">Take our fragrance quiz</h1>
                            <p className="mt-4 max-w-2xl text-slate-500">Answer a few quick questions and we’ll recommend the ideal perfumes for your style.</p>
                        </div>
                        <div className="w-full lg:w-72 rounded-full bg-slate-100 p-4 text-center text-sm font-semibold text-slate-700">
                            Step {step} of 4
                        </div>
                    </div>

                    <div className="mt-8 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                        <div className={`h-full rounded-full bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-300 ${
                            step === 1 ? 'w-1/4' : step === 2 ? 'w-2/4' : step === 3 ? 'w-3/4' : 'w-full'
                        }`} />
                    </div>

                    <div className="mt-10 space-y-6">
                        <div>
                            <h2 className="text-2xl font-semibold text-slate-900">{stepTitle[step]}</h2>
                            <p className="mt-2 text-sm text-slate-500">{stepSubtitle[step]}</p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {step === 1 && scentOptions.map((option) => {
                                const selected = selectedScents.includes(option.value);
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => toggleSelection(option.value, selectedScents, setSelectedScents)}
                                        className={`rounded-3xl border p-6 text-left transition ${selected ? 'border-purple-500 bg-purple-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">{option.icon}</span>
                                            <div>
                                                <p className="font-semibold text-slate-900">{option.label}</p>
                                                <p className="mt-1 text-sm text-slate-500">{option.description}</p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}

                            {step === 2 && occasionOptions.map((option) => {
                                const selected = selectedOccasions.includes(option.value);
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => toggleSelection(option.value, selectedOccasions, setSelectedOccasions)}
                                        className={`rounded-3xl border p-6 text-left transition ${selected ? 'border-purple-500 bg-purple-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">{option.icon}</span>
                                            <div>
                                                <p className="font-semibold text-slate-900">{option.label}</p>
                                                <p className="mt-1 text-sm text-slate-500">{option.description}</p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}

                            {step === 3 && genderOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setSelectedGender(option.value)}
                                    className={`rounded-3xl border p-6 text-left transition ${selectedGender === option.value ? 'border-purple-500 bg-purple-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">{option.icon}</span>
                                        <div>
                                            <p className="font-semibold text-slate-900">{option.label}</p>
                                        </div>
                                    </div>
                                </button>
                            ))}

                            {step === 4 && budgetOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setSelectedBudget(option.value)}
                                    className={`rounded-3xl border p-6 text-left transition ${selectedBudget === option.value ? 'border-purple-500 bg-purple-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">{option.icon}</span>
                                        <div>
                                            <p className="font-semibold text-slate-900">{option.label}</p>
                                            <p className="mt-1 text-sm text-slate-500">{option.description}</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {(formError || errors.family || errors.occasion || errors.gender) && (
                            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                {formError || errors.family || errors.occasion || errors.gender}
                            </div>
                        )}

                        <div className="flex items-center justify-between gap-4">
                            <button
                                type="button"
                                onClick={handleBack}
                                disabled={step === 1 || processing}
                                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={handleNext}
                                disabled={processing}
                                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-200/40 transition hover:opacity-95 disabled:opacity-50"
                            >
                                {step === 4 ? (processing ? 'Getting recommendations...' : 'Get Recommendations') : 'Next'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </EssenceLayout>
    );
}
