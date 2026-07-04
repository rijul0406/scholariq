import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import * as api from '../lib/api'
import type { SessionInput, StudySession } from '../lib/api'
import { SessionForm } from '../components/SessionForm'

export function DashboardPage() {
  const { user, token, logout } = useAuth()

  const [sessions, setSessions] = useState<StudySession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Load the user's sessions once, when the page mounts.
  useEffect(() => {
    if (!token) return
    api
      .listSessions(token)
      .then(setSessions)
      .catch(() => setError('Could not load sessions'))
      .finally(() => setLoading(false))
  }, [token])

  async function handleAdd(data: SessionInput) {
    if (!token) return
    const created = await api.createSession(token, data)
    // Put the new one on top (matches backend's newest-first order).
    setSessions((prev) => [created, ...prev])
  }

  async function handleDelete(id: number) {
    if (!token) return
    await api.deleteSession(token, id)
    setSessions((prev) => prev.filter((s) => s.id !== id))
  }

  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration_minutes, 0)

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex items-center justify-between border-b bg-white px-8 py-4">
        <h1 className="text-xl font-bold text-indigo-600">ScholarIQ</h1>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-slate-500">{user?.email}</span>
          <button
            onClick={logout}
            className="rounded border border-slate-300 px-3 py-1 hover:bg-slate-100"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 p-8">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">
            Study Sessions
          </h2>
          <p className="text-sm text-slate-500">
            {sessions.length} session{sessions.length === 1 ? '' : 's'} ·{' '}
            {totalMinutes} minutes total
          </p>
        </div>

        <SessionForm onAdd={handleAdd} />

        {error && <p className="text-sm text-red-600">{error}</p>}

        {loading ? (
          <p className="text-slate-400">Loading…</p>
        ) : sessions.length === 0 ? (
          <p className="text-slate-400">
            No sessions yet — add your first one above.
          </p>
        ) : (
          <ul className="space-y-2">
            {sessions.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between rounded-lg border bg-white p-4"
              >
                <div>
                  <p className="font-medium text-slate-800">{s.subject}</p>
                  <p className="text-sm text-slate-500">
                    {s.duration_minutes} min
                    {s.notes ? ` · ${s.notes}` : ''}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="text-sm text-red-500 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
