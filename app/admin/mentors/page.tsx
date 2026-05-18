import { Shell } from "@/components/Shell";

const pending = [
  {
    id: "m9",
    name: "Arjun Mehra",
    institute: "IIT Madras",
    branch: "CSE '26",
    rank: "AIR 1247",
    docs: ["Degree", "ID", "JEE scorecard"],
    appliedAt: "2 days ago",
  },
  {
    id: "m10",
    name: "Priya Nair",
    institute: "IIT Delhi",
    branch: "Elec '25",
    rank: "AIR 892",
    docs: ["Degree", "ID"],
    appliedAt: "5 days ago",
  },
];

const active = [
  { id: "m1", name: "Rohan Kapoor", institute: "IIT Bombay · Mech '27", students: 5, payout: 15 },
  { id: "m2", name: "Priya Mehta", institute: "IIT Delhi · CSE '26", students: 4, payout: 20 },
  { id: "m3", name: "Vikram Sahu", institute: "IIT Kanpur · Phys '25", students: 3, payout: 18 },
];

export default function AdminMentors() {
  return (
    <Shell role="admin" active="mentors" pageCode="A.03 — Mentors" pageTitle="Verify and manage.">
      <section>
        <div className="flex items-center gap-2 mb-3">
          <span className="signal-dot" aria-hidden />
          <div className="meta">Pending verification · {pending.length}</div>
        </div>
        <ul className="flex flex-col gap-3">
          {pending.map((m) => (
            <li key={m.id} className="border-2 border-[var(--signal)] bg-[var(--signal-soft)] p-4">
              <div className="flex items-baseline justify-between mb-2">
                <div>
                  <div className="serif text-lg font-bold">{m.name}</div>
                  <div className="text-sm text-[var(--ink-soft)] mt-0.5">
                    {m.institute} · {m.branch} · {m.rank} · applied {m.appliedAt}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="chip-ghost">Reject</button>
                  <button className="chip-cta">Approve →</button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {m.docs.map((d) => (
                  <a key={d} href="#" className="px-2 py-1 text-xs border border-[var(--ink)] italic-serif">
                    📄 {d}
                  </a>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="meta mb-3">Active mentors · {active.length}</div>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-[var(--ink)]">
              <th className="text-left py-3 meta">Mentor</th>
              <th className="text-left py-3 meta hidden md:table-cell">Institute</th>
              <th className="text-right py-3 meta">Students</th>
              <th className="text-right py-3 meta">Platform fee</th>
              <th className="text-right py-3 meta">Actions</th>
            </tr>
          </thead>
          <tbody>
            {active.map((m) => (
              <tr key={m.id} className="border-b border-[var(--rule)]">
                <td className="py-3 font-medium">{m.name}</td>
                <td className="py-3 hidden md:table-cell text-[var(--ink-soft)]">{m.institute}</td>
                <td className="py-3 text-right">{m.students}</td>
                <td className="py-3 text-right">{m.payout}%</td>
                <td className="py-3 text-right">
                  <a href="#" className="italic-serif text-sm underline">Open →</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </Shell>
  );
}
