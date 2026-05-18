import { Shell } from "@/components/Shell";

const stats = [
  { label: "Active students", value: "47", delta: "+8 this week" },
  { label: "Mentors", value: "12", delta: "2 pending" },
  { label: "Sessions today", value: "31", delta: "4 live now" },
  { label: "Failed webhooks (24h)", value: "0", delta: "clean" },
];

const attentionItems = [
  { id: "a1", label: "2 mentor applications need verification", href: "/admin/mentors", severity: "high" },
  { id: "a2", label: "1 flagged conversation (off-platform mention)", href: "/admin/sessions", severity: "med" },
  { id: "a3", label: "1 refund request from Aarav (3 days ago)", href: "/admin/payments", severity: "med" },
];

const liveSessions = [
  { id: "s1", title: "Rotational mechanics — Aarav + Rohan", started: "8 min ago" },
  { id: "s2", title: "Mole concept group · 12 students", started: "21 min ago" },
];

export default function AdminDashboard() {
  return (
    <Shell role="admin" active="dashboard" pageCode="A.01 — Control" pageTitle="Tuesday, 11:47 PM.">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <article key={s.label} className="border-t-2 border-[var(--ink)] pt-3">
            <div className="meta">{s.label}</div>
            <div className="serif text-3xl font-bold mt-2">{s.value}</div>
            <div className="text-xs text-[var(--ink-soft)] mt-1">{s.delta}</div>
          </article>
        ))}
      </div>

      <section>
        <div className="meta mb-3">Needs your attention</div>
        <ul className="flex flex-col">
          {attentionItems.map((a) => (
            <li
              key={a.id}
              className={`flex items-center justify-between py-3 border-b border-[var(--rule)] ${
                a.severity === "high" ? "border-l-4 border-l-[var(--signal)] pl-3" : ""
              }`}
            >
              <span className="text-[15px]">{a.label}</span>
              <a href={a.href} className="italic-serif text-sm underline">Resolve →</a>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="meta mb-3">Live sessions</div>
        <ul className="flex flex-col">
          {liveSessions.map((s) => (
            <li key={s.id} className="flex items-center justify-between py-3 border-b border-[var(--rule)]">
              <div>
                <div className="text-[15px]">{s.title}</div>
                <div className="text-xs text-[var(--ink-soft)] mt-1">started {s.started}</div>
              </div>
              <button className="chip-ghost">Watch silently →</button>
            </li>
          ))}
        </ul>
      </section>
    </Shell>
  );
}
