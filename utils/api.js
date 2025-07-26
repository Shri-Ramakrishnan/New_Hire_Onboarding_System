const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://new-hire-onboarding-backend-1.onrender.com';
const API_URL = `${API_BASE_URL}`;

export const fetchSteps = async () => {
  const res = await fetch(`${API_URL}/steps`);
  if (!res.ok) throw new Error('Failed to fetch steps');
  return res.json();
};

export const getStepsForUser = async (username) => {
  const res = await fetch(`${API_URL}/steps?assignedTo=${encodeURIComponent(username)}`);
  if (!res.ok) throw new Error('Failed to fetch steps for user');
  return res.json();
};

export const addStep = async (step) => {
  const res = await fetch(`${API_URL}/steps`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(step),
  });
  if (!res.ok) throw new Error('Failed to add step');
  return res.json();
};

export const updateStep = async (id, updates) => {
  const res = await fetch(`${API_URL}/steps/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update step');
  return res.json();
};

export const deleteStep = async (id) => {
  const res = await fetch(`${API_URL}/steps/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete step');
  return res.json();
};

export const completeStep = async (id) => {
  const res = await fetch(`${API_URL}/steps/${id}/complete`, {
    method: 'PATCH',
  });
  if (!res.ok) throw new Error('Failed to complete step');
  return res.json();
};

export const calculateCompletionStats = (steps) => {
  const total = steps.length;
  const completed = steps.filter((s) => s.completed).length;
  const pending = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { total, completed, pending, percentage };
};

export const getUserCompletionStats = async (username) => {
  const res = await fetch(`${API_URL}/steps/stats/${encodeURIComponent(username)}`);
  if (!res.ok) throw new Error('Failed to fetch user stats');
  return res.json();
};
