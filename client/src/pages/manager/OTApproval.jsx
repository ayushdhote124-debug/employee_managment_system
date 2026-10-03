/**
 * File Name: OTApproval.jsx
 * File Path: client/src/pages/manager/OTApproval.jsx
 * 
 * Component Description:
 * Overtime Claim Approval Page for Managers and Administrators.
 * Displays pending, approved, and rejected overtime requests with calculated pay multipliers,
 * employee details, claim reason, and quick inline approve/reject action buttons.
 * 
 * Data & Props Used:
 * - overtimeApi RTK Query: `useGetPendingOvertimeQuery`, `useUpdateOvertimeStatusMutation`
 * - Components: DataTable, StatusBadge, StatsCard, DashboardHeader
 * 
 * Responsiveness:
 * - Responsive filter tabs & search input
 * - Mobile horizontal scrolling table with touch action buttons
 * 
 * Component Usage:
 * - Route `/dashboard/manage-overtime` or `/manager/ot-approval`
 */

import React, { useState } from 'react';
import { Clock, CheckCircle2, XCircle, AlertCircle, FileText, Check, X } from 'lucide-react';
import { 
  useGetPendingOvertimeQuery, 
  useUpdateOvertimeStatusMutation 
} from '../../features/overtime/overtimeApi';
import DataTable from '../../components/dashboard/DataTable';
import StatusBadge from '../../components/dashboard/StatusBadge';
import StatsCard from '../../components/dashboard/StatsCard';
import DashboardHeader from '../../components/layout/DashboardHeader';
import Loader from '../../components/common/Loader';

export default function OTApproval() {
  const { data: overtimeData, isLoading, refetch } = useGetPendingOvertimeQuery();
  const [updateOvertimeStatus] = useUpdateOvertimeStatusMutation();

  const [activeTab, setActiveTab] = useState('Pending');

  const overtimeList = Array.isArray(overtimeData) ? overtimeData : overtimeData?.overtime || [];

  const filteredList = overtimeList.filter((item) => {
    if (activeTab === 'All') return true;
    return item.status === activeTab;
  });

  const handleAction = async (id, status) => {
    try {
      await updateOvertimeStatus({ id, status }).unwrap();
      refetch();
    } catch (err) {
      console.error('Failed to update overtime status:', err);
    }
  };

  const pendingCount = overtimeList.filter((o) => o.status === 'Pending').length;
  const approvedCount = overtimeList.filter((o) => o.status === 'Approved').length;
  const rejectedCount = overtimeList.filter((o) => o.status === 'Rejected').length;

  const columns = [
    {
      key: 'user',
      label: 'Employee',
      sortable: true,
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: '700', color: 'var(--text-main, #0f172a)' }}>
            {val?.name || row.userName || 'Employee'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)' }}>
            {val?.department || row.department || 'Staff'}
          </div>
        </div>
      )
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (val) => (val ? new Date(val).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : '-')
    },
    {
      key: 'hours',
      label: 'OT Hours',
      sortable: true,
      render: (val) => (
        <span style={{ fontWeight: '700', color: '#8b5cf6' }}>
          {val || 0} Hours
        </span>
      )
    },
    {
      key: 'reason',
      label: 'Reason for Claim',
      render: (val) => (
        <span style={{ fontSize: '0.85rem', color: 'var(--text-main, #334155)', maxWidth: '240px', display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {val || 'Project Deadlines'}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <StatusBadge status={val || 'Pending'} />
    }
  ];

  return (
    <div style={{ paddingBottom: '2.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <DashboardHeader />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main, #0f172a)' }}>
          Overtime Request Approvals
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted, #64748b)' }}>
          Review overtime hours logged by team members and approve or decline requests.
        </p>
      </div>

      {/* KPI Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem',
        marginBottom: '1.75rem'
      }}>
        <StatsCard title="Pending Claims" value={pendingCount} icon={Clock} color="#f59e0b" />
        <StatsCard title="Approved Claims" value={approvedCount} icon={CheckCircle2} color="#10b981" />
        <StatsCard title="Rejected Claims" value={rejectedCount} icon={XCircle} color="#ef4444" />
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1rem',
        overflowX: 'auto',
        paddingBottom: '0.25rem'
      }}>
        {['Pending', 'Approved', 'Rejected', 'All'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: '600',
              border: activeTab === tab ? 'none' : '1px solid var(--border-color, #cbd5e1)',
              backgroundColor: activeTab === tab ? '#8b5cf6' : 'var(--bg-card, #ffffff)',
              color: activeTab === tab ? '#ffffff' : 'var(--text-muted, #64748b)',
              cursor: 'pointer'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredList}
        isLoading={isLoading}
        searchPlaceholder="Search overtime claims by employee name or reason..."
        actions={(row) =>
          row.status === 'Pending' ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
              <button
                onClick={() => handleAction(row._id || row.id, 'Approved')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  borderRadius: '0.375rem',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <Check size={14} /> Approve
              </button>
              <button
                onClick={() => handleAction(row._id || row.id, 'Rejected')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  borderRadius: '0.375rem',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <X size={14} /> Decline
              </button>
            </div>
          ) : null
        }
      />
    </div>
  );
}