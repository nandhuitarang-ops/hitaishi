import { describe, it, expect, beforeEach } from "vitest";
import { sendMessage, type RealtimePublisher, type RealtimeEvent } from "./messages";
import { makeInMemoryMessageStore } from "./test-helpers/in-memory-message-store";

const CONV_ID = "conv-1";
const SENDER = "user-A";
const OTHER = "user-B";

function makePublisher(opts: { failOnce?: boolean } = {}): RealtimePublisher & {
  events: Array<{ channel: string; event: RealtimeEvent }>;
} {
  const events: Array<{ channel: string; event: RealtimeEvent }> = [];
  let failed = false;
  return {
    events,
    async publish(channel, event) {
      if (opts.failOnce && !failed) {
        failed = true;
        throw new Error("simulated soketi outage");
      }
      events.push({ channel, event });
    },
  };
}

describe("sendMessage", () => {
  let store: ReturnType<typeof makeInMemoryMessageStore>;
  let pub: ReturnType<typeof makePublisher>;
  beforeEach(() => {
    store = makeInMemoryMessageStore({
      conversationId: CONV_ID,
      participantIds: [SENDER, OTHER],
    });
    pub = makePublisher();
  });

  it("delivers a clean message: persists + publishes typed message:new event", async () => {
    const r = await sendMessage(
      { conversationId: CONV_ID, senderId: SENDER, body: "hello mentor" },
      store,
      pub,
    );
    expect(r.status).toBe("sent");
    expect(store.state.messages).toHaveLength(1);
    expect(pub.events).toHaveLength(1);
    expect(pub.events[0].channel).toBe("private-conversation-conv-1");
    expect(pub.events[0].event.type).toBe("message:new");
  });

  it("rejects non-participants", async () => {
    const r = await sendMessage(
      { conversationId: CONV_ID, senderId: "user-Z", body: "spy" },
      store,
      pub,
    );
    expect(r.status).toBe("forbidden");
    expect(store.state.messages).toHaveLength(0);
    expect(pub.events).toHaveLength(0);
  });

  it("allows non-participants if they are admin", async () => {
    const r = await sendMessage(
      { conversationId: CONV_ID, senderId: "user-Z", body: "admin override", isAdmin: true },
      store,
      pub,
    );
    expect(r.status).toBe("sent");
    expect(store.state.messages).toHaveLength(1);
    expect(pub.events).toHaveLength(1);
  });

  it("rejects empty / whitespace bodies", async () => {
    const r = await sendMessage(
      { conversationId: CONV_ID, senderId: SENDER, body: "   " },
      store,
      pub,
    );
    expect(r.status).toBe("invalid");
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

  it("flags the conversation when body trips the scanner", async () => {
    const r = await sendMessage(
      { conversationId: CONV_ID, senderId: SENDER, body: "whatsapp me at 9876543210" },
      store,
      pub,
    );
    expect(r.status).toBe("sent");
    expect(store.state.flagged).toBe(true);
    expect(store.state.messages[0].flags).toContain("phone");
    expect(store.state.messages[0].flags).toContain("off_platform");
    if (pub.events[0].event.type !== "message:new") throw new Error("wrong type");
    expect(pub.events[0].event.payload.flags).toContain("phone");
  });

  it("publish failure does NOT roll back the persisted row (best-effort post-commit) (H1)", async () => {
    pub = makePublisher({ failOnce: true });
    const r = await sendMessage(
      { conversationId: CONV_ID, senderId: SENDER, body: "hello mentor" },
      store,
      pub,
    );
    // message is persisted, but the result tells the caller publish failed
    expect(r.status).toBe("sent_unpublished");
    expect(store.state.messages).toHaveLength(1);
    expect(pub.events).toHaveLength(0);
  });

  it("DB write failure rolls back atomically (no half-flagged conversation) (H1)", async () => {
    const broken = makeInMemoryMessageStore({
      conversationId: CONV_ID,
      participantIds: [SENDER, OTHER],
      overrides: {
        async insertMessage() {
          throw new Error("simulated FK violation");
        },
      },
    });
    await expect(
      sendMessage(
        { conversationId: CONV_ID, senderId: SENDER, body: "whatsapp me" },
        broken,
        pub,
      ),
    ).rejects.toThrow(/simulated/);
    expect(broken.state.messages).toHaveLength(0);
    expect(broken.state.flagged).toBe(false);
  });
});
