/**
 * File Name: Navbar.jsx
 * File Path: client/src/components/common/Navbar.jsx
 * 
 * Component Description:
 * Reusable top navigation bar for both standalone pages and dashboard layouts. 
 * Displays logo, current role, digital clock, dark theme switcher, notifications, 
 * user avatar dropdown, and mobile sidebar toggle trigger.
 * 
 * Data & Props Used:
 * - Redux State: auth.user (name, role, email, avatar)
 * - toggleSidebar (function): Optional function to open/close mobile sidebar drawer
 * - isSidebarOpen (boolean): Current mobile sidebar open state
 * 
 * Responsiveness:
 * - Desktop: Full brand header with clock, theme switcher, user menu, and role pill
 * - Mobile: Hamburger menu button + brand icon + compact user menu dropdown
 * 
 * Component Usage:
 * - App Header, Common Pages, DashboardLayout fallback
 */

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Menu, X, Sun, Moon, LogOut, User, Bell, Shield, Clock, ChevronDown 
} from 'lucide-react';
import { logout } from '../../features/auth/authSlice';

export default function Navbar({ toggleSidebar, isSidebarOpen = false }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || document.body.classList.contains('dark-theme');
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="top-navbar" style={{
      backgroundColor: 'var(--bg-card, #ffffff)',
      borderBottom: '1px solid var(--border-color, #e2e8f0)',
      height: '70px',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      padding: '0 1.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
    }}>
      {/* Left: Mobile Toggle & Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {toggleSidebar && (
          <button
            onClick={toggleSidebar}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              border: '1px solid var(--border-color, #e2e8f0)',
              backgroundColor: 'transparent',
              color: 'var(--text-main, #0f172a)',
              cursor: 'pointer'
            }}
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        )}

        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: '800',
            fontSize: '1.2rem',
            boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)'
          }}>
            E
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main, #0f172a)', lineHeight: '1.2' }}>
              WorkPulse
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted, #64748b)', fontWeight: '500' }}>
              EMS Portal
            </span>
          </div>
        </Link>
      </div>

      {/* Center: Live Digital Clock (Hidden on tiny mobile screens) */}
      <div style={{
        display: 'none',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.85rem',
        fontWeight: '600',
        color: 'var(--text-muted, #475569)',
        backgroundColor: 'var(--bg-app, #f8fafc)',
        padding: '0.4rem 0.85rem',
        borderRadius: '9999px',
        border: '1px solid var(--border-color, #e2e8f0)'
      }} className="md:flex">
        <Clock size={15} style={{ color: '#3b82f6' }} />
        <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        <span style={{ opacity: 0.5 }}>|</span>
        <span>{time.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
      </div>

      {/* Right: Actions & User Avatar Dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Dark Mode Switcher */}
        <button
          onClick={toggleTheme}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          style={{
            padding: '0.5rem',
            borderRadius: '50%',
            border: '1px solid var(--border-color, #e2e8f0)',
            backgroundColor: 'var(--bg-app, #f8fafc)',
            color: isDarkMode ? '#f59e0b' : '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Role Pill */}
        {user?.role && (
          <span style={{
            fontSize: '0.75rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            padding: '0.25rem 0.6rem',
            borderRadius: '9999px',
            backgroundColor: user.role === 'admin' ? 'rgba(239, 68, 68, 0.12)' : user.role === 'manager' ? 'rgba(139, 92, 246, 0.12)' : 'rgba(59, 130, 246, 0.12)',
            color: user.role === 'admin' ? '#ef4444' : user.role === 'manager' ? '#8b5cf6' : '#3b82f6',
            letterSpacing: '0.05em'
          }}>
            {user.role}
          </span>
        )}

        {/* Profile Avatar Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.25rem'
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              overflow: 'hidden',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '0.9rem',
              border: '2px solid #ffffff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              flexShrink: 0
            }}>
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name || 'User'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                />
              ) : (
                user?.name ? user.name.charAt(0).toUpperCase() : 'U'
              )}
            </div>
            <ChevronDown size={14} style={{ color: 'var(--text-muted, #64748b)' }} />
          </button>

          {isDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '110%',
                width: '220px',
                backgroundColor: 'var(--bg-card, #ffffff)',
                border: '1px solid var(--border-color, #e2e8f0)',
                borderRadius: '0.75rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                padding: '0.5rem 0',
                zIndex: 50
              }}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color, #e2e8f0)' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-main, #0f172a)' }}>
                  {user?.name || 'User'}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.email || 'user@example.com'}
                </p>
              </div>

              <Link
                to="/dashboard/profile"
                onClick={() => setIsDropdownOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.6rem 1rem',
                  fontSize: '0.85rem',
                  color: 'var(--text-main, #0f172a)',
                  textDecoration: 'none'
                }}
                className="hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <User size={16} /> Profile & Settings
              </Link>

              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.6rem 1rem',
                  fontSize: '0.85rem',
                  color: '#ef4444',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                className="hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}