import { Auth } from '../utils/auth.js';
import UserInfo from './UserInfo';

const Navbar = () => {
  const user = Auth.getCurrentUser();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      Auth.logout();
    }
  };

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
