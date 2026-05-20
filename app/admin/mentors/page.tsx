import { Shell } from "@/components/Shell";
import { Card, CardHeader, LinkButton, Pill } from "@/components/ui";
import { initials } from "@/lib/format";

// TODO(phase-2f): hydrate from users + mentorVerifications + assignments + payouts
const pending = [
  {
    id: "p1",
    name: "Arjun Mehta",
    institute: "IIT Bombay",
    branch: "CS",
    jeeRank: 420,
    appliedAt: "20 Oct 2025",
    docs: { degree: "ok", id: "ok", scorecard: "ok", linkedin: "pending" } as const,
  },
  {
    id: "p2",
    name: "Isha Verma",
    institute: "IIT Delhi",
    branch: "EE",
    jeeRank: 812,
    appliedAt: "22 Oct 2025",
    docs: { degree: "ok", id: "ok", scorecard: "missing", linkedin: "ok" } as const,
  },
  {
    id: "p3",
    name: "Vikram Sahu",
    institute: "IIT Kanpur",
    branch: "Physics",
    jeeRank: 1247,
    appliedAt: "24 Oct 2025",
    docs: { degree: "ok", id: "ok", scorecard: "ok", linkedin: "ok" } as const,
  },
];

const active = [
  {
    id: "m1",
    name: "Ananya Rao",
    institute: "Mechanical · IIT KGP",
    joined: "12 Aug 2023",
    students: 31,
    rating: 5.0,
    doubts: 2150,
    earnings: 580000,
    status: "active" as const,
  },
  {
    id: "m2",
    name: "Siddharth Jain",
    institute: "Computer Science · IIT Bombay",
    joined: "01 Sep 2023",
    students: 18,
    rating: 4.7,
    doubts: 1240,
    earnings: 340000,
    status: "active" as const,
  },
  {
    id: "m3",
    name: "Neha Kapur",
    institute: "Chemistry · IIT Madras",
    joined: "15 Nov 2024",
    students: 6,
    rating: 4.4,
    doubts: 410,
    earnings: 92000,
    status: "on_break" as const,
  },
  {
    id: "m4",
    name: "Vikram Singh",
    institute: "Maths · IIT Roorkee",
    joined: "01 Mar 2025",
    students: 0,
    rating: 3.8,
    doubts: 12,
    earnings: 0,
    status: "suspended" as const,
  },
];

const docTone = {
  ok: "primary",
  pending: "warn",
  missing: "error",
} as const;

const statusTone = {
  active: "primary",
  on_break: "warn",
  suspended: "error",
} as const;

const statusLabel = {
  active: "Active",
  on_break: "On break",
  suspended: "Suspended",
} as const;

export default function AdminMentorsPage() {
  return (
    <Shell
      role="admin"
      active="mentors"
      pageCode="A.04 — MENTORS MANAGEMENT"
      pageTitle="Mentors"
      pageSubtitle="Verification queue and active mentor roster."
    >
      <Card className="mb-6">
        <CardHeader
          meta={`VERIFICATION QUEUE · ${pending.length} PENDING`}
          title="Applications awaiting review"
        />
        <ul>
          {pending.map((p) => (
            <li
              key={p.id}
              className="px-5 py-5 border-t border-rule first:border-t-0"
            >
              <div className="flex flex-wrap items-start gap-4">
                <div className="avatar !w-12 !h-12 !text-base">
                  {initials(p.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-serif text-lg">{p.name}</div>
                  <div className="text-sm text-ink-soft mt-1">
                    {p.institute} · {p.branch} · JEE Adv AIR {p.jeeRank}
                  </div>
                  <div className="meta mt-1">Applied {p.appliedAt}</div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Pill tone={docTone[p.docs.degree]}>Degree</Pill>
                    <Pill tone={docTone[p.docs.id]}>ID card</Pill>
                    <Pill tone={docTone[p.docs.scorecard]}>JEE scorecard</Pill>
                    <Pill tone={docTone[p.docs.linkedin]}>LinkedIn</Pill>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="chip-ghost">Reject</button>
                  <button className="chip-cta">Approve →</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="overflow-x-auto">
        <CardHeader
          meta={`ACTIVE MENTORS · ${active.length}`}
          title="Roster, performance, and payouts"
          action={<button className="chip-ghost text-xs">Export CSV</button>}
        />
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-elevated border-b border-rule">
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wider text-ink-soft">
                Mentor
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wider text-ink-soft hidden md:table-cell">
                Joined
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-mono uppercase tracking-wider text-ink-soft">
                Students
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-mono uppercase tracking-wider text-ink-soft">
                Rating
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-mono uppercase tracking-wider text-ink-soft hidden md:table-cell">
                Doubts
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-mono uppercase tracking-wider text-ink-soft hidden lg:table-cell">
                Earnings
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wider text-ink-soft">
                Status
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-mono uppercase tracking-wider text-ink-soft" />
            </tr>
          </thead>
          <tbody>
            {active.map((m) => (
              <tr key={m.id} className="border-b border-rule last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="avatar !w-8 !h-8 !text-xs">{initials(m.name)}</div>
                    <div>
                      <div className="font-medium">{m.name}</div>
                      <div className="meta">{m.institute}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-ink-soft font-mono text-xs">
                  {m.joined}
                </td>
                <td className="px-4 py-3 text-right">{m.students}</td>
                <td className="px-4 py-3 text-right">
                  <span className="font-mono">{m.rating.toFixed(1)}</span> ★
                </td>
                <td className="px-4 py-3 text-right hidden md:table-cell">{m.doubts.toLocaleString()}</td>
                <td className="px-4 py-3 text-right hidden lg:table-cell font-mono text-xs">
                  ₹{m.earnings.toLocaleString("en-IN")}
                </td>
                <td className="px-4 py-3">
                  <Pill tone={statusTone[m.status]}>{statusLabel[m.status]}</Pill>
                </td>
                <td className="px-4 py-3 text-right">
                  <LinkButton href={`/admin/mentors/${m.id}`} variant="ghost" size="sm">
                    Open
                  </LinkButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="meta text-center mt-5">
        Showing 1–{active.length} of 124 mentors
      </div>
    </Shell>
  );
}
