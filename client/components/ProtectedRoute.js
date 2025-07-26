import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '../utils/auth.js';

const ProtectedRoute = ({ children, requireRole = null }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = Auth.getCurrentUser();
    
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    if (requireRole && user.role !== requireRole) {
      const redirectPath = Auth.getRedirectPath(user);
      navigate(redirectPath, { replace: true });
      return;
    }
  }, [navigate, requireRole]);

  const user = Auth.getCurrentUser();
  if (!user) return null;
  if (requireRole && user.role !== requireRole) return null;

  return children;
};

export default ProtectedRoute;
