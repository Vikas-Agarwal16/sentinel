export default function ScanError({ module }) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-critical)] rounded-lg mb-4">
      <span className="w-2 h-2 rounded-full bg-[var(--color-critical)] shrink-0" />
      <p className="text-sm text-[var(--color-text)]">
        <span className="font-medium">{module}</span> scan unavailable — showing partial results. Score may not reflect full exposure.
      </p>
    </div>
  );
}