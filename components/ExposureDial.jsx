"use client";

export default function ExposureDial({ score }) {
  const angle = -90 + (score / 100) * 180; // -90 (0) to +90 (100)
  const zoneColor = score >= 70 ? "var(--color-signal)" : score >= 40 ? "var(--color-medium)" : "var(--color-critical)";

  return (
    <svg viewBox="0 0 200 120" className="w-64 h-40">
      <path d="M 20 100 A 80 80 0 0 1 60 27" fill="none" stroke="var(--color-critical)" strokeWidth="10" />
      <path d="M 60 27 A 80 80 0 0 1 140 27" fill="none" stroke="var(--color-medium)" strokeWidth="10" />
      <path d="M 140 27 A 80 80 0 0 1 180 100" fill="none" stroke="var(--color-signal)" strokeWidth="10" />

      <g transform={`rotate(${angle}, 100, 100)`}>
        <line x1="100" y1="100" x2="100" y2="30" stroke="var(--color-text)" strokeWidth="3" />
      </g>
      <circle cx="100" cy="100" r="6" fill="var(--color-text)" />

      <text x="100" y="90" textAnchor="middle" fontFamily="var(--font-data)" fontSize="28" fill="var(--color-text)">
        {score}
      </text>
    </svg>
  );
}