import React, { useState } from 'react'
import { Menu, LogOut, RefreshCw } from 'lucide-react'
import logoImg from './logo.jpg'

const Header = ({ username, onLogout, onMenuClick, onRefresh }) => {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefreshClick = async () => {
    if (onRefresh) {
      setRefreshing(true)
      await onRefresh()
      setTimeout(() => setRefreshing(false), 600)
    }
  }

  return (
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
        {onRefresh && (
          <button
            className="btn btn-secondary"
            onClick={handleRefreshClick}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', fontSize: '12px', background: 'rgba(212,175,55,0.1)', color: 'var(--gold)', border: '1px solid rgba(212,175,55,0.3)' }}
            title="சமீபத்திய தரவைப் புதுப்பி (Refresh Data)"
          >
            <RefreshCw size={14} className={refreshing ? 'spin' : ''} />
            <span className="hide-mobile">புதுப்பி</span>
          </button>
        )}

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
          <span className="hide-mobile">வெளியேறு</span>
        </button>
      </div>
    </header>
  )
}

export default Header
