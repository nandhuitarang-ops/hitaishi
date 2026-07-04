"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Field, Select } from "@/components/ui";
import { Modal } from "@/components/ui/Modal";

interface MentorItem {
  id: string;
  fullName: string | null;
  email: string;
}

interface Props {
  studentId: string;
  studentName: string;
  mentors: MentorItem[];
}

export function AssignMentorButton({ studentId, studentName, mentors }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mentorId, setMentorId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAssign() {
    if (!mentorId) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, mentorId }),
      });
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error ?? "Failed to assign mentor");
      }
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="chip-ghost text-xs"
      >
        Assign
      </button>

      {open && (
        <Modal title="Assign mentor" onClose={() => setOpen(false)}>
          <p className="text-sm text-ink-soft mb-4">
            Assign a mentor to <strong>{studentName}</strong>.
            {mentors.length > 0
              ? " Any existing active assignment will be ended."
              : ""}
          </p>

          {mentors.length === 0 ? (
            <p className="text-sm text-amber-700 bg-amber-50 rounded-md px-3 py-2">
              No mentors available. Create a mentor account first.
            </p>
          ) : (
            <Field label="Select mentor" required>
              <Select
                value={mentorId}
                onChange={(e) => setMentorId(e.target.value)}
                required
              >
                <option value="">Choose a mentor…</option>
                {mentors.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.fullName ?? m.email} — {m.email}
                  </option>
                ))}
              </Select>
            </Field>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-md px-3 py-2 mt-3">
              {error}
            </p>
          )}

          <div className="flex gap-3 mt-6">
            <Button
              onClick={handleAssign}
              size="lg"
              disabled={saving || !mentorId || mentors.length === 0}
            >
              {saving ? "Assigning…" : "Assign"}
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
