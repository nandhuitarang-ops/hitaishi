"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

interface MatchButtonProps {
  studentId: string;
  mentorId: string;
  mentorName: string;
}

export function MatchButton({ studentId, mentorId, mentorName }: MatchButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAssign = async () => {
    if (!confirm(`Assign ${mentorName} as mentor?`)) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, mentorId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Assignment failed");
      }

      alert("Mentor assigned successfully! Notifications and emails have been sent.");
      router.push(`/admin/students/${studentId}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleAssign}
        disabled={loading}
        size="md"
        className="w-full"
      >
        {loading ? "Assigning..." : `Assign ${mentorName}`}
      </Button>
      {error && (
        <p className="text-xs text-red-600 text-center">{error}</p>
      )}
    </div>
  );
}
