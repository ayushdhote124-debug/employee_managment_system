/**
 * File Name: Sidebar.jsx
 * File Path: client/src/components/common/Sidebar.jsx
 * 
 * Component Description:
 * Reusable role-aware navigation sidebar. Supports Admin, Manager, and Employee routes.
 * Features collapsible states, active tab highlights, mobile sliding backdrop overlay,
 * and quick logout trigger.
 * 
 * Data & Props Used:
 * - Redux State: auth.user (role = 'admin' | 'manager' | 'employee')
 * - isOpen (boolean): Controls mobile drawer visibility
 * - onClose (function): Mobile drawer backdrop click dismiss
 * - isCollapsed (boolean): Mini desktop sidebar state
 * - toggleCollapse (function): Toggle mini vs expanded sidebar
 * 
 * Responsiveness:
 * - Desktop: Fixed sidebar with collapse/expand toggle
 * - Mobile: Sliding drawer from left with dark backdrop blur
 * 
 * Component Usage:
 * - DashboardLayout, Standalone Admin/Manager/Employee Page Wrappers
 */

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Clock,
  CalendarCheck,
  FileSpreadsheet,
  Users,
  ShieldCheck,
  BarChart3,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckSquare
} from 'lucide-react';
import { logout } from '../../features/auth/authSlice';

export default function Sidebar({
  isOpen = false,
  onClose,
  isCollapsed = false,
  toggleCollapse
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const role = user?.role || 'employee';

  const navItemsByRole = {
    employee: [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
      { path: '/dashboard/attendance', label: 'Clock In / Out', icon: Clock },
      { path: '/dashboard/leave', label: 'Leave Requests', icon: CalendarCheck },
      { path: '/dashboard/overtime', label: 'Overtime Claim', icon: FileSpreadsheet },
      { path: '/dashboard/reports', label: 'My Reports', icon: BarChart3 },
      { path: '/dashboard/profile', label: 'My Profile', icon: User }
    ],
    manager: [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
      { path: '/dashboard/attendance', label: 'My Clock In/Out', icon: Clock },
      { path: '/dashboard/team-attendance', label: 'Team Attendance', icon: Users },
      { path: '/dashboard/leave-requests', label: 'Leave Approvals', icon: CalendarCheck },
      { path: '/dashboard/manage-overtime', label: 'OT Approvals', icon: CheckSquare },
      { path: '/dashboard/team-members', label: 'Team Roster', icon: Users },
      { path: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
      { path: '/dashboard/profile', label: 'Profile', icon: User }
    ],
    admin: [
      { path: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
      { path: '/dashboard/users', label: 'User Management', icon: Users },
      { path: '/dashboard/attendance-overview', label: 'Attendance Audit', icon: ShieldCheck },
      { path: '/dashboard/leave-management', label: 'Leave Center', icon: CalendarCheck },
      { path: '/dashboard/overtime-management', label: 'Overtime Center', icon: FileSpreadsheet },
      { path: '/dashboard/reports', label: 'Analytics & Reports', icon: BarChart3 },
      { path: '/dashboard/profile', label: 'Admin Profile', icon: User }
    ]
  };

  const navItems = navItemsByRole[role] || navItemsByRole.employee;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 45
          }}
          className="lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        style={{
          width: isCollapsed ? '80px' : '260px',
          backgroundColor: 'var(--bg-card, #ffffff)',
          borderRight: '1px solid var(--border-color, #e2e8f0)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'fixed',
          top: '70px',
          bottom: 0,
          left: 0,
          zIndex: 48,
          boxShadow: '2px 0 10px rgba(0,0,0,0.03)'
        }}
        className={`sidebar-nav ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Navigation Items */}
        <div style={{ padding: '1.25rem 0.75rem', overflowY: 'auto', flex: 1 }}>
          <div style={{ marginBottom: '1.5rem', padding: '0 0.5rem' }}>
            {!isCollapsed && (
              <span style={{
                fontSize: '0.7rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                color: 'var(--text-muted, #94a3b8)',
                letterSpacing: '0.08em'
              }}>
                Navigation ({role})
              </span>
            )}
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    padding: isCollapsed ? '0.75rem' : '0.75rem 1rem',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    borderRadius: '0.625rem',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? '600' : '500',
                    color: isActive ? '#ffffff' : 'var(--text-main, #334155)',
                    backgroundColor: isActive ? 'var(--blue-accent, #3b82f6)' : 'transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                    boxShadow: isActive ? '0 4px 12px rgba(59, 130, 246, 0.25)' : 'none'
                  }}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon size={20} style={{ flexShrink: 0 }} />
                  {!isCollapsed && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Quick Logout & Collapse Toggle */}
        <div style={{
          padding: '1rem 0.75rem',
          borderTop: '1px solid var(--border-color, #e2e8f0)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          {toggleCollapse && (
            <button
              onClick={toggleCollapse}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'space-between',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border-color, #e2e8f0)',
                backgroundColor: 'var(--bg-app, #f8fafc)',
                color: 'var(--text-muted, #64748b)',
                fontSize: '0.75rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
              className="hidden lg:flex"
            >
              {!isCollapsed && <span>Collapse Sidebar</span>}
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          )}

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: isCollapsed ? '0.75rem' : '0.75rem 1rem',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              borderRadius: '0.625rem',
              border: 'none',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              color: '#ef4444',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
            title="Sign Out"
          >
            <LogOut size={18} />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}