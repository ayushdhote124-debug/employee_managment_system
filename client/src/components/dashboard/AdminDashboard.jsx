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

  if (isStatsLoading || isLeavesLoading || isOvertimeLoading) return <div>Loading admin dashboard...</div>;
  if (statsError) return <div className="error-banner">Failed to load dashboard statistics.</div>;

  const pendingLeavesList = pendingLeavesData?.leaves?.slice(0, 5) || [];
  const pendingOvertimeList = pendingOvertimeData?.overtime?.slice(0, 5) || [];

  // --- MOCK DATA FOR UI DEMONSTRATION (Until API is updated) ---
  
  // 1. Attendance Status Chart Data (Bar)
  const attendanceChartData = [
    { name: 'Mon', present: 42, absent: 3, late: 5 },
    { name: 'Tue', present: 45, absent: 2, late: 3 },
    { name: 'Wed', present: 40, absent: 5, late: 5 },
    { name: 'Thu', present: 48, absent: 1, late: 1 },
    { name: 'Fri', present: 46, absent: 2, late: 2 },
  ];

  // 2. Working Hours Data (Line)
  const workingHoursData = [
    { name: 'Week 1', hours: 1850 },
    { name: 'Week 2', hours: 1920 },
    { name: 'Week 3', hours: 1890 },
    { name: 'Week 4', hours: 1950 },
  ];

  // 3. Department Wise Employees (Pie)
  const deptData = [
    { name: 'Engineering', value: 25 },
    { name: 'Marketing', value: 10 },
    { name: 'HR', value: 5 },
    { name: 'Sales', value: 10 },
  ];
  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];

  // 4. Overtime Data (Bar)
  const overtimeData = [
    { name: 'Mon', hours: 12 },
    { name: 'Tue', hours: 8 },
    { name: 'Wed', hours: 15 },
    { name: 'Thu', hours: 5 },
    { name: 'Fri', hours: 20 },
  ];

  // Mock Tables
  const recentAttendance = [
    { id: 1, name: 'Rahul Sharma', time: '09:00 AM', status: 'On Time' },
    { id: 2, name: 'Priya Patel', time: '09:15 AM', status: 'Late' },
    { id: 3, name: 'Amit Kumar', time: '08:55 AM', status: 'On Time' },
  ];

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
            <h4 style={{ color: '#64748b', fontSize: '0.9rem' }}>Total Employees</h4>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats?.totalUsers || 42}</p>
          </div>
          <div className="stat-icon" style={{ color: '#3b82f6', background: '#eff6ff' }}>
            <Users size={24} />
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="stat-info">
            <h4 style={{ color: '#64748b', fontSize: '0.9rem' }}>Total Managers</h4>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>8</p>
          </div>
          <div className="stat-icon" style={{ color: '#8b5cf6', background: '#f5f3ff' }}>
            <UserCheck size={24} />
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="stat-info">
            <h4 style={{ color: '#64748b', fontSize: '0.9rem' }}>Today's Attendance</h4>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>38/50</p>
          </div>
          <div className="stat-icon" style={{ color: '#10b981', background: '#ecfdf5' }}>
            <CheckCircle size={24} />
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="stat-info">
            <h4 style={{ color: '#64748b', fontSize: '0.9rem' }}>Pending Overtime</h4>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>12</p>
          </div>
          <div className="stat-icon" style={{ color: '#f59e0b', background: '#fffbeb' }}>
            <Clock size={24} />
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="stat-info">
            <h4 style={{ color: '#64748b', fontSize: '0.9rem' }}>Pending Leave</h4>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats?.pendingLeaves || 0}</p>
          </div>
          <div className="stat-icon" style={{ color: '#ef4444', background: '#fef2f2' }}>
            <FileText size={24} />
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="stat-info">
            <h4 style={{ color: '#64748b', fontSize: '0.9rem' }}>Total Working Hours</h4>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>320h</p>
          </div>
          <div className="stat-icon" style={{ color: '#6366f1', background: '#eef2ff' }}>
            <Calendar size={24} />
          </div>
        </div>

      </div>

      {/* 3. QUICK ACTIONS */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#1e293b' }}>Quick Actions</h3>
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

      {/* 4. CHARTS (4 Charts in 2x2 Grid) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Chart 1: Attendance Status */}
        <div className="widget">
          <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', color: '#1e293b' }}>Attendance Status</h3>
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
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
          <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', color: '#1e293b' }}>Total Working Hours</h3>
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={workingHoursData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="hours" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Department-wise Employees */}
        <div className="widget">
          <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', color: '#1e293b' }}>Department-wise Employees</h3>
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deptData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Overtime Trends */}
        <div className="widget">
          <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', color: '#1e293b' }}>Overtime Trends (Hours)</h3>
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overtimeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
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
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#1e293b', display: 'flex', justifyContent: 'space-between' }}>
            Recent Attendance <span style={{fontSize: '0.8rem', color: '#3b82f6', cursor: 'pointer'}}>View All</span>
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {recentAttendance.map(record => (
                <tr key={record.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.75rem 0', fontWeight: 500 }}>{record.name}</td>
                  <td style={{ padding: '0.75rem 0', color: '#64748b' }}>{record.time}</td>
                  <td style={{ padding: '0.75rem 0', textAlign: 'right' }}>
                    <span className={`status-badge ${record.status === 'On Time' ? 'status-approved' : 'status-rejected'}`}>
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
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#1e293b', display: 'flex', justifyContent: 'space-between' }}>
            Recent Leave Requests <span style={{fontSize: '0.8rem', color: '#3b82f6', cursor: 'pointer'}}>View All</span>
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {pendingLeavesList.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ padding: '0.75rem 0', textAlign: 'center', color: '#64748b' }}>No pending leave requests.</td>
                </tr>
              ) : pendingLeavesList.map(record => (
                <tr key={record._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.75rem 0', fontWeight: 500 }}>{record.employee?.name || 'Unknown'}</td>
                  <td style={{ padding: '0.75rem 0', color: '#64748b' }}>{record.leaveType}</td>
                  <td style={{ padding: '0.75rem 0', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => updateLeaveStatus({ id: record._id, status: 'Approved' })}
                        style={{ padding: '0.2rem 0.4rem', background: '#dcfce7', color: '#166534', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Approve</button>
                      <button 
                        onClick={() => updateLeaveStatus({ id: record._id, status: 'Rejected' })}
                        style={{ padding: '0.2rem 0.4rem', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table 3: Recent Overtime */}
        <div className="widget">
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#1e293b', display: 'flex', justifyContent: 'space-between' }}>
            Recent Overtime <span style={{fontSize: '0.8rem', color: '#3b82f6', cursor: 'pointer'}}>View All</span>
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {pendingOvertimeList.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ padding: '0.75rem 0', textAlign: 'center', color: '#64748b' }}>No pending overtime requests.</td>
                </tr>
              ) : pendingOvertimeList.map(record => (
                <tr key={record._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.75rem 0', fontWeight: 500 }}>{record.employee?.name || 'Unknown'}</td>
                  <td style={{ padding: '0.75rem 0', color: '#64748b' }}>{record.hours}h</td>
                  <td style={{ padding: '0.75rem 0', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => updateOvertimeStatus({ id: record._id, status: 'Approved' })}
                        style={{ padding: '0.2rem 0.4rem', background: '#dcfce7', color: '#166534', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Approve</button>
                      <button 
                        onClick={() => updateOvertimeStatus({ id: record._id, status: 'Rejected' })}
                        style={{ padding: '0.2rem 0.4rem', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Reject</button>
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
