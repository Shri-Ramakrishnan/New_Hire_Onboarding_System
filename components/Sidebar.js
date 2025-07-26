import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Auth } from '../utils/auth';

const Sidebar = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setUser(Auth.getCurrentUser());
  }, []);
  
  // Prevent hydration mismatch by not rendering until client-side
  if (!mounted || !user) {
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
            <li className="sidebar-nav-item">
              <div className="sidebar-nav-link">Loading...</div>
            </li>
          </ul>
        </nav>
      </aside>
    );
  }

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
      return router.pathname === path;
    }
    return router.pathname.startsWith(path);
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
                href={link.path}
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
