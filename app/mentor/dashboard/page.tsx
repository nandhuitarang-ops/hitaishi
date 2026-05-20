import { Shell } from "@/components/Shell";
import { Card, CardBody, CardHeader, LinkButton, Pill } from "@/components/ui";
import { initials } from "@/lib/format";

// TODO(phase-2f): replace with Drizzle queries (assignments + conversations + sessions + doubts)
const summary = {
  students: 10,
  sessionsToday: 3,
  doubtsPending: 4,
  earningsThisMonth: 4200,
  status: "Available",
};

const needsAttention = [
  {
    id: "a1",
    name: "Arjun Srinivasan",
    reason: "4 unread messages · 18h",
    tone: "warn" as const,
  },
  {
    id: "a2",
    name: "Meera Krishnan",
    reason: "Missed last 1:1 session",
    tone: "error" as const,
  },
  {
    id: "a3",
    name: "Rohan Sethi",
    reason: "Mock score declined 12%",
    tone: "warn" as const,
  },
];

const pendingDoubts = [
  { id: "d1", student: "Aarav", subject: "Math", title: "Integration by parts — Q14" },
  { id: "d2", student: "Diya", subject: "Chemistry", title: "Aldol vs Cannizzaro" },
  { id: "d3", student: "Kabir", subject: "Physics", title: "Rotational vs translational KE" },
  { id: "d4", student: "Saanvi", subject: "Physics", title: "Wave optics geometry" },
];

const todayCalendar = [
  { time: "04:00 PM", who: "Arjun · Physics", subject: "Physics" },
  { time: "06:30 PM", who: "Meera · Chemistry", subject: "Chemistry" },
  { time: "08:00 PM", who: "Group doubt session", subject: "Group" },
];

export default function MentorDashboard() {
  return (
    <Shell
      role="mentor"
      active="dashboard"
      pageCode="M.03 — DASHBOARD"
      pageTitle="Who needs you tonight."
      pageSubtitle="Triage queue, today's calendar, and your monthly earnings at a glance."
      actions={
        <div className="flex items-center gap-2">
          <Pill tone="primary">● {summary.status}</Pill>
          <button className="chip-ghost text-xs">Switch to Away</button>
        </div>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-5">
          <div className="meta">STUDENTS</div>
          <div className="font-serif text-3xl mt-2 text-primary-deep">{summary.students}</div>
        </Card>
        <Card className="p-5">
          <div className="meta">SESSIONS TODAY</div>
          <div className="font-serif text-3xl mt-2 text-primary-deep">{summary.sessionsToday}</div>
        </Card>
        <Card className="p-5">
          <div className="meta">DOUBTS PENDING</div>
          <div className="font-serif text-3xl mt-2 text-secondary">{summary.doubtsPending}</div>
        </Card>
        <Card className="p-5">
          <div className="meta">THIS MONTH</div>
          <div className="font-serif text-3xl mt-2 text-primary-deep">
            ₹{summary.earningsThisMonth.toLocaleString("en-IN")}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-5">
        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader meta="NEEDS YOUR ATTENTION" title="Students to message tonight" />
            <ul>
              {needsAttention.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center gap-4 px-5 py-4 border-t border-rule first:border-t-0"
                >
                  <div className="avatar !w-10 !h-10 !text-sm">{initials(a.name)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{a.name}</div>
                    <div className="text-xs text-ink-soft mt-1">{a.reason}</div>
                  </div>
                  <Pill tone={a.tone}>flag</Pill>
                  <LinkButton href={`/mentor/students/${a.id}`} size="sm">
                    Open chat
                  </LinkButton>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader
              meta="PENDING DOUBTS"
              title={`${pendingDoubts.length} in your inbox`}
              action={
                <LinkButton href="/mentor/doubts" variant="ghost" size="sm">
                  View all
                </LinkButton>
              }
            />
            <ul>
              {pendingDoubts.map((d) => (
                <li
                  key={d.id}
                  className="flex items-center justify-between gap-4 px-5 py-3 border-t border-rule first:border-t-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Pill tone="primary">{d.subject}</Pill>
                    <div className="min-w-0">
                      <div className="text-sm truncate">{d.title}</div>
                      <div className="meta mt-0.5">from {d.student}</div>
                    </div>
                  </div>
                  <LinkButton href={`/mentor/doubts/${d.id}`} variant="ghost" size="sm">
                    Answer →
                  </LinkButton>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <Card>
          <CardHeader meta="TODAY'S CALENDAR" title="3 sessions" />
          <ul>
            {todayCalendar.map((c, i) => (
              <li
                key={i}
                className="px-5 py-4 border-t border-rule first:border-t-0"
              >
                <div className="flex items-center justify-between">
                  <div className="font-serif text-lg">{c.time}</div>
                  <Pill tone="primary">{c.subject}</Pill>
                </div>
                <div className="text-sm text-ink-soft mt-1">{c.who}</div>
              </li>
            ))}
          </ul>
          <CardBody>
            <LinkButton href="/mentor/calendar" variant="ghost" size="md" className="w-full">
              Full calendar →
            </LinkButton>
          </CardBody>
        </Card>
      </div>
    </Shell>
  );
}
