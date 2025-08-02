'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  fetchSteps,
  addStep,
  updateStep,
  deleteStep,
  getUserCompletionStats,
} from '@/utils/api';

export default function AdminDashboard() {
  const [steps, setSteps] = useState([]);
  const [newStep, setNewStep] = useState({
    title: '',
    description: '',
    assignedTo: '',
  });

  const fetchAllSteps = async () => {
    try {
      const data = await fetchSteps();
      setSteps(data);
    } catch (err) {
      console.error('Failed to load steps:', err.message);
    }
  };

  useEffect(() => {
    fetchAllSteps();
  }, []);

  const handleChange = (e) => {
    setNewStep({ ...newStep, [e.target.name]: e.target.value });
  };

  const handleAddStep = async () => {
    try {
      await addStep(newStep);
      setNewStep({ title: '', description: '', assignedTo: '' });
      fetchAllSteps();
    } catch (err) {
      console.error('Add step error:', err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteStep(id);
      fetchAllSteps();
    } catch (err) {
      console.error('Delete error:', err.message);
    }
  };

  const handleComplete = async (id, currentStatus) => {
    try {
      await updateStep(id, { completed: !currentStatus });
      fetchAllSteps();
    } catch (err) {
      console.error('Complete error:', err.message);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <Link href="/admin/manage">Manage Users</Link>

      <div className="add-step">
        <h2>Add New Step</h2>
        <input
          type="text"
          name="title"
          value={newStep.title}
          onChange={handleChange}
          placeholder="Title"
        />
        <input
          type="text"
          name="description"
          value={newStep.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <input
          type="text"
          name="assignedTo"
          value={newStep.assignedTo}
          onChange={handleChange}
          placeholder="Assign To (username)"
        />
        <button onClick={handleAddStep}>Add Step</button>
      </div>

      <div className="step-list">
        <h2>All Steps</h2>
        {steps.map((step) => (
          <div key={step._id} className="step-item">
            <p>
              <strong>{step.title}</strong> - {step.description}
            </p>
            <p>Assigned to: {step.assignedTo}</p>
            <p>Status: {step.completed ? 'Completed' : 'Pending'}</p>
            <button onClick={() => handleComplete(step._id, step.completed)}>
              Toggle Complete
            </button>
            <button onClick={() => handleDelete(step._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
