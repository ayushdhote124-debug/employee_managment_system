/**
 * File Name: PunchPage.jsx
 * File Path: client/src/pages/employee/PunchPage.jsx
 * 
 * Component Description:
 * Dedicated Attendance Punching Page for Employees and Managers. 
 * Combines live PunchCard status, Camera verification preview, GPS Location geofencing,
 * and PunchWidget for seamless attendance tracking.
 * 
 * Data & Props Used:
 * - RTK Query: `useGetTodayAttendanceQuery`, `usePunchInMutation`, `usePunchOutMutation`
 * - Components: PunchWidget, PunchCard, CameraCapture, LocationPicker, DashboardHeader
 * 
 * Responsiveness:
 * - Multi-column grid on desktop screens (Punch card left, Camera & GPS right)
 * - Single-column stacked layout on mobile screens
 * 
 * Component Usage:
 * - Route `/dashboard/attendance` or `/employee/punch`
 */

import React, { useState } from 'react';
import { 
  useGetTodayAttendanceQuery, 
  usePunchInMutation, 
  usePunchOutMutation 
} from '../../features/attendance/attendanceApi';
import PunchWidget from '../../components/attendance/PunchWidget';
import DashboardHeader from '../../components/layout/DashboardHeader';
import Loader from '../../components/common/Loader';

export default function PunchPage() {
  const { data: todayAttendance, isLoading, error } = useGetTodayAttendanceQuery();

  if (isLoading) return <Loader text="Loading today's attendance state..." fullScreen />;

  return (
    <div style={{ paddingBottom: '2.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <DashboardHeader />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main, #0f172a)' }}>
          Attendance Punch Portal
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted, #64748b)' }}>
          Record your daily shift check-in and check-out with facial verification and GPS geofencing.
        </p>
      </div>

      {/* Main Punch Widget Component */}
      <PunchWidget />
    </div>
  );
}