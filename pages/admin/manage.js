'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import StepCard from '../../components/StepCard';
import { fetchSteps, addStep, updateStep, deleteStep } from '../../utils/api';
import { Auth } from '../../utils/auth';

export default function AdminManage() {
  const [steps, setSteps] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', assignedTo: '' });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') loadSteps();
  }, []);

  const loadSteps = async () => {
    try {
      const data = await fetchSteps();
      setSteps(data);
    } catch (err) {
      console.error('Failed to load steps:', err);
      setMessage({ text: 'Failed to fetch steps', type: 'error' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.assignedTo) {
      setMessage({ text: 'Please fill all fields', type: 'error' });
      return;
    }
    try {
      await addStep(formData);
      setMessage({ text: 'Step created successfully!', type: 'success' });
      setFormData({ title: '', description: '', assignedTo: '' });
      setShowForm(false);
      loadSteps();
    } catch (err) {
      console.error('Step creation failed:', err);
      setMessage({ text: 'Failed to create step', type: 'error' });
    }
  };

 const handleStepUpdate = async (step, action) => {
  try {
    if (!step || (!step._id && !step.id)) {
      console.warn('Invalid step object:', step);
      setMessage({ text: 'Invalid step. Please refresh and try again.', type: 'error' });
      return;
    }

    const stepId = step._id || step.id;

    if (action === 'deleted') {
      await deleteStep(stepId);
    } else {
      const updates =
        action === 'completed'
          ? { completed: true, completedAt: new Date().toISOString() }
          : step;
      await updateStep(stepId, updates);
    }

    await loadSteps();
    setMessage({
      text: action === 'deleted' ? 'Deleted successfully' : 'Updated successfully',
      type: 'success',
    });
  } catch (err) {
    console.error('Step update failed:', err);
    setMessage({ text: 'Operation failed', type: 'error' });
  }
};


  if (!mounted) {
    return (
      <ProtectedRoute requireRole="admin">
        <div className="main-layout">Loading...</div>
      </ProtectedRoute>
    );
  }

  const users = Auth.getAllUsers().filter((u) => u.role === 'user');

  return (
    <ProtectedRoute requireRole="admin">
      <div className="main-layout">
        <Sidebar />
        <div className="content-area">
          <Navbar />
          <div className="container" style={{ paddingTop: '24px' }}>
            <h1>Manage Onboarding Steps</h1>

            <div className="flex-between card">
              <h2>Actions</h2>
              <div className="flex gap-4">
                <Link href="/admin" className="button-secondary">
                  ← Back
                </Link>
                <button onClick={() => setShowForm(!showForm)} className="button-primary">
                  {showForm ? 'Cancel' : '➕ Add New Step'}
                </button>
              </div>
            </div>

            {message && <div className={`card ${message.type}`}>{message.text}</div>}

            {showForm && (
              <div className="card">
                <form onSubmit={handleSubmit}>
                  {['title', 'description', 'assignedTo'].map((name) => (
                    <div key={name} className="input-group">
                      <label>{name.charAt(0).toUpperCase() + name.slice(1)}*</label>
                      {name !== 'assignedTo' ? (
                        <input name={name} value={formData[name]} onChange={handleInputChange} />
                      ) : (
                        <select
                          name={name}
                          value={formData.assignedTo}
                          onChange={handleInputChange}
                        >
                          <option value="">Select user</option>
                          {users.map((u) => (
                            <option key={u.username} value={u.username}>
                              {u.name} (@{u.username})
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  ))}
                  <div className="flex gap-4">
                    <button type="submit" className="button-primary">
                      Create Step
                    </button>
                    <button
                      type="button"
                      className="button-secondary"
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="card">
              <h2>All Steps ({steps.length})</h2>
              {steps.length ? (
                steps
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((step) => (
                    <StepCard
                      key={step._id || step.id}
                      step={step}
                      onUpdate={handleStepUpdate}
                      showActions
                      isAdminView
                    />
                  ))
              ) : (
                <div>
                  No steps yet.{' '}
                  <button onClick={() => setShowForm(true)}>Create first one</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
