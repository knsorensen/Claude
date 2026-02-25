import { useEffect, useState } from 'react'
import { apiFetch } from './api'

const emptyForm = { name: '', email: '' }

export default function Users({ onLogout }) {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => { loadUsers() }, [])

  async function loadUsers() {
    const res = await apiFetch('/api/users')
    if (res.status === 401) return onLogout()
    setUsers(await res.json())
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const method = editId ? 'PUT' : 'POST'
    const url = editId ? `/api/users/${editId}` : '/api/users'
    const res = await apiFetch(url, { method, body: JSON.stringify(form) })
    const data = await res.json()
    if (!res.ok) return setError(data.error)
    setForm(emptyForm)
    setEditId(null)
    loadUsers()
  }

  function handleEdit(user) {
    setEditId(user.id)
    setForm({ name: user.name, email: user.email })
    setError('')
  }

  function handleCancel() {
    setEditId(null)
    setForm(emptyForm)
    setError('')
  }

  async function handleDelete(id) {
    if (!confirm('Delete this user?')) return
    await apiFetch(`/api/users/${id}`, { method: 'DELETE' })
    loadUsers()
  }

  return (
    <div style={styles.container}>
      <h2>Users</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <h3>{editId ? 'Edit User' : 'New User'}</h3>
        <input
          style={styles.input}
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          style={styles.input}
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
        />
        {error && <p style={styles.error}>{error}</p>}
        <div style={styles.formButtons}>
          <button style={styles.btnPrimary} type="submit">
            {editId ? 'Update' : 'Create'}
          </button>
          {editId && (
            <button style={styles.btnSecondary} type="button" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Created</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr><td colSpan={5} style={{ textAlign: 'center', padding: '16px', color: '#888' }}>No users yet.</td></tr>
          )}
          {users.map(u => (
            <tr key={u.id}>
              <td style={styles.td}>{u.id}</td>
              <td style={styles.td}>{u.name}</td>
              <td style={styles.td}>{u.email}</td>
              <td style={styles.td}>{new Date(u.created_at).toLocaleDateString()}</td>
              <td style={styles.td}>
                <button style={styles.btnEdit} onClick={() => handleEdit(u)}>Edit</button>
                <button style={styles.btnDelete} onClick={() => handleDelete(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const styles = {
  container: { maxWidth: '800px', margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif' },
  form: { background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '32px' },
  input: { display: 'block', width: '100%', padding: '8px', marginBottom: '12px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' },
  formButtons: { display: 'flex', gap: '8px' },
  btnPrimary: { padding: '8px 20px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  btnSecondary: { padding: '8px 20px', background: '#eee', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  btnEdit: { marginRight: '8px', padding: '4px 12px', background: '#f0a500', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  btnDelete: { padding: '4px 12px', background: '#e00', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '10px 12px', borderBottom: '2px solid #ddd', background: '#f0f0f0' },
  td: { padding: '10px 12px', borderBottom: '1px solid #eee' },
  error: { color: 'red', margin: '0 0 12px' },
}
