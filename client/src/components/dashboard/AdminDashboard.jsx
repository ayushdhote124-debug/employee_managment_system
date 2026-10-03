/**
 * File Name: AdminDashboard.jsx
 * File Path: client/src/components/dashboard/AdminDashboard.jsx
 * 
 * Component Description:
 * Modern responsive Admin Portal Dashboard. Displays organization summary KPIs,
 * user role breakdown, pending leave and overtime approvals, interactive analytics charts,
 * and quick administrative user creation modal triggers. Fully supports light and dark themes.
 */

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  UserPlus, 
  UserCheck, 
  BarChart2, 
  Settings,
  Calendar
} from 'lucide-react';
import { useGetAdminDashboardQuery } from '../../features/dashboard/dashboardApi';
import { useGetPendingLeavesQuery, useUpdateLeaveStatusMutation } from '../../features/leave/leaveApi';
import { useGetPendingOvertimeQuery, useUpdateOvertimeStatusMutation } from '../../features/overtime/overtimeApi';
import DashboardHeader from '../layout/DashboardHeader';
import AddUserModal from '../users/AddUserModal';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [addUserRole, setAddUserRole] = useState('employee');

  const { data: stats, isLoading: isStatsLoading, error: statsError } = useGetAdminDashboardQuery();
  const { data: pendingLeavesData, isLoading: isLeavesLoading } = useGetPendingLeavesQuery();
  const { data: pendingOvertimeData, isLoading: isOvertimeLoading } = useGetPendingOvertimeQuery();

  const [updateLeaveStatus] = useUpdateLeaveStatusMutation();
  const [updateOvertimeStatus] = useUpdateOvertimeStatusMutation();

  if (isStatsLoading || isLeavesLoading || isOvertimeLoading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading admin dashboard...</div>;
  }
  if (statsError) {
    return <div className="error-banner">Failed to load dashboard statistics.</div>;
  }

  const pendingLeavesList = pendingLeavesData?.leaves?.slice(0, 5) || [];
  const pendingOvertimeList = pendingOvertimeData?.overtime?.slice(0, 5) || [];

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];
  
  const attendanceChartData = stats?.attendanceChartData || [];
  const workingHoursData = stats?.workingHoursData || [];
  const deptData = stats?.deptData || [];
  const overtimeData = stats?.overtimeData || [];
  const recentAttendance = stats?.recentAttendance || [];

  return (
    <div style={{ paddingBottom: '2rem' }}>
      {/* 1. HEADER */}
      <div style={{ marginBottom: '2rem' }}>
        <DashboardHeader />
      </div>

      {/* 2. SUMMARY CARDS (6 Cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        <div className="stat-card-modern">
          <div className="stat-info">
            <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Employees</h4>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{stats?.totalUsers || 42}</p>
          </div>
          <div className="stat-icon" style={{ color: '#3b82f6', background: 'rgba(59, 130, 246, 0.12)' }}>
            <Users size={24} />
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="stat-info">
            <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Managers</h4>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{stats?.totalManagers || 0}</p>
          </div>
          <div className="stat-icon" style={{ color: '#8b5cf6', background: 'rgba(139, 92, 246, 0.12)' }}>
            <UserCheck size={24} />
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="stat-info">
            <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Today's Attendance</h4>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{stats?.todaysAttendance || 0}/{stats?.activeEmployees || 0}</p>
          </div>
          <div className="stat-icon" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.12)' }}>
            <CheckCircle size={24} />
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="stat-info">
            <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Pending Overtime</h4>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{stats?.pendingOvertime || 0}</p>
          </div>
          <div className="stat-icon" style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.12)' }}>
            <Clock size={24} />
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="stat-info">
            <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Pending Leave</h4>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{stats?.pendingLeaves || 0}</p>
          </div>
          <div className="stat-icon" style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.12)' }}>
            <FileText size={24} />
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="stat-info">
            <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Working Hours</h4>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{stats?.totalWorkingHours || 0}h</p>
          </div>
          <div className="stat-icon" style={{ color: '#6366f1', background: 'rgba(99, 102, 241, 0.12)' }}>
            <Calendar size={24} />
          </div>
        </div>

      </div>

      {/* 3. QUICK ACTIONS */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            className="btn-action-base btn-primary-blue" 
            onClick={() => { setAddUserRole('employee'); setIsAddUserModalOpen(true); }}
          >
            <UserPlus size={18} /> Add Employee
          </button>
          <button 
            className="btn-action-base btn-primary-purple" 
            onClick={() => { setAddUserRole('manager'); setIsAddUserModalOpen(true); }}
          >
            <UserPlus size={18} /> Add Manager
          </button>
          <button className="btn-action-base btn-secondary-outline" onClick={() => navigate('/dashboard/reports')}>
            <BarChart2 size={18} /> View Reports
          </button>
          <button className="btn-action-base btn-secondary-outline" onClick={() => navigate('/dashboard/users')}>
            <Settings size={18} /> Manage Users
          </button>
        </div>
      </div>

      {/* 4. CHARTS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Chart 1: Attendance Status */}
        <div className="widget">
          <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Attendance Status</h3>
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="var(--text-muted)" />
                <YAxis axisLine={false} tickLine={false} stroke="var(--text-muted)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }} />
                <Legend />
                <Bar dataKey="present" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="late" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Working Hours */}
        <div className="widget">
          <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Total Working Hours</h3>
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={workingHoursData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="var(--text-muted)" />
                <YAxis axisLine={false} tickLine={false} stroke="var(--text-muted)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }} />
                <Line type="monotone" dataKey="hours" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Department-wise Employees */}
        <div className="widget">
          <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Department-wise Employees</h3>
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deptData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Overtime Trends */}
        <div className="widget">
          <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Overtime Trends (Hours)</h3>
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overtimeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="var(--text-muted)" />
                <YAxis axisLine={false} tickLine={false} stroke="var(--text-muted)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }} />
                <Bar dataKey="hours" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 5. RECENT ACTIVITY TABLES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        {/* Table 1: Recent Attendance */}
        <div className="widget">
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between' }}>
            Recent Attendance <span onClick={() => navigate('/dashboard/attendance-overview')} style={{fontSize: '0.8rem', color: '#3b82f6', cursor: 'pointer'}}>View All</span>
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {recentAttendance.map(record => (
                <tr key={record.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem 0', fontWeight: 500, color: 'var(--text-main)' }}>{record.name}</td>
                  <td style={{ padding: '0.75rem 0', color: 'var(--text-muted)' }}>{record.time}</td>
                  <td style={{ padding: '0.75rem 0', textAlign: 'right' }}>
                    <span style={{ 
                      padding: '0.2rem 0.5rem', 
                      borderRadius: '999px', 
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backgroundColor: record.status === 'On Time' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: record.status === 'On Time' ? '#10b981' : '#ef4444'
                    }}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table 2: Recent Leaves */}
        <div className="widget">
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between' }}>
            Recent Leave Requests <span onClick={() => navigate('/dashboard/leave-management')} style={{fontSize: '0.8rem', color: '#3b82f6', cursor: 'pointer'}}>View All</span>
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {pendingLeavesList.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ padding: '0.75rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>No pending leave requests.</td>
                </tr>
              ) : pendingLeavesList.map(record => (
                <tr key={record._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem 0', fontWeight: 500, color: 'var(--text-main)' }}>{record.employee?.name || 'Unknown'}</td>
                  <td style={{ padding: '0.75rem 0', color: 'var(--text-muted)' }}>{record.leaveType}</td>
                  <td style={{ padding: '0.75rem 0', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => updateLeaveStatus({ id: record._id, status: 'Approved' })}
                        style={{ padding: '0.2rem 0.4rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Approve</button>
                      <button 
                        onClick={() => updateLeaveStatus({ id: record._id, status: 'Rejected' })}
                        style={{ padding: '0.2rem 0.4rem', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table 3: Recent Overtime */}
        <div className="widget">
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between' }}>
            Recent Overtime <span onClick={() => navigate('/dashboard/overtime-management')} style={{fontSize: '0.8rem', color: '#3b82f6', cursor: 'pointer'}}>View All</span>
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {pendingOvertimeList.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ padding: '0.75rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>No pending overtime requests.</td>
                </tr>
              ) : pendingOvertimeList.map(record => (
                <tr key={record._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem 0', fontWeight: 500, color: 'var(--text-main)' }}>{record.employee?.name || 'Unknown'}</td>
                  <td style={{ padding: '0.75rem 0', color: 'var(--text-muted)' }}>{record.hours}h</td>
                  <td style={{ padding: '0.75rem 0', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => updateOvertimeStatus({ id: record._id, status: 'Approved' })}
                        style={{ padding: '0.2rem 0.4rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Approve</button>
                      <button 
                        onClick={() => updateOvertimeStatus({ id: record._id, status: 'Rejected' })}
                        style={{ padding: '0.2rem 0.4rem', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      <AddUserModal 
        isOpen={isAddUserModalOpen} 
        onClose={() => setIsAddUserModalOpen(false)} 
        defaultRole={addUserRole} 
      />

    </div>
  );
}
