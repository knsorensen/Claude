import { useState } from 'react'
import { apiFetch } from './api'

const PLATFORM_META = {
  facebook: {
    label: 'Facebook',
    color: '#1877F2',
    bg:    '#e7f0fd',
    hint:  'Searches by name + location. Use @username to build a direct profile link.',
    Icon:  () => (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.27h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
      </svg>
    ),
  },
  linkedin: {
    label: 'LinkedIn',
    color: '#0A66C2',
    bg:    '#e8f0fb',
    hint:  'Professional network. Best for finding people by full name and location.',
    Icon:  () => (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  tiktok: {
    label: 'TikTok',
    color: '#010101',
    bg:    '#f0f0f0',
    hint:  'Use @username to fetch real profile info including name and avatar.',
    Icon:  () => (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.93a8.16 8.16 0 0 0 4.77 1.52V7.01a4.85 4.85 0 0 1-1-.32z"/>
      </svg>
    ),
  },
  snapchat: {
    label: 'Snapchat',
    color: '#FFAA00',
    bg:    '#fff8e1',
    hint:  'Requires a @username — no general name search is available on Snapchat.',
    Icon:  () => (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M12.166 2C9.415 2 7 4.364 7 7.172v1.078c-.434.147-.87.246-1.312.246-.276 0-.554-.044-.82-.132l-.13-.044-.133.012c-.443.04-.748.38-.748.794 0 .358.218.667.558.794.9.335 1.617.965 2.015 1.774.02.041.03.083.03.127 0 .032-.006.063-.018.093l-.006.016c-.09.261-.366.47-.801.62-.437.15-.982.234-1.523.234-.266 0-.53-.02-.785-.059l-.205-.03-.163.128c-.21.165-.33.41-.33.672 0 .447.333.826.797.918.802.16 1.48.644 2.008 1.44.534.804.854 1.858.959 3.13l.027.316.299.12c1.29.516 2.552.778 3.752.778.564 0 1.112-.054 1.635-.16.412.302.97.492 1.614.492.418 0 .838-.079 1.244-.235.194-.075.363-.172.508-.289.523.106 1.07.16 1.634.16 1.2 0 2.463-.262 3.751-.778l.3-.12.027-.316c.105-1.272.425-2.326.96-3.13.527-.796 1.205-1.28 2.007-1.44.464-.092.797-.471.797-.918 0-.262-.12-.507-.33-.672l-.163-.128-.204.03a5.08 5.08 0 0 1-.786.06c-.54 0-1.086-.085-1.523-.235-.435-.15-.71-.359-.8-.62l-.007-.016a.342.342 0 0 1-.017-.093c0-.044.01-.086.03-.127.397-.81 1.115-1.44 2.015-1.774.34-.127.558-.436.558-.794 0-.414-.305-.754-.748-.794l-.133-.012-.13.044a2.72 2.72 0 0 1-.82.132c-.441 0-.878-.099-1.312-.246V7.172C17.164 4.364 14.877 2 12.166 2z"/>
      </svg>
    ),
  },
}

export default function Persons({ onLogout }) {
  const [query, setQuery]         = useState('')
  const [municipality, setMun]    = useState('')
  const [results, setResults]     = useState(null)
  const [searching, setSearching] = useState(false)
  const [error, setError]         = useState('')

  async function handleSearch(e) {
    e.preventDefault()
    if (!query.trim()) return
    setSearching(true)
    setError('')
    setResults(null)

    const params = new URLSearchParams({ q: query.trim() })
    if (municipality.trim()) params.append('municipality', municipality.trim())

    const res = await apiFetch(`/api/persons/search?${params}`)
    setSearching(false)

    if (res.status === 401) return onLogout()
    if (!res.ok) {
      const d = await res.json()
      return setError(d.error || 'Search failed')
    }
    setResults(await res.json())
  }

  return (
    <div className="page">
      <h2 className="page-title">Person Search</h2>

      <div className="form-card">
        <h3>Search across social platforms</h3>
        <form onSubmit={handleSearch}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              className="input"
              placeholder="Full name or @username"
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{ flex: '2 1 220px' }}
            />
            <input
              className="input"
              placeholder="City / municipality (optional)"
              value={municipality}
              onChange={e => setMun(e.target.value)}
              style={{ flex: '1 1 160px' }}
            />
            <button className="btn btn-primary" type="submit" disabled={searching}>
              {searching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
        {error && <p className="error-msg" style={{ marginTop: '10px' }}>{error}</p>}
        <p style={{ marginTop: '10px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
          Enter a full name to get platform search links, or <strong>@username</strong> to look up a specific handle.
          Municipality is added to name searches on Facebook and LinkedIn.
        </p>
      </div>

      {results && (
        <>
          <h3 className="section-label" style={{ marginBottom: '14px' }}>
            Results for &ldquo;{results.query}&rdquo;
            {results.municipality ? ` in ${results.municipality}` : ''}
          </h3>
          <div className="platform-grid">
            {Object.entries(results.platforms).map(([id, p]) => (
              <PlatformCard key={id} id={id} platform={p} isUsername={results.is_username} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function PlatformCard({ id, platform, isUsername }) {
  const meta = PLATFORM_META[id] || {}
  const { color, bg, hint, Icon } = meta

  return (
    <div className="platform-card" style={{ borderTop: `3px solid ${color}` }}>
      <div className="platform-card-header">
        <span className="platform-icon" style={{ color }}>
          {Icon && <Icon />}
        </span>
        <span className="platform-name" style={{ color }}>{platform.name}</span>
      </div>

      {hint && (
        <p className="platform-hint">{hint}</p>
      )}

      {/* TikTok profile data from oEmbed */}
      {platform.profile && (
        <div className="platform-profile" style={{ background: bg }}>
          {platform.profile.thumbnail && (
            <img
              src={platform.profile.thumbnail}
              alt={platform.profile.display_name}
              className="platform-avatar"
            />
          )}
          <div>
            <div className="platform-profile-name">{platform.profile.display_name}</div>
            <div className="platform-profile-sub">Profile found</div>
          </div>
        </div>
      )}

      {/* Snapchat: no search URL, username-only */}
      {id === 'snapchat' && !isUsername && (
        <p className="platform-no-search">Snapchat requires a @username — no general search available.</p>
      )}

      <div className="platform-actions">
        {platform.profile_url && (
          <a
            href={platform.profile_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm"
            style={{ background: color, color: id === 'snapchat' ? '#000' : '#fff' }}
          >
            View Profile
          </a>
        )}
        {platform.search_url && (
          <a
            href={platform.search_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
          >
            Search on {platform.name}
          </a>
        )}
      </div>
    </div>
  )
}
