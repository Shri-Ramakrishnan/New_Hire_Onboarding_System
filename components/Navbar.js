import { useState, useEffect } from 'react';
import { Auth } from '../utils/auth';
import UserInfo from './UserInfo';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setUser(Auth.getCurrentUser());
  }, []);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      Auth.logout();
    }
  };

  if (!mounted) {
    return (
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <span>🏢</span>
              New Hire Onboarding
            </div>
            <div className="nav-actions">
              <div style={{ width: '120px', height: '40px' }}></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <span>🏢</span>
            New Hire Onboarding
          </div>
          
          <div className="nav-actions">
            {user && <UserInfo user={user} />}
            <button 
              onClick={handleLogout}
              className="button button-secondary button-small"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
