import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export function LandingPage() {
  const { user, isLoading } = useAuth()

  // If already logged in, skip the landing page and go straight to the app.
  if (!isLoading && user) return <Navigate to="/dashboard" replace />

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-neutral-950 to-black text-slate-100">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-5 sm:px-10">
        <span className="text-xl font-bold text-white">ScholarIQ</span>
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 hover:text-white"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-900 shadow-sm transition hover:bg-slate-200"
          >
            Sign up
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <h1 className="text-6xl font-extrabold tracking-tight sm:text-8xl">
          <span className="bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
            ScholarIQ
          </span>
        </h1>

        <p className="mt-8 max-w-xl text-xl text-slate-400">
          Track your study sessions, set goals, and see the patterns behind your
          progress — all in one clean dashboard.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/register"
            className="rounded-xl bg-white px-8 py-3 font-semibold text-neutral-900 shadow-lg shadow-white/10 transition hover:bg-slate-200"
          >
            Get started
          </Link>
          <Link
            to="/login"
            className="rounded-xl border border-neutral-700 bg-neutral-900 px-8 py-3 font-semibold text-slate-200 transition hover:bg-neutral-800"
          >
            I already have an account
          </Link>
        </div>

        {/* Feature highlights */}
        <div className="mt-16 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: '📚', title: 'Study Sessions', desc: 'Log what you study and for how long.' },
            { icon: '🎯', title: 'Goals', desc: 'Set targets and track completion.' },
            { icon: '📊', title: 'Analytics', desc: 'Visualize your time by subject.' },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left shadow-sm backdrop-blur"
            >
              <div className="text-2xl">{f.icon}</div>
              <h3 className="mt-3 font-semibold text-slate-100">{f.title}</h3>
              <p className="mt-1 text-sm text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="px-6 py-6 text-center text-sm text-slate-500">
        ScholarIQ · Built with React, FastAPI &amp; PostgreSQL
      </footer>
    </div>
  )
}
