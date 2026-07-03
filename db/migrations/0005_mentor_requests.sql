-- mentor_requests table
CREATE TYPE "mentor_request_status" AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE IF NOT EXISTS "mentor_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" uuid NOT NULL,
	"status" "mentor_request_status" DEFAULT 'pending' NOT NULL,
	"message" text,
	"admin_notes" text,
	"reviewed_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "mentor_requests_student_idx" ON "mentor_requests" ("student_id");
CREATE INDEX IF NOT EXISTS "mentor_requests_status_idx" ON "mentor_requests" ("status");

ALTER TABLE "mentor_requests" ADD CONSTRAINT "mentor_requests_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE cascade;
ALTER TABLE "mentor_requests" ADD CONSTRAINT "mentor_requests_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id");
