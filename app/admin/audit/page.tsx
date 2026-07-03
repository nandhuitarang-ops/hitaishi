import { Shell } from "@/components/Shell";
import { Card, LinkButton, Pill } from "@/components/ui";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { auditLog, users, profiles } from "@/db/schema";
import { count, desc, eq } from "drizzle-orm";

export const revalidate = 60;

type Tone = "primary" | "coral" | "warn" | "error" | "neutral";

const AUDIT_LIMIT = 50;

const DATE_FMT = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function severityFromAction(action: string): { tone: Tone; label: string } {
  const a = action.toLowerCase();
  if (
    a.includes("reject") ||
    a.includes("ban") ||
    a.includes("suspend") ||
    a.includes("delete") ||
    a.includes("disable")
  ) {
    return { tone: "error", label: "Critical" };
  }
  if (a.includes("refund") || a.includes("warn") || a.includes("flag")) {
    return { tone: "warn", label: "Warning" };
  }
  return { tone: "primary", label: "Info" };
}

export default async function AdminAuditPage() {
  await requireRole("admin");

  const [[totalRow], entries] = await Promise.all([
    db.select({ c: count() }).from(auditLog),
    db
      .select({
        id: auditLog.id,
        createdAt: auditLog.createdAt,
        action: auditLog.action,
        targetType: auditLog.targetType,
        targetId: auditLog.targetId,
        ipAddress: auditLog.ipAddress,
        actorName: profiles.fullName,
        actorEmail: users.email,
      })
      .from(auditLog)
      .leftJoin(users, eq(users.id, auditLog.actorId))
      .leftJoin(profiles, eq(profiles.userId, auditLog.actorId))
      .orderBy(desc(auditLog.createdAt))
      .limit(AUDIT_LIMIT),
  ]);

  const totalEntries = Number(totalRow?.c ?? 0);

  return (
    <Shell
      role="admin"
      active="audit"
      pageCode="A.09 — AUDIT LOG"
      pageTitle="Audit log"
      pageSubtitle="Every admin action, redacted-but-traceable. Logs retained for 2 years."
      actions={
        <div className="flex items-center gap-2">
          <button className="chip-ghost">Export CSV</button>
          <button className="chip-ghost">Stream JSON</button>
        </div>
      }
    >
      <Card className="mb-5">
        <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div>
            <div className="meta mb-1">ACTION TYPE</div>
            <select className="w-full rounded-input border border-rule-strong px-3 py-2 text-sm">
              <option>All actions</option>
              <option>refund</option>
              <option>access_grant</option>
              <option>mentor_approve</option>
              <option>settings_change</option>
              <option>flag_dismiss</option>
              <option>admin_login</option>
            </select>
          </div>
          <div>
            <div className="meta mb-1">ADMIN</div>
            <select className="w-full rounded-input border border-rule-strong px-3 py-2 text-sm">
              <option>All admins</option>
            </select>
          </div>
          <div>
            <div className="meta mb-1">SEVERITY</div>
            <select className="w-full rounded-input border border-rule-strong px-3 py-2 text-sm">
              <option>All</option>
              <option>Info</option>
              <option>Warning</option>
              <option>Critical</option>
            </select>
          </div>
          <div>
            <div className="meta mb-1">SEARCH</div>
            <input
              placeholder="Target id, payment id…"
              className="w-full rounded-input border border-rule-strong px-3 py-2 text-sm"
            />
          </div>
        </div>
      </Card>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-elevated border-b border-rule">
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wider text-ink-soft">
                Timestamp
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wider text-ink-soft">
                Sev
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wider text-ink-soft">
                Admin
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wider text-ink-soft">
                Action
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wider text-ink-soft">
                Target
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wider text-ink-soft hidden md:table-cell">
                IP
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-mono uppercase tracking-wider text-ink-soft" />
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-ink-faint italic"
                >
                  No data yet
                </td>
              </tr>
            ) : (
              entries.map((e: {
                id: number;
                createdAt: Date | null;
                action: string;
                targetType: string | null;
                targetId: string | null;
                ipAddress: string | null;
                actorName: string | null;
                actorEmail: string | null;
              }) => {
                const sev = severityFromAction(e.action);
                const admin = e.actorName ?? e.actorEmail ?? "system";
                const target = e.targetType
                  ? e.targetId
                    ? `${e.targetType} ${String(e.targetId).slice(0, 8)}`
                    : e.targetType
                  : "—";
                return (
                  <tr
                    key={e.id}
                    className="border-b border-rule last:border-0 hover:bg-surface-elevated/40"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-ink-faint">
                      {e.createdAt ? DATE_FMT.format(new Date(e.createdAt)) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Pill tone={sev.tone}>{sev.label}</Pill>
                    </td>
                    <td className="px-4 py-3 text-sm">{admin}</td>
                    <td className="px-4 py-3 font-mono text-xs">{e.action}</td>
                    <td className="px-4 py-3 text-sm">{target}</td>
                    <td className="px-4 py-3 hidden md:table-cell font-mono text-xs text-ink-faint">
                      {e.ipAddress ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <LinkButton
                        href={`/admin/audit/${e.id}`}
                        variant="ghost"
                        size="sm"
                      >
                        JSON
                      </LinkButton>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </Card>

      <div className="flex items-center justify-between mt-5">
        <div className="meta">
          Showing 1–{entries.length} of {totalEntries.toLocaleString("en-IN")} entries
        </div>
        <div className="flex items-center gap-2">
          <button className="chip-ghost">← Prev</button>
          <button className="chip-ghost">Next →</button>
        </div>
      </div>

      <p className="meta text-center mt-6">
        Logs retained for 2 years · Older entries permanently purged · Sensitive
        fields auto-redacted by lib/audit.ts
      </p>
    </Shell>
  );
}
