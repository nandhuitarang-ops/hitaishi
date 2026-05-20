import { Shell } from "@/components/Shell";
import { Card, CardBody, LinkButton, Pill } from "@/components/ui";
import { initials } from "@/lib/format";

// TODO(phase-2f): replace with Drizzle queries on the sessions + sessionParticipants tables
const startingSoon = {
  liveInMin: 12,
  title: "Advanced Calculus: Integration by Parts & Series",
  mentor: { name: "Priya Sharma", subject: "Mathematics" },
  sessionId: "demo-session-1",
};

const upcoming = [
  {
    id: "u1",
    subject: "PHYSICS",
    dateLabel: "OCT 24 · 04:30 PM",
    title: "Wave optics — Young's double-slit revisit",
    mentor: "Rahul Verma",
    sessionType: "1-on-1",
  },
  {
    id: "u2",
    subject: "CHEMISTRY",
    dateLabel: "OCT 26 · 06:00 PM",
    title: "Organic synthesis — Aldol, Cannizzaro, Perkin",
    mentor: "Ananya Iyer",
    sessionType: "Group · 12 attending",
  },
  {
    id: "u3",
    subject: "MATHEMATICS",
    dateLabel: "OCT 28 · 05:30 PM",
    title: "Conic sections strategy clinic",
    mentor: "Priya Sharma",
    sessionType: "1-on-1",
  },
];

const past = [
  {
    id: "p1",
    dateLabel: "OCT 22, 2026 · 60 min",
    title: "Rotational dynamics — Q11 walkthrough",
    mentor: "Priya Sharma",
    status: "Watch recording",
    rating: 5,
  },
  {
    id: "p2",
    dateLabel: "OCT 19, 2026 · 45 min",
    title: "Solutions colligative properties",
    mentor: "Ananya Iyer",
    status: "Recording processing…",
    rating: null as number | null,
  },
];

export default function StudentSessionsPage() {
  return (
    <Shell
      role="student"
      active="sessions"
      pageCode="S.05 — SESSIONS"
      pageTitle="Your sessions"
      pageSubtitle="Upcoming and recent live sessions with your mentors."
    >
      <Card className="border-primary bg-primary-soft/30">
        <CardBody className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[260px]">
            <Pill tone="coral">LIVE IN {startingSoon.liveInMin} MIN</Pill>
            <div className="font-serif text-xl mt-2">{startingSoon.title}</div>
            <div className="text-sm text-ink-soft mt-1">
              {startingSoon.mentor.name} · {startingSoon.mentor.subject}
            </div>
          </div>
          <LinkButton href={`/session/${startingSoon.sessionId}`} size="lg">
            Join now →
          </LinkButton>
        </CardBody>
      </Card>

      <section className="mt-8">
        <div className="meta mb-3">LATER THIS WEEK</div>
        <div className="grid gap-4">
          {upcoming.map((s) => (
            <Card key={s.id}>
              <CardBody className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[260px]">
                  <div className="flex items-center gap-3">
                    <Pill tone="primary">{s.subject}</Pill>
                    <span className="meta">{s.dateLabel}</span>
                  </div>
                  <div className="font-serif text-lg mt-2">{s.title}</div>
                  <div className="flex items-center gap-3 mt-2 text-sm text-ink-soft">
                    <span className="avatar !w-7 !h-7 !text-xs">
                      {initials(s.mentor)}
                    </span>
                    <span>{s.mentor}</span>
                    <span className="meta">· {s.sessionType}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="chip-ghost text-xs">Set reminder</button>
                  <button className="chip-ghost text-xs">Add to calendar</button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="meta mb-3">PAST SESSIONS</div>
        <div className="grid gap-4">
          {past.map((s) => (
            <Card key={s.id}>
              <CardBody className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[260px]">
                  <span className="meta">{s.dateLabel}</span>
                  <div className="font-serif text-lg mt-1">{s.title}</div>
                  <div className="text-sm text-ink-soft mt-1">{s.mentor}</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-ink-soft">
                    {s.rating !== null
                      ? "★".repeat(s.rating) + "☆".repeat(5 - s.rating)
                      : ""}
                  </span>
                  <LinkButton
                    href="/student/sessions"
                    variant="ghost"
                    size="sm"
                  >
                    {s.status}
                  </LinkButton>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>
    </Shell>
  );
}
