/**
 * File Name: StatusBadge.jsx
 * File Path: client/src/components/dashboard/StatusBadge.jsx
 * 
 * Component Description:
 * Universal, theme-aware Status Badge component used across data tables, punch cards, 
 * approvals, and user profiles. Maps statuses to clean visual badges with optional icons.
 * 
 * Data & Props Used:
 * - status (string): Status text (e.g. 'Present', 'Absent', 'Pending', 'Approved', 'Rejected', 'Active', 'Inactive', 'Half-day', 'Late')
 * - size (string): 'sm' | 'md' | 'lg' (default 'md')
 * - showDot (boolean): Show status pulse dot
 * - customLabel (string): Optional custom override label to show instead of status text
 * - className (string): Extra CSS classes
 * 
 * Responsiveness:
 * - Adapts cleanly to mobile tables, list items, and compact views
 * - High accessibility contrast in both light and dark modes
 * 
 * Component Usage:
 * - DataTable, AdminDashboard, ManagerDashboard, EmployeeDashboard, Approvals Page, Punch History
 */

import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertCircle, UserCheck, UserX } from 'lucide-react';

export default function StatusBadge({
  status = '',
  size = 'md',
  showDot = true,
  customLabel,
  className = ''
}) {
  const normalizedStatus = String(status || '').trim().toLowerCase();

  const getStatusConfig = (st) => {
    switch (st) {
      case 'present':
      case 'completed':
      case 'approved':
      case 'active':
        return {
          bg: 'rgba(16, 185, 129, 0.12)',
          color: '#10b981',
          border: 'rgba(16, 185, 129, 0.3)',
          icon: CheckCircle2,
          label: customLabel || status || 'Approved'
        };
      case 'pending':
      case 'incomplete':
      case 'on_hold':
      case 'processing':
        return {
          bg: 'rgba(245, 158, 11, 0.12)',
          color: '#d97706',
          border: 'rgba(245, 158, 11, 0.3)',
          icon: Clock,
          label: customLabel || status || 'Pending'
        };
      case 'absent':
      case 'rejected':
      case 'inactive':
      case 'failed':
      case 'cancelled':
        return {
          bg: 'rgba(239, 68, 68, 0.12)',
          color: '#ef4444',
          border: 'rgba(239, 68, 68, 0.3)',
          icon: XCircle,
          label: customLabel || status || 'Rejected'
        };
      case 'late':
      case 'half-day':
      case 'half_day':
      case 'warning':
        return {
          bg: 'rgba(139, 92, 246, 0.12)',
          color: '#8b5cf6',
          border: 'rgba(139, 92, 246, 0.3)',
          icon: AlertCircle,
          label: customLabel || status || 'Late'
        };
      default:
        return {
          bg: 'rgba(100, 116, 139, 0.12)',
          color: '#64748b',
          border: 'rgba(100, 116, 139, 0.3)',
          icon: Clock,
          label: customLabel || status || 'Unknown'
        };
    }
  };

  const config = getStatusConfig(normalizedStatus);
  const IconComponent = config.icon;

  const sizeStyles = {
    sm: { padding: '0.15rem 0.45rem', fontSize: '0.7rem', iconSize: 11, gap: '0.25rem' },
    md: { padding: '0.25rem 0.6rem', fontSize: '0.75rem', iconSize: 13, gap: '0.35rem' },
    lg: { padding: '0.35rem 0.8rem', fontSize: '0.85rem', iconSize: 15, gap: '0.45rem' }
  }[size] || sizeStyles.md;

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: sizeStyles.gap,
        padding: sizeStyles.padding,
        fontSize: sizeStyles.fontSize,
        fontWeight: 600,
        borderRadius: '9999px',
        backgroundColor: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
        whiteSpace: 'nowrap',
        lineHeight: 1
      }}
    >
      {showDot && (
        <span
          style={{
            width: sizeStyles.iconSize - 5,
            height: sizeStyles.iconSize - 5,
            borderRadius: '50%',
            backgroundColor: config.color,
            display: 'inline-block',
            flexShrink: 0
          }}
        />
      )}
      {IconComponent && <IconComponent size={sizeStyles.iconSize} style={{ flexShrink: 0 }} />}
      <span>{config.label}</span>
    </span>
  );
}