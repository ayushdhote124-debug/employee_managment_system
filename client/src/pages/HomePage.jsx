import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff } from 'lucide-react';
import { useLoginMutation } from '../features/auth/authApi.js';
import { setCredentials } from '../features/auth/authSlice.js';

export default function HomePage() {
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const res = await login({ email: loginEmail, password: loginPassword }).unwrap();
      dispatch(setCredentials({ user: { _id: res._id, name: res.name, email: res.email, role: res.role, department: res.department }, token: res.token }));
      navigate('/dashboard');
    } catch (err) {
      setErrorMessage(err?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="home-container">
      {/* Left side: Branding Panel */}
      <div className="home-brand-panel">
        <div className="brand-content-minimal">
          <h1>Employee Attendance<br />Management System</h1>
          <p className="brand-desc-minimal">
            Smart attendance management solution
          </p>
        </div>
      </div>

      {/* Right side: Interactive Auth Forms */}
      <div className="home-auth-panel">
        <div className="auth-card-clean">
          <div className="form-fade">
            <h2 className="auth-title">Login</h2>
            
            {errorMessage && <div className="error-banner">{errorMessage}</div>}
            
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group-clean">
                <input
                  type="email"
                  placeholder="Email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group-clean" style={{ position: 'relative' }}>
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  style={{ paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0
                  }}
                >
                  {showLoginPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              <button type="submit" className="btn-login" disabled={isLoginLoading}>
                {isLoginLoading ? 'Logging In...' : 'Login'}
              </button>
            </form>
            
            <div className="toggle-prompt-clean" style={{ marginTop: '1.5rem', color: '#64748b', fontSize: '0.85rem' }}>
              Registration is managed by the system administrator.<br />
              Please contact HR for your credentials.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
