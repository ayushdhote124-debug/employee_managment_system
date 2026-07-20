import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ChevronsLeft, Menu, Fingerprint } from 'lucide-react';

export default function Navbar({ toggleSidebar, isSidebarOpen }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <nav className="top-navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <button className="toggle-btn" onClick={toggleSidebar}>
            {isSidebarOpen ? <ChevronsLeft size={24} /> : <Menu size={24} />}
          </button>
          <div className="brand-info">
            {/* Premium Logo Design */}
            <div style={{ 
              width: '45px', 
              height: '45px', 
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', 
              borderRadius: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'white', 
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              transform: 'rotate(-5deg)'
            }}>
              <Fingerprint size={26} strokeWidth={2.5} style={{ transform: 'rotate(5deg)' }} />
            </div>
            <div className="brand-text">
              <h1>Employee Attendance System</h1>
              <p>HR Management Portal</p>
            </div>
          </div>
        </div>
        
        <div className="navbar-right">
          {user ? (
            <>
              <div className="navbar-user-info">
                <div className="navbar-greeting">
                  Welcome, <strong>{user.name}</strong>
                </div>
                <div className="navbar-role">
                  {user.role}
                </div>
              </div>
              <div className="navbar-avatar" style={{ overflow: 'hidden' }}>
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  user.name ? user.name.substring(0, 2).toUpperCase() : 'US'
                )}
              </div>
            </>
          ) : (
            <Link to="/" style={{ color: '#3b82f6', fontWeight: 'bold', textDecoration: 'none' }}>Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
