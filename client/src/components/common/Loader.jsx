/**
 * File Name: Loader.jsx
 * File Path: client/src/components/common/Loader.jsx
 * 
 * Component Description:
 * Reusable Loading Spinner & Skeleton component for asynchronous data fetching states,
 * buttons, full page transitions, and section placeholders.
 * 
 * Data & Props Used:
 * - text (string): Optional caption message (e.g., "Fetching records...", "PUNCHING IN...")
 * - size (string): 'sm' | 'md' | 'lg' | 'xl' (default 'md')
 * - fullScreen (boolean): Renders centered full-viewport backdrop loading overlay
 * - overlay (boolean): Renders dark/opaque container overlay
 * - color (string): Custom CSS color for spinner
 * 
 * Responsiveness:
 * - Centered layout adaptation for mobile and desktop screens
 * - Dark mode theme integration
 * 
 * Component Usage:
 * - AdminDashboard, ManagerDashboard, EmployeeDashboard, DataTable, PunchWidget, Auth Pages
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loader({
  text = 'Loading...',
  size = 'md',
  fullScreen = false,
  overlay = false,
  color = '#3b82f6',
  className = ''
}) {
  const sizePx = {
    sm: 18,
    md: 28,
    lg: 40,
    xl: 56
  }[size] || 28;

  const loaderContent = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        padding: overlay || fullScreen ? '2rem' : '1rem'
      }}
    >
      <Loader2
        size={sizePx}
        style={{
          color: color,
          animation: 'spin 1s linear infinite'
        }}
      />
      {text && (
        <p
          style={{
            fontSize: size === 'sm' ? '0.8rem' : '0.9rem',
            fontWeight: '500',
            color: 'var(--text-muted, #64748b)',
            letterSpacing: '0.02em',
            margin: 0
          }}
        >
          {text}
        </p>
      )}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  if (fullScreen) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        className={className}
      >
        <div style={{
          backgroundColor: 'var(--bg-card, #ffffff)',
          padding: '2rem 3rem',
          borderRadius: '1rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
        }}>
          {loaderContent}
        </div>
      </div>
    );
  }

  if (overlay) {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(2px)',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 'inherit'
        }}
        className={className}
      >
        {loaderContent}
      </div>
    );
  }

  return <div className={`loader-container ${className}`}>{loaderContent}</div>;
}