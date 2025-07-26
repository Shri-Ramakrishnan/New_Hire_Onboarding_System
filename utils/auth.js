// Authentication utilities for the onboarding app

// Hardcoded users for demo purposes
const DEMO_USERS = [
  { username: "admin", password: "admin123", role: "admin", name: "Admin User" },
  { username: "user", password: "user123", role: "user", name: "Shri Ram" }
];

// In-memory store for logged-in user (temporary)
let currentUser = null;

export const Auth = {
  // Login function
  login: (username, password) => {
    const user = DEMO_USERS.find(
      u => u.username === username && u.password === password
    );

    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      currentUser = userWithoutPassword;

      // Save to localStorage to persist on reload (optional, temporary)
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      }

      return { success: true, user: userWithoutPassword };
    }

    return { success: false, error: "Invalid username or password" };
  },

  // Logout function
  logout: () => {
    currentUser = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    }
  },

  // Get current user
  getCurrentUser: () => {
    if (currentUser) return currentUser;

    // Try reading from localStorage (for page reload)
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('currentUser');
      if (saved) {
        currentUser = JSON.parse(saved);
        return currentUser;
      }
    }

    return null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return Auth.getCurrentUser() !== null;
  },

  // Check if user has specific role
  hasRole: (role) => {
    const user = Auth.getCurrentUser();
    return user && user.role === role;
  },

  // Check if user is admin
  isAdmin: () => {
    return Auth.hasRole('admin');
  },

  // Check if user is regular user
  isUser: () => {
    return Auth.hasRole('user');
  },

  // Get redirect path based on user role
  getRedirectPath: (user = null) => {
    const currentUser = user || Auth.getCurrentUser();
    if (!currentUser) return '/login';
    
    switch (currentUser.role) {
      case 'admin':
        return '/admin';
      case 'user':
        return '/user';
      default:
        return '/login';
    }
  },

  // Dummy function (no steps here anymore)
  initializeDemoData: () => {
    console.warn('initializeDemoData skipped: steps are now managed in backend.');
  },

  // Get all users (for admin purposes)
  getAllUsers: () => {
    return DEMO_USERS.map(({ password, ...user }) => user);
  }
};
