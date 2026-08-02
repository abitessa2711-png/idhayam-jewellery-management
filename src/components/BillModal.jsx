import React from 'react'
import { Printer, X, Phone, MapPin, Sparkles } from 'lucide-react'

const BillModal = ({ bill, onClose }) => {
  if (!bill) return null
  const items = bill.items || []

  const totalQty       = items.reduce((s, i) => s + (i.quantity || 0), 0)
  const totalWeight    = items.reduce((s, i) => s + (parseFloat(i.weight) || 0), 0)
  const totalGross     = items.reduce((s, i) => s + (parseFloat(i.grossAmount || i.subtotal || i.total) || 0), 0)
  const totalDiscount  = items.reduce((s, i) => s + (parseFloat(i.discountAmount) || 0), 0)
  const netTotal       = items.reduce((s, i) => s + (parseFloat(i.total) || 0), 0)

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="modal-overlay">
      <style>{`
        .bill-modal-box {
          background: #FFFFFF;
          color: #0F1A17;
          width: 780px;
          max-width: 95vw;
          border-radius: 20px;
          box-shadow: 0 30px 80px rgba(0,0,0,0.45);
          overflow: hidden;
          position: relative;
          border: 2px solid var(--gold);
        }

        .bill-header-banner {
          background: linear-gradient(135deg, #0F3D34 0%, #134E43 60%, #0F3D34 100%);
          color: #FFFFFF;
          padding: 24px 30px;
          position: relative;
          text-align: center;
        }

        .bill-shop-title {
          font-family: 'Noto Sans Tamil', sans-serif;
          font-size: 32px;
          font-weight: 800;
          color: #F0DFA8;
          letter-spacing: 1px;
          margin-bottom: 2px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .bill-shop-sub {
          font-family: 'Noto Sans Tamil', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: #FFFFFF;
          margin-bottom: 4px;
        }

        .bill-shop-tag {
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #C8A96A;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .bill-contacts {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 18px;
          font-size: 13px;
          font-weight: 600;
          color: #E6F0E9;
          font-family: 'Inter', sans-serif;
          background: rgba(0,0,0,0.20);
          padding: 6px 16px;
          border-radius: 20px;
          width: fit-content;
          margin: 0 auto;
        }

        .bill-meta-bar {
          background: #EBF4ED;
          padding: 16px 30px;
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid rgba(63, 132, 81, 0.15);
          font-size: 13.5px;
        }

        .bill-badge-item {
          font-family: 'Noto Sans Tamil', 'Inter', sans-serif;
          line-height: 1.5;
        }

        .bill-highlights {
          background: #FFF9EE;
          border: 1px dashed #C8A96A;
          border-radius: 10px;
          padding: 10px 16px;
          margin: 16px 30px;
          display: flex;
          justify-content: space-around;
          font-size: 12px;
          color: #3F8451;
          font-weight: 600;
          font-family: 'Noto Sans Tamil', sans-serif;
        }

        .bill-table-container {
          padding: 0 30px 16px;
        }

        .bill-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          font-size: 13.5px;
        }

        .bill-table th {
          background: #0F3D34 !important;
          color: #F0DFA8 !important;
          font-weight: 600;
          padding: 10px 14px;
          font-size: 12px;
          text-transform: uppercase;
        }

        .bill-table td {
          padding: 11px 14px;
          border-bottom: 1px solid rgba(63, 132, 81, 0.12);
        }

        .bill-totals-box {
          margin: 16px 30px 24px;
          background: #EBF4ED;
          border-radius: 14px;
          padding: 16px 22px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px solid rgba(63, 132, 81, 0.20);
        }

        .bill-footer-address {
          text-align: center;
          padding: 14px 30px;
          background: #F7F6F1;
          border-top: 1px solid rgba(63, 132, 81, 0.15);
          font-size: 12px;
          color: #2E5242;
          font-family: 'Noto Sans Tamil', sans-serif;
        }

        @media print {
          body * {
            visibility: hidden;
          }
          .modal-overlay, .bill-modal-box, .bill-modal-box * {
            visibility: visible;
          }
          .modal-overlay {
            position: absolute;
            left: 0; top: 0;
            width: 100%; height: 100%;
            background: #FFFFFF !important;
            padding: 0 !important;
          }
          .bill-modal-box {
            box-shadow: none !important;
            border: none !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="bill-modal-box animate-fade-in" onClick={e => e.stopPropagation()}>

        {/* Action Header bar (no-print) */}
        <div className="no-print" style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 24px', background: '#0F3D34', borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <span style={{ color: '#F0DFA8', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} /> விற்பனை பில் அச்சு (Print Invoice)
          </span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handlePrint}
              style={{
                background: 'linear-gradient(135deg, #C8A96A 0%, #A6834A 100%)',
                color: '#0F1A17', border: 'none', padding: '7px 18px', borderRadius: '8px',
                fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
              }}
            >
              <Printer size={15} /> பில் அச்சிடு (Print Bill)
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none',
                width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Printable Invoice Document */}
        <div id="printable-bill">
          {/* Header Banner */}
          <div className="bill-header-banner">
            <div className="bill-shop-title">இதயம்</div>
            <div className="bill-shop-sub">ஜூவல்லரி &amp; நகை தொழிலகம்</div>
            <div className="bill-shop-tag">Wholesale &amp; Retail Shop</div>
            <div className="bill-contacts">
              <span><Phone size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> 95979 76729</span>
              <span>•</span>
              <span>73391 60876</span>
              <span>•</span>
              <span>81480 03454</span>
            </div>
          </div>

          {/* Meta Info Bar */}
          <div className="bill-meta-bar">
            <div className="bill-badge-item">
              <span style={{ color: '#6A9A80', fontSize: '11px', textTransform: 'uppercase' }}>வாடிக்கையாளர் (Customer):</span><br />
              <strong style={{ fontSize: '16px', color: '#0F3D34' }}>{bill.customerName || 'Walk-in Customer'}</strong>
              {bill.mobile && <span style={{ marginLeft: '10px', color: '#3D5C52', fontSize: '12px' }}>({bill.mobile})</span>}
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ color: '#6A9A80', fontSize: '11px' }}>பில் எண் (Invoice No):</span>{' '}
              <strong style={{ color: '#0F3D34' }}>IDH-{bill.id || Date.now().toString().slice(-6)}</strong><br />
              <span style={{ color: '#6A9A80', fontSize: '11px' }}>தேதி (Date):</span>{' '}
              <strong style={{ color: '#0F3D34' }}>{bill.date ? new Date(bill.date).toLocaleString('en-IN') : new Date().toLocaleString('en-IN')}</strong>
            </div>
          </div>

          {/* Highlights from Visiting Card */}
          <div className="bill-highlights">
            <span>✨ 926 நகைகள் ஆர்டரின் பேரில் சிறந்த முறையில் செய்து தரப்படும்</span>
            <span>•</span>
            <span>✨ வெள்ளி கொலுசுகளுக்கு செய்கூலி, சேதாரம் இல்லை</span>
          </div>

          {/* Items Table */}
          <div className="bill-table-container">
            <table className="bill-table">
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>பொருள் (Item Description)</th>
                  <th style={{ textAlign: 'center' }}>எண்ணிக்கை (Qty)</th>
                  <th style={{ textAlign: 'right' }}>எடை (Weight)</th>
                  <th style={{ textAlign: 'right' }}>மதிப்பு (Gross)</th>
                  <th style={{ textAlign: 'right' }}>தள்ளுபடி (Disc)</th>
                  <th style={{ textAlign: 'right' }}>மொத்தம் (Net Amt)</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => {
                  const gross = item.grossAmount || item.subtotal || item.total || 0
                  const disc = item.discountAmount || 0
                  const net = item.total || (gross - disc)
                  return (
                    <tr key={idx}>
                      <td>
                        <strong style={{ color: '#0F3D34', fontFamily: "'Noto Sans Tamil', 'Inter', sans-serif" }}>
                          {item.variant || item.subcategory || item.category}
                        </strong>
                        <div style={{ fontSize: '11px', color: '#6A9A80' }}>
                          {item.category} {item.detail ? `· ${item.detail}` : ''}
                        </div>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 600 }}>{item.quantity || 1} pcs</td>
                      <td style={{ textAlign: 'right', fontWeight: 600, color: '#A6834A' }}>{(item.weight || 0).toFixed(3)} g</td>
                      <td style={{ textAlign: 'right', color: '#3D5C52' }}>₹{Number(gross).toLocaleString('en-IN')}</td>
                      <td style={{ textAlign: 'right', color: '#C0392B' }}>
                        {disc > 0 ? `-₹${Number(disc).toLocaleString('en-IN')}` : '—'}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: '#1A7A4A' }}>
                        ₹{Number(net).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Grand Totals Box */}
          <div className="bill-totals-box">
            <div>
              <div style={{ fontSize: '12px', color: '#3D5C52', fontFamily: "'Noto Sans Tamil', sans-serif" }}>
                மொத்த எண்ணிக்கை: <strong>{totalQty} pcs</strong> &nbsp;|&nbsp; மொத்த எடை: <strong>{totalWeight.toFixed(3)} g</strong>
              </div>
              {totalDiscount > 0 && (
                <div style={{ fontSize: '12px', color: '#C0392B', marginTop: '4px', fontWeight: 600 }}>
                  மொத்த தள்ளுபடி (Total Savings): -₹{totalDiscount.toLocaleString('en-IN')}
                </div>
              )}
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: '#6A9A80', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                செலுத்த வேண்டிய நிகர தொகை (NET AMOUNT)
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#0F3D34', fontFamily: 'Inter, sans-serif' }}>
                ₹{netTotal.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Footer Address & Terms */}
          <div className="bill-footer-address">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 700, color: '#0F3D34', marginBottom: '4px' }}>
              <MapPin size={14} color="#C8A96A" /> 8 - வடக்கு ரத வீதி, டவுன் போலீஸ் ஸ்டேஷன் ரோடு, சிவகாசி.
            </div>
            <div style={{ fontSize: '11px', color: '#6A9A80', marginTop: '4px' }}>
              நன்றி! மீண்டும் வருக! (Thank you for shopping with Idhayam Jewellery)
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default BillModal
