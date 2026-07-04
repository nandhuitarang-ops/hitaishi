ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "date_of_birth" date;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "gender" varchar(30);--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "parent_name" varchar(120);--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "parent_phone" varchar(20);--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "address_line_1" varchar(255);--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "city" varchar(120);--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "state" varchar(120);--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "pincode" varchar(10);--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "current_class" varchar(40);--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "board" varchar(40);--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "target_rank" integer;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "aim_text" text;
