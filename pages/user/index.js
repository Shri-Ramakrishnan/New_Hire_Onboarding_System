import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import StepCard from '../../components/StepCard';
import { Auth } from '../../utils/auth';
import { getStepsForUser, getUserCompletionStats } from '../../utils/api'; // ✅ API calls

export default function UserDashboard() {
  const [userSteps, setUserSteps] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, percentage: 0 });
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (typeof window !== 'undefined') {
      const currentUser = Auth.getCurrentUser();
      setUser(currentUser);

      if (currentUser) {
        loadUserData(currentUser);
      }
    }
  }, []);

  const loadUserData = async (currentUser) => {
    if (!currentUser) return;

    try {
      const steps = await getStepsForUser(currentUser.username);
      const userStats = await getUserCompletionStats(currentUser.username);

      setUserSteps(steps);
      setStats(userStats);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleStepUpdate = (updatedStep) => {
    if (updatedStep && user) {
      setUserSteps(prev => prev.map(step => 
        step.id === updatedStep.id ? updatedStep : step
      ));

      // Re-fetch stats from backend
      getUserCompletionStats(user.username).then(setStats).catch(console.error);
    }
  };

  if (!mounted) {
    return (
      <ProtectedRoute requireRole="user">
        <div className="main-layout">
          <div style={{ marginLeft: '250px' }}>
            <div style={{ height: '60px', background: 'white', borderBottom: '1px solid #e1e5e9' }}></div>
            <div className="container" style={{ paddingTop: '24px' }}>
              <div className="card">
                <div className="card-header">
                  <h1 className="card-title">Loading...</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!user) {
    return (
      <ProtectedRoute requireRole="user">
        <div className="main-layout">
          <Sidebar />
          <div className="content-area">
            <Navbar />
            <div className="container" style={{ paddingTop: '24px' }}>
              <div className="card">
                <div className="card-header">
                  <h1 className="card-title">Loading...</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const recentSteps = userSteps
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const pendingSteps = userSteps.filter(step => !step.completed);
  const completedSteps = userSteps.filter(step => step.completed);

  return (
    <ProtectedRoute requireRole="user">
      <div className="main-layout">
        <Sidebar />
        <div className="content-area">
          <Navbar />
          
          <div className="container" style={{ paddingTop: '24px' }}>
            <div className="card-header">
              <h1 className="card-title">Welcome, {user.name || user.username}! 👋</h1>
              <p className="card-description">
                Track your onboarding progress and complete assigned tasks
              </p>
            </div>

            {/* Progress Overview */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Your Progress</h2>
                <p className="card-description">
                  {stats.total > 0 
                    ? `You've completed ${stats.completed} out of ${stats.total} onboarding steps`
                    : 'No steps have been assigned to you yet'
                  }
                </p>
              </div>
              
              {stats.total > 0 ? (
                <>
                  <div className="progress-bar" style={{ height: '16px', marginBottom: '16px' }}>
                    <div 
                      className="progress-fill" 
                      style={{ width: `${stats.percentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="dashboard-grid">
                    <div className="stats-card">
                      <div className="stats-value">{stats.percentage}%</div>
                      <div className="stats-label">Complete</div>
                    </div>
                    
                    <div className="stats-card">
                      <div className="stats-value">{stats.completed}</div>
                      <div className="stats-label">Completed</div>
                    </div>
                    
                    <div className="stats-card">
                      <div className="stats-value">{stats.pending}</div>
                      <div className="stats-label">Remaining</div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center" style={{ padding: '40px', color: '#718096' }}>
                  <p>No onboarding steps have been assigned to you yet.</p>
                  <p style={{ fontSize: '0.875rem', marginTop: '8px' }}>
                    Please contact your administrator if you believe this is an error.
                  </p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            {stats.total > 0 && (
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Quick Actions</h2>
                </div>
                <div className="flex gap-4">
                  <Link href="/user/steps" className="button button-primary">
                    📋 View All Steps
                  </Link>
                  <button 
                    onClick={() => loadUserData(user)}
                    className="button button-secondary"
                  >
                    🔄 Refresh Progress
                  </button>
                </div>
              </div>
            )}

            {/* Pending Steps */}
            {pendingSteps.length > 0 && (
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">🎯 Next Steps ({pendingSteps.length})</h2>
                  <p className="card-description">
                    Complete these tasks to progress in your onboarding
                  </p>
                </div>
                
                <div>
                  {pendingSteps.slice(0, 3).map(step => (
                    <StepCard 
                      key={step.id} 
                      step={step} 
                      onUpdate={handleStepUpdate}
                      showActions={true}
                      isAdminView={false}
                    />
                  ))}
                  
                  {pendingSteps.length > 3 && (
                    <div className="text-center" style={{ marginTop: '16px' }}>
                      <Link href="/user/steps" className="button button-secondary">
                        View All {pendingSteps.length} Pending Steps
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Recent Activity */}
            {completedSteps.length > 0 && (
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">✅ Recently Completed</h2>
                  <p className="card-description">
                    Your latest completed onboarding tasks
                  </p>
                </div>
                
                <div>
                  {completedSteps
                    .sort((a, b) => new Date(b.completedAt || b.createdAt) - new Date(a.completedAt || a.createdAt))
                    .slice(0, 3)
                    .map(step => (
                      <StepCard 
                        key={step.id} 
                        step={step} 
                        onUpdate={handleStepUpdate}
                        showActions={false}
                        isAdminView={false}
                      />
                    ))}
                  
                  {completedSteps.length > 3 && (
                    <div className="text-center" style={{ marginTop: '16px' }}>
                      <Link href="/user/steps" className="button button-secondary">
                        View All Completed Steps
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Completion Celebration */}
            {stats.total > 0 && stats.percentage === 100 && (
              <div className="card" style={{ 
                background: 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)', 
                color: 'white',
                textAlign: 'center'
              }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>🎉 Congratulations!</h2>
                <p style={{ fontSize: '1.25rem', marginBottom: '8px' }}>
                  You've completed all your onboarding steps!
                </p>
                <p style={{ opacity: 0.9 }}>
                  Welcome to the team! If you have any questions, don't hesitate to reach out.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
