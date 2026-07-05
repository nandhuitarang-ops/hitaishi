"use client";

import { useEffect, useRef, useState } from "react";
import { Pill } from "@/components/ui";
import { subscribeToConversation, type IncomingMessage } from "@/lib/realtime/client";

interface Participant {
  id: string;
  name: string;
  role: "mentor" | "student";
  muted: boolean;
  raised: boolean;
  primary?: boolean;
}

interface Props {
  sessionId: string;
  meetLink: string | null;
  status: string;
  participants: Participant[];
  mentorName: string;
  currentUserId: string;
}

type ChatMsg = {
  id: string;
  senderId: string;
  body: string;
  createdAt: string;
  pending?: boolean;
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function SessionRoomClient({
  sessionId,
  meetLink,
  status,
  participants,
  mentorName,
  currentUserId,
}: Props) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentStatus === "live") return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/session/${sessionId}/status`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === "live") {
            setCurrentStatus("live");
            clearInterval(interval);
          }
        }
      } catch (e) {
        // ignore
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [sessionId, currentStatus]);

  useEffect(() => {
    if (!UUID_RE.test(sessionId)) {
      setLoadError("Invalid session id");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/session/${sessionId}/chat`);
        if (!res.ok) {
          if (!cancelled) setLoadError(`Chat unavailable (${res.status})`);
          return;
        }
        const data = await res.json();
        if (!cancelled && data?.conversationId) {
          setConversationId(data.conversationId);
        }
      } catch {
        if (!cancelled) setLoadError("Chat unavailable");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  useEffect(() => {
    if (!conversationId) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/chat/conversations/${conversationId}/messages`);
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) {
          const items: ChatMsg[] = (data.items ?? []).map((m: any) => ({
            id: m.id,
            senderId: m.senderId,
            body: m.body,
            createdAt: typeof m.createdAt === "string" ? m.createdAt : new Date(m.createdAt).toISOString(),
          }));
          setMessages(items);
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) return;
    const unsub = subscribeToConversation(conversationId, (m: IncomingMessage) => {
      setMessages((prev) => {
        if (prev.some((x) => x.id === m.id)) return prev;
        return [
          ...prev,
          {
            id: m.id,
            senderId: m.senderId,
            body: m.body,
            createdAt: m.createdAt,
          },
        ];
      });
    });
    return unsub;
  }, [conversationId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  async function send() {
    const body = draft.trim();
    if (!body || !conversationId || sending) return;
    const clientMsgId = crypto.randomUUID();
    const optimistic: ChatMsg = {
      id: clientMsgId,
      senderId: currentUserId,
      body,
      createdAt: new Date().toISOString(),
      pending: true,
    };
    setMessages((prev) => [...prev, optimistic]);
    setDraft("");
    setSending(true);
    try {
      const r = await fetch(`/api/chat/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-idempotency-key": clientMsgId },
        body: JSON.stringify({ body }),
      });
      if (!r.ok) throw new Error("send failed");
      const data: { id?: string } = await r.json().catch(() => ({}));
      const realId = data?.id;
      if (realId) {
        setMessages((prev) => {
          // If realtime already delivered the canonical row, drop the optimistic
          // (avoids the user's own message appearing twice).
          if (prev.some((x) => x.id === realId)) {
            return prev.filter((x) => x.id !== clientMsgId);
          }
          // Otherwise upgrade the optimistic's id to the canonical id and clear
          // the pending flag so a late realtime event with the same id dedups.
          return prev.map((x) =>
            x.id === clientMsgId ? { ...x, id: realId, pending: false } : x,
          );
        });
      } else {
        setMessages((prev) =>
          prev.map((x) => (x.id === clientMsgId ? { ...x, pending: false } : x)),
        );
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== clientMsgId));
    } finally {
      setSending(false);
    }
  }

  const senderName = (id: string) => {
    if (id === currentUserId) return "You";
    const p = participants.find((x) => x.id === id);
    return p?.name ?? "Participant";
  };

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-0">
      <section className="p-6 flex flex-col gap-4 overflow-y-auto">
        {meetLink && currentStatus === "live" ? (
          <div className="bg-[#16241d] rounded-card border border-white/10 aspect-video relative overflow-hidden">
            <iframe
              src={meetLink}
              className="w-full h-full border-0"
              allow="camera; microphone; fullscreen; display-capture"
              title="Jitsi Meet"
            />
          </div>
        ) : (
          <div className="bg-[#16241d] rounded-card border border-white/10 aspect-video relative flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center font-serif text-4xl mx-auto text-white/40">
                ?
              </div>
              <div className="mt-4 text-white/40 text-sm">
                Meet link will appear here when the session starts
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {participants.slice(1).map((p) => (
            <div
              key={p.id}
              className="bg-[#16241d] rounded-card border border-white/10 aspect-video flex flex-col items-center justify-center relative p-2"
            >
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-lg font-mono">
                {p.name[0]}
              </div>
              <div className="text-xs mt-2 text-white/80">{p.name}</div>
              <div className="absolute bottom-2 right-2 flex gap-1 text-xs">
                {p.raised && <Pill tone="coral">raised</Pill>}
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside className="bg-[#0a120e] border-l border-white/10 flex flex-col">
        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
          <div className="text-xs uppercase tracking-wider text-white/60 font-mono">
            Live chat &middot; {participants.length} in room
          </div>
        </div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 text-sm">
          {loadError ? (
            <div className="text-white/40 text-xs text-center py-8">{loadError}</div>
          ) : messages.length === 0 ? (
            <div className="text-white/40 text-xs text-center py-8">
              No messages yet. Say hello to start the conversation.
            </div>
          ) : (
            messages.map((m) => {
              const mine = m.senderId === currentUserId;
              return (
                <div key={m.id} className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
                  <div className="text-[10px] text-white/40 font-mono uppercase tracking-wider mb-0.5">
                    {senderName(m.senderId)}
                  </div>
                  <div
                    className={`max-w-[85%] rounded-card px-3 py-2 text-sm ${
                      mine ? "bg-primary text-primary-on" : "bg-white/5 text-white border border-white/10"
                    } ${m.pending ? "opacity-60" : ""}`}
                  >
                    {m.body}
                  </div>
                </div>
              );
            })
          )}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="border-t border-white/10 p-3 flex items-center gap-2"
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Message room&hellip;"
            className="flex-1 bg-white/5 border border-white/10 rounded-input px-3 py-2 text-sm focus:outline-none focus:border-primary"
            disabled={!conversationId}
          />
          <button
            type="submit"
            disabled={!draft.trim() || sending || !conversationId}
            className="px-3 py-2 rounded-btn bg-primary hover:bg-primary-hover text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </aside>
    </div>
  );
}
