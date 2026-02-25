import { useState } from 'react'
import { getToken, clearToken } from './api'
import Login from './Login'
import Users from './Users'
import './App.css'

function App() {
  const [user, setUser] = useState(() => getToken() ? {} : null)
  const [showConfirm, setShowConfirm] = useState(false)

  function handleLogin(userData) {
    setUser(userData)
  }

  function handleLogout() {
    clearToken()
    setUser(null)
    setShowConfirm(false)
  }

  return (
    <div>
      <header className="app-header">
        <h1>Claude App</h1>
        {user && (
          <button className="btn btn-ghost" onClick={() => setShowConfirm(true)}>
            Sign Out
          </button>
        )}
      </header>

      {showConfirm && (
        <div className="overlay">
          <div className="dialog">
            <h3>Sign Out</h3>
            <p>Are you sure you want to sign out?</p>
            <div className="dialog-actions">
              <button className="btn btn-danger" onClick={handleLogout}>Yes, sign out</button>
              <button className="btn btn-secondary" onClick={() => setShowConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {user ? <Users onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
    </div>
  )
}

export default App
