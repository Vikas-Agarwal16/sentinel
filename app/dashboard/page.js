"use client";
import { useEffect, useState } from "react";
import ExposureDial from "@/components/ExposureDial";
import FindingsList from "@/components/FindingsList";

export default function Dashboard() {
  const [scan, setScan] = useState(null);

  useEffect(() => {
    fetch("/api/scan").then((r) => r.json()).then(setScan);
  }, []);

  const rescan = () => {
    fetch("/api/scan", { method: "POST" }).then((r) => r.json()).then(setScan);
  };

  if (!scan) return <p className="p-8">Loading...</p>;

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="font-[family-name:var(--font-display)] text-2xl mb-6">Exposure Report</h1>
      <div className="flex justify-center mb-6">
        <ExposureDial score={scan.overallScore} />
      </div>
      <button onClick={rescan} className="mb-6 px-4 py-2 bg-[var(--color-signal)] text-[#0A0E12] rounded font-medium">
        Rescan
      </button>
      <FindingsList findings={scan.modules?.github?.findings} />
    </main>
  );
}