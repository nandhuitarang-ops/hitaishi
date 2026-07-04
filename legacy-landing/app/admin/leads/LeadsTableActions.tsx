"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function LeadsTableActions({ count }: { count: number }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [clearing, setClearing] = useState(false);

  function refresh() {
    startTransition(() => router.refresh());
  }

  async function clearAll() {
    if (count === 0) return;
    if (!confirm(`Delete all ${count} leads? This cannot be undone.`)) return;
    setClearing(true);
    try {
      await fetch("/api/leads", { method: "DELETE" });
      startTransition(() => router.refresh());
    } finally {
      setClearing(false);
    }
  }

  const busy = isPending || clearing;

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={refresh}
        disabled={busy}
        className="h-10 px-5 rounded-full text-sm font-medium border border-[var(--color-border)] bg-[var(--color-surface-hover)] text-[var(--color-fg)] hover:border-[var(--color-border-hover)] transition-colors disabled:opacity-50"
      >
        {isPending ? "Refreshing…" : "Refresh"}
      </button>
      <button
        type="button"
        onClick={clearAll}
        disabled={busy || count === 0}
        className="h-10 px-5 rounded-full text-sm font-medium border border-[var(--color-border)] text-red-600 hover:border-red-400 hover:bg-red-50 transition-colors disabled:opacity-50"
      >
        {clearing ? "Clearing…" : "Clear all"}
      </button>
    </div>
  );
}
