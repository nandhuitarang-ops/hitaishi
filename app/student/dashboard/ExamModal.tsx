"use client";

import { useState, useEffect } from "react";
import { Button, Field, Input, Textarea, Pill, Card, CardHeader, CardBody } from "@/components/ui";
import { Modal } from "@/components/ui/Modal";

interface ExamResult {
  id: string;
  userId: string;
  examName: string;
  subject: string | null;
  score: string;
  totalMarks: string | null;
  feedback: string | null;
  createdAt: string;
}

interface Props {
  initialExams: ExamResult[];
}

export function ExamModal({ initialExams }: Props) {
  const [exams, setExams] = useState<ExamResult[]>(initialExams);
  const [showModal, setShowModal] = useState(false);
  const [examName, setExamName] = useState("");
  const [subject, setSubject] = useState("");
  const [score, setScore] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialExams.length === 0) {
      setShowModal(true);
    }
  }, [initialExams.length]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/exam-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examName,
          subject: subject || undefined,
          score: Number(score),
          totalMarks: totalMarks ? Number(totalMarks) : undefined,
          feedback: feedback || undefined,
        }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? "Failed to save exam");
      }
      const saved: ExamResult = await res.json();
      setExams((prev) => [saved, ...prev]);
      setExamName("");
      setSubject("");
      setScore("");
      setTotalMarks("");
      setFeedback("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {showModal && (
        <Modal title="Tell us about your exams" onClose={() => setShowModal(false)}>
          <p className="text-sm text-ink-soft mb-4">
            Share your previous exam details so we can personalise your
            mentorship.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Exam name" required>
              <Input
                name="examName"
                placeholder="e.g. JEE Main 2025, 12th Board"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                required
              />
            </Field>

            <Field label="Subject (optional)">
              <Input
                name="subject"
                placeholder="e.g. Physics, Maths, or leave blank for composite"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Score / Marks" required>
                <Input
                  type="number"
                  name="score"
                  min={0}
                  placeholder="e.g. 220"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  required
                />
              </Field>

              <Field label="Total marks (optional)">
                <Input
                  type="number"
                  name="totalMarks"
                  min={0}
                  placeholder="e.g. 300"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(e.target.value)}
                />
              </Field>
            </div>

            <Field label="Feedback / Notes (optional)">
              <Textarea
                name="feedback"
                rows={3}
                placeholder="How did it go? What would you like to improve?"
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
                {saving ? "Saving…" : "Save exam"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={() => setShowModal(false)}
                disabled={saving}
              >
                Skip
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {exams.length > 0 && (
        <Card>
          <CardHeader
            meta="YOUR EXAMS"
            title="Exam history"
            action={
              <Button variant="ghost" size="sm" onClick={() => setShowModal(true)}>
                + Add
              </Button>
            }
          />
          <CardBody>
            <div className="space-y-4">
              {exams.map((exam) => (
                <div
                  key={exam.id}
                  className="border border-rule rounded-card p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium">{exam.examName}</div>
                      {exam.subject && (
                        <Pill tone="primary" className="mt-1">
                          {exam.subject}
                        </Pill>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-serif text-xl font-medium">
                        {Number(exam.score).toLocaleString("en-IN")}
                        {exam.totalMarks
                          ? ` / ${Number(exam.totalMarks).toLocaleString("en-IN")}`
                          : ""}
                      </div>
                    </div>
                  </div>
                  {exam.feedback && (
                    <p className="text-sm text-ink-soft mt-2 italic">
                      &ldquo;{exam.feedback}&rdquo;
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4">
              <Button variant="ghost" size="md" onClick={() => setShowModal(true)}>
                + Add another exam
              </Button>
            </div>
          </CardBody>
        </Card>
      )}
    </>
  );
}
