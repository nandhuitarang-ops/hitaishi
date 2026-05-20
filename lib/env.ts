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
  RAZORPAY_KEY_ID: z.string().min(1),
  RAZORPAY_KEY_SECRET: z.string().min(1),
  RAZORPAY_WEBHOOK_SECRET: z.string().min(1),
  HMS_ACCESS_KEY: z.string().min(1),
  HMS_SECRET: z.string().min(32, "HMS_SECRET must be >= 32 chars"),
  R2_ACCOUNT_ID: z.string().min(1),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_BUCKET: z.string().min(1),
  REDIS_URL: z.string().min(1),
  SOKETI_HOST: z.string().min(1),
  SOKETI_KEY: z.string().min(1),
  SOKETI_SECRET: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM: z.string().email(),
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
