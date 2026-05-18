import { Shell } from "@/components/Shell";

const mockRoster = [
  { id: "s1", name: "Aarav Sharma", target: "JEE Adv '27", recentScore: 142, delta: -12, engagement: "Low", lastSession: "2 days ago" },
  { id: "s2", name: "Diya Patel", target: "JEE Adv '27", recentScore: 168, delta: +5, engagement: "High", lastSession: "yesterday" },
  { id: "s3", name: "Kabir Singh", target: "JEE Adv '27", recentScore: 195, delta: +18, engagement: "High", lastSession: "today" },
  { id: "s4", name: "Saanvi Iyer", target: "JEE Main '27", recentScore: 121, delta: -3, engagement: "Medium", lastSession: "4 days ago" },
  { id: "s5", name: "Vivaan Kumar", target: "JEE Adv '28", recentScore: 88, delta: +9, engagement: "Medium", lastSession: "yesterday" },
];

const FILTERS = ["All", "Needs attention", "On track", "New"];

export default function MentorStudents() {
  return (
    <Shell role="mentor" active="students" pageCode="M.02 — My students" pageTitle={`${mockRoster.length} students.`}>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f, i) => (
          <button
            key={f}
            className={`px-3 py-1.5 text-sm border ${
              i === 0
                ? "bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]"
                : "border-[var(--rule-strong)]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b-2 border-[var(--ink)]">
            <th className="text-left py-3 meta">Student</th>
            <th className="text-left py-3 meta hidden md:table-cell">Target</th>
            <th className="text-right py-3 meta">Recent</th>
            <th className="text-right py-3 meta">Δ</th>
            <th className="text-left py-3 meta hidden md:table-cell">Engagement</th>
            <th className="text-right py-3 meta">Last session</th>
          </tr>
        </thead>
        <tbody>
          {mockRoster.map((s) => (
            <tr key={s.id} className="border-b border-[var(--rule)] hover:bg-[var(--paper-soft)]">
              <td className="py-3 font-medium">{s.name}</td>
              <td className="py-3 hidden md:table-cell text-[var(--ink-soft)]">{s.target}</td>
              <td className="py-3 text-right serif font-bold">{s.recentScore}</td>
              <td className={`py-3 text-right serif font-bold ${s.delta < 0 ? "text-[var(--ink)]" : "text-[var(--ink-soft)]"}`}>
                {s.delta > 0 ? "↑" : "↓"} {Math.abs(s.delta)}
              </td>
              <td className="py-3 hidden md:table-cell italic-serif text-[var(--ink-soft)]">{s.engagement}</td>
              <td className="py-3 text-right text-[var(--ink-soft)]">{s.lastSession}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Shell>
  );
}
