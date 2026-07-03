import Link from "next/link";
import { redirect } from "next/navigation";
import { Shell } from "@/components/Shell";
import { PrivacyNoticeBanner } from "@/components/PrivacyNoticeBanner";
import { Card, CardBody, LinkButton, Pill } from "@/components/ui";
import { initials } from "@/lib/format";
import { db } from "@/lib/db";
import { sessions, sessionParticipants, users, profiles } from "@/db/schema";
import { and, desc, eq, gt, gte, inArray, lt, or } from "drizzle-orm";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

function fmtDateTime(d: Date) {
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fmtDate(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function timeUntil(d: Date) {
  const diff = d.getTime() - Date.now();
  if (diff <= 0) return null;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return { liveInMin: mins, label: `in ${mins} min` };
  const hours = Math.floor(mins / 60);
  if (hours < 24) return { liveInMin: mins, label: `in ${hours}h ${mins % 60}m` };
  const days = Math.floor(hours / 24);
  return { liveInMin: mins, label: `in ${days}d` };
}

function durationHms(d: Date | null) {
  if (!d) return null;
  const ms = Date.now() - d.getTime();
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default async function StudentSessionsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "student") redirect(`/${user.role}/sessions`);

  const myParticipations = await db
    .select({ sessionId: sessionParticipants.sessionId })
    .from(sessionParticipants)
    .where(eq(sessionParticipants.userId, user.id));
  const mySessionIds = myParticipations.map((p: any) => p.sessionId);

  const mySessions =
    mySessionIds.length === 0
      ? []
      : await db
          .select({
            id: sessions.id,
            title: sessions.title,
            type: sessions.type,
            status: sessions.status,
            scheduledAt: sessions.scheduledAt,
            durationMinutes: sessions.durationMinutes,
            meetLink: sessions.meetLink,
            hostName: profiles.fullName,
            hostEmail: users.email,
            startedAt: sessions.startedAt,
          })
          .from(sessions)
          .innerJoin(users, eq(users.id, sessions.hostId))
          .leftJoin(profiles, eq(profiles.userId, sessions.hostId))
          .where(inArray(sessions.id, mySessionIds))
          .orderBy(desc(sessions.scheduledAt));

  const now = new Date();
  const liveNow = mySessions.find((s: any) => s.status === "live");
  const upcoming = mySessions.filter(
    (s: any) => s.status === "scheduled" && new Date(s.scheduledAt).getTime() >= now.getTime() - 60 * 60 * 1000,
  );
  const past = mySessions.filter(
    (s: any) => s.status === "completed" || s.status === "cancelled" || (s.status === "scheduled" && new Date(s.scheduledAt).getTime() < now.getTime() - 60 * 60 * 1000),
  );

  const nextUp = upcoming[0];
  const startingSoon = nextUp ? timeUntil(nextUp.scheduledAt) : null;

  return (
    <Shell
      role="student"
      active="sessions"
      pageCode="S.05 — SESSIONS"
      pageTitle="Your sessions"
      pageSubtitle="Upcoming and recent live sessions with your mentors."
    >
      <PrivacyNoticeBanner />
      {liveNow ? (
        <Card className="border-secondary bg-secondary-soft/30">
          <CardBody className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[260px]">
              <Pill tone="coral">● LIVE NOW</Pill>
              <div className="font-serif text-xl mt-2">{liveNow.title}</div>
              <div className="text-sm text-ink-soft mt-1">
                {liveNow.hostName ?? liveNow.hostEmail.split("@")[0]} · {durationHms(liveNow.startedAt)}
              </div>
            </div>
            <LinkButton href={liveNow.meetLink || `/session/${liveNow.id}`} size="lg" target="_blank">
              Join now →
            </LinkButton>
          </CardBody>
        </Card>
      ) : nextUp && startingSoon && startingSoon.liveInMin <= 60 ? (
        <Card className="border-primary bg-primary-soft/30">
          <CardBody className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[260px]">
              <Pill tone="coral">STARTS {startingSoon.label.toUpperCase()}</Pill>
              <div className="font-serif text-xl mt-2">{nextUp.title}</div>
              <div className="text-sm text-ink-soft mt-1">
                {nextUp.hostName ?? nextUp.hostEmail.split("@")[0]} · {nextUp.durationMinutes} min
              </div>
            </div>
            <LinkButton href={`/session/${nextUp.id}`} size="lg">
              View details →
            </LinkButton>
          </CardBody>
        </Card>
      ) : null}

      <section className="mt-8">
        <div className="meta mb-3">UPCOMING</div>
        {upcoming.length === 0 ? (
          <Card>
            <CardBody>
              <div className="text-sm text-ink-soft text-center py-6">
                No upcoming sessions.
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="grid gap-4">
            {upcoming.map((s: any) => {
              const mentorName = s.hostName ?? s.hostEmail.split("@")[0];
              return (
                <Card key={s.id}>
                  <CardBody className="flex flex-wrap items-center gap-4">
                    <div className="flex-1 min-w-[260px]">
                      <div className="flex items-center gap-3">
                        <Pill tone="primary">{s.type === "group" ? "GROUP" : "1-ON-1"}</Pill>
                        <span className="meta">{fmtDateTime(s.scheduledAt)}</span>
                      </div>
                      <div className="font-serif text-lg mt-2">{s.title}</div>
                      <div className="flex items-center gap-3 mt-2 text-sm text-ink-soft">
                        <span className="avatar !w-7 !h-7 !text-xs">{initials(mentorName)}</span>
                        <span>{mentorName}</span>
                        <span className="meta">· {s.durationMinutes} min</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <LinkButton href={`/session/${s.id}`} variant="ghost" size="sm">
                        Details →
                      </LinkButton>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-10">
        <div className="meta mb-3">PAST SESSIONS</div>
        {past.length === 0 ? (
          <Card>
            <CardBody>
              <div className="text-sm text-ink-soft text-center py-6">
                No past sessions yet.
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="grid gap-4">
            {past.map((s: any) => {
              const mentorName = s.hostName ?? s.hostEmail.split("@")[0];
              return (
                <Card key={s.id}>
                  <CardBody className="flex flex-wrap items-center gap-4">
                    <div className="flex-1 min-w-[260px]">
                      <span className="meta">{fmtDate(s.scheduledAt)} · {s.durationMinutes} min</span>
                      <div className="font-serif text-lg mt-1">{s.title}</div>
                      <div className="text-sm text-ink-soft mt-1">{mentorName}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Pill tone={s.status === "cancelled" ? "error" : "neutral"}>{s.status}</Pill>
                      <LinkButton href={`/session/${s.id}`} variant="ghost" size="sm">
                        Open
                      </LinkButton>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </Shell>
  );
}
