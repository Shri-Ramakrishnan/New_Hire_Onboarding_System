import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '../utils/auth.js';

const ProtectedRoute = ({ children, requireRole = null }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = Auth.getCurrentUser();
    
    // If no user is logged in, redirect to login
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    // If a specific role is required, check if user has it
    if (requireRole && user.role !== requireRole) {
      // Redirect to appropriate dashboard based on user's actual role
      const redirectPath = Auth.getRedirectPath(user);
      navigate(redirectPath, { replace: true });
      return;
    }
  }, [navigate, requireRole]);

  // Don't render children if user is not authenticated or doesn't have required role
  const user = Auth.getCurrentUser();
  if (!user) return null;
  if (requireRole && user.role !== requireRole) return null;

  return children;
};

export default ProtectedRoute;
