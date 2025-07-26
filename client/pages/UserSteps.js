import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import StepCard from '../components/StepCard.jsx';
import { Auth } from '../utils/auth.js';
import * as api from '../utils/api.js'; // ✅ use your backend API functions

const UserSteps = () => {
  const [userSteps, setUserSteps] = useState([]);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    percentage: 0
  });

  const user = Auth.getCurrentUser();

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      const steps = await api.getStepsForUser(user.username);
      const completed = steps.filter(step => step.completed).length;
      const total = steps.length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

      setUserSteps(steps);
      setStats({
        total,
        completed,
        pending: total - completed,
        percentage
      });
    } catch (error) {
      console.error('Error loading user steps:', error);
    }
  };

  const handleStepUpdate = async (updatedStep) => {
    try {
      const res = await api.updateStep(updatedStep._id, { completed: true });
      if (res) {
        setUserSteps((prev) =>
          prev.map((step) =>
            step._id === res._id ? res : step
          )
        );
        // Recalculate stats
        const completed = userSteps.filter(s => s._id !== res._id && s.completed).length + 1;
        const total = userSteps.length;
        setStats({
          total,
          completed,
          pending: total - completed,
          percentage: total > 0 ? Math.round((completed / total) * 100) : 0
        });
      }
    } catch (err) {
      console.error('Failed to update step:', err);
    }
  };

  const getFilteredSteps = () => {
    switch (filter) {
      case 'pending':
        return userSteps.filter((step) => !step.completed);
      case 'completed':
        return userSteps.filter((step) => step.completed);
      default:
        return userSteps;
    }
  };

  const filteredSteps = getFilteredSteps();

  const filterButtons = [
    { key: 'all', label: `All (${userSteps.length})` },
    { key: 'pending', label: `Pending (${stats.pending})` },
    { key: 'completed', label: `Completed (${stats.completed})` }
  ];

  if (!user) return null;

  return (
    <div className="main-layout">
      <Sidebar />
      <div className="content-area">
        <Navbar />
        <div className="container" style={{ paddingTop: '24px' }}>
          <div className="card-header">
            <h1 className="card-title">My Onboarding Steps</h1>
            <p className="card-description">
              View and complete your assigned onboarding tasks
            </p>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Progress Summary</h2>
            </div>

            {stats.total > 0 ? (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <div className="flex-between" style={{ marginBottom: '8px' }}>
                    <span style={{ fontWeight: '600' }}>Overall Progress</span>
                    <span style={{ fontWeight: '600' }}>{stats.percentage}%</span>
                  </div>
                  <div className="progress-bar" style={{ height: '12px' }}>
                    <div
                      className="progress-fill"
                      style={{ width: `${stats.percentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link to="/user" className="button button-secondary">← Back to Dashboard</Link>
                  <button onClick={loadUserData} className="button button-secondary">🔄 Refresh</button>
                </div>
              </>
            ) : (
              <div className="text-center" style={{ padding: '40px', color: '#718096' }}>
                <p>No onboarding steps have been assigned to you yet.</p>
                <Link to="/user" className="button button-secondary" style={{ marginTop: '16px' }}>
                  ← Back to Dashboard
                </Link>
              </div>
            )}
          </div>

          {stats.total > 0 && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Filter Steps</h2>
              </div>
              <div className="flex gap-4">
                {filterButtons.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={`button ${filter === key ? 'button-primary' : 'button-secondary'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {stats.total > 0 && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  {filter === 'all' && 'All Steps'}
                  {filter === 'pending' && 'Pending Steps'}
                  {filter === 'completed' && 'Completed Steps'}
                  {filteredSteps.length > 0 && ` (${filteredSteps.length})`}
                </h2>
                <p className="card-description">
                  {filter === 'pending' && 'Complete these tasks to progress in your onboarding'}
                  {filter === 'completed' && 'Tasks you have successfully completed'}
                  {filter === 'all' && 'All your assigned onboarding tasks'}
                </p>
              </div>

              {filteredSteps.length > 0 ? (
                <div>
                  {filteredSteps
                    .sort((a, b) => {
                      if (a.completed !== b.completed) {
                        return a.completed ? 1 : -1;
                      }
                      return new Date(b.createdAt) - new Date(a.createdAt);
                    })
                    .map((step) => (
                      <StepCard
                        key={step._id}
                        step={step}
                        onUpdate={handleStepUpdate}
                        showActions={!step.completed}
                        isAdminView={false}
                      />
                    ))}
                </div>
              ) : (
                <div className="text-center" style={{ padding: '40px', color: '#718096' }}>
                  <p>
                    {filter === 'pending' && 'No pending steps! 🎉'}
                    {filter === 'completed' && 'No completed steps yet.'}
                    {filter === 'all' && 'No steps found.'}
                  </p>

                  {filter === 'pending' && stats.completed > 0 && (
                    <p style={{ fontSize: '0.875rem', marginTop: '8px' }}>
                      Great job! You've completed all your assigned tasks.
                    </p>
                  )}

                  {filter !== 'all' && (
                    <button
                      onClick={() => setFilter('all')}
                      className="button button-secondary"
                      style={{ marginTop: '16px' }}
                    >
                      View All Steps
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {stats.total > 0 && stats.percentage === 100 && (
            <div
              className="card"
              style={{
                background: 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)',
                color: 'white',
                textAlign: 'center'
              }}
            >
              <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>🎉 Outstanding Work!</h2>
              <p style={{ fontSize: '1.25rem', marginBottom: '8px' }}>
                You've completed all {stats.total} onboarding steps!
              </p>
              <p style={{ opacity: 0.9 }}>
                Your dedication to completing the onboarding process is commendable. Welcome aboard!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSteps;
