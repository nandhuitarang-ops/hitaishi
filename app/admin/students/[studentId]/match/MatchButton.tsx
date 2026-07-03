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
  const [success, setSuccess] = useState(false);

  const handleAssign = async () => {
    if (!confirm(`Assign ${mentorName} as mentor?`)) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

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

      setSuccess(true);
      router.push(`/admin/students/${studentId}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleAssign}
        loading={loading}
        size="md"
        className="w-full"
      >
        {success ? "Assigned ✓" : `Assign ${mentorName}`}
      </Button>
      {error && (
        <p className="text-xs text-red-600 text-center">{error}</p>
      )}
    </div>
  );
}
