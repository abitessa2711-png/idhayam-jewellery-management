import React, { useState } from 'react'
import { Printer, X, Phone, MapPin } from 'lucide-react'
import billLogo from './bill_logo.png'

const BillModal = ({ bill, onClose }) => {
  if (!bill) return null
  const [goldRate, setGoldRate] = useState(bill.goldRate || '')
  const [silverRate, setSilverRate] = useState(bill.silverRate || '')
  const [oldSilverAmount, setOldSilverAmount] = useState(bill.oldSilverAmount || '')
  const items = bill.items || []

  const totalQty = items.reduce((s, i) => s + (i.quantity || 0), 0)
  const totalWeight = items.reduce((s, i) => s + (parseFloat(i.weight) || 0), 0)
  const totalGross = items.reduce((s, i) => s + (parseFloat(i.grossAmount || i.subtotal || i.total) || 0), 0)
  const totalDiscount = items.reduce((s, i) => s + (parseFloat(i.discountAmount) || 0), 0)
  const netTotal = items.reduce((s, i) => s + (parseFloat(i.total) || 0), 0)
  const finalBillAmount = Math.max(0, netTotal - (parseFloat(oldSilverAmount) || 0))

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
          width: 840px;
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
          display: flex;
          flex-direction: column;
          align-items: center;
          border-bottom: 2px solid #0F3D34;
          padding-bottom: 14px;
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

        .grt-invoice-container table,
        .grt-invoice-container table th,
        .grt-invoice-container table td {
          border: none !important;
        }

        .grt-invoice-container .grt-table th {
          background: #EBF4ED !important;
          color: #0F3D34 !important;
          border-top: 1.5px solid #0F3D34 !important;
          border-bottom: 1.5px solid #0F3D34 !important;
          padding: 8px 10px;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 11px;
        }

        .grt-invoice-container .grt-table td {
          padding: 10px;
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
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 28px;
          font-weight: 700;
          color: #C8A96A;
          margin: 16px 0;
          opacity: 0.95;
        }

        @media print {
          @page {
            size: A4 portrait;
            margin: 15mm 15mm 15mm 15mm !important;
          }
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
          }
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
            display: block !important;
          }
          .grt-invoice-container {
            box-shadow: none !important;
            border: none !important;
            width: 100% !important;
            max-width: 100% !important;
            max-height: none !important;
            overflow: visible !important;
          }
          .invoice-sheet {
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="grt-invoice-container animate-fade-in" onClick={e => e.stopPropagation()}>

        {/* Top Control Bar (Hidden when printing) */}
        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print" style={{
          background: '#0F3D34', borderBottom: '1px solid rgba(255,255,255,0.1)',
          padding: '12px 24px'
        }}>
          {/* Row 1: Title & Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', gap: '15px' }}>
            <span style={{ color: '#F0DFA8', fontWeight: 600, fontSize: '14px' }}>
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

          {/* Row 2: Today Rate Inputs */}
          <div style={{
            display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap',
            background: 'rgba(0,0,0,0.15)', padding: '10px 16px', borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{ fontSize: '12px', color: '#C8A96A', fontWeight: 700 }}>இன்றைய விலை மாற்றங்கள் (Today's Rates):</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <label style={{ color: '#aaa', fontSize: '12px' }}>தங்கம் (Gold 1g):</label>
              <input
                type="text"
                placeholder="எ.கா. 7250"
                value={goldRate}
                onChange={e => setGoldRate(e.target.value)}
                style={{ width: '85px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #C8A96A', background: '#0D1A17', color: '#FFFDF6', fontSize: '12px', fontWeight: '600' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <label style={{ color: '#aaa', fontSize: '12px' }}>வெள்ளி (Silver 1g):</label>
              <input
                type="text"
                placeholder="எ.கா. 105"
                value={silverRate}
                onChange={e => setSilverRate(e.target.value)}
                style={{ width: '75px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #C8A96A', background: '#0D1A17', color: '#FFFDF6', fontSize: '12px', fontWeight: '600' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <label style={{ color: '#aaa', fontSize: '12px' }}>பழைய வெள்ளி (Old Silver ₹):</label>
              <input
                type="text"
                placeholder="எ.கா. 1500"
                value={oldSilverAmount}
                onChange={e => setOldSilverAmount(e.target.value)}
                style={{ width: '85px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #C8A96A', background: '#0D1A17', color: '#FFFDF6', fontSize: '12px', fontWeight: '600' }}
              />
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="invoice-sheet">

          {/* Header Section */}
          <div className="invoice-header-grid" style={{ width: '100%' }}>
            <div style={{ fontSize: '30px', fontWeight: 800, color: '#0F3D34', fontFamily: "'Noto Sans Tamil', sans-serif", textAlign: 'center', marginBottom: '10px', letterSpacing: '0.3px', lineHeight: '1.2' }}>
              இதயம் ஜூவல்லரி &amp; நகை தொழிலகம்
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', width: '100%', marginBottom: '10px' }}>
              <div style={{ flexShrink: 0 }}>
                <img src={billLogo} alt="இதயம் ஜூவல்லரி" style={{ height: '85px', objectFit: 'contain' }} />
              </div>
              <div style={{ fontSize: '11px', color: '#3D5C52', lineHeight: '1.5', textAlign: 'left', maxWidth: '520px' }}>
                <span style={{ fontWeight: 600, color: '#6A9A80' }}>GSTIN : 33AUIPL7759H1Z8</span><br />
                <span style={{ fontWeight: 600 }}>📍 940/E, SKS வில்லா, ரத்தினவிலாஸ் பஸ்ஸ்டாப், Ujjivan Bank அருகில், சிவகாசி.</span><br />
                <span style={{ fontWeight: 600 }}>📍 கிளை: 7, கீழரத வீதி, முருகன் கோயில் அருகில், சிவகாசி.</span><br />
                <span style={{ fontWeight: 600 }}>📞 கடை : 95979 76729 | 81480 03454</span>
              </div>
            </div>

            {/* Today Rate Display Box inside printable sheet */}
            {(goldRate || silverRate || oldSilverAmount) && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '24px',
                marginTop: '4px',
                marginBottom: '4px',
                padding: '5px 16px',
                border: '1px solid rgba(15, 61, 52, 0.25)',
                borderRadius: '6px',
                background: '#FFFDF9',
                fontSize: '11.5px',
                fontWeight: '700',
                color: '#0F3D34'
              }}>
                {goldRate && <span>Today Gold Rate (1g): ₹{Number(goldRate).toLocaleString('en-IN')}</span>}
                {silverRate && <span>Today Silver Rate (1g): ₹{Number(silverRate).toLocaleString('en-IN')}</span>}
                {oldSilverAmount && <span>Old Silver Value: ₹{Number(oldSilverAmount).toLocaleString('en-IN')}</span>}
              </div>
            )}

            <div style={{ textAlign: 'center', width: '100%' }}>
              <div className="invoice-title-badge" style={{ marginTop: '4px' }}>CASH BILL / TAX INVOICE</div>
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
                <b>• 916 தங்கம் மற்றும் வெள்ளி நகைகள் ஆர்டரின் பேரில் சிறந்த முறையில் செய்து தரப்படும்.</b><br />
                <b>• வெள்ளி கொலுசுகளுக்கு செய்கூலி, சேதாரம் இல்லை.</b>
              </div>
              <div style={{ marginTop: '12px' }}>
                <span style={{ fontSize: '10px', color: '#6A9A80', display: 'block', fontWeight: 600 }}>ரூபாய் வார்த்தைகளில் / Amount in words:</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#0F3D34' }}>{numberToEnglishWords(finalBillAmount)}</span>
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
              {(parseFloat(oldSilverAmount) || 0) > 0 && (
                <div className="totals-row" style={{ color: '#C0392B', fontWeight: 600 }}>
                  <span>பழைய வெள்ளி கழிப்பு (Less Old Silver):</span>
                  <span>-₹{parseFloat(oldSilverAmount).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="totals-row grand-total">
                <span>மொத்த பில் தொகை (Grand Total):</span>
                <span>₹{finalBillAmount.toLocaleString('en-IN')}</span>
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

          {/* Bordered English Discrepancy Notice */}
          <div style={{
            marginTop: '28px',
            padding: '8px 12px',
            border: '1.5px solid rgba(15, 61, 52, 0.25)',
            borderRadius: '6px',
            textAlign: 'center',
            fontSize: '11px',
            fontWeight: '700',
            color: '#4A6B5D',
            letterSpacing: '0.3px',
            fontFamily: "'Inter', sans-serif"
          }}>
            Terms &amp; Conditions: Gold and Silver goods purchased can be exchanged without any difference within 7 days from the date of purchase.
          </div>

        </div>

      </div>
    </div>
  )
}

export default BillModal
