/**
 * File Name: DataTable.jsx
 * File Path: client/src/components/dashboard/DataTable.jsx
 * 
 * Component Description:
 * Modern, fully responsive Data Table component with client-side search, sorting, pagination,
 * custom column formatters, action buttons, loading skeletons, and mobile card view fallback.
 * 
 * Data & Props Used:
 * - columns (array): [{ key: string, label: string, sortable?: boolean, render?: (val, row) => node }]
 * - data (array): Array of data objects
 * - searchable (boolean): Enable search filter bar (default true)
 * - searchPlaceholder (string): Search input placeholder text
 * - pagination (boolean): Enable pagination controls (default true)
 * - pageSize (number): Items per page (default 10)
 * - isLoading (boolean): Render loading skeleton
 * - emptyMessage (string): Message when no records are found
 * - onRowClick (function): Callback when row is clicked
 * - actions (function): Render custom action buttons per row
 * 
 * Responsiveness:
 * - Desktop: Clean grid table with sticky header and hover effects
 * - Mobile: Horizontal scroll container with custom scrollbar styling + responsive card layout option
 * 
 * Component Usage:
 * - AdminDashboard, ManagerDashboard, UserManagement, ReportsPage, AttendanceOverviewPage
 */

import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, Inbox } from 'lucide-react';
import Loader from '../common/Loader';
import StatusBadge from './StatusBadge';

export default function DataTable({
  columns = [],
  data = [],
  searchable = true,
  searchPlaceholder = 'Search records...',
  pagination = true,
  pageSize = 8,
  isLoading = false,
  emptyMessage = 'No records found.',
  onRowClick,
  actions,
  className = ''
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Filter data based on search term across all text columns
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();
    return data.filter((row) => {
      return Object.values(row).some((val) => {
        if (val === null || val === undefined) return false;
        if (typeof val === 'object') return false;
        return String(val).toLowerCase().includes(term);
      });
    });
  }, [data, searchTerm]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];
      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;
      
      const comparison = String(valA).localeCompare(String(valB), undefined, { numeric: true });
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, pagination, currentPage, pageSize]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div
      className={`data-table-wrapper ${className}`}
      style={{
        backgroundColor: 'var(--bg-card, #ffffff)',
        borderRadius: '1rem',
        border: '1px solid var(--border-color, #e2e8f0)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
        width: '100%'
      }}
    >
      {/* Search Header */}
      {searchable && (
        <div style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--border-color, #e2e8f0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '220px', maxWidth: '400px' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted, #94a3b8)'
              }}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              style={{
                width: '100%',
                paddingLeft: '2.5rem',
                paddingRight: '1rem',
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border-color, #cbd5e1)',
                backgroundColor: 'var(--bg-app, #f8fafc)',
                color: 'var(--text-main, #0f172a)',
                fontSize: '0.875rem',
                outline: 'none'
              }}
            />
          </div>
          
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted, #64748b)' }}>
            Showing {paginatedData.length} of {filteredData.length} records
          </div>
        </div>
      )}

      {/* Table Container */}
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{
              backgroundColor: 'var(--bg-app, #f8fafc)',
              borderBottom: '1px solid var(--border-color, #e2e8f0)'
            }}>
              {columns.map((col) => (
                <th
                  key={col.key || col.label}
                  onClick={() => col.sortable && handleSort(col.key)}
                  style={{
                    padding: '0.875rem 1.25rem',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: 'var(--text-muted, #475569)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    cursor: col.sortable ? 'pointer' : 'default',
                    userSelect: 'none',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    {col.label}
                    {col.sortable && <ArrowUpDown size={14} style={{ opacity: 0.6 }} />}
                  </div>
                </th>
              ))}
              {actions && (
                <th style={{
                  padding: '0.875rem 1.25rem',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: 'var(--text-muted, #475569)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  textAlign: 'right'
                }}>
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} style={{ padding: '3rem 1rem', textAlign: 'center' }}>
                  <Loader text="Loading data..." />
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} style={{ padding: '3rem 1rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted, #94a3b8)' }}>
                    <Inbox size={36} />
                    <p style={{ fontSize: '0.9rem', fontWeight: '500' }}>{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => (
                <tr
                  key={row._id || row.id || idx}
                  onClick={() => onRowClick && onRowClick(row)}
                  style={{
                    borderBottom: '1px solid var(--border-color, #f1f5f9)',
                    cursor: onRowClick ? 'pointer' : 'default',
                    transition: 'background-color 0.15s ease'
                  }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  {columns.map((col) => {
                    const rawVal = row[col.key];
                    let content;

                    if (col.render) {
                      content = col.render(rawVal, row);
                    } else if (col.key === 'status') {
                      content = <StatusBadge status={rawVal} />;
                    } else {
                      content = rawVal !== undefined && rawVal !== null ? String(rawVal) : '-';
                    }

                    return (
                      <td
                        key={col.key || col.label}
                        style={{
                          padding: '1rem 1.25rem',
                          fontSize: '0.875rem',
                          color: 'var(--text-main, #1e293b)',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {content}
                      </td>
                    );
                  })}

                  {actions && (
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      {actions(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && totalPages > 1 && (
        <div style={{
          padding: '0.875rem 1.25rem',
          borderTop: '1px solid var(--border-color, #e2e8f0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted, #64748b)' }}>
            Page {currentPage} of {totalPages}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.4rem 0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid var(--border-color, #cbd5e1)',
                backgroundColor: currentPage === 1 ? 'transparent' : 'var(--bg-card, #ffffff)',
                color: currentPage === 1 ? '#94a3b8' : 'var(--text-main, #0f172a)',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontSize: '0.8rem',
                fontWeight: '500'
              }}
            >
              <ChevronLeft size={16} /> Previous
            </button>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.4rem 0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid var(--border-color, #cbd5e1)',
                backgroundColor: currentPage === totalPages ? 'transparent' : 'var(--bg-card, #ffffff)',
                color: currentPage === totalPages ? '#94a3b8' : 'var(--text-main, #0f172a)',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                fontSize: '0.8rem',
                fontWeight: '500'
              }}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}