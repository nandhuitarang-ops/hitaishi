import Link from "next/link";
import { Shell } from "@/components/Shell";
import {
  formatDayCounter,
  formatTimeUntil,
  formatLastSeen,
  initials,
} from "@/lib/format";

// TODO(phase-2f): replace with real queries against the user's session
const mockMentor = {
  fullName: "Rohan Kapoor",
  institute: "IIT Bombay",
  branch: "Mech",
  year: "'27",
  unreadCount: 2,
  lastSeenAt: new Date(Date.now() - 4 * 60_000),
};
const mockUpcomingSession = {
  scheduledAt: new Date(Date.now() + 18 * 60_000),
  title: "Rotational mechanics — pre-class doubt clearing",
};
const mockResources = [
  { id: "1", title: "Newton's laws cheat sheet", kind: "PDF" },
  { id: "2", title: "Mole concept playlist", kind: "Link" },
  { id: "3", title: "Integration tricks", kind: "PDF" },
];
const mockProgress = { day: 47, total: 180, examTarget: "JEE Adv 2027" };
const mockStudentName = "Aarav";

export default function StudentDashboard() {
  const now = new Date();
  const greeting = greetingFor(now);

  return (
    <Shell role="student" active="dashboard" pageCode="S.02 — Dashboard" pageTitle={`${greeting}, ${mockStudentName}.`}>
      <p className="text-[var(--ink-soft)] max-w-[60ch] -mt-2">
        Three things tonight. Your mentor. Your next session. What landed today.
      </p>

      <article className="border border-[var(--rule)] p-5 flex items-center gap-4">
        <div className="avatar">{initials(mockMentor.fullName)}</div>
        <div className="flex-1 min-w-0">
          <div className="serif text-xl font-bold leading-tight">
            {mockMentor.fullName}
          </div>
          <div className="text-sm text-[var(--ink-soft)] mt-1">
            {mockMentor.institute} · {mockMentor.branch} {mockMentor.year} ·{" "}
            {formatLastSeen(mockMentor.lastSeenAt, now)}
          </div>
        </div>
        <Link href="/student/chat" className="chip-cta whitespace-nowrap">
          {mockMentor.unreadCount > 0 && <span className="signal-dot" aria-hidden />}
          Open chat
          {mockMentor.unreadCount > 0 && (
            <span className="ml-1 opacity-80">· {mockMentor.unreadCount} unread</span>
          )}
        </Link>
      </article>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <section className="border-t-2 border-[var(--ink)] pt-3">
          <div className="flex justify-between meta">
            <span>Next session</span>
            <span>{formatTimeUntil(mockUpcomingSession.scheduledAt, now)}</span>
          </div>
          <div className="serif text-3xl font-bold mt-2 leading-none">
            {mockUpcomingSession.scheduledAt.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </div>
          <div className="text-sm text-[var(--ink-soft)] mt-1">
            {mockUpcomingSession.title}
          </div>
          <Link href="/student/sessions" className="chip-ghost mt-4 inline-flex">
            See all sessions →
          </Link>
        </section>

        <section className="border-t-2 border-[var(--ink)] pt-3">
          <div className="flex justify-between meta">
            <span>Resources today</span>
            <span>{mockResources.length} new</span>
          </div>
          <ul className="mt-3 flex flex-col">
            {mockResources.map((r) => (
              <li
                key={r.id}
                className="flex justify-between py-2 border-b border-dotted border-[var(--rule)] text-sm"
              >
                <span>{r.title}</span>
                <span className="italic-serif text-[var(--ink-soft)]">
                  {r.kind}
                </span>
              </li>
            ))}
          </ul>
          <Link href="/student/resources" className="chip-ghost mt-4 inline-flex">
            Open library →
          </Link>
        </section>
      </div>

      <footer className="mt-auto pt-4 border-t-2 border-[var(--ink)] flex items-center justify-between gap-4">
        <div className="flex items-baseline gap-2">
          <span className="serif text-2xl font-bold">
            {formatDayCounter(mockProgress.day, mockProgress.total).split(" of ")[0]}
          </span>
          <span className="meta">
            of {mockProgress.total} · {mockProgress.examTarget}
          </span>
        </div>
        <div
          className="flex-1 h-[3px] bg-[var(--rule)] relative max-w-[300px]"
          aria-hidden
        >
          <div
            className="absolute inset-y-0 left-0 bg-[var(--ink)]"
            style={{ width: `${(mockProgress.day / mockProgress.total) * 100}%` }}
          />
        </div>
      </footer>
    </Shell>
  );
}

function greetingFor(d: Date): string {
  const h = d.getHours();
  if (h < 5) return "Good night";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 21) return "Good evening";
  return "Good night";
}
