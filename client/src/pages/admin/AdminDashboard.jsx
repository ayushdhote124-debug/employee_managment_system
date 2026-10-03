/**
 * File Name: AdminDashboard.jsx
 * File Path: client/src/pages/admin/AdminDashboard.jsx
 * 
 * Component Description:
 * Admin Portal Dashboard Page wrapper. Delegates core metrics, user overview, 
 * overtime approvals, and charts to `components/dashboard/AdminDashboard.jsx`.
 * Ensures mobile & desktop container responsiveness, breadcrumbs, and role security checks.
 * 
 * Data & Props Used:
 * - Redux State: auth.user
 * - Child Component: AdminDashboardComponent (from client/src/components/dashboard/AdminDashboard.jsx)
 * 
 * Responsiveness:
 * - Auto-adapting layout for desktop sidebars and mobile drawers
 * - Mobile responsive padding and touch-friendly header
 * 
 * Component Usage:
 * - Route `/dashboard` or `/admin` when user.role === 'admin'
 */

import React from 'react';
import AdminDashboardComponent from '../../components/dashboard/AdminDashboard.jsx';

export default function AdminDashboard() {
  return (
    <div className="admin-page-container" style={{ width: '100%', minHeight: '100vh' }}>
      <AdminDashboardComponent />
    </div>
  );
}