const GITHUB_API = "https://api.github.com";

export async function fetchRepos(token) {
  const res = await fetch(`${GITHUB_API}/user/repos?per_page=100`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function fetchSecretAlerts(token, owner, repo) {
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/secret-scanning/alerts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return []; // 404 if no admin access — expected, not an error
  return res.json();
}

export async function scanGithub(token) {
  const repos = await fetchRepos(token);
  const findings = [];

  for (const repo of repos) {
    const alerts = await fetchSecretAlerts(token, repo.owner.login, repo.name);
    for (const alert of alerts) {
      findings.push({
        type: "leaked_secret",
        severity: "CRITICAL",
        detail: `${alert.secret_type} exposed in ${repo.name}`,
        fixHint: "Revoke and rotate this secret immediately",
      });
    }
    if (repo.private === false && repo.name.match(/config|secret|env/i)) {
      findings.push({
        type: "public_sensitive_repo",
        severity: "MEDIUM",
        detail: `Public repo "${repo.name}" name suggests sensitive content`,
        fixHint: "Review repo contents, make private if needed",
      });
    }
  }

  return findings;
}