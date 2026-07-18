"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Topbar from "@/components/Topbar";
import ScanError from "@/components/ScanError";
import StatCard from "@/components/StatCard";
import SeverityBar from "@/components/SeverityBar";
import FindingsTable from "@/components/FindingsTable";

export default function Dashboard() {
  const { status } = useSession();
  const router = useRouter();
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/scan").then((r) => r.json()).then(setScan);
    }
  }, [status]);

  const rescan = () => {
    setLoading(true);
    fetch("/api/scan", { method: "POST" })
      .then((r) => r.json())
      .then((data) => {
        setScan(data);
        setLoading(false);
      });
  };

  if (status === "loading" || status === "unauthenticated") {
    return (
      <>
        <Topbar />
        <p className="p-8 text-[var(--color-text-muted)]">Loading...</p>
      </>
    );
  }

  if (!scan) {
    return (
      <>
        <Topbar />
        <p className="p-8 text-[var(--color-text-muted)]">Loading...</p>
      </>
    );
  }

 const allFindings = [
    ...(scan.modules?.github?.findings || []).map((f) => ({ ...f, module: "github" })),
    ...(scan.modules?.deps?.findings || []).map((f) => ({
      module: "deps",
      _id: f._id,
      severity: f.severity,
      detail: `${f.package}@${f.version} — ${f.vulnId}`,
      fixHint: f.summary,
      acknowledged: f.acknowledged,
    })),
  ];

  const counts = allFindings.reduce((acc, f) => {
    acc[f.severity] = (acc[f.severity] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <Topbar />
      <main className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-[family-name:var(--font-display)] text-xl">
            Exposure Report
          </h1>
          <button
            onClick={rescan}
            disabled={loading}
            className="px-4 py-2 bg-[var(--color-signal)] text-[#0A0E12] rounded font-medium text-sm disabled:opacity-50"
          >
            {loading ? "Scanning..." : "Rescan"}
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-3">
          <StatCard label="Score" value={scan.overallScore} accent="var(--color-signal)" />
          <StatCard label="Critical" value={counts.CRITICAL || 0} accent="var(--color-critical)" />
          <StatCard label="High" value={counts.HIGH || 0} accent="var(--color-high)" />
          <StatCard label="Total" value={allFindings.length} />
        </div>

        {scan.modules?.github?.failed && <ScanError module="GitHub" />}
        {scan.modules?.deps?.failed && <ScanError module="Dependency" />}

        <div className="mb-8">
          <SeverityBar counts={counts} />
        </div>

        <FindingsTable
          findings={allFindings}
          scanId={scan._id}
          onAcknowledge={setScan}
        />
      </main>
    </>
  );
}