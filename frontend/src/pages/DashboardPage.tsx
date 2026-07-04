import { useAuth } from '../auth/AuthContext'

export function DashboardPage() {
  // This page is only reachable when logged in (see ProtectedRoute), so `user`
  // is guaranteed to exist here.
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex items-center justify-between border-b bg-white px-8 py-4">
        <h1 className="text-xl font-bold text-indigo-600">ScholarIQ</h1>
        <button
          onClick={logout}
          className="rounded border border-slate-300 px-3 py-1 text-sm hover:bg-slate-100"
        >
          Log out
        </button>
      </header>

      <main className="mx-auto max-w-3xl p-8">
        <h2 className="text-2xl font-semibold text-slate-800">Dashboard</h2>
        <p className="mt-2 text-slate-600">
          Welcome, <strong>{user?.email}</strong> 👋
        </p>
        <p className="mt-6 text-sm text-slate-400">
          Study sessions, goals, and analytics will live here (steps 8–10).
        </p>
      </main>
    </div>
  )
}
