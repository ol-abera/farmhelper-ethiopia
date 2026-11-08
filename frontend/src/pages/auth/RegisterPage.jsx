import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Leaf } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function RegisterPage() {
  const { register: doRegister } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { preferred_language: 'en', region: 'Oromia' },
  })

  const onSubmit = async (data) => {
    setServerError('')
    if (data.password !== data.password_confirm) {
      setServerError('Passwords do not match.')
      return
    }
    try {
      await doRegister({
        email: data.email,
        phone: data.phone || null,
        full_name: data.full_name,
        password: data.password,
        password_confirm: data.password_confirm,
        preferred_language: data.preferred_language,
        region: data.region,
        zone: data.zone || '',
        woreda: data.woreda || '',
        kebele: data.kebele || '',
      })
      navigate('/app')
    } catch (err) {
      const msg = err.response?.data
      if (typeof msg === 'object') {
        const first = Object.values(msg).flat()[0]
        setServerError(first || 'Registration failed.')
      } else {
        setServerError('Registration failed. Please try again.')
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-10">
        <Link to="/" className="mb-6 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest text-white">
            <Leaf className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold text-forest">FarmHelper Ethiopia</span>
        </Link>

        <div className="w-full max-w-lg rounded-2xl border border-beige bg-white p-6 sm:p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-forest">Create your account</h1>
          <p className="mt-1 text-sm text-muted">Start tracking your farm activities</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            {serverError && (
              <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{serverError}</div>
            )}

            <div>
              <label className="block text-sm font-medium">Full name *</label>
              <input
                className="mt-1 w-full rounded-lg border border-beige bg-cream px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                {...register('full_name', { required: 'Full name is required' })}
              />
              {errors.full_name && <p className="mt-1 text-xs text-red-600">{errors.full_name.message}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium">Email *</label>
                <input
                  type="email"
                  className="mt-1 w-full rounded-lg border border-beige bg-cream px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  {...register('email', { required: 'Email is required' })}
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium">Phone</label>
                <input
                  type="tel"
                  placeholder="+251..."
                  className="mt-1 w-full rounded-lg border border-beige bg-cream px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  {...register('phone')}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium">Password *</label>
                <input
                  type="password"
                  className="mt-1 w-full rounded-lg border border-beige bg-cream px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'At least 8 characters' } })}
                />
                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium">Confirm password *</label>
                <input
                  type="password"
                  className="mt-1 w-full rounded-lg border border-beige bg-cream px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  {...register('password_confirm', { required: 'Please confirm password' })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Preferred language</label>
              <select
                className="mt-1 w-full rounded-lg border border-beige bg-cream px-3 py-2.5 text-sm outline-none focus:border-primary"
                {...register('preferred_language')}
              >
                <option value="en">English</option>
                <option value="om">Afaan Oromoo</option>
                <option value="am">Amharic</option>
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium">Region</label>
                <input
                  className="mt-1 w-full rounded-lg border border-beige bg-cream px-3 py-2.5 text-sm outline-none focus:border-primary"
                  {...register('region')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Zone</label>
                <input
                  className="mt-1 w-full rounded-lg border border-beige bg-cream px-3 py-2.5 text-sm outline-none focus:border-primary"
                  {...register('zone')}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium">Woreda</label>
                <input
                  className="mt-1 w-full rounded-lg border border-beige bg-cream px-3 py-2.5 text-sm outline-none focus:border-primary"
                  {...register('woreda')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Kebele</label>
                <input
                  className="mt-1 w-full rounded-lg border border-beige bg-cream px-3 py-2.5 text-sm outline-none focus:border-primary"
                  {...register('kebele')}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-forest disabled:opacity-60 transition"
            >
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
