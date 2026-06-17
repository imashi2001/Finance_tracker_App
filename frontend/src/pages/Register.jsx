import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { FiUserPlus } from 'react-icons/fi'
import Button from '../components/common/Button'
import FormField from '../components/common/FormField'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { isAuthenticated, register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await register(form)
      navigate('/dashboard')
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-screen bg-slate-50 lg:grid-cols-[1.1fr_1fr]">
      <section className="hidden items-center bg-gradient-to-br from-blue-600 to-emerald-600 px-12 text-white lg:flex">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">Personal finance</p>
          <h2 className="mt-5 max-w-xl text-5xl font-bold leading-tight">
            Build your money dashboard in minutes.
          </h2>
          <p className="mt-6 max-w-lg text-lg text-blue-50">
            Add income, expenses, monthly budgets, and custom categories to start tracking today.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">Create account</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">Start using FinanceFlow</h1>
          <p className="mt-2 text-sm text-slate-500">Your financial data stays private inside your account.</p>

          {error && <div className="mt-5 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <FormField
              label="Full name"
              name="name"
              onChange={updateField}
              placeholder="Your name"
              required
              value={form.name}
            />
            <FormField
              label="Email address"
              name="email"
              onChange={updateField}
              placeholder="you@example.com"
              required
              type="email"
              value={form.email}
            />
            <FormField
              label="Password"
              minLength="6"
              name="password"
              onChange={updateField}
              placeholder="Minimum 6 characters"
              required
              type="password"
              value={form.password}
            />
            <Button className="w-full" disabled={loading} type="submit">
              {loading ? 'Creating account...' : 'Register'}
              <FiUserPlus />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already registered?{' '}
            <Link className="font-semibold text-emerald-700 hover:text-emerald-800" to="/login">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
