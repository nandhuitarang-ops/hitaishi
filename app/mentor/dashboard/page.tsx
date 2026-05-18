import Link from "next/link";
import { Shell } from "@/components/Shell";
import { rankStudents, type StudentSignal } from "@/lib/triage";
import { formatLastSeen, initials } from "@/lib/format";

const mockSignals: StudentSignal[] = [
  {
    studentId: "s1",
    fullName: "Aarav Sharma",
    unreadCount: 3,
    lastReplyAt: new Date(Date.now() - 26 * 3600_000),
    recentScoreDelta: -12,
    sessionsAttendedLast7d: 1,
  },
  {
    studentId: "s2",
    fullName: "Diya Patel",
    unreadCount: 1,
    lastReplyAt: new Date(Date.now() - 4 * 3600_000),
    recentScoreDelta: +5,
    sessionsAttendedLast7d: 3,
  },
  {
    studentId: "s3",
    fullName: "Kabir Singh",
    unreadCount: 0,
    lastReplyAt: new Date(Date.now() - 60 * 60_000),
    recentScoreDelta: +18,
    sessionsAttendedLast7d: 2,
  },
];

const todayCalendar = [
  { time: "12:05 AM", who: "Aarav · Rotational mechanics" },
  { time: "07:30 PM", who: "Group · Mole concept marathon" },
  { time: "09:00 PM", who: "Diya · Vector calculus" },
];

export default function MentorDashboard() {
  const now = new Date();
  const ranked = rankStudents(mockSignals, now);
  const needsAttention = ranked.filter((r) => r.urgency > 5);

  return (
    <Shell role="mentor" active="dashboard" pageCode="M.01 — Triage" pageTitle="Who needs you tonight.">
      <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-6">
        <section>
          <div className="meta mb-3">Needs your attention · {needsAttention.length}</div>
          <ul className="flex flex-col">
            {ranked.map((r) => {
              const urgent = r.urgency > 5;
              return (
                <li
                  key={r.studentId}
                  className="grid grid-cols-[40px_1fr_auto_auto] gap-3 items-center
                             py-3 border-b border-[var(--rule)]"
                >
                  <div className="avatar w-10 h-10 text-base">{initials(r.fullName)}</div>
                  <div className="min-w-0">
                    <div className="text-[15px] font-medium truncate">{r.fullName}</div>
                    <div className="text-xs text-[var(--ink-soft)] mt-0.5">
                      {r.unreadCount > 0 && <>{r.unreadCount} unread · </>}
                      last reply {formatLastSeen(r.lastReplyAt, now)}
                      {r.recentScoreDelta < 0 && (
                        <>
                          {" "}
                          · <span className="text-[var(--ink)]">score {r.recentScoreDelta}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="meta">{Math.round(r.urgency)}</div>
                  <Link
                    href={`/mentor/students/${r.studentId}`}
                    className={urgent ? "chip-cta" : "chip-ghost"}
                  >
                    Open →
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <aside>
          <div className="meta mb-3">Today · {todayCalendar.length} sessions</div>
          <ul className="flex flex-col gap-3">
            {todayCalendar.map((c, i) => (
              <li
                key={i}
                className="border-l-2 border-[var(--ink)] pl-3 py-1"
              >
                <div className="serif font-bold text-base">{c.time}</div>
                <div className="text-sm text-[var(--ink-soft)] mt-0.5">{c.who}</div>
              </li>
            ))}
          </ul>
          <Link href="/mentor/calendar" className="chip-ghost mt-4 inline-flex">
            Full calendar →
          </Link>
        </aside>
      </div>

      <footer className="mt-auto pt-4 border-t-2 border-[var(--ink)] grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="serif text-2xl font-bold">{mockSignals.length}</div>
          <div className="meta mt-1">Active students</div>
        </div>
        <div>
          <div className="serif text-2xl font-bold">12</div>
          <div className="meta mt-1">Sessions this week</div>
        </div>
        <div>
          <div className="serif text-2xl font-bold">94%</div>
          <div className="meta mt-1">Reply rate</div>
        </div>
      </footer>
    </Shell>
  );
}
