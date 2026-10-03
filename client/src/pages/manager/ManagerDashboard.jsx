/**
 * File Name: ManagerDashboard.jsx
 * File Path: client/src/pages/manager/ManagerDashboard.jsx
 * 
 * Component Description:
 * Manager Portal Dashboard Page wrapper. Delegates team metrics, leave & overtime approval queues,
 * team presence summary, and analytics to `components/dashboard/ManagerDashboard.jsx`.
 * 
 * Data & Props Used:
 * - Redux State: auth.user
 * - Child Component: ManagerDashboardComponent (from client/src/components/dashboard/ManagerDashboard.jsx)
 * 
 * Responsiveness:
 * - Responsive grid container adapting to mobile screens and desktop sidebars
 * 
 * Component Usage:
 * - Route `/dashboard` or `/manager` when user.role === 'manager'
 */

import React from 'react';
import ManagerDashboardComponent from '../../components/dashboard/ManagerDashboard.jsx';

export default function ManagerDashboard() {
  return (
    <div className="manager-page-container" style={{ width: '100%', minHeight: '100vh' }}>
      <ManagerDashboardComponent />
    </div>
  );
}