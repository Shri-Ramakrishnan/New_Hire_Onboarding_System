import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import StepCard from '../components/StepCard.jsx';
import { Auth } from '../utils/auth.js';
import {
  getAllSteps,
  updateStepById,
  deleteStepById,
} from '../utils/api';

const AdminDashboard = () => {
  const [steps, setSteps] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, percentage: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const calculateStats = (steps) => {
    const total = steps.length;
    const completed = steps.filter(s => s.completed).length;
    const pending = total - completed;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, pending, percentage };
  };

  const loadData = async () => {
    const allSteps = await getAllSteps();
    setSteps(allSteps);
    setStats(calculateStats(allSteps));
  };

  const handleStepUpdate = async (updatedStep, action) => {
    if (action === 'deleted') {
      await deleteStepById(updatedStep._id);
    } else if (updatedStep) {
      await updateStepById(updatedStep._id, updatedStep);
    }
    loadData();
  };

  const recentSteps = [...steps]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const users = Auth.getAllUsers().filter(user => user.role === 'user');

  return (
    <div className="main-layout">
      <Sidebar />
      <div className="content-area">
        <Navbar />
        <div className="container" style={{ paddingTop: '24px' }}>
          <div className="card-header">
            <h1 className="card-title">Admin Dashboard</h1>
            <p className="card-description">Manage onboarding steps and monitor progress across all users</p>
          </div>

          {/* Stats */}
          <div className="dashboard-grid">
            <div className="stats-card"><div className="stats-value">{stats.total}</div><div className="stats-label">Total Steps</div></div>
            <div className="stats-card"><div className="stats-value">{stats.completed}</div><div className="stats-label">Completed Steps</div></div>
            <div className="stats-card"><div className="stats-value">{stats.pending}</div><div className="stats-label">Pending Steps</div></div>
            <div className="stats-card"><div className="stats-value">{stats.percentage}%</div><div className="stats-label">Completion Rate</div></div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="card-header"><h2 className="card-title">Quick Actions</h2></div>
            <div className="flex gap-4">
              <Link to="/admin/manage" className="button button-primary">➕ Create New Step</Link>
              <button onClick={loadData} className="button button-secondary">🔄 Refresh Data</button>
            </div>
          </div>

          {/* Users Overview */}
          <div className="card">
            <div className="card-header"><h2 className="card-title">Users Overview</h2></div>
            <div style={{ display: 'grid', gap: '16px' }}>
              {users.map(user => {
                const userSteps = steps.filter(s => s.assignedTo === user.username);
                const stats = calculateStats(userSteps);
                return (
                  <div key={user.username} className="step-card">
                    <div className="flex-between">
                      <div>
                        <h3 className="step-title">{user.name}</h3>
                        <p style={{ color: '#718096', fontSize: '0.95rem' }}>@{user.username}</p>
                      </div>
                      <div className="text-right">
                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#2d3748' }}>{stats.completed}/{stats.total}</div>
                        <div style={{ fontSize: '0.875rem', color: '#718096' }}>Steps Complete</div>
                      </div>
                    </div>
                    {stats.total > 0 && (
                      <div className="progress-bar" style={{ marginTop: '12px' }}>
                        <div className="progress-fill" style={{ width: `${stats.percentage}%` }}></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Steps */}
          <div className="card">
            <div className="card-header"><h2 className="card-title">Recent Steps</h2></div>
            {recentSteps.length > 0 ? (
              <div>{recentSteps.map(step => (
                <StepCard key={step._id} step={step} onUpdate={handleStepUpdate} showActions={true} isAdminView={true} />
              ))}</div>
            ) : (
              <div className="text-center" style={{ padding: '40px', color: '#718096' }}>
                <p>No steps have been created yet.</p>
                <Link to="/admin/manage" className="button button-primary" style={{ marginTop: '16px' }}>
                  Create Your First Step
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
