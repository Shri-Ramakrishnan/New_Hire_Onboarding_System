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
      
      if (!user) {
        router.replace('/login');
        return;
      }

      if (requireRole && user.role !== requireRole) {
        const redirectPath = Auth.getRedirectPath(user);
        router.replace(redirectPath);
        return;
      }

      setIsAuthorized(true);
      setIsChecking(false);
    };

    if (typeof window !== 'undefined') {
      checkAuth();
    }
  }, [router, requireRole]);

  if (isChecking) {
    return (
      <div className="flex-center" style={{ height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
