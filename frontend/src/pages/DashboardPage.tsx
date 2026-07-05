import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import * as api from '../lib/api'
import type { SessionInput, StudySession } from '../lib/api'
import { SessionForm } from '../components/SessionForm'
import { Layout } from '../components/Layout'

export function DashboardPage() {
  const { token } = useAuth()

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
    <Layout>
      <div>
        <h2 className="text-2xl font-semibold text-slate-100">Study Sessions</h2>
        <p className="text-sm text-slate-400">
          {sessions.length} session{sessions.length === 1 ? '' : 's'} ·{' '}
          {totalMinutes} minutes total
        </p>
      </div>

      <SessionForm onAdd={handleAdd} />

      {error && <p className="text-sm text-red-400">{error}</p>}

      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : sessions.length === 0 ? (
        <p className="text-slate-500">No sessions yet — add your first one above.</p>
      ) : (
        <ul className="space-y-2">
          {sessions.map((s) => (
            <li
              key={s.id}
              className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900 p-4"
            >
              <div>
                <p className="font-medium text-slate-100">{s.subject}</p>
                <p className="text-sm text-slate-400">
                  {s.duration_minutes} min
                  {s.notes ? ` · ${s.notes}` : ''}
                </p>
              </div>
              <button
                onClick={() => handleDelete(s.id)}
                className="text-sm text-red-400 hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </Layout>
  )
}
