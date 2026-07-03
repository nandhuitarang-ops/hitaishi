"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const TABS = [
  { key: "all", label: "All" },
  { key: "waiting", label: "Waiting" },
  { key: "answered", label: "Answered" },
  { key: "resolved", label: "Resolved" },
] as const;

export type TabKey = (typeof TABS)[number]["key"];

export function DoubtTabs({ counts }: { counts: Record<TabKey, number> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = (searchParams.get("tab") as TabKey) || "all";

  const setTab = useCallback(
    (key: TabKey) => {
      const p = new URLSearchParams(searchParams.toString());
      if (key === "all") {
        p.delete("tab");
      } else {
        p.set("tab", key);
      }
      router.push(`/student/doubts?${p.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  return (
    <div className="flex flex-wrap gap-2 mb-5">
      {TABS.map((t) => (
        <button
          key={t.key}
          onClick={() => setTab(t.key)}
          className={`px-4 py-2 rounded-pill text-sm font-medium transition-colors ${
            active === t.key
              ? "bg-primary text-primary-on"
              : "bg-surface-card border border-rule text-ink-soft hover:bg-surface-elevated"
          }`}
        >
          {t.label}
          <span className="ml-1.5 font-mono text-xs opacity-70">{counts[t.key]}</span>
        </button>
      ))}
    </div>
  );
}
