import React, { useState } from 'react'
import { Plus, Trash2, ClipboardList, RotateCcw } from 'lucide-react'

const OldBuyback = ({ buybacks = [], onAddBuyback, onDeleteBuyback }) => {
  const [formData, setFormData] = useState({
    date: new Date().toLocaleString('sv-SE').slice(0, 16).replace(' ', 'T'), // Format for datetime-local in local timezone
    itemName: '',
    weight: '',
    amount: '',
    detail: '',
    customerName: '',
    customerPhone: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.itemName || !formData.weight || !formData.amount) {
      alert('தயவுசெய்து பொருளின் பெயர், எடை மற்றும் தொகையை உள்ளிடவும் (Please fill required fields)')
      return
    }

    setLoading(true)
    try {
      await onAddBuyback({
        date: new Date(formData.date).toISOString(),
        itemName: formData.itemName,
        weight: parseFloat(formData.weight),
        amount: parseFloat(formData.amount),
        detail: formData.detail,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone
      })
      setFormData({
        date: new Date().toLocaleString('sv-SE').slice(0, 16).replace(' ', 'T'),
        itemName: '',
        weight: '',
        amount: '',
        detail: '',
        customerName: '',
        customerPhone: ''
      })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      alert('சேமிப்பதில் பிழை: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredBuybacks = buybacks.filter(b => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return b.itemName?.toLowerCase().includes(q) || b.detail?.toLowerCase().includes(q)
  })

  return (
    <div className="animate-fade-in">
      <div className="flex-between mb-16">
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700 }}>பழைய நகை கொள்முதல் (Old Item Buyback)</h2>
          <p className="text-sub">Log customer buybacks and trade-ins of old gold or silver</p>
        </div>
        <div className="stat-icon" style={{ background: 'var(--gold)18', color: 'var(--gold)' }}>
          <RotateCcw size={24} />
        </div>
      </div>

      <div className="sell-layout-grid">
        {/* Left Side: Form */}
        <div className="card">
          <div className="card-title">புதிய பழைய நகை சேர்க்கை (New Buyback Log)</div>
          
          {success && (
            <div className="toast-success" style={{ marginBottom: 16 }}>
              <Plus size={18} /> பழைய நகை வெற்றிகரமாக பதிவு செய்யப்பட்டது!
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Customer Details */}
            <div className="form-grid form-grid-2col" style={{ gap: 14, marginBottom: 14 }}>
              <div className="form-group">
                <label>வாடிக்கையாளர் பெயர் (Customer Name)</label>
                <input 
                  type="text" 
                  placeholder="பெயர் (Name)"
                  value={formData.customerName}
                  onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>மொபைல் எண் (Mobile Number)</label>
                <input 
                  type="text" 
                  placeholder="மொபைல் (Mobile)"
                  value={formData.customerPhone}
                  onChange={e => setFormData({ ...formData, customerPhone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 14 }}>
              <label>பொருளின் பெயர் (Item Name) *</label>
              <input 
                type="text" 
                placeholder="எ.கா. பழைய தங்கம் மோதிரம் / Old Gold Ring"
                value={formData.itemName}
                onChange={e => setFormData({ ...formData, itemName: e.target.value })}
                required
              />
            </div>

            <div className="form-grid form-grid-2col" style={{ gap: 14, marginBottom: 14 }}>
              <div className="form-group">
                <label>எடை (Weight g) *</label>
                <input 
                  type="number" step="0.001" min="0"
                  placeholder="0.000"
                  value={formData.weight}
                  onChange={e => setFormData({ ...formData, weight: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>மதிப்பு / தொகை (Amount ₹) *</label>
                <input 
                  type="number" step="0.01" min="0"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 14 }}>
              <label>குறிப்பு / விவரம் (Detail / Notes)</label>
              <input 
                type="text" 
                placeholder="எ.கா. 22k Gold, Damage piece, Customer Name..."
                value={formData.detail}
                onChange={e => setFormData({ ...formData, detail: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 20 }}>
              <label>நாள் / தேதி (Date & Time) *</label>
              <input 
                type="datetime-local" 
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-gold btn-lg btn-full" disabled={loading}>
              {loading ? 'சேமிக்கப்படுகிறது...' : '+ பழைய நகை சேர் (Log Buyback)'}
            </button>
          </form>
        </div>

        {/* Right Side: List */}
        <div className="card">
          <div className="flex-between mb-16">
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <ClipboardList size={16} />
              <span>கொள்முதல் வரலாறு (Buyback History)</span>
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <input 
              type="text" 
              placeholder="பொருளின் பெயர் கொண்டு தேட (Search)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <div className="table-wrap" style={{ maxHeight: '450px', overflowY: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Date & Item Name</th>
                  <th style={{ textAlign: 'right' }}>Weight</th>
                  <th style={{ textAlign: 'right' }}>Paid Amount</th>
                  <th className="hide-mobile">Notes</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredBuybacks.map(b => (
                  <tr key={b.id} className="table-row">
                    <td>
                      <div className="fw-600">{b.itemName}</div>
                      {b.customerName && b.customerName !== 'Old Gold/Silver Buyback' && (
                        <div style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: 600, marginTop: '2px' }}>
                          கஸ்டமர்: {b.customerName}
                        </div>
                      )}
                      <div style={{ fontSize: 11, color: 'var(--text-sub)', marginTop: '2px' }}>
                        {new Date(b.date).toLocaleString('en-IN')}
                      </div>
                      {b.detail && (
                        <div className="show-mobile" style={{ fontSize: 11, color: 'var(--gold)', marginTop: '2px', display: 'none' }}>
                          Note: {b.detail}
                        </div>
                      )}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{b.weight}g</td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--gold)' }}>
                      ₹{b.amount?.toLocaleString('en-IN')}
                    </td>
                    <td className="hide-mobile" style={{ fontSize: 12, color: 'var(--text-sub)' }}>{b.detail || '—'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        className="btn btn-danger-ghost" 
                        style={{ padding: 4 }} 
                        onClick={() => {
                          if (confirm('இந்தப் பதிவை நீக்க விரும்புகிறீர்களா? (Delete this buyback entry?)')) {
                            onDeleteBuyback(b.id)
                          }
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredBuybacks.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-sub)' }}>
                      கொள்முதல் தகவல்கள் இல்லை (No buybacks logged)
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OldBuyback
