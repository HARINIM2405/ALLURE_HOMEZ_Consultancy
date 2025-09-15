import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken'); // or 'token' based on your setup
  return token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
