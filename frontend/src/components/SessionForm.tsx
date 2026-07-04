import { useState, type FormEvent } from 'react'
import type { SessionInput } from '../lib/api'

// A presentational form: it just collects input and calls onAdd. It doesn't
// know about the API or the list — that keeps it reusable and easy to reason
// about. (The parent handles the actual create.)
export function SessionForm({
  onAdd,
}: {
  onAdd: (data: SessionInput) => Promise<void>
}) {
  const [subject, setSubject] = useState('')
  const [duration, setDuration] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onAdd({
        subject,
        duration_minutes: Number(duration),
        notes: notes || null,
      })
      // Clear the form on success.
      setSubject('')
      setDuration('')
      setNotes('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-end gap-3 rounded-xl border bg-white p-4"
    >
      <label className="flex flex-col text-sm">
        Subject
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          className="rounded border border-slate-300 p-2"
        />
      </label>
      <label className="flex flex-col text-sm">
        Minutes
        <input
          type="number"
          min={1}
          max={1440}
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
          className="w-28 rounded border border-slate-300 p-2"
        />
      </label>
      <label className="flex flex-1 flex-col text-sm">
        Notes (optional)
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="rounded border border-slate-300 p-2"
        />
      </label>
      <button
        type="submit"
        disabled={submitting}
        className="rounded bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {submitting ? 'Adding…' : 'Add session'}
      </button>
    </form>
  )
}
