import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Leaf, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()

  const onSubmit = async (data) => {
    setServerError('')
    try {
      await login(data.email, data.password)
      navigate('/app')
    } catch (err) {
      setServerError(err.response?.data?.detail || 'Login failed. Check your email and password.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <Link to="/" className="mb-8 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest text-white">
            <Leaf className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold text-forest">FarmHelper Ethiopia</span>
        </Link>

        <div className="w-full max-w-md rounded-2xl border border-beige bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-forest">Welcome back</h1>
          <p className="mt-1 text-sm text-muted">Log in to manage your farms</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            {serverError && (
              <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{serverError}</div>
            )}

            <div>
              <label className="block text-sm font-medium text-charcoal">Email</label>
              <input
                type="email"
                autoComplete="email"
                className="mt-1 w-full rounded-lg border border-beige bg-cream px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal">Password</label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-beige bg-cream px-3 py-2.5 pr-10 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  {...register('password', { required: 'Password is required' })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-charcoal"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-forest disabled:opacity-60 transition"
            >
              {isSubmitting ? 'Logging in…' : 'Log in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            No account yet?{' '}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
