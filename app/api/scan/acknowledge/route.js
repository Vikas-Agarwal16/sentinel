import { getServerSession } from "next-auth";
import connectDB from "@/lib/db";
import Scan from "@/models/Scan";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { computeScore, combineScores } from "@/lib/scoring";

export async function PATCH(req) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { scanId, findingId, module } = await req.json();

  await connectDB();
  const scan = await Scan.findOne({ _id: scanId, userId: session.user.id });
  if (!scan) return Response.json({ error: "Not found" }, { status: 404 });

  const list = scan.modules[module].findings;
  const finding = list.id(findingId);
  if (!finding) return Response.json({ error: "Finding not found" }, { status: 404 });

  finding.acknowledged = !finding.acknowledged;

  scan.modules.github.score = computeScore(scan.modules.github.findings);
  scan.modules.deps.score = computeScore(scan.modules.deps.findings);
  scan.overallScore = combineScores(scan.modules.github.score, scan.modules.deps.score);

  await scan.save();
  return Response.json(scan);
}