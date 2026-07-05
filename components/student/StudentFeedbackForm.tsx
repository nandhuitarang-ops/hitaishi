"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Textarea } from "@/components/ui";

interface Props {
  mentorName: string;
  sessionId?: string;
  sessionTitle?: string;
}

export function StudentFeedbackForm({ mentorName, sessionId, sessionTitle }: Props) {
  const router = useRouter();
  const [rating, setRating] = useState<number>(5);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setErrorMsg("Please write some feedback comments.");
      return;
    }
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, content, sessionId }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to submit feedback.");
      }
      setSuccess(true);
      setContent("");
      setRating(5);
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-6">
        <p className="text-3xl">✨</p>
        <h4 className="font-serif text-xl font-medium text-ink mt-2">Feedback Submitted!</h4>
        <p className="text-sm text-ink-soft mt-1">Thank you. Your rating and comments have been shared with administrators.</p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-4 text-xs font-semibold text-primary hover:underline"
        >
          Submit another response
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {sessionTitle && (
        <div className="p-3.5 bg-primary/10 text-primary-deep border border-primary/20 rounded-xl text-xs">
          Feedback for Session: <strong className="text-ink font-semibold">{sessionTitle}</strong>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center gap-1.5">
          <span>⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-2">
          Rate your mentorship experience with {mentorName}
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="text-2xl transition-transform hover:scale-110 focus:outline-none"
            >
              <span className={star <= rating ? "text-[var(--color-primary)]" : "text-slate-300"}>
                ★
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-2">
          Your feedback comments
        </label>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share details about what went well, what could be improved, or how your prep is going..."
          rows={4}
          required
        />
      </div>

      <div className="pt-2">
        <Button type="submit" loading={loading}>
          Submit Feedback
        </Button>
      </div>
    </form>
  );
}
