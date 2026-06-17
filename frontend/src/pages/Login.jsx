import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import Button from '../components/common/Button'
import FormField from '../components/common/FormField'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
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
      await login(form)
      navigate('/dashboard')
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-screen bg-slate-50 lg:grid-cols-[1fr_1.1fr]">
      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">Welcome back</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">Sign in to FinanceFlow</h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage your budget, transactions, and spending trends from a secure dashboard.
          </p>

          {error && <div className="mt-5 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
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
              name="password"
              onChange={updateField}
              placeholder="Enter your password"
              required
              type="password"
              value={form.password}
            />
            <Button className="w-full" disabled={loading} type="submit">
              {loading ? 'Signing in...' : 'Login'}
              <FiArrowRight />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            New here?{' '}
            <Link className="font-semibold text-emerald-700 hover:text-emerald-800" to="/register">
              Create an account
            </Link>
          </p>
        </div>
      </section>

      <section className="hidden items-center bg-gradient-to-br from-emerald-600 to-blue-600 px-12 text-white lg:flex">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-100">FinanceFlow</p>
          <h2 className="mt-5 max-w-xl text-5xl font-bold leading-tight">
            See exactly where your money goes every month.
          </h2>
          <p className="mt-6 max-w-lg text-lg text-emerald-50">
            Build better spending habits with budgets, category insights, and clean financial summaries.
          </p>
        </div>
      </section>
    </main>
  )
}
