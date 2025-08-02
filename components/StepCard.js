import { Auth } from '../utils/auth.js';
import { deleteStep, updateStep } from '../utils/api.js';

const StepCard = ({ step, onUpdate, showActions = true, isAdminView = false }) => {
  const user = Auth.getCurrentUser();

  const isCompleted = step.completed;
  const canComplete =
    user && user.role === 'user' && step.assignedTo === user.username && !isCompleted;
  const canEdit = user && user.role === 'admin';

  const handleComplete = async () => {
    if (!canComplete) return;
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
  };

  const handleDelete = async () => {
    if (!canEdit) return;
    const confirmed = window.confirm('Are you sure you want to delete this step?');
    if (!confirmed) return;

    try {
      await deleteStep(step._id);
      if (onUpdate) {
        onUpdate(null, 'deleted');
      }
    } catch (err) {
      console.error('❌ Error deleting step:', err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className={`step-card ${isCompleted ? 'completed' : ''} border rounded p-4 mb-4 shadow`}>
      <div className="step-header flex justify-between items-start mb-2">
        <div>
          <h3 className="step-title text-xl font-semibold">{step.title}</h3>

          {isAdminView && (
            <div className="text-sm text-gray-500 mb-1">
              Assigned to: <strong>{step.assignedTo}</strong>
            </div>
          )}

          {step.createdAt && (
            <div className="text-sm text-gray-500">
              Created: {formatDate(step.createdAt)}
            </div>
          )}

          {step.completedAt && (
            <div className="text-sm text-green-600">
              Completed: {formatDate(step.completedAt)}
            </div>
          )}
        </div>

        <span
          className={`step-status px-3 py-1 rounded text-sm font-medium ${
            isCompleted ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {isCompleted ? '✅ Completed' : '🕒 Pending'}
        </span>
      </div>

      <p className="step-description text-gray-700 mb-3">{step.description}</p>

      {showActions && (
        <div className="flex gap-3">
          {canComplete && (
            <button
              onClick={handleComplete}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            >
              ✅ Mark Complete
            </button>
          )}

          {canEdit && (
            <button
              onClick={handleDelete}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
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
