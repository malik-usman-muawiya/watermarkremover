import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** If true, only an authenticated admin-role user may view (currently: any signed-in user, since there is no role system yet) */
  adminOnly?: boolean;
}

/**
 * Guards a route so it can only be viewed by a signed-in user.
 * Unauthenticated visitors are redirected to /auth with the original
 * destination preserved so they can be sent back after signing in.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      openAuthModal('Please sign in to access this page');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};
