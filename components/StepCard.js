import { useState, useEffect } from 'react';
import { Auth } from '../utils/auth';
import * as API from '../utils/api.js'; 

const StepCard = ({ step, onUpdate, showActions = true, isAdminView = false }) => {
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setUser(Auth.getCurrentUser());
    }
  }, []);

  const handleComplete = async () => {
    if (user && user.role === 'user' && step.assignedTo === user.username && !step.completed) {
      try {
        const updatedStep = await API.completeStep(step._id); 
        if (updatedStep && onUpdate) {
          onUpdate(updatedStep);
        }
      } catch (error) {
        console.error('Failed to complete step:', error);
        alert('Could not mark as complete');
      }
    }
  };

  const handleDelete = async () => {
    if (user && user.role === 'admin' && window.confirm('Are you sure you want to delete this step?')) {
      try {
        await API.deleteStep(step._id); 
        if (onUpdate) {
          onUpdate(null, 'deleted');
        }
      } catch (err) {
        console.error('Failed to delete step:', err);
        alert('Failed to delete step');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  if (!mounted) {
    return (
      <div className={`step-card ${step.completed ? 'completed' : ''}`}>
        <div className="step-header">
          <div>
            <h3 className="step-title">{step.title}</h3>
            {isAdminView && (
              <div style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '4px' }}>
                Assigned to: <strong>{step.assignedTo}</strong>
              </div>
            )}
            {step.createdAt && (
              <div style={{ fontSize: '0.875rem', color: '#718096' }}>
                Created: {formatDate(step.createdAt)}
              </div>
            )}
            {step.completedAt && (
              <div style={{ fontSize: '0.875rem', color: '#38a169' }}>
                Completed: {formatDate(step.completedAt)}
              </div>
            )}
          </div>
          <span className={`step-status ${step.completed ? 'completed' : 'pending'}`}>
            {step.completed ? 'Completed' : 'Pending'}
          </span>
        </div>
        <p className="step-description">{step.description}</p>
      </div>
    );
  }

  const isCompleted = step.completed;
  const canComplete = user && user.role === 'user' && step.assignedTo === user.username && !isCompleted;
  const canEdit = user && user.role === 'admin';

  return (
    <div className={`step-card ${isCompleted ? 'completed' : ''}`}>
      <div className="step-header">
        <div>
          <h3 className="step-title">{step.title}</h3>
          {isAdminView && (
            <div style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '4px' }}>
              Assigned to: <strong>{step.assignedTo}</strong>
            </div>
          )}
          {step.createdAt && (
            <div style={{ fontSize: '0.875rem', color: '#718096' }}>
              Created: {formatDate(step.createdAt)}
            </div>
          )}
          {step.completedAt && (
            <div style={{ fontSize: '0.875rem', color: '#38a169' }}>
              Completed: {formatDate(step.completedAt)}
            </div>
          )}
        </div>
        <span className={`step-status ${isCompleted ? 'completed' : 'pending'}`}>
          {isCompleted ? 'Completed' : 'Pending'}
        </span>
      </div>

      <p className="step-description">{step.description}</p>

      {showActions && (
        <div className="flex gap-4">
          {canComplete && (
            <button
              onClick={handleComplete}
              className="button button-success button-small"
            >
              ✅ Mark Complete
            </button>
          )}

          {canEdit && (
            <button
              onClick={handleDelete}
              className="button button-danger button-small"
            >
              🗑️ Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default StepCard;
