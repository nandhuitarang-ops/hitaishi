import { describe, it, expect, beforeEach } from "vitest";
import { provisionStudentAccess, type ProvisioningStore } from "./provisioning";
import type { RazorpayEvent } from "./razorpay-schema";

const PLAN = {
  id: "plan-uuid-1",
  code: "JEE_ADV_6MO",
  durationDays: 180,
  priceInr: 1499900,
};

const MENTOR_ID = "mentor-uuid-1";

interface State {
  webhooks: Map<string, { processedAt: Date | null; attempts: number }>;
  users: Map<string, { id: string; email: string; role: string; status: string }>;
  payments: Map<string, { id: string; orderId: string; amountInr: number }>;
  subscriptions: Array<{
    id: string;
    userId: string;
    planId: string;
    expiresAt: Date;
  }>;
  assignments: Array<{ studentId: string; mentorId: string }>;
  notifications: Array<{ recipientId: string; template: string }>;
}

function makeStore(
  overrides: Partial<ProvisioningStore> = {},
): ProvisioningStore & { state: State } {
  const state: State = {
    webhooks: new Map(),
    users: new Map(),
    payments: new Map(),
    subscriptions: [],
    assignments: [],
    notifications: [],
  };
  let nextId = 1;
  const id = (prefix: string) => `${prefix}-${nextId++}`;

  const baseline: ProvisioningStore = {
    async withTransaction(fn) {
      // In-memory snapshot/rollback for tests.
      const snapshot: State = {
        webhooks: new Map(state.webhooks),
        users: new Map(state.users),
        payments: new Map(state.payments),
        subscriptions: [...state.subscriptions],
        assignments: [...state.assignments],
        notifications: [...state.notifications],
      };
      try {
        return await fn();
      } catch (e) {
        state.webhooks = snapshot.webhooks;
        state.users = snapshot.users;
        state.payments = snapshot.payments;
        state.subscriptions = snapshot.subscriptions;
        state.assignments = snapshot.assignments;
        state.notifications = snapshot.notifications;
        throw e;
      }
    },
    async claimWebhookEvent(externalId) {
      const existing = state.webhooks.get(externalId);
      if (existing) {
        existing.attempts += 1;
        return { firstTime: false, alreadyProcessed: existing.processedAt !== null };
      }
      state.webhooks.set(externalId, { processedAt: null, attempts: 1 });
      return { firstTime: true, alreadyProcessed: false };
    },
    async markWebhookProcessed(externalId) {
      const e = state.webhooks.get(externalId);
      if (e) e.processedAt = new Date();
    },
    async upsertStudentByEmail({ email }) {
      for (const u of state.users.values()) {
        if (u.email === email) return u;
      }
      const u = { id: id("user"), email, role: "student", status: "active" };
      state.users.set(u.id, u);
      return u;
    },
    async findPlanByCode(code) {
      return code === PLAN.code ? PLAN : null;
    },
    async recordPayment(p) {
      const row = { id: id("payment"), orderId: p.orderId, amountInr: p.amountInr };
      state.payments.set(row.id, row);
      return row;
    },
    async createSubscription(s) {
      const row = {
        id: id("sub"),
        userId: s.userId,
        planId: s.planId,
        expiresAt: s.expiresAt,
      };
      state.subscriptions.push(row);
      return row;
    },
    async assignMentor(studentId) {
      state.assignments.push({ studentId, mentorId: MENTOR_ID });
      return { mentorId: MENTOR_ID };
    },
    async enqueueWelcome(recipientId) {
      state.notifications.push({ recipientId, template: "WELCOME" });
    },
  };

  return { ...baseline, ...overrides, state };
}

function captured(eventId: string, email = "s@x.com"): RazorpayEvent {
  return {
    kind: "payment.captured",
    eventId,
    createdAt: Math.floor(Date.now() / 1000),
    payment: {
      id: "pay_1",
      orderId: "order_1",
      amountInr: PLAN.priceInr,
      email,
      planCode: PLAN.code,
    },
  };
}

describe("provisionStudentAccess", () => {
  let store: ReturnType<typeof makeStore>;
  beforeEach(() => {
    store = makeStore();
  });

  it("first delivery creates user, payment, subscription, assignment, notification", async () => {
    const r = await provisionStudentAccess(captured("evt_1"), store);
    expect(r.status).toBe("provisioned");
    expect(store.state.users.size).toBe(1);
    expect(store.state.payments.size).toBe(1);
    expect(store.state.subscriptions).toHaveLength(1);
    expect(store.state.assignments).toHaveLength(1);
    expect(store.state.notifications).toHaveLength(1);
  });

  it("is idempotent: duplicate webhook delivery is a no-op", async () => {
    await provisionStudentAccess(captured("evt_dup"), store);
    const r = await provisionStudentAccess(captured("evt_dup"), store);
    expect(r.status).toBe("duplicate");
    expect(store.state.users.size).toBe(1);
    expect(store.state.subscriptions).toHaveLength(1);
  });

  it("reuses an existing user when email is already in the system", async () => {
    await provisionStudentAccess(captured("evt_a", "same@x.com"), store);
    await provisionStudentAccess(captured("evt_b", "same@x.com"), store);
    expect(store.state.users.size).toBe(1);
    expect(store.state.subscriptions).toHaveLength(2);
  });

  it("subscription expires 180 days after start for JEE_ADV_6MO", async () => {
    await provisionStudentAccess(captured("evt_exp"), store);
    const sub = store.state.subscriptions[0];
    const ms = sub.expiresAt.getTime() - Date.now();
    const days = Math.round(ms / 86_400_000);
    expect(days).toBeGreaterThanOrEqual(179);
    expect(days).toBeLessThanOrEqual(180);
  });

  it("throws on unknown plan code", async () => {
    const ev = captured("evt_badplan");
    if (ev.kind === "payment.captured") ev.payment.planCode = "DOES_NOT_EXIST";
    await expect(provisionStudentAccess(ev, store)).rejects.toThrow(/plan/i);
  });

  it("ignores non-payment-captured events", async () => {
    const ev: RazorpayEvent = {
      kind: "ignored",
      eventId: "evt_ig",
      createdAt: Math.floor(Date.now() / 1000),
      rawEvent: "payment.authorized",
    };
    const r = await provisionStudentAccess(ev, store);
    expect(r.status).toBe("ignored");
    expect(store.state.users.size).toBe(0);
  });

  it("rejects when paid amount doesn't match plan price (M7)", async () => {
    const ev = captured("evt_underpay");
    if (ev.kind === "payment.captured") ev.payment.amountInr = 1;
    await expect(provisionStudentAccess(ev, store)).rejects.toThrow(/amount/i);
    expect(store.state.users.size).toBe(0);
  });

  it("rolls back all writes when a step fails after partial success (H1)", async () => {
    const rigged = makeStore({
      createSubscription: async () => {
        throw new Error("simulated FK violation");
      },
    });
    await expect(
      provisionStudentAccess(captured("evt_rollback"), rigged),
    ).rejects.toThrow(/simulated/);
    expect(rigged.state.users.size).toBe(0);
    expect(rigged.state.payments.size).toBe(0);
    expect(rigged.state.subscriptions).toHaveLength(0);
    expect(rigged.state.assignments).toHaveLength(0);
    // webhook claim also rolls back so retry can succeed
    expect(rigged.state.webhooks.size).toBe(0);
  });
});
