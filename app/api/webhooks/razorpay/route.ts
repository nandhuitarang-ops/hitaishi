import type { NextRequest } from "next/server";
import { handleRazorpayWebhook } from "@/lib/webhook-handler";
import type { ProvisioningStore } from "@/lib/provisioning";

import { fail } from "@/lib/api";

// TODO(phase-2f): swap this stub for the Drizzle-backed store wired against
// the live Postgres instance. Until then the route is gated by
// PROVISIONING_ENABLED=true so production webhooks 503 instead of looping.
const notWiredStore: ProvisioningStore = {
  async withTransaction(fn) {
    return fn();
  },
  async claimWebhookEvent() {
    throw new Error("ProvisioningStore not wired — see TODO(phase-2f)");
  },
  async markWebhookProcessed() {},
  async upsertStudentByEmail() {
    throw new Error("not wired");
  },
  async findPlanByCode() {
    return null;
  },
  async recordPayment() {
    throw new Error("not wired");
  },
  async createSubscription() {
    throw new Error("not wired");
  },
  async assignMentor() {
    throw new Error("not wired");
  },
  async enqueueWelcome() {},
};

export async function POST(req: NextRequest) {
  if (process.env.PROVISIONING_ENABLED !== "true") {
    return Response.json(fail("provisioning disabled"), {
      status: 503,
      headers: { "Retry-After": "86400" },
    });
  }
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    return Response.json(fail("misconfigured"), { status: 500 });
  }
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");
  const { status, body } = await handleRazorpayWebhook(
    rawBody,
    signature,
    secret,
    notWiredStore,
  );
  return Response.json(body, { status });
}
