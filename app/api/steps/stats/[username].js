import Step from '@/app/api/_lib/models/Step';
import { connectToDatabase } from '@/app/api/_lib/db';

export async function GET(req, { params }) {
  try {
    await connectToDatabase();

    const username = decodeURIComponent(params.username);

    const steps = await Step.find({ assignedTo: username });

    const total = steps.length;
    const completed = steps.filter(step => step.completed).length;
    const pending = total - completed;

    return Response.json({ total, completed, pending });
  } catch (error) {
    console.error('GET /api/steps/stats/[username] error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch stats' }),
      { status: 500 }
    );
  }
}
