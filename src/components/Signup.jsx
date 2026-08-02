import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import logoImg from './logo.jpg';

/* ── Decorative background orbs (shared style) ─────────── */
const BackgroundOrbs = () => (
  <>
    <div style={{
      position: 'absolute', top: '-120px', left: '-120px',
      width: '400px', height: '400px', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(200,165,75,0.18) 0%, transparent 70%)',
      pointerEvents: 'none'
    }} />
    <div style={{
      position: 'absolute', bottom: '-100px', right: '-100px',
      width: '380px', height: '380px', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(133,150,107,0.20) 0%, transparent 70%)',
      pointerEvents: 'none'
    }} />
    <div style={{
      position: 'absolute', top: '40%', left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '500px', height: '500px', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(1,58,45,0.40) 0%, transparent 65%)',
      pointerEvents: 'none'
    }} />
  </>
)

const DiamondDeco = ({ size = 22, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <path d="M12 2L3 9l9 13 9-13L12 2z"
      stroke="#C8A54B" strokeWidth="1.6" strokeLinejoin="round"
      fill="rgba(200,165,75,0.18)" />
    <path d="M3 9h18" stroke="#C8A54B" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
)

const Signup = ({ onBack, onSignupSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ── All business logic preserved exactly ─────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: err } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            name: formData.name.trim(),
            phone_number: formData.phoneNumber.trim(),
            role: 'admin'
          }
        }
      });
      if (err) throw err;
      alert('பதிவு வெற்றிகரமாக முடிந்தது! இப்போது உள்நுழையவும்.');
      onSignupSuccess();
    } catch (err) {
      console.error(err);
      setError(err.message || 'கணக்கை உருவாக்குவதில் பிழை');
    } finally {
      setLoading(false);
    }
  };

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
        .auth-card {
          background: rgba(255, 252, 245, 0.06);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(200, 165, 75, 0.22);
          width: 420px;
          max-width: 92vw;
          padding: 40px 38px;
          border-radius: 24px;
          box-shadow:
            0 40px 80px -20px rgba(0, 0, 0, 0.60),
            0 8px 32px rgba(0, 0, 0, 0.30),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
          text-align: center;
          position: relative;
          z-index: 10;
          animation: cardSlideIn 0.5s cubic-bezier(0.34, 1.10, 0.64, 1) both;
        }

        @keyframes cardSlideIn {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .auth-card::before {
          content: '';
          position: absolute;
          top: 0; left: 10%; right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(200,165,75,0.60), transparent);
        }

        .logo-circle {
          width: 110px;
          height: 110px;
          margin: 0 auto 18px auto;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          overflow: hidden;
          border: 2.5px solid #C8A96A;
          box-shadow: 0 0 0 6px rgba(200,169,106,0.15), 0 8px 24px rgba(0,0,0,0.45);
          background: #0F3D34;
        }

        .auth-input {
          width: 100%;
          padding: 13px 18px;
          margin-top: 12px;
          border-radius: 12px;
          border: 1.5px solid rgba(200, 165, 75, 0.18);
          background: rgba(255, 252, 245, 0.06);
          color: #F8F5EE;
          font-size: 14px;
          font-family: 'Noto Sans Tamil', 'Inter', sans-serif;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
          box-sizing: border-box;
        }

        .auth-input::placeholder {
          color: rgba(200, 165, 75, 0.45);
          font-family: 'Noto Sans Tamil', 'Inter', sans-serif;
        }

        .auth-input:focus {
          border-color: #C8A54B;
          box-shadow: 0 0 0 3px rgba(200, 165, 75, 0.14);
          background: rgba(255, 252, 245, 0.10);
        }

        .auth-btn {
          margin-top: 22px;
          width: 100%;
          padding: 14px;
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
          overflow: hidden;
          position: relative;
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
          box-shadow: 0 8px 32px rgba(1, 58, 45, 0.55);
          background: linear-gradient(135deg, #134E43 0%, #1a6355 50%, #134E43 100%);
        }

        .auth-btn:active { transform: translateY(0) scale(0.98); }
        .auth-btn:disabled { opacity: 0.50; cursor: not-allowed; transform: none; }

        .back-link {
          margin-top: 20px;
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
        .back-link:hover {
          color: #C8A54B;
          border-bottom-color: rgba(200,165,75,0.40);
        }
      `}</style>

      <BackgroundOrbs />

      {/* Floating decorative diamonds */}
      <DiamondDeco size={14} style={{ position: 'absolute', top: '18%', left: '12%', opacity: 0.25 }} />
      <DiamondDeco size={10} style={{ position: 'absolute', top: '72%', right: '14%', opacity: 0.18 }} />
      <DiamondDeco size={18} style={{ position: 'absolute', bottom: '20%', left: '8%', opacity: 0.15 }} />
      <DiamondDeco size={12} style={{ position: 'absolute', top: '12%', right: '18%', opacity: 0.22 }} />

      <div className="auth-card">

        {/* Logo */}
        <div className="logo-circle">
          <img src={logoImg} alt="இதயம் ஜூவல்லரி Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        {/* Brand name */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '5px' }}>
          <DiamondDeco size={15} />
          <h2 style={{
            fontSize: '22px',
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '0.3px',
            margin: 0,
            fontFamily: "'Noto Sans Tamil', sans-serif"
          }}>
            இதயம் ஜூவல்லரி
          </h2>
          <DiamondDeco size={15} />
        </div>

        <p style={{
          color: 'rgba(200,165,75,0.65)',
          fontSize: '12px',
          marginBottom: '24px',
          fontFamily: "'Noto Sans Tamil', 'Inter', sans-serif"
        }}>
          புதிய கணக்கை உருவாக்கவும்
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="auth-input"
            placeholder="பெயர்"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            required
            autoComplete="name"
          />
          <input
            type="text"
            className="auth-input"
            placeholder="மொபைல் எண்"
            value={formData.phoneNumber}
            onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
            required
            autoComplete="tel"
          />
          <input
            type="email"
            className="auth-input"
            placeholder="மின்னஞ்சல்"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            required
            autoComplete="email"
          />
          <input
            type="password"
            className="auth-input"
            placeholder="கடவுச்சொல்"
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
            required
            autoComplete="new-password"
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
            {loading ? 'பதிவு செய்கிறது...' : 'பதிவு செய்க'}
          </button>
        </form>

        <span className="back-link" onClick={onBack}>
          ஏற்கனவே கணக்கு உள்ளதா? உள்நுழையவும்
        </span>

      </div>
    </div>
  );
};

export default Signup;
