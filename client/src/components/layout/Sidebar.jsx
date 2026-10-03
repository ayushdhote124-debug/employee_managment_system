/**
 * File Name: Sidebar.jsx
 * File Path: client/src/components/layout/Sidebar.jsx
 * 
 * Component Description:
 * Modern responsive Sidebar navigation for Employee Attendance System.
 * Supports role-based links for Admin, Manager, and Employee users.
 * Automatically handles mobile drawer closing on link tap and desktop collapse mode.
 */

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import {
  Home,
  Clock,
  Users,
  Shield,
  LogOut,
  FileText,
  BarChart2,
  CalendarCheck,
  CheckSquare,
  X,
  UserCheck,
  User
} from 'lucide-react';

export default function Sidebar({
  isSidebarOpen,
  isMobileOpen,
  closeMobileSidebar,
  isCollapsed
}) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    if (closeMobileSidebar) closeMobileSidebar();
    navigate('/');
  };

  const handleLinkClick = () => {
    if (closeMobileSidebar) {
      closeMobileSidebar();
    }
  };

  const renderLinks = () => {
    if (!user) return null;

    const commonLinks = (
      <>
        <li>
          <NavLink
            to="/dashboard"
            end
            onClick={handleLinkClick}
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            <Home size={20} />
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/reports"
            onClick={handleLinkClick}
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            <BarChart2 size={20} />
            <span>Reports</span>
          </NavLink>
        </li>
      </>
    );

    switch (user.role) {
      case 'employee':
        return (
          <>
            <li>
              <NavLink
                to="/dashboard"
                end
                onClick={handleLinkClick}
                className={({ isActive }) => (isActive ? 'active-link' : '')}
              >
                <Home size={20} />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/attendance"
                onClick={handleLinkClick}
                className={({ isActive }) => (isActive ? 'active-link' : '')}
              >
                <Clock size={20} />
                <span>My Attendance</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/leave"
                onClick={handleLinkClick}
                className={({ isActive }) => (isActive ? 'active-link' : '')}
              >
                <CalendarCheck size={20} />
                <span>Leave Requests</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/overtime"
                onClick={handleLinkClick}
                className={({ isActive }) => (isActive ? 'active-link' : '')}
              >
                <FileText size={20} />
                <span>Overtime Claims</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/reports"
                onClick={handleLinkClick}
                className={({ isActive }) => (isActive ? 'active-link' : '')}
              >
                <BarChart2 size={20} />
                <span>Reports</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/profile"
                onClick={handleLinkClick}
                className={({ isActive }) => (isActive ? 'active-link' : '')}
              >
                <User size={20} />
                <span>Profile</span>
              </NavLink>
            </li>
          </>
        );

      case 'manager':
        return (
          <>
            <li>
              <NavLink
                to="/dashboard"
                end
                onClick={handleLinkClick}
                className={({ isActive }) => (isActive ? 'active-link' : '')}
              >
                <Home size={20} />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/attendance"
                onClick={handleLinkClick}
                className={({ isActive }) => (isActive ? 'active-link' : '')}
              >
                <Clock size={20} />
                <span>My Attendance</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/leave"
                onClick={handleLinkClick}
                className={({ isActive }) => (isActive ? 'active-link' : '')}
              >
                <CalendarCheck size={20} />
                <span>My Leaves</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/overtime"
                onClick={handleLinkClick}
                className={({ isActive }) => (isActive ? 'active-link' : '')}
              >
                <FileText size={20} />
                <span>My Overtime</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/team-attendance"
                onClick={handleLinkClick}
                className={({ isActive }) => (isActive ? 'active-link' : '')}
              >
                <Users size={20} />
                <span>Team Attendance</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/leave-requests"
                onClick={handleLinkClick}
                className={({ isActive }) => (isActive ? 'active-link' : '')}
              >
                <CheckSquare size={20} />
                <span>Leave Approvals</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/manage-overtime"
                onClick={handleLinkClick}
                className={({ isActive }) => (isActive ? 'active-link' : '')}
              >
                <Clock size={20} />
                <span>OT Approvals</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/team-members"
                onClick={handleLinkClick}
                className={({ isActive }) => (isActive ? 'active-link' : '')}
              >
                <UserCheck size={20} />
                <span>Team Members</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/reports"
                onClick={handleLinkClick}
                className={({ isActive }) => (isActive ? 'active-link' : '')}
              >
                <BarChart2 size={20} />
                <span>Reports</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/profile"
                onClick={handleLinkClick}
                className={({ isActive }) => (isActive ? 'active-link' : '')}
              >
                <User size={20} />
                <span>Profile</span>
              </NavLink>
            </li>
          </>
        );

      case 'admin':
        return (
          <>
            <li>
              <NavLink
                to="/dashboard"
                end
                onClick={handleLinkClick}
                className={({ isActive }) => (isActive ? 'active-link' : '')}
              >
                <Home size={20} />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/users"
                onClick={handleLinkClick}
                className={({ isActive }) => (isActive ? 'active-link' : '')}
              >
                <Users size={20} />
                <span>Users</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/attendance-overview"
                onClick={handleLinkClick}
                className={({ isActive }) => (isActive ? 'active-link' : '')}
              >
                <Clock size={20} />
                <span>Attendance Audit</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/leave-management"
                onClick={handleLinkClick}
                className={({ isActive }) => (isActive ? 'active-link' : '')}
              >
                <CalendarCheck size={20} />
                <span>Leave Center</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/overtime-management"
                onClick={handleLinkClick}
                className={({ isActive }) => (isActive ? 'active-link' : '')}
              >
                <FileText size={20} />
                <span>Overtime Center</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/reports"
                onClick={handleLinkClick}
                className={({ isActive }) => (isActive ? 'active-link' : '')}
              >
                <BarChart2 size={20} />
                <span>Reports</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/profile"
                onClick={handleLinkClick}
                className={({ isActive }) => (isActive ? 'active-link' : '')}
              >
                <Shield size={20} />
                <span>Admin Profile</span>
              </NavLink>
            </li>
          </>
        );

      default:
        return commonLinks;
    }
  };

  const sidebarClasses = [
    'sidebar',
    isMobileOpen ? 'mobile-open' : '',
    isCollapsed ? 'collapsed' : ''
  ].filter(Boolean).join(' ');

  return (
    <aside className={sidebarClasses}>
      <nav className="sidebar-nav">
        <ul>{renderLinks()}</ul>
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
