import React from 'react';
import { Navigate } from 'react-router-dom';

export default function RoleRoute({ role, children }) {
  // Get user role from localStorage
  const userRole = localStorage.getItem('userRole');

  // If no role is set, redirect to login
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  // If role doesn't match required role, redirect to appropriate page
  if (role === 'admin' && userRole !== 'admin') {
    return <Navigate to="/player" replace />;
  }

  if (role === 'player' && userRole !== 'player') {
    return <Navigate to="/admin" replace />;
  }

  // If role matches, render the protected component
  return children;
}
