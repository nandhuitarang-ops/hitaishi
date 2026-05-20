import { Shell } from "@/components/Shell";
import { Card, CardBody, CardHeader, LinkButton, Pill } from "@/components/ui";
import { initials } from "@/lib/format";

// TODO(phase-2f): hydrate from payments + refunds + webhookEvents + subscriptions
const kpis = [
  { label: "MTD VOLUME", value: "₹24,82,490", delta: "+12.5% vs last month", tone: "primary" as const },
  { label: "PAYOUT SUCCESS", value: "98.2%", delta: "1,422 transfers", tone: "primary" as const },
  { label: "PENDING REFUNDS", value: "₹14,500", delta: "3 awaiting approval", tone: "warn" as const },
  { label: "FAILED WEBHOOKS", value: "3", delta: "Urgent — manual provision", tone: "error" as const },
];

const failedWebhooks = [
  {
    id: "w1",
    razorpayId: "pay_NZ82jKxl92",
    student: "Aarav Sharma",
    amount: 14999,
    reason: "Signature Mismatch (502)",
  },
  {
    id: "w2",
    razorpayId: "pay_KL921mP01x",
    student: "Ishita Gupta",
    amount: 8499,
    reason: "Connection Timeout",
  },
];

const filters = [
  { key: "all", label: "All", count: 248 },
  { key: "captured", label: "Captured", count: 198 },
  { key: "failed", label: "Failed", count: 14 },
  { key: "refunded", label: "Refunded", count: 22 },
  { key: "pending", label: "Pending", count: 14 },
];

const ledger = [
  {
    id: "l1",
    date: "24 Feb 2026",
    student: "Aarav Sharma",
    plan: "JEE Adv 6mo",
    amount: 14999,
    razorpayId: "pay_LZ92mk119L",
    status: "captured" as const,
  },
  {
    id: "l2",
    date: "24 Feb 2026",
    student: "Ishita Gupta",
    plan: "JEE Main 6mo",
    amount: 8499,
    razorpayId: "pay_KL921mP01x",
    status: "failed" as const,
  },
  {
    id: "l3",
    date: "23 Feb 2026",
    student: "Diya Patel",
    plan: "JEE Adv 6mo",
    amount: 14999,
    razorpayId: "pay_MX72bNYq01",
    status: "captured" as const,
  },
  {
    id: "l4",
    date: "22 Feb 2026",
    student: "Saanvi Iyer",
    plan: "JEE Main 6mo",
    amount: 8499,
    razorpayId: "pay_HQ81pRkb33",
    status: "refunded" as const,
  },
];

const statusTone = {
  captured: "primary",
  failed: "error",
  refunded: "neutral",
  pending: "warn",
} as const;

export default function AdminPaymentsPage() {
  return (
    <Shell
      role="admin"
      active="payments"
      pageCode="A.06 — PAYMENTS & ACCESS CONTROL"
      pageTitle="Payments"
      pageSubtitle="Razorpay ledger, refunds, webhook health, and manual access grants."
      actions={
        <div className="flex items-center gap-2">
          <button className="chip-ghost">Manual access grant</button>
          <button className="chip-ghost">Export CSV</button>
        </div>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((k) => (
          <Card key={k.label} className="p-5">
            <div className="meta">{k.label}</div>
            <div className="font-serif text-2xl text-primary-deep mt-2">{k.value}</div>
            <div className="text-xs text-ink-soft mt-1">{k.delta}</div>
          </Card>
        ))}
      </div>

      {failedWebhooks.length > 0 && (
        <Card className="mb-6 border-danger/40 bg-danger-soft/30">
          <CardHeader
            meta={`${failedWebhooks.length} FAILED WEBHOOKS — URGENT`}
            title="Manual provisioning required"
          />
          <ul>
            {failedWebhooks.map((w) => (
              <li
                key={w.id}
                className="flex flex-wrap items-center gap-4 px-5 py-4 border-t border-rule first:border-t-0"
              >
                <div className="flex-1 min-w-[260px]">
                  <div className="font-mono text-sm">{w.razorpayId}</div>
                  <div className="text-sm mt-1">
                    {w.student} · ₹{w.amount.toLocaleString("en-IN")}
                  </div>
                  <div className="meta mt-1">{w.reason}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="chip-ghost">Retry</button>
                  <button className="chip-cta">Manual provision →</button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <div className="flex flex-wrap gap-2 mb-5">
        {filters.map((f, i) => (
          <button
            key={f.key}
            className={`px-4 py-2 rounded-pill text-sm flex items-center gap-2 ${
              i === 0
                ? "bg-primary text-primary-on"
                : "bg-surface-card border border-rule text-ink-soft hover:bg-surface-elevated"
            }`}
          >
            {f.label}
            <span className="font-mono text-xs opacity-70">{f.count}</span>
          </button>
        ))}
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-elevated border-b border-rule">
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wider text-ink-soft">
                Date
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wider text-ink-soft">
                Student
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wider text-ink-soft hidden md:table-cell">
                Plan
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-mono uppercase tracking-wider text-ink-soft">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wider text-ink-soft hidden lg:table-cell">
                Razorpay ID
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wider text-ink-soft">
                Status
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-mono uppercase tracking-wider text-ink-soft">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {ledger.map((l) => (
              <tr key={l.id} className="border-b border-rule last:border-0 hover:bg-surface-elevated/60">
                <td className="px-4 py-3 font-mono text-xs">{l.date}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="avatar !w-7 !h-7 !text-xs">{initials(l.student)}</div>
                    {l.student}
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-ink-soft">{l.plan}</td>
                <td className="px-4 py-3 text-right font-mono">
                  ₹{l.amount.toLocaleString("en-IN")}
                </td>
                <td className="px-4 py-3 hidden lg:table-cell font-mono text-xs text-ink-faint">
                  {l.razorpayId}
                </td>
                <td className="px-4 py-3">
                  <Pill tone={statusTone[l.status]}>{l.status}</Pill>
                </td>
                <td className="px-4 py-3 text-right">
                  {l.status === "captured" && (
                    <button className="text-xs text-primary-deep underline">Refund</button>
                  )}
                  {l.status === "failed" && (
                    <button className="text-xs text-primary-deep underline">Retry</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="meta text-center mt-5">Showing 1–{ledger.length} of 248</div>
    </Shell>
  );
}
