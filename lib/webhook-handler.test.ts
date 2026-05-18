import { describe, it, expect, beforeEach } from "vitest";
import { createHmac } from "node:crypto";
import { handleRazorpayWebhook } from "./webhook-handler";
import type { ProvisioningStore } from "./provisioning";

const SECRET = "whsec_test_xyz";

function sign(body: string): string {
  return createHmac("sha256", SECRET).update(body).digest("hex");
}

function makeStore(): ProvisioningStore {
  const seen = new Map<string, boolean>();
  return {
    async withTransaction(fn) {
      return fn();
    },
    async claimWebhookEvent(id) {
      if (seen.has(id)) {
        return { firstTime: false, alreadyProcessed: seen.get(id)! };
      }
      seen.set(id, false);
      return { firstTime: true, alreadyProcessed: false };
    },
    async markWebhookProcessed(id) {
      seen.set(id, true);
    },
    async upsertStudentByEmail({ email }: { email: string }) {
      return { id: `user-${email}` };
    },
    async findPlanByCode(code) {
      return code === "JEE_ADV_6MO"
        ? { id: "plan-1", durationDays: 180, priceInr: 1499900 }
        : null;
    },
    async recordPayment() {
      return { id: "pay-row-1" };
    },
    async createSubscription() {
      return { id: "sub-1" };
    },
    async assignMentor() {
      return { mentorId: "mentor-1" };
    },
    async enqueueWelcome() {},
  };
}

const NOW_SEC = 1_726_000_000;
const captured = {
  id: "evt_001",
  entity: "event",
  event: "payment.captured",
  account_id: "acc",
  created_at: NOW_SEC,
  contains: ["payment"],
  payload: {
    payment: {
      entity: {
        id: "pay_1",
        order_id: "order_1",
        amount: 1499900,
        currency: "INR",
        status: "captured",
        email: "kid@indore.in",
        notes: { planCode: "JEE_ADV_6MO" },
      },
    },
  },
};

const fixedClock = () => new Date(NOW_SEC * 1000);

describe("handleRazorpayWebhook", () => {
  let store: ProvisioningStore;
  beforeEach(() => {
    store = makeStore();
  });

  it("rejects with 401 when signature missing", async () => {
    const body = JSON.stringify(captured);
    const r = await handleRazorpayWebhook(body, null, SECRET, store, fixedClock);
    expect(r.status).toBe(401);
  });

  it("rejects with 401 when signature is wrong", async () => {
    const body = JSON.stringify(captured);
    const r = await handleRazorpayWebhook(body, "deadbeef", SECRET, store, fixedClock);
    expect(r.status).toBe(401);
  });

  it("rejects with 400 on malformed JSON", async () => {
    const body = "not json";
    const r = await handleRazorpayWebhook(body, sign(body), SECRET, store, fixedClock);
    expect(r.status).toBe(400);
  });

  it("rejects with 400 on schema violation", async () => {
    const body = JSON.stringify({ ...captured, id: undefined });
    const r = await handleRazorpayWebhook(body, sign(body), SECRET, store, fixedClock);
    expect(r.status).toBe(400);
  });

  it("accepts valid signed payment.captured (200, provisioned)", async () => {
    const body = JSON.stringify(captured);
    const r = await handleRazorpayWebhook(body, sign(body), SECRET, store, fixedClock);
    expect(r.status).toBe(200);
    expect(r.body.success).toBe(true);
    if (!r.body.success) throw new Error(r.body.error);
    expect(r.body.data?.status).toBe("provisioned");
  });

  it("duplicate delivery returns 200 with duplicate status", async () => {
    const body = JSON.stringify(captured);
    await handleRazorpayWebhook(body, sign(body), SECRET, store, fixedClock);
    const r = await handleRazorpayWebhook(body, sign(body), SECRET, store, fixedClock);
    expect(r.status).toBe(200);
    if (!r.body.success) throw new Error(r.body.error);
    expect(r.body.data?.status).toBe("duplicate");
  });

  it("rejects events older than 24h (replay protection, M2)", async () => {
    const stale = { ...captured, id: "evt_stale", created_at: NOW_SEC - 25 * 3600 };
    const body = JSON.stringify(stale);
    const r = await handleRazorpayWebhook(body, sign(body), SECRET, store, fixedClock);
    expect(r.status).toBe(401);
    if (r.body.success) throw new Error("expected fail");
    expect(r.body.error).toMatch(/stale|replay|too old/i);
  });

  it("ignored event types return 200 with ignored status", async () => {
    const ignored = { ...captured, event: "payment.authorized" };
    const body = JSON.stringify(ignored);
    const r = await handleRazorpayWebhook(body, sign(body), SECRET, store, fixedClock);
    expect(r.status).toBe(200);
    if (!r.body.success) throw new Error(r.body.error);
    expect(r.body.data?.status).toBe("ignored");
  });
});
