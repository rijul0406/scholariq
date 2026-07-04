import { useEffect, useState } from 'react'

// Where our FastAPI backend lives. We'll move this to an env variable later.
const API_URL = 'http://127.0.0.1:8000'

function App() {
  const [apiStatus, setApiStatus] = useState('checking...')

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((res) => res.json())
      .then((data) => setApiStatus(data.status))
      .catch(() => setApiStatus('unreachable'))
  }, [])

  // Every className below is a Tailwind utility:
  //   min-h-screen = min-height: 100vh; flex + items/justify-center = centering;
  //   text-4xl = large font; font-bold = bold; text-slate-800 = a gray color.
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-2 bg-slate-50 text-slate-800">
      <h1 className="text-5xl font-bold text-indigo-600">ScholarIQ</h1>
      <p className="text-lg text-slate-500">Learning Intelligence Platform</p>
      <p className="mt-4 text-sm">
        Backend status:{' '}
        <span className="font-semibold text-emerald-600">{apiStatus}</span>
      </p>
    </main>
  )
}

export default App
