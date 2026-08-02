import React from 'react'
import { PlusCircle, ShoppingBag, Home, Package, RotateCcw, Wrench, Receipt } from 'lucide-react'
import logoImg from './logo.jpg'

const MENU = [
  { id: 'dashboard',   label: 'முகப்பு',               sub: 'Dashboard',        icon: <Home size={17} />,          roles: ['admin', 'employee'] },
  { id: 'stock',       label: 'இருப்பு',                sub: 'Stock List',       icon: <Package size={17} />,       roles: ['admin', 'employee'] },
  { id: 'add',         label: 'சேர்க்கை',               sub: 'Add Stock',        icon: <PlusCircle size={17} />,    roles: ['admin', 'employee'] },
  { id: 'sell',        label: 'விற்பனை / பில்',         sub: 'Sell & Bill',      icon: <ShoppingBag size={17} />,   roles: ['admin', 'employee'] },
  { id: 'sold',        label: 'விற்பனை வரலாறு',         sub: 'Sold Items',       icon: <Receipt size={17} />,       roles: ['admin', 'employee'] },
  { id: 'old_buyback', label: 'பழைய நகை கொள்முதல்',    sub: 'Old Item Buyback', icon: <RotateCcw size={17} />,    roles: ['admin'] },
  { id: 'reports',     label: 'சேவை பதிவேடு',           sub: 'Service Log',      icon: <Wrench size={17} />,        roles: ['admin'] },
]

const Sidebar = ({ activeTab, setActiveTab, role = 'admin', isOpen, onClose }) => {
  const visible = MENU.filter(item => item.roles.includes(role.toLowerCase()))

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>

        {/* ── Brand ─────────────────────────────────────────── */}
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon" style={{ padding: 0, overflow: 'hidden', border: '1.5px solid #C8A96A', borderRadius: '50%' }}>
            <img src={logoImg} alt="இதயம் Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div className="sidebar-brand-name">இதயம் ஜூவல்லரி</div>
            <div className="sidebar-brand-sub">Wholesale &amp; Retail</div>
          </div>
        </div>

        {/* ── Nav ───────────────────────────────────────────── */}
        <nav className="sidebar-nav">
          {visible.map(item => {
            const active = activeTab === item.id
            return (
              <div
                key={item.id}
                className={`nav-item ${active ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(item.id)
                  if (onClose) onClose()
                }}
              >
                <span style={{ flexShrink: 0, display: 'flex', opacity: active ? 1 : 0.65 }}>
                  {item.icon}
                </span>
                <div>
                  <div style={{ fontWeight: active ? 600 : 500, fontSize: '13.5px' }}>{item.label}</div>
                  <div style={{ fontSize: '10.5px', opacity: 0.55, fontFamily: 'Inter, sans-serif', marginTop: '1px' }}>{item.sub}</div>
                </div>
              </div>
            )
          })}
        </nav>

        {/* ── Footer ────────────────────────────────────────── */}
        <div className="sidebar-footer">
          <div className="online-dot" />
          <div>
            <div style={{ fontWeight: 600, color: 'rgba(255,255,255,0.75)', fontSize: '12.5px', fontFamily: 'Noto Sans Tamil, Inter, sans-serif' }}>
              {role === 'admin' ? 'நிர்வாகி (Admin)' : role === 'auditor' ? 'கணக்காய்வாளர்' : 'Employee'}
            </div>
            <div style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.35)', fontFamily: 'Inter, sans-serif', marginTop: '1px' }}>இதயம் ஜூவல்லரி</div>
          </div>
        </div>

      </div>
    </>
  )
}

export default Sidebar
