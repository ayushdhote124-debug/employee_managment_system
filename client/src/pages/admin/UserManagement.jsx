/**
 * File Name: UserManagement.jsx
 * File Path: client/src/pages/admin/UserManagement.jsx
 * 
 * Component Description:
 * Admin User Management Page. Allows administrators to view all company employees,
 * filter by role/department/status, search by name/email, add new users via AddUserModal,
 * and view detailed profile cards or deactivate users.
 * 
 * Data & Props Used:
 * - userApi RTK Query: `useGetUsersQuery`, `useDeleteUserMutation`
 * - Components: DataTable, StatsCard, StatusBadge, AddUserModal, DashboardHeader
 * 
 * Responsiveness:
 * - Responsive statistics row at top
 * - Mobile-friendly horizontal scroll table with action buttons
 * - Responsive modal dialogs
 * 
 * Component Usage:
 * - Route `/dashboard/users` or `/admin/users`
 */

import React, { useState } from 'react';
import { Users, UserPlus, UserCheck, Shield, Filter, Plus } from 'lucide-react';
import { useGetUsersQuery, useDeleteUserMutation } from '../../features/users/userApi';
import DataTable from '../../components/dashboard/DataTable';
import StatusBadge from '../../components/dashboard/StatusBadge';
import StatsCard from '../../components/dashboard/StatsCard';
import AddUserModal from '../../components/users/AddUserModal';
import DashboardHeader from '../../components/layout/DashboardHeader';
import Loader from '../../components/common/Loader';

export default function UserManagement() {
  const { data: usersData, isLoading, refetch } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState('all');

  const usersList = Array.isArray(usersData) ? usersData : usersData?.users || [];

  // Filter users by role if selected
  const filteredUsers = usersList.filter((u) => {
    if (roleFilter === 'all') return true;
    return u.role === roleFilter;
  });

  const totalEmployees = usersList.filter((u) => u.role === 'employee').length;
  const totalManagers = usersList.filter((u) => u.role === 'manager').length;
  const totalAdmins = usersList.filter((u) => u.role === 'admin').length;

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to deactivate/delete this user?')) {
      try {
        await deleteUser(userId).unwrap();
        refetch();
      } catch (err) {
        console.error('Failed to delete user:', err);
      }
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Employee Name',
      sortable: true,
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '0.85rem'
          }}>
            {val ? val.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div style={{ fontWeight: '600', color: 'var(--text-main, #0f172a)' }}>{val || 'N/A'}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)' }}>{row.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (val) => (
        <span style={{
          textTransform: 'uppercase',
          fontSize: '0.75rem',
          fontWeight: '700',
          padding: '0.2rem 0.5rem',
          borderRadius: '9999px',
          backgroundColor: val === 'admin' ? 'rgba(239, 68, 68, 0.12)' : val === 'manager' ? 'rgba(139, 92, 246, 0.12)' : 'rgba(59, 130, 246, 0.12)',
          color: val === 'admin' ? '#ef4444' : val === 'manager' ? '#8b5cf6' : '#3b82f6'
        }}>
          {val}
        </span>
      )
    },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'designation', label: 'Designation', sortable: true },
    {
      key: 'isActive',
      label: 'Status',
      sortable: true,
      render: (val) => <StatusBadge status={val === false ? 'Inactive' : 'Active'} />
    }
  ];

  return (
    <div style={{ paddingBottom: '2.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <DashboardHeader />
      </div>

      {/* Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main, #0f172a)' }}>
            User Management
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted, #64748b)' }}>
            Manage organization employees, managers, administrative privileges, and credentials.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.25rem',
            borderRadius: '0.625rem',
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            fontWeight: '700',
            fontSize: '0.875rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
          }}
        >
          <Plus size={18} /> Add New User
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem',
        marginBottom: '1.75rem'
      }}>
        <StatsCard title="Total Users" value={usersList.length} icon={Users} color="#3b82f6" />
        <StatsCard title="Employees" value={totalEmployees} icon={UserCheck} color="#10b981" />
        <StatsCard title="Managers" value={totalManagers} icon={UserPlus} color="#8b5cf6" />
        <StatsCard title="Administrators" value={totalAdmins} icon={Shield} color="#ef4444" />
      </div>

      {/* Role Filter Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1rem',
        overflowX: 'auto',
        paddingBottom: '0.25rem'
      }}>
        {['all', 'employee', 'manager', 'admin'].map((role) => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            style={{
              padding: '0.4rem 0.9rem',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: '600',
              textTransform: 'capitalize',
              border: roleFilter === role ? 'none' : '1px solid var(--border-color, #cbd5e1)',
              backgroundColor: roleFilter === role ? '#3b82f6' : 'var(--bg-card, #ffffff)',
              color: roleFilter === role ? '#ffffff' : 'var(--text-muted, #64748b)',
              cursor: 'pointer'
            }}
          >
            {role === 'all' ? 'All Roles' : `${role}s`}
          </button>
        ))}
      </div>

      {/* Main Data Table */}
      <DataTable
        columns={columns}
        data={filteredUsers}
        isLoading={isLoading}
        searchPlaceholder="Search users by name, email, department..."
        actions={(row) => (
          <button
            onClick={() => handleDeleteUser(row._id || row.id)}
            style={{
              padding: '0.3rem 0.6rem',
              fontSize: '0.75rem',
              fontWeight: '600',
              borderRadius: '0.375rem',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Deactivate
          </button>
        )}
      />

      {/* Add User Modal */}
      {isAddModalOpen && (
        <AddUserModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            refetch();
          }}
        />
      )}
    </div>
  );
}