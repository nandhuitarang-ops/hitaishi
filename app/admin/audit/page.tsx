import { Shell } from "@/components/Shell";
import { Card, LinkButton, Pill } from "@/components/ui";

// TODO(phase-2f): hydrate from auditLog table via Drizzle query in lib/audit.ts
const filters = {
  actions: ["All actions", "refund", "access_grant", "mentor_approve", "settings_change", "flag_dismiss", "admin_login"],
  admins: ["All admins", "Sarah Chen", "Mark Varma", "Amara Okafor"],
  severity: ["All", "Info", "Warning", "Critical"],
};

const entries = [
  {
    id: 1,
    ts: "2026-02-24 18:42:01 IST",
    severity: "warn" as const,
    severityLabel: "Warning",
    admin: "Sarah Chen",
    action: "refund",
    target: "pay_NZ82jKxl92 · Aarav Sharma",
    ip: "203.0.113.42",
    metadata: { amount: 14999, before: "captured", after: "refunded" },
  },
  {
    id: 2,
    ts: "2026-02-24 17:18:33 IST",
    severity: "primary" as const,
    severityLabel: "Info",
    admin: "Mark Varma",
    action: "mentor_approve",
    target: "user_xR9pYz · Arjun Mehta",
    ip: "203.0.113.42",
    metadata: { status: "pending → active" },
  },
  {
    id: 3,
    ts: "2026-02-24 16:02:11 IST",
    severity: "error" as const,
    severityLabel: "Critical",
    admin: "Amara Okafor",
    action: "settings_change",
    target: "feature_flag.betaDoubtAuction",
    ip: "203.0.113.42",
    metadata: { before: false, after: true },
  },
  {
    id: 4,
    ts: "2026-02-24 09:51:08 IST",
    severity: "primary" as const,
    severityLabel: "Info",
    admin: "Sarah Chen",
    action: "admin_login",
    target: "—",
    ip: "203.0.113.42",
    metadata: { method: "totp" },
  },
];

export default function AdminAuditPage() {
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
              {filters.actions.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </div>
          <div>
            <div className="meta mb-1">ADMIN</div>
            <select className="w-full rounded-input border border-rule-strong px-3 py-2 text-sm">
              {filters.admins.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </div>
          <div>
            <div className="meta mb-1">SEVERITY</div>
            <select className="w-full rounded-input border border-rule-strong px-3 py-2 text-sm">
              {filters.severity.map((s) => (
                <option key={s}>{s}</option>
              ))}
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
            {entries.map((e) => (
              <tr key={e.id} className="border-b border-rule last:border-0 hover:bg-surface-elevated/40">
                <td className="px-4 py-3 font-mono text-xs text-ink-faint">
                  {e.ts}
                </td>
                <td className="px-4 py-3">
                  <Pill tone={e.severity}>{e.severityLabel}</Pill>
                </td>
                <td className="px-4 py-3 text-sm">{e.admin}</td>
                <td className="px-4 py-3 font-mono text-xs">{e.action}</td>
                <td className="px-4 py-3 text-sm">{e.target}</td>
                <td className="px-4 py-3 hidden md:table-cell font-mono text-xs text-ink-faint">
                  {e.ip}
                </td>
                <td className="px-4 py-3 text-right">
                  <LinkButton href={`/admin/audit/${e.id}`} variant="ghost" size="sm">
                    JSON
                  </LinkButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="flex items-center justify-between mt-5">
        <div className="meta">Showing 1–{entries.length} of 12,482 entries</div>
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
