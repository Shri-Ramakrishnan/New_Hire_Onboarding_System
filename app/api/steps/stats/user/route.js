import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/api/_lib/db';
import Step from '@/app/api/_lib/models/Step';

export async function GET() {
  await connectToDatabase();

  const userSteps = await Step.find({ assignedTo: 'user' });

  const totalSteps = userSteps.length;
  const completedSteps = userSteps.filter(step => step.completed).length;

  return NextResponse.json({ totalSteps, completedSteps });
}
