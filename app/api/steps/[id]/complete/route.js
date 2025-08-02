
import { connectToDatabase } from '@/app/api/_lib/db';
import Step from '@/app/api/_lib/models/Step';

export async function PATCH(req, { params }) {
  await connectToDatabase();
  const step = await Step.findByIdAndUpdate(
    params.id,
    { completed: true, completedAt: new Date() },
    { new: true }
  );
  return Response.json(step);
}
