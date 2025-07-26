import { Auth } from '../utils/auth.js';
import { deleteStep, updateStep } from '../utils/api.js'; // ✅ import backend functions

const StepCard = ({ step, onUpdate, showActions = true, isAdminView = false }) => {
  const user = Auth.getCurrentUser();
  const isCompleted = step.completed;
  const canComplete = user && user.role === 'user' && step.assignedTo === user.username && !isCompleted;
  const canEdit = user && user.role === 'admin';

  const handleComplete = async () => {
    if (canComplete) {
      try {
        const updatedStep = await updateStep(step._id, {
          completed: true,
          completedAt: new Date()
        });
        if (updatedStep && onUpdate) {
          onUpdate(updatedStep);
        }
      } catch (err) {
        console.error('❌ Error marking step complete:', err);
      }
    }
  };

  const handleDelete = async () => {
    if (canEdit && window.confirm('Are you sure you want to delete this step?')) {
      try {
        await deleteStep(step._id);
        if (onUpdate) {
          onUpdate(null, 'deleted');
        }
      } catch (err) {
        console.error('❌ Error deleting step:', err);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

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
