const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const pool = require('../db');
const requireAuth = require('../middleware/auth');

const BRREG_URL = 'https://data.brreg.no/enhetsregisteret/api/enheter';

router.use(requireAuth);

// GET /api/companies/search?q=<query>
router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length < 2) {
    return res.status(400).json({ error: 'Query must be at least 2 characters' });
  }
  try {
    const param = /^\d+$/.test(q.trim()) ? 'organisasjonsnummer' : 'navn';
    const url = `${BRREG_URL}?${param}=${encodeURIComponent(q.trim())}&size=10`;
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) return res.status(502).json({ error: 'Failed to fetch from brreg.no' });
    const data = await response.json();
    const enheter = data._embedded?.enheter || [];
    const results = enheter.map(e => ({
      org_number:   e.organisasjonsnummer,
      name:         e.navn,
      org_form:     e.organisasjonsform?.beskrivelse || null,
      industry:     e.naeringskode1?.beskrivelse || null,
      address:      e.forretningsadresse?.adresse?.join(', ') || null,
      postal_code:  e.forretningsadresse?.postnummer || null,
      city:         e.forretningsadresse?.poststed || null,
      municipality: e.forretningsadresse?.kommune || null,
      employees:    e.antallAnsatte || null,
      founded:      e.stiftelsesdato || null,
    }));
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/companies/details/:orgNumber — full details from brreg.no
router.get('/details/:orgNumber', async (req, res) => {
  try {
    const response = await fetch(`${BRREG_URL}/${req.params.orgNumber}`, {
      headers: { 'Accept': 'application/json' }
    });
    if (response.status === 404) return res.status(404).json({ error: 'Company not found in brreg.no' });
    if (!response.ok) return res.status(502).json({ error: 'Failed to fetch from brreg.no' });
    const e = await response.json();
    res.json({
      org_number:        e.organisasjonsnummer,
      name:              e.navn,
      org_form:          e.organisasjonsform?.beskrivelse || null,
      org_form_code:     e.organisasjonsform?.kode || null,
      website:           e.hjemmeside || null,
      phone:             e.telefon || null,
      email:             e.epostadresse || null,
      employees:         e.antallAnsatte || null,
      founded:           e.stiftelsesdato || null,
      registered:        e.registreringsdatoEnhetsregisteret || null,
      last_annual_report: e.sisteInnsendteAarsregnskap || null,
      vat_registered:    e.registrertIMvaregisteret || false,
      bankrupt:          e.konkurs || false,
      liquidation:       e.underAvvikling || false,
      industry1:         e.naeringskode1 ? `${e.naeringskode1.kode} — ${e.naeringskode1.beskrivelse}` : null,
      industry2:         e.naeringskode2 ? `${e.naeringskode2.kode} — ${e.naeringskode2.beskrivelse}` : null,
      industry3:         e.naeringskode3 ? `${e.naeringskode3.kode} — ${e.naeringskode3.beskrivelse}` : null,
      business_address:  e.forretningsadresse ? [
        e.forretningsadresse.adresse?.join(', '),
        `${e.forretningsadresse.postnummer} ${e.forretningsadresse.poststed}`,
        e.forretningsadresse.kommune,
      ].filter(Boolean).join(', ') : null,
      postal_address:    e.postadresse ? [
        e.postadresse.adresse?.join(', '),
        `${e.postadresse.postnummer} ${e.postadresse.poststed}`,
      ].filter(Boolean).join(', ') : null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/companies — list saved companies
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM companies ORDER BY saved_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/companies — save a company
router.post('/', async (req, res) => {
  const { org_number, name, org_form, industry, address, postal_code, city, municipality, employees, founded } = req.body;
  if (!org_number || !name) return res.status(400).json({ error: 'org_number and name are required' });
  try {
    const result = await pool.query(
      `INSERT INTO companies (org_number, name, org_form, industry, address, postal_code, city, municipality, employees, founded)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       ON CONFLICT (org_number) DO UPDATE SET
         name=$2, org_form=$3, industry=$4, address=$5, postal_code=$6, city=$7, municipality=$8, employees=$9, founded=$10, saved_at=NOW()
       RETURNING *`,
      [org_number, name, org_form, industry, address, postal_code, city, municipality, employees, founded || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/companies/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM companies WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Company not found' });
    res.json({ message: 'Company deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
