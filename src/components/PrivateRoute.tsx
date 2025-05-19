// src/routes/PrivateRoute.tsx
import React from 'react';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = sessionStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/" replace />;
};

export default PrivateRoute;