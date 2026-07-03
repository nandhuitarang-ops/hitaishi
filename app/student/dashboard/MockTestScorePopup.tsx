"use client";

import { useState } from "react";
import { Modal, Button, Field, Input, Textarea } from "@/components/ui";

interface Props {
  studentName: string;
  onDismiss: () => void;
}

export function MockTestScorePopup({ studentName, onDismiss }: Props) {
  const [examName, setExamName] = useState("");
  const [score, setScore] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/student/mock-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examName,
          score: Number(score),
          totalMarks: totalMarks ? Number(totalMarks) : undefined,
          feedback: feedback || undefined,
        }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? "Failed to save");
      }
      setSaved(true);
      setTimeout(onDismiss, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (saved) {
    return (
      <Modal title="Score saved!" onClose={onDismiss}>
        <p className="text-sm text-ink-soft text-center py-4">
          Your mentor has been notified. Keep pushing!
        </p>
      </Modal>
    );
  }

  return (
    <Modal title="What was your latest mock test score?" onClose={onDismiss}>
      <p className="text-sm text-ink-soft mb-4">
        Hi {studentName}, share your latest mock test score so your mentor can
        track your progress.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Exam name" required>
          <Input
            placeholder="e.g. JEE Main Mock 3, Allen PT-12"
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            required
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Score" required>
            <Input
              type="number"
              min={0}
              placeholder="e.g. 180"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              required
            />
          </Field>

          <Field label="Total marks (optional)">
            <Input
              type="number"
              min={0}
              placeholder="e.g. 300"
              value={totalMarks}
              onChange={(e) => setTotalMarks(e.target.value)}
            />
          </Field>
        </div>

        <Field label="How did it go? (optional)">
          <Textarea
            rows={2}
            placeholder="Any notes for your mentor..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </Field>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="submit" size="lg" disabled={saving}>
            {saving ? "Saving…" : "Submit score"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={onDismiss}
            disabled={saving}
          >
            Skip for now
          </Button>
        </div>
      </form>
    </Modal>
  );
}
