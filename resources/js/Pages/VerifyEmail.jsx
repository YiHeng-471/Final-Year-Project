import { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { toast } from 'sonner';

export default function VerifyEmail() {
  const { email } = usePage().props || {};
  const [code, setCode] = useState('');

  const handleVerify = (e) => {
    e.preventDefault();
    router.post('/verify', { email, code }, {
      onSuccess: () => {
        toast.success('Email verified! Redirecting...');
      },
      onError: () => {
        toast.error('Invalid code');
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl mb-4">Verify your email</h2>
          <p className="text-sm text-gray-600 mb-6">We sent a 6-digit code to {email}</p>

          <form onSubmit={handleVerify} className="space-y-4">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter verification code"
              className="w-full px-4 py-3 rounded-lg border border-gray-200"
              required
            />

            <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg">
              Verify
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
