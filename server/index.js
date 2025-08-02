import express from 'express';
import connectDB from './lib/db.js';
import userRoutes from './routes/users.js';
import stepRoutes from './routes/steps.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

await connectDB();

app.use('/api/users', userRoutes);
app.use('/api/steps', stepRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
