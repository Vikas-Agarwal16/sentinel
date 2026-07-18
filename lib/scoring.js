const WEIGHTS = { CRITICAL: 25, HIGH: 12, MEDIUM: 5, LOW: 1 };

export function computeScore(findings) {
  const penalty = findings.reduce((sum, f) => {
    const decay = f.acknowledged ? 0.5 : 1.0;
    return sum + WEIGHTS[f.severity] * decay;
  }, 0);
  return Math.max(0, Math.min(100, 100 - penalty));
}

export function combineScores(githubScore, depScore) {
  return Math.round(githubScore * 0.65 + depScore * 0.35);
}