import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Clock, Briefcase, FileText, CalendarCheck, CheckCircle } from 'lucide-react';
import { useGetEmployeeDashboardQuery } from '../../features/dashboard/dashboardApi';
import DashboardHeader from '../layout/DashboardHeader';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { data: stats, isLoading, error } = useGetEmployeeDashboardQuery();

  if (isLoading) return <div>Loading dashboard...</div>;
  if (error) return <div className="error-banner">Failed to load dashboard statistics.</div>;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // Helpers for badge colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
      case 'Approved': return { bg: '#d1fae5', text: '#065f46' };
      case 'Pending':
      case 'Incomplete': return { bg: '#fef3c7', text: '#92400e' };
      case 'Rejected':
      case 'Absent': return { bg: '#fee2e2', text: '#b91c1c' };
      default: return { bg: '#f1f5f9', text: '#475569' };
    }
  };

  const StatusBadge = ({ status }) => {
    const colors = getStatusColor(status);
    return (
      <span style={{ 
        padding: '0.25rem 0.5rem', 
        borderRadius: '99px', 
        fontSize: '0.75rem', 
        fontWeight: '600', 
        backgroundColor: colors.bg, 
        color: colors.text 
      }}>
        {status}
      </span>
    );
  };

  return (
    <div>
      {/* Welcome Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <DashboardHeader />
      </div>

      {/* 4 Summary Cards */}
      <div className="stat-card-row">
        <div className="stat-card-modern">
          <div className="stat-info">
            <h4>Present Days</h4>
            <p>{stats?.presentDays || 0}</p>
          </div>
          <div className="stat-icon" style={{ color: '#10b981' }}>
            <CalendarCheck size={32} />
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="stat-info">
            <h4>Working Hours</h4>
            <p>{stats?.totalWorkingHours || 0} Hrs</p>
          </div>
          <div className="stat-icon" style={{ color: '#3b82f6' }}>
            <Clock size={32} />
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="stat-info">
            <h4>Leave Balance</h4>
            <p>{stats?.leaveBalance || 0}</p>
          </div>
          <div className="stat-icon" style={{ color: '#f59e0b' }}>
            <FileText size={32} />
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="stat-info">
            <h4>Pending Overtime</h4>
            <p>{stats?.pendingOvertimeRequests || 0}</p>
          </div>
          <div className="stat-icon" style={{ color: '#8b5cf6' }}>
            <Briefcase size={32} />
          </div>
        </div>
      </div>

      <div className="dashboard-grid-modern">
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Working Hours Chart */}
          <div className="widget">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Working Hours Chart (Last 7 Days)</h3>
            <div style={{ width: '100%', height: 250 }}>
              <ResponsiveContainer>
                <BarChart data={stats?.chartData || []} margin={{ top: 5, right: 0, bottom: 0, left: -20 }}>
                  <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                  <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Attendance */}
          <div className="widget" style={{ overflowX: 'auto' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Recent Attendance</h3>
            <table className="status-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Punch In</th>
                  <th>Punch Out</th>
                  <th>Hours</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentAttendance?.map((rec) => (
                  <tr key={rec._id}>
                    <td>{new Date(rec.attendanceDate).toLocaleDateString('en-GB', { day:'numeric', month:'short' })}</td>
                    <td>{rec.punchIn ? new Date(rec.punchIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}</td>
                    <td>{rec.punchOut ? new Date(rec.punchOut).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}</td>
                    <td>{rec.workingHours || 0}</td>
                    <td><StatusBadge status={rec.status} /></td>
                  </tr>
                ))}
                {(!stats?.recentAttendance || stats.recentAttendance.length === 0) && (
                  <tr><td colSpan="5" style={{textAlign: 'center'}}>No recent records</td></tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Profile Card */}
          <div className="profile-card-modern">
            <div className="profile-avatar-large">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h3 style={{ fontSize: '1.2rem', margin: '0.5rem 0' }}>{user?.name}</h3>
            <div className="profile-details">
              <p>ID: EMP-{user?._id?.substring(0, 5).toUpperCase()}</p>
              <p>Role: {user?.role}</p>
              <p>Department: {user?.department || 'General'}</p>
              <p>{user?.email}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="widget">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Quick Actions</h3>
            <button className="quick-action-btn" onClick={() => navigate('/dashboard/attendance')}>⌚ Punch In / Punch Out</button>
            <button className="quick-action-btn" onClick={() => navigate('/dashboard/leave')}>📝 Apply Leave</button>
            <button className="quick-action-btn" onClick={() => navigate('/dashboard/overtime')}>⏰ Request Overtime</button>
            <button className="quick-action-btn" onClick={() => navigate('/dashboard/reports')}>📊 Attendance History</button>
          </div>

          {/* Leave Status */}
          <div className="widget">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Recent Leaves</h3>
            <table className="status-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentLeaves?.map((leave) => (
                  <tr key={leave._id}>
                    <td>{leave.leaveType}</td>
                    <td><StatusBadge status={leave.status} /></td>
                  </tr>
                ))}
                {(!stats?.recentLeaves || stats.recentLeaves.length === 0) && (
                  <tr><td colSpan="2" style={{textAlign: 'center'}}>No leave requests</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Overtime Status */}
          <div className="widget">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Recent Overtime</h3>
            <table className="status-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Hrs</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentOvertime?.map((ot) => (
                  <tr key={ot._id}>
                    <td>{new Date(ot.overtimeDate).toLocaleDateString('en-GB', { day:'numeric', month:'short' })}</td>
                    <td>{ot.hours}</td>
                    <td><StatusBadge status={ot.status} /></td>
                  </tr>
                ))}
                {(!stats?.recentOvertime || stats.recentOvertime.length === 0) && (
                  <tr><td colSpan="3" style={{textAlign: 'center'}}>No overtime requests</td></tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
