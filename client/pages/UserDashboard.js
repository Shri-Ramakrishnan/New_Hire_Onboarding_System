import { useEffect, useState } from 'react';
import { fetchSteps, updateStep } from '../utils/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StepCard from '../components/StepCard';
import ProgressBar from '../components/ProgressBar'; 
import { Auth } from '../utils/auth';

export default function UserDashboard() {
  const [steps, setSteps] = useState([]);
  const user = Auth.getCurrentUser();

  useEffect(() => {
    loadSteps();
  }, []);

  const loadSteps = async () => {
    const allSteps = await fetchSteps();
    const userSteps = allSteps.filter((step) => step.assignedTo === user.username);
    setSteps(userSteps);
  };

  const handleStepUpdate = async (updatedStep) => {
    if (!updatedStep) return;
    await updateStep(updatedStep._id, updatedStep);
    loadSteps();
  };

  const total = steps.length;
  const completed = steps.filter((step) => step.completed).length;
  const pending = total - completed;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  const recentSteps = [...steps]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="main-layout">
      <Sidebar />
      <div className="content-area">
        <Navbar />
        <div className="container" style={{ paddingTop: '24px' }}>
          <div className="card-header">
            <h1 className="card-title">User Dashboard</h1>
            <p className="card-description">Track your onboarding progress and complete pending steps</p>
          </div>

          {}
          <div style={{ marginBottom: '20px' }}>
            <h3>Progress: {completed}/{total} steps ({percentage}%)</h3>
            <ProgressBar percentage={percentage} />
          </div>

          {}
          <div className="dashboard-grid">
            <div className="stats-card">
              <div className="stats-value">{total}</div>
              <div className="stats-label">Total Steps</div>
            </div>
          </div>

           {}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Recent Steps</h2>
            </div>
            {recentSteps.length > 0 ? (
              <div>
                {recentSteps.map((step) => (
                  <StepCard
                    key={step._id}
                    step={step}
                    onUpdate={handleStepUpdate}
                    showActions={true}
                    isAdminView={false}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center" style={{ padding: '40px', color: '#718096' }}>
                <p>You have no assigned steps yet. Please contact your admin.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
