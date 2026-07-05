import { Navigate, Route, Routes } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { GoalsPage } from './pages/GoalsPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { ProtectedRoute } from './components/ProtectedRoute'

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
            <AnalyticsPage />
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
