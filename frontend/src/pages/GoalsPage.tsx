import { useEffect, useState, type FormEvent } from 'react'
import { useAuth } from '../auth/AuthContext'
import * as api from '../lib/api'
import type { Goal } from '../lib/api'
import { Layout } from '../components/Layout'

export function GoalsPage() {
  const { token } = useAuth()

  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Form state (inline this time — it's just two fields).
  const [title, setTitle] = useState('')
  const [target, setTarget] = useState('')

  useEffect(() => {
    if (!token) return
    api
      .listGoals(token)
      .then(setGoals)
      .catch(() => setError('Could not load goals'))
      .finally(() => setLoading(false))
  }, [token])

  async function handleAdd(e: FormEvent) {
    e.preventDefault()
    if (!token) return
    const created = await api.createGoal(token, {
      title,
      target_minutes: Number(target),
    })
    setGoals((prev) => [created, ...prev])
    setTitle('')
    setTarget('')
  }

  async function handleToggle(goal: Goal) {
    if (!token) return
    const updated = await api.updateGoal(token, goal.id, {
      is_completed: !goal.is_completed,
    })
    // Replace the one goal that changed, keep the rest.
    setGoals((prev) => prev.map((g) => (g.id === updated.id ? updated : g)))
  }

  async function handleDelete(id: number) {
    if (!token) return
    await api.deleteGoal(token, id)
    setGoals((prev) => prev.filter((g) => g.id !== id))
  }

  const completedCount = goals.filter((g) => g.is_completed).length
  const inputClass =
    'rounded border border-neutral-700 bg-neutral-800 p-2 text-slate-100 placeholder-slate-500 focus:border-slate-400 focus:outline-none'

  return (
    <Layout>
      <div>
        <h2 className="text-2xl font-semibold text-slate-100">Goals</h2>
        <p className="text-sm text-slate-400">
          {completedCount} of {goals.length} completed
        </p>
      </div>

      <form
        onSubmit={handleAdd}
        className="flex flex-wrap items-end gap-3 rounded-xl border border-neutral-800 bg-neutral-900 p-4"
      >
        <label className="flex flex-1 flex-col text-sm text-slate-300">
          Goal
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={inputClass}
          />
        </label>
        <label className="flex flex-col text-sm text-slate-300">
          Target minutes
          <input
            type="number"
            min={1}
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            required
            className={`w-32 ${inputClass}`}
          />
        </label>
        <button
          type="submit"
          className="rounded bg-white px-4 py-2 font-medium text-neutral-900 transition hover:bg-slate-200"
        >
          Add goal
        </button>
      </form>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : goals.length === 0 ? (
        <p className="text-slate-500">No goals yet — add one above.</p>
      ) : (
        <ul className="space-y-2">
          {goals.map((g) => (
            <li
              key={g.id}
              className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900 p-4"
            >
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={g.is_completed}
                  onChange={() => handleToggle(g)}
                  className="h-4 w-4 accent-white"
                />
                <span
                  className={
                    g.is_completed
                      ? 'text-slate-500 line-through'
                      : 'text-slate-100'
                  }
                >
                  {g.title}{' '}
                  <span className="text-sm text-slate-500">
                    ({g.target_minutes} min)
                  </span>
                </span>
              </label>
              <button
                onClick={() => handleDelete(g.id)}
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
