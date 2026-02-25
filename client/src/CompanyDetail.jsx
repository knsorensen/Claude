import { useEffect, useState } from 'react'
import { apiFetch } from './api'

export default function CompanyDetail({ orgNumber, onClose, onSave, onDelete, isSaved, savedId }) {
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

  async function handleDelete() {
    if (!confirm('Remove this company from your database?')) return
    await onDelete(savedId)
    onClose()
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="detail-dialog" onClick={e => e.stopPropagation()}>

        <div className="detail-header">
          <div>
            {loading && <h2 style={{ color: 'var(--color-text-muted)' }}>Loading...</h2>}
            {company && (
              <>
                <h2>{company.name}</h2>
                <div className="detail-meta">
                  <span className="detail-orgnr">{company.org_number}</span>
                  {company.vat_registered && <span className="badge badge-success">MVA</span>}
                  {company.bankrupt    && <span className="badge badge-danger">Konkurs</span>}
                  {company.liquidation && <span className="badge badge-warning">Under avvikling</span>}
                </div>
              </>
            )}
          </div>
          <div className="detail-actions">
            {company && !isSaved && (
              <button className="btn btn-primary btn-sm" onClick={() => { onSave(company); onClose() }}>
                Save
              </button>
            )}
            {company && isSaved && (
              <button className="btn btn-sm" style={{ background: 'var(--color-danger-soft)', color: 'var(--color-danger)' }} onClick={handleDelete}>
                Remove from DB
              </button>
            )}
            <button className="btn btn-secondary btn-sm" onClick={onClose}>Close</button>
          </div>
        </div>

        {error && <p className="error-msg" style={{ margin: '16px 28px 0' }}>{error}</p>}

        {company && (
          <div className="detail-body">
            <div className="detail-grid">
              <Section title="General">
                <Row label="Org. form"        value={company.org_form} />
                <Row label="Founded"          value={company.founded} />
                <Row label="Registered"       value={company.registered} />
                <Row label="Employees"        value={company.employees?.toLocaleString('no-NO')} />
                <Row label="Last report"      value={company.last_annual_report} />
                <Row label="VAT registered"   value={company.vat_registered ? 'Yes' : 'No'} />
              </Section>

              <Section title="Contact">
                <Row label="Website" value={company.website} link={company.website ? `https://${company.website.replace(/^https?:\/\//, '')}` : null} />
                <Row label="Phone"   value={company.phone} />
                <Row label="Email"   value={company.email} />
              </Section>

              <Section title="Address">
                <Row label="Business" value={company.business_address} />
                <Row label="Postal"   value={company.postal_address} />
              </Section>

              <Section title="Industry">
                <Row label="Primary"   value={company.industry1} />
                <Row label="Secondary" value={company.industry2} />
                <Row label="Tertiary"  value={company.industry3} />
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
      <dd>{link ? <a href={link} target="_blank" rel="noreferrer">{value}</a> : value}</dd>
    </>
  )
}
