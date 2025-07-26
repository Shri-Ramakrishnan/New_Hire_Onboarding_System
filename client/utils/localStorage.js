// localStorage utility functions for the onboarding app

export const LocalStorage = {
  // User management
  setUser: (user) => {
    try {
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
      return false;
    }
  },

  getUser: () => {
    try {
      const user = localStorage.getItem('currentUser');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting user from localStorage:', error);
      return null;
    }
  },

  removeUser: () => {
    try {
      localStorage.removeItem('currentUser');
      return true;
    } catch (error) {
      console.error('Error removing user from localStorage:', error);
      return false;
    }
  },

  // Onboarding steps management
  setSteps: (steps) => {
    try {
      localStorage.setItem('onboardingSteps', JSON.stringify(steps));
      return true;
    } catch (error) {
      console.error('Error saving steps to localStorage:', error);
      return false;
    }
  },

  getSteps: () => {
    try {
      const steps = localStorage.getItem('onboardingSteps');
      return steps ? JSON.parse(steps) : [];
    } catch (error) {
      console.error('Error getting steps from localStorage:', error);
      return [];
    }
  },

  addStep: (step) => {
    try {
      const steps = LocalStorage.getSteps();
      const newStep = {
        id: Date.now().toString(),
        title: step.title,
        description: step.description,
        assignedTo: step.assignedTo,
        completed: false,
        createdAt: new Date().toISOString(),
        ...step
      };
      steps.push(newStep);
      LocalStorage.setSteps(steps);
      return newStep;
    } catch (error) {
      console.error('Error adding step:', error);
      return null;
    }
  },

  updateStep: (stepId, updates) => {
    try {
      const steps = LocalStorage.getSteps();
      const stepIndex = steps.findIndex(step => step.id === stepId);
      
      if (stepIndex !== -1) {
        steps[stepIndex] = { ...steps[stepIndex], ...updates };
        LocalStorage.setSteps(steps);
        return steps[stepIndex];
      }
      return null;
    } catch (error) {
      console.error('Error updating step:', error);
      return null;
    }
  },

  deleteStep: (stepId) => {
    try {
      const steps = LocalStorage.getSteps();
      const filteredSteps = steps.filter(step => step.id !== stepId);
      LocalStorage.setSteps(filteredSteps);
      return true;
    } catch (error) {
      console.error('Error deleting step:', error);
      return false;
    }
  },

  // Get steps for a specific user
  getStepsForUser: (username) => {
    try {
      const allSteps = LocalStorage.getSteps();
      return allSteps.filter(step => step.assignedTo === username);
    } catch (error) {
      console.error('Error getting steps for user:', error);
      return [];
    }
  },

  // Mark step as completed
  completeStep: (stepId) => {
    return LocalStorage.updateStep(stepId, { completed: true, completedAt: new Date().toISOString() });
  },

  // Get completion statistics
  getCompletionStats: (username = null) => {
    try {
      const steps = username ? LocalStorage.getStepsForUser(username) : LocalStorage.getSteps();
      const total = steps.length;
      const completed = steps.filter(step => step.completed).length;
      
      return {
        total,
        completed,
        pending: total - completed,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0
      };
    } catch (error) {
      console.error('Error getting completion stats:', error);
      return { total: 0, completed: 0, pending: 0, percentage: 0 };
    }
  },

  // Clear all data (for testing/reset)
  clearAll: () => {
    try {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('onboardingSteps');
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
};
