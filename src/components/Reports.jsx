import React, { useState, useEffect } from 'react'
import { PlusCircle, Trash2, Wrench, Scale, IndianRupee, CalendarDays, ClipboardList, Printer, X, Search } from 'lucide-react'
import billLogo from './bill_logo.png'

/* ─── localStorage helpers ─────────────────────────────────── */
const STORAGE_KEY = 'idhayam_service_log'
const loadRecords  = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] } }
const saveRecords  = (r) => localStorage.setItem(STORAGE_KEY, JSON.stringify(r))

const SERVICE_TYPES = [
  'Polish (மெருகு)',
  'Repair (சரி செய்தல்)',
  'Sizing (அளவு மாற்றம்)',
  'Plating (பூச்சு)',
  'Stone Setting (கல் பதிக்கல்)',
  'Cleaning (சுத்தம்)',
  'Other (மற்றவை)',
]

const EMPTY_FORM = {
  date:        new Date().toISOString().split('T')[0],
  item:        '',
  weight:      '',
  serviceType: 'Polish (மெருகு)',
  amount:      '',
  notes:       '',
  goldRate:    '',
  silverRate:  '',
  customerName:  '',
  customerPhone: '',
}

const fmtDate = (d) => {
  if (!d) return '—'
  const [y, m, day] = d.split('-')
  return `${day}/${m}/${y}`
}

/* ─── Print Receipt ────────────────────────────────────────── */
const numberToEnglishWords = (num) => {
  if (num === 0) return 'Rupees Zero Only'
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen ']
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
  const g = ['', 'Thousand', 'Million', 'Billion', 'Trillion']

  const check = (n) => {
    let str = ''
    if (n > 99) {
      str += a[Math.floor(n / 100)] + 'Hundred '
      n %= 100
    }
    if (n > 19) {
      str += b[Math.floor(n / 10)] + ' ' + a[n % 10]
    } else {
      str += a[n]
    }
    return str
  }

  let i = 0
  let words = ''
  let temp = num
  while (temp > 0) {
    let rem = temp % 1000
    if (rem > 0) {
      words = check(rem) + g[i] + ' ' + words
    }
    temp = Math.floor(temp / 1000)
    i++
  }
  return 'RUPEES ' + words.trim() + ' ONLY'
}

