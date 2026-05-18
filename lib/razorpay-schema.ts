import { z } from "zod";

const paymentEntitySchema = z.object({
  id: z.string().min(1),
  order_id: z.string().min(1),
  amount: z.number().int().positive(),
  currency: z.literal("INR"),
  status: z.string(),
  method: z.enum(["upi", "card", "netbanking", "emi"]).optional(),
  email: z.string().trim().toLowerCase().pipe(z.string().email()),
  contact: z.string().optional(),
  notes: z.record(z.string()).optional(),
});

const refundEntitySchema = z.object({
  id: z.string().min(1),
  payment_id: z.string().min(1),
  amount: z.number().int().positive(),
  status: z.string(),
});

const baseEventSchema = z.object({
  id: z.string().min(1),
  event: z.string().min(1),
  created_at: z.number(),
});

const paymentCapturedSchema = baseEventSchema.extend({
  event: z.literal("payment.captured"),
  payload: z.object({
    payment: z.object({ entity: paymentEntitySchema }),
  }),
});

const paymentFailedSchema = baseEventSchema.extend({
  event: z.literal("payment.failed"),
  payload: z.object({
    payment: z.object({ entity: paymentEntitySchema }),
  }),
});

const refundProcessedSchema = baseEventSchema.extend({
  event: z.literal("refund.processed"),
  payload: z.object({
    refund: z.object({ entity: refundEntitySchema }),
  }),
});

export type RazorpayEvent =
  | {
      kind: "payment.captured";
      eventId: string;
      createdAt: number;
      payment: {
        id: string;
        orderId: string;
        amountInr: number;
        email: string;
        contact?: string;
        method?: "upi" | "card" | "netbanking" | "emi";
        planCode?: string;
      };
    }
  | {
      kind: "payment.failed";
      eventId: string;
      createdAt: number;
      payment: { id: string; orderId: string; amountInr: number; email: string };
    }
  | {
      kind: "refund.processed";
      eventId: string;
      createdAt: number;
      refund: { id: string; paymentId: string; amountInr: number };
    }
  | { kind: "ignored"; eventId: string; createdAt: number; rawEvent: string };

export function parseRazorpayEvent(raw: unknown): RazorpayEvent {
  const base = baseEventSchema.safeParse(raw);
  if (!base.success) {
    throw new Error(`invalid razorpay event envelope: ${base.error.message}`);
  }
  const { id: eventId, created_at: createdAt, event } = base.data;

  switch (event) {
    case "payment.captured": {
      const p = paymentCapturedSchema.parse(raw).payload.payment.entity;
      return {
        kind: "payment.captured",
        eventId,
        createdAt,
        payment: {
          id: p.id,
          orderId: p.order_id,
          amountInr: p.amount,
          email: p.email,
          contact: p.contact,
          method: p.method,
          planCode: p.notes?.planCode,
        },
      };
    }
    case "payment.failed": {
      const p = paymentFailedSchema.parse(raw).payload.payment.entity;
      return {
        kind: "payment.failed",
        eventId,
        createdAt,
        payment: {
          id: p.id,
          orderId: p.order_id,
          amountInr: p.amount,
          email: p.email,
        },
      };
    }
    case "refund.processed": {
      const r = refundProcessedSchema.parse(raw).payload.refund.entity;
      return {
        kind: "refund.processed",
        eventId,
        createdAt,
        refund: { id: r.id, paymentId: r.payment_id, amountInr: r.amount },
      };
    }
    default:
      return { kind: "ignored", eventId, createdAt, rawEvent: event };
  }
}
