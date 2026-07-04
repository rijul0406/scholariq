// Global auth state shared with the whole app via React Context.
// Any component can call useAuth() to read the current user or log in/out.

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import * as api from '../lib/api'
import type { User } from '../lib/api'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  // Read any saved token on first load so a refresh keeps you logged in.
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('token'),
  )
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Whenever we have a token, fetch the matching user (validates the token too).
  useEffect(() => {
    if (!token) {
      setUser(null)
      setIsLoading(false)
      return
    }
    api
      .getMe(token)
      .then(setUser)
      .catch(() => {
        // Token invalid/expired — clear it.
        localStorage.removeItem('token')
        setToken(null)
      })
      .finally(() => setIsLoading(false))
  }, [token])

  async function login(email: string, password: string) {
    const newToken = await api.login(email, password)
    // Load the user BEFORE login() resolves. Otherwise there's a race: the
    // caller navigates to /dashboard while `user` is still null, and
    // ProtectedRoute bounces back to /login. Fetching here guarantees `user`
    // is set by the time navigation happens.
    const me = await api.getMe(newToken)
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(me)
  }

  function logout() {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const value: AuthState = { user, token, isLoading, login, logout }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Convenience hook so components do `const { user } = useAuth()`.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
