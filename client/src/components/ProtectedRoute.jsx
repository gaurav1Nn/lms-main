import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export const ProtectedRoute = ({ children, educatorOnly = false }) => {
  const { isAuthenticated, isEducator } = useContext(AppContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (educatorOnly && !isEducator) {
    return <Navigate to="/" replace />;
  }

  return children;
};
