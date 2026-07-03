"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

type Props = {
  id: string;
  source: "lead" | "verification";
};

export function MentorReviewActions({ id, source }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const [showReason, setShowReason] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = useCallback(async (action: "approve" | "reject") => {
    if (action === "reject" && !reason.trim()) return;
    setLoading(action);
    setError("");

    try {
      const res = await fetch("/api/admin/mentors/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, source, action, reason: reason.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Request failed.");
        setLoading(null);
        return;
      }
      setLoading(null);
      setDone(true);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(null);
    }
  }, [id, source, reason, router]);

  if (done) {
    return <span className="text-xs text-primary-deep font-medium">Done ✓</span>;
  }

  if (error) {
    return (
      <div className="flex flex-col gap-2">
        <div className="text-xs text-danger">{error}</div>
        <div className="flex items-center gap-2">
          <button
            className="chip-cta"
            onClick={() => submit("approve")}
            disabled={loading !== null}
          >
            {loading === "approve" ? "Approving…" : "Approve →"}
          </button>
          <button
            className="chip-ghost"
            onClick={() => setShowReason(true)}
            disabled={loading !== null}
          >
            Reject
          </button>
        </div>
      </div>
    );
  }

  if (showReason) {
    return (
      <div className="flex flex-col gap-2">
        <textarea
          className="w-60 h-20 text-xs border border-rule rounded-btn px-3 py-2 resize-none"
          placeholder="Reason for rejection (required, will be emailed)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={loading !== null}
        />
        <div className="flex items-center gap-2">
          <button
            className="chip-ghost"
            onClick={() => submit("reject")}
            disabled={loading !== null || !reason.trim()}
          >
            {loading === "reject" ? "Rejecting…" : "Confirm Reject"}
          </button>
          <button
            className="text-xs text-ink-soft hover:text-ink"
            onClick={() => { setShowReason(false); setReason(""); }}
            disabled={loading !== null}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        className="chip-cta"
        onClick={() => submit("approve")}
        disabled={loading !== null}
      >
        {loading === "approve" ? "Approving…" : "Approve →"}
      </button>
      <button
        className="chip-ghost"
        onClick={() => setShowReason(true)}
        disabled={loading !== null}
      >
        Reject
      </button>
    </div>
  );
}
