// Wraps pages that require login. If there's no logged-in user, redirect to
// /login; otherwise render the page (passed as `children`).

import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../auth/AuthContext'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth()

  // While we're still checking the saved token, don't flash the login page.
  if (isLoading) return <p className="p-8 text-center">Loading…</p>

  // <Navigate> performs a client-side redirect (no full page reload).
  if (!user) return <Navigate to="/login" replace />

  return <>{children}</>
}
