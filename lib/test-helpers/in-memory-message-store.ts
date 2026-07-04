import type { MessageStore } from "../messages";

export interface MessageStoreState {
  flagged: boolean;
  messages: Array<{
    id: string;
    conversationId: string;
    senderId: string;
    body: string;
    flags: string[];
  }>;
}

export function makeInMemoryMessageStore(opts: {
  conversationId: string;
  participantIds: string[];
  overrides?: Partial<MessageStore>;
}): MessageStore & { state: MessageStoreState } {
  const state: MessageStoreState = { flagged: false, messages: [] };
  let n = 1;

  const baseline: MessageStore = {
    async withTransaction(fn) {
      const snapshot: MessageStoreState = {
        flagged: state.flagged,
        messages: [...state.messages],
      };
      try {
        return await fn();
      } catch (e) {
        state.flagged = snapshot.flagged;
        state.messages = snapshot.messages;
        throw e;
      }
    },
    async getConversationParticipants(convId) {
      if (convId !== opts.conversationId) return null;
      return {
        participantIds: opts.participantIds,
        flagged: state.flagged,
      };
    },
    async insertMessage(input) {
      const row = { id: `msg-${n++}`, ...input };
      state.messages.push(row);
      return row;
    },
    async markConversationFlagged(convId) {
      if (convId === opts.conversationId) state.flagged = true;
    },
    async touchConversationActivity() {},
  };

  return { ...baseline, ...opts.overrides, state };
}
