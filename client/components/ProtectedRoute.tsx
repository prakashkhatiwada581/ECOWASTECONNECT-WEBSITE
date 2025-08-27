import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  requireUser?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  requireAdmin = false, 
  requireUser = false 
}: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, isUser } = useAuth();

  // If authentication is required and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If admin access is required and user is not admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  // If user access is required and user is not a regular user
  if (requireUser && !isUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
