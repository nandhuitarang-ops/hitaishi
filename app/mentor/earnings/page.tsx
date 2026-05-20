import { Shell } from "@/components/Shell";
import { Card, CardBody, CardHeader, LinkButton, Pill } from "@/components/ui";

// TODO(phase-2f): hydrate from payouts + payments + assignments
const summary = {
  thisMonth: 12500,
  monthDelta: 12,
  lifetime: 142000,
  sessionsThisMonth: 24,
  sessionsDelta: 2,
};

const nextPayout = {
  amount: 8400,
  date: "01 Mar 2026",
};

const breakdown = [
  { label: "Live sessions", count: 12, unit: 500, total: 6000 },
  { label: "Doubts resolved", count: 50, unit: 40, total: 2000 },
  { label: "Resource approvals", count: 4, unit: 100, total: 400 },
];

const history = [
  {
    id: "h1",
    date: "01 Feb 2026",
    amount: 12400,
    status: "Paid" as const,
    utr: "HDFC0001239921",
  },
  {
    id: "h2",
    date: "01 Jan 2026",
    amount: 11800,
    status: "Paid" as const,
    utr: "HDFC0001182205",
  },
  {
    id: "h3",
    date: "01 Dec 2025",
    amount: 9200,
    status: "Paid" as const,
    utr: "HDFC0001120004",
  },
];

export default function MentorEarningsPage() {
  return (
    <Shell
      role="mentor"
      active="earnings"
      pageCode="M.09 — EARNINGS & PAYOUTS"
      pageTitle="Earnings"
      pageSubtitle="Payouts are processed via Razorpay Routes to your verified bank account."
      actions={<LinkButton href="/mentor/earnings/export" variant="ghost" size="sm">Export CSV</LinkButton>}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <Card>
          <CardHeader meta="NEXT PAYOUT" title={`Scheduled ${nextPayout.date}`} />
          <CardBody>
            <div className="font-serif text-5xl text-primary-deep">
              ₹{nextPayout.amount.toLocaleString("en-IN")}
            </div>
            <Pill tone="primary" className="mt-3">
              Pending bank transfer
            </Pill>
          </CardBody>
        </Card>

        <Card>
          <CardHeader meta="THIS MONTH" title="February" />
          <CardBody>
            <div className="font-serif text-4xl text-primary-deep">
              ₹{summary.thisMonth.toLocaleString("en-IN")}
            </div>
            <div className="text-sm text-primary-deep mt-2">
              +{summary.monthDelta}% vs last month
            </div>
            <div className="meta mt-3">
              {summary.sessionsThisMonth} sessions · +{summary.sessionsDelta} vs prev
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader meta="LIFETIME EARNINGS" title="All time" />
          <CardBody>
            <div className="font-serif text-4xl text-ink">
              ₹{summary.lifetime.toLocaleString("en-IN")}
            </div>
            <div className="meta mt-3">Across 124 paid sessions</div>
          </CardBody>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader meta="THIS MONTH'S BREAKDOWN" title="Where your earnings come from" />
        <ul>
          {breakdown.map((b) => (
            <li
              key={b.label}
              className="flex items-center justify-between gap-4 px-5 py-4 border-t border-rule first:border-t-0"
            >
              <div>
                <div className="font-medium text-sm">{b.label}</div>
                <div className="meta mt-1">
                  {b.count} × ₹{b.unit}
                </div>
              </div>
              <div className="font-mono text-lg">
                ₹{b.total.toLocaleString("en-IN")}
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="mb-6 overflow-x-auto">
        <CardHeader meta="PAYOUT HISTORY" title="Past transfers" />
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-elevated border-b border-rule">
              <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                Date
              </th>
              <th className="px-4 py-3 text-right font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                Amount
              </th>
              <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                Status
              </th>
              <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-wider text-ink-soft hidden md:table-cell">
                UTR
              </th>
              <th className="px-4 py-3 text-right font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                Receipt
              </th>
            </tr>
          </thead>
          <tbody>
            {history.map((h) => (
              <tr key={h.id} className="border-b border-rule last:border-0">
                <td className="px-4 py-3">{h.date}</td>
                <td className="px-4 py-3 text-right font-mono">
                  ₹{h.amount.toLocaleString("en-IN")}
                </td>
                <td className="px-4 py-3">
                  <Pill tone="primary">{h.status}</Pill>
                </td>
                <td className="px-4 py-3 hidden md:table-cell font-mono text-xs text-ink-faint">
                  {h.utr}
                </td>
                <td className="px-4 py-3 text-right">
                  <LinkButton href={`/mentor/earnings/receipt/${h.id}`} variant="ghost" size="sm">
                    PDF
                  </LinkButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="grid md:grid-cols-2 gap-5">
        <Card>
          <CardHeader meta="PAYOUT METHOD" title="HDFC Bank ····4920" />
          <CardBody>
            <button className="chip-ghost">Change account</button>
          </CardBody>
        </Card>
        <Card>
          <CardHeader meta="TAX & COMPLIANCE" title="Form 16 / TDS" />
          <CardBody>
            <p className="text-sm text-ink-soft">
              Certificates for FY 2025-26 will be available after April 2026.
            </p>
            <button className="chip-ghost mt-3">Request prior-year docs</button>
          </CardBody>
        </Card>
      </div>
    </Shell>
  );
}
