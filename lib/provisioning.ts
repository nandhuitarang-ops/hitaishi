import { computeExpiry } from "./auth";
import type { RazorpayEvent } from "./razorpay-schema";

export interface ProvisioningStore {
  /**
   * Run `fn` inside a transaction. The in-memory test impl snapshots state and
   * restores it on throw; the Drizzle impl wraps in BEGIN/COMMIT/ROLLBACK.
   */
  withTransaction<T>(fn: () => Promise<T>): Promise<T>;
  claimWebhookEvent(externalId: string): Promise<{
    firstTime: boolean;
    alreadyProcessed: boolean;
  }>;
  markWebhookProcessed(externalId: string): Promise<void>;
  upsertStudentByEmail(input: { email: string }): Promise<{ id: string }>;
  findPlanByCode(code: string): Promise<{
    id: string;
    durationDays: number;
    priceInr: number;
  } | null>;
  recordPayment(input: {
    userId: string;
    orderId: string;
    razorpayPaymentId: string;
    amountInr: number;
  }): Promise<{ id: string }>;
  createSubscription(input: {
    userId: string;
    planId: string;
    paymentId: string;
    startedAt: Date;
    expiresAt: Date;
  }): Promise<{ id: string }>;
  assignMentor(studentId: string): Promise<{ mentorId: string }>;
  enqueueWelcome(recipientId: string): Promise<void>;
}

export type ProvisioningResult =
  | { status: "provisioned"; userId: string; subscriptionId: string }
  | { status: "duplicate"; eventId: string }
  | { status: "ignored"; eventId: string };

const DEFAULT_PLAN_CODE = "JEE_ADV_6MO";

export async function provisionStudentAccess(
  event: RazorpayEvent,
  store: ProvisioningStore,
): Promise<ProvisioningResult> {
  if (event.kind !== "payment.captured") {
    return { status: "ignored", eventId: event.eventId };
  }

  return store.withTransaction(async () => {
    const claim = await store.claimWebhookEvent(event.eventId);
    if (!claim.firstTime || claim.alreadyProcessed) {
      return { status: "duplicate" as const, eventId: event.eventId };
    }

    const planCode = event.payment.planCode ?? DEFAULT_PLAN_CODE;
    const plan = await store.findPlanByCode(planCode);
    if (!plan) {
      throw new Error(`unknown plan code: ${planCode}`);
    }
    if (event.payment.amountInr !== plan.priceInr) {
      throw new Error(
        `paid amount ${event.payment.amountInr} does not match plan price ${plan.priceInr}`,
      );
    }

    const user = await store.upsertStudentByEmail({ email: event.payment.email });

    const payment = await store.recordPayment({
      userId: user.id,
      orderId: event.payment.orderId,
      razorpayPaymentId: event.payment.id,
      amountInr: event.payment.amountInr,
    });

    const startedAt = new Date();
    const sub = await store.createSubscription({
      userId: user.id,
      planId: plan.id,
      paymentId: payment.id,
      startedAt,
      expiresAt: computeExpiry(startedAt, plan.durationDays),
    });

    await store.assignMentor(user.id);
    await store.enqueueWelcome(user.id);
    await store.markWebhookProcessed(event.eventId);

    return {
      status: "provisioned" as const,
      userId: user.id,
      subscriptionId: sub.id,
    };
  });
}
