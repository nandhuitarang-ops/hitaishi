import { sql } from "drizzle-orm";

/**
 * Migration 0006: Add Performance Indexes
 *
 * Adds critical missing indexes identified by the performance audit.
 *
 * ⚠️ CONCURRENTLY note:
 * Drizzle migrator runs inside a transaction, which does NOT support
 * CREATE INDEX CONCURRENTLY. The CONCURRENTLY keyword is included below
 * as the production best-practice (avoids table locks). If you run these
 * through the standard `db:migrate` script, CONCURRENTLY will be silently
 * ignored by Postgres inside the transaction wrapper — the indexes will
 * still be created (just with an ACCESS EXCLUSIVE lock for the duration).
 *
 * For zero-downtime production deploys, run each statement individually
 * outside a transaction:
 *   tsx -e "import { db } from './db'; await db.execute(migration.idxAuditLogActorId)"
 *
 * Or use a dedicated script that opens a non-transactional connection.
 */

// ── Critical single-column indexes ──────────────────────────────────

export const idxAuditLogActorId = sql`
  CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_log_actor_id
  ON audit_log(actor_id)
`;

export const idxMessagesSenderId = sql`
  CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_sender_id
  ON messages(sender_id)
`;

export const idxConversationParticipantsUserId = sql`
  CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_conversation_participants_user_id
  ON conversation_participants(user_id)
`;

export const idxNotificationsRecipientId = sql`
  CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_recipient_id
  ON notifications(recipient_id)
`;

export const idxSessionsStatus = sql`
  CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sessions_status
  ON sessions(status)
`;

export const idxDoubtsClaimedBy = sql`
  CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_doubts_claimed_by
  ON doubts(claimed_by)
`;

// ── High-priority composite indexes ─────────────────────────────────

export const idxAssignmentsMentorStatus = sql`
  CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_assignments_mentor_status
  ON assignments(mentor_id, status)
`;

export const idxSessionsStatusScheduled = sql`
  CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sessions_status_scheduled
  ON sessions(status, scheduled_at)
`;

export const idxMessagesConversationCreated = sql`
  CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_conversation_created
  ON messages(conversation_id, created_at DESC)
`;

export const idxDoubtsStudentStatus = sql`
  CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_doubts_student_status
  ON doubts(student_id, status)
`;

export const idxSessionsHostScheduled = sql`
  CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sessions_host_scheduled
  ON sessions(host_id, scheduled_at)
`;

export const idxAuditLogCreatedAt = sql`
  CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_log_created_at
  ON audit_log(created_at DESC)
`;

// ── Leads table indexes (table had zero indexes) ────────────────────

export const idxLeadsType = sql`
  CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_type
  ON leads(type)
`;

export const idxLeadsCreatedAt = sql`
  CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_created_at
  ON leads(created_at)
`;

// ── Partial index for open/claimed doubts ──────────────────────────

export const idxDoubtsOpenOrClaimed = sql`
  CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_doubts_open_or_claimed
  ON doubts(student_id, status, claimed_by)
  WHERE status = 'open' OR (status = 'claimed' AND claimed_by IS NOT NULL)
`;

// ── Email index on leads ─────────────────────────────────────────────

export const idxLeadsEmail = sql`
  CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_email
  ON leads(email)
`;

// ── Convenience: run all indexes at once ────────────────────────────

export const allIndexes = [
  idxAuditLogActorId,
  idxMessagesSenderId,
  idxConversationParticipantsUserId,
  idxNotificationsRecipientId,
  idxSessionsStatus,
  idxDoubtsClaimedBy,
  idxAssignmentsMentorStatus,
  idxSessionsStatusScheduled,
  idxMessagesConversationCreated,
  idxDoubtsStudentStatus,
  idxSessionsHostScheduled,
  idxAuditLogCreatedAt,
  idxLeadsType,
  idxLeadsCreatedAt,
  idxDoubtsOpenOrClaimed,
  idxLeadsEmail,
];
