import { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { Sparkles, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
  });

  const [ showPassword, setShowPassword ] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    post('/auth/login', {
      onSuccess: () => {
        toast.success('Logged in successfully!');
      },
      onError: (errs) => {
        toast.error(errs.email || errs.password || 'Login failed.');
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl mb-2">Essence</h1>
            <p className="text-gray-600">Find Your Perfect Scent</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm mb-2 text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <span className="text-sm text-red-500 mt-1 block">{errors.email}</span>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm mb-2 text-gray-700">
                Password
              </label>
              <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-200'} focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition"
              >
                {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
              </button>
              </div>
              
              {errors.password && (
                <span className="text-sm text-red-500 mt-1 block">{errors.password}</span>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 rounded" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <Link href="/auth/forgot-password" className="text-purple-600 hover:text-purple-700">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition shadow-lg disabled:opacity-50"
            >
              {processing ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-purple-600 hover:text-purple-700">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}