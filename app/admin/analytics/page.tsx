import { Shell } from "@/components/Shell";
import { Card, CardBody, CardHeader, LinkButton, Pill } from "@/components/ui";

// TODO(phase-2f): hydrate from real cohort + revenue + sessions queries
const kpis = [
  { label: "MRR", value: "₹8.42L", delta: "+12%", tone: "primary" as const },
  { label: "LTV", value: "₹42.5K", delta: "+4%", tone: "primary" as const },
  { label: "CAC", value: "₹1.2K", delta: "-8%", tone: "primary" as const },
  { label: "CHURN", value: "3.2%", delta: "-0.4pp", tone: "primary" as const },
  { label: "REFUND %", value: "0.8%", delta: "-0.1pp", tone: "primary" as const },
  { label: "DOUBT SLA", value: "14m", delta: "-2m", tone: "primary" as const },
  { label: "ATTENDANCE", value: "92%", delta: "+3pp", tone: "primary" as const },
];

const ranges = ["7d", "30d", "90d", "All"];

const revenueData = [
  { m: "Sep", v: 420 },
  { m: "Oct", v: 510 },
  { m: "Nov", v: 605 },
  { m: "Dec", v: 750 },
  { m: "Jan", v: 905 },
  { m: "Feb", v: 1180 },
];

const retention = [
  { cohort: "Jan 2026", m0: 100, m1: 92, m2: 87, m3: 81, m4: 74, m5: 72 },
  { cohort: "Feb 2026", m0: 100, m1: 90, m2: 84, m3: 76, m4: 67, m5: null },
  { cohort: "Mar 2026", m0: 100, m1: 88, m2: 80, m3: 71, m4: null, m5: null },
  { cohort: "Apr 2026", m0: 100, m1: 84, m2: 70, m3: null, m4: null, m5: null },
];

const funnel = [
  { label: "Landing visits", value: 120000, pct: 100 },
  { label: "Clicked Pay & Get Access", value: 31200, pct: 26 },
  { label: "Payment initiated", value: 18700, pct: 16 },
  { label: "Payment captured", value: 16800, pct: 14 },
  { label: "Onboarding complete", value: 59100, pct: 49 },
  { label: "First session attended", value: 49400, pct: 41 },
];

const topMentors = [
  { name: "Dr. Ananya Sharma", score: 9.84, tier: "Top 1%" },
  { name: "Siddharth Jain", score: 9.42, tier: "Top 5%" },
  { name: "Priya Mehta", score: 8.97, tier: "Top 10%" },
];

const auditQueue = [
  { name: "Vikram Sahu", reason: "Doubt churn ↑ 28%" },
  { name: "Neha Kapur", reason: "SLA breached 3 times last week" },
];

function Bar({ data }: { data: { m: string; v: number }[] }) {
  const max = Math.max(...data.map((d) => d.v));
  return (
    <div className="flex items-end gap-3 h-40 mt-3">
      {data.map((d) => (
        <div key={d.m} className="flex flex-col items-center gap-2 flex-1">
          <div
            className="w-full bg-primary rounded-t-input transition-all"
            style={{ height: `${(d.v / max) * 100}%` }}
            aria-label={`${d.m}: ${d.v}`}
          />
          <div className="meta">{d.m}</div>
        </div>
      ))}
    </div>
  );
}

export default function AdminAnalyticsPage() {
  return (
    <Shell
      role="admin"
      active="analytics"
      pageCode="A.07 — ANALYTICS"
      pageTitle="Performance"
      pageSubtitle="The numbers that matter — revenue, retention, mentor performance."
      actions={
        <div className="flex items-center gap-2">
          {ranges.map((r, i) => (
            <button
              key={r}
              className={`px-3 py-1.5 rounded-btn text-xs font-mono ${
                i === 1 ? "bg-primary text-primary-on" : "bg-surface-card border border-rule"
              }`}
            >
              {r}
            </button>
          ))}
          <button className="chip-ghost text-xs">Custom range</button>
        </div>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        {kpis.map((k) => (
          <Card key={k.label} className="p-4">
            <div className="meta">{k.label}</div>
            <div className="font-serif text-2xl text-primary-deep mt-1">{k.value}</div>
            <div className="text-xs text-ink-soft mt-0.5">{k.delta}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <Card>
          <CardHeader meta="MONTHLY REVENUE" title="FY 2026 — ₹ in K" />
          <CardBody>
            <Bar data={revenueData} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader meta="CONVERSION FUNNEL" title="Landing → First session" />
          <CardBody>
            <ul className="space-y-2">
              {funnel.map((f) => (
                <li key={f.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span>{f.label}</span>
                    <span className="font-mono">
                      {f.value.toLocaleString()} ({f.pct}%)
                    </span>
                  </div>
                  <div className="h-2 bg-surface-elevated rounded-pill mt-1 overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${f.pct}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>

      <Card className="mb-6 overflow-x-auto">
        <CardHeader meta="COHORT RETENTION" title="6-month windows" />
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-elevated border-b border-rule">
              <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                Cohort
              </th>
              {["M0", "M1", "M2", "M3", "M4", "M5"].map((m) => (
                <th
                  key={m}
                  className="px-4 py-3 text-right font-mono text-[11px] uppercase tracking-wider text-ink-soft"
                >
                  {m}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {retention.map((r) => (
              <tr key={r.cohort} className="border-b border-rule last:border-0">
                <td className="px-4 py-3 font-medium">{r.cohort}</td>
                {[r.m0, r.m1, r.m2, r.m3, r.m4, r.m5].map((v, i) => (
                  <td key={i} className="px-4 py-3 text-right">
                    {v !== null ? (
                      <span
                        className={`inline-block px-2 py-1 rounded-input font-mono text-xs ${
                          v > 80
                            ? "bg-primary-soft text-primary-deep"
                            : v > 60
                              ? "bg-[#fff2c5] text-[#6b4f00]"
                              : "bg-danger-soft text-[#93000a]"
                        }`}
                      >
                        {v}%
                      </span>
                    ) : (
                      <span className="text-ink-faint">—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader meta="TOP MENTORS" title="Composite score" />
          <ul>
            {topMentors.map((m, i) => (
              <li
                key={m.name}
                className="flex items-center justify-between px-5 py-3 border-t border-rule first:border-t-0"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-ink-faint w-5">
                    #{i + 1}
                  </span>
                  <span className="text-sm font-medium">{m.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-serif text-lg">{m.score}</span>
                  <Pill tone="primary">{m.tier}</Pill>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader meta="AUDIT QUEUE" title="Need review" />
          <ul>
            {auditQueue.map((q) => (
              <li
                key={q.name}
                className="flex items-center justify-between px-5 py-3 border-t border-rule first:border-t-0"
              >
                <div>
                  <div className="font-medium text-sm">{q.name}</div>
                  <div className="meta mt-0.5">{q.reason}</div>
                </div>
                <LinkButton href="/admin/mentors" variant="ghost" size="sm">
                  Review
                </LinkButton>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </Shell>
  );
}
