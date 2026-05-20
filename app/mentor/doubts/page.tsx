import { Shell } from "@/components/Shell";
import { Card, CardBody, LinkButton, Pill } from "@/components/ui";
import { initials } from "@/lib/format";

// TODO(phase-2f): hydrate from doubts + claim logic in lib/doubts.ts
const tabs = [
  { key: "waiting", label: "Waiting", count: 7 },
  { key: "claimed", label: "Mine — in progress", count: 2 },
  { key: "answered", label: "Answered today", count: 4 },
];

const waitingDoubts = [
  {
    id: "d1",
    student: "Arjun Mehra",
    subject: "Physics",
    snippet: "In Q11 of mechanics worksheet — why does friction matter for torque about COM…",
    elapsed: "05h 12m",
    reward: 40,
    sla: "warn" as const,
  },
  {
    id: "d2",
    student: "Meera Krishnan",
    subject: "Math",
    snippet: "Integration by parts: pick u with LIATE, but Q14 doesn't fit. What's the trick?",
    elapsed: "01h 45m",
    reward: 40,
    sla: "primary" as const,
  },
  {
    id: "d3",
    student: "Kabir Singh",
    subject: "Chemistry",
    snippet: "Why is Cannizzaro favoured over Aldol for non-enolizable aldehydes?",
    elapsed: "24m",
    reward: 40,
    sla: "primary" as const,
  },
];

export default function MentorDoubtsPage() {
  return (
    <Shell
      role="mentor"
      active="doubts"
      pageCode="M.06 — DOUBT INBOX"
      pageTitle="Doubt inbox"
      pageSubtitle="Claim a doubt to lock it for 30 minutes while you write the answer."
      actions={
        <div className="flex items-center gap-3">
          <Pill tone="primary">Silver Plus</Pill>
          <span className="meta">12 doubts to Gold</span>
        </div>
      }
    >
      <div className="flex flex-wrap gap-2 mb-5">
        {tabs.map((t, i) => (
          <button
            key={t.key}
            className={`px-4 py-2 rounded-pill text-sm flex items-center gap-2 ${
              i === 0
                ? "bg-primary text-primary-on"
                : "bg-surface-card border border-rule text-ink-soft hover:bg-surface-elevated"
            }`}
          >
            {t.label}
            <span className="font-mono text-xs opacity-70">{t.count}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {waitingDoubts.map((d) => (
          <Card key={d.id}>
            <CardBody className="flex flex-wrap items-start gap-4">
              <div className="avatar !w-10 !h-10 !text-sm flex-shrink-0">
                {initials(d.student)}
              </div>
              <div className="flex-1 min-w-[260px]">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{d.student}</span>
                  <Pill tone="primary">{d.subject}</Pill>
                  <Pill tone={d.sla}>⏱ {d.elapsed}</Pill>
                  <span className="meta ml-auto">Earns ₹{d.reward}</span>
                </div>
                <p className="text-sm text-ink mt-2 line-clamp-2">{d.snippet}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="chip-ghost text-xs">Voice note</button>
                <LinkButton href={`/mentor/doubts/${d.id}`} size="sm">
                  Claim & answer →
                </LinkButton>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid md:grid-cols-3 gap-3 text-center">
        <Card className="p-5">
          <div className="meta">RESOLVED TODAY</div>
          <div className="font-serif text-3xl text-primary-deep mt-2">4</div>
        </Card>
        <Card className="p-5">
          <div className="meta">EARNED TODAY</div>
          <div className="font-serif text-3xl text-primary-deep mt-2">₹160</div>
        </Card>
        <Card className="p-5">
          <div className="meta">AVG RESPONSE</div>
          <div className="font-serif text-3xl text-primary-deep mt-2">1h 42m</div>
        </Card>
      </div>
    </Shell>
  );
}
