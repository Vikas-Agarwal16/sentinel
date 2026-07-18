const COLORS = {
  CRITICAL: "var(--color-critical)",
  HIGH: "var(--color-high)",
  MEDIUM: "var(--color-medium)",
  LOW: "var(--color-low)",
};

export default function SeverityBar({ counts }) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  if (total === 0) {
    return (
      <div className="h-2 rounded-full bg-[var(--color-surface-2)]" />
    );
  }

  return (
    <div className="flex h-2 rounded-full overflow-hidden">
      {["CRITICAL", "HIGH", "MEDIUM", "LOW"].map((sev) =>
        counts[sev] > 0 ? (
          <div
            key={sev}
            style={{
              width: `${(counts[sev] / total) * 100}%`,
              background: COLORS[sev],
            }}
          />
        ) : null
      )}
    </div>
  );
}