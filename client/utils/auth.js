
import { LocalStorage } from './localStorage.js';

const DEMO_USERS = [
  { username: "admin", password: "admin123", role: "admin", name: "Admin User" },
  { username: "user", password: "user123", role: "user", name: "Shri Ram" }
];

export const Auth = {
  
  login: (username, password) => {
    const user = DEMO_USERS.find(
      u => u.username === username && u.password === password
    );

    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      LocalStorage.setUser(userWithoutPassword);
      return { success: true, user: userWithoutPassword };
    }

    return { success: false, error: "Invalid username or password" };
  },

  logout: () => {
    LocalStorage.removeUser();
    window.location.href = '/login';
  },

  getCurrentUser: () => {
    return LocalStorage.getUser();
  },

  isAuthenticated: () => {
    const user = LocalStorage.getUser();
    return user !== null;
  },

  hasRole: (role) => {
    const user = LocalStorage.getUser();
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
    const steps = LocalStorage.getSteps();
    
    if (steps.length === 0) {
      const demoSteps = [
        {
          id: '1',
          title: 'Complete HR Documentation',
          description: 'Fill out all required HR forms including tax documents, emergency contacts, and employee handbook acknowledgment.',
          assignedTo: 'user',
          completed: false,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'IT Setup and Security Training',
          description: 'Set up your work computer, create accounts, and complete the mandatory cybersecurity training.',
          assignedTo: 'user',
          completed: true,
          createdAt: new Date().toISOString(),
          completedAt: new Date().toISOString()
        },
        {
          id: '3',
          title: 'Team Introduction Meeting',
          description: 'Schedule and attend a meet-and-greet session with your immediate team members and key stakeholders.',
          assignedTo: 'user',
          completed: false,
          createdAt: new Date().toISOString()
        },
        {
          id: '4',
          title: 'Review Company Policies',
          description: 'Read through the employee handbook, code of conduct, and departmental procedures.',
          assignedTo: 'user',
          completed: false,
          createdAt: new Date().toISOString()
        }
      ];
      
      LocalStorage.setSteps(demoSteps);
    }
  },

  getAllUsers: () => {
    return DEMO_USERS.map(({ password, ...user }) => user);
  }
};
