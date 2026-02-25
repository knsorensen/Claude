import { useEffect, useState } from 'react'

function App() {
  const [api, setApi] = useState(null)
  const [db, setDb] = useState(null)

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setApi(data.status))
      .catch(() => setApi('error'))

    fetch('/api/health/db')
      .then(res => res.json())
      .then(data => setDb(data.status))
      .catch(() => setDb('error'))
  }, [])

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Hello World</h1>
      <p>Welcome to the app.</p>
      <table style={{ margin: '40px auto', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={th}>Service</th>
            <th style={th}>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={td}>API</td>
            <td style={{ ...td, color: statusColor(api) }}>{api ?? 'checking...'}</td>
          </tr>
          <tr>
            <td style={td}>Database</td>
            <td style={{ ...td, color: statusColor(db) }}>{db ?? 'checking...'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

const th = { padding: '8px 24px', borderBottom: '2px solid #ccc' }
const td = { padding: '8px 24px', borderBottom: '1px solid #eee' }
const statusColor = s => s === 'ok' ? 'green' : s === 'error' ? 'red' : 'gray'

export default App
