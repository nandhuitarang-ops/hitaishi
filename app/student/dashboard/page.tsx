import { Shell } from "@/components/Shell";
import { Card, CardBody, CardHeader, LinkButton, Pill } from "@/components/ui";
import { initials } from "@/lib/format";

// TODO(phase-2f): replace mocks with real Drizzle queries against the user's session
const mockStudent = { firstName: "Aarav" };
const mockMentor = {
  fullName: "Priya Sharma",
  institute: "IIT Bombay '24",
  subjects: ["Physics", "Chemistry"],
  status: "Online",
  lastMessage:
    "Let's review the mock test results from yesterday. Your progress on rotational mechanics looks strong.",
  activeAgo: "12m",
};
const mockUpcomingSession = {
  dateLabel: "OCT 14",
  timeLabel: "Today · 5:30 PM",
  title: "Thermodynamics — Advanced Practice",
};
const mockResources = [
  { id: "1", title: "Mechanics Notes", kind: "PDF", size: "12 MB" },
  { id: "2", title: "Inorganic Shortcuts", kind: "DOCX", size: "2 MB" },
  { id: "3", title: "Wave Optics Rev.", kind: "MP4", size: "45 MB" },
];
const mockStats = [
  { label: "Doubts resolved", value: "12" },
  { label: "Sessions attended", value: "04" },
  { label: "Resources saved", value: "08" },
  { label: "Active streak", value: "9 days" },
];
const mockProgress = { day: 47, total: 180, examTarget: "JEE Adv 2027" };
const mockInsight =
  "Focus on understanding the 'why' behind every chemical reaction — patterns repeat across the syllabus.";

export default function StudentDashboard() {
  const greeting = greetingFor(new Date());
  const pct = Math.round((mockProgress.day / mockProgress.total) * 100);

  return (
    <Shell
      role="student"
      active="dashboard"
      pageCode="S.03 — DASHBOARD"
      pageTitle={`${greeting}, ${mockStudent.firstName}.`}
      pageSubtitle={`Day ${mockProgress.day} of ${mockProgress.total} · ${mockProgress.examTarget}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <CardHeader meta="YOUR MENTOR" title={mockMentor.fullName} action={<Pill tone="primary">{mockMentor.status}</Pill>} />
          <CardBody className="flex gap-5">
            <div className="avatar !w-14 !h-14 !text-xl">
              {initials(mockMentor.fullName)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-ink-soft">{mockMentor.institute}</div>
              <div className="flex gap-2 mt-2">
                {mockMentor.subjects.map((s) => (
                  <Pill key={s} tone="primary">{s}</Pill>
                ))}
              </div>
              <p className="text-sm text-ink mt-4 italic">
                "{mockMentor.lastMessage}"
              </p>
              <div className="flex items-center gap-4 mt-4">
                <LinkButton href="/student/chat" size="md">
                  Open chat →
                </LinkButton>
                <span className="meta">Active {mockMentor.activeAgo} ago</span>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader meta={mockUpcomingSession.dateLabel} title="Next Session" />
          <CardBody>
            <div className="font-serif text-2xl">{mockUpcomingSession.timeLabel}</div>
            <div className="text-sm text-ink-soft mt-2">
              {mockUpcomingSession.title}
            </div>
            <LinkButton href="/student/sessions" size="md" className="mt-5 w-full">
              Join session →
            </LinkButton>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
        <Card className="lg:col-span-2">
          <CardHeader
            meta="RECENT RESOURCES"
            title="Shared in the last 7 days"
            action={
              <LinkButton href="/student/resources" variant="ghost" size="sm">
                View all
              </LinkButton>
            }
          />
          <ul>
            {mockResources.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between px-5 py-3 border-t border-rule first:border-t-0"
              >
                <div>
                  <div className="font-medium text-sm">{r.title}</div>
                  <div className="meta mt-1">{r.kind} · {r.size}</div>
                </div>
                <LinkButton href="/student/resources" variant="ghost" size="sm">
                  Open
                </LinkButton>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader meta="DAILY INSIGHT" title="From your mentor" />
          <CardBody>
            <p className="text-sm text-ink-soft italic">"{mockInsight}"</p>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
        {mockStats.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="meta">{s.label}</div>
            <div className="font-serif text-3xl text-primary-deep mt-2">
              {s.value}
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-5 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="meta">PROGRESS</div>
            <div className="font-serif text-xl mt-1">
              {mockProgress.day} of {mockProgress.total} days · {mockProgress.examTarget}
            </div>
          </div>
          <div className="font-mono text-sm text-primary-deep">{pct}%</div>
        </div>
        <div className="h-2 bg-surface-elevated rounded-pill mt-4 relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-primary rounded-pill"
            style={{ width: `${pct}%` }}
          />
        </div>
      </Card>
    </Shell>
  );
}

function greetingFor(d: Date): string {
  const h = d.getHours();
  if (h < 5) return "Good night";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 21) return "Good evening";
  return "Good night";
}
