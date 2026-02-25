import { useState } from 'react'
import { setToken } from './api'

export default function Login({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const url = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
    const body = mode === 'login'
      ? { email: form.email, password: form.password }
      : { name: form.name, email: form.email, password: form.password }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (!res.ok) return setError(data.error)
    setToken(data.token)
    onLogin(data.user)
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={{ marginTop: 0 }}>{mode === 'login' ? 'Sign In' : 'Register'}</h2>
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <input
              style={styles.input}
              placeholder="Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          )}
          <input
            style={styles.input}
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            style={styles.input}
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />
          {error && <p style={styles.error}>{error}</p>}
          <button style={styles.btn} type="submit">
            {mode === 'login' ? 'Sign In' : 'Register'}
          </button>
        </form>
        <p style={{ marginTop: '16px', fontSize: '14px', textAlign: 'center' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span
            style={styles.link}
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
          >
            {mode === 'login' ? 'Register' : 'Sign In'}
          </span>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' },
  card: { background: '#f9f9f9', padding: '40px', borderRadius: '8px', width: '100%', maxWidth: '360px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  input: { display: 'block', width: '100%', padding: '10px', marginBottom: '12px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '10px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '15px', cursor: 'pointer' },
  error: { color: 'red', fontSize: '14px', margin: '0 0 12px' },
  link: { color: '#0070f3', cursor: 'pointer', textDecoration: 'underline' },
}
