import { Shell } from "@/components/Shell";
import { formatInr } from "@/lib/format";

const failedWebhooks = [
  { id: "w1", evt: "payment.captured", order: "order_xyz789", err: "ProvisioningStore not wired", retries: 3, at: "8 min ago" },
];

const recentPayments = [
  { id: "p1", who: "Aarav Sharma", amount: 1_499_900, method: "UPI", status: "success", at: "today" },
  { id: "p2", who: "Diya Patel", amount: 1_499_900, method: "Card", status: "success", at: "today" },
  { id: "p3", who: "Vivaan Kumar", amount: 1_499_900, method: "Netbanking", status: "failed", at: "yesterday" },
  { id: "p4", who: "Saanvi Iyer", amount: 1_499_900, method: "UPI", status: "refunded", at: "3 days ago" },
];

const STATUS_STYLE: Record<string, string> = {
  success: "border-[var(--ink)]",
  failed: "border-[var(--signal)] bg-[var(--signal-soft)]",
  refunded: "border-[var(--ink-soft)] text-[var(--ink-soft)]",
};

export default function AdminPayments() {
  return (
    <Shell role="admin" active="payments" pageCode="A.05 — Payments" pageTitle="Money + access ledger.">
      {failedWebhooks.length > 0 && (
        <section className="border-2 border-[var(--signal)] bg-[var(--signal-soft)] p-4">
          <div className="meta mb-2">Failed webhooks · {failedWebhooks.length}</div>
          {failedWebhooks.map((w) => (
            <div key={w.id} className="flex items-center justify-between gap-4 py-2">
              <div>
                <div className="font-medium">{w.evt} · {w.order}</div>
                <div className="text-xs text-[var(--ink-soft)] mt-1">{w.err} · {w.retries} retries · {w.at}</div>
              </div>
              <div className="flex gap-2">
                <button className="chip-ghost">Retry</button>
                <button className="chip-cta">Manual provision</button>
              </div>
            </div>
          ))}
        </section>
      )}

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b-2 border-[var(--ink)]">
            <th className="text-left py-3 meta">Student</th>
            <th className="text-right py-3 meta">Amount</th>
            <th className="text-left py-3 meta hidden md:table-cell">Method</th>
            <th className="text-left py-3 meta">Status</th>
            <th className="text-right py-3 meta">When</th>
            <th className="text-right py-3 meta">Actions</th>
          </tr>
        </thead>
        <tbody>
          {recentPayments.map((p) => (
            <tr key={p.id} className="border-b border-[var(--rule)]">
              <td className="py-3 font-medium">{p.who}</td>
              <td className="py-3 text-right serif font-bold">{formatInr(p.amount)}</td>
              <td className="py-3 hidden md:table-cell italic-serif text-[var(--ink-soft)]">{p.method}</td>
              <td className="py-3">
                <span className={`px-2 py-0.5 text-xs border ${STATUS_STYLE[p.status]}`}>
                  {p.status}
                </span>
              </td>
              <td className="py-3 text-right text-[var(--ink-soft)]">{p.at}</td>
              <td className="py-3 text-right">
                {p.status === "success" && (
                  <a href="#" className="italic-serif text-sm underline">Refund</a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Shell>
  );
}
