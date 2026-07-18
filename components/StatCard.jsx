export default function StatCard({ label, value, accent }) {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4">
      <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide mb-1">
        {label}
      </p>
      <p
        className="text-2xl font-[family-name:var(--font-data)] font-medium"
        style={{ color: accent || "var(--color-text)" }}
      >
        {value}
      </p>
    </div>
  );
}