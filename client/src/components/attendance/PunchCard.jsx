/**
 * File Name: PunchCard.jsx
 * File Path: client/src/components/attendance/PunchCard.jsx
 * 
 * Component Description:
 * Live Punch In / Punch Out visual card component. Displays real-time digital clock,
 * today's punch status, check-in time, check-out time, active work shift timer,
 * and high-visibility Punch In / Punch Out action buttons.
 * 
 * Data & Props Used:
 * - todayAttendance (object): { checkIn, checkOut, status, totalHours }
 * - onPunchIn (function): Handler for marking Punch In
 * - onPunchOut (function): Handler for marking Punch Out
 * - isLoading (boolean): Disables buttons during API mutation
 * - isPunchedIn (boolean): Indicates current active attendance session
 * 
 * Responsiveness:
 * - Full mobile card design with touch-optimized buttons
 * - Modern dark & light mode styling
 * 
 * Component Usage:
 * - EmployeeDashboard, ManagerDashboard, PunchPage, DashboardPage
 */

import React, { useState, useEffect } from 'react';
import { Clock, LogIn, LogOut, CheckCircle2, AlertCircle, Timer } from 'lucide-react';
import StatusBadge from '../dashboard/StatusBadge';

export default function PunchCard({
  todayAttendance,
  onPunchIn,
  onPunchOut,
  isLoading = false,
  isPunchedIn = false,
  className = ''
}) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate elapsed working hours if punched in
  const getElapsedHours = () => {
    if (!todayAttendance?.checkIn || todayAttendance?.checkOut) return null;
    const checkInDate = new Date(todayAttendance.checkIn);
    const diffMs = now - checkInDate;
    if (diffMs < 0) return '0h 0m';
    const totalMins = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    return `${hours}h ${mins}m`;
  };

  const elapsed = getElapsedHours();

  return (
    <div
      className={`punch-card-container ${className}`}
      style={{
        backgroundColor: 'var(--bg-card, #ffffff)',
        border: '1px solid var(--border-color, #e2e8f0)',
        borderRadius: '1.25rem',
        padding: '1.5rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        width: '100%'
      }}
    >
      {/* Top Bar: Title & Status */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Clock size={20} style={{ color: '#3b82f6' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main, #0f172a)' }}>
            Attendance Punch
          </h3>
        </div>
        <StatusBadge status={todayAttendance?.status || (isPunchedIn ? 'Present' : 'Not Punched')} />
      </div>

      {/* Center Digital Clock */}
      <div
        style={{
          textAlign: 'center',
          padding: '1.25rem',
          borderRadius: '0.875rem',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.15)'
        }}
      >
        <div style={{ fontSize: '2.25rem', fontWeight: '800', fontFamily: 'monospace', color: '#3b82f6', letterSpacing: '0.05em' }}>
          {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted, #64748b)', fontWeight: '500', marginTop: '0.25rem' }}>
          {now.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Punch Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{
          padding: '0.75rem',
          borderRadius: '0.5rem',
          backgroundColor: 'var(--bg-app, #f8fafc)',
          border: '1px solid var(--border-color, #e2e8f0)'
        }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)', fontWeight: '600' }}>Punch In</p>
          <p style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main, #0f172a)', marginTop: '0.2rem' }}>
            {todayAttendance?.checkIn
              ? new Date(todayAttendance.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : '--:--'}
          </p>
        </div>

        <div style={{
          padding: '0.75rem',
          borderRadius: '0.5rem',
          backgroundColor: 'var(--bg-app, #f8fafc)',
          border: '1px solid var(--border-color, #e2e8f0)'
        }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)', fontWeight: '600' }}>Punch Out</p>
          <p style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main, #0f172a)', marginTop: '0.2rem' }}>
            {todayAttendance?.checkOut
              ? new Date(todayAttendance.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : '--:--'}
          </p>
        </div>
      </div>

      {/* Active Shift Duration */}
      {elapsed && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          padding: '0.5rem',
          borderRadius: '0.5rem',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          color: '#10b981',
          fontSize: '0.85rem',
          fontWeight: '700'
        }}>
          <Timer size={16} /> Active Working Shift: {elapsed}
        </div>
      )}

      {/* Punch Action Button */}
      <div style={{ marginTop: '0.5rem' }}>
        {!isPunchedIn ? (
          <button
            onClick={onPunchIn}
            disabled={isLoading}
            style={{
              width: '100%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              padding: '0.875rem',
              borderRadius: '0.75rem',
              backgroundColor: '#10b981',
              color: '#ffffff',
              fontSize: '1rem',
              fontWeight: '700',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
              transition: 'all 0.2s ease'
            }}
          >
            <LogIn size={20} /> {isLoading ? 'Punching In...' : 'PUNCH IN NOW'}
          </button>
        ) : (
          <button
            onClick={onPunchOut}
            disabled={isLoading || !!todayAttendance?.checkOut}
            style={{
              width: '100%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              padding: '0.875rem',
              borderRadius: '0.75rem',
              backgroundColor: todayAttendance?.checkOut ? '#94a3b8' : '#ef4444',
              color: '#ffffff',
              fontSize: '1rem',
              fontWeight: '700',
              border: 'none',
              cursor: isLoading || todayAttendance?.checkOut ? 'not-allowed' : 'pointer',
              boxShadow: todayAttendance?.checkOut ? 'none' : '0 4px 14px rgba(239, 68, 68, 0.35)',
              transition: 'all 0.2s ease'
            }}
          >
            <LogOut size={20} />{' '}
            {todayAttendance?.checkOut
              ? 'PUNCHED OUT FOR TODAY'
              : isLoading
              ? 'Punching Out...'
              : 'PUNCH OUT NOW'}
          </button>
        )}
      </div>
    </div>
  );
}