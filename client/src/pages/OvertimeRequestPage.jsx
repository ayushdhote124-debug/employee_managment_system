/**
 * File Name: OvertimeRequestPage.jsx
 * File Path: client/src/pages/OvertimeRequestPage.jsx
 * 
 * Component Description:
 * Overtime Claim Submission Page for employees. Displays overtime claim form,
 * monthly overtime totals, interactive calendar overview, and overtime history log.
 */

import React, { useState } from 'react';
import { useSubmitOvertimeMutation, useGetMyOvertimeQuery } from '../features/overtime/overtimeApi';

export default function OvertimeRequestPage() {
  const [overtimeData, setOvertimeData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    hours: '',
    reason: ''
  });
  
  const [submitOvertime, { isLoading }] = useSubmitOvertimeMutation();
  const { data: overtimeRes, isLoading: isFetching } = useGetMyOvertimeQuery();
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setOvertimeData({ ...overtimeData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitOvertime(overtimeData).unwrap();
      setMessage('Overtime request submitted successfully.');
      setOvertimeData({ date: '', startTime: '', endTime: '', hours: '', reason: '' });
    } catch (err) {
      setMessage(err?.data?.message || 'Failed to submit request.');
    }
  };

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonthOvertime = overtimeRes?.overtimes?.filter(ot => {
    const otDate = new Date(ot.date);
    return otDate.getMonth() === currentMonth && 
           otDate.getFullYear() === currentYear &&
           ot.status === 'Approved';
  }) || [];

  const totalHoursThisMonth = thisMonthOvertime.reduce((sum, ot) => sum + (Number(ot.hours) || 0), 0);

  // Calendar generation logic
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const getHoursForDay = (day) => {
    if (!day) return null;
    const records = thisMonthOvertime.filter(ot => new Date(ot.date).getDate() === day);
    const total = records.reduce((sum, ot) => sum + Number(ot.hours), 0);
    return total > 0 ? total : null;
  };

  return (
    <div className="overtime-page">
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {/* Left Side: Submit Form */}
        <div className="widget" style={{ flex: '1 1 450px', margin: 0 }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Submit Overtime</h3>
          {message && (
            <div style={{ padding: '1rem', marginBottom: '1rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', borderRadius: '8px', fontWeight: 600 }}>
              {message}
            </div>
          )}
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group-clean">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-muted)' }}>Date</label>
              <input type="date" name="date" value={overtimeData.date} onChange={handleChange} required />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div className="form-group-clean" style={{ flex: '1 1 180px' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-muted)' }}>Start Time (Optional)</label>
                <input type="time" name="startTime" value={overtimeData.startTime} onChange={handleChange} />
              </div>
              <div className="form-group-clean" style={{ flex: '1 1 180px' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-muted)' }}>End Time (Optional)</label>
                <input type="time" name="endTime" value={overtimeData.endTime} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group-clean">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-muted)' }}>Total Hours</label>
              <input type="number" step="0.5" name="hours" value={overtimeData.hours} onChange={handleChange} required placeholder="e.g. 2.5" />
            </div>

            <div className="form-group-clean">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-muted)' }}>Reason / Task Details</label>
              <textarea name="reason" value={overtimeData.reason} onChange={handleChange} required rows="3" placeholder="Briefly describe the tasks completed..."></textarea>
            </div>

            <button type="submit" className="btn-action-base btn-primary-blue" disabled={isLoading} style={{ padding: '0.75rem 2rem', fontWeight: '600', alignSelf: 'flex-start' }}>
              {isLoading ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>

        {/* Right Side: Summary Card */}
        <div style={{ flex: '1 1 280px' }}>
          <div className="widget" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            height: '100%'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>This Month's Overtime</h3>
            <div style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1, margin: '0.5rem 0', color: '#3b82f6' }}>
              {totalHoursThisMonth}<span style={{ fontSize: '1.5rem', opacity: 0.8, marginLeft: '0.2rem' }}>h</span>
            </div>
            
            {/* Calendar Mini-view */}
            <div style={{ width: '100%', marginTop: '1rem', backgroundColor: 'var(--bg-app)', borderRadius: '12px', padding: '1rem', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                {calendarDays.map((day, idx) => {
                  const hours = getHoursForDay(day);
                  return (
                    <div key={idx} style={{ 
                      aspectRatio: '1', 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'center', 
                      justifyContent: 'center',
                      background: hours ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                      color: hours ? '#3b82f6' : 'var(--text-muted)',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      fontWeight: hours ? 'bold' : 'normal',
                      border: day && !hours ? '1px solid var(--border-color)' : (hours ? '1px solid #3b82f6' : 'none')
                    }}>
                      {day ? <span>{day}</span> : null}
                      {hours && <span style={{ fontSize: '0.65rem', color: '#3b82f6', marginTop: '-2px' }}>{hours}h</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="widget">
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>My Overtime History</h3>
        {isFetching ? <p style={{ color: 'var(--text-muted)' }}>Loading...</p> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Date</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Hours</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Reason</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {overtimeRes?.overtimes?.map((ot) => (
                  <tr key={ot._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', color: 'var(--text-main)' }}>{new Date(ot.date).toLocaleDateString()}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-main)' }}>{ot.hours}h</td>
                    <td style={{ padding: '1rem', color: 'var(--text-main)' }}>{ot.reason}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '12px', 
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        background: ot.status === 'Approved' ? 'rgba(16, 185, 129, 0.15)' : (ot.status === 'Rejected' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)'),
                        color: ot.status === 'Approved' ? '#10b981' : (ot.status === 'Rejected' ? '#ef4444' : '#f59e0b')
                      }}>
                        {ot.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
