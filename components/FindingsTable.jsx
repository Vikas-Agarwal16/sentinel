"use client";
import { useState } from "react";

const SEVERITY_COLOR = {
  CRITICAL: "var(--color-critical)",
  HIGH: "var(--color-high)",
  MEDIUM: "var(--color-medium)",
  LOW: "var(--color-low)",
};

const TABS = ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"];

export default function FindingsTable({ findings, scanId, onAcknowledge }) {
  const [filter, setFilter] = useState("ALL");
  const [pending, setPending] = useState(null);

  const filtered =
    filter === "ALL" ? findings : findings.filter((f) => f.severity === filter);

  const handleAck = async (finding) => {
    setPending(finding._id);
    const res = await fetch("/api/scan/acknowledge", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scanId,
        findingId: finding._id,
        module: finding.module,
      }),
    });
    const updated = await res.json();
    setPending(null);
    onAcknowledge(updated);
  };

  return (
    <div>
      <div className="flex gap-1 mb-4 border-b border-[var(--color-border)]">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-2 text-xs font-[family-name:var(--font-data)] uppercase tracking-wide border-b-2 transition ${
              filter === tab
                ? "border-[var(--color-signal)] text-[var(--color-text)]"
                : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-[var(--color-text-muted)] font-[family-name:var(--font-data)] py-6 text-center">
          No findings in this category.
        </p>
      ) : (
        <div className="space-y-2">
          {filtered.map((f) => (
            <div
              key={f._id}
              className={`flex items-start gap-3 px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg ${
                f.acknowledged ? "opacity-50" : ""
              }`}
            >
              <span
                className="mt-1 w-2 h-2 rounded-full shrink-0"
                style={{ background: SEVERITY_COLOR[f.severity] }}
              />
              <div className="min-w-0 flex-1">
                <p className="font-[family-name:var(--font-data)] text-sm truncate">
                  {f.detail}
                </p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  {f.fixHint}
                </p>
              </div>
              <button
                onClick={() => handleAck(f)}
                disabled={pending === f._id}
                className="text-xs px-2 py-1 rounded border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] shrink-0 disabled:opacity-50"
              >
                {f.acknowledged ? "Undo" : "Ack"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}