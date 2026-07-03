"use client";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";

let _client: ReturnType<typeof createClient> | null = null;

function getEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
        "Add these to your deployment environment and rebuild."
    );
  }
  return { url, key };
}

function getClient() {
  if (_client) return _client;
  const { url, key } = getEnv();
  _client = createClient(url, key, {
    realtime: { params: { eventsPerSecond: 20 } },
    auth: { persistSession: false },
  });
  return _client;
}

export type IncomingMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: string;
};

export function subscribeToConversation(
  conversationId: string,
  onMessage: (msg: IncomingMessage) => void,
): () => void {
  const c = getClient();
  const channel: RealtimeChannel = c
    .channel(`messages-conv-${conversationId}`)
    .on(
      "broadcast",
      { event: "message:new" },
      (payload) => {
        onMessage({
          id: payload.id,
          conversationId: payload.conversation_id,
          senderId: payload.sender_id,
          body: payload.body,
          createdAt: payload.created_at,
        });
      },
    )
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` },
      (payload) => {
        const r = payload.new as any;
        onMessage({
          id: r.id,
          conversationId: r.conversation_id,
          senderId: r.sender_id,
          body: r.body,
          createdAt: r.created_at,
        });
      },
    )
    .subscribe();
  return () => {
    c.removeChannel(channel);
  };
}

export function subscribeToConversationList(
  userId: string,
  onChange: () => void,
): () => void {
  const c = getClient();
  const channel = c
    .channel("messages-list")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "messages" },
      () => onChange(),
    )
    .subscribe();
  return () => {
    c.removeChannel(channel);
  };
}

export type SidebarUpdate = {
  conversationId: string;
  preview: string;
  senderId: string;
  createdAt: string;
};

export function subscribeToSidebar(
  onUpdate: (update: SidebarUpdate) => void,
): () => void {
  const c = getClient();
  const channel = c
    .channel("sidebar-updates")
    .on("broadcast", { event: "sidebar:update" }, (payload) => {
      onUpdate({
        conversationId: payload.conversation_id,
        preview: payload.preview,
        senderId: payload.sender_id,
        createdAt: payload.created_at,
      });
    })
    .subscribe();
  return () => {
    c.removeChannel(channel);
  };
}
