CREATE TABLE IF NOT EXISTS "exam_results" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "exam_name" VARCHAR(200) NOT NULL,
  "subject" VARCHAR(100),
  "score" NUMERIC(10,2) NOT NULL,
  "total_marks" NUMERIC(10,2),
  "feedback" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_exam_results_user_id" ON "exam_results"("user_id");
