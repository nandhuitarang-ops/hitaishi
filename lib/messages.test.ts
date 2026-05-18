import { describe, it, expect, beforeEach } from "vitest";
import { sendMessage, type MessageStore, type RealtimePublisher } from "./messages";

const CONV_ID = "conv-1";
const SENDER = "user-A";
const OTHER = "user-B";

function makeStore(participantIds: string[] = [SENDER, OTHER]): MessageStore & {
  state: {
    flagged: boolean;
    messages: Array<{ id: string; conversationId: string; senderId: string; body: string; flags: string[] }>;
  };
} {
  const state = {
    flagged: false,
    messages: [] as Array<{ id: string; conversationId: string; senderId: string; body: string; flags: string[] }>,
  };
  let n = 1;
  return {
    state,
    async getConversationParticipants(convId) {
      if (convId !== CONV_ID) return null;
      return { participantIds, flagged: state.flagged };
    },
    async insertMessage(input) {
      const row = { id: `msg-${n++}`, ...input };
      state.messages.push(row);
      return row;
    },
    async markConversationFlagged(convId) {
      if (convId === CONV_ID) state.flagged = true;
    },
    async touchConversationActivity() {},
  };
}

function makePublisher(): RealtimePublisher & {
  events: Array<{ channel: string; event: string; data: unknown }>;
} {
  const events: Array<{ channel: string; event: string; data: unknown }> = [];
  return {
    events,
    async publish(channel, event, data) {
      events.push({ channel, event, data });
    },
  };
}

describe("sendMessage", () => {
  let store: ReturnType<typeof makeStore>;
  let pub: ReturnType<typeof makePublisher>;
  beforeEach(() => {
    store = makeStore();
    pub = makePublisher();
  });

  it("delivers a clean message: persists + publishes to private channel", async () => {
    const r = await sendMessage(
      { conversationId: CONV_ID, senderId: SENDER, body: "hello mentor" },
      store,
      pub,
    );
    expect(r.status).toBe("sent");
    expect(store.state.messages).toHaveLength(1);
    expect(pub.events).toHaveLength(1);
    expect(pub.events[0].channel).toBe("private-conversation-conv-1");
    expect(pub.events[0].event).toBe("message:new");
  });

  it("rejects non-participants", async () => {
    const r = await sendMessage(
      { conversationId: CONV_ID, senderId: "user-Z", body: "spy message" },
      store,
      pub,
    );
    expect(r.status).toBe("forbidden");
    expect(store.state.messages).toHaveLength(0);
    expect(pub.events).toHaveLength(0);
  });

  it("rejects empty / whitespace bodies", async () => {
    const r = await sendMessage(
      { conversationId: CONV_ID, senderId: SENDER, body: "   " },
      store,
      pub,
    );
    expect(r.status).toBe("invalid");
    expect(store.state.messages).toHaveLength(0);
  });

  it("rejects messages over 4000 chars", async () => {
    const r = await sendMessage(
      { conversationId: CONV_ID, senderId: SENDER, body: "a".repeat(4001) },
      store,
      pub,
    );
    expect(r.status).toBe("invalid");
  });

  it("404 when conversation does not exist", async () => {
    const r = await sendMessage(
      { conversationId: "nope", senderId: SENDER, body: "hi" },
      store,
      pub,
    );
    expect(r.status).toBe("not_found");
  });

  it("flags the conversation and includes flags on the published payload", async () => {
    const r = await sendMessage(
      { conversationId: CONV_ID, senderId: SENDER, body: "whatsapp me at 9876543210" },
      store,
      pub,
    );
    expect(r.status).toBe("sent");
    expect(store.state.flagged).toBe(true);
    expect(store.state.messages[0].flags).toContain("phone");
    expect(store.state.messages[0].flags).toContain("off_platform");
    const payload = pub.events[0].data as { flags: string[] };
    expect(payload.flags).toContain("phone");
  });
});
