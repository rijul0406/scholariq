// The single place that knows how to talk to our FastAPI backend.
// Keeping all fetch() calls here (not scattered in components) means one place
// to change the URL, headers, error handling, etc.

const API_URL = 'http://127.0.0.1:8000'

// Shape of a user as the backend returns it (matches UserRead in Python).
export interface User {
  id: number
  email: string
  created_at: string
}

// POST /auth/register  — create an account. Body is JSON.
export async function register(email: string, password: string): Promise<User> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail ?? 'Registration failed')
  }
  return res.json()
}

// POST /auth/login — get a JWT. The backend uses OAuth2's form format, so we
// send URL-encoded fields (username + password), not JSON.
export async function login(email: string, password: string): Promise<string> {
  const body = new URLSearchParams({ username: email, password })
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail ?? 'Login failed')
  }
  const data = await res.json()
  return data.access_token as string
}

// GET /auth/me — who am I? Requires the token in the Authorization header.
export async function getMe(token: string): Promise<User> {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Not authenticated')
  return res.json()
}
