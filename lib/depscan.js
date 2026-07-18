import fs from "fs";
import path from "path";

const OSV_URL = "https://api.osv.dev/v1/querybatch";
function getNpmDeps() {
  const pkgPath = path.join(process.cwd(), "package.json");
  if (!fs.existsSync(pkgPath)) return [];
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  return Object.entries(deps).map(([name, version]) => ({
    name,
    version: version.replace(/^[\^~]/, ""),
    ecosystem: "npm",
  }));
}

function mapSeverity(vuln) {
  const sev = vuln.database_specific?.severity || vuln.severity?.[0]?.score;
  if (!sev) return "LOW";
  const s = String(sev).toUpperCase();
  if (s.includes("CRITICAL")) return "CRITICAL";
  if (s.includes("HIGH")) return "HIGH";
  if (s.includes("MEDIUM") || s.includes("MODERATE")) return "MEDIUM";
  return "LOW";
}

async function getVulnDetails(id) {
  const res = await fetch(`https://api.osv.dev/v1/vulns/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function scanDependencies() {
  const deps = getNpmDeps();
  if (deps.length === 0) return [];

  const queries = deps.map((d) => ({
    package: { name: d.name, ecosystem: d.ecosystem },
    version: d.version,
  }));

  const res = await fetch(OSV_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ queries }),
  });

  if (!res.ok) throw new Error(`OSV query failed: ${res.status}`);

  const data = await res.json();
  const findings = [];

  for (let i = 0; i < data.results.length; i++) {
    const result = data.results[i];
    if (!result.vulns) continue;

    for (const vuln of result.vulns) {
      const detail = await getVulnDetails(vuln.id);
      findings.push({
        type: "DEPENDENCY_VULN",
        package: deps[i].name,
        version: deps[i].version,
        vulnId: vuln.id,
        severity: mapSeverity(detail || vuln),
        summary: detail?.summary || "No summary available",
      });
    }
  }

  return findings;
}