import { useState } from 'react'
import { getToken, clearToken } from './api'
import Login from './Login'
import Users from './Users'

function App() {
  const [user, setUser] = useState(() => getToken() ? {} : null)

  function handleLogin(userData) {
    setUser(userData)
  }

  function handleLogout() {
    clearToken()
    setUser(null)
  }

  return (
    <div>
      <header style={styles.header}>
        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Claude App</span>
        {user && (
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Sign Out
          </button>
        )}
      </header>
      {user ? <Users onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
    </div>
  )
}

const styles = {
  header: { background: '#0070f3', color: '#fff', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logoutBtn: { background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.5)', borderRadius: '4px', padding: '6px 16px', cursor: 'pointer' },
}

export default App
