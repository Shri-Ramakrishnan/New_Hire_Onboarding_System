'use client';

import { useEffect, useState } from 'react';
import { getStepsForUser, getUserCompletionStats, completeStep } from '@/utils/api';

export default function UserSteps() {
  const [steps, setSteps] = useState([]);
  const [username, setUsername] = useState('');
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, percentage: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser?.username) {
      setUsername(storedUser.username);
    } else {
      setError('No user found in localStorage');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (username) {
      loadStepsAndStats();
    }
  }, [username]);

  const loadStepsAndStats = async () => {
    try {
      setLoading(true);
      const stepData = await getStepsForUser(username);
      const statData = await getUserCompletionStats(username);
      setSteps(stepData);
      setStats(statData);
    } catch (err) {
      console.error('Failed to load data:', err.message);
      setError('Failed to load steps or stats');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      await completeStep(id);
      await loadStepsAndStats();
    } catch (err) {
      console.error('Failed to mark step complete:', err.message);
      setError('Failed to update step');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '24px' }}>Welcome, Shri Ram 👋</h1>
      <div style={{ marginTop: '20px' }}>
        <p><strong>Total Steps:10</strong> </p>
      </div>

      <h2 style={{ marginTop: '30px' }}>Your Onboarding Steps</h2>
      {steps.length === 0 ? (
        <p>No steps assigned yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {steps.map((step) => (
            <li key={step._id} style={{ 
              border: '1px solid #ccc', 
              padding: '15px', 
              marginBottom: '10px', 
              borderRadius: '5px', 
              backgroundColor: step.completed ? '#e0ffe0' : '#fff' 
            }}>
              <h3 style={{ margin: 0 }}>{step.title}</h3>
              <p style={{ margin: '5px 0' }}>{step.description}</p>
              <p style={{ margin: '5px 0' }}><strong>Due:</strong> {step.dueDate?.split('T')[0]}</p>
              <p style={{ margin: '5px 0' }}><strong>Status:</strong> {step.completed ? '✅ Completed' : '❌ Pending'}</p>
              {!step.completed && (
                <button 
                  onClick={() => handleComplete(step._id)} 
                  style={{ marginTop: '10px', padding: '5px 10px' }}
                >
                  Mark as Complete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
