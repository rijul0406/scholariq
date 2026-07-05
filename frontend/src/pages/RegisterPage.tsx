import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as api from '../lib/api'
import { useAuth } from '../auth/AuthContext'

export function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await api.register(email, password) // create the account
      await login(email, password) // then log them straight in
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-neutral-950 to-black px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-xl border border-neutral-800 bg-neutral-900 p-8 shadow-xl"
      >
        <h1 className="text-2xl font-bold text-slate-100">Create account</h1>

        {error && (
          <p className="rounded bg-red-950 p-2 text-sm text-red-400">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded border border-neutral-700 bg-neutral-800 p-2 text-slate-100 placeholder-slate-500 focus:border-slate-400 focus:outline-none"
        />
        <input
          type="password"
          placeholder="Password (min 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="w-full rounded border border-neutral-700 bg-neutral-800 p-2 text-slate-100 placeholder-slate-500 focus:border-slate-400 focus:outline-none"
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded bg-white p-2 font-medium text-neutral-900 transition hover:bg-slate-200 disabled:opacity-50"
        >
          {submitting ? 'Creating…' : 'Create account'}
        </button>

        <p className="text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-white hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  )
}
