import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Card, CardBody, CardHeader, LinkButton, Pill, Textarea } from "@/components/ui";
import { initials } from "@/lib/format";

// TODO(phase-2f): hydrate from profiles + conversations + messages + sessions + mentor notes
interface PageProps {
  params: { studentId: string };
}

export default function MentorStudentDetailPage({ params }: PageProps) {
  const student = {
    id: params.studentId,
    name: "Arjun Mehra",
    cohort: "Class XII · CBSE",
    target: "IIT Bombay · CS",
    joinedAt: "12 Oct 2025",
    lastSession: "3 days ago",
    engagement: 94,
    status: "Online · IIT Bombay Aspirant",
    mockTrend: [180, 192, 205, 215, 220],
    mockTrendDelta: +12,
  };

  const messages = [
    {
      id: "m1",
      from: "student" as const,
      body: "Done with the complex numbers module. De Moivre's still tricky in the applied questions.",
      at: "Yesterday · 9:14 PM",
    },
    {
      id: "m2",
      from: "mentor" as const,
      body: "Good progress. Let's tighten polar representation in Thursday's session. Did you finish the mock?",
      at: "Yesterday · 10:02 PM",
    },
    {
      id: "m3",
      from: "student" as const,
      body: "Mock done — improved overall but I lost time on the last 3. Sharing my working.",
      at: "Today · 11:18 AM",
      attachment: { name: "mock3_working.pdf", size: "4.2 MB" },
    },
  ];

  const pastSessions = [
    { id: "ps1", title: "Calculus drill I", at: "14 May 2026", duration: "45 min" },
    { id: "ps2", title: "Monthly review", at: "02 May 2026", duration: "60 min" },
  ];

  return (
    <Shell
      role="mentor"
      active="students"
      pageCode="M.05 — STUDENT CONVERSATION"
      pageTitle={student.name}
      pageSubtitle={`${student.cohort} · Target ${student.target}`}
      actions={
        <div className="flex items-center gap-2">
          <Link href="/mentor/students" className="chip-ghost text-xs">
            ← Back to roster
          </Link>
          <LinkButton href={`/session/${student.id}`} size="sm">
            Schedule session
          </LinkButton>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
        <div className="flex flex-col gap-5">
          <Card className="flex flex-col" style={{ minHeight: "60vh" }}>
            <CardHeader meta="MESSAGES" title="Conversation" />
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-3 ${m.from === "mentor" ? "flex-row-reverse" : ""}`}
                >
                  <div className="avatar !w-8 !h-8 !text-xs flex-shrink-0">
                    {m.from === "mentor" ? "M" : initials(student.name)}
                  </div>
                  <div
                    className={`max-w-[70%] flex flex-col ${m.from === "mentor" ? "items-end" : ""}`}
                  >
                    <div
                      className={`rounded-card px-4 py-3 text-sm ${m.from === "mentor" ? "bg-primary text-primary-on" : "bg-surface-elevated text-ink"}`}
                    >
                      {m.body}
                      {m.attachment && (
                        <div className="mt-3 px-3 py-2 bg-surface-card text-ink rounded-input border border-rule font-mono text-xs">
                          📎 {m.attachment.name} · {m.attachment.size}
                        </div>
                      )}
                    </div>
                    <span className="meta mt-1">{m.at}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-rule p-4 flex items-center gap-3">
              <input
                placeholder="Reply to Arjun…"
                className="flex-1 rounded-input border border-rule-strong px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
              <button className="chip-cta">Send</button>
            </div>
          </Card>

          <Card>
            <CardHeader meta="PRIVATE NOTES" title="Mentor scratchpad" action={<span className="meta">auto-saves</span>} />
            <CardBody>
              <Textarea
                defaultValue="Arjun is excelling in conceptual understanding but needs to work on time management for JEE Advanced-style numericals. Thursday session: emphasize polar representation speed."
                rows={4}
              />
            </CardBody>
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader meta="PROFILE" title="Snapshot" />
            <CardBody>
              <div className="meta">JOINED</div>
              <div className="text-sm">{student.joinedAt}</div>
              <div className="meta mt-3">LAST SESSION</div>
              <div className="text-sm">{student.lastSession}</div>
              <div className="meta mt-3">ENGAGEMENT</div>
              <div className="font-serif text-2xl text-primary-deep mt-1">
                {student.engagement}/100
              </div>
              <div className="meta mt-3">MOCK TREND</div>
              <div className="text-sm">
                Last 5: {student.mockTrend.join(" · ")}{" "}
                <span className="text-primary-deep">
                  ({student.mockTrendDelta > 0 ? "+" : ""}
                  {student.mockTrendDelta}%)
                </span>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader meta="PAST SESSIONS" title="Recordings" />
            <ul>
              {pastSessions.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-3 px-5 py-3 border-t border-rule first:border-t-0"
                >
                  <div className="min-w-0">
                    <div className="text-sm truncate">{s.title}</div>
                    <div className="meta mt-1">
                      {s.at} · {s.duration}
                    </div>
                  </div>
                  <LinkButton href="/mentor/students" variant="ghost" size="sm">
                    Watch
                  </LinkButton>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader meta="SHARED RESOURCES" title="Recent" />
            <CardBody>
              <Pill tone="neutral">Mechanics — formula sheet</Pill>
              <Pill tone="neutral" className="ml-2">
                Calculus drill PDF
              </Pill>
            </CardBody>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
