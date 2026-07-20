import React, { useState } from 'react';
import { useApplyLeaveMutation, useGetMyLeavesQuery } from '../features/leave/leaveApi';

export default function LeaveRequestPage() {
  const [leaveData, setLeaveData] = useState({
    startDate: '',
    endDate: '',
    leaveType: 'Sick Leave',
    reason: ''
  });
  
  const [applyLeave, { isLoading }] = useApplyLeaveMutation();
  const { data: leavesData, isLoading: isFetching } = useGetMyLeavesQuery();
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setLeaveData({ ...leaveData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await applyLeave(leaveData).unwrap();
      setMessage('Leave request submitted successfully.');
      setLeaveData({ startDate: '', endDate: '', leaveType: 'Sick Leave', reason: '' });
    } catch (err) {
      setMessage(err?.data?.message || 'Failed to submit request.');
    }
  };

  return (
    <div className="leave-page">
      <div className="widget" style={{ maxWidth: '600px', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Apply for Leave</h3>
        {message && <div style={{ padding: '1rem', marginBottom: '1rem', background: '#dcfce7', color: '#166534', borderRadius: '8px' }}>{message}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group-clean">
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#475569' }}>Leave Type</label>
            <select name="leaveType" value={leaveData.leaveType} onChange={handleChange} required>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Annual Leave">Annual Leave</option>
              <option value="Unpaid Leave">Unpaid Leave</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group-clean" style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#475569' }}>Start Date</label>
              <input type="date" name="startDate" value={leaveData.startDate} onChange={handleChange} required />
            </div>
            <div className="form-group-clean" style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#475569' }}>End Date</label>
              <input type="date" name="endDate" value={leaveData.endDate} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group-clean">
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#475569' }}>Reason</label>
            <textarea name="reason" value={leaveData.reason} onChange={handleChange} required rows="3" placeholder="Briefly describe the reason..."></textarea>
          </div>

          <button type="submit" className="btn-action-base btn-primary-blue" disabled={isLoading} style={{ padding: '0.75rem 2rem', fontWeight: '600', alignSelf: 'flex-start' }}>
            {isLoading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>

      <div className="widget">
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>My Leave History</h3>
        {isFetching ? <p>Loading...</p> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem' }}>Type</th>
                  <th style={{ padding: '1rem' }}>From</th>
                  <th style={{ padding: '1rem' }}>To</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {leavesData?.leaves?.map((leave) => (
                  <tr key={leave._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '1rem' }}>{leave.leaveType}</td>
                    <td style={{ padding: '1rem' }}>{new Date(leave.startDate).toLocaleDateString()}</td>
                    <td style={{ padding: '1rem' }}>{new Date(leave.endDate).toLocaleDateString()}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '12px', 
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        background: leave.status === 'Approved' ? '#dcfce7' : (leave.status === 'Rejected' ? '#fee2e2' : '#fef3c7'),
                        color: leave.status === 'Approved' ? '#166534' : (leave.status === 'Rejected' ? '#991b1b' : '#b45309')
                      }}>
                        {leave.status}
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
