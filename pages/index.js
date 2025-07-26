import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Auth } from '../utils/auth';

export default function Home() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthAndRedirect = () => {
      const user = Auth.getCurrentUser();
      
      if (!user) {
        router.replace('/login');
      } else {
        const redirectPath = Auth.getRedirectPath(user);
        router.replace(redirectPath);
      }
      
      setIsChecking(false);
    };

    // Only run on client side
    if (typeof window !== 'undefined') {
      checkAuthAndRedirect();
    }
  }, [router]);

  // Show loading during redirect
  return (
    <div className="flex-center" style={{ height: '100vh' }}>
      <div>Loading...</div>
    </div>
  );
}
