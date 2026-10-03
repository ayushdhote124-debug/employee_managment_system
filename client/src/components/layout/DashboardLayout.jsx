/**
 * File Name: DashboardLayout.jsx
 * File Path: client/src/components/layout/DashboardLayout.jsx
 * 
 * Component Description:
 * Master responsive layout wrapper for all authenticated dashboard views.
 * Handles top header navbar, responsive mobile drawer sidebar with backdrop blur,
 * desktop collapsible sidebar, and full-width main content area.
 */

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function DashboardLayout({ children }) {
  const location = useLocation();
  
  // Mobile drawer open state (default false so mobile screens open with full content view)
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // Desktop collapsed sidebar state (default false: expanded 260px)
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Auto-close mobile drawer whenever route location changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Lock body scroll on mobile when sidebar drawer is open
  useEffect(() => {
    if (isMobileOpen && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setIsMobileOpen((prev) => !prev);
    } else {
      setIsCollapsed((prev) => !prev);
    }
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  return (
    <div className="app-wrapper" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-app)' }}>
      {/* Top Fixed Header Navbar */}
      <Navbar
        toggleSidebar={toggleSidebar}
        isSidebarOpen={window.innerWidth < 768 ? isMobileOpen : !isCollapsed}
      />

      <div className="dashboard-layout">
        {/* Mobile Backdrop Overlay */}
        {isMobileOpen && (
          <div
            className="sidebar-backdrop"
            onClick={closeMobileSidebar}
            aria-label="Close navigation drawer"
          />
        )}

        {/* Sidebar Component */}
        <Sidebar
          isSidebarOpen={!isCollapsed}
          isMobileOpen={isMobileOpen}
          closeMobileSidebar={closeMobileSidebar}
          isCollapsed={isCollapsed}
        />

        {/* Main Content View Container */}
        <main className={`dashboard-main ${isCollapsed ? 'collapsed' : ''}`}>
          <div className="dashboard-content">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