const printReceipt = (r, goldRate = '', silverRate = '') => {
  const logoUrl = window.location.origin + billLogo
  const amountWords = numberToEnglishWords(r.amount)
  const win = window.open('', '_blank', 'width=750,height=800')
  win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Service Receipt - இதயம் ஜூவல்லரி</title>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;600;700;800&family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Noto Sans Tamil','Inter',sans-serif;padding:30px;background:#fff;color:#0F1A17;width:700px;margin:0 auto;border:1px solid #C8A96A}
    
    .invoice-header-grid {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      border-bottom: 2px solid #0F3D34;
      padding-bottom: 14px;
      margin-bottom: 16px;
    }
    .shop-info-side {
      font-size: 11.5px;
      line-height: 1.6;
      color: #3D5C52;
    }
    .shop-brand-name {
      font-size: 26px;
      font-weight: 800;
      color: #0F3D34;
      margin-bottom: 2px;
    }
    .shop-brand-sub {
      font-size: 13.5px;
      font-weight: 600;
      color: #C8A96A;
      margin-bottom: 4px;
    }
    .logo-side {
      text-align: right;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: space-between;
    }
    .invoice-title-badge {
      font-size: 13px;
      font-weight: 700;
      color: #0F3D34;
      border: 1.5px solid #0F3D34;
      padding: 3px 12px;
      border-radius: 4px;
      letter-spacing: 1px;
      margin-top: 4px;
      display: inline-block;
      text-transform: uppercase;
    }
    .customer-invoice-meta {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 20px;
      font-size: 12.5px;
      padding: 8px 12px;
      background: #F7F6F1;
      border: 1px solid rgba(15, 61, 52, 0.12);
      border-radius: 8px;
      margin-bottom: 16px;
    }
    .meta-col-right {
      text-align: right;
      line-height: 1.6;
    }
    .highlights{
      background:#FFF9EE;
      border:1px dashed #C8A96A;
      border-radius:8px;
      padding:8px 12px;
      margin-bottom:16px;
      font-size:11px;
      color:#3F8451;
      font-weight:600;
      text-align:center;
      line-height:1.5;
    }
    table, th, td {
      border: none !important;
    }
    .grt-table th {
      background: #EBF4ED;
      color: #0F3D34;
      border-top: 1.5px solid #0F3D34 !important;
      border-bottom: 1.5px solid #0F3D34 !important;
      padding: 8px 10px;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 11px;
    }
    .grt-table td {
      padding: 12px 10px;
      border-bottom: 1px solid rgba(15, 61, 52, 0.12) !important;
      vertical-align: middle;
    }
    .grt-summary-grid {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 24px;
      font-size: 12px;
      border-top: 1.5px solid #0F3D34;
      padding-top: 12px;
      margin-bottom: 24px;
    }
    .totals-block {
      background: #F7F6F1;
      border-radius: 8px;
      border: 1px solid rgba(15, 61, 52, 0.12);
      padding: 12px 16px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
      font-weight: 500;
    }
    .totals-row.grand-total {
      border-top: 1.5px double #0F3D34;
      margin-top: 6px;
      padding-top: 8px;
      font-size: 15px;
      font-weight: 800;
      color: #0F3D34;
    }
    .signature-section {
      display: flex;
      justify-content: space-between;
      margin-top: 36px;
      padding: 0 20px;
      font-size: 12px;
      font-weight: 600;
      color: #3D5C52;
    }
    .signature-line {
      border-top: 1px solid #0F3D34;
      width: 140px;
      text-align: center;
      padding-top: 6px;
      margin-top: 32px;
    }
    .thank-you-brand {
      text-align: center;
      font-family: Georgia, serif;
      font-size: 28px;
      font-weight: 700;
      color: #C8A96A;
      margin: 16px 0;
    }
    @media print{
      body{padding:16px;margin:0 auto;width:100%;border:none}
      @page{margin:6mm;size:auto}
    }
  </style></head><body>
  <div class="invoice-header-grid" style="width: 100%;">
    <div style="font-size: 30px; font-weight: 800; color: #0F3D34; font-family: 'Noto Sans Tamil', sans-serif; text-align: center; margin-bottom: 10px; letter-spacing: 0.3px; line-height: 1.2;">
      இதயம் ஜூவல்லரி &amp; நகை தொழிலகம்
    </div>
    
    <div style="display: flex; align-items: center; justify-content: center; gap: 24px; width: 100%; margin-bottom: 10px;">
      <div style="flex-shrink: 0;">
        <img src="${logoUrl}" alt="இதயம் ஜூவல்லரி" style="height: 85px; object-fit: contain;" />
      </div>
      <div style="font-size: 11px; color: #3D5C52; line-height: 1.5; text-align: left;">
        <span style="font-weight: 600; color: #6A9A80;">GSTIN : 33AUIPL7759H1Z8</span><br />
        <span style="font-weight: 600;">📍 940/E, SKS வில்லா, ரத்தினவிலாஸ் பஸ்ஸ்டாப், Ujjivan Bank அருகில், சிவகாசி.</span><br />
        <span style="font-weight: 600;">📍 கிளை: 7, கீழரத வீதி, முருகன் கோயில் அருகில், சிவகாசி.</span><br />
        <span style="font-weight: 600;">📞 கடை : 95979 76729 | 81480 03454</span>
      </div>
    </div>

    ${(goldRate || silverRate) ? `
      <div style="display: flex; justify-content: center; gap: 24px; margin-top: 4px; margin-bottom: 4px; padding: 5px 16px; border: 1px solid rgba(15, 61, 52, 0.25); border-radius: 6px; background: #FFFDF9; font-size: 11.5px; font-weight: 700; color: #0F3D34;">
        ${goldRate ? `<span>Today Gold Rate (1g): ₹${Number(goldRate).toLocaleString('en-IN')}</span>` : ''}
        ${silverRate ? `<span>Today Silver Rate (1g): ₹${Number(silverRate).toLocaleString('en-IN')}</span>` : ''}
      </div>
    ` : ''}

    <div style="text-align: center; width: 100%;">
      <div class="invoice-title-badge" style="margin-top: 4px;">🔧 SERVICE RECEIPT / சேவை பில்</div>
    </div>
  </div>

  <div class="customer-invoice-meta">
    <div>
      <span style="color: #6A9A80; fontSize: '11px'">வாடிக்கையாளர் விவரம் / Customer Info:</span>
      <div style="font-size: 14px; font-weight: 700; color: #0F3D34; margin-top: 2px">${r.customerName || 'Walk-in Customer'}</div>
      ${r.customerPhone ? `<div style="font-size: 11px; color: #333; margin-top: 2px; font-weight: 600">Ph: ${r.customerPhone}</div>` : ''}
    </div>
    <div class="meta-col-right">
      <div><b>பில் எண் / Receipt No:</b> SVC-${r.id.toString().slice(-6)}</div>
      <div><b>தேதி / Date:</b> ${fmtDate(r.date)}</div>
    </div>
  </div>

  <table class="grt-table">
    <thead>
      <tr>
        <th style="text-align:left; width: 45%">பொருள் விவரம் (Item Details)</th>
        <th style="text-align:center; width: 25%">சேவை வகை (Service Type)</th>
        <th style="text-align:right; width: 15%">எடை (Weight)</th>
        <th style="text-align:right; width: 15%">கட்டணம் (Fee)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <strong style="color: #0F3D34">${r.item}</strong>
          ${r.notes ? `<div style="font-size:11px; color:#6A9A80; margin-top:2px">📝 ${r.notes}</div>` : ''}
        </td>
        <td style="text-align:center; font-weight:600; color:#3D5C52">${r.serviceType}</td>
        <td style="text-align:right; font-weight:700; color:#A6834A">${r.weight.toFixed(3)} g</td>
        <td style="text-align:right; font-weight:700; color:#1A7A4A">₹${Number(r.amount).toLocaleString('en-IN')}</td>
      </tr>
    </tbody>
  </table>

  <div class="grt-summary-grid">
    <div>
      <div style="font-size: 11.5px; color: #6A9A80; line-height: 1.5">
        <b>நிபந்தனைகள் / Instructions:</b><br/>
        <b>• 916 தங்கம் மற்றும் வெள்ளி நகைகள் ஆர்டரின் பேரில் சிறந்த முறையில் செய்து தரப்படும்.</b><br/>
        <b>• வெள்ளி கொலுசுகளுக்கு செய்கூலி, சேதாரம் இல்லை.</b><br/>
        <b>• மெருகு ஏற்றப்பட்ட அல்லது சரிசெய்யப்பட்ட நகைகளை கவனமாக சரிபார்த்து வாங்கவும்.</b><br/>
        <b>• பில் ரசீது இல்லாமல் நகைகள் திரும்ப ஒப்படைக்கப்பட மாட்டாது.</b>
      </div>
      <div style="margin-top: 12px">
        <span style="font-size: 10px; color: #6A9A80; display: block; font-weight: 600">வார்த்தைகளில் / Amount in words:</span>
        <span style="font-size: 11px; font-weight: 700; color: #0F3D34">${amountWords}</span>
      </div>
    </div>
    
    <div class="totals-block">
      <div class="totals-row">
        <span style="color: #6A9A80">சேவை கட்டணம் (Fee):</span>
        <span>₹${Number(r.amount).toLocaleString('en-IN')}</span>
      </div>
      <div class="totals-row">
        <span style="color: #6A9A80">நகை எடை (Weight):</span>
        <span>${r.weight.toFixed(3)} g</span>
      </div>
      <div class="totals-row grand-total">
        <span>மொத்த கட்டணம் (Net Fee):</span>
        <span>₹${Number(r.amount).toLocaleString('en-IN')}</span>
      </div>
    </div>
  </div>

  <div class="thank-you-brand">Thank You</div>

  <div class="signature-section">
    <div class="signature-line">Customer Signature</div>
    <div class="signature-line">Authorized Signatory</div>
  </div>

  <div style="margin-top: 28px; padding: 8px 12px; border: 1.5px solid rgba(15, 61, 52, 0.25); border-radius: 6px; text-align: center; font-size: 11px; font-weight: 700; color: #4A6B5D; letter-spacing: 0.3px; font-family: 'Inter', sans-serif;">
    Terms &amp; Conditions: Gold and Silver goods purchased can be exchanged without any difference within 7 days from the date of purchase.
  </div>

  <script>
    window.onload = () => {
      window.print();
      setTimeout(() => window.close(), 1000);
    }
  <\/script>
  </body></html>`)
  win.document.close()
}

/* ═══════════════════════════════════════════════════════════ */
const Reports = () => {
  const [records, setRecords]   = useState(loadRecords)
  const [form, setForm]         = useState(EMPTY_FORM)
  const [goldRate, setGoldRate] = useState('')
  const [silverRate, setSilverRate] = useState('')
  const [search, setSearch]     = useState('')
  const [saved, setSaved]       = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [errors, setErrors]     = useState({})

  useEffect(() => { saveRecords(records) }, [records])

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors(prev => ({ ...prev, [e.target.name]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.item.trim())  e.item   = 'பொருள் பெயர் தேவை'
    if (!form.weight)       e.weight = 'எடை தேவை'
    if (!form.amount)       e.amount = 'தொகை தேவை'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleAdd = (e) => {
    e.preventDefault()
    if (!validate()) return
    const rec = {
      id:          Date.now(),
      date:        form.date,
      item:        form.item.trim(),
      weight:      parseFloat(form.weight),
      serviceType: form.serviceType,
      amount:      parseFloat(form.amount),
      notes:       form.notes.trim(),
      customerName: form.customerName.trim(),
      customerPhone: form.customerPhone.trim(),
      goldRate:    form.goldRate,
      silverRate:  form.silverRate,
    }
    setRecords(prev => [rec, ...prev])
    setForm(EMPTY_FORM)
    setSaved(true)
    setTimeout(() => setSaved(false), 2800)
  }

  const handleDelete = (id) => { setRecords(prev => prev.filter(r => r.id !== id)); setDeleteId(null) }

  const filtered = records.filter(r =>
    r.item.toLowerCase().includes(search.toLowerCase()) ||
    r.serviceType.toLowerCase().includes(search.toLowerCase()) ||
    (r.notes || '').toLowerCase().includes(search.toLowerCase())
  )

  const totalWeight = records.reduce((s, r) => s + r.weight, 0)
  const totalAmount = records.reduce((s, r) => s + r.amount, 0)

  return (
    <div className="animate-fade-in">

      {/* ── Page Header ──────────────────────────────────── */}
      <div className="flex-between mb-16">
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, fontFamily: "'Noto Sans Tamil', sans-serif", color: 'var(--primary)' }}>
            சேவை பதிவேடு
          </h2>
          <p className="text-sub" style={{ marginTop: '4px', fontFamily: 'Inter, sans-serif', fontSize: '13px' }}>
            Polish &amp; Repair Service Log — இதயம் ஜூவல்லரி
          </p>
        </div>
        {/* Summary pills */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {records.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('அனைத்து சேவை பதிவுகளையும் நீக்க வேண்டுமா? (Clear all service logs?)')) {
                  setRecords([])
                  localStorage.removeItem(STORAGE_KEY)
                }
              }}
              className="btn btn-danger-ghost"
              style={{ padding: '6px 12px', fontSize: '11px', height: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Trash2 size={13} /> பதிவுகளை நீக்கு (Clear All)
            </button>
          )}
          <div style={{ background: 'var(--primary)', color: 'var(--gold-light)', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, fontFamily: 'Inter' }}>
            {records.length} சேவைகள்
          </div>
          <div style={{ background: 'var(--soft-fern)', color: '#fff', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, fontFamily: 'Inter' }}>
            ₹{totalAmount.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* ── Toast ────────────────────────────────────────── */}
      {saved && (
        <div style={{
          background: 'var(--soft-fern)', color: '#fff',
          padding: '12px 20px', borderRadius: '12px', marginBottom: '18px',
          fontFamily: "'Noto Sans Tamil', 'Inter', sans-serif", fontSize: '14px', fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: '8px',
          boxShadow: '0 4px 16px rgba(90,160,109,0.35)',
          animation: 'slideDown 0.3s ease'
        }}>
          ✅ சேவை பதிவு சேமிக்கப்பட்டது! — Service entry saved.
        </div>
      )}

      {/* ── 2-Column Layout ──────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '24px', alignItems: 'start' }}>

        {/* ══ LEFT: Entry Form ═════════════════════════════ */}
        <div className="card" style={{ position: 'sticky', top: '90px', border: '1.5px solid rgba(90,160,109,0.25)' }}>

          {/* Gold shimmer line */}
          <div style={{
            position: 'absolute', top: 0, left: '8%', right: '8%', height: '2px',
            background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
            borderRadius: '2px'
          }} />

          <div className="card-title" style={{ marginTop: '8px', gap: '8px', display: 'flex', alignItems: 'center' }}>
            <Wrench size={15} color="var(--soft-fern)" />
            புதிய சேவை பதிவு
            <span style={{ fontSize: '11px', fontFamily: 'Inter', color: 'var(--text-light)', fontWeight: 400 }}>New Service Entry</span>
          </div>

          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

            {/* Customer Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>வாடிக்கையாளர் பெயர்</label>
                <input
                  type="text"
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  placeholder="Name"
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>மொபைல்</label>
                <input
                  type="text"
                  name="customerPhone"
                  value={form.customerPhone}
                  onChange={handleChange}
                  placeholder="Mobile"
                />
              </div>
            </div>

            {/* Date */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <CalendarDays size={12} color="var(--soft-fern)" /> தேதி (Date)
              </label>
              <input type="date" name="date" value={form.date} onChange={handleChange} required />
            </div>

            {/* Item */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <ClipboardList size={12} color="var(--soft-fern)" /> பொருள் (Item Name) *
              </label>
              <input
                type="text" name="item" value={form.item} onChange={handleChange}
                placeholder="எ.கா. தங்க வளையல், மோதிரம்..."
                style={{ borderColor: errors.item ? 'var(--danger)' : undefined }}
              />
              {errors.item && <span style={{ color: 'var(--danger)', fontSize: '11px', fontFamily: "'Noto Sans Tamil', 'Inter', sans-serif" }}>{errors.item}</span>}
            </div>

            {/* Service Type */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Wrench size={12} color="var(--soft-fern)" /> சேவை வகை (Service Type)
              </label>
              <select name="serviceType" value={form.serviceType} onChange={handleChange}>
                {SERVICE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Weight + Amount in 2-col */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Scale size={12} color="var(--soft-fern)" /> எடை — g *
                </label>
                <input
                  type="number" name="weight" value={form.weight} onChange={handleChange}
                  placeholder="0.000" step="0.001" min="0"
                  style={{ borderColor: errors.weight ? 'var(--danger)' : undefined }}
                />
                {errors.weight && <span style={{ color: 'var(--danger)', fontSize: '11px' }}>{errors.weight}</span>}
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <IndianRupee size={12} color="var(--soft-fern)" /> தொகை ₹ *
                </label>
                <input
                  type="number" name="amount" value={form.amount} onChange={handleChange}
                  placeholder="0.00" step="0.01" min="0"
                  style={{ borderColor: errors.amount ? 'var(--danger)' : undefined }}
                />
                {errors.amount && <span style={{ color: 'var(--danger)', fontSize: '11px' }}>{errors.amount}</span>}
              </div>
            </div>

            {/* Notes */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>குறிப்பு / வாடிக்கையாளர் பெயர் (Notes)</label>
              <input
                type="text" name="notes" value={form.notes} onChange={handleChange}
                placeholder="எ.கா. வாடிக்கையாளர் பெயர், கூடுதல் விவரம்..."
              />
            </div>

            {/* Today Rate Inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>தங்கம் விலை (Gold 1g ₹)</label>
                <input
                  type="number" name="goldRate" value={form.goldRate} onChange={handleChange}
                  placeholder="எ.கா. 7250"
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>வெள்ளி விலை (Silver 1g ₹)</label>
                <input
                  type="number" name="silverRate" value={form.silverRate} onChange={handleChange}
                  placeholder="எ.கா. 105"
                />
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="btn btn-full" style={{
              background: 'var(--primary)', color: 'var(--gold-light)',
              height: '46px', fontSize: '14px', fontFamily: "'Noto Sans Tamil', 'Inter', sans-serif",
              fontWeight: 700, borderRadius: '10px', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all 0.2s', boxShadow: '0 4px 14px rgba(15,61,52,0.30)'
            }}>
              <PlusCircle size={16} />
              + சேவை சேர் (Save Entry)
            </button>

          </form>


        </div>

        {/* ══ RIGHT: Service History ════════════════════════ */}
        <div className="card" style={{ border: '1.5px solid rgba(90,160,109,0.20)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div className="card-title" style={{ marginBottom: 0, border: 'none', paddingBottom: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ClipboardList size={15} color="var(--soft-fern)" />
              சேவை வரலாறு
              <span style={{ fontSize: '11px', fontFamily: 'Inter', color: 'var(--text-light)', fontWeight: 400 }}>Service History</span>
            </div>
            <span style={{ fontSize: '12px', background: 'var(--bg)', padding: '4px 12px', borderRadius: '20px', color: 'var(--primary)', fontWeight: 600, fontFamily: 'Inter' }}>
              {records.length} பதிவுகள்
            </span>
          </div>

          {/* Search */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: 'var(--bg)', border: '1px solid var(--border)',
            borderRadius: '10px', padding: '0 14px', marginBottom: '16px'
          }}>
            <Search size={14} color="var(--text-light)" />
            <input
              type="text"
              placeholder="பொருள் அல்லது சேவை வகை தேட... (Search...)"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                border: 'none', background: 'transparent', height: '40px',
                fontSize: '13px', outline: 'none', width: '100%',
                fontFamily: "'Noto Sans Tamil', 'Inter', sans-serif", color: 'var(--text-main)'
              }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)' }}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* Today Rate Settings */}
          <div style={{
            display: 'flex', gap: '15px', alignItems: 'center',
            background: 'var(--bg)', border: '1.5px solid rgba(200,169,106,0.3)',
            borderRadius: '10px', padding: '10px 14px', marginBottom: '16px',
            fontSize: '12px', flexWrap: 'wrap'
          }}>
            <span style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: "'Noto Sans Tamil', sans-serif" }}>இன்றைய விலை (பிரிண்ட்டிற்கு):</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <label style={{ color: 'var(--text-sub)', fontWeight: '600' }}>தங்கம் 1g:</label>
              <input
                type="text"
                placeholder="எ.கா. 7250"
                value={goldRate}
                onChange={e => setGoldRate(e.target.value)}
                style={{ width: '75px', height: '28px', padding: '0 8px', borderRadius: '6px', border: '1px solid var(--border)', background: '#fff', fontSize: '11px', fontWeight: '600' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <label style={{ color: 'var(--text-sub)', fontWeight: '600' }}>வெள்ளி 1g:</label>
              <input
                type="text"
                placeholder="எ.கா. 105"
                value={silverRate}
                onChange={e => setSilverRate(e.target.value)}
                style={{ width: '65px', height: '28px', padding: '0 8px', borderRadius: '6px', border: '1px solid var(--border)', background: '#fff', fontSize: '11px', fontWeight: '600' }}
              />
            </div>
          </div>

          {/* History list */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-sub)' }}>
              <div style={{
                width: '60px', height: '60px', borderRadius: '50%', background: 'var(--bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px',
                border: '1.5px solid var(--border)'
              }}>
                <Wrench size={26} color="var(--sage-leaf)" />
              </div>
              <div style={{ fontWeight: 600, fontSize: '15px', fontFamily: "'Noto Sans Tamil', sans-serif", marginBottom: '5px' }}>
                {search ? 'பொருத்தமான பதிவுகள் இல்லை' : 'சேவை பதிவுகள் இல்லை'}
              </div>
              <div style={{ fontSize: '12.5px', fontFamily: 'Inter', color: 'var(--text-light)' }}>
                {search ? 'Try a different search term' : 'Add a service entry using the form on the left'}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filtered.map(r => (
                <div key={r.id} style={{
                  background: 'var(--bg)', borderRadius: '12px', padding: '14px 16px',
                  border: '1px solid var(--border)',
                  display: 'flex', gap: '14px', alignItems: 'flex-start',
                  transition: 'box-shadow 0.2s'
                }}>
                  {/* Left: Icon */}
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
                    background: 'rgba(90,160,109,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Wrench size={16} color="var(--soft-fern)" />
                  </div>

                  {/* Middle: Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, fontSize: '14px', fontFamily: "'Noto Sans Tamil', 'Inter', sans-serif", color: 'var(--primary)' }}>
                        {r.item}
                      </span>
                      <span style={{
                        background: 'rgba(90,160,109,0.15)', color: 'var(--primary)',
                        fontSize: '11px', fontWeight: 600, padding: '2px 10px', borderRadius: '20px',
                        fontFamily: "'Noto Sans Tamil', 'Inter', sans-serif", whiteSpace: 'nowrap'
                      }}>
                        {r.serviceType}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-sub)', fontFamily: 'Inter', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CalendarDays size={11} /> {fmtDate(r.date)}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-sub)', fontFamily: 'Inter', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Scale size={11} /> {r.weight.toFixed(3)}g
                      </span>
                      {r.notes && (
                        <span style={{ fontSize: '12px', color: 'var(--text-light)', fontFamily: "'Noto Sans Tamil', 'Inter', sans-serif" }}>
                          📝 {r.notes}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Amount + actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
                    <span style={{ fontSize: '17px', fontWeight: 700, color: 'var(--success)', fontFamily: 'Inter' }}>
                      ₹{r.amount.toLocaleString('en-IN')}
                    </span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {/* Print */}
                      <button
                        onClick={() => printReceipt(r, r.goldRate || goldRate, r.silverRate || silverRate)}
                        title="Print Receipt"
                        style={{
                          width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--border)',
                          background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--primary)', transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--soft-fern)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--soft-fern)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.borderColor = 'var(--border)' }}
                      >
                        <Printer size={14} />
                      </button>

                      {/* Delete */}
                      {deleteId === r.id ? (
                        <>
                          <button
                            onClick={() => handleDelete(r.id)}
                            style={{
                              height: '32px', padding: '0 10px', borderRadius: '8px',
                              background: 'var(--danger)', color: '#fff', border: 'none',
                              fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Noto Sans Tamil', 'Inter', sans-serif"
                            }}
                          >நீக்கு</button>
                          <button
                            onClick={() => setDeleteId(null)}
                            style={{
                              width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--border)',
                              background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                          ><X size={12} /></button>
                        </>
                      ) : (
                        <button
                          onClick={() => setDeleteId(r.id)}
                          title="Delete"
                          style={{
                            width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--border)',
                            background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--danger)', transition: 'all 0.2s'
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger)'; e.currentTarget.style.color = '#fff' }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = 'var(--danger)' }}
                        ><Trash2 size={13} /></button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Reports
