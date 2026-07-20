import React, { useState } from 'react';
import { useGetAttendanceReportsQuery } from '../features/reports/reportsApi';
import { FileText, Download, BarChart2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

export default function ReportsPage() {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: 'All'
  });

  const { data, isLoading, error } = useGetAttendanceReportsQuery(filters);

  if (isLoading) return <div style={{ padding: '2rem' }}>Loading reports data...</div>;
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

  const chartData = Object.values(dateMap).slice(0, 10).reverse(); // Last 10 days for chart

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Attendance Report', 14, 15);
    
    const tableColumn = ["Date", "Employee", "Punch In", "Punch Out", "Hours", "Status"];
    const tableRows = [];

    records.forEach(record => {
      const rowData = [
        new Date(record.attendanceDate).toLocaleDateString(),
        record.employee?.name || 'Unknown',
        record.punchIn ? new Date(record.punchIn).toLocaleTimeString() : '-',
        record.punchOut ? new Date(record.punchOut).toLocaleTimeString() : '-',
        record.workingHours || 0,
        record.status
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    
    doc.save(`attendance_report_${new Date().getTime()}.pdf`);
  };

  const exportExcel = () => {
    const exportData = records.map(record => ({
      Date: new Date(record.attendanceDate).toLocaleDateString(),
      Employee: record.employee?.name || 'Unknown',
      Role: record.employee?.role || 'Unknown',
      'Punch In': record.punchIn ? new Date(record.punchIn).toLocaleTimeString() : '-',
      'Punch Out': record.punchOut ? new Date(record.punchOut).toLocaleTimeString() : '-',
      'Working Hours': record.workingHours || 0,
      Status: record.status
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Report");
    XLSX.writeFile(workbook, `attendance_report_${new Date().getTime()}.xlsx`);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>System Reports</h2>
          <p style={{ color: 'var(--text-muted)' }}>Generate and download attendance reports</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
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
      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-end', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '500' }}>Start Date</label>
          <input 
            type="date" 
            className="input-field"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '500' }}>End Date</label>
          <input 
            type="date" 
            className="input-field"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          />
        </div>
        <div style={{ flex: 1 }}>
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
        <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <BarChart2 size={24} color="#3b82f6" />
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>Recent Attendance Trends</h3>
          </div>
          
          <div style={{ width: '100%', height: 350 }}>
            {chartData.length > 0 ? (
              <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
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
        <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', overflowX: 'auto' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Recent Records Preview</h3>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '1rem', color: '#64748b' }}>Date</th>
                <th style={{ padding: '1rem', color: '#64748b' }}>Employee</th>
                <th style={{ padding: '1rem', color: '#64748b' }}>Punch In</th>
                <th style={{ padding: '1rem', color: '#64748b' }}>In-Selfie & Loc</th>
                <th style={{ padding: '1rem', color: '#64748b' }}>Punch Out</th>
                <th style={{ padding: '1rem', color: '#64748b' }}>Out-Selfie & Loc</th>
                <th style={{ padding: '1rem', color: '#64748b' }}>Hours</th>
                <th style={{ padding: '1rem', color: '#64748b' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.slice(0, 5).map((record, idx) => (
                <tr key={record._id || idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '1rem' }}>{new Date(record.attendanceDate).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>
                    {record.employee?._id ? (
                      <Link 
                        to={`/dashboard/users/${record.employee._id}`}
                        style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}
                        onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                        onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                      >
                        {record.employee?.name}
                      </Link>
                    ) : (
                      <span>{record.employee?.name || 'Unknown'}</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem' }}>{record.punchIn ? new Date(record.punchIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}</td>
                  <td style={{ padding: '1rem' }}>
                    {record.checkInSelfie && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <a href={record.checkInSelfie} target="_blank" rel="noopener noreferrer">
                          <img src={record.checkInSelfie} alt="Punch In" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #e2e8f0' }} />
                        </a>
                        {record.checkInLatitude && record.checkInLongitude && (
                          <a href={`https://maps.google.com/?q=${record.checkInLatitude},${record.checkInLongitude}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: '#3b82f6', textDecoration: 'none' }}>
                            View Map
                          </a>
                        )}
                      </div>
                    )}
                    {!record.checkInSelfie && <span style={{ color: '#94a3b8' }}>-</span>}
                  </td>
                  <td style={{ padding: '1rem' }}>{record.punchOut ? new Date(record.punchOut).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}</td>
                  <td style={{ padding: '1rem' }}>
                    {record.checkOutSelfie && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <a href={record.checkOutSelfie} target="_blank" rel="noopener noreferrer">
                          <img src={record.checkOutSelfie} alt="Punch Out" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #e2e8f0' }} />
                        </a>
                        {record.checkOutLatitude && record.checkOutLongitude && (
                          <a href={`https://maps.google.com/?q=${record.checkOutLatitude},${record.checkOutLongitude}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: '#3b82f6', textDecoration: 'none' }}>
                            View Map
                          </a>
                        )}
                      </div>
                    )}
                    {!record.checkOutSelfie && <span style={{ color: '#94a3b8' }}>-</span>}
                  </td>
                  <td style={{ padding: '1rem' }}>{record.workingHours || 0}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '99px', 
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      backgroundColor: record.status === 'Completed' ? '#d1fae5' : '#fef3c7',
                      color: record.status === 'Completed' ? '#065f46' : '#92400e'
                    }}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {records.length > 5 && (
            <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Showing 5 of {records.length} records. Download PDF/Excel for full report.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}