const SEVERITY_COLOR = {
  CRITICAL: "var(--color-critical)",
  HIGH: "var(--color-high)",
  MEDIUM: "var(--color-medium)",
  LOW: "var(--color-low)",
};

export default function FindingsList({ findings }) {
  if (!findings?.length) {
    return <p className="font-[family-name:var(--font-data)] text-sm opacity-60">No findings. Clean scan.</p>;
  }

  return (
    <div className="space-y-3">
      {findings.map((f, i) => (
        <div key={i} className="pl-3 py-2 bg-[var(--color-surface)] rounded" style={{ borderLeft: `3px solid ${SEVERITY_COLOR[f.severity]}` }}>
          <p className="font-[family-name:var(--font-data)] text-sm">{f.detail}</p>
          <p className="text-xs opacity-60 mt-1">{f.fixHint}</p>
        </div>
      ))}
    </div>
  );
}