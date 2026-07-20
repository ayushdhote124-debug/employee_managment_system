import React from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import EmployeeDashboard from '../components/dashboard/EmployeeDashboard';
import ManagerDashboard from '../components/dashboard/ManagerDashboard';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import PunchWidget from '../components/attendance/PunchWidget';
import LeaveRequestPage from './LeaveRequestPage';
import OvertimeRequestPage from './OvertimeRequestPage';
import ManagerApprovalsPage from './manager/ManagerApprovalsPage';
import ReportsPage from './ReportsPage';
import ProfilePage from './ProfilePage';
import UsersPage from './UsersPage';
import AttendanceOverviewPage from './AttendanceOverviewPage';

import UserProfilePage from './UserProfilePage';

export default function DashboardPage() {
  const { user } = useSelector((state) => state.auth);

  const renderRoutesByRole = () => {
    switch (user?.role) {
      case 'employee':
        return (
          <Routes>
            <Route path="/" element={<EmployeeDashboard />} />
            <Route path="/attendance" element={<PunchWidget />} />
            <Route path="/leave" element={<LeaveRequestPage />} />
            <Route path="/overtime" element={<OvertimeRequestPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/users/:id" element={<UserProfilePage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        );
      case 'manager':
        return (
          <Routes>
            <Route path="/" element={<ManagerDashboard />} />
            {/* Manager's own requests/attendance */}
            <Route path="/attendance" element={<PunchWidget />} />
            <Route path="/leave" element={<LeaveRequestPage />} />
            <Route path="/overtime" element={<OvertimeRequestPage />} />
            
            {/* Manager's team management */}
            <Route path="team-attendance" element={<AttendanceOverviewPage />} />
            <Route path="leave-requests" element={<ManagerApprovalsPage />} />
            <Route path="manage-overtime" element={<ManagerApprovalsPage />} />
            <Route path="team-members" element={<UsersPage />} />
            
            <Route path="reports" element={<ReportsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="users/:id" element={<UserProfilePage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        );
      case 'admin':
        return (
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="users/:id" element={<UserProfilePage />} />
            <Route path="attendance-overview" element={<AttendanceOverviewPage />} />
            <Route path="leave-management" element={<ManagerApprovalsPage />} />
            <Route path="overtime-management" element={<ManagerApprovalsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        );
      default:
        return <div>Invalid Role</div>;
    }
  };

  return (
    <DashboardLayout>
      {renderRoutesByRole()}
    </DashboardLayout>
  );
}
