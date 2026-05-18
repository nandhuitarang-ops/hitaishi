import { conversationChannel } from "./channels";
import { scanMessage, type ScanFlag } from "./content-scanner";

export interface MessageStore {
  /** Run db writes in a transaction. Rolls back on throw. */
  withTransaction<T>(fn: () => Promise<T>): Promise<T>;
  getConversationParticipants(conversationId: string): Promise<{
    participantIds: string[];
    flagged: boolean;
  } | null>;
  insertMessage(input: {
    conversationId: string;
    senderId: string;
    body: string;
    flags: ScanFlag[];
  }): Promise<{ id: string }>;
  /** Idempotent at the SQL layer (UPDATE ... WHERE flagged=false). */
  markConversationFlagged(conversationId: string): Promise<void>;
  touchConversationActivity(conversationId: string): Promise<void>;
}

export type RealtimeEvent =
  | {
      type: "message:new";
      payload: {
        id: string;
        conversationId: string;
        senderId: string;
        body: string;
        flags: ScanFlag[];
      };
    }
  | {
      type: "message:edited";
      payload: { id: string; conversationId: string; body: string };
    };

export interface RealtimePublisher {
  publish(channel: string, event: RealtimeEvent): Promise<void>;
}

export interface SendMessageInput {
  conversationId: string;
  senderId: string;
  body: string;
}

export type SendMessageResult =
  | { status: "sent"; messageId: string; flags: ScanFlag[] }
  | { status: "sent_unpublished"; messageId: string; flags: ScanFlag[] }
  | { status: "invalid"; reason: string }
  | { status: "forbidden" }
  | { status: "not_found" };

const MAX_BODY_CHARS = 4000;

/**
 * Persist a message and best-effort publish a realtime event.
 *
 * DB writes (insert + flag + touch) commit atomically in `withTransaction`.
 * The realtime publish happens AFTER commit; failure does not undo the row —
 * callers receive `sent_unpublished` and should rely on REST re-fetch to recover.
 */
export async function sendMessage(
  input: SendMessageInput,
  store: MessageStore,
  publisher: RealtimePublisher,
): Promise<SendMessageResult> {
  const trimmed = input.body.trim();
  if (trimmed.length === 0) {
    return { status: "invalid", reason: "empty body" };
  }
  if (input.body.length > MAX_BODY_CHARS) {
    return { status: "invalid", reason: "body too long" };
  }

  const conv = await store.getConversationParticipants(input.conversationId);
  if (!conv) return { status: "not_found" };
  if (!conv.participantIds.includes(input.senderId)) {
    return { status: "forbidden" };
  }

  const scan = scanMessage(input.body);

  const row = await store.withTransaction(async () => {
    const r = await store.insertMessage({
      conversationId: input.conversationId,
      senderId: input.senderId,
      body: input.body,
      flags: scan.flags,
    });
    if (!scan.clean) {
      // Idempotent at SQL layer; safe to call even if already flagged.
      await store.markConversationFlagged(input.conversationId);
    }
    await store.touchConversationActivity(input.conversationId);
    return r;
  });

  try {
    await publisher.publish(conversationChannel(input.conversationId), {
      type: "message:new",
      payload: {
        id: row.id,
        conversationId: input.conversationId,
        senderId: input.senderId,
        body: input.body,
        flags: scan.flags,
      },
    });
  } catch {
    return { status: "sent_unpublished", messageId: row.id, flags: scan.flags };
  }

  return { status: "sent", messageId: row.id, flags: scan.flags };
}
