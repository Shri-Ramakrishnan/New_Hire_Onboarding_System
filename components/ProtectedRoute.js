import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Auth } from '../utils/auth';

const ProtectedRoute = ({ children, requireRole = null }) => {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const user = Auth.getCurrentUser();
      
      // If no user is logged in, redirect to login
      if (!user) {
        router.replace('/login');
        return;
      }

      // If a specific role is required, check if user has it
      if (requireRole && user.role !== requireRole) {
        // Redirect to appropriate dashboard based on user's actual role
        const redirectPath = Auth.getRedirectPath(user);
        router.replace(redirectPath);
        return;
      }

      // User is authorized
      setIsAuthorized(true);
      setIsChecking(false);
    };

    // Only run on client side
    if (typeof window !== 'undefined') {
      checkAuth();
    }
  }, [router, requireRole]);

  // Show loading state during auth check
  if (isChecking) {
    return (
      <div className="flex-center" style={{ height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Don't render children if not authorized
  if (!isAuthorized) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
