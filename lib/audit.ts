export interface AuditEntryInput {
  actorId: string;
  action: string;
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
}

export interface AuditEntry {
  actorId: string;
  action: string;
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: Date;
}

const SENSITIVE_KEYS = [
  "password",
  "passwordhash",
  "api_key",
  "apikey",
  "secret",
  "token",
  "session_token",
];

function redact(meta: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(meta)) {
    out[k] = SENSITIVE_KEYS.includes(k.toLowerCase()) ? "[REDACTED]" : v;
  }
  return out;
}

export function buildAuditEntry(input: AuditEntryInput): AuditEntry {
  if (!input.action) throw new Error("audit action required");
  return {
    actorId: input.actorId,
    action: input.action,
    targetType: input.targetType,
    targetId: input.targetId,
    metadata: input.metadata ? redact(input.metadata) : undefined,
    ipAddress: input.ipAddress,
    createdAt: new Date(),
  };
}
