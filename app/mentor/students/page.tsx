import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Card, LinkButton, Pill } from "@/components/ui";
import { initials } from "@/lib/format";

// TODO(phase-2f): hydrate from assignments + profiles + mock score queries
const roster = [
  {
    id: "s1",
    name: "Arjun Srinivasan",
    cohort: "IIT-JEE 2027",
    joined: "12 Dec 2025",
    lastActive: "12m ago",
    engagement: 94,
    recentMock: 142,
    mockDelta: +12,
    lastSession: "yesterday",
    status: "on_track" as const,
  },
  {
    id: "s2",
    name: "Meera Krishnan",
    cohort: "IIT-JEE 2027",
    joined: "01 Nov 2025",
    lastActive: "2d ago",
    engagement: 58,
    recentMock: 121,
    mockDelta: -3,
    lastSession: "4 days ago",
    status: "at_risk" as const,
  },
  {
    id: "s3",
    name: "Rohan Sethi",
    cohort: "IIT-JEE 2027",
    joined: "20 Oct 2025",
    lastActive: "5h ago",
    engagement: 72,
    recentMock: 88,
    mockDelta: -12,
    lastSession: "2 days ago",
    status: "needs_attention" as const,
  },
  {
    id: "s4",
    name: "Kabir Singh",
    cohort: "IIT-JEE 2028",
    joined: "08 Jan 2026",
    lastActive: "1h ago",
    engagement: 88,
    recentMock: 195,
    mockDelta: +18,
    lastSession: "today",
    status: "on_track" as const,
  },
  {
    id: "s5",
    name: "Saanvi Iyer",
    cohort: "JEE Main 2027",
    joined: "15 Dec 2025",
    lastActive: "3d ago",
    engagement: 41,
    recentMock: 78,
    mockDelta: -8,
    lastSession: "5 days ago",
    status: "at_risk" as const,
  },
];

const FILTERS = [
  { key: "all", label: "All", count: 12 },
  { key: "attention", label: "Needs attention", count: 3 },
  { key: "on_track", label: "On track", count: 7 },
  { key: "at_risk", label: "At risk", count: 2 },
  { key: "new", label: "New (<2 wks)", count: 1 },
];

const statusTone = {
  on_track: "primary",
  needs_attention: "warn",
  at_risk: "error",
} as const;
const statusLabel = {
  on_track: "On track",
  needs_attention: "Attention",
  at_risk: "At risk",
} as const;

export default function MentorStudentsPage() {
  return (
    <Shell
      role="mentor"
      active="students"
      pageCode="M.04 — MY STUDENTS"
      pageTitle="Student roster"
      pageSubtitle="Triage and track individual performance across your cohort."
      actions={
        <input
          placeholder="Search students…"
          className="rounded-input border border-rule-strong px-3 py-2 text-sm w-64 focus:outline-none focus:border-primary"
        />
      }
    >
      <div className="flex flex-wrap gap-2 mb-5">
        {FILTERS.map((f, i) => (
          <button
            key={f.key}
            className={`px-4 py-2 rounded-pill text-sm flex items-center gap-2 ${
              i === 0
                ? "bg-primary text-primary-on"
                : "bg-surface-card border border-rule text-ink-soft hover:bg-surface-elevated"
            }`}
          >
            {f.label}
            <span className="font-mono text-xs opacity-70">{f.count}</span>
          </button>
        ))}
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-elevated border-b border-rule">
              <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                <input type="checkbox" />
              </th>
              <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                Student
              </th>
              <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-wider text-ink-soft hidden md:table-cell">
                Cohort
              </th>
              <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-wider text-ink-soft hidden lg:table-cell">
                Joined
              </th>
              <th className="px-4 py-3 text-right font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                Engagement
              </th>
              <th className="px-4 py-3 text-right font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                Recent mock
              </th>
              <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                Status
              </th>
              <th className="px-4 py-3 text-right font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {roster.map((s) => (
              <tr
                key={s.id}
                className="border-b border-rule last:border-0 hover:bg-surface-elevated/60"
              >
                <td className="px-4 py-3">
                  <input type="checkbox" />
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/mentor/students/${s.id}`}
                    className="flex items-center gap-3 hover:text-primary-deep"
                  >
                    <div className="avatar !w-8 !h-8 !text-xs">
                      {initials(s.name)}
                    </div>
                    <div>
                      <div className="font-medium">{s.name}</div>
                      <div className="meta">last active {s.lastActive}</div>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-ink-soft">
                  {s.cohort}
                </td>
                <td className="px-4 py-3 hidden lg:table-cell font-mono text-xs text-ink-faint">
                  {s.joined}
                </td>
                <td className="px-4 py-3 text-right font-mono">{s.engagement}/100</td>
                <td className="px-4 py-3 text-right">
                  <span className="font-mono">{s.recentMock}</span>
                  <span
                    className={`ml-1 text-xs ${s.mockDelta < 0 ? "text-danger" : "text-primary-deep"}`}
                  >
                    {s.mockDelta > 0 ? "↑" : "↓"}
                    {Math.abs(s.mockDelta)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Pill tone={statusTone[s.status]}>{statusLabel[s.status]}</Pill>
                </td>
                <td className="px-4 py-3 text-right">
                  <LinkButton href={`/mentor/students/${s.id}`} variant="ghost" size="sm">
                    Open
                  </LinkButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="flex items-center justify-between mt-5">
        <div className="meta">Showing 1–{roster.length} of 12</div>
        <div className="flex items-center gap-2">
          <button className="chip-ghost">← Prev</button>
          <button className="chip-ghost">Next →</button>
        </div>
      </div>
    </Shell>
  );
}
