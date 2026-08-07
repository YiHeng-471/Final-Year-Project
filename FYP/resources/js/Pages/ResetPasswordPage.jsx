import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';

export default function ResetPassword({ token, email }) {
  const { data, setData, post, processing, errors } = useForm({
    token: token,
    email: email || '',
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/auth/reset-password', {
      onSuccess: () => toast.success('Password updated! You can log in now.'),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">Set New Password</h2>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <input type="hidden" name="token" value={data.token} />

          <div>
            <label className="block text-sm mb-1 text-gray-700">Email Address</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200"
            />
            {errors.email && <span className="text-xs text-red-500 block mt-1">{errors.email}</span>}
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-700">New Password</label>
            <input
              type="password"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-200'}`}
            />
            {errors.password && <span className="text-xs text-red-500 block mt-1">{errors.password}</span>}
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-700">Confirm New Password</label>
            <input
              type="password"
              value={data.password_confirmation}
              onChange={(e) => setData('password_confirmation', e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border ${errors.password_confirmation ? 'border-red-500' : 'border-gray-200'}`}
            />
            {errors.password_confirmation && <span className="text-xs text-red-500 block mt-1">{errors.password}</span>}
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2.5 rounded-lg hover:from-purple-700 transition"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
