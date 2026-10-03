/**
 * File Name: Navbar.jsx
 * File Path: client/src/components/layout/Navbar.jsx
 * 
 * Component Description:
 * Modern top fixed header navbar. Contains brand logo, mobile hamburger drawer trigger,
 * dark theme switcher, user role indicator, and user profile avatar.
 */

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ChevronsLeft, Menu, Fingerprint, Moon, Sun } from 'lucide-react';

export default function Navbar({ toggleSidebar, isSidebarOpen }) {
  const { user } = useSelector((state) => state.auth);

  // Initialize dark mode state based on body class or localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

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

  return (
    <header className="top-navbar">
      <div className="navbar-container">
        {/* Left Section: Mobile Menu Trigger & Brand Logo */}
        <div className="navbar-left">
          <button
            className="toggle-btn"
            onClick={toggleSidebar}
            aria-label="Toggle navigation menu"
            title="Toggle Sidebar Menu"
          >
            {isSidebarOpen ? <ChevronsLeft size={22} /> : <Menu size={22} />}
          </button>

          <Link to="/dashboard" style={{ textDecoration: 'none' }}>
            <div className="brand-info">
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                  flexShrink: 0
                }}
              >
                <Fingerprint size={24} strokeWidth={2.5} />
              </div>
              <div className="brand-text">
                <h1>WorkPulse EMS</h1>
                <p>Employee Attendance System</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Right Section: Theme Toggle & User Info */}
        <div className="navbar-right">
          <button
            className="toggle-btn"
            onClick={toggleTheme}
            style={{ width: '38px', height: '38px' }}
            title="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div className="navbar-user-info">
                <div className="navbar-greeting">
                  <strong>{user.name || 'User'}</strong>
                </div>
                <div className="navbar-role">{user.role || 'Employee'}</div>
              </div>

              <div
                className="navbar-avatar"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  border: '2px solid #ffffff',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.12)',
                  flexShrink: 0
                }}
              >
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name || 'Profile'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                  />
                ) : (
                  user.name ? user.name.substring(0, 2).toUpperCase() : 'US'
                )}
              </div>
            </div>
          ) : (
            <Link
              to="/"
              style={{ color: '#3b82f6', fontWeight: 'bold', textDecoration: 'none', fontSize: '0.9rem' }}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
