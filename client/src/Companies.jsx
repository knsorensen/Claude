import { useEffect, useState } from 'react'
import { apiFetch } from './api'
import CompanyDetail from './CompanyDetail'

export default function Companies({ onLogout }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [saved, setSaved] = useState([])
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [savedIds, setSavedIds] = useState(new Set())
  const [detailOrg, setDetailOrg] = useState(null)

  useEffect(() => { loadSaved() }, [])

  async function loadSaved() {
    const res = await apiFetch('/api/companies')
    if (res.status === 401) return onLogout()
    const data = await res.json()
    setSaved(data)
    setSavedIds(new Set(data.map(c => c.org_number)))
  }

  async function handleSearch(e) {
    e.preventDefault()
    if (!query.trim()) return
    setSearching(true)
    setSearchError('')
    setResults([])
    const res = await apiFetch(`/api/companies/search?q=${encodeURIComponent(query)}`)
    setSearching(false)
    if (!res.ok) {
      const data = await res.json()
      return setSearchError(data.error || 'Search failed')
    }
    const data = await res.json()
    if (data.length === 0) setSearchError('No companies found.')
    setResults(data)
  }

  async function handleSave(company) {
    const res = await apiFetch('/api/companies', {
      method: 'POST',
      body: JSON.stringify(company),
    })
    if (res.ok) loadSaved()
  }

  async function handleDelete(id) {
    if (!confirm('Remove this company?')) return
    await apiFetch(`/api/companies/${id}`, { method: 'DELETE' })
    loadSaved()
  }

  return (
    <div className="page">
      <h2 className="page-title">Company Search</h2>

      {/* Search */}
      <div className="form-card">
        <h3>Search Brønnøysundregistrene</h3>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
          <input
            className="input"
            placeholder="Company name or org. number"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ flex: 1 }}
          />
          <button className="btn btn-primary" type="submit" disabled={searching}>
            {searching ? 'Searching...' : 'Search'}
          </button>
        </form>
        {searchError && <p className="error-msg" style={{ marginTop: '10px' }}>{searchError}</p>}
      </div>

      {/* Search results */}
      {results.length > 0 && (
        <section style={{ marginBottom: '36px' }}>
          <h3 className="section-label">Results ({results.length})</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Org. No.</th>
                  <th>Name</th>
                  <th>Form</th>
                  <th>Industry</th>
                  <th>City</th>
                  <th>Employees</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {results.map(c => (
                  <tr key={c.org_number}>
                    <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>{c.org_number}</td>
                    <td>
                      <span className="link-text" onClick={() => setDetailOrg(c.org_number)}>
                        {c.name}
                      </span>
                    </td>
                    <td>{c.org_form || '—'}</td>
                    <td>{c.industry || '—'}</td>
                    <td>{c.city || '—'}</td>
                    <td>{c.employees?.toLocaleString('no-NO') ?? '—'}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => setDetailOrg(c.org_number)}>
                        View
                      </button>
                      {' '}
                      {savedIds.has(c.org_number) ? (
                        <span style={{ color: 'var(--color-muted)', fontSize: '13px' }}>Saved</span>
                      ) : (
                        <button className="btn btn-primary btn-sm" onClick={() => handleSave(c)}>
                          Save
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Saved companies */}
      <section>
        <h3 className="section-label">Saved Companies ({saved.length})</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Org. No.</th>
                <th>Name</th>
                <th>Form</th>
                <th>Industry</th>
                <th>City</th>
                <th>Employees</th>
                <th>Founded</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {saved.length === 0 && (
                <tr className="empty-row">
                  <td colSpan={8}>No saved companies yet. Search above to find and save companies.</td>
                </tr>
              )}
              {saved.map(c => (
                <tr key={c.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>{c.org_number}</td>
                  <td>
                    <span className="link-text" onClick={() => setDetailOrg(c.org_number)}>
                      {c.name}
                    </span>
                  </td>
                  <td>{c.org_form || '—'}</td>
                  <td>{c.industry || '—'}</td>
                  <td>{c.city || '—'}</td>
                  <td>{c.employees?.toLocaleString('no-NO') ?? '—'}</td>
                  <td>{c.founded ? new Date(c.founded).getFullYear() : '—'}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setDetailOrg(c.org_number)}>
                      View
                    </button>
                    {' '}
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Detail modal */}
      {detailOrg && (
        <CompanyDetail
          orgNumber={detailOrg}
          isSaved={savedIds.has(detailOrg)}
          onSave={company => { handleSave(company); setDetailOrg(null) }}
          onClose={() => setDetailOrg(null)}
        />
      )}
    </div>
  )
}
