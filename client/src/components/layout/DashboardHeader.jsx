import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function DashboardHeader() {
  const { user } = useSelector((state) => state.auth);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US');
  };

  return (
    <div className="dashboard-welcome-card">
      <div className="welcome-content">
        <h2>{getGreeting()}, <span className="highlight-name">{user?.name || 'User'}</span> 👋</h2>
        <p className="welcome-subtitle">Welcome back! Hope you have a productive day.</p>
        <div className="welcome-datetime">
          <span className="date">📅 {formatDate(currentTime)}</span>
          <span className="time">🕚 {formatTime(currentTime)}</span>
        </div>
      </div>
      <div className="role-badge-container">
        <span className={`role-badge role-${user?.role || 'employee'}`}>
          {user?.role === 'admin' ? '👨‍💼 ADMIN' : user?.role === 'manager' ? '👔 MANAGER' : '🧑‍💻 EMPLOYEE'}
        </span>
      </div>
    </div>
  );
}
