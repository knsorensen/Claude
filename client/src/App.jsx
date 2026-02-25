import { useState } from 'react'
import { getToken, clearToken } from './api'
import Login from './Login'
import Users from './Users'

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
      <header style={styles.header}>
        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Claude App</span>
        {user && (
          <button style={styles.logoutBtn} onClick={() => setShowConfirm(true)}>
            Sign Out
          </button>
        )}
      </header>

      {showConfirm && (
        <div style={styles.overlay}>
          <div style={styles.dialog}>
            <h3 style={{ marginTop: 0 }}>Sign Out</h3>
            <p>Are you sure you want to sign out?</p>
            <div style={styles.dialogButtons}>
              <button style={styles.btnConfirm} onClick={handleLogout}>Yes, sign out</button>
              <button style={styles.btnCancel} onClick={() => setShowConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {user ? <Users onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
    </div>
  )
}

const styles = {
  header: { background: '#0070f3', color: '#fff', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logoutBtn: { background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.5)', borderRadius: '4px', padding: '6px 16px', cursor: 'pointer' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  dialog: { background: '#fff', borderRadius: '8px', padding: '32px', width: '100%', maxWidth: '340px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' },
  dialogButtons: { display: 'flex', gap: '10px', marginTop: '20px' },
  btnConfirm: { flex: 1, padding: '9px', background: '#e00', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  btnCancel: { flex: 1, padding: '9px', background: '#eee', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer' },
}

export default App
