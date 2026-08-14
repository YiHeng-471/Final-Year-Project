import { useState } from 'react'
import { useForm, Link } from '@inertiajs/react'
import { Sparkles, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

export default function RegisterPage({ states = [] }) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    street_address: '',
    postcode: '',
    state_id: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleRegister = (e) => {
    e.preventDefault()

    if (data.password !== data.password_confirmation) {
      toast.error('Passwords do not match')
      return
    }

    post('/auth/register', {
      onSuccess: () => toast.success('Account created — check your email for the verification code.'),
      onError: () => toast.error('Registration failed — check the highlighted fields.')
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl mb-2">Create Account</h1>
            <p className="text-gray-600">Start Your Fragrance Journey</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5" noValidate>
            <div>
              <label htmlFor="name" className="block text-sm mb-2 text-gray-700">Full Name</label>
              <input
                id="name"
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-200'} focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition`}
                placeholder="John Doe"
              />
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm mb-2 text-gray-700">Email Address</label>
              <input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm mb-2 text-gray-700">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-200'} focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition`}
                  placeholder="Create a password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="password_confirmation" className="block text-sm mb-2 text-gray-700">Confirm Password</label>
              <div className="relative">
                <input
                  id="password_confirmation"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={data.password_confirmation}
                  onChange={(e) => setData('password_confirmation', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.password_confirmation ? 'border-red-500' : 'border-gray-200'} focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition`}
                  placeholder="Confirm your password"
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition">
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password_confirmation && <p className="text-sm text-red-600 mt-1">{errors.password_confirmation}</p>}
            </div>

            <div>
              <label htmlFor="street_address" className="block text-sm mb-2 text-gray-700">Street Address</label>
              <input
                id="street_address"
                type="text"
                value={data.street_address}
                onChange={(e) => setData('street_address', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${errors.street_address ? 'border-red-500' : 'border-gray-200'} focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition`}
                placeholder="123 Fragrance Lane"
              />
              {errors.street_address && <p className="text-sm text-red-600 mt-1">{errors.street_address}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="postcode" className="block text-sm mb-2 text-gray-700">Postcode</label>
                <input
                  id="postcode"
                  type="text"
                  value={data.postcode}
                  onChange={(e) => setData('postcode', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.postcode ? 'border-red-500' : 'border-gray-200'} focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition`}
                  placeholder="43000"
                />
                {errors.postcode && <p className="text-sm text-red-600 mt-1">{errors.postcode}</p>}
              </div>

              <div>
                <label htmlFor="state_id" className="block text-sm mb-2 text-gray-700">State</label>
                <select
                  id="state_id"
                  value={data.state_id}
                  onChange={(e) => setData('state_id', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.state_id ? 'border-red-500' : 'border-gray-200'} focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition bg-white`}
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state.id} value={state.id}>{state.name}</option>
                  ))}
                </select>
                {errors.state_id && <p className="text-sm text-red-600 mt-1">{errors.state_id}</p>}
              </div>
            </div>

            <button type="submit" disabled={processing} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition shadow-lg">
              {processing ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-purple-600 hover:text-purple-700">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
