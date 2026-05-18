import type { Role } from "./rbac";

const SAFE_ID = /^[a-zA-Z0-9_-]+$/;

export function conversationChannel(conversationId: string): string {
  if (!conversationId || !SAFE_ID.test(conversationId)) {
    throw new Error("invalid conversation id");
  }
  return `private-conversation-${conversationId}`;
}

export function presenceChannel(userId: string): string {
  if (!userId || !SAFE_ID.test(userId)) {
    throw new Error("invalid user id");
  }
  return `presence-user-${userId}`;
}

export interface ChannelAuthzInput {
  channel: string;
  userId: string;
  participantIds: string[];
  role?: Role;
}

export function isAuthorizedForChannel(input: ChannelAuthzInput): boolean {
  const { channel, userId, participantIds, role } = input;

  if (channel.startsWith("private-conversation-")) {
    if (role === "admin") return true; // oversight per spec §A.04
    return participantIds.includes(userId);
  }

  if (channel.startsWith("presence-user-")) {
    const target = channel.slice("presence-user-".length);
    return target === userId;
  }

  return false;
}
