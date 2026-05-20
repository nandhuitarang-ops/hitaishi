import { Shell } from "@/components/Shell";
import { Card, CardBody, LinkButton, Pill } from "@/components/ui";

// TODO(phase-2f): replace with Drizzle queries on resources + resourceShares
const announcements = [
  {
    id: "a1",
    title: "Mock test #3 marking scheme is up",
    body: "Aim for ≥220/300 to be on track for top-1000 AIR.",
    at: "2h ago",
  },
];

const tabs = ["All", "Physics", "Chemistry", "Math", "Mock Tests"];

const resources = [
  {
    id: "r1",
    title: "JEE Adv 2026 — Final 60-day checklist",
    description:
      "Day-by-day breakdown of revision, mock test cadence, and rest days.",
    subject: "All",
    kind: "PDF",
    size: "1.2 MB",
    sharedBy: "Priya Sharma",
    at: "2h ago",
  },
  {
    id: "r2",
    title: "Wave optics — Young's double-slit shortcuts",
    description: "5 patterns that show up in 80% of past JEE Adv questions.",
    subject: "Physics",
    kind: "PDF",
    size: "3.4 MB",
    sharedBy: "Rahul Verma",
    at: "1d ago",
  },
  {
    id: "r3",
    title: "Aldol & Cannizzaro — annotated mechanisms",
    description: "Hand-drawn mechanisms for the four most-tested reactions.",
    subject: "Chemistry",
    kind: "PDF",
    size: "5.8 MB",
    sharedBy: "Ananya Iyer",
    at: "3d ago",
  },
  {
    id: "r4",
    title: "Integration by parts — visual intuition video",
    description: "10-minute breakdown of when to pick u and dv.",
    subject: "Math",
    kind: "MP4",
    size: "42 MB",
    sharedBy: "Priya Sharma",
    at: "4d ago",
  },
];

export default function StudentResourcesPage() {
  return (
    <Shell
      role="student"
      active="resources"
      pageCode="S.07 — RESOURCES LIBRARY"
      pageTitle="Resources"
      pageSubtitle="Curated by your mentors. Filter by subject or recency."
      actions={
        <input
          placeholder="Search resources…"
          className="rounded-input border border-rule-strong px-3 py-2 text-sm w-64 focus:outline-none focus:border-primary"
        />
      }
    >
      {announcements.length > 0 && (
        <Card className="mb-5 border-secondary/40 bg-secondary-soft/40">
          <CardBody>
            <div className="meta">📌 PINNED ANNOUNCEMENT</div>
            {announcements.map((a) => (
              <div key={a.id} className="mt-2">
                <div className="font-serif text-lg">{a.title}</div>
                <div className="text-sm text-ink-soft mt-1">{a.body}</div>
                <div className="meta mt-2">{a.at}</div>
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
        <div className="flex flex-wrap gap-2">
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
        <select className="rounded-input border border-rule-strong px-3 py-2 text-sm bg-surface-card">
          <option>Newest first</option>
          <option>By subject</option>
        </select>
      </div>

      <div className="grid gap-3">
        {resources.map((r) => (
          <Card key={r.id}>
            <CardBody className="flex flex-wrap items-start gap-4">
              <div className="flex-1 min-w-[260px]">
                <div className="flex items-center gap-2 flex-wrap">
                  <Pill tone="primary">{r.subject}</Pill>
                  <Pill tone="neutral">{r.kind}</Pill>
                  <span className="meta">{r.size}</span>
                </div>
                <div className="font-serif text-lg mt-2">{r.title}</div>
                <div className="text-sm text-ink-soft mt-1">{r.description}</div>
                <div className="meta mt-2">
                  Shared by {r.sharedBy} · {r.at}
                </div>
              </div>
              <LinkButton href="/student/resources" variant="primary" size="sm">
                Open →
              </LinkButton>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="mt-6 text-center">
        <div className="meta mb-3">Showing {resources.length} of 58 resources</div>
        <button className="chip-ghost">Load more resources →</button>
      </div>
    </Shell>
  );
}
