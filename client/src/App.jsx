import { useState } from 'react'
import { getToken, clearToken } from './api'
import Login from './Login'
import Users from './Users'
import Companies from './Companies'
import './App.css'

const PAGES = [
  { id: 'Companies', label: 'Companies', icon: '🏢' },
  { id: 'Users',     label: 'Users',     icon: '👥' },
]

function App() {
  const [user, setUser] = useState(() => getToken() ? {} : null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [page, setPage] = useState('Companies')

  function handleLogin(userData) {
    setUser(userData)
  }

  function handleLogout() {
    clearToken()
    setUser(null)
    setShowConfirm(false)
  }

  if (!user) return <Login onLogin={handleLogin} />

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span>Claude App</span>
          <small>Dashboard</small>
        </div>
        <nav className="sidebar-nav">
          {PAGES.map(p => (
            <button
              key={p.id}
              className={`nav-item ${page === p.id ? 'active' : ''}`}
              onClick={() => setPage(p.id)}
            >
              <span className="nav-icon">{p.icon}</span>
              {p.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="nav-item" onClick={() => setShowConfirm(true)}>
            <span className="nav-icon">↩</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        {page === 'Users'     && <Users onLogout={handleLogout} />}
        {page === 'Companies' && <Companies onLogout={handleLogout} />}
      </div>

      {/* Logout confirm */}
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
    </div>
  )
}

export default App
