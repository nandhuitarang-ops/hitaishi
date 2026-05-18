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
    async findUserByEmail() {
      return null;
    },
    async createStudent({ email }) {
      return { id: `user-${email}` };
    },
    async findPlanByCode(code) {
      return code === "JEE_ADV_6MO"
        ? { id: "plan-1", durationDays: 180 }
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

const captured = {
  id: "evt_001",
  entity: "event",
  event: "payment.captured",
  account_id: "acc",
  created_at: 1715000000,
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

describe("handleRazorpayWebhook", () => {
  let store: ProvisioningStore;
  beforeEach(() => {
    store = makeStore();
  });

  it("rejects with 401 when signature missing", async () => {
    const body = JSON.stringify(captured);
    const r = await handleRazorpayWebhook(body, null, SECRET, store);
    expect(r.status).toBe(401);
  });

  it("rejects with 401 when signature is wrong", async () => {
    const body = JSON.stringify(captured);
    const r = await handleRazorpayWebhook(body, "deadbeef", SECRET, store);
    expect(r.status).toBe(401);
  });

  it("rejects with 400 on malformed JSON", async () => {
    const body = "not json";
    const r = await handleRazorpayWebhook(body, sign(body), SECRET, store);
    expect(r.status).toBe(400);
  });

  it("rejects with 400 on schema violation", async () => {
    const body = JSON.stringify({ ...captured, id: undefined });
    const r = await handleRazorpayWebhook(body, sign(body), SECRET, store);
    expect(r.status).toBe(400);
  });

  it("accepts valid signed payment.captured (200, provisioned)", async () => {
    const body = JSON.stringify(captured);
    const r = await handleRazorpayWebhook(body, sign(body), SECRET, store);
    expect(r.status).toBe(200);
    expect(r.body.success).toBe(true);
    expect(r.body.data?.status).toBe("provisioned");
  });

  it("duplicate delivery returns 200 with duplicate status", async () => {
    const body = JSON.stringify(captured);
    await handleRazorpayWebhook(body, sign(body), SECRET, store);
    const r = await handleRazorpayWebhook(body, sign(body), SECRET, store);
    expect(r.status).toBe(200);
    expect(r.body.data?.status).toBe("duplicate");
  });

  it("ignored event types return 200 with ignored status", async () => {
    const ignored = { ...captured, event: "payment.authorized" };
    const body = JSON.stringify(ignored);
    const r = await handleRazorpayWebhook(body, sign(body), SECRET, store);
    expect(r.status).toBe(200);
    expect(r.body.data?.status).toBe("ignored");
  });
});
