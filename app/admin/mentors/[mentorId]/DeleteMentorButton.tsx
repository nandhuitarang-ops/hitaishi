"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

interface DeleteMentorButtonProps {
  mentorId: string;
  mentorName: string;
}

export function DeleteMentorButton({ mentorId, mentorName }: DeleteMentorButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const doubleCheck = confirm(
      `WARNING: Are you sure you want to delete ${mentorName}? This will end all of their active student assignments and suspend their account.`
    );
    if (!doubleCheck) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/mentors/${mentorId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete mentor");
      }

      router.push("/admin/mentors");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete mentor. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleDelete}
      loading={loading}
      variant="danger"
      size="md"
      className="w-full mt-4"
    >
      🗑️ Delete Mentor
    </Button>
  );
}
