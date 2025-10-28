/**
 * Admin Protected Route Component
 * Redirects to login if user is not authenticated or doesn't have admin/approval role
 */

import { useEffect, useCallback } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store';
import { showToast } from '../../store/slices/uiSlice';
import { ROUTES } from '../../constants/routes';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'approval' | 'admin_or_approval';
}

export const AdminProtectedRoute = ({ 
  children, 
  requiredRole = 'admin_or_approval' 
}: AdminProtectedRouteProps) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useAppDispatch();

  const hasRequiredRole = useCallback(() => {
    if (!user) return false;
    
    switch (requiredRole) {
      case 'admin':
        return user.role === 'admin';
      case 'approval':
        return user.role === 'approval';
      case 'admin_or_approval':
        return user.role === 'admin' || user.role === 'approval';
      default:
        return false;
    }
  }, [user, requiredRole]);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(showToast({
        message: 'Please login to access this page',
        type: 'warning',
      }));
    } else if (!hasRequiredRole()) {
      dispatch(showToast({
        message: 'You do not have permission to access this page',
        type: 'error',
      }));
    }
  }, [isAuthenticated, user, dispatch, hasRequiredRole]);

  if (!isAuthenticated) {
    // Redirect to login page with return URL
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (!hasRequiredRole()) {
    // Redirect to rooms page if user doesn't have required role
    return <Navigate to={ROUTES.ROOMS} replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;