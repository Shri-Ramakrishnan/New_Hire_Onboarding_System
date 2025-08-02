import express from 'express';
import User from '../models/User.js'; 
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, '-password'); 
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }, '-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});
export async function GET() {
  await connectToDatabase();
  const users = await User.find();
  return Response.json(users);
}

export async function POST(req) {
  await connectToDatabase();
  const data = await req.json();
  const newUser = new User(data);
  const savedUser = await newUser.save();
  return Response.json(savedUser);
}

router.post('/', async (req, res) => {
  const { name, username, role } = req.body;

  if (!name || !username || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const newUser = new User({ name, username, role });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

export default router;
