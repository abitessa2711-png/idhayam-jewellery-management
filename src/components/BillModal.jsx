import React from 'react'

const BillModal = ({ bill, onClose }) => {
  if (!bill) return null
  const items = bill.items || []
  const finalSubtotal = items.reduce((s, i) => s + (i.subtotal || (i.weight * i.pricePerGram) || 0), 0)
  const finalDiscount = items.reduce((s, i) => s + (i.discountAmount || 0), 0)
  const finalGst = items.reduce((s, i) => s + (i.gstAmount || 0), 0)
  const finalTotal = items.reduce((s, i) => s + (i.total || 0), 0)

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()} style={{ width: '800px', maxWidth: '95vw', padding: 0 }}>
        
        <div style={{ padding: '30px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--gold)', marginBottom: '4px' }}>TAS JEWELLERS</h2>
            <div style={{ fontSize: '13px', color: 'var(--text-sub)' }}>AUTHENTIC GOLD & SILVER ORNAMENTS</div>
            <div style={{ borderBottom: '1px solid var(--border)', margin: '15px 0' }} />
          </div>

          {/* Customer Info */}
          <div className="flex-between" style={{ marginBottom: '24px', fontSize: '14px' }}>
            <div>
              <div style={{ color: 'var(--text-sub)', fontSize: '12px', marginBottom: '4px' }}>INVOICE TO</div>
              <div className="fw-700" style={{ fontSize: '18px' }}>{bill.customerName || 'Walk-in'}</div>
              {bill.mobile && <div style={{ marginTop: '4px', color: 'var(--text-sub)' }}>Ph: {bill.mobile}</div>}
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ marginBottom: '4px' }}><span style={{ color: 'var(--text-sub)' }}>NO:</span> <span className="fw-600">{bill.id || 'N/A'}</span></div>
              <div style={{ marginBottom: '4px' }}><span style={{ color: 'var(--text-sub)' }}>DATE:</span> <span className="fw-600">{bill.date || new Date().toLocaleDateString('en-IN')}</span></div>
            </div>
          </div>

          {/* Items Table */}
          <div className="table-wrap" style={{ marginBottom: '24px' }}>
            <table style={{ width: '100%', fontSize: '14px' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Item Details</th>
                  <th style={{ textAlign: 'center' }}>Qty</th>
                  <th style={{ textAlign: 'right' }}>Weight</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i}>
                    <td>
                      <div className="fw-600">{item.variant || item.subcategory}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-sub)' }}>{item.category} {item.detail && `- ${item.detail}`}</div>
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{item.quantity || 0} pcs</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{item.weight?.toFixed(3)}g</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Footer */}
          <div className="bill-summary-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-sub)', width: '50%', lineHeight: '1.6' }}>
              <strong>TERMS & CONDITIONS:</strong><br />
              1. No returns on silver/gold once sold.<br />
              2. Subject to local jurisdiction.<br />
              3. Quality guaranteed as per standards.
            </div>
            <div style={{ width: '320px', background: 'var(--bg)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div className="flex-between mb-8" style={{ fontSize: '14px', color: 'var(--text-sub)' }}>
                <span>மொத்த எண்ணிக்கை (Total Qty):</span>
                <span className="fw-700 text-main">{items.reduce((s, i) => s + (i.quantity || 0), 0)} pcs</span>
              </div>
              <div className="flex-between mb-8" style={{ fontSize: '14px', color: 'var(--text-sub)' }}>
                <span>மொத்த எடை (Total Weight):</span>
                <span className="fw-700 text-main">{items.reduce((s, i) => s + (parseFloat(i.weight) || 0), 0).toFixed(3)} g</span>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '30px', color: 'var(--text-sub)', fontSize: '13px', fontWeight: 600 }}>
            நன்றி! மீண்டும் வருக — THANK YOU!
          </div>
        </div>

        <div className="flex" style={{ justifyContent: 'center', padding: '20px', background: 'var(--bg)', borderTop: '1px solid var(--border)', borderRadius: '0 0 20px 20px' }}>
          <button className="btn btn-ghost btn-lg" onClick={onClose} style={{ width: '200px' }}>Close Window</button>
        </div>
      </div>
    </div>
  )
}

export default BillModal
