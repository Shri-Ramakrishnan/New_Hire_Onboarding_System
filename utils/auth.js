
const DEMO_USERS = [
  { username: "admin", password: "admin123", role: "admin", name: "Admin User" },
  { username: "user", password: "user123", role: "user", name: "Shri Ram" }
];

let currentUser = null;

export const Auth = {
  login: (username, password) => {
    const user = DEMO_USERS.find(
      u => u.username === username && u.password === password
    );

    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      currentUser = userWithoutPassword;

      if (typeof window !== 'undefined') {
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      }

      return { success: true, user: userWithoutPassword };
    }

    return { success: false, error: "Invalid username or password" };
  },

  logout: () => {
    currentUser = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    }
  },

  getCurrentUser: () => {
    if (currentUser) return currentUser;

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('currentUser');
      if (saved) {
        currentUser = JSON.parse(saved);
        return currentUser;
      }
    }

    return null;
  },

  isAuthenticated: () => {
    return Auth.getCurrentUser() !== null;
  },

  hasRole: (role) => {
    const user = Auth.getCurrentUser();
    return user && user.role === role;
  },

  isAdmin: () => {
    return Auth.hasRole('admin');
  },

  isUser: () => {
    return Auth.hasRole('user');
  },

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

  initializeDemoData: () => {
    console.warn('initializeDemoData skipped: steps are now managed in backend.');
  },

  getAllUsers: () => {
    return DEMO_USERS.map(({ password, ...user }) => user);
  }
};
