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
  // 1. Fetch Real Data
  const { data: stats, isLoading: isStatsLoading, error: statsError } = useGetManagerDashboardQuery();
  const { data: pendingLeavesData, isLoading: isLeavesLoading } = useGetPendingLeavesQuery();
  const { data: pendingOvertimeData, isLoading: isOvertimeLoading } = useGetPendingOvertimeQuery();

  // 2. Mutations
  const [updateLeaveStatus] = useUpdateLeaveStatusMutation();
  const [updateOvertimeStatus] = useUpdateOvertimeStatusMutation();

  if (isStatsLoading || isLeavesLoading || isOvertimeLoading) return <div>Loading manager dashboard...</div>;
  if (statsError) return <div className="error-banner">Failed to load dashboard statistics.</div>;

  // Formatted Date
  const today = new Date().toLocaleDateString('en-GB', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  const pendingLeavesList = pendingLeavesData?.leaves || [];
  const pendingOvertimeList = pendingOvertimeData?.overtime || [];

  // Summary Cards with Real Data
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

  const attendanceData = [
    { name: 'Completed', value: 16 },
    { name: 'Incomplete', value: 2 },
  ];

  const workingHoursData = [
    { name: 'Mon', hours: 140 },
    { name: 'Tue', hours: 145 },
    { name: 'Wed', hours: 138 },
    { name: 'Thu', hours: 150 },
    { name: 'Fri', hours: 142 },
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
              <h4 style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem' }}>{card.title}</h4>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>{card.value}</p>
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

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* 4. Team Attendance */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Team Attendance</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  <th style={{ padding: '1rem', color: '#64748b' }}>Employee</th>
                  <th style={{ padding: '1rem', color: '#64748b' }}>Punch In</th>
                  <th style={{ padding: '1rem', color: '#64748b' }}>Punch Out</th>
                  <th style={{ padding: '1rem', color: '#64748b' }}>Working Hours</th>
                  <th style={{ padding: '1rem', color: '#64748b' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {teamAttendance.map(row => (
                  <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem', fontWeight: 500 }}>{row.name}</td>
                    <td style={{ padding: '1rem' }}>{row.punchIn}</td>
                    <td style={{ padding: '1rem' }}>{row.punchOut}</td>
                    <td style={{ padding: '1rem' }}>{row.hours}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '999px', 
                        fontSize: '0.875rem',
                        background: row.status === 'Present' ? '#dcfce7' : '#fee2e2',
                        color: row.status === 'Present' ? '#166534' : '#991b1b'
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

        {/* 9. Recent Activity */}
        <div className="widget">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Recent Activity</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {recentActivity.map((activity, index) => (
              <li key={index} style={{ padding: '0.75rem 0', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}></div>
                <span style={{ color: '#475569', fontSize: '0.95rem' }}>{activity}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* 5. Pending Leave Requests */}
        <div className="widget">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Pending Leave Requests</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  <th style={{ padding: '0.75rem', color: '#64748b' }}>Employee</th>
                  <th style={{ padding: '0.75rem', color: '#64748b' }}>Type</th>
                  <th style={{ padding: '0.75rem', color: '#64748b' }}>From/To</th>
                  <th style={{ padding: '0.75rem', color: '#64748b', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingLeavesList.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ padding: '1rem', textAlign: 'center', color: '#64748b' }}>No pending leave requests.</td>
                  </tr>
                ) : pendingLeavesList.map(leave => (
                  <tr key={leave._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 500 }}>{leave.employee?.name || 'Unknown'}</td>
                    <td style={{ padding: '0.75rem', fontSize: '0.9rem' }}>{leave.leaveType}</td>
                    <td style={{ padding: '0.75rem', fontSize: '0.85rem', color: '#64748b' }}>
                      {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => updateLeaveStatus({ id: leave._id, status: 'Approved' })}
                          style={{ padding: '0.25rem 0.5rem', background: '#dcfce7', color: '#166534', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Approve</button>
                        <button 
                          onClick={() => updateLeaveStatus({ id: leave._id, status: 'Rejected' })}
                          style={{ padding: '0.25rem 0.5rem', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 6. Pending Overtime */}
        <div className="widget">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Pending Overtime</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  <th style={{ padding: '0.75rem', color: '#64748b' }}>Employee</th>
                  <th style={{ padding: '0.75rem', color: '#64748b' }}>Hours</th>
                  <th style={{ padding: '0.75rem', color: '#64748b' }}>Reason</th>
                  <th style={{ padding: '0.75rem', color: '#64748b', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingOvertimeList.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ padding: '1rem', textAlign: 'center', color: '#64748b' }}>No pending overtime requests.</td>
                  </tr>
                ) : pendingOvertimeList.map(ot => (
                  <tr key={ot._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 500 }}>{ot.employee?.name || 'Unknown'}</td>
                    <td style={{ padding: '0.75rem', fontSize: '0.9rem' }}>{ot.hours}h</td>
                    <td style={{ padding: '0.75rem', fontSize: '0.85rem', color: '#64748b' }}>{ot.reason}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => updateOvertimeStatus({ id: ot._id, status: 'Approved' })}
                          style={{ padding: '0.25rem 0.5rem', background: '#dcfce7', color: '#166534', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Approve</button>
                        <button 
                          onClick={() => updateOvertimeStatus({ id: ot._id, status: 'Rejected' })}
                          style={{ padding: '0.25rem 0.5rem', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* 7. Attendance Chart */}
        <div className="widget">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Attendance Overview</h3>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <BarChart data={attendanceData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 8. Working Hours Chart */}
        <div className="widget">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Working Hours (Last 7 Days)</h3>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <LineChart data={workingHoursData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="hours" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="widget" style={{ marginTop: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Team Performance</h3>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px', padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
            <h4 style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Top Employee</h4>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b' }}>Rahul Verma</p>
          </div>
          <div style={{ flex: 1, minWidth: '200px', padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', borderLeft: '4px solid #10b981' }}>
            <h4 style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Highest Working Hours</h4>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b' }}>Ayush Sharma (45h)</p>
          </div>
          <div style={{ flex: 1, minWidth: '200px', padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', borderLeft: '4px solid #f59e0b' }}>
            <h4 style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Most Attendance</h4>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b' }}>Priya Singh (100%)</p>
          </div>
        </div>
      </div>

    </div>
  );
}
