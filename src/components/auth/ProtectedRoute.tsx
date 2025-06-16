import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireEmailVerification?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireEmailVerification = false // ✅ CAMBIADO A FALSE POR DEFECTO
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ✅ VERIFICACIÓN DE EMAIL DESHABILITADA
  // if (requireEmailVerification && !user.email_confirmed_at) {
  //   return <Navigate to="/verify-email" replace />;
  // }

  return <>{children}</>;
};

export default ProtectedRoute;