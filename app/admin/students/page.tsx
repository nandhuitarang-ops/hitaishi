import { Shell } from "@/components/Shell";
import { formatInr } from "@/lib/format";

const mockStudents = [
  { id: "u1", name: "Aarav Sharma", email: "aarav@example.com", mentor: "Rohan Kapoor", plan: "JEE Adv 6mo", expires: "30 Sep", status: "active" },
  { id: "u2", name: "Diya Patel", email: "diya@example.com", mentor: "Rohan Kapoor", plan: "JEE Adv 6mo", expires: "12 Oct", status: "active" },
  { id: "u3", name: "Saanvi Iyer", email: "saanvi@example.com", mentor: "Priya Mehta", plan: "JEE Main 6mo", expires: "expired", status: "expired" },
  { id: "u4", name: "Test Comp", email: "test@mentoriit.com", mentor: "Rohan Kapoor", plan: "Comp", expires: "—", status: "comp" },
];

const STATUS_LABEL: Record<string, string> = {
  active: "Active",
  expired: "Expired",
  comp: "Comp",
  refund: "Refund",
  banned: "Banned",
};

export default function AdminStudents() {
  return (
    <Shell role="admin" active="students" pageCode="A.02 — Students" pageTitle={`${mockStudents.length} accounts.`}>
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="search"
          placeholder="Search by name or email…"
          className="flex-1 min-w-[200px] bg-transparent border-b border-[var(--ink)] py-2 outline-none"
        />
        <button className="chip-cta">+ Add manually</button>
      </div>

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b-2 border-[var(--ink)]">
            <th className="text-left py-3 meta">Name</th>
            <th className="text-left py-3 meta hidden md:table-cell">Mentor</th>
            <th className="text-left py-3 meta hidden md:table-cell">Plan</th>
            <th className="text-left py-3 meta">Expires</th>
            <th className="text-left py-3 meta">Status</th>
            <th className="text-right py-3 meta">Actions</th>
          </tr>
        </thead>
        <tbody>
          {mockStudents.map((s) => (
            <tr key={s.id} className="border-b border-[var(--rule)]">
              <td className="py-3">
                <div className="font-medium">{s.name}</div>
                <div className="text-xs text-[var(--ink-soft)]">{s.email}</div>
              </td>
              <td className="py-3 hidden md:table-cell">{s.mentor}</td>
              <td className="py-3 hidden md:table-cell italic-serif text-[var(--ink-soft)]">{s.plan}</td>
              <td className="py-3">{s.expires}</td>
              <td className="py-3">
                <span className={`px-2 py-0.5 text-xs border ${
                  s.status === "active"
                    ? "border-[var(--ink)]"
                    : "border-[var(--signal)] bg-[var(--signal-soft)]"
                }`}>
                  {STATUS_LABEL[s.status]}
                </span>
              </td>
              <td className="py-3 text-right">
                <a href="#" className="italic-serif text-sm underline">Open →</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <footer className="meta">Total LTV · {formatInr(mockStudents.length * 1_499_900)}</footer>
    </Shell>
  );
}
