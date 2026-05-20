import { Shell } from "@/components/Shell";
import { Card, CardBody, CardHeader, LinkButton, Pill } from "@/components/ui";
import { initials } from "@/lib/format";

// TODO(phase-2f): hydrate from sessions + sessionParticipants + 100ms room state
const systemStatus = {
  activeStreams: 12,
  mediaServer: "Media Server 04",
  latencyMs: 24,
  encryption: "AES-256",
  version: "v2.4.0-STABLE",
};

const tabs = [
  { key: "live", label: "Live now", count: 12 },
  { key: "recordings", label: "Recordings", count: 248 },
  { key: "flagged", label: "Flagged", count: 2 },
];

const live = [
  {
    id: "s1",
    title: "Rotational mechanics · 1:1",
    subject: "Physics",
    mentor: "Priya Sharma",
    student: "Aarav S.",
    duration: "00:42:15",
    health: "ok" as const,
  },
  {
    id: "s2",
    title: "Mole concept · group",
    subject: "Chemistry",
    mentor: "Ananya Iyer",
    student: "12 attendees",
    duration: "00:21:08",
    health: "ok" as const,
  },
  {
    id: "s3",
    title: "Integration by parts · 1:1",
    subject: "Math",
    mentor: "Rahul Verma",
    student: "Kabir S.",
    duration: "00:54:33",
    health: "warn" as const,
  },
];

const flagged = [
  {
    id: "f1",
    conv: "Aarav ↔ Priya",
    reason: "Phone number detected in message",
    at: "12 min ago",
  },
  {
    id: "f2",
    conv: "Saanvi ↔ Rahul",
    reason: "WhatsApp keyword detected",
    at: "2 hrs ago",
  },
];

const recordings = [
  {
    id: "r1",
    title: "Kinematics review",
    who: "Priya × Aarav",
    duration: "47 min",
    date: "16 Feb",
  },
  {
    id: "r2",
    title: "Vectors warm-up",
    who: "Priya × Diya",
    duration: "32 min",
    date: "12 Feb",
  },
];

const healthTone = { ok: "primary", warn: "warn", error: "error" } as const;

export default function AdminSessionsPage() {
  return (
    <Shell
      role="admin"
      active="sessions"
      pageCode="A.05 — SESSION MONITOR"
      pageTitle="Session monitor"
      pageSubtitle="Live oversight of in-progress sessions, with TOS-disclosed silent observe."
      actions={
        <input
          placeholder="Search session, mentor, student…"
          className="rounded-input border border-rule-strong px-3 py-2 text-sm w-72 focus:outline-none focus:border-primary"
        />
      }
    >
      <Card className="mb-6">
        <CardBody className="flex flex-wrap items-center gap-6">
          <div>
            <div className="meta">ACTIVE STREAMS</div>
            <div className="font-serif text-3xl text-primary-deep mt-1">
              {systemStatus.activeStreams}
            </div>
          </div>
          <div>
            <div className="meta">MEDIA SERVER</div>
            <div className="text-sm mt-1 font-mono">{systemStatus.mediaServer}</div>
          </div>
          <div>
            <div className="meta">LATENCY</div>
            <div className="text-sm mt-1 font-mono">{systemStatus.latencyMs}ms</div>
          </div>
          <div>
            <div className="meta">ENCRYPTION</div>
            <div className="text-sm mt-1 font-mono">{systemStatus.encryption}</div>
          </div>
          <div>
            <div className="meta">VERSION</div>
            <div className="text-sm mt-1 font-mono">{systemStatus.version}</div>
          </div>
          <Pill tone="primary" className="ml-auto">
            ● All systems nominal
          </Pill>
        </CardBody>
      </Card>

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

      <div className="grid gap-3 mb-8">
        {live.map((s) => (
          <Card key={s.id}>
            <CardBody className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[260px]">
                <div className="flex items-center gap-3 flex-wrap">
                  <Pill tone="coral">● LIVE</Pill>
                  <Pill tone="primary">{s.subject}</Pill>
                  <span className="font-mono text-sm">{s.duration}</span>
                  <Pill tone={healthTone[s.health]}>{s.health}</Pill>
                </div>
                <div className="font-serif text-lg mt-2">{s.title}</div>
                <div className="flex items-center gap-3 mt-2 text-sm text-ink-soft">
                  <span className="avatar !w-7 !h-7 !text-xs">{initials(s.mentor)}</span>
                  <span>{s.mentor}</span>
                  <span className="meta">→ {s.student}</span>
                </div>
              </div>
              <LinkButton href={`/session/${s.id}`} size="sm">
                Watch silently →
              </LinkButton>
            </CardBody>
          </Card>
        ))}
      </div>

      <p className="meta italic mb-8">
        Admin silent observe is disclosed in mentor & student TOS. Oversight is a feature, not surveillance.
      </p>

      <Card className="mb-6">
        <CardHeader meta="FLAGGED CONVERSATIONS" title={`${flagged.length} items`} />
        <ul>
          {flagged.map((f) => (
            <li
              key={f.id}
              className="flex items-center justify-between gap-3 px-5 py-3 border-t border-rule first:border-t-0"
            >
              <div>
                <div className="text-sm">{f.conv}</div>
                <div className="meta mt-0.5">
                  {f.reason} · {f.at}
                </div>
              </div>
              <LinkButton href={`/admin/sessions/flagged/${f.id}`} variant="ghost" size="sm">
                Review →
              </LinkButton>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardHeader meta="RECENT RECORDINGS" title="Watch playback" />
        <ul>
          {recordings.map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between gap-3 px-5 py-3 border-t border-rule first:border-t-0"
            >
              <div>
                <div className="text-sm">{r.title}</div>
                <div className="meta mt-0.5">
                  {r.who} · {r.duration} · {r.date}
                </div>
              </div>
              <LinkButton href={`/admin/sessions/recording/${r.id}`} variant="ghost" size="sm">
                Watch →
              </LinkButton>
            </li>
          ))}
        </ul>
      </Card>
    </Shell>
  );
}
