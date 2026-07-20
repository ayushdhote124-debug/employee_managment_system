import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logOut } from '../../features/auth/authSlice';
import { Home, Clock, Users, Shield, LogOut, FileText, BarChart2 } from 'lucide-react';

export default function Sidebar({ isSidebarOpen }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logOut());
  };

  const renderLinks = () => {
    if (!user) return null;

    const commonLinks = (
      <>
        <li>
          <NavLink to="/dashboard" end className={({ isActive }) => (isActive ? 'active-link' : '')}>
            <Home size={20} />
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/reports" className={({ isActive }) => (isActive ? 'active-link' : '')}>
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
            {commonLinks}
            <li>
              <NavLink to="/dashboard/attendance" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                <Clock size={20} />
                <span>My Attendance</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/leave" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                <FileText size={20} />
                <span>Leave Requests</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/overtime" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                <FileText size={20} />
                <span>Overtime Requests</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/profile" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                <Shield size={20} />
                <span>Profile</span>
              </NavLink>
            </li>
          </>
        );
      case 'manager':
        return (
          <>
            <li>
              <NavLink to="/dashboard" end className={({ isActive }) => (isActive ? 'active-link' : '')}>
                <Home size={20} />
                <span>Dashboard</span>
              </NavLink>
            </li>
            
            {/* Manager Personal Links */}
            <li>
              <NavLink to="/dashboard/attendance" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                <Clock size={20} />
                <span>My Attendance</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/leave" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                <FileText size={20} />
                <span>My Leaves</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/overtime" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                <FileText size={20} />
                <span>My Overtime</span>
              </NavLink>
            </li>

            {/* Team Management Links */}
            <li>
              <NavLink to="/dashboard/team-attendance" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                <Users size={20} />
                <span>Team Attendance</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/leave-requests" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                <FileText size={20} />
                <span>Leave Requests</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/manage-overtime" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                <Clock size={20} />
                <span>Manage Overtime</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/team-members" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                <Users size={20} />
                <span>Team Members</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/reports" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                <BarChart2 size={20} />
                <span>Reports</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/profile" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                <Shield size={20} />
                <span>Profile</span>
              </NavLink>
            </li>
          </>
        );
      case 'admin':
        return (
          <>
            <li>
              <NavLink to="/dashboard" end className={({ isActive }) => (isActive ? 'active-link' : '')}>
                <Home size={20} />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/users" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                <Users size={20} />
                <span>Users</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/attendance-overview" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                <Clock size={20} />
                <span>Attendance</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/leave-management" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                <FileText size={20} />
                <span>Leave Management</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/overtime-management" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                <Clock size={20} />
                <span>Overtime</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/reports" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                <BarChart2 size={20} />
                <span>Reports</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/profile" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                <Shield size={20} />
                <span>Profile</span>
              </NavLink>
            </li>
          </>
        );
      default:
        return commonLinks;
    }
  };

  return (
    <aside className={`sidebar ${!isSidebarOpen ? 'collapsed' : 'mobile-open'}`}>
      <div className="sidebar-header">
        <div className="logo-box">EMS</div>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {renderLinks()}
        </ul>
      </nav>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
