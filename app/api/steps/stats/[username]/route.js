import { connectToDatabase } from '@/app/api/_lib/db';
import Step from '@/app/api/_lib/models/Step';

export async function GET(req, { params }) {
  await connectToDatabase();
  const username = params.username;

  const all = await Step.find({ assignedTo: username });
  const total = all.length;
  const completed = all.filter(s => s.completed).length;
  const pending = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return Response.json({ total, completed, pending, percentage });
}
