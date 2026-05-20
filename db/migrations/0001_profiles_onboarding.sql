ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "onboarding_step" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "onboarding_completed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "payout_details" jsonb;
