import React from 'react'
import { Menu, LogOut } from 'lucide-react'
import logoImg from './logo.jpg'

const Header = ({ username, onLogout, onMenuClick }) => (
  <header className="app-header">
    <div className="flex" style={{ gap: '10px', alignItems: 'center' }}>
      <button className="menu-toggle-btn" onClick={onMenuClick} aria-label="Toggle Menu">
        <Menu size={20} />
      </button>

      {/* Inline logo emblem */}
      <img
        src={logoImg}
        alt="இதயம் Logo"
        style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1px solid #C8A96A', objectFit: 'cover', flexShrink: 0 }}
      />

      <span className="header-title">இதயம் ஜூவல்லரி</span>
      <span className="header-subtitle">நகை வணிக முறைமை</span>
    </div>

    <div className="header-actions">
      <div className="user-chip">
        <div className="user-avatar">{(username || 'U').charAt(0).toUpperCase()}</div>
        <span>{username}</span>
      </div>

      <button
        className="btn btn-danger-ghost"
        onClick={onLogout}
        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
      >
        <LogOut size={14} />
        வெளியேறு
      </button>
    </div>
  </header>
)

export default Header
