import { getServerSession } from "next-auth";
import connectDB from "@/lib/db";
import Scan from "@/models/Scan";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { scanGithub } from "@/lib/github";
import { computeScore } from "@/lib/scoring";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const findings = await scanGithub(session.accessToken);
  const score = computeScore(findings);

  const scan = await Scan.create({
    modules: { github: { findings, score } },
    overallScore: score,
  });

  return Response.json(scan);
}   
 
export async function GET() {
  await connectDB();
  const scan = await Scan.findOne().sort({ timestamp: -1 });
  return Response.json(scan);
}