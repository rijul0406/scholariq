import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useAuth } from '../auth/AuthContext'
import * as api from '../lib/api'
import type { AnalyticsSummary } from '../lib/api'
import { Layout } from '../components/Layout'

// A tiny presentational card for a single headline number.
function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  )
}

export function AnalyticsPage() {
  const { token } = useAuth()
  const [data, setData] = useState<AnalyticsSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    api
      .getAnalytics(token)
      .then(setData)
      .finally(() => setLoading(false))
  }, [token])

  if (loading) {
    return (
      <Layout>
        <p className="text-slate-400">Loading…</p>
      </Layout>
    )
  }
  if (!data) return null

  const hours = (data.total_minutes / 60).toFixed(1)

  return (
    <Layout>
      <h2 className="text-2xl font-semibold text-slate-800">Analytics</h2>

      {/* Headline numbers */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total time" value={`${hours} h`} />
        <StatCard label="Sessions" value={String(data.session_count)} />
        <StatCard
          label="Goals done"
          value={`${data.goals_completed}/${data.goals_total}`}
        />
        <StatCard label="Subjects" value={String(data.by_subject.length)} />
      </div>

      {/* Bar chart: minutes per subject */}
      <div className="rounded-xl border bg-white p-4">
        <h3 className="mb-4 font-medium text-slate-700">Minutes by subject</h3>
        {data.by_subject.length === 0 ? (
          <p className="text-sm text-slate-400">
            No study sessions yet — add some to see your chart.
          </p>
        ) : (
          // ResponsiveContainer makes the chart fill its parent's width.
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.by_subject}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total_minutes" fill="#6366f1" name="Minutes" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Layout>
  )
}
