/**
 * File Name: ManagerDashboard.jsx
 * File Path: client/src/components/dashboard/ManagerDashboard.jsx
 * 
 * Component Description:
 * Modern responsive Manager Portal Dashboard featuring team metrics, leave & overtime approval queues,
 * team presence roster, and weekly working hours analytics with full light & dark theme compatibility.
 */

import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Calendar as CalendarIcon 
} from 'lucide-react';
import { useGetManagerDashboardQuery } from '../../features/dashboard/dashboardApi';
import { useGetPendingLeavesQuery, useUpdateLeaveStatusMutation } from '../../features/leave/leaveApi';
import { useGetPendingOvertimeQuery, useUpdateOvertimeStatusMutation } from '../../features/overtime/overtimeApi';
import DashboardHeader from '../layout/DashboardHeader';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const { data: stats, isLoading: isStatsLoading, error: statsError } = useGetManagerDashboardQuery();
  const { data: pendingLeavesData, isLoading: isLeavesLoading } = useGetPendingLeavesQuery();
  const { data: pendingOvertimeData, isLoading: isOvertimeLoading } = useGetPendingOvertimeQuery();

  const [updateLeaveStatus] = useUpdateLeaveStatusMutation();
  const [updateOvertimeStatus] = useUpdateOvertimeStatusMutation();

  if (isStatsLoading || isLeavesLoading || isOvertimeLoading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading manager dashboard...</div>;
  }
  if (statsError) {
    return <div className="error-banner">Failed to load dashboard statistics.</div>;
  }

  const pendingLeavesList = pendingLeavesData?.leaves || [];
  const pendingOvertimeList = pendingOvertimeData?.overtime || [];

  const summaryCards = [
    { title: 'Total Employees', value: stats?.totalEmployees || 0, icon: <Users size={28} />, color: '#3b82f6' },
    { title: 'Present Today', value: 16, icon: <CheckCircle size={28} />, color: '#10b981' },
    { title: 'Pending Leave', value: stats?.pendingLeaves || 0, icon: <FileText size={28} />, color: '#f59e0b' },
    { title: 'Pending Overtime', value: stats?.pendingOT || 0, icon: <Clock size={28} />, color: '#8b5cf6' },
    { title: 'Total Working Hours', value: '142h', icon: <Clock size={28} />, color: '#06b6d4' },
    { title: 'Absent Today', value: 2, icon: <XCircle size={28} />, color: '#ef4444' },
  ];

  const teamAttendance = [
    { id: 1, name: 'Ayush Sharma', punchIn: '09:00 AM', punchOut: '06:00 PM', hours: '9h', status: 'Present' },
    { id: 2, name: 'Rahul Verma', punchIn: '09:15 AM', punchOut: '06:30 PM', hours: '9.25h', status: 'Present' },
    { id: 3, name: 'Priya Singh', punchIn: '-', punchOut: '-', hours: '0h', status: 'Absent' },
  ];

  const recentActivity = [
    "Ayush checked in at 09:00 AM",
    "Rahul submitted overtime request for 3 hours",
    "Priya applied for sick leave"
  ];

  return (
    <div style={{ paddingBottom: '2rem' }}>
      {/* 1. Header */}
      <div style={{ marginBottom: '2rem' }}>
        <DashboardHeader />
      </div>

      {/* 2. Summary Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {summaryCards.map((card, index) => (
          <div key={index} className="stat-card-modern" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="stat-info">
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{card.title}</h4>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>{card.value}</p>
            </div>
            <div className="stat-icon" style={{ color: card.color }}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Quick Actions */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn-action-base btn-success" onClick={() => navigate('/dashboard/leave-requests')}>Approve Leave</button>
          <button className="btn-action-base btn-primary-purple" onClick={() => navigate('/dashboard/manage-overtime')}>Approve Overtime</button>
          <button className="btn-action-base btn-primary-blue" onClick={() => navigate('/dashboard/team-attendance')}>View Attendance</button>
          <button className="btn-action-base btn-secondary-outline" onClick={() => navigate('/dashboard/reports')}>Reports</button>
        </div>
      </div>

      {/* 4. Team Attendance & Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        <div className="widget">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Team Attendance</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Employee</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Punch In</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Punch Out</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Working Hours</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {teamAttendance.map(row => (
                  <tr key={row.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', fontWeight: 500, color: 'var(--text-main)' }}>{row.name}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-main)' }}>{row.punchIn}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-main)' }}>{row.punchOut}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-main)' }}>{row.hours}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '999px', 
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        background: row.status === 'Present' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: row.status === 'Present' ? '#10b981' : '#ef4444'
                      }}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="widget">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Recent Activity</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {recentActivity.map((activity, index) => (
              <li key={index} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }}></div>
                <span style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{activity}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 5. Pending Approvals Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        {/* Pending Leave Requests */}
        <div className="widget">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Pending Leave Requests</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                  <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Employee</th>
                  <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Type</th>
                  <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>From/To</th>
                  <th style={{ padding: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingLeavesList.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>No pending leave requests.</td>
                  </tr>
                ) : pendingLeavesList.map(leave => (
                  <tr key={leave._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 500, color: 'var(--text-main)' }}>{leave.employee?.name || 'Unknown'}</td>
                    <td style={{ padding: '0.75rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>{leave.leaveType}</td>
                    <td style={{ padding: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => updateLeaveStatus({ id: leave._id, status: 'Approved' })}
                          style={{ padding: '0.25rem 0.5rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>Approve</button>
                        <button 
                          onClick={() => updateLeaveStatus({ id: leave._id, status: 'Rejected' })}
                          style={{ padding: '0.25rem 0.5rem', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Overtime */}
        <div className="widget">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Pending Overtime</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                  <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Employee</th>
                  <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Hours</th>
                  <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Reason</th>
                  <th style={{ padding: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingOvertimeList.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>No pending overtime requests.</td>
                  </tr>
                ) : pendingOvertimeList.map(ot => (
                  <tr key={ot._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 500, color: 'var(--text-main)' }}>{ot.employee?.name || 'Unknown'}</td>
                    <td style={{ padding: '0.75rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>{ot.hours}h</td>
                    <td style={{ padding: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{ot.reason}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => updateOvertimeStatus({ id: ot._id, status: 'Approved' })}
                          style={{ padding: '0.25rem 0.5rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>Approve</button>
                        <button 
                          onClick={() => updateOvertimeStatus({ id: ot._id, status: 'Rejected' })}
                          style={{ padding: '0.25rem 0.5rem', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
