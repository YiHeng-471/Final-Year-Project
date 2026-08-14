import { useEffect, useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import Navigation from './Navigation';
import { CreditCard, MapPin, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const { cart = [], success = false } = usePage().props || {};
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 300 ? 0 : 15;
  const total = subtotal + shipping;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Submit checkout to server
    router.post('/checkout', {
      payment_method: 'card',
      address_id: null,
    }, {
      onSuccess: () => {
        toast.success('Order placed successfully!');
        router.visit('/checkout/success');
      }
    });
  };

  useEffect(() => {
    if (!success && cart.length === 0) router.visit('/cart');
  }, [cart.length, success]);

  if (success) {
    return <div className="min-h-screen bg-gray-50"><Navigation /><div className="mx-auto max-w-xl px-4 py-24 text-center"><Check className="mx-auto mb-5 h-16 w-16 text-green-600" /><h1 className="mb-3 text-3xl">Order placed successfully</h1><p className="text-gray-600">Your simulated payment and order have been recorded.</p></div></div>;
  }

  if (cart.length === 0) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl mb-4">Checkout</h1>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
                {step > 1 ? <Check className="w-5 h-5" /> : '1'}
              </div>
              <span className="text-sm">Shipping</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300" />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
                {step > 2 ? <Check className="w-5 h-5" /> : '2'}
              </div>
              <span className="text-sm">Payment</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300" />
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="text-sm">Review</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <div className="bg-white rounded-xl p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin className="w-6 h-6 text-purple-600" />
                    <h2 className="text-xl">Shipping Information</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-2">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm mb-2">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm mb-2">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-2">State</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-2">Zip Code</label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition"
                  >
                    Continue to Payment
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="bg-white rounded-xl p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <CreditCard className="w-6 h-6 text-purple-600" />
                    <h2 className="text-xl">Payment Information</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2">Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2">Cardholder Name</label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-2">Expiry Date</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-2">CVV</label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition"
                    >
                      Review Order
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="bg-white rounded-xl p-8 shadow-sm">
                  <h2 className="text-xl mb-6">Review Your Order</h2>

                  <div className="space-y-6 mb-6">
                    <div>
                      <h3 className="text-sm text-gray-500 mb-2">Shipping To</h3>
                      <p>
                        {formData.fullName}<br />
                        {formData.address}<br />
                        {formData.city}, {formData.state} {formData.zipCode}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm text-gray-500 mb-2">Payment Method</h3>
                      <p>Card ending in {formData.cardNumber.slice(-4)}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition"
                    >
                      Place Order
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h3 className="text-xl mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg flex items-center justify-center">
                      {item.image_url ? <img src={item.image_url} alt={item.name} className="h-full w-full rounded-lg object-cover" /> : null}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm mb-1">{item.name}</h4>
                      <p className="text-xs text-gray-500">
                        {item.size} × {item.quantity}
                      </p>
                      <p className="text-sm mt-1">
                        RM {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>RM {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `RM ${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-lg pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span>RM {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
