import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import StepCard from '../../components/StepCard';
import { Auth } from '../../utils/auth';
import { getStepsForUser, getUserCompletionStats } from '../../utils/api';

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [userSteps, setUserSteps] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, percentage: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const currentUser = Auth.getCurrentUser();
    setUser(currentUser);
    if (currentUser) loadUserData(currentUser.username);
  }, []);

  const loadUserData = async (username) => {
    try {
      const steps = await getStepsForUser(username);
      const userStats = await getUserCompletionStats(username).catch(() => ({
        total: steps.length,
        completed: steps.filter(s => s.completed).length,
        pending: steps.length - steps.filter(s => s.completed).length,
        percentage: Math.round((steps.filter(s => s.completed).length / steps.length) * 100)
      }));
      setUserSteps(steps);
      setStats(userStats);
    } catch (err) {
      console.error('Error loading user data', err);
    }
  };

  const handleStepUpdate = async (updatedStep) => {
    if (updatedStep && user) {
      await loadUserData(user.username);
    }
  };

  if (!mounted || !user) {
    return <ProtectedRoute requireRole="user"><div>Loading...</div></ProtectedRoute>;
  }

  const pendingSteps = userSteps.filter(s => !s.completed);
  const completedSteps = userSteps.filter(s => s.completed);

  return (
    <ProtectedRoute requireRole="user">
      <div className="main-layout">
        <Sidebar />
        <div className="content-area">
          <Navbar />
          <div className="container" style={{ paddingTop: '24px' }}>
            <h1>Welcome, {user.name || user.username}!</h1>
            <br></br>
            <Link href="/user/steps" className="blue-button">View All Steps</Link>
            <button onClick={() => loadUserData(user.username)} className="blue-button">Refresh</button>

            

            {pendingSteps.length > 0 && (
              <div>
                <br></br>
                <h2>🎯Next Pending Steps</h2>
                <br></br>
                {pendingSteps.slice(0, 3).map(s => (
                  <StepCard key={s._id || s.id} step={s} onUpdate={handleStepUpdate} showActions isAdminView={false} />
                ))}
              </div>
            )}

            {completedSteps.length > 0 && (
              <div>
                <h2>Recent Completions</h2>
                {completedSteps.slice(0, 3).map(s => (
                  <StepCard key={s._id || s.id} step={s} onUpdate={handleStepUpdate} showActions={false} isAdminView={false} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
