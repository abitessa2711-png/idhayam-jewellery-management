import React, { useState } from 'react'
import { supabase } from '../supabaseClient'
import logoImg from './logo.jpg'

/* ── Decorative background dots ─────────────────────────── */
const BackgroundOrbs = () => (
  <>
    {/* Top-left warm gold orb */}
    <div style={{
      position: 'absolute', top: '-120px', left: '-120px',
      width: '400px', height: '400px', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(200,169,106,0.16) 0%, transparent 70%)',
      pointerEvents: 'none'
    }} />
    {/* Bottom-right mint orb */}
    <div style={{
      position: 'absolute', bottom: '-100px', right: '-100px',
      width: '380px', height: '380px', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(230,240,233,0.15) 0%, transparent 70%)',
      pointerEvents: 'none'
    }} />
    {/* Centre depth layer */}
    <div style={{
      position: 'absolute', top: '40%', left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '500px', height: '500px', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(15,61,52,0.45) 0%, transparent 65%)',
      pointerEvents: 'none'
    }} />
  </>
)

/* ── Diamond SVG decoration ─────────────────────────────── */
const DiamondDeco = ({ size = 22, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <path d="M12 2L3 9l9 13 9-13L12 2z"
      stroke="#C8A54B" strokeWidth="1.6" strokeLinejoin="round"
      fill="rgba(200,165,75,0.18)" />
    <path d="M3 9h18" stroke="#C8A54B" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
)

const Login = ({ onLogin, onShowSignup }) => {
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  // ── All business logic preserved exactly ─────────────────
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // ── Demo Bypass for Testing & Client Delivery ──────────────────────────
      if (loginId.trim() === 'admin@idhayam.com' && password === 'idhayam@admin') {
        onLogin({
          id: 'admin-bypass-id',
          name: 'Idhayam Admin',
          email: 'admin@idhayam.com',
          role: 'admin',
          token: 'admin-bypass-token'
        })
        return
      }

      if (loginId.trim() === 'audit@idhayam.com' && password === 'audit@idhayam') {
        onLogin({
          id: 'audit-bypass-id',
          name: 'Idhayam Auditor',
          email: 'audit@idhayam.com',
          role: 'auditor',
          token: 'audit-bypass-token'
        })
        return
      }

      const { data, error: err } = await supabase.auth.signInWithPassword({
        email: loginId.trim(),
        password: password
      })
      if (err) throw err

      const user = data.user
      onLogin({
        id: user.id,
        name: user.user_metadata?.name || user.email,
        email: user.email,
        role: user.user_metadata?.role || 'admin',
        token: data.session?.access_token
      })
    } catch (err) {
      console.error(err)
      setError(err.message || 'உள்நுழைவதில் பிழை அல்லது தவறான கடவுச்சொல்')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `
        radial-gradient(circle at 15% 15%, rgba(200,169,106,0.14) 0%, transparent 50%),
        radial-gradient(circle at 85% 85%, rgba(230,240,233,0.18) 0%, transparent 50%),
        radial-gradient(circle at 50% 50%, rgba(15,61,52,0.65) 0%, transparent 70%),
        #0A2920
      `,
      fontFamily: "'Noto Sans Tamil', 'Inter', -apple-system, sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>{`
        /* ── Auth Card ─────────────────────────────────── */
        .auth-card {
          background: rgba(255, 252, 245, 0.06);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(200, 165, 75, 0.22);
          width: 400px;
          max-width: 92vw;
          padding: 44px 40px;
          border-radius: 24px;
          box-shadow:
            0 40px 80px -20px rgba(0, 0, 0, 0.60),
            0 8px 32px rgba(0, 0, 0, 0.30),
            inset 0 1px 0 rgba(255, 255, 255, 0.08),
            0 0 0 1px rgba(200,165,75,0.06);
          text-align: center;
          position: relative;
          z-index: 10;
          animation: cardSlideIn 0.5s cubic-bezier(0.34, 1.10, 0.64, 1) both;
        }

        @keyframes cardSlideIn {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Gold top shimmer line */
        .auth-card::before {
          content: '';
          position: absolute;
          top: 0; left: 10%; right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(200,165,75,0.60), transparent);
          border-radius: 1px;
        }

        /* ── Logo circle ───────────────────────────────── */
        .logo-circle {
          width: 115px;
          height: 115px;
          margin: 0 auto 20px auto;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          overflow: hidden;
          border: 2.5px solid #C8A96A;
          box-shadow:
            0 0 0 6px rgba(200, 169, 106, 0.15),
            0 8px 30px rgba(0, 0, 0, 0.50),
            0 0 20px rgba(200, 169, 106, 0.35);
          background: #0F3D34;
        }

        /* ── Inputs ────────────────────────────────────── */
        .auth-input {
          width: 100%;
          padding: 14px 18px;
          margin-top: 14px;
          border-radius: 12px;
          border: 1.5px solid rgba(200, 165, 75, 0.18);
          background: rgba(255, 252, 245, 0.06);
          color: #F8F5EE;
          font-size: 14px;
          font-family: 'Noto Sans Tamil', 'Inter', sans-serif;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
          box-sizing: border-box;
          letter-spacing: 0.1px;
        }

        .auth-input::placeholder {
          color: rgba(200, 165, 75, 0.45);
          font-family: 'Noto Sans Tamil', 'Inter', sans-serif;
        }

        .auth-input:focus {
          border-color: #C8A54B;
          box-shadow: 0 0 0 3px rgba(200, 165, 75, 0.14), 0 0 12px rgba(200, 165, 75, 0.10);
          background: rgba(255, 252, 245, 0.10);
        }

        /* ── Submit button ─────────────────────────────── */
        .auth-btn {
          margin-top: 26px;
          width: 100%;
          padding: 15px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #0F3D34 0%, #134E43 50%, #0F3D34 100%);
          color: #F0D98A;
          font-weight: 700;
          font-size: 15px;
          font-family: 'Noto Sans Tamil', 'Inter', sans-serif;
          letter-spacing: 0.3px;
          cursor: pointer;
          transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 20px rgba(1, 58, 45, 0.45);
          position: relative;
          overflow: hidden;
        }

        .auth-btn::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
          transition: left 0.5s ease;
        }

        .auth-btn:hover::after { left: 140%; }

        .auth-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(1, 58, 45, 0.55), 0 0 0 1px rgba(200,165,75,0.20);
          background: linear-gradient(135deg, #134E43 0%, #1a6355 50%, #134E43 100%);
        }

        .auth-btn:active { transform: translateY(0) scale(0.98); }
        .auth-btn:disabled { opacity: 0.50; cursor: not-allowed; transform: none; }

        /* ── Signup link ───────────────────────────────── */
        .signup-link {
          margin-top: 22px;
          display: inline-block;
          color: rgba(200, 165, 75, 0.75);
          text-decoration: none;
          font-size: 13px;
          font-family: 'Noto Sans Tamil', 'Inter', sans-serif;
          cursor: pointer;
          transition: color 0.2s;
          border-bottom: 1px solid transparent;
          padding-bottom: 1px;
        }

        .signup-link:hover {
          color: #C8A54B;
          border-bottom-color: rgba(200,165,75,0.40);
        }

        /* ── Divider ───────────────────────────────────── */
        .auth-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 22px 0 0;
        }
        .auth-divider hr {
          flex: 1;
          border: none;
          border-top: 1px solid rgba(200,165,75,0.14);
        }
        .auth-divider span {
          font-size: 11px;
          color: rgba(200,165,75,0.40);
          white-space: nowrap;
          font-family: 'Inter', sans-serif;
          letter-spacing: 0.8px;
        }
      `}</style>

      {/* Decorative background elements */}
      <BackgroundOrbs />

      {/* Floating decorative diamonds */}
      <DiamondDeco size={14} style={{ position: 'absolute', top: '18%', left: '12%', opacity: 0.25 }} />
      <DiamondDeco size={10} style={{ position: 'absolute', top: '72%', right: '14%', opacity: 0.18 }} />
      <DiamondDeco size={18} style={{ position: 'absolute', bottom: '20%', left: '8%', opacity: 0.15 }} />
      <DiamondDeco size={12} style={{ position: 'absolute', top: '12%', right: '18%', opacity: 0.22 }} />

      {/* ── Login Card ───────────────────────────────────── */}
      <div className="auth-card">

        {/* Logo */}
        <div className="logo-circle">
          <img src={logoImg} alt="இதயம் ஜூவல்லரி Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        {/* Brand name */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
          <DiamondDeco size={16} />
          <h1 style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '0.3px',
            margin: 0,
            fontFamily: "'Noto Sans Tamil', sans-serif"
          }}>
            இதயம் ஜூவல்லரி
          </h1>
          <DiamondDeco size={16} />
        </div>

        <p style={{
          color: 'rgba(200,165,75,0.70)',
          fontSize: '12px',
          marginBottom: '28px',
          fontFamily: "'Inter', sans-serif",
          letterSpacing: '1px',
          textTransform: 'uppercase'
        }}>
          Wholesale &amp; Retail Jewellery
        </p>

        {/* Form */}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            className="auth-input"
            placeholder="மின்னஞ்சல் அல்லது செல்பேசி எண்"
            value={loginId}
            onChange={e => setLoginId(e.target.value)}
            required
            autoComplete="username"
          />
          <input
            type="password"
            className="auth-input"
            placeholder="கடவுச்சொல்"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          {error && (
            <p style={{
              color: '#F87171',
              fontSize: '13px',
              marginTop: '12px',
              background: 'rgba(239,68,68,0.10)',
              padding: '9px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(239,68,68,0.20)',
              textAlign: 'left',
              fontFamily: "'Noto Sans Tamil', 'Inter', sans-serif"
            }}>
              {error}
            </p>
          )}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'சரிபார்க்கிறது...' : 'உள்நுழைக'}
          </button>
        </form>

        <div className="auth-divider">
          <hr />
          <span>OR</span>
          <hr />
        </div>

        <span className="signup-link" onClick={onShowSignup}>
          புதிய கணக்கை உருவாக்க வேண்டுமா?
        </span>

      </div>
    </div>
  )
}

export default Login
