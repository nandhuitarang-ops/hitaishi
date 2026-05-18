import { Shell } from "@/components/Shell";
import { formatLastSeen, initials } from "@/lib/format";

const mockMentor = {
  fullName: "Rohan Kapoor",
  institute: "IIT Bombay",
  lastSeenAt: new Date(Date.now() - 4 * 60_000),
};

const mockMessages = [
  {
    id: "m1",
    fromMentor: true,
    body: "Hey, did you try the rotational problem from yesterday?",
    at: new Date(Date.now() - 60 * 60_000),
  },
  {
    id: "m2",
    fromMentor: false,
    body: "Got stuck on the moment of inertia step. Can we go over it tonight?",
    at: new Date(Date.now() - 50 * 60_000),
  },
  {
    id: "m3",
    fromMentor: true,
    body: "Yes — I'll explain it before the 12:05 session. Drop your working as an image so I can see where you got stuck.",
    at: new Date(Date.now() - 6 * 60_000),
  },
];

export default function StudentChat() {
  const now = new Date();
  return (
    <Shell role="student" active="chat" pageCode="S.03 — Mentor chat" pageTitle={mockMentor.fullName}>
      <div className="flex items-center justify-between -mt-2">
        <div className="text-sm text-[var(--ink-soft)]">
          {mockMentor.institute} · {formatLastSeen(mockMentor.lastSeenAt, now)}
        </div>
        <button className="chip-ghost">Schedule call</button>
      </div>

      <div className="rule" aria-hidden />

      <ol className="flex flex-col gap-4 flex-1 overflow-y-auto pr-1">
        {mockMessages.map((m) => (
          <li
            key={m.id}
            className={`flex gap-3 ${m.fromMentor ? "" : "flex-row-reverse"}`}
          >
            {m.fromMentor && (
              <div className="avatar w-10 h-10 text-base">
                {initials(mockMentor.fullName)}
              </div>
            )}
            <div
              className={`max-w-[70%] p-3 leading-relaxed text-[15px] ${
                m.fromMentor
                  ? "bg-[var(--paper-soft)] border border-[var(--rule)]"
                  : "bg-[var(--ink)] text-[var(--paper)]"
              }`}
            >
              {m.body}
              <div
                className={`mt-2 text-[11px] tracking-wider uppercase ${
                  m.fromMentor ? "text-[var(--ink-faint)]" : "opacity-60"
                }`}
              >
                {m.at.toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </li>
        ))}
      </ol>

      <form className="mt-auto pt-4 border-t border-[var(--rule)] flex gap-3">
        <input
          type="text"
          placeholder="Write a message…"
          className="flex-1 bg-transparent border-b border-[var(--ink)] py-3 outline-none
                     placeholder:text-[var(--ink-faint)] text-[15px]"
          aria-label="Message body"
        />
        <button type="submit" className="chip-cta">
          Send →
        </button>
      </form>
    </Shell>
  );
}
