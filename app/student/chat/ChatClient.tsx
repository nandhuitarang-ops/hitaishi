"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardBody, LinkButton, Pill } from "@/components/ui";
import { initials } from "@/lib/format";
import { subscribeToConversation, subscribeToSidebar, type IncomingMessage } from "@/lib/realtime/client";

export type ConvListItem = {
  id: string;
  otherId: string | null;
  otherName: string;
  otherEmail: string;
  otherInstitute: string | null;
  otherLastLogin: string | null;
  lastMessageAt: string | null;
  lastMessagePreview: string;
  lastMessageSenderId: string | null;
  unread: number;
};

export type InitialMessage = {
  id: string;
  senderId: string;
  body: string;
  createdAt: string;
};

type Msg = InitialMessage & { pending?: boolean };

function fmtListTime(d: string | null): string {
  if (!d) return "";
  const dt = new Date(d);
  const now = new Date();
  const sameDay = dt.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = dt.toDateString() === yesterday.toDateString();
  const time = dt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  if (sameDay) return time;
  if (isYesterday) return "Yesterday";
  return dt.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

function fmtBubbleTime(d: string): string {
  const dt = new Date(d);
  return dt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function fmtLastSeen(d: string | null): string {
  if (!d) return "recently";
  const ms = Date.now() - new Date(d).getTime();
  const min = Math.floor(ms / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hr ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day} day${day > 1 ? "s" : ""} ago`;
  return new Date(d).toLocaleDateString();
}

function isOnline(d: string | null): boolean {
  if (!d) return false;
  return Date.now() - new Date(d).getTime() < 5 * 60 * 1000;
}

function dayDivider(d: string): string {
  const dt = new Date(d);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (dt.toDateString() === now.toDateString()) return "Today";
  if (dt.toDateString() === yesterday.toDateString()) return "Yesterday";
  return dt.toLocaleDateString("en-GB", { weekday: "long", day: "2-digit", month: "short", year: "numeric" });
}

function groupByDay(msgs: Msg[]): Array<{ day: string; items: Msg[] }> {
  const groups: Array<{ day: string; items: Msg[] }> = [];
  for (const m of msgs) {
    const d = dayDivider(m.createdAt);
    if (groups.length === 0 || groups[groups.length - 1]!.day !== d) {
      groups.push({ day: d, items: [m] });
    } else {
      groups[groups.length - 1]!.items.push(m);
    }
  }
  return groups;
}

export type RightPanelData = {
  participant: { name: string; email: string; institute: string | null; targetExam: string | null };
  upcomingSession: { id: string; title: string; scheduledAt: string; durationMinutes: number; meetLink: string | null } | null;
  role: "student" | "mentor";
};

export function ChatClient({
  userId,
  userName,
  initialConvs,
  initialActiveId,
  initialMessages,
  rightPanelData,
}: {
  userId: string;
  userName: string;
  initialConvs: ConvListItem[];
  initialActiveId: string | null;
  initialMessages: InitialMessage[];
  rightPanelData: RightPanelData;
}) {
  const [convs, setConvs] = useState<ConvListItem[]>(initialConvs);
  const [activeId, setActiveId] = useState<string | null>(initialActiveId);
  const [messagesByConv, setMessagesByConv] = useState<Record<string, Msg[]>>(() =>
    initialActiveId && initialMessages.length > 0 ? { [initialActiveId]: initialMessages as Msg[] } : {},
  );
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const active = useMemo(() => convs.find((c) => c.id === activeId) ?? null, [convs, activeId]);
  const activeMessages = useMemo(() => (activeId ? messagesByConv[activeId] ?? [] : []), [messagesByConv, activeId]);
  const filtered = useMemo(() => {
    if (!search.trim()) return convs;
    const q = search.toLowerCase();
    return convs.filter((c) => c.otherName.toLowerCase().includes(q) || c.lastMessagePreview.toLowerCase().includes(q));
  }, [convs, search]);

  useEffect(() => {
    if (!activeId) return;
    const unsub = subscribeToConversation(activeId, (m: IncomingMessage) => {
      setMessagesByConv((prev) => {
        const existing = prev[m.conversationId] ?? [];
        if (existing.some((x) => x.id === m.id)) return prev;
        return { ...prev, [m.conversationId]: [...existing, m] };
      });
      setConvs((prev) => {
        const existing = prev.find((c) => c.id === m.conversationId);
        if (!existing) return prev;
        const updated = { ...existing, lastMessagePreview: m.body, lastMessageAt: m.createdAt, lastMessageSenderId: m.senderId };
        return [updated, ...prev.filter((c) => c.id !== m.conversationId)];
      });
    });
    return unsub;
  }, [activeId]);

  const sendingRef = useRef(false);
  const fetchMessagesRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (!activeId) return;
    let cancelled = false;

    function fetchMessages() {
      if (sendingRef.current) return;
      fetch(`/api/chat/conversations/${activeId}/messages`)
        .then((r) => r.json())
        .then((data) => {
          if (cancelled || sendingRef.current) return;
          setMessagesByConv((prev) => {
            const existing = prev[activeId!] ?? [];
            const fetched: Msg[] = (data.items || []).map((m: any) => ({ id: m.id, senderId: m.senderId, body: m.body, createdAt: m.createdAt }));
            const fetchedIds = new Set(fetched.map((m) => m.id));
            const pendingOnly = existing.filter((m) => m.pending && !fetchedIds.has(m.id));
            return { ...prev, [activeId!]: [...fetched, ...pendingOnly] };
          });
        })
        .catch(() => {});
    }

    fetchMessagesRef.current = fetchMessages;
    fetchMessages();
    const interval = setInterval(fetchMessages, 4000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [activeId]);

  useEffect(() => {
    const unsub = subscribeToSidebar((update) => {
      setConvs((prev) => {
        const existing = prev.find((c) => c.id === update.conversationId);
        if (!existing) return prev;
        const updated = { ...existing, lastMessagePreview: update.preview, lastMessageAt: update.createdAt, lastMessageSenderId: update.senderId };
        if (update.conversationId === activeId) return prev;
        return [updated, ...prev.filter((c) => c.id !== update.conversationId)];
      });
    });
    return unsub;
  }, [activeId]);

  useEffect(() => {
    if (!activeId) return;
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "supabase-message" && e.data?.conversationId !== activeId) {
        const m = e.data.payload;
        setMessagesByConv((prev) => {
          const existing = prev[m.conversationId] ?? [];
          if (existing.some((x) => x.id === m.id)) return prev;
          return { ...prev, [m.conversationId]: [...existing, m] };
        });
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [activeId]);

  useEffect(() => {
    if (activeId) {
      fetch(`/api/chat/conversations/${activeId}/read`, { method: "POST" }).catch(() => {});
      setConvs((prev) => prev.map((c) => (c.id === activeId ? { ...c, unread: 0 } : c)));
    }
  }, [activeId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [activeMessages.length, activeId]);

  useEffect(() => {
    const id = setInterval(() => setConvs((prev) => [...prev]), 30_000);
    return () => clearInterval(id);
  }, []);

  async function handleDelete() {
    if (!activeId || !active) return;
    if (!window.confirm(`Delete chat with ${active.otherName}? This will remove it from your sidebar.`)) return;
    try {
      const r = await fetch(`/api/chat/conversations/${activeId}/participants`, { method: "DELETE" });
      if (!r.ok) throw new Error("delete failed");
      setConvs((prev) => prev.filter((c) => c.id !== activeId));
      setMessagesByConv((prev) => { const n = { ...prev }; delete n[activeId!]; return n; });
      const next = convs.find((c) => c.id !== activeId);
      setActiveId(next?.id ?? null);
      setShowInfo(false);
    } catch {
      // silent
    }
  }

  async function deleteMessage(messageId: string) {
    if (!activeId) return;
    // Optimistic remove
    setMessagesByConv((prev) => ({
      ...prev,
      [activeId]: (prev[activeId] ?? []).filter((m) => m.id !== messageId),
    }));
    try {
      const r = await fetch(`/api/chat/conversations/${activeId}/messages/${messageId}`, { method: "DELETE" });
      if (!r.ok) throw new Error("Delete failed");
    } catch {
      // Optionally restore on error, but keep it simple
    }
  }

  async function send() {
    const body = draft.trim();
    if (!body || !activeId || sending) return;
    setSending(true);
    sendingRef.current = true;
    const optimistic: Msg = {
      id: `tmp-${Date.now()}`,
      senderId: userId,
      body,
      createdAt: new Date().toISOString(),
      pending: true,
    };
    setMessagesByConv((prev) => ({ ...prev, [activeId]: [...(prev[activeId] ?? []), optimistic] }));
    setDraft("");
    setConvs((prev) =>
      prev.map((c) => (c.id === activeId ? { ...c, lastMessagePreview: body, lastMessageAt: new Date().toISOString() } : c)),
    );
    try {
      const r = await fetch(`/api/chat/conversations/${activeId}/messages`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ body }),
      });
      if (!r.ok) throw new Error("send failed");
      const data = await r.json();
      setMessagesByConv((prev) => ({
        ...prev,
        [activeId]: (prev[activeId] ?? []).map((m) =>
          m.id === optimistic.id ? { ...m, id: data.id, pending: false } : m
        ),
      }));
    } catch {
      setMessagesByConv((prev) => ({ ...prev, [activeId]: (prev[activeId] ?? []).filter((m) => m.id !== optimistic.id) }));
    } finally {
      setSending(false);
      sendingRef.current = false;
      setTimeout(() => fetchMessagesRef.current(), 300);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[320px_1fr_320px] h-[calc(100vh-160px)] gap-0 border border-rule rounded-card overflow-hidden bg-surface-card">
      <aside className="flex flex-col border-r border-rule bg-surface-card min-h-0">
        <div className="p-3 border-b border-rule">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search or start a new chat"
            className="w-full rounded-input border border-rule-strong px-3 py-2 text-sm bg-surface-elevated focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-sm text-ink-soft text-center py-10 px-3">No conversations.</p>
          ) : (
            filtered.map((c) => {
              const isActive = c.id === activeId;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={`w-full text-left px-3 py-3 flex items-start gap-3 border-b border-rule hover:bg-surface-elevated transition-colors ${
                    isActive ? "bg-primary-soft" : ""
                  }`}
                >
                  <div className="avatar !w-11 !h-11 !text-sm flex-shrink-0">{initials(c.otherName)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-sm truncate">{c.otherName}</span>
                      <span className="meta text-[10px] flex-shrink-0">{fmtListTime(c.lastMessageAt)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <span className="text-xs text-ink-faint truncate">
                        {c.lastMessageSenderId === userId && <span className="text-ink-soft">You: </span>}
                        {c.lastMessagePreview || "No messages yet"}
                      </span>
                      {c.unread > 0 && (
                        <span className="bg-primary text-primary-on text-[10px] font-semibold rounded-full px-1.5 min-w-[18px] h-[18px] flex items-center justify-center flex-shrink-0">
                          {c.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      <section className="flex flex-col min-h-0 bg-surface-elevated">
        {active ? (
          <>
            <header className="px-4 py-3 border-b border-rule flex items-center gap-3 bg-surface-card">
              <div className="relative">
                <div className="avatar !w-10 !h-10 !text-sm">{initials(active.otherName)}</div>
                {isOnline(active.otherLastLogin) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-secondary border-2 border-surface-card rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{active.otherName}</div>
                <div className="meta">
                  {isOnline(active.otherLastLogin)
                    ? "Online"
                    : `Last seen ${fmtLastSeen(active.otherLastLogin)}`}
                </div>
              </div>
              <button
                onClick={() => setShowInfo((s) => !s)}
                aria-label="Conversation info"
                className="text-ink-soft hover:text-primary-deep p-2 rounded-full hover:bg-surface-elevated"
              >
                <span className="text-lg">ⓘ</span>
              </button>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
              {activeMessages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center max-w-sm">
                    <div className="font-serif text-lg mb-1">No messages yet</div>
                    <p className="text-sm text-ink-soft">Send a message to start the conversation.</p>
                  </div>
                </div>
              ) : (
                groupByDay(activeMessages).map((group) => (
                  <div key={group.day} className="flex flex-col gap-2">
                    <div className="flex justify-center my-2">
                      <span className="bg-surface-card border border-rule text-ink-soft text-[11px] px-2.5 py-0.5 rounded-full">
                        {group.day}
                      </span>
                    </div>
                    {group.items.map((m) => {
                      const mine = m.senderId === userId;
                      return (
                        <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[75%] rounded-card px-3.5 py-2 text-sm shadow-sm relative group ${
                              mine ? "bg-primary text-primary-on" : "bg-surface-card border border-rule text-ink"
                            } ${m.pending ? "opacity-60" : ""}`}
                          >
                            {/* Delete button for own messages */}
                            {mine && !m.pending && (
                              <button
                                onClick={() => deleteMessage(m.id)}
                                className="absolute -top-2 -right-2 w-5 h-5 bg-surface-card border border-rule rounded-full text-ink-faint hover:text-error text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Delete"
                              >
                                ×
                              </button>
                            )}
                            <div className="whitespace-pre-wrap break-words">{m.body}</div>
                            <div
                              className={`text-[10px] mt-0.5 ${mine ? "text-primary-on/70" : "text-ink-faint"} text-right`}
                            >
                              {fmtBubbleTime(m.createdAt)}
                              {m.pending && " · sending"}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            <footer className="px-3 py-3 border-t border-rule bg-surface-card flex items-end gap-2">
              <button aria-label="Attach" className="text-ink-soft hover:text-primary-deep p-2 rounded-full hover:bg-surface-elevated">
                <span className="text-lg">📎</span>
              </button>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Type a message"
                rows={1}
                disabled={sending}
                className="flex-1 resize-none rounded-input border border-rule-strong px-3 py-2 text-sm bg-surface-elevated focus:outline-none focus:border-primary disabled:opacity-50 max-h-32"
              />
              <button
                onClick={send}
                disabled={!draft.trim() || sending}
                aria-label="Send"
                className="bg-primary text-primary-on rounded-full w-10 h-10 flex items-center justify-center hover:bg-primary-deep disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              >
                <span className="text-lg">➤</span>
              </button>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-ink-soft">
            <div className="text-center">
              <div className="text-5xl mb-3">✎</div>
              <p className="text-sm">Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </section>

      {active && showInfo && (
        <aside className="hidden md:flex flex-col border-l border-rule bg-surface-card overflow-y-auto">
          <div className="p-5 text-center border-b border-rule">
            <div className="avatar !w-20 !h-20 !text-xl mx-auto">{initials(rightPanelData.participant.name)}</div>
            <div className="font-serif text-lg mt-3">{rightPanelData.participant.name}</div>
            <div className="meta">{rightPanelData.participant.email}</div>
          </div>
          <div className="p-4 border-b border-rule">
            <div className="meta mb-2">{rightPanelData.role === "student" ? "MENTOR PROFILE" : "STUDENT PROFILE"}</div>
            <div className="text-sm">
              <div className="flex justify-between py-1.5">
                <span className="text-ink-soft">Institute</span>
                <span>{rightPanelData.participant.institute ?? "—"}</span>
              </div>
              {rightPanelData.participant.targetExam && (
                <div className="flex justify-between py-1.5">
                  <span className="text-ink-soft">Target exam</span>
                  <span>{rightPanelData.participant.targetExam}</span>
                </div>
              )}
              <div className="flex justify-between py-1.5">
                <span className="text-ink-soft">Email</span>
                <span className="truncate ml-2">{rightPanelData.participant.email}</span>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="meta mb-2">UPCOMING SESSION</div>
            {rightPanelData.upcomingSession ? (
              <Card>
                <CardBody>
                  <div className="font-medium text-sm">{rightPanelData.upcomingSession.title}</div>
                  <div className="meta mt-1">{new Date(rightPanelData.upcomingSession.scheduledAt).toLocaleString()}</div>
                  <div className="meta">{rightPanelData.upcomingSession.durationMinutes} min</div>
                  <LinkButton
                    href={rightPanelData.upcomingSession.meetLink || `/session/${rightPanelData.upcomingSession.id}`}
                    size="md"
                    className="mt-3 w-full"
                    target="_blank"
                  >
                    Join session
                  </LinkButton>
                </CardBody>
              </Card>
            ) : (
              <p className="text-sm text-ink-soft">No upcoming sessions.</p>
            )}
          </div>
          <div className="p-4 border-t border-rule">
            <button
              onClick={handleDelete}
              className="w-full text-sm text-danger hover:text-danger/80 underline underline-offset-2 transition-colors"
            >
              Delete chat
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}
