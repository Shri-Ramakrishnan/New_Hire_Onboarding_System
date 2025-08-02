import Step from '@/app/api/_lib/models/Step';
import { connectToDatabase } from '@/app/api/_lib/db';


export async function GET(req, { params }) {
  await connectToDatabase();
  const step = await Step.findById(params.id);
  if (!step) return new Response('Step not found', { status: 404 });
  return Response.json(step);
}

export async function PUT(req, { params }) {
  await connectToDatabase();
  const updates = await req.json();
  const updatedStep = await Step.findByIdAndUpdate(params.id, updates, { new: true });
  return Response.json(updatedStep);
}

export async function DELETE(req, { params }) {
  await connectToDatabase();
  await Step.findByIdAndDelete(params.id);
  return Response.json({ message: 'Step deleted successfully' }, { status: 200 });
}

