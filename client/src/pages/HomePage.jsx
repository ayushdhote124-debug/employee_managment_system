import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff } from 'lucide-react';
import { useLoginMutation, useRegisterMutation } from '../features/auth/authApi.js';
import { setCredentials } from '../features/auth/authSlice.js';

export default function HomePage() {
  const [isLogin, setIsLogin] = useState(true);
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // Register Form States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regRole, setRegRole] = useState('employee');
  const [regDept, setRegDept] = useState('General');

  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Clear errors when toggling forms
  useEffect(() => {
    setErrorMessage('');
  }, [isLogin]);

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

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const res = await register({
        name: regName,
        email: regEmail,
        password: regPassword,
        role: regRole,
        department: regDept,
      }).unwrap();
      
      // Auto login after registration
      dispatch(setCredentials({ user: { _id: res._id, name: res.name, email: res.email, role: res.role, department: res.department }, token: res.token }));
      navigate('/dashboard');
    } catch (err) {
      setErrorMessage(err?.data?.message || 'Registration failed. Try a different email.');
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
          {isLogin ? (
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
              
              <div className="toggle-prompt-clean">
                Don't have an account?{' '}
                <button onClick={() => setIsLogin(false)} className="link-btn-bold">
                  Register
                </button>
              </div>
            </div>
          ) : (
            <div className="form-fade">
              <h2 className="auth-title">Register</h2>
              
              {errorMessage && <div className="error-banner">{errorMessage}</div>}
              
              <form onSubmit={handleRegisterSubmit}>
                <div className="form-group-clean">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group-clean">
                  <input
                    type="email"
                    placeholder="Email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group-clean" style={{ position: 'relative' }}>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    minLength={6}
                    style={{ paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    style={{
                      position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0
                    }}
                  >
                    {showRegPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="form-row-clean">
                  <div className="form-group-clean">
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value)}
                    >
                      <option value="employee">Employee</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div className="form-group-clean">
                    <input
                      type="text"
                      placeholder="Department"
                      value={regDept}
                      onChange={(e) => setRegDept(e.target.value)}
                    />
                  </div>
                </div>

                <button type="submit" className="btn-login" disabled={isRegisterLoading}>
                  {isRegisterLoading ? 'Registering...' : 'Register'}
                </button>
              </form>
              
              <div className="toggle-prompt-clean">
                Already have an account?{' '}
                <button onClick={() => setIsLogin(true)} className="link-btn-bold">
                  Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
