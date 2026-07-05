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
    isActive ? 'font-medium text-white' : 'text-slate-400 hover:text-white'

  return (
    <div className="min-h-screen bg-neutral-950 text-slate-100">
      <header className="flex items-center justify-between border-b border-neutral-800 bg-black px-8 py-4">
        <div className="flex items-center gap-6">
          <span className="text-xl font-bold text-white">ScholarIQ</span>
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
          <span className="text-slate-400">{user?.email}</span>
          <button
            onClick={logout}
            className="rounded border border-neutral-700 px-3 py-1 text-slate-200 hover:bg-neutral-800"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 p-8">{children}</main>
    </div>
  )
}
