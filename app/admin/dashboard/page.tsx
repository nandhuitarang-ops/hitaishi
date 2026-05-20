import { Shell } from "@/components/Shell";
import { Card, CardBody, CardHeader, LinkButton, Pill } from "@/components/ui";

// TODO(phase-2f): replace with Drizzle queries against the live tables
const kpis = [
  { label: "ACTIVE STUDENTS", value: "247", delta: "+18 this week", tone: "primary" as const },
  { label: "ACTIVE MENTORS", value: "32", delta: "3 pending verification", tone: "warn" as const },
  { label: "SESSIONS TODAY", value: "47", delta: "8 live now", tone: "primary" as const },
  { label: "MRR", value: "₹8.42L", delta: "+12% vs last month", tone: "primary" as const },
];

const alerts = [
  {
    id: "a1",
    severity: "high" as const,
    title: "3 mentor applications awaiting verification",
    href: "/admin/mentors",
  },
  {
    id: "a2",
    severity: "high" as const,
    title: "2 failed payment webhooks need manual provisioning",
    href: "/admin/payments",
  },
  {
    id: "a3",
    severity: "med" as const,
    title: "1 flagged conversation (off-platform mention)",
    href: "/admin/sessions",
  },
  {
    id: "a4",
    severity: "med" as const,
    title: "Refund request from Arjun · 3 days old",
    href: "/admin/payments",
  },
];

const recentActions = [
  { id: "r1", who: "Sarah Chen", what: "Approved mentor Arjun Mehta", at: "12m ago" },
  { id: "r2", who: "Mark Varma", what: "Refunded ₹14,999 to Aarav S.", at: "1h ago" },
  { id: "r3", who: "Amara Okafor", what: "Disabled feature flag betaDoubtAuction", at: "3h ago" },
];

const liveSessions = [
  { id: "s1", title: "Rotational mechanics — Priya × Aarav", started: "8 min" },
  { id: "s2", title: "Mole concept group · 12 students", started: "21 min" },
  { id: "s3", title: "Wave optics 1:1 — Rahul × Kabir", started: "4 min" },
];

const health = [
  { label: "Razorpay webhooks (24h)", status: "Healthy", tone: "primary" as const },
  { label: "100ms session capacity", status: "78 / 200", tone: "primary" as const },
  { label: "Audit log retention", status: "2 yr policy active", tone: "neutral" as const },
];

const sevTone = {
  high: "error" as const,
  med: "warn" as const,
  low: "neutral" as const,
};

export default function AdminDashboard() {
  return (
    <Shell
      role="admin"
      active="dashboard"
      pageCode="A.02 — MASTER DASHBOARD"
      pageTitle="Control room"
      pageSubtitle="System health, alerts, and recent admin activity at a glance."
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {kpis.map((k) => (
          <Card key={k.label} className="p-5">
            <div className="meta">{k.label}</div>
            <div className="font-serif text-3xl text-primary-deep mt-2">{k.value}</div>
            <div className="text-xs text-ink-soft mt-1">{k.delta}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">
        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader meta="NEEDS YOUR ATTENTION" title={`${alerts.length} open items`} />
            <ul>
              {alerts.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between gap-4 px-5 py-4 border-t border-rule first:border-t-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Pill tone={sevTone[a.severity]}>{a.severity}</Pill>
                    <span className="text-sm">{a.title}</span>
                  </div>
                  <LinkButton href={a.href} variant="ghost" size="sm">
                    Resolve →
                  </LinkButton>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader
              meta="LIVE SESSIONS"
              title={`${liveSessions.length} streams active`}
              action={
                <LinkButton href="/admin/sessions" variant="ghost" size="sm">
                  Monitor →
                </LinkButton>
              }
            />
            <ul>
              {liveSessions.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-3 px-5 py-3 border-t border-rule first:border-t-0"
                >
                  <div>
                    <div className="text-sm">{s.title}</div>
                    <div className="meta mt-0.5">started {s.started} ago</div>
                  </div>
                  <LinkButton href={`/session/${s.id}`} variant="ghost" size="sm">
                    Watch silently
                  </LinkButton>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader meta="RECENT ADMIN ACTIONS" title="Last 24 hours" action={<LinkButton href="/admin/audit" variant="ghost" size="sm">All →</LinkButton>} />
            <ul>
              {recentActions.map((r) => (
                <li
                  key={r.id}
                  className="px-5 py-3 border-t border-rule first:border-t-0"
                >
                  <div className="text-sm">
                    <span className="font-medium">{r.who}</span> {r.what}
                  </div>
                  <div className="meta mt-0.5">{r.at}</div>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader meta="SYSTEM HEALTH" title="Integrations" />
            <ul>
              {health.map((h) => (
                <li
                  key={h.label}
                  className="flex items-center justify-between px-5 py-3 border-t border-rule first:border-t-0"
                >
                  <span className="text-sm">{h.label}</span>
                  <Pill tone={h.tone}>{h.status}</Pill>
                </li>
              ))}
            </ul>
            <CardBody>
              <LinkButton href="/admin/settings" variant="ghost" size="md" className="w-full">
                Open settings →
              </LinkButton>
            </CardBody>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
