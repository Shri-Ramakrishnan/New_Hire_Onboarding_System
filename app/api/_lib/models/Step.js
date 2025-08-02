import mongoose from 'mongoose';

const StepSchema = new mongoose.Schema({
  title: String,
  description: String,
  assignedTo: String,
  completed: Boolean
});

export default mongoose.models.Step || mongoose.model('Step', StepSchema);
