import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import StepCard from '../components/StepCard.jsx';
import { Auth } from '../utils/auth.js';
import {
  fetchSteps,
  addStep,
  updateStep,
  deleteStep
} from '../utils/api.js'; // 🆕 import backend API

const AdminManage = () => {
  const [steps, setSteps] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    loadSteps();
  }, []);

  const loadSteps = async () => {
    const allSteps = await fetchSteps();
    setSteps(allSteps);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    if (!formData.title.trim() || !formData.description.trim() || !formData.assignedTo.trim()) {
      setMessage({ text: 'Please fill in all fields', type: 'error' });
      setIsSubmitting(false);
      return;
    }

    try {
      const newStep = await addStep({
        title: formData.title.trim(),
        description: formData.description.trim(),
        assignedTo: formData.assignedTo.trim()
      });

      if (newStep && newStep._id) {
        setMessage({ text: 'Step created successfully!', type: 'success' });
        setFormData({ title: '', description: '', assignedTo: '' });
        setShowForm(false);
        loadSteps();
      } else {
        setMessage({ text: 'Failed to create step. Please try again.', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'An error occurred. Please try again.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStepUpdate = async (updatedStep, action) => {
    try {
      if (action === 'deleted') {
        await deleteStep(updatedStep._id);
        loadSteps();
        setMessage({ text: 'Step deleted successfully!', type: 'success' });
      } else if (updatedStep) {
        await updateStep(updatedStep._id, updatedStep);
        loadSteps();
        setMessage({ text: 'Step updated successfully!', type: 'success' });
      }
    } catch (error) {
      setMessage({ text: 'Failed to update step.', type: 'error' });
    }
  };

  const users = Auth.getAllUsers().filter(user => user.role === 'user');

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="main-layout">
      <Sidebar />
      <div className="content-area">
        <Navbar />
        <div className="container" style={{ paddingTop: '24px' }}>
          <div className="card-header">
            <h1 className="card-title">Manage Onboarding Steps</h1>
            <p className="card-description">Create, edit, and assign onboarding tasks to users</p>
          </div>

          <div className="card">
            <div className="flex-between">
              <div>
                <h2 className="card-title" style={{ marginBottom: '8px' }}>Actions</h2>
                <p className="card-description">Manage your onboarding steps</p>
              </div>
              <div className="flex gap-4">
                <Link to="/admin" className="button button-secondary">
                  ← Back to Dashboard
                </Link>
                <button 
                  onClick={() => setShowForm(!showForm)}
                  className="button button-primary"
                >
                  {showForm ? 'Cancel' : '➕ Add New Step'}
                </button>
              </div>
            </div>
          </div>

          {message.text && (
            <div className={`card ${message.type === 'success' ? 'success-message' : 'error-message'}`}>
              {message.text}
            </div>
          )}

          {showForm && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Create New Step</h2>
                <p className="card-description">Add a new onboarding step for users</p>
              </div>
              <form onSubmit={handleSubmit} className="form form-wide">
                <div className="input-group">
                  <label htmlFor="title" className="input-label">Step Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="e.g., Complete HR Documentation"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="description" className="input-label">Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="input textarea"
                    placeholder="Provide detailed instructions for this step..."
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="assignedTo" className="input-label">Assign To *</label>
                  <select
                    id="assignedTo"
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleInputChange}
                    className="input"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Select a user...</option>
                    {users.map(user => (
                      <option key={user.username} value={user.username}>
                        {user.name} (@{user.username})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-4">
                  <button type="submit" className="button button-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create Step'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="button button-secondary" disabled={isSubmitting}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">All Steps ({steps.length})</h2>
              <p className="card-description">Manage existing onboarding steps</p>
            </div>
            {steps.length > 0 ? (
              <div>
                {steps
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map(step => (
                    <StepCard 
                      key={step._id}
                      step={step}
                      onUpdate={handleStepUpdate}
                      showActions={true}
                      isAdminView={true}
                    />
                  ))}
              </div>
            ) : (
              <div className="text-center" style={{ padding: '40px', color: '#718096' }}>
                <p>No steps have been created yet.</p>
                <button 
                  onClick={() => setShowForm(true)}
                  className="button button-primary" 
                  style={{ marginTop: '16px' }}
                >
                  Create Your First Step
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminManage;
