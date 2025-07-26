import { Link, useLocation } from 'react-router-dom';
import { Auth } from '../utils/auth.js';

const Sidebar = () => {
  const location = useLocation();
  const user = Auth.getCurrentUser();
  
  if (!user) return null;

  const adminLinks = [
    { path: '/admin', label: '📊 Dashboard', exact: true },
    { path: '/admin/manage', label: '👥 Manage Steps', exact: false }
  ];

  const userLinks = [
    { path: '/user', label: '📊 Dashboard', exact: true },
  ];

  const links = user.role === 'admin' ? adminLinks : userLinks;

  const isActiveLink = (path, exact) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span>🏢</span>
          Onboarding
        </div>
      </div>
      
      <nav>
        <ul className="sidebar-nav">
          {links.map((link) => (
            <li key={link.path} className="sidebar-nav-item">
              <Link 
                to={link.path} 
                className={`sidebar-nav-link ${isActiveLink(link.path, link.exact) ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
