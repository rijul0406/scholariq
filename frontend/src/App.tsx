import { useEffect, useState } from 'react'
import './App.css'

// Where our FastAPI backend lives. We'll move this to an env variable later;
// keeping it a plain constant for now (lean setup).
const API_URL = 'http://127.0.0.1:8000'

function App() {
  // State = data React remembers and re-renders when it changes.
  // Here: the backend's health status. Starts as 'checking...'.
  const [apiStatus, setApiStatus] = useState('checking...')

  // useEffect runs code AFTER the component first renders — perfect for
  // fetching data. The empty [] means "run once, on mount".
  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((res) => res.json())
      .then((data) => setApiStatus(data.status)) // -> 'ok'
      .catch(() => setApiStatus('unreachable'))
  }, [])

  return (
    <main>
      <h1>ScholarIQ</h1>
      <p>Learning Intelligence Platform</p>
      <p>
        Backend status: <strong>{apiStatus}</strong>
      </p>
    </main>
  )
}

export default App
