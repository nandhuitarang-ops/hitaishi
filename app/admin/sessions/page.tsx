import { Shell } from "@/components/Shell";

const live = [
  { id: "s1", title: "Rotational mechanics — 1:1", mentor: "Rohan K.", student: "Aarav S.", started: "8 min" },
  { id: "s2", title: "Mole concept group", mentor: "Priya M.", student: "12 students", started: "21 min" },
];

const flagged = [
  { id: "f1", conv: "Aarav ↔ Rohan", reason: "phone number detected", at: "12 min ago" },
  { id: "f2", conv: "Saanvi ↔ Priya", reason: "off-platform mention (whatsapp)", at: "2 hrs ago" },
];

const recordings = [
  { id: "r1", title: "Kinematics review", who: "Rohan + Aarav", duration: "47 min", date: "16 May" },
  { id: "r2", title: "Vectors warm-up", who: "Rohan + Diya", duration: "32 min", date: "12 May" },
];

export default function AdminSessions() {
  return (
    <Shell role="admin" active="sessions" pageCode="A.04 — Session monitor" pageTitle="What's happening right now.">
      <section>
        <div className="meta mb-3">Live · {live.length}</div>
        <ul className="flex flex-col gap-3">
          {live.map((l) => (
            <li key={l.id} className="border border-[var(--rule)] p-4 flex items-center justify-between">
              <div>
                <div className="serif text-base font-bold">{l.title}</div>
                <div className="text-sm text-[var(--ink-soft)] mt-1">
                  {l.mentor} · {l.student} · started {l.started}
                </div>
              </div>
              <button className="chip-cta">Watch silently →</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-3">
          <span className="signal-dot" aria-hidden />
          <div className="meta">Flagged conversations · {flagged.length}</div>
        </div>
        <ul className="flex flex-col">
          {flagged.map((f) => (
            <li key={f.id} className="flex items-center justify-between py-3 border-b border-[var(--rule)]">
              <div>
                <div className="text-[15px]">{f.conv}</div>
                <div className="text-xs text-[var(--ink-soft)] mt-1">{f.reason} · {f.at}</div>
              </div>
              <a href="#" className="italic-serif text-sm underline">Review →</a>
            </li>
          ))}
        </ul>
        <p className="meta mt-3">Disclosed in student/mentor TOS · oversight is a feature, not surveillance.</p>
      </section>

      <section>
        <div className="meta mb-3">Recent recordings</div>
        <ul className="flex flex-col">
          {recordings.map((r) => (
            <li key={r.id} className="flex items-center justify-between py-3 border-b border-[var(--rule)]">
              <div>
                <div className="text-[15px]">{r.title}</div>
                <div className="text-xs text-[var(--ink-soft)] mt-1">{r.who} · {r.duration} · {r.date}</div>
              </div>
              <a href="#" className="italic-serif text-sm underline">Watch →</a>
            </li>
          ))}
        </ul>
      </section>
    </Shell>
  );
}
