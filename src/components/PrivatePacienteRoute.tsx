// src/routes/PrivatePacienteRoute.tsx
import React from 'react';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useGlobalPaciente } from '../context/PacienteContext';

interface PrivatePacienteRouteProps {
  children: ReactNode;
}

const PrivatePacienteRoute: React.FC<PrivatePacienteRouteProps> = ({ children }) => {
  const { id, nombre } = useGlobalPaciente();

  if (!id || !nombre) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default PrivatePacienteRoute;