"use client";
import { useState } from "react";

const SEVERITY_COLOR = {
  CRITICAL: "var(--color-critical)",
  HIGH: "var(--color-high)",
  MEDIUM: "var(--color-medium)",
  LOW: "var(--color-low)",
};

const TABS = ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"];

export default function FindingsTable({ findings }) {
  const [filter, setFilter] = useState("ALL");

  const filtered =
    filter === "ALL" ? findings : findings.filter((f) => f.severity === filter);

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
          {filtered.map((f, i) => (
            <div
              key={i}
              className="flex items-start gap-3 px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg"
            >
              <span
                className="mt-1 w-2 h-2 rounded-full shrink-0"
                style={{ background: SEVERITY_COLOR[f.severity] }}
              />
              <div className="min-w-0">
                <p className="font-[family-name:var(--font-data)] text-sm truncate">
                  {f.detail}
                </p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  {f.fixHint}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}