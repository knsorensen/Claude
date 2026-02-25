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
    <div className="page">
      <h2 className="page-title">Users</h2>

      <div className="form-card">
        <h3>{editId ? 'Edit User' : 'New User'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              className="input"
              placeholder="Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <input
              className="input"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <div className="form-actions">
            <button className="btn btn-primary" type="submit">
              {editId ? 'Update' : 'Create'}
            </button>
            {editId && (
              <button className="btn btn-secondary" type="button" onClick={handleCancel}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr className="empty-row"><td colSpan={5}>No users yet.</td></tr>
            )}
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{new Date(u.created_at).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-warning btn-sm" onClick={() => handleEdit(u)}>Edit</button>
                  {' '}
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
