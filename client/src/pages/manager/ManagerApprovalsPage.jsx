import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGetPendingLeavesQuery, useUpdateLeaveStatusMutation } from '../../features/leave/leaveApi';
import { useGetPendingOvertimeQuery, useUpdateOvertimeStatusMutation } from '../../features/overtime/overtimeApi';

export default function ManagerApprovalsPage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('leave');

  useEffect(() => {
    if (location.pathname.includes('overtime')) {
      setActiveTab('overtime');
    } else {
      setActiveTab('leave');
    }
  }, [location.pathname]);
  
  const { data: leaveData, isLoading: loadingLeaves } = useGetPendingLeavesQuery();
  const { data: otData, isLoading: loadingOT } = useGetPendingOvertimeQuery();
  
  const [updateLeave] = useUpdateLeaveStatusMutation();
  const [updateOT] = useUpdateOvertimeStatusMutation();

  const handleApproveLeave = async (id) => {
    try {
      await updateLeave({ id, status: 'Approved' }).unwrap();
    } catch (err) {
      alert('Failed to approve leave');
    }
  };

  const handleRejectLeave = async (id) => {
    try {
      await updateLeave({ id, status: 'Rejected' }).unwrap();
    } catch (err) {
      alert('Failed to reject leave');
    }
  };

  const handleApproveOT = async (id) => {
    try {
      await updateOT({ id, status: 'Approved' }).unwrap();
    } catch (err) {
      alert('Failed to approve overtime');
    }
  };

  const handleRejectOT = async (id) => {
    try {
      await updateOT({ id, status: 'Rejected' }).unwrap();
    } catch (err) {
      alert('Failed to reject overtime');
    }
  };

  return (
    <div className="approvals-page">
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Pending Approvals</h2>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          className="tab-btn"
          onClick={() => setActiveTab('leave')}
          style={{
            padding: '0.75rem 1.5rem',
            background: activeTab === 'leave' ? '#3b82f6' : '#fff',
            color: activeTab === 'leave' ? '#fff' : '#64748b',
            border: activeTab === 'leave' ? 'none' : '1px solid #e2e8f0',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Leave Requests ({leaveData?.leaves?.length || 0})
        </button>
        <button 
          className="tab-btn"
          onClick={() => setActiveTab('overtime')}
          style={{
            padding: '0.75rem 1.5rem',
            background: activeTab === 'overtime' ? '#3b82f6' : '#fff',
            color: activeTab === 'overtime' ? '#fff' : '#64748b',
            border: activeTab === 'overtime' ? 'none' : '1px solid #e2e8f0',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Overtime Requests ({otData?.overtime?.length || 0})
        </button>
      </div>

      <div className="widget" style={{ padding: '0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '1rem', color: '#64748b' }}>Employee</th>
              <th style={{ padding: '1rem', color: '#64748b' }}>Details</th>
              <th style={{ padding: '1rem', color: '#64748b' }}>Date</th>
              <th style={{ padding: '1rem', color: '#64748b' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activeTab === 'leave' && (
              loadingLeaves ? (
                <tr><td colSpan="4" style={{ padding: '1rem', textAlign: 'center' }}>Loading leaves...</td></tr>
              ) : leaveData?.leaves?.length === 0 ? (
                <tr><td colSpan="4" style={{ padding: '1rem', textAlign: 'center' }}>No pending leave requests.</td></tr>
              ) : (
                leaveData?.leaves?.map(leave => (
                  <tr key={leave._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: '600', color: '#1e293b' }}>{leave.employee?.name}</div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{leave.leaveType} Leave</div>
                    </td>
                    <td style={{ padding: '1rem' }}>{leave.reason}</td>
                    <td style={{ padding: '1rem' }}>
                      {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className="btn-action-base btn-success"
                        onClick={() => handleApproveLeave(leave._id)}
                      >
                        Approve
                      </button>
                      <button 
                        className="btn-action-base btn-danger"
                        onClick={() => handleRejectLeave(leave._id)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )
            )}

            {activeTab === 'overtime' && (
              loadingOT ? (
                <tr><td colSpan="4" style={{ padding: '1rem', textAlign: 'center' }}>Loading overtime...</td></tr>
              ) : otData?.overtime?.length === 0 ? (
                <tr><td colSpan="4" style={{ padding: '1rem', textAlign: 'center' }}>No pending overtime requests.</td></tr>
              ) : (
                otData?.overtime?.map(ot => (
                  <tr key={ot._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: '600', color: '#1e293b' }}>{ot.employee?.name}</div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{ot.hours} Hours</div>
                    </td>
                    <td style={{ padding: '1rem' }}>{ot.reason}</td>
                    <td style={{ padding: '1rem' }}>{new Date(ot.date).toLocaleDateString()}</td>
                    <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className="btn-action-base btn-success"
                        onClick={() => handleApproveOT(ot._id)}
                      >
                        Approve
                      </button>
                      <button 
                        className="btn-action-base btn-danger"
                        onClick={() => handleRejectOT(ot._id)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
