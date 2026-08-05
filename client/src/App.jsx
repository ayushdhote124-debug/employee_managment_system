import React, { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes.jsx';
import './theme.css'; // Import dark theme styles

function App() {
  useEffect(() => {
    // Check local storage for theme preference on app load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
    }
  }, []);

  return <AppRoutes />;
}

export default App;
