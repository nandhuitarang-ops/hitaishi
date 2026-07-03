import { Shell } from "@/components/Shell";
import { Card, CardBody, CardHeader, LinkButton, Pill } from "@/components/ui";
import { requireRole } from "@/lib/session";

export const dynamic = "force-dynamic";

const ranges = ["7d", "30d", "90d", "All"];

const PLACEHOLDER =
  "Analytics requires the events pipeline to be wired — placeholder until then.";

const kpis = [
  "DOUBT SLA",
  "ATTENDANCE",
  "SESSION FILL",
  "MENTOR NPS",
  "RETENTION",
];

export default async function AdminAnalyticsPage() {
  await requireRole("admin");

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
                i === 1
                  ? "bg-primary text-primary-on"
                  : "bg-surface-card border border-rule"
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
        {kpis.map((label) => (
          <Card key={label} className="p-4">
            <div className="meta">{label}</div>
            <div className="font-serif text-2xl text-ink-faint mt-1">—</div>
            <div className="text-xs text-ink-faint mt-0.5 italic">{PLACEHOLDER}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <Card>
          <CardHeader meta="MONTHLY ACTIVE" title="Students & mentors" />
          <CardBody>
            <div className="text-sm text-ink-faint italic py-6 text-center">
              {PLACEHOLDER}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader meta="CONVERSION FUNNEL" title="Landing → First session" />
          <CardBody>
            <div className="text-sm text-ink-faint italic py-6 text-center">
              {PLACEHOLDER}
            </div>
          </CardBody>
        </Card>
      </div>

      <Card className="mb-6 overflow-x-auto">
        <CardHeader meta="COHORT RETENTION" title="6-month windows" />
        <CardBody>
          <div className="text-sm text-ink-faint italic py-6 text-center">
            {PLACEHOLDER}
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader meta="TOP MENTORS" title="Composite score" />
          <CardBody>
            <div className="text-sm text-ink-faint italic py-6 text-center">
              {PLACEHOLDER}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader meta="AUDIT QUEUE" title="Need review" />
          <CardBody>
            <div className="text-sm text-ink-faint italic py-6 text-center">
              {PLACEHOLDER}
            </div>
          </CardBody>
        </Card>
      </div>
    </Shell>
  );
}
