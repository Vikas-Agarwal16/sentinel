import { getServerSession } from "next-auth";
import connectDB from "@/lib/db";
import Scan from "@/models/Scan";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { scanGithub } from "@/lib/github";
import { computeScore, combineScores } from "@/lib/scoring";
import { scanDependencies } from "@/lib/depscan";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  let githubFindings = [];
  let githubScore = 100;
  let githubFailed = false;
  try {
    githubFindings = await scanGithub(session.accessToken);
    githubScore = computeScore(githubFindings);
  } catch (err) {
    console.error("GitHub scan failed:", err.message);
    githubFailed = true;
  }

  let depFindings = [];
  let depScore = 100;
  let depFailed = false;
  try {
    depFindings = await scanDependencies();
    depScore = computeScore(depFindings);
  } catch (err) {
    console.error("Dependency scan failed:", err.message);
    depFailed = true;
  }

  const overallScore = combineScores(githubScore, depScore);

  const scan = await Scan.create({
    userId: session.user.id,
    modules: {
      github: { findings: githubFindings, score: githubScore, failed: githubFailed },
      deps: { findings: depFindings, score: depScore, failed: depFailed },
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