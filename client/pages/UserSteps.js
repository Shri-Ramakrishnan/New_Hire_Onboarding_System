'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import StepCard from '@/components/StepCard';
import { getStepsForUser, completeStep, calculateCompletionStats } from '@/utils/api';

export default function UserSteps({ username = 'user1' }) {
  const [steps, setSteps] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, percentage: 0 });

  const loadSteps = async () => {
    try {
      const data = await getStepsForUser(username);
      setSteps(data);
      setStats(calculateCompletionStats(data));
    } catch (err) {
      console.error('Load error:', err.message);
    }
  };

  const handleComplete = async (id) => {
    try {
      await completeStep(id);
      loadSteps();
    } catch (err) {
      console.error('Complete error:', err.message);
    }
  };

  useEffect(() => {
    loadSteps();
  }, []);

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <header className="header">
          <h1 className="title">My Onboarding Steps</h1>
          <p className="progress-summary">Overall Progress: {stats.percentage}%</p>
        </header>

        <section className="step-filters">
          <button className="btn">All ({stats.total})</button>
          <button className="btn">Pending ({stats.pending})</button>
          <button className="btn">Completed ({stats.completed})</button>
        </section>

        <section className="steps-list">
          {steps.map((step) => (
            <StepCard
              key={step._id}
              step={step}
              onComplete={() => handleComplete(step._id)}
            />
          ))}
        </section>
      </div>
    </div>
  );
}
