import { useEffect, useState } from 'react'
import { apiFetch } from './api'

export default function CompanyDetail({ orgNumber, onClose, onSave, isSaved }) {
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const res = await apiFetch(`/api/companies/details/${orgNumber}`)
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to load company details')
      } else {
        setCompany(await res.json())
      }
      setLoading(false)
    }
    load()
  }, [orgNumber])

  return (
    <div className="overlay" onClick={onClose}>
      <div className="detail-dialog" onClick={e => e.stopPropagation()}>
        <div className="detail-header">
          <div>
            {loading && <h2>Loading...</h2>}
            {company && (
              <>
                <h2>{company.name}</h2>
                <span className="detail-orgnr">{company.org_number}</span>
                {company.bankrupt && <span className="badge badge-danger">Konkurs</span>}
                {company.liquidation && <span className="badge badge-warning">Under avvikling</span>}
              </>
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            {company && (
              <button
                className={`btn ${isSaved ? 'btn-secondary' : 'btn-primary'}`}
                onClick={() => onSave(company)}
                disabled={isSaved}
              >
                {isSaved ? 'Saved' : 'Save'}
              </button>
            )}
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>

        {error && <p className="error-msg">{error}</p>}

        {company && (
          <div className="detail-body">
            <div className="detail-grid">
              <Section title="General">
                <Row label="Organisation form" value={company.org_form} />
                <Row label="Founded" value={company.founded} />
                <Row label="Registered" value={company.registered} />
                <Row label="Employees" value={company.employees?.toLocaleString('no-NO')} />
                <Row label="Last annual report" value={company.last_annual_report} />
                <Row label="VAT registered" value={company.vat_registered ? 'Yes' : 'No'} />
              </Section>

              <Section title="Contact">
                <Row label="Website" value={company.website} link={company.website ? `https://${company.website.replace(/^https?:\/\//, '')}` : null} />
                <Row label="Phone" value={company.phone} />
                <Row label="Email" value={company.email} />
              </Section>

              <Section title="Address">
                <Row label="Business address" value={company.business_address} />
                <Row label="Postal address" value={company.postal_address} />
              </Section>

              <Section title="Industry">
                <Row label="Primary" value={company.industry1} />
                <Row label="Secondary" value={company.industry2} />
                <Row label="Tertiary" value={company.industry3} />
              </Section>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="detail-section">
      <h4 className="detail-section-title">{title}</h4>
      <dl className="detail-dl">{children}</dl>
    </div>
  )
}

function Row({ label, value, link }) {
  if (!value) return null
  return (
    <>
      <dt>{label}</dt>
      <dd>
        {link ? <a href={link} target="_blank" rel="noreferrer">{value}</a> : value}
      </dd>
    </>
  )
}
