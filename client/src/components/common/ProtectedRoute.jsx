import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    // Redirect to landing page (which has login/register forms) if not logged in
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user's role is not authorized, redirect to their default home/dashboard
    return <Navigate to="/" replace />;
  }

  return children;
}