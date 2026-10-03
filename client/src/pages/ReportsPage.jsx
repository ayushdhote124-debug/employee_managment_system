/**
 * File Name: ReportsPage.jsx
 * File Path: client/src/pages/ReportsPage.jsx
 * 
 * Component Description:
 * Comprehensive System Attendance Reports Page with date/status filtering,
 * interactive Recharts attendance trends, data table preview, and PDF / Excel file export capabilities.
 * Fully compatible with light and dark themes.
 */

import React, { useState } from 'react';
import { useGetAttendanceReportsQuery } from '../features/reports/reportsApi';
import { FileText, Download, BarChart2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

export default function ReportsPage() {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: 'All'
  });
  
  const token = useSelector((state) => state.auth.token);

  const { data, isLoading, error } = useGetAttendanceReportsQuery(filters);

  if (isLoading) return <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Loading reports data...</div>;
  if (error) return <div className="error-banner">Failed to load reports.</div>;

  const records = data?.reportsData || [];

  // Group data by date for the chart
  const dateMap = {};
  records.forEach(rec => {
    const dateStr = new Date(rec.attendanceDate).toLocaleDateString();
    if (!dateMap[dateStr]) {
      dateMap[dateStr] = { date: dateStr, Completed: 0, Incomplete: 0, Pending: 0 };
    }
    dateMap[dateStr][rec.status]++;
  });

  const chartData = Object.values(dateMap).slice(0, 10).reverse();

  const downloadFile = async (type) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      if (filters.status && filters.status !== 'All') queryParams.append('status', filters.status);
      
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/reports/attendance/download/${type}?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error(`Failed to download ${type} report`);
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance_report_${new Date().getTime()}.${type === 'excel' ? 'xlsx' : 'pdf'}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert(`Error downloading ${type} report`);
    }
  };

  const exportPDF = () => downloadFile('pdf');
  const exportExcel = () => downloadFile('excel');

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>System Reports</h2>
          <p style={{ color: 'var(--text-muted)' }}>Generate and download attendance reports</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            onClick={exportPDF}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
          >
            <FileText size={18} />
            Export PDF
          </button>
          
          <button 
            onClick={exportExcel}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
          >
            <Download size={18} />
            Export Excel
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="widget" style={{ marginBottom: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 200px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '500' }}>Start Date</label>
          <input 
            type="date" 
            className="input-field"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          />
        </div>
        <div style={{ flex: '1 1 200px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '500' }}>End Date</label>
          <input 
            type="date" 
            className="input-field"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          />
        </div>
        <div style={{ flex: '1 1 200px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '500' }}>Status</label>
          <select 
            className="input-field"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Incomplete">Incomplete</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
        <div>
          <button 
            className="btn-secondary-outline" 
            onClick={() => setFilters({ startDate: '', endDate: '', status: 'All' })}
            style={{ padding: '0.75rem 1.5rem' }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        {/* Chart Section */}
        <div className="widget">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <BarChart2 size={24} color="#3b82f6" />
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>Recent Attendance Trends</h3>
          </div>
          
          <div style={{ width: '100%', height: 350 }}>
            {chartData.length > 0 ? (
              <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid stroke="var(--border-color)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" stroke="var(--text-muted)" />
                  <YAxis stroke="var(--text-muted)" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-main)', borderRadius: '8px' }}
                  />
                  <Bar dataKey="Completed" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="Incomplete" stackId="a" fill="#f59e0b" />
                  <Bar dataKey="Pending" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-muted)' }}>
                No chart data available
              </div>
            )}
          </div>
        </div>

        {/* Data Table Preview */}
        <div className="widget" style={{ overflowX: 'auto' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Recent Records Preview</h3>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--bg-app)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Date</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Employee</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Punch In</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>In-Selfie & Loc</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Punch Out</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Out-Selfie & Loc</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Hours</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.slice(0, 5).map((record, idx) => (
                <tr key={record._id || idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', color: 'var(--text-main)' }}>{new Date(record.attendanceDate).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem', fontWeight: '500', color: 'var(--text-main)' }}>
                    {record.employee?._id ? (
                      <Link 
                        to={`/dashboard/users/${record.employee._id}`}
                        style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}
                      >
                        {record.employeeName || record.employee?.name || 'View Profile'}
                      </Link>
                    ) : (
                      record.employeeName || record.employee?.name || 'N/A'
                    )}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-main)' }}>
                    {record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {record.checkInPhotoUrl && (
                        <img 
                          src={record.checkInPhotoUrl} 
                          alt="In Selfie" 
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} 
                        />
                      )}
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {record.checkInLocation ? `${record.checkInLocation.latitude.toFixed(2)}, ${record.checkInLocation.longitude.toFixed(2)}` : 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-main)' }}>
                    {record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {record.checkOutPhotoUrl && (
                        <img 
                          src={record.checkOutPhotoUrl} 
                          alt="Out Selfie" 
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} 
                        />
                      )}
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {record.checkOutLocation ? `${record.checkOutLocation.latitude.toFixed(2)}, ${record.checkOutLocation.longitude.toFixed(2)}` : 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-main)' }}>{record.workingHours || 0} hrs</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '12px', 
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      background: record.status === 'Completed' ? 'rgba(16, 185, 129, 0.15)' : (record.status === 'Incomplete' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(59, 130, 246, 0.15)'),
                      color: record.status === 'Completed' ? '#10b981' : (record.status === 'Incomplete' ? '#f59e0b' : '#3b82f6')
                    }}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}