import { describe, it, expect } from "vitest";
import {
  conversationChannel,
  presenceChannel,
  isAuthorizedForChannel,
} from "./channels";

describe("conversationChannel", () => {
  it("returns a Pusher private-prefixed channel name", () => {
    expect(conversationChannel("uuid-1")).toBe("private-conversation-uuid-1");
  });

  it("rejects empty or invalid conversation id", () => {
    expect(() => conversationChannel("")).toThrow();
    expect(() => conversationChannel("has spaces")).toThrow();
  });
});

describe("presenceChannel", () => {
  it("returns presence-user-<id>", () => {
    expect(presenceChannel("uuid-2")).toBe("presence-user-uuid-2");
  });
});

describe("isAuthorizedForChannel", () => {
  const conv = conversationChannel("conv-1");
  const pres = presenceChannel("user-A");

  it("allows participants on their conversation channel", () => {
    expect(
      isAuthorizedForChannel({
        channel: conv,
        userId: "user-A",
        participantIds: ["user-A", "user-B"],
      }),
    ).toBe(true);
  });

  it("denies non-participants on a conversation channel", () => {
    expect(
      isAuthorizedForChannel({
        channel: conv,
        userId: "user-Z",
        participantIds: ["user-A", "user-B"],
      }),
    ).toBe(false);
  });

  it("allows the user on their own presence channel", () => {
    expect(
      isAuthorizedForChannel({
        channel: pres,
        userId: "user-A",
        participantIds: [],
      }),
    ).toBe(true);
  });

  it("denies presence channel for other users", () => {
    expect(
      isAuthorizedForChannel({
        channel: pres,
        userId: "user-B",
        participantIds: [],
      }),
    ).toBe(false);
  });

  it("allows admin overrides on any conversation channel (oversight)", () => {
    expect(
      isAuthorizedForChannel({
        channel: conv,
        userId: "admin-1",
        participantIds: ["user-A"],
        role: "admin",
      }),
    ).toBe(true);
  });

  it("denies unknown channel shapes", () => {
    expect(
      isAuthorizedForChannel({
        channel: "garbage-channel",
        userId: "user-A",
        participantIds: ["user-A"],
      }),
    ).toBe(false);
  });
});
