"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

interface Props {
  sessionId: string;
  sessionTitle: string;
  role: "student" | "mentor";
}

export function CompleteSessionButton({ sessionId, sessionTitle, role }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    if (loading) return;
    if (!confirm("Are you sure you want to mark this session as completed?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/session/${sessionId}/complete`, {
        method: "POST",
      });
      if (res.ok) {
        if (role === "student") {
          router.push(`/student/feedback?sessionId=${sessionId}&sessionTitle=${encodeURIComponent(sessionTitle)}`);
        } else {
          router.refresh();
        }
      } else {
        alert("Failed to mark session as completed.");
      }
    } catch (e) {
      alert("Error marking session as completed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleComplete}
      size="sm"
      variant="ghost"
      disabled={loading}
      className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200/50 rounded-btn px-2.5 py-1"
    >
      {loading ? "Completing..." : "Mark as done ✔"}
    </Button>
  );
}
