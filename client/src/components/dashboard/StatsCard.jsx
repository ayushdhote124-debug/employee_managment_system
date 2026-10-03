/**
 * File Name: StatsCard.jsx
 * File Path: client/src/components/dashboard/StatsCard.jsx
 * 
 * Component Description:
 * Reusable, modern KPI Statistics Card component for dashboards. Displays metrics, icons, 
 * trends (percentage increase/decrease), subtitles, and custom color accents.
 * 
 * Data & Props Used:
 * - title (string): Metric label (e.g. "Total Employees", "Pending Overtime")
 * - value (string | number): Metric value to highlight
 * - icon (React element / Lucide icon): Visual indicator icon
 * - color (string): Accent color hex/hsl for icon background & border
 * - change (object): { value: string|number, isPositive: boolean, label: string } for trend badges
 * - subtitle (string): Extra contextual description
 * - onClick (function): Optional click handler for navigating or opening modal
 * - className (string): Additional custom CSS classes
 * 
 * Responsiveness:
 * - Flexible flex/grid card structure with responsive font sizes
 * - Supports touch interactions on mobile devices
 * - Dark mode compliant with adaptive background and text contrast
 * 
 * Component Usage:
 * - AdminDashboard, ManagerDashboard, EmployeeDashboard, UserManagement, ReportsPage
 */

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatsCard({
  title,
  value,
  icon: Icon,
  color = '#3b82f6',
  change,
  subtitle,
  onClick,
  className = ''
}) {
  const isClickable = typeof onClick === 'function';

  return (
    <div
      onClick={isClickable ? onClick : undefined}
      className={`stat-card-modern ${isClickable ? 'cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5' : ''} ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.25rem',
        borderRadius: '1rem',
        backgroundColor: 'var(--bg-card, #ffffff)',
        border: '1px solid var(--border-color, #e2e8f0)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        transition: 'all 0.2s ease-in-out',
        cursor: isClickable ? 'pointer' : 'default',
        width: '100%'
      }}
    >
      <div style={{ flex: '1', minWidth: 0, paddingRight: '0.75rem' }}>
        <h4 style={{
          color: 'var(--text-muted, #64748b)',
          fontSize: '0.85rem',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '0.35rem',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {title}
        </h4>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            color: 'var(--text-main, #0f172a)',
            lineHeight: '1.2'
          }}>
            {value !== undefined && value !== null ? value : 0}
          </span>

          {change && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.15rem',
              fontSize: '0.75rem',
              fontWeight: '600',
              padding: '0.15rem 0.4rem',
              borderRadius: '9999px',
              backgroundColor: change.isPositive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              color: change.isPositive ? '#10b981' : '#ef4444'
            }}>
              {change.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {change.value}
              {change.label ? ` ${change.label}` : ''}
            </span>
          )}
        </div>

        {subtitle && (
          <p style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted, #64748b)',
            marginTop: '0.25rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {subtitle}
          </p>
        )}
      </div>

      {Icon && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '52px',
          height: '52px',
          borderRadius: '12px',
          backgroundColor: `${color}15`,
          color: color,
          flexShrink: 0
        }}>
          {typeof Icon === 'function' || typeof Icon === 'object' ? (
            React.isValidElement(Icon) ? Icon : <Icon size={26} />
          ) : null}
        </div>
      )}
    </div>
  );
}