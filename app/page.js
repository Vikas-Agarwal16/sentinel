"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
      {session ? (
        <div className="text-center font-[family-name:var(--font-body)]">
          <p>Signed in as {session.user?.name}</p>
          <button onClick={() => signOut()} className="mt-4 px-4 py-2 bg-[var(--color-signal)] text-[#0A0E12] rounded font-medium">
            Sign out
          </button>
        </div>
      ) : (
        <button onClick={() => signIn("github")} className="px-4 py-2 bg-[var(--color-signal)] text-[#0A0E12] rounded font-medium">
          Sign in with GitHub
        </button>
      )}
    </main>
  );
}