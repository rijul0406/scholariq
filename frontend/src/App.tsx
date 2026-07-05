import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { GoalsPage } from './pages/GoalsPage'
import { ProtectedRoute } from './components/ProtectedRoute'

// Lazy-load the Analytics page: its charting library (Recharts) is large, so we
// only download that code when the user actually opens /analytics. This keeps
// the initial page load small (code-splitting).
const AnalyticsPage = lazy(() =>
  import('./pages/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage })),
)

// The URL -> page map. <Routes> renders whichever <Route> matches the URL.
function App() {
  return (
    <Routes>
      {/* Public landing page at the root. */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected pages: require login (ProtectedRoute redirects otherwise). */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/goals"
        element={
          <ProtectedRoute>
            <GoalsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            {/* Suspense shows a fallback while the lazy chunk downloads. */}
            <Suspense
              fallback={<p className="p-8 text-center text-slate-500">Loading…</p>}
            >
              <AnalyticsPage />
            </Suspense>
          </ProtectedRoute>
        }
      />

      {/* Anything else -> send to the dashboard (which itself redirects to
          /login if you're not authenticated). */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
