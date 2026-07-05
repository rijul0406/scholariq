import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

// Shared page frame: a header with nav + logout, then the page content.
// Both DashboardPage and GoalsPage render inside this, so the header lives in
// one place instead of being copy-pasted.
export function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()

  // NavLink gives us an `isActive` flag so we can highlight the current page.
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'font-medium text-indigo-600'
      : 'text-slate-500 hover:text-slate-800'

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex items-center justify-between border-b bg-white px-8 py-4">
        <div className="flex items-center gap-6">
          <span className="text-xl font-bold text-indigo-600">ScholarIQ</span>
          <nav className="flex gap-4 text-sm">
            <NavLink to="/dashboard" className={linkClass}>
              Sessions
            </NavLink>
            <NavLink to="/goals" className={linkClass}>
              Goals
            </NavLink>
            <NavLink to="/analytics" className={linkClass}>
              Analytics
            </NavLink>
          </nav>
        </div>
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

      <main className="mx-auto max-w-3xl space-y-6 p-8">{children}</main>
    </div>
  )
}
