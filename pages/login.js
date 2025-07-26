import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Auth } from '../utils/auth';

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    
    // Check if already logged in (only on client side)
    if (typeof window !== 'undefined') {
      const user = Auth.getCurrentUser();
      if (user) {
        const redirectPath = Auth.getRedirectPath(user);
        router.replace(redirectPath);
      }
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await Auth.login(formData.username, formData.password); // ✅ Awaited async login
      
      if (result.success) {
        // Auth.initializeDemoData(); ❌ SKIPPED: no longer using demo data
        const redirectPath = Auth.getRedirectPath(result.user);
        router.replace(redirectPath);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (role) => {
    if (role === 'admin') {
      setFormData({ username: 'admin', password: 'admin123' });
    } else {
      setFormData({ username: 'user', password: 'user123' });
    }
    setError('');
  };

  if (!mounted) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your onboarding account</p>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <div className="input-group">
            <label htmlFor="username" className="input-label">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="input"
              placeholder="Enter your username"
              required
              disabled={isLoading}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password" className="input-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input"
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="error-message mb-4">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="button button-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '24px', padding: '16px', background: '#f7fafc', borderRadius: '8px' }}>
          <p style={{ fontSize: '0.875rem', color: '#4a5568', marginBottom: '12px', textAlign: 'center' }}>
          </p>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => fillDemoCredentials('admin')}
              className="button button-secondary button-small"
              style={{ flex: 1 }}
            >
              👨‍💼 Admin Login
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials('user')}
              className="button button-secondary button-small"
              style={{ flex: 1 }}
            >
              👤 User Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
