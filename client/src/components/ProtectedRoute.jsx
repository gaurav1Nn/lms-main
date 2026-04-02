import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export const ProtectedRoute = ({ children, educatorOnly = false }) => {
  const { isAuthenticated, isEducator, userData, token } = useContext(AppContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Token exists but userData hasn't loaded yet — wait (don't redirect prematurely)
  if (token && !userData) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (educatorOnly && !isEducator) {
    return <Navigate to="/" replace />;
  }

  return children;
};
