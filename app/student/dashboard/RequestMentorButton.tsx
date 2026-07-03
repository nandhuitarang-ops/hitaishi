"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

export function RequestMentorButton({ existingRequest }: { existingRequest?: { id: string; status: string; createdAt: Date } | null }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [requestStatus, setRequestStatus] = useState(existingRequest?.status || null);

  if (requestStatus === "pending") {
    return (
      <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200">
        <div className="flex items-center gap-2 text-sm text-amber-800">
          <span className="text-lg">⏳</span>
          <span className="font-medium">Mentor request pending</span>
        </div>
        <p className="text-xs text-amber-600 mt-1">
          An admin will review and match you with a mentor shortly.
        </p>
      </div>
    );
  }

  if (!showForm) {
    return (
      <Button
        onClick={() => setShowForm(true)}
        size="lg"
        className="mt-4 w-full sm:w-auto"
      >
        🎯 Request a Mentor
      </Button>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/student/request-mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setRequestStatus("pending");
      setShowForm(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Tell us what you're looking for in a mentor (optional)..."
        className="w-full rounded-2xl border border-rule bg-surface-card px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft transition-colors resize-none"
        rows={3}
        maxLength={500}
      />
      <div className="flex gap-3">
        <Button type="submit" size="md" disabled={loading} className="flex-1">
          {loading ? "Submitting..." : "Submit Request ✓"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="md"
          onClick={() => setShowForm(false)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
