/**
 * File Name: EmployeeDashboard.jsx
 * File Path: client/src/pages/employee/EmployeeDashboard.jsx
 * 
 * Component Description:
 * Employee Portal Dashboard Page wrapper. Renders the main employee overview component
 * (`components/dashboard/EmployeeDashboard.jsx`), featuring attendance cards, working hours,
 * leave balance, overtime status, and working hours charts.
 * 
 * Data & Props Used:
 * - Redux State: auth.user
 * - Child Component: EmployeeDashboardComponent (from client/src/components/dashboard/EmployeeDashboard.jsx)
 * 
 * Responsiveness:
 * - Mobile responsive stack layout with touch cards and dark mode compliance
 * 
 * Component Usage:
 * - Route `/dashboard` or `/employee` when user.role === 'employee'
 */

import React from 'react';
import EmployeeDashboardComponent from '../../components/dashboard/EmployeeDashboard.jsx';

export default function EmployeeDashboard() {
  return (
    <div className="employee-page-container" style={{ width: '100%', minHeight: '100vh' }}>
      <EmployeeDashboardComponent />
    </div>
  );
}