import { usePage, useForm } from '@inertiajs/react';
import { toast } from 'sonner';

export default function VerifyEmail() {
  const { email } = usePage().props || {};
  const { data, setData, post, processing, errors } = useForm({
    email: email || '',
    code: '',
  });

  const handleVerify = (e) => {
    e.preventDefault();
    post('/auth/verify', {
      onSuccess: () => toast.success('Email verified. Redirecting...'),
      onError: (errs) => toast.error(errs.code || errs.email || 'Invalid verification request.'),
    });
  };

  const handleResend = () => {
    post('/auth/verify/resend', {
      onSuccess: () => toast.success('Verification code resent.'),
      onError: (errs) => toast.error(errs.email || 'Failed to dispatch code. Please try again.'),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl mb-4">Verify your email</h2>
          <p className="text-sm text-gray-600 mb-6">We sent a 6-digit code to {email}</p>

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <input
                type="text"
                maxLength={6}
                value={data.code}
                onChange={(e) => setData('code', e.target.value.replace(/\D/g, ''))}
                placeholder="Enter verification code"
                className={`w-full px-4 py-3 rounded-lg border text-center text-xl tracking-widest font-mono ${errors.code ? 'border-red-500 bg-red-50' : 'border-gray-200'} focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition disabled:opacity-60`}
              />
              {errors.code && (
                  <span className="text-sm text-red-500 mt-1.5 block text-center font-medium">{errors.code}</span>
              )}
            </div>

            <button 
              type="submit"
              disabled={processing || data.code.length !== 6}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition font-medium shadow-md disabled:opacity-50"
            >
              {processing ? 'Verifying Code...' : 'Verify Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-500">
              Didn't receive the email?{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={processing}
                className="text-purple-600 hover:text-purple-700 font-medium hover:underline focus:outline-none disabled:opacity-40"
              >
                Resend Code
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
