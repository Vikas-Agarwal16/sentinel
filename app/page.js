"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

const FEATURES = [
  {
    title: "GitHub secret scanning",
    desc: "Catches leaked credentials, tokens, and API keys across your repos.",
  },
  {
    title: "Dependency vulnerabilities",
    desc: "Cross-checks your packages against OSV.dev's live CVE database.",
  },
  {
    title: "Weighted exposure score",
    desc: "One number, 0–100, that reflects real risk — not just finding count.",
  },
];

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="min-h-screen">
      <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
        <span className="font-[family-name:var(--font-display)] text-lg tracking-wide">
          Sentinel
        </span>
        {session ? (
          <button
            onClick={() => signOut()}
            className="text-sm px-3 py-1.5 rounded border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] transition"
          >
            Sign out
          </button>
        ) : null}
      </header>

      <section className="max-w-3xl mx-auto px-6 pt-24 pb-16 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-4xl leading-tight mb-4">
          Know your digital exposure
          <br />
          before someone else finds it.
        </h1>
        <p className="text-[var(--color-text-muted)] text-base mb-8 max-w-xl mx-auto">
          Sentinel scans your GitHub repos and dependencies for leaked secrets
          and known vulnerabilities, then gives you one score to track.
        </p>

        {session ? (
          <Link
            href="/dashboard"
            className="inline-block px-6 py-3 bg-[var(--color-signal)] text-[#0A0E12] rounded font-medium"
          >
            Go to dashboard
          </Link>
        ) : (
          <button
            onClick={() => signIn("github")}
            className="px-6 py-3 bg-[var(--color-signal)] text-[#0A0E12] rounded font-medium"
          >
            Sign in with GitHub
          </button>
        )}
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-24 grid grid-cols-3 gap-4">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-5"
          >
            <h3 className="font-[family-name:var(--font-body)] font-medium text-sm mb-2">
              {f.title}
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              {f.desc}
            </p>
          </div>
        ))}
      </section>
    </main>
  );
}