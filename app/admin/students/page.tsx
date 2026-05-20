import { Shell } from "@/components/Shell";
import { Card, LinkButton, Pill } from "@/components/ui";
import { initials } from "@/lib/format";

// TODO(phase-2f): hydrate from users + profiles + subscriptions + assignments
const filters = [
  { key: "all", label: "All", count: 247 },
  { key: "active", label: "Active", count: 211 },
  { key: "expired", label: "Expired", count: 22 },
  { key: "comp", label: "Comp", count: 8 },
  { key: "refunded", label: "Refunded", count: 6 },
];

const students = [
  {
    id: "u1",
    name: "Aarav Sharma",
    email: "aarav@example.com",
    phone: "+91 98XX XXXX21",
    plan: "JEE Adv 6mo",
    paymentStatus: "captured" as const,
    mentor: "Priya Sharma",
    cohort: "JEE Adv 2027",
    expires: "30 Sep 2026",
    lastActive: "12m ago",
    status: "active" as const,
  },
  {
    id: "u2",
    name: "Diya Patel",
    email: "diya@example.com",
    phone: "+91 98XX XXXX42",
    plan: "JEE Adv 6mo",
    paymentStatus: "captured" as const,
    mentor: "Priya Sharma",
    cohort: "JEE Adv 2027",
    expires: "12 Oct 2026",
    lastActive: "2h ago",
    status: "active" as const,
  },
  {
    id: "u3",
    name: "Saanvi Iyer",
    email: "saanvi@example.com",
    phone: "+91 98XX XXXX13",
    plan: "JEE Main 6mo",
    paymentStatus: "refunded" as const,
    mentor: "Rahul Verma",
    cohort: "JEE Main 2027",
    expires: "—",
    lastActive: "1w ago",
    status: "refunded" as const,
  },
  {
    id: "u4",
    name: "Internal Test",
    email: "test@mentoriit.com",
    phone: "—",
    plan: "Comp",
    paymentStatus: "n/a" as const,
    mentor: "Priya Sharma",
    cohort: "Internal",
    expires: "—",
    lastActive: "1d ago",
    status: "comp" as const,
  },
];

const statusTone = {
  active: "primary",
  expired: "warn",
  refunded: "error",
  comp: "neutral",
} as const;

const statusLabel = {
  active: "Active",
  expired: "Expired",
  refunded: "Refunded",
  comp: "Comp",
} as const;

const paymentTone = {
  captured: "primary",
  refunded: "error",
  failed: "error",
  pending: "warn",
  "n/a": "neutral",
} as const;

export default function AdminStudentsPage() {
  return (
    <Shell
      role="admin"
      active="students"
      pageCode="A.03 — STUDENTS MANAGEMENT"
      pageTitle="Students"
      pageSubtitle="Filter, search, and act on the full student roster."
      actions={
        <div className="flex items-center gap-2">
          <input
            placeholder="Search name, email, phone…"
            className="rounded-input border border-rule-strong px-3 py-2 text-sm w-72 focus:outline-none focus:border-primary"
          />
          <button className="chip-cta">+ Add manually</button>
        </div>
      }
    >
      <div className="flex flex-wrap gap-2 mb-5">
        {filters.map((f, i) => (
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

      <div className="flex items-center justify-between mb-3">
        <div className="meta">2 selected</div>
        <div className="flex items-center gap-2">
          <button className="chip-ghost text-xs">Message selected</button>
          <button className="chip-ghost text-xs">Export CSV</button>
        </div>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-elevated border-b border-rule">
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wider text-ink-soft">
                <input type="checkbox" />
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wider text-ink-soft">
                Student
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wider text-ink-soft hidden md:table-cell">
                Plan / Payment
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wider text-ink-soft hidden lg:table-cell">
                Mentor
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wider text-ink-soft hidden xl:table-cell">
                Expires
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wider text-ink-soft">
                Status
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-mono uppercase tracking-wider text-ink-soft">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-b border-rule last:border-0 hover:bg-surface-elevated/60">
                <td className="px-4 py-3">
                  <input type="checkbox" />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="avatar !w-8 !h-8 !text-xs">
                      {initials(s.name)}
                    </div>
                    <div>
                      <div className="font-medium">{s.name}</div>
                      <div className="meta">{s.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <div className="text-sm">{s.plan}</div>
                  <Pill tone={paymentTone[s.paymentStatus]} className="mt-1">
                    {s.paymentStatus}
                  </Pill>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell text-ink-soft">
                  {s.mentor}
                </td>
                <td className="px-4 py-3 hidden xl:table-cell font-mono text-xs">
                  {s.expires}
                </td>
                <td className="px-4 py-3">
                  <Pill tone={statusTone[s.status]}>{statusLabel[s.status]}</Pill>
                  <div className="meta mt-1">{s.lastActive}</div>
                </td>
                <td className="px-4 py-3 text-right">
                  <LinkButton href={`/admin/students/${s.id}`} variant="ghost" size="sm">
                    Open
                  </LinkButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="flex items-center justify-between mt-5">
        <div className="meta">Showing 1–{students.length} of 247</div>
        <div className="flex items-center gap-2">
          <button className="chip-ghost">← Prev</button>
          <span className="meta">Page 1 / 25</span>
          <button className="chip-ghost">Next →</button>
        </div>
      </div>
    </Shell>
  );
}
