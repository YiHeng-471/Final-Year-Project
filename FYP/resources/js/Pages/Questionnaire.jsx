import { useState } from 'react';
import { useForm, Head, router } from '@inertiajs/react';
import { useApp } from '../AppContext';
import Navigation from './Navigation';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { toast } from 'sonner';

const scentTypes = [
  { id: 'floral', name: 'Floral', description: 'Romantic, feminine, elegant', emoji: '🌸' },
  { id: 'woody', name: 'Woody', description: 'Warm, sophisticated, earthy', emoji: '🌲' },
  { id: 'fresh', name: 'Fresh', description: 'Clean, crisp, energizing', emoji: '🍃' },
  { id: 'oriental', name: 'Oriental', description: 'Exotic, spicy, luxurious', emoji: '✨' },
  { id: 'citrus', name: 'Citrus', description: 'Bright, zesty, uplifting', emoji: '🍊' },
  { id: 'aquatic', name: 'Aquatic', description: 'Cool, marine, refreshing', emoji: '🌊' },
];

const occasions = [
  { id: 'daily', name: 'Daily Wear', description: 'For everyday use', emoji: '☀️' },
  { id: 'work', name: 'Work/Office', description: 'Professional settings', emoji: '💼' },
  { id: 'evening', name: 'Evening/Night', description: 'Dinner, parties', emoji: '🌙' },
  { id: 'special', name: 'Special Occasions', description: 'Weddings, events', emoji: '🎉' },
  { id: 'sport', name: 'Sport/Active', description: 'Gym, outdoors', emoji: '⚡' },
  { id: 'romantic', name: 'Date Night', description: 'Romantic occasions', emoji: '❤️' },
];

const genderOptions = [
  { id: 'men', name: 'Men', emoji: '👨' },
  { id: 'women', name: 'Women', emoji: '👩' },
  { id: 'unisex', name: 'Unisex', emoji: '🌟' },
];

const priceRanges = [
  { id: 'budget', name: 'Budget Friendly', range: 'RM 50 - RM 150', emoji: '💵' },
  { id: 'mid', name: 'Mid-Range', range: 'RM 150 - RM 350', emoji: '💰' },
  { id: 'premium', name: 'Premium', range: 'RM 350 - RM 600', emoji: '💎' },
  { id: 'luxury', name: 'Luxury', range: 'RM 600+', emoji: '👑' },
];

export default function QuestionnaireFlow() {
  const [step, setStep] = useState(1);
  const [selectedScents, setSelectedScents] = useState([]);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const { updateUserPreferences } = useApp();

  const totalSteps = 4;

  const handleNext = () => {
    if (step === 1 && selectedScents.length === 0) {
      toast.error('Please select at least one scent type');
      return;
    }
    if (step === 2 && selectedOccasions.length === 0) {
      toast.error('Please select at least one occasion');
      return;
    }
    if (step === 3 && !selectedGender) {
      toast.error('Please select a gender preference');
      return;
    }
    if (step === 4 && !selectedPriceRange) {
      toast.error('Please select a price range');
      return;
    }

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleSelection = (id, list, setList) => {
    if (list.includes(id)) {
      setList(list.filter(item => item !== id));
    } else {
      setList([...list, id]);
    }
  };    

  const handleSubmit = () => {
    const preferences = {
      scentTypes: selectedScents,
      occasions: selectedOccasions,
      gender: selectedGender,
      priceRange: selectedPriceRange,
    };
    updateUserPreferences(preferences);
    toast.success('Preferences saved! Redirecting to recommendations...');
    setTimeout(() => {
      router.visit('/products');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl">Find Your Perfect Scent</h1>
            <span className="text-sm text-gray-500">
              Step {step} of {totalSteps}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {step === 1 && (
            <div>
              <h2 className="text-2xl mb-2">What scent types do you prefer?</h2>
              <p className="text-gray-600 mb-6">Select all that appeal to you</p>
              <div className="grid md:grid-cols-2 gap-4">
                {scentTypes.map((scent) => (
                  <button
                    key={scent.id}
                    onClick={() => toggleSelection(scent.id, selectedScents, setSelectedScents)}
                    className={`p-4 rounded-xl border-2 text-left transition ${
                      selectedScents.includes(scent.id)
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{scent.emoji}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="mb-1">{scent.name}</h3>
                          {selectedScents.includes(scent.id) && (
                            <Check className="w-5 h-5 text-purple-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{scent.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl mb-2">When will you wear this fragrance?</h2>
              <p className="text-gray-600 mb-6">Select all occasions that apply</p>
              <div className="grid md:grid-cols-2 gap-4">
                {occasions.map((occasion) => (
                  <button
                    key={occasion.id}
                    onClick={() => toggleSelection(occasion.id, selectedOccasions, setSelectedOccasions)}
                    className={`p-4 rounded-xl border-2 text-left transition ${
                      selectedOccasions.includes(occasion.id)
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{occasion.emoji}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="mb-1">{occasion.name}</h3>
                          {selectedOccasions.includes(occasion.id) && (
                            <Check className="w-5 h-5 text-purple-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{occasion.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl mb-2">Which category do you prefer?</h2>
              <p className="text-gray-600 mb-6">Choose one</p>
              <div className="grid md:grid-cols-3 gap-4">
                {genderOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedGender(option.id)}
                    className={`p-6 rounded-xl border-2 text-center transition ${
                      selectedGender === option.id
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <span className="text-5xl mb-3 block">{option.emoji}</span>
                    <h3>{option.name}</h3>
                    {selectedGender === option.id && (
                      <Check className="w-5 h-5 text-purple-600 mx-auto mt-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-2xl mb-2">What's your budget?</h2>
              <p className="text-gray-600 mb-6">Select your preferred price range</p>
              <div className="grid md:grid-cols-2 gap-4">
                {priceRanges.map((price) => (
                  <button
                    key={price.id}
                    onClick={() => setSelectedPriceRange(price.id)}
                    className={`p-6 rounded-xl border-2 text-left transition ${
                      selectedPriceRange === price.id
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-4xl">{price.emoji}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="mb-1">{price.name}</h3>
                          {selectedPriceRange === price.id && (
                            <Check className="w-5 h-5 text-purple-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{price.range}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition"
            >
              {step === totalSteps ? 'Get Recommendations' : 'Next'}
              {step < totalSteps && <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
