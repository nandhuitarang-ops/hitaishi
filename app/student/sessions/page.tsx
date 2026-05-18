import { Shell } from "@/components/Shell";
import { formatTimeUntil } from "@/lib/format";

const mockUpcoming = [
  {
    id: "s1",
    title: "Rotational mechanics — pre-class doubt clearing",
    scheduledAt: new Date(Date.now() + 18 * 60_000),
    type: "1:1",
  },
  {
    id: "s2",
    title: "Group: Mole concept marathon",
    scheduledAt: new Date(Date.now() + 26 * 3600_000),
    type: "Group",
  },
];

const mockPast = [
  {
    id: "p1",
    title: "Kinematics review",
    at: new Date(Date.now() - 48 * 3600_000),
    duration: "47 min",
    recordingReady: true,
  },
  {
    id: "p2",
    title: "Vectors warm-up",
    at: new Date(Date.now() - 6 * 24 * 3600_000),
    duration: "32 min",
    recordingReady: true,
  },
];

export default function StudentSessions() {
  const now = new Date();
  return (
    <Shell role="student" active="sessions" pageCode="S.04 — Sessions" pageTitle="Your sessions.">
      <section>
        <div className="meta mb-3">Upcoming</div>
        <ul className="flex flex-col gap-3">
          {mockUpcoming.map((s) => {
            const until = formatTimeUntil(s.scheduledAt, now);
            const imminent = until === "live now" || until.startsWith("in ");
            return (
              <li
                key={s.id}
                className={`flex items-center gap-4 p-4 border ${
                  imminent
                    ? "border-[var(--signal)] bg-[var(--signal-soft)]"
                    : "border-[var(--rule)]"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="serif text-lg font-bold leading-tight">
                    {s.title}
                  </div>
                  <div className="text-sm text-[var(--ink-soft)] mt-1">
                    {s.type} · {s.scheduledAt.toLocaleString("en-IN", {
                      weekday: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <span className="meta">{until}</span>
                  <button className="chip-cta">Join →</button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-4">
        <div className="meta mb-3">Past · recordings</div>
        <ul className="flex flex-col">
          {mockPast.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between py-3 border-b border-[var(--rule)]"
            >
              <div>
                <div className="text-[15px]">{p.title}</div>
                <div className="text-xs text-[var(--ink-soft)] mt-1">
                  {p.at.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}{" "}
                  · {p.duration}
                </div>
              </div>
              <a
                href="#"
                className={`italic-serif text-sm ${
                  p.recordingReady
                    ? "text-[var(--ink)] underline"
                    : "text-[var(--ink-faint)] pointer-events-none"
                }`}
              >
                {p.recordingReady ? "Watch →" : "Processing"}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </Shell>
  );
}
