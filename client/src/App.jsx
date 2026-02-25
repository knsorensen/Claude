import { useState } from 'react'
import { getToken, clearToken } from './api'
import Login from './Login'
import Users from './Users'
import Companies from './Companies'
import './App.css'

const PAGES = ['Users', 'Companies']

function App() {
  const [user, setUser] = useState(() => getToken() ? {} : null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [page, setPage] = useState('Users')

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <h1>Claude App</h1>
          {user && (
            <nav style={{ display: 'flex', gap: '4px' }}>
              {PAGES.map(p => (
                <button
                  key={p}
                  className="btn btn-ghost"
                  style={{ opacity: page === p ? 1 : 0.6, fontWeight: page === p ? 700 : 400 }}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
            </nav>
          )}
        </div>
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

      {!user && <Login onLogin={handleLogin} />}
      {user && page === 'Users' && <Users onLogout={handleLogout} />}
      {user && page === 'Companies' && <Companies onLogout={handleLogout} />}
    </div>
  )
}

export default App
