"use client";
import { useSession, signOut } from "next-auth/react";

export default function Topbar() {
  const { data: session } = useSession();

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
      <span className="font-[family-name:var(--font-display)] text-lg tracking-wide">
        Sentinel
      </span>
      <div className="flex items-center gap-3">
        <span className="text-sm text-[var(--color-text-muted)] font-[family-name:var(--font-data)]">
          {session?.user?.name}
        </span>
        <button
          onClick={() => signOut()}
          className="text-sm px-3 py-1.5 rounded border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] transition"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}