import type { NextRequest } from "next/server";
import { handleRazorpayWebhook } from "@/lib/webhook-handler";
import type { ProvisioningStore } from "@/lib/provisioning";

// TODO(phase-2f): swap this stub for the Drizzle-backed store wired against
// the live Postgres instance. Kept inline so the route compiles without a DB.
const notWiredStore: ProvisioningStore = {
  async claimWebhookEvent() {
    throw new Error("ProvisioningStore not wired — see TODO(phase-2f)");
  },
  async markWebhookProcessed() {},
  async findUserByEmail() {
    return null;
  },
  async createStudent() {
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
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    return Response.json(
      { success: false, error: "RAZORPAY_WEBHOOK_SECRET not configured" },
      { status: 500 },
    );
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
