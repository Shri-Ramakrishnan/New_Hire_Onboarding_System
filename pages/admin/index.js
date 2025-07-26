import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import StepCard from '../../components/StepCard';
import { fetchSteps, calculateCompletionStats } from '../../utils/api';
import { Auth } from '../../utils/auth';

export default function AdminDashboard() {
  const [steps, setSteps] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, percentage: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      refreshData();
    }
  }, []);

  const refreshData = async () => {
    try {
      const data = await fetchSteps();
      setSteps(data);
      setStats(calculateCompletionStats(data));
    } catch (err) {
      console.error('Error loading steps for admin:', err);
    }
  };

  const handleStepUpdate = (updatedStep, action) => {
    if (action === 'deleted' || updatedStep) {
      refreshData();
    }
  };

  if (!mounted) {
    return <ProtectedRoute requireRole="admin"><div className="main‑layout">Loading...</div></ProtectedRoute>;
  }

  const recentSteps = steps.sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt)).slice(0,5);
  const users = Auth.getAllUsers().filter(u=>u.role==='user');

  return (
    <ProtectedRoute requireRole="admin">
      <div className="main-layout">
        <Sidebar /><div className="content-area"><Navbar/>
          <div className="container" style={{paddingTop:'24px'}}>
            <h1 className="card-title">Admin Dashboard</h1>
            {/* Stats Grid */}
            <div className="dashboard-grid">
              {['Total Steps','Completed Steps','Pending Steps','Completion Rate'].map((label, i)=>(
                <div key={i} className="stats-card">
                  <div className="stats-value">{[stats.total,stats.completed,stats.pending, stats.percentage + '%'][i]}</div>
                  <div className="stats-label">{label}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 card">
              <Link href="/admin/manage" className="button button-primary">➕ Create New Step</Link>
              <button onClick={refreshData} className="button button-secondary">🔄 Refresh Data</button>
            </div>

            {/* Users Overview */}
            {users.length ? (
              <div className="card"><h2>Users Overview</h2>
                {users.map(user=>{
                  const userSteps = steps.filter(s=>s.assignedTo===user.username);
                  const us = calculateCompletionStats(userSteps);
                  return (
                    <div key={user.username} className="step-card">
                      <div className="flex-between">
                        <div><h3>{user.name}</h3><p>@{user.username}</p></div>
                        <div style={{textAlign:'right'}}>
                          <strong>{us.completed}/{us.total}</strong><div>Steps Complete</div>
                        </div>
                      </div>
                      {us.total > 0 && <div className="progress-bar"><div className="progress-fill" style={{width:us.percentage+'%'}}></div></div>}
                    </div>
                  );
                })}
              </div>
            ):(
              <p>No users found.</p>
            )}

            {/* Recent Steps */}
            <div className="card"><h2>Recent Steps</h2>
              {recentSteps.length ? recentSteps.map(step=>(
                <StepCard key={step._id || step.id} step={step} onUpdate={handleStepUpdate} showActions isAdminView />
              )) : (
                <div>No steps created yet. <Link href="/admin/manage">Create One</Link></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
