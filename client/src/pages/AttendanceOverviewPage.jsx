import React, { useState } from 'react';
import { useGetAllAttendanceQuery } from '../features/attendance/attendanceApi';
import DashboardHeader from '../components/layout/DashboardHeader';
import { Search } from 'lucide-react';
import { format } from 'date-fns';

export default function AttendanceOverviewPage() {
  const { data, isLoading, error } = useGetAllAttendanceQuery();
  const [searchTerm, setSearchTerm] = useState('');

  const attendanceRecords = data?.attendance || [];

  const filteredRecords = attendanceRecords.filter(record => 
    record.employee?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    record.employee?.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ paddingBottom: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <DashboardHeader />
      </div>

      <div className="widget" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', color: '#1e293b' }}>Attendance Overview</h2>
          <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
            <input 
              type="text" 
              placeholder="Search by employee name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem',
                borderRadius: '8px', border: '1px solid #e2e8f0',
                outline: 'none', fontSize: '0.95rem'
              }}
            />
          </div>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading attendance records...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>Failed to load attendance data.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  <th style={{ textAlign: 'left', padding: '1rem', color: '#64748b', fontWeight: 600 }}>Employee</th>
                  <th style={{ textAlign: 'left', padding: '1rem', color: '#64748b', fontWeight: 600 }}>Date</th>
                  <th style={{ textAlign: 'left', padding: '1rem', color: '#64748b', fontWeight: 600 }}>Punch In</th>
                  <th style={{ textAlign: 'left', padding: '1rem', color: '#64748b', fontWeight: 600 }}>Punch Out</th>
                  <th style={{ textAlign: 'left', padding: '1rem', color: '#64748b', fontWeight: 600 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map(record => (
                    <tr 
                      key={record._id} 
                      style={{ 
                        borderBottom: '1px solid #f1f5f9',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '1rem', fontWeight: 500, color: '#1e293b' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem' }}>
                            {record.employee?.name ? record.employee.name.substring(0,2).toUpperCase() : '??'}
                          </div>
                          {record.employee?.name || 'Unknown'}
                        </div>
                      </td>
                      <td style={{ padding: '1rem', color: '#64748b' }}>
                        {format(new Date(record.attendanceDate), 'MMM dd, yyyy')}
                      </td>
                      <td style={{ padding: '1rem', color: '#64748b' }}>
                        {record.punchIn ? format(new Date(record.punchIn), 'hh:mm a') : '-'}
                      </td>
                      <td style={{ padding: '1rem', color: '#64748b' }}>
                        {record.punchOut ? format(new Date(record.punchOut), 'hh:mm a') : '-'}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600,
                          backgroundColor: record.status === 'Completed' ? '#ecfdf5' : record.status === 'Incomplete' ? '#fffbeb' : '#eff6ff',
                          color: record.status === 'Completed' ? '#10b981' : record.status === 'Incomplete' ? '#f59e0b' : '#3b82f6'
                        }}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No attendance records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
