import React, { useState, useEffect } from 'react'
import { PlusCircle, Trash2, Wrench, Scale, IndianRupee, CalendarDays, ClipboardList, Printer, X, Search } from 'lucide-react'

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
}

const fmtDate = (d) => {
  if (!d) return '—'
  const [y, m, day] = d.split('-')
  return `${day}/${m}/${y}`
}

/* ─── Print Receipt ────────────────────────────────────────── */
const printReceipt = (r) => {
  const win = window.open('', '_blank', 'width=580,height=750')
  win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Service Receipt - இதயம் ஜூவல்லரி</title>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;600;700;800&family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Noto Sans Tamil','Inter',sans-serif;padding:24px;background:#fff;color:#0F1A17;width:480px;margin:0 auto;border:2px solid #0F3D34}
    .header{background:linear-gradient(135deg,#0F3D34 0%,#134E43 100%);color:#fff;text-align:center;padding:20px;margin:-24px -24px 18px -24px;border-bottom:3px solid #C8A96A}
    .shop-title{font-size:28px;font-weight:800;color:#F0DFA8;letter-spacing:1px;margin-bottom:2px}
    .shop-sub{font-size:14px;font-weight:600;color:#FFFFFF;margin-bottom:4px}
    .shop-tag{font-size:11px;color:#C8A96A;letter-spacing:1.2px;text-transform:uppercase;font-weight:600;margin-bottom:8px}
    .contacts{display:inline-block;background:rgba(0,0,0,0.25);color:#E6F0E9;padding:4px 14px;border-radius:15px;font-size:12px;font-weight:600;font-family:'Inter',sans-serif}
    .highlights{background:#FFF9EE;border:1px dashed #C8A96A;border-radius:8px;padding:8px 12px;margin-bottom:16px;font-size:11px;color:#3F8451;font-weight:600;text-align:center;line-height:1.5}
    .meta-bar{display:flex;justify-content:space-between;padding:10px 14px;background:#EBF4ED;border-radius:8px;margin-bottom:16px;font-size:12.5px;border:1px solid rgba(63,132,81,0.15)}
    .service-table{width:100%;border-collapse:collapse;margin-bottom:16px;font-size:13px}
    .service-table th{background:#0F3D34;color:#F0DFA8;padding:9px 12px;font-size:11px;text-transform:uppercase;letter-spacing:0.5px}
    .service-table td{padding:10px 12px;border-bottom:1px solid rgba(63,132,81,0.15)}
    .total-box{background:#0F3D34;color:#fff;border-radius:10px;padding:14px;text-align:center;margin:16px 0 14px}
    .total-label{font-size:11px;color:#C8A96A;letter-spacing:0.8px;text-transform:uppercase;margin-bottom:3px}
    .total-val{font-size:26px;font-weight:800;color:#F0DFA8;font-family:'Inter',sans-serif}
    .footer-address{text-align:center;font-size:11px;color:#2E5242;padding-top:10px;border-top:1px dashed rgba(63,132,81,0.3);line-height:1.5}
    @media print{
      body{padding:16px;margin:0 auto;width:100%;border:none}
      .header{margin:-16px -16px 14px -16px}
      @page{margin:6mm;size:auto}
    }
  </style></head><body>
  <div class="header">
    <div class="shop-title">இதயம்</div>
    <div class="shop-sub">ஜூவல்லரி &amp; நகை தொழிலகம்</div>
    <div class="shop-tag">Wholesale &amp; Retail Shop</div>
    <div class="contacts">📞 95979 76729 &bull; 73391 60876 &bull; 81480 03454</div>
  </div>

  <div class="highlights">
    ✨ 926 நகைகள் ஆர்டரின் பேரில் சிறந்த முறையில் செய்து தரப்படும்<br>
    ✨ வெள்ளி கொலுசுகளுக்கு செய்கூலி, சேதாரம் இல்லை
  </div>

  <div class="meta-bar">
    <div><b>ரசீது எண் (Receipt):</b> SVC-${r.id.toString().slice(-6)}</div>
    <div><b>தேதி (Date):</b> ${fmtDate(r.date)}</div>
  </div>

  <table class="service-table">
    <thead>
      <tr>
        <th style="text-align:left">சேவை விவரம் (Service Details)</th>
        <th style="text-align:right">எடை (Weight)</th>
        <th style="text-align:right">கட்டணம் (Amount)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <b style="color:#0F3D34">${r.item}</b>
          <div style="font-size:11px;color:#5AA06D;margin-top:2px">🔧 ${r.serviceType}</div>
          ${r.notes ? `<div style="font-size:11px;color:#6A9A80;margin-top:2px">📝 ${r.notes}</div>` : ''}
        </td>
        <td style="text-align:right;font-weight:700;color:#A6834A">${r.weight.toFixed(3)} g</td>
        <td style="text-align:right;font-weight:700;color:#1A7A4A">₹${Number(r.amount).toLocaleString('en-IN')}</td>
      </tr>
    </tbody>
  </table>

  <div class="total-box">
    <div class="total-label">சேவை கட்டணம் (TOTAL SERVICE AMOUNT)</div>
    <div class="total-val">₹${Number(r.amount).toLocaleString('en-IN')}</div>
  </div>

  <div class="footer-address">
    📍 <b>8 - வடக்கு ரத வீதி, டவுன் போலீஸ் ஸ்டேஷன் ரோடு, சிவகாசி.</b><br>
    வருகைக்கு நன்றி! (Thank You!)
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
        <div style={{ display: 'flex', gap: '10px' }}>
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

          {/* Totals box */}
          {records.length > 0 && (
            <div style={{
              marginTop: '20px', background: 'var(--bg)', borderRadius: '10px', padding: '14px 16px',
              border: '1px solid var(--border)'
            }}>
              <div style={{ fontSize: '11px', color: 'var(--text-light)', fontFamily: 'Inter', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px' }}>
                மொத்த சுருக்கம்
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12.5px', color: 'var(--text-sub)', fontFamily: "'Noto Sans Tamil', 'Inter', sans-serif" }}>மொத்த எடை</span>
                <span style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'Inter' }}>{totalWeight.toFixed(3)}g</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12.5px', color: 'var(--text-sub)', fontFamily: "'Noto Sans Tamil', 'Inter', sans-serif" }}>மொத்த தொகை</span>
                <span style={{ fontWeight: 700, color: 'var(--success)', fontFamily: 'Inter', fontSize: '15px' }}>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          )}
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
                        onClick={() => printReceipt(r)}
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
