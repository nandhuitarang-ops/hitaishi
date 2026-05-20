import { Shell } from "@/components/Shell";
import { Card, CardBody, CardHeader, LinkButton, Pill, Field, Select, Textarea } from "@/components/ui";

// TODO(phase-2f): hydrate from doubts + doubtAnswers tables
const tabs = ["All", "Waiting", "Answered", "Resolved"] as const;

const doubts = [
  {
    id: "d1",
    subject: "Physics",
    status: "waiting" as const,
    elapsed: "18m",
    title:
      "In Q11 of mechanics worksheet — why does friction matter for torque about COM when the wheel isn't slipping?",
  },
  {
    id: "d2",
    subject: "Math",
    status: "answered" as const,
    elapsed: "2h",
    title:
      "When picking u and dv in integration by parts, is there a rule of thumb other than LIATE?",
  },
  {
    id: "d3",
    subject: "Chemistry",
    status: "resolved" as const,
    elapsed: "yesterday",
    title: "Aldol vs Cannizzaro — when does each apply?",
  },
];

const statusTone = {
  waiting: "warn" as const,
  answered: "primary" as const,
  resolved: "neutral" as const,
};

export default function StudentDoubtsPage() {
  return (
    <Shell
      role="student"
      active="doubts"
      pageCode="S.06 — DOUBT QUEUE"
      pageTitle="Resolve your concepts"
      pageSubtitle="Ask anything in plain English. Average mentor response: 2 hours."
    >
      <Card className="mb-6">
        <CardHeader meta="ASK A NEW DOUBT" title="Have a doubt? Ask now." />
        <CardBody>
          <form className="grid md:grid-cols-[1fr_1fr] gap-4">
            <Field label="Subject" required>
              <Select required>
                <option>Physics</option>
                <option>Chemistry</option>
                <option>Math</option>
                <option>Other</option>
              </Select>
            </Field>
            <Field label="Topic">
              <Select>
                <option>General mechanics</option>
                <option>Thermodynamics</option>
                <option>Electrostatics</option>
                <option>Modern physics</option>
                <option>Optics</option>
              </Select>
            </Field>
            <div className="md:col-span-2">
              <Field label="Describe your doubt" required>
                <Textarea
                  rows={4}
                  required
                  placeholder="Write your question as clearly as you can. You can attach a photo of your working below."
                />
              </Field>
            </div>
            <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button type="button" className="chip-ghost">📷 Photo</button>
                <button type="button" className="chip-ghost">🎙 Voice</button>
              </div>
              <div className="flex items-center gap-4">
                <span className="meta">Avg response: 2h</span>
                <button type="submit" className="chip-cta">
                  Submit doubt →
                </button>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>

      <div className="flex flex-wrap gap-2 mb-5">
        {tabs.map((t, i) => (
          <button
            key={t}
            className={`px-4 py-2 rounded-pill text-sm font-medium ${
              i === 0
                ? "bg-primary text-primary-on"
                : "bg-surface-card border border-rule text-ink-soft hover:bg-surface-elevated"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {doubts.map((d) => (
          <Card key={d.id}>
            <CardBody className="flex flex-wrap items-start gap-4">
              <div className="flex-1 min-w-[260px]">
                <div className="flex items-center gap-2 flex-wrap">
                  <Pill tone="primary">{d.subject}</Pill>
                  <Pill tone={statusTone[d.status]}>
                    {d.status} · {d.elapsed}
                  </Pill>
                </div>
                <div className="font-serif text-base mt-3 leading-snug">
                  {d.title}
                </div>
              </div>
              <LinkButton href={`/student/doubts/${d.id}`} variant="ghost" size="sm">
                {d.status === "waiting" ? "Edit doubt →" : "View thread →"}
              </LinkButton>
            </CardBody>
          </Card>
        ))}
      </div>
    </Shell>
  );
}
