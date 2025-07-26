import express from 'express';
import Step from '../models/Step.js';

const router = express.Router();

// ✅ Get all steps or steps for a specific user
router.get('/', async (req, res) => {
  try {
    const { assignedTo } = req.query;
    let query = {};

    if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    const steps = await Step.find(query);
    res.json(steps);
  } catch (err) {
    console.error('Error fetching steps:', err);
    res.status(500).json({ error: 'Failed to fetch steps' });
  }
});

// ✅ Get completion stats for a specific user
router.get('/stats/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const steps = await Step.find({ assignedTo: username });

    const total = steps.length;
    const completed = steps.filter(s => s.completed).length;
    const pending = total - completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.json({ total, completed, pending, percentage });
  } catch (err) {
    console.error('Error fetching user stats:', err);
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
});

// ✅ Create a step
router.post('/', async (req, res) => {
  try {
    const step = new Step(req.body);
    await step.save();
    res.status(201).json(step);
  } catch (err) {
    console.error('Error creating step:', err);
    res.status(400).json({ error: 'Failed to create step' });
  }
});

// ✅ Update a step
router.put('/:id', async (req, res) => {
  try {
    const step = await Step.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(step);
  } catch (err) {
    console.error('Error updating step:', err);
    res.status(400).json({ error: 'Failed to update step' });
  }
});

// ✅ Delete a step
router.delete('/:id', async (req, res) => {
  try {
    await Step.findByIdAndDelete(req.params.id);
    res.json({ message: 'Step deleted' });
  } catch (err) {
    console.error('Error deleting step:', err);
    res.status(400).json({ error: 'Failed to delete step' });
  }
});

// ✅ NEW: Complete a step
router.patch('/:id/complete', async (req, res) => {
  try {
    const step = await Step.findById(req.params.id);
    if (!step) {
      return res.status(404).json({ message: 'Step not found' });
    }

    step.completed = true;
    await step.save();

    res.status(200).json(step);
  } catch (error) {
    console.error('Error completing step:', error);
    res.status(500).json({ message: 'Failed to complete step' });
  }
});

export default router;
