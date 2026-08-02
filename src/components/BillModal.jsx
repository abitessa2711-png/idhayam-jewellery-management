import React from 'react'
import { Printer, X, Phone, MapPin } from 'lucide-react'

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

  // Convert numbers to words (Rupees in English)
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
    while (num > 0) {
      let rem = num % 1000
      if (rem > 0) {
        words = check(rem) + g[i] + ' ' + words
      }
      num = Math.floor(num / 1000)
      i++
    }
    return 'RUPEES ' + words.trim() + ' ONLY'
  }

  return (
    <div className="modal-overlay">
      <style>{`
        .grt-invoice-container {
          background: #FFFFFF;
          color: #0F1A17;
          width: 780px;
          max-width: 95vw;
          max-height: 92vh;
          overflow-y: auto;
          border-radius: 12px;
          box-shadow: 0 25px 65px rgba(0,0,0,0.35);
          border: 1px solid #C8A96A;
          font-family: 'Noto Sans Tamil', 'Inter', sans-serif;
          position: relative;
        }

        .invoice-sheet {
          padding: 30px;
          position: relative;
        }

        .invoice-header-grid {
          display: grid;
          grid-template-columns: 1.8fr 1fr;
          gap: 20px;
          border-bottom: 2px solid #0F3D34;
          padding-bottom: 12px;
          margin-bottom: 16px;
        }

        .shop-info-side {
          font-size: 11.5px;
          line-height: 1.5;
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
          font-size: 15px;
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

        .grt-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 18px;
          font-size: 12.5px;
        }

        .grt-table th {
          background: #EBF4ED !important;
          color: #0F3D34 !important;
          border-top: 1.5px solid #0F3D34;
          border-bottom: 1.5px solid #0F3D34;
          padding: 8px 10px;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 11px;
        }

        .grt-table td {
          padding: 10px;
          border-bottom: 1px solid rgba(15, 61, 52, 0.08);
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
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 28px;
          font-weight: 700;
          color: #C8A96A;
          margin: 16px 0;
          opacity: 0.95;
        }

        @media print {
          body * {
            visibility: hidden;
          }
          .modal-overlay, .grt-invoice-container, .grt-invoice-container * {
            visibility: visible;
          }
          .modal-overlay {
            position: absolute;
            left: 0; top: 0;
            width: 100%; height: 100%;
            background: #FFFFFF !important;
            padding: 0 !important;
          }
          .grt-invoice-container {
            box-shadow: none !important;
            border: none !important;
            width: 100% !important;
            max-width: 100% !important;
            max-height: none !important;
            overflow: visible !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="grt-invoice-container animate-fade-in" onClick={e => e.stopPropagation()}>
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print" style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 24px', background: '#0F3D34', borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <span style={{ color: '#F0DFA8', fontWeight: 600, fontSize: '13.5px' }}>
            🧾 பில் அச்சு வடிவம் (Invoice Print Preview)
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

        {/* Printable Invoice Sheet */}
        <div className="invoice-sheet">
          
          {/* Header Section */}
          <div className="invoice-header-grid">
            <div className="shop-info-side">
              <div style={{ fontSize: '11px', color: '#6A9A80', fontWeight: 600 }}>TIN No: 33496087612 | GSTIN: 33AAIF17856A1Z4</div>
              <div className="shop-brand-name">இதயம்</div>
              <div className="shop-brand-sub">ஜூவல்லரி &amp; நகை தொழிலகம்</div>
              <div style={{ fontWeight: 600 }}>Wholesale &amp; Retail Shop</div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '3px' }}>
                <MapPin size={11} color="var(--gold)" />
                8 - வடக்கு ரத வீதி, டவுன் போலீஸ் ஸ்டேஷன் ரோடு, சிவகாசி.
              </div>
            </div>
            <div className="logo-side">
              <div style={{ fontWeight: 600, fontSize: '12px', color: '#0F3D34' }}>
                <Phone size={11} style={{ display: 'inline', marginRight: '4px' }} />
                95979 76729 | 81480 03454
              </div>
              <div className="invoice-title-badge">CASH BILL / TAX INVOICE</div>
            </div>
          </div>

          {/* Customer & Invoice Meta Details */}
          <div className="customer-invoice-meta">
            <div>
              <span style={{ color: '#6A9A80', fontSize: '11px' }}>வாடிக்கையாளர் விவரம் / Customer Info:</span>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F3D34', marginTop: '2px' }}>
                {bill.customerName || 'Walk-in Customer'}
              </div>
              {bill.mobile && <div style={{ color: '#3D5C52', marginTop: '2px' }}>Ph: {bill.mobile}</div>}
            </div>
            <div className="meta-col-right">
              <div><b>பில் எண் / Bill No:</b> IDH-{bill.id ? bill.id.toString().slice(-6) : Date.now().toString().slice(-6)}</div>
              <div><b>தேதி / Date:</b> {bill.date ? new Date(bill.date).toLocaleString('en-IN') : new Date().toLocaleString('en-IN')}</div>
            </div>
          </div>

          {/* Items Table */}
          <table className="grt-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'left', width: '38%' }}>விவரம் (Description)</th>
                <th style={{ textAlign: 'center', width: '10%' }}>எண்ணிக்கை (Qty)</th>
                <th style={{ textAlign: 'right', width: '13%' }}>எடை (Gross Wt)</th>
                <th style={{ textAlign: 'right', width: '13%' }}>மதிப்பு (Gross Rs)</th>
                <th style={{ textAlign: 'right', width: '12%' }}>தள்ளுபடி (Disc)</th>
                <th style={{ textAlign: 'right', width: '14%' }}>நிகர மதிப்பு (Net Value)</th>
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
                      <strong style={{ color: '#0F3D34' }}>
                        {item.variant || item.subcategory || item.category}
                      </strong>
                      <div style={{ fontSize: '10.5px', color: '#6A9A80' }}>
                        {item.category} {item.detail ? `· ${item.detail}` : ''}
                      </div>
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{item.quantity || 1} pcs</td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: '#A6834A' }}>{(item.weight || 0).toFixed(3)} g</td>
                    <td style={{ textAlign: 'right' }}>₹{Number(gross).toLocaleString('en-IN')}</td>
                    <td style={{ textAlign: 'right', color: '#C0392B' }}>
                      {disc > 0 ? `₹${Number(disc).toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: '#1A7A4A' }}>
                      ₹{Number(net).toLocaleString('en-IN')}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {/* Summary & Signatures Section */}
          <div className="grt-summary-grid">
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '11px', color: '#6A9A80', lineHeight: '1.6' }}>
                <b>குறிப்பு / Terms:</b><br />
                • 926 நகைகள் ஆர்டரின் பேரில் சிறந்த முறையில் செய்து தரப்படும்.<br />
                • வெள்ளி கொலுசுகளுக்கு செய்கூலி, சேதாரம் இல்லை.<br />
                • சேதங்கள் ஏதும் இருப்பின் 2 நாட்களுக்குள் தெரிவிக்கவும்.
              </div>
              <div style={{ marginTop: '12px' }}>
                <span style={{ fontSize: '10px', color: '#6A9A80', display: 'block', fontWeight: 600 }}>ரூபாய் வார்த்தைகளில் / Amount in words:</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#0F3D34' }}>{numberToEnglishWords(netTotal)}</span>
              </div>
            </div>
            
            <div className="totals-block">
              <div className="totals-row">
                <span style={{ color: '#6A9A80' }}>மொத்த மதிப்பு (Sub Total):</span>
                <span>₹{totalGross.toLocaleString('en-IN')}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="totals-row" style={{ color: '#C0392B' }}>
                  <span>மொத்த தள்ளுபடி (Less Discount):</span>
                  <span>-₹{totalDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="totals-row">
                <span style={{ color: '#6A9A80' }}>மொத்த எடை (Total Weight):</span>
                <span style={{ fontWeight: 600 }}>{totalWeight.toFixed(3)} g</span>
              </div>
              <div className="totals-row">
                <span style={{ color: '#6A9A80' }}>மொத்த எண்ணிக்கை (Total Qty):</span>
                <span style={{ fontWeight: 600 }}>{totalQty} pcs</span>
              </div>
              <div className="totals-row grand-total">
                <span>பில் தொகை (Bill Amount):</span>
                <span>₹{netTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Thank You Brand Signature */}
          <div className="thank-you-brand">
            Thank You
          </div>

          {/* Bottom Signature Section */}
          <div className="signature-section">
            <div className="signature-line">Customer Signature</div>
            <div className="signature-line">Cashier</div>
            <div className="signature-line">Salesman</div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default BillModal
