import { getServerSession } from "next-auth";
import connectDB from "@/lib/db";
import Scan from "@/models/Scan";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { scanGithub } from "@/lib/github";
// import { computeScore } from "@/lib/scoring";
import { scanDependencies } from "@/lib/depscan";
import { computeScore, combineScores } from "@/lib/scoring";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const githubFindings = await scanGithub(session.accessToken);
  const depFindings = await scanDependencies();

  const githubScore = computeScore(githubFindings);
  const depScore = computeScore(depFindings);
  const overallScore = combineScores(githubScore, depScore);

  const scan = await Scan.create({
    userId: session.user.id,
    modules: {
      github: { findings: githubFindings, score: githubScore },
      deps: { findings: depFindings, score: depScore },
    },
    overallScore,
  });

  return Response.json(scan);
}

export async function GET() {
  await connectDB();
  const scan = await Scan.findOne().sort({ timestamp: -1 });
  return Response.json(scan);
}