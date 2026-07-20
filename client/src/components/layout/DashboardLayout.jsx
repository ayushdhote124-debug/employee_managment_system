import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app-wrapper">
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="dashboard-layout">
        <Sidebar isSidebarOpen={isSidebarOpen} />
        <main className={`dashboard-main ${!isSidebarOpen ? 'collapsed' : ''}`}>
          <div className="dashboard-content">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
