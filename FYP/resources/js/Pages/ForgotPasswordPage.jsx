import { useForm, Link } from '@inertiajs/react';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/auth/forgot-password', {
            onSuccess: () => toast.success(status || 'Reset link sent to your inbox!'),
        });
    }

    return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-3">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-semibold">Reset Password</h2>
          <p className="text-sm text-gray-500 mt-1">We will send a link to restore your account.</p>
        </div>

        {status && <div className="mb-4 text-sm font-medium text-green-600 bg-green-50 p-3 rounded-lg">{status}</div>}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-gray-700">Email Address</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:border-purple-500 outline-none transition`}
              placeholder="you@example.com"
            />
            {errors.email && <span className="text-xs text-red-500 mt-1 block">{errors.email}</span>}
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2.5 rounded-lg hover:from-purple-700 transition disabled:opacity-50"
          >
            {processing ? 'Sending Link...' : 'Send Password Reset Link'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <Link href="/auth/login" className="text-purple-600 hover:underline">Back to Sign In</Link>
        </div>
      </div>
    </div>
  );
}