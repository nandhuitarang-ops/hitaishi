import { z } from "zod";

const DEFAULT_PATTERNS = [
  /^change-?me/i,
  /^test-/i,
  /^dev-/i,
  /^secret-?/i,
  /^placeholder/i,
];

const baseSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z
    .string()
    .min(32, "AUTH_SECRET must be >= 32 chars")
    .refine(
      (s) => !DEFAULT_PATTERNS.some((re) => re.test(s)),
      "AUTH_SECRET looks like a default — generate with `openssl rand -hex 32`",
    ),
});

const productionExtras = z.object({
  // Core payment & storage — required in production
  RAZORPAY_KEY_ID: z.string().min(1).optional(),
  RAZORPAY_KEY_SECRET: z.string().min(1).optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().min(1).optional(),
  R2_ACCOUNT_ID: z.string().min(1).optional(),
  R2_ACCESS_KEY_ID: z.string().min(1).optional(),
  R2_SECRET_ACCESS_KEY: z.string().min(1).optional(),
  R2_BUCKET: z.string().min(1).optional(),
  REDIS_URL: z.string().min(1).optional(),
  // Realtime / notifications — optional
  SOKETI_HOST: z.string().min(1).optional(),
  SOKETI_KEY: z.string().min(1).optional(),
  SOKETI_SECRET: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  RESEND_FROM: z.string().email().optional(),
});

export type ValidateResult =
  | { ok: true }
  | { ok: false; errors: string[] };

export function validateEnv(env: Record<string, string | undefined>): ValidateResult {
  const errors: string[] = [];

  const base = baseSchema.safeParse(env);
  if (!base.success) {
    for (const i of base.error.issues) {
      errors.push(`${i.path.join(".")}: ${i.message}`);
    }
    return { ok: false, errors };
  }

  if (base.data.NODE_ENV === "production") {
    const prod = productionExtras.safeParse(env);
    if (!prod.success) {
      for (const i of prod.error.issues) {
        errors.push(`${i.path.join(".")}: ${i.message}`);
      }
    }
  }

  return errors.length === 0 ? { ok: true } : { ok: false, errors };
}
