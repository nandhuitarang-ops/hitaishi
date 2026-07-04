"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

interface ReplyBoxProps {
  conversationId: string | null;
  studentName: string;
}

export function ReplyBox({ conversationId, studentName }: ReplyBoxProps) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim() || !conversationId || sending) return;

    setSending(true);
    try {
      const res = await fetch(`/api/chat/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      setBody("");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (!conversationId) {
    return (
      <div className="border-t border-rule p-4 text-center text-xs text-ink-faint">
        No active conversation found.
      </div>
    );
  }

  return (
    <form onSubmit={handleSend} className="border-t border-rule p-4 flex items-center gap-3">
      <input
        value={body}
        onChange={(e) => setBody(e.target.value)}
        disabled={sending}
        placeholder={`Reply to ${studentName}…`}
        className="flex-1 rounded-input border border-rule-strong px-3 py-2 text-sm focus:outline-none focus:border-primary disabled:opacity-50"
      />
      <Button type="submit" loading={sending} className="chip-cta !h-9 !py-0 !px-4">
        Send
      </Button>
    </form>
  );
}
