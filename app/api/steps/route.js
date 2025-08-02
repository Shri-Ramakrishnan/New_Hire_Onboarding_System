
import Step from '@/app/api/_lib/models/Step';
import { connectToDatabase } from '@/app/api/_lib/db';

export async function GET(req) {
  try {
    console.log('🔌 Attempting to connect to MongoDB...');
    await connectToDatabase();
    console.log('✅ Connected to MongoDB');

    const { searchParams } = new URL(req.url, 'http://localhost');
    const assignedTo = searchParams.get('assignedTo');

    const steps = assignedTo
      ? await Step.find({ assignedTo })
      : await Step.find({});

    console.log(`📦 Fetched ${steps.length} step(s)`);
    return Response.json(steps);
  } catch (error) {
    console.error('❌ GET /api/steps error:', error.message || error);
    return new Response(JSON.stringify({ error: 'Failed to fetch steps' }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  try {
    console.log('🔌 Attempting to connect to MongoDB...');
    await connectToDatabase();
    console.log('✅ Connected to MongoDB');

    const body = await req.json();
    const newStep = await Step.create(body);

    console.log('✅ Step created:', newStep);
    return Response.json(newStep, { status: 201 });
  } catch (error) {
    console.error('❌ POST /api/steps error:', error.message || error);
    return new Response(JSON.stringify({ error: 'Failed to create step' }), {
      status: 500,
    });
  }
}
