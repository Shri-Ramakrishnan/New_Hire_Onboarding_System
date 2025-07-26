import mongoose from 'mongoose';

const stepSchema = new mongoose.Schema({
  title: String,
  description: String,
  assignedTo: String,
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date
});

const Step = mongoose.model('Step', stepSchema);

export default Step;
