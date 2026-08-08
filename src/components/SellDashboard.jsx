import React, { useState } from 'react'
import { MASTER_DATA } from '../data/masterData'
import { ShoppingCart, User, CreditCard, Trash2, Eye, Printer, PlusCircle, Scale, Tag, IndianRupee } from 'lucide-react'
import BillModal from './BillModal'

const CATEGORIES = Object.keys(MASTER_DATA)

const SellDashboard = ({ products = [], processSale }) => {
  const [formData, setFormData] = useState({
    category: '', subcategory: '', variant: '', detail: '', weight: '', quantity: '', grossAmount: '', discountAmt: ''
  })
  const [customer, setCustomer] = useState({ name: '', mobile: '' })
  const [goldRate, setGoldRate] = useState('')
  const [silverRate, setSilverRate] = useState('')
  const [oldSilverAmount, setOldSilverAmount] = useState('')
  const [oldGoldAmount, setOldGoldAmount] = useState('')
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(false)
  const [showBill, setShowBill] = useState(null)
  const [lastBill, setLastBill] = useState(null)
  const [selectedStockId, setSelectedStockId] = useState('')
  const [weightSearch, setWeightSearch] = useState('')
  const [saleDate, setSaleDate] = useState(() => {
    return new Date().toLocaleString('sv-SE').slice(0, 16).replace(' ', 'T')
  })

  const getSubs = () => formData.category ? Object.keys(MASTER_DATA[formData.category]) : []
  const getVariants = () => {
    if (!formData.category || !formData.subcategory) return []
    const d = MASTER_DATA[formData.category][formData.subcategory]
    return Array.isArray(d) ? d : (typeof d === 'object' ? Object.keys(d) : [])
  }

  const getCategoryEmoji = (cat) => {
    if (cat?.toLowerCase().includes('gold') || cat?.toLowerCase().includes('தங்கம்')) return '🟡'
    if (cat?.toLowerCase().includes('silver') || cat?.toLowerCase().includes('வெள்ளி')) return '⚪'
    return '📦'
  }

  const matchingStocks = products.filter(p => {
    if (formData.category && p.category !== formData.category) return false
    if (formData.subcategory && p.subcategory !== formData.subcategory) return false
    if (formData.variant && p.variant !== formData.variant) return false
    return p.weight > 0 || (p.quantity && p.quantity > 0)
  })

  const filteredStocks = matchingStocks.filter(s => {
    if (!weightSearch) return true
    const searchVal = weightSearch.trim().toLowerCase()
    return s.weight.toString().includes(searchVal) ||
           s.weight.toFixed(3).includes(searchVal) ||
           (s.detail && s.detail.toLowerCase().includes(searchVal)) ||
           s.id.toString() === searchVal
  })

  const availableStock = products.find(p => p.id === parseInt(selectedStockId))

  const handleReset = () => {
    setFormData({
      category: '', subcategory: '', variant: '', detail: '', weight: '', quantity: '', grossAmount: '', discountAmt: ''
    })
    setSelectedStockId('')
    setWeightSearch('')
  }

  // Calculated preview values
  const grossVal = parseFloat(formData.grossAmount || 0)
  const discVal  = parseFloat(formData.discountAmt || 0)
  const netVal   = Math.max(0, grossVal - discVal)

  const addToCart = () => {
    const w = parseFloat(formData.weight || 0)
    const q = parseInt(formData.quantity || 0)
    const gross = parseFloat(formData.grossAmount || 0)
    const disc  = parseFloat(formData.discountAmt || 0)
    const net   = Math.max(0, gross - disc)

    if (!selectedStockId || !availableStock) {
      alert('இந்த பொருள் இருப்பில் இல்லை')
      return
    }
    if (w <= 0 && q <= 0) {
      alert('எடை அல்லது எண்ணிக்கை தேவை')
      return
    }

    if (availableStock) {
      const alreadyQty = cart.filter(item => item.productId === availableStock.id).reduce((s, i) => s + (parseInt(i.quantity) || 0), 0)
      const alreadyWt = cart.filter(item => item.productId === availableStock.id).reduce((s, i) => s + (parseFloat(i.weight) || 0), 0)
      
      const availWt = Math.max(0, (availableStock.weight || 0) - alreadyWt)
      const availQty = Math.max(0, (availableStock.quantity || 0) - alreadyQty)

      if (w > 0 && w > (availWt + 0.0001)) {
        alert(`இருப்பில் போதுமான எடை இல்லை! (இருப்பில் உள்ள எடை: ${availWt.toFixed(3)}g மட்டுமே)`)
        return
      }
      if (q > 0 && q > availQty) {
        alert(`இருப்பில் போதுமான எண்ணிக்கை இல்லை! (இருப்பில் உள்ள எண்ணிக்கை: ${availQty} pcs மட்டுமே)`)
        return
      }
    }

    setCart([...cart, {
      ...formData,
      productId: availableStock.id,
      weight: w,
      quantity: q || 1,
      grossAmount: gross,
      discountAmount: disc,
      total: net,
      pricePerGram: w > 0 ? (gross / w) : 0
    }])

    setFormData({ ...formData, weight: '', quantity: '', grossAmount: '', discountAmt: '' })
    setSelectedStockId('')
    setWeightSearch('')
  }

  const handleSale = async (shouldPrint = false) => {
    if (!cart.length) return
    setLoading(true)
    try {
      const selectedIsoDate = new Date(saleDate).toISOString()
      const bill = await processSale(customer.name || 'Walk-in', customer.mobile, cart, selectedIsoDate, goldRate, silverRate, oldSilverAmount, oldGoldAmount)

      setLastBill(bill)
      if (shouldPrint) {
        setShowBill(bill)
      } else {
        alert('விற்பனை வெற்றிகரமாக பதிவு செய்யப்பட்டது! (Sale logged successfully)')
      }

      setCart([])
      setCustomer({ name: '', mobile: '' })
      setGoldRate('')
      setSilverRate('')
      setOldSilverAmount('')
      setOldGoldAmount('')
      setSaleDate(new Date().toLocaleString('sv-SE').slice(0, 16).replace(' ', 'T'))
    } catch (err) {
      alert('விற்பனை பிழை: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const cartGrossTotal = cart.reduce((s, i) => s + (i.grossAmount || i.total || 0), 0)
  const cartDiscTotal  = cart.reduce((s, i) => s + (i.discountAmount || 0), 0)
  const cartNetTotal   = cart.reduce((s, i) => s + (i.total || 0), 0)

  return (
    <div className="animate-fade-in">
      <div className="flex-between mb-16">
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--primary)' }}>விற்பனை &amp; பில்</h2>
          <p className="text-sub">Process customer sales and generate professional invoices</p>
        </div>
        <div className="flex" style={{ gap: '10px' }}>
          {lastBill && (
            <button className="btn btn-ghost" onClick={() => setShowBill(lastBill)} style={{ gap: '6px' }}>
              <Eye size={16} /> கடைசி பில் (View Last Bill)
            </button>
          )}
          <div className="stat-icon" style={{ background: 'var(--soft-fern)', color: '#fff' }}>
            <ShoppingCart size={22} />
          </div>
        </div>
      </div>

      <div className="sell-layout-grid">
        {/* Item Selection Form */}
        <div className="card" style={{ border: '1.5px solid rgba(90,160,109,0.25)' }}>
          <div className="flex-between mb-12">
            <div className="card-title" style={{ margin: 0 }}>பொருள் தேர்வு (Item Selection)</div>
            <button
              type="button"
              className="btn btn-ghost"
              style={{ fontSize: '11px', padding: '4px 10px', height: 'auto' }}
              onClick={handleReset}
            >
              Reset Filters / Clear
            </button>
          </div>

          <div className="form-grid form-grid-2col">
            <div className="form-group">
              <label>பிரிவு (Category)</label>
              <select value={formData.category} onChange={e => {
                setFormData({ ...formData, category: e.target.value, subcategory: '', variant: '', detail: '' })
                setSelectedStockId('')
                setWeightSearch('')
              }}>
                <option value="">— Select —</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>துணை பிரிவு (Sub)</label>
              <select value={formData.subcategory} onChange={e => {
                setFormData({ ...formData, subcategory: e.target.value, variant: '', detail: '' })
                setSelectedStockId('')
                setWeightSearch('')
              }} disabled={!formData.category}>
                <option value="">— Select —</option>
                {getSubs().map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group grid-span-2">
              <label>மாடல் (Variant)</label>
              <select value={formData.variant} onChange={e => {
                setFormData({ ...formData, variant: e.target.value, detail: '' })
                setSelectedStockId('')
                setWeightSearch('')
              }} disabled={!formData.subcategory}>
                <option value="">— Select —</option>
                {getVariants().map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>

            {matchingStocks.length > 0 && (
              <div className="form-group grid-span-2">
                <label>இருப்புத் தேடல் (எடை/விவரம்/ID மூலம் தேட) / Search Stock</label>
                <input
                  type="text"
                  placeholder="எடை, விவரம் அல்லது ID தட்டச்சு செய்யவும்..."
                  value={weightSearch}
                  onChange={e => {
                    const val = e.target.value
                    setWeightSearch(val)
                    const matches = matchingStocks.filter(s =>
                      s.weight.toString().includes(val) ||
                      s.weight.toFixed(3).includes(val) ||
                      (s.detail && s.detail.toLowerCase().includes(val.toLowerCase())) ||
                      s.id.toString() === val
                    )
                    if (matches.length === 1) {
                      const s = matches[0]
                      setSelectedStockId(s.id.toString())
                      setFormData({
                        ...formData,
                        category: s.category,
                        subcategory: s.subcategory,
                        variant: s.variant,
                        detail: s.detail,
                        weight: s.weight.toString(),
                        quantity: "1"
                      })
                    }
                  }}
                />
              </div>
            )}

            <div className="form-group grid-span-2">
              <label>இருப்புத் தெரிவு (Select Specific Stock) <span style={{ color: 'red' }}>*</span></label>
              <select value={selectedStockId} onChange={e => {
                const id = e.target.value
                setSelectedStockId(id)
                const s = products.find(p => p.id === parseInt(id))
                if (s) {
                  setFormData({
                    ...formData,
                    category: s.category,
                    subcategory: s.subcategory,
                    variant: s.variant,
                    detail: s.detail,
                    weight: s.weight.toString(),
                    quantity: "1"
                  })
                }
              }} disabled={matchingStocks.length === 0}>
                <option value="">— {matchingStocks.length > 0 ? 'Select Stock Entry' : 'No Stock Available'} —</option>
                {filteredStocks.slice(0, 100).map(s => (
                  <option key={s.id} value={s.id}>
                    ID: {s.id} | {getCategoryEmoji(s.category)} {s.category} {' > '} {s.subcategory} {' > '} {s.variant} | {s.detail || 'No Detail'} | {s.quantity} pcs | {s.weight}g
                  </option>
                ))}
              </select>
            </div>

            {matchingStocks.length > 0 && (
              <div className="grid-span-2" style={{ marginTop: '-4px', marginBottom: '8px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-sub)', marginBottom: '6px', display: 'block' }}>
                  இருப்பில் உள்ள பொருட்கள் (Click to select):
                </label>
                <div style={{
                  display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '140px', overflowY: 'auto',
                  padding: '8px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px'
                }}>
                  {filteredStocks.slice(0, 50).map(s => {
                    const isSelected = selectedStockId === s.id.toString()
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setSelectedStockId(s.id.toString())
                          setFormData({
                            ...formData,
                            category: s.category,
                            subcategory: s.subcategory,
                            variant: s.variant,
                            detail: s.detail,
                            weight: s.weight.toString(),
                            quantity: "1"
                          })
                        }}
                        style={{
                          background: isSelected ? 'var(--primary)' : '#fff',
                          border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border)',
                          color: isSelected ? '#F0DFA8' : 'var(--text-main)',
                          padding: '4px 10px', borderRadius: '6px', fontSize: '12px',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                          transition: 'all 0.15s ease', fontWeight: isSelected ? 600 : 500
                        }}
                      >
                        <span style={{ fontSize: '10px', opacity: 0.8 }}>#{s.id}</span>
                        <span>{getCategoryEmoji(s.category)} {s.variant || s.subcategory || s.category}: {s.weight}g</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Inputs: Weight & Qty */}
            <div className="form-group">
              <label><Scale size={12} style={{ marginRight: '4px' }} />விற்கப்படும் எடை (Weight g)</label>
              <input type="number" step="0.001" value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} placeholder="0.000" />
            </div>
            <div className="form-group">
              <label>விற்கப்படும் எண்ணிக்கை (Qty)</label>
              <input type="number" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} placeholder="1" />
            </div>

            {/* Manual Entry: Amount & Discount */}
            <div className="form-group">
              <label><IndianRupee size={12} style={{ marginRight: '4px' }} />தொகை / மதிப்பு (Gross Amount ₹)</label>
              <input
                type="number" step="0.01" min="0" value={formData.grossAmount}
                onChange={e => setFormData({ ...formData, grossAmount: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div className="form-group">
              <label><Tag size={12} style={{ marginRight: '4px' }} />தள்ளுபடி (Discount Amount ₹)</label>
              <input
                type="number" step="0.01" min="0" value={formData.discountAmt}
                onChange={e => setFormData({ ...formData, discountAmt: e.target.value })}
                placeholder="0.00"
              />
            </div>

            {/* Net Total Preview */}
            <div className="grid-span-2" style={{
              background: 'var(--bg)', padding: '10px 14px', borderRadius: '8px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border)'
            }}>
              <span style={{ fontSize: '13px', color: 'var(--text-sub)', fontWeight: 600 }}>நிகர தொகை (Calculated Net Total):</span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--success)', fontFamily: 'Inter' }}>
                ₹{netVal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <button
            className="btn btn-full"
            onClick={addToCart}
            disabled={!selectedStockId}
            style={{
              marginTop: '16px', background: 'var(--primary)', color: 'var(--gold-light)',
              height: '44px', fontSize: '14px', fontWeight: 700, borderRadius: '10px',
              border: 'none', cursor: selectedStockId ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            <PlusCircle size={16} />
            + பட்டியலில் சேர் (Add to Cart)
          </button>
        </div>

        {/* Cart & Customer */}
        <div className="card" style={{ border: '1.5px solid rgba(90,160,109,0.25)' }}>
          <div className="card-title">விற்பனைப் பட்டியல் (Cart &amp; Billing)</div>

          <div className="form-grid form-grid-cust mb-16">
            <div className="form-group">
              <label><User size={12} /> வாடிக்கையாளர் பெயர்</label>
              <input type="text" placeholder="Name" value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>மொபைல்</label>
              <input type="text" placeholder="Mobile" value={customer.mobile} onChange={e => setCustomer({ ...customer, mobile: e.target.value })} />
            </div>
          </div>

          <div className="form-grid form-grid-2col mb-16">
            <div className="form-group">
              <label>இன்றைய தங்கம் விலை (Gold 1g ₹)</label>
              <input type="number" placeholder="எ.கா. 7250" value={goldRate} onChange={e => setGoldRate(e.target.value)} />
            </div>
            <div className="form-group">
              <label>இன்றைய வெள்ளி விலை (Silver 1g ₹)</label>
              <input type="number" placeholder="எ.கா. 105" value={silverRate} onChange={e => setSilverRate(e.target.value)} />
            </div>
          </div>

          <div className="form-grid form-grid-2col mb-16">
            <div className="form-group">
              <label>பழைய தங்கம் கழிப்பு (Old Gold Amount ₹)</label>
              <input type="number" placeholder="எ.கா. 2000" value={oldGoldAmount} onChange={e => setOldGoldAmount(e.target.value)} />
            </div>
            <div className="form-group">
              <label>பழைய வெள்ளி கழிப்பு (Old Silver Amount ₹)</label>
              <input type="number" placeholder="எ.கா. 1500" value={oldSilverAmount} onChange={e => setOldSilverAmount(e.target.value)} />
            </div>
          </div>

          <div className="form-group mb-16">
            <label>விற்பனை தேதி (Sale Date &amp; Time) *</label>
            <input
              type="datetime-local"
              value={saleDate}
              onChange={e => setSaleDate(e.target.value)}
              required
            />
          </div>

          <div style={{ minHeight: '180px', border: '1px solid var(--border)', borderRadius: 10, padding: '10px', background: 'var(--bg)', overflowY: 'auto', marginBottom: '15px' }}>
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-sub)' }}>பட்டியல் காலியாக உள்ளது</div>
            ) : (
              <table className="cart-table" style={{ width: '100%', fontSize: '13px' }}>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th style={{ textAlign: 'center' }}>Qty | Wt</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <div className="fw-600">{item.variant || item.subcategory}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-sub)' }}>
                          {item.category} {item.detail && ` · ${item.detail}`}
                        </div>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 600 }}>{item.quantity} pcs | {item.weight}g</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--success)' }}>
                        ₹{item.total?.toLocaleString('en-IN')}
                        {item.discountAmount > 0 && (
                          <div style={{ fontSize: '10px', color: 'var(--danger)', fontWeight: 500 }}>
                            (-₹{item.discountAmount})
                          </div>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="btn btn-danger-ghost" style={{ padding: 4 }} onClick={() => setCart(cart.filter((_, i) => i !== idx))}><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div>
            <div style={{ margin: '15px 0', padding: '14px', background: '#FFF', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <div className="flex-between fw-600" style={{ fontSize: '13.5px' }}>
                <span>மொத்த எண்ணிக்கை:</span><span>{cart.reduce((sum, item) => sum + (item.quantity || 0), 0)} pcs</span>
              </div>
              <div className="flex-between fw-600" style={{ fontSize: '13.5px', marginTop: '4px' }}>
                <span>மொத்த எடை:</span><span>{cart.reduce((sum, item) => sum + (parseFloat(item.weight) || 0), 0).toFixed(3)} g</span>
              </div>
              {cartDiscTotal > 0 && (
                <div className="flex-between fw-600" style={{ fontSize: '13.5px', marginTop: '4px', color: 'var(--danger)' }}>
                  <span>மொத்த தள்ளுபடி:</span><span>-₹{cartDiscTotal.toLocaleString('en-IN')}</span>
                </div>
              )}
              {(parseFloat(oldSilverAmount) || 0) > 0 && (
                <div className="flex-between fw-600" style={{ fontSize: '13.5px', marginTop: '4px', color: 'var(--danger)' }}>
                  <span>பழைய வெள்ளி கழிப்பு:</span><span>-₹{parseFloat(oldSilverAmount).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex-between fw-700" style={{ fontSize: '16px', marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed var(--border)', color: 'var(--primary)' }}>
                <span>நிகர விற்பனை தொகை:</span><span>₹{Math.max(0, cartNetTotal - (parseFloat(oldSilverAmount) || 0)).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* 2 Action Buttons: Log Sale Only VS Log & Print Bill */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                className="btn btn-full"
                disabled={!cart.length || loading}
                onClick={() => handleSale(false)}
                style={{
                  background: 'var(--soft-fern)', color: '#fff', height: '44px',
                  borderRadius: '10px', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                }}
              >
                <CreditCard size={16} />
                {loading ? 'செயலாக்கப்படுகிறது...' : 'பதிவு மட்டும் (Log Sale Only)'}
              </button>

              <button
                className="btn btn-full"
                disabled={!cart.length || loading}
                onClick={() => handleSale(true)}
                style={{
                  background: 'var(--primary)', color: '#F0DFA8', height: '44px',
                  borderRadius: '10px', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                }}
              >
                <Printer size={16} />
                {loading ? 'செயலாக்கப்படுகிறது...' : '🖨️ பில் அச்சிடு (Log & Print)'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showBill && <BillModal bill={showBill} onClose={() => setShowBill(null)} />}
    </div>
  )
}

export default SellDashboard
