import { Shell } from "@/components/Shell";
import { Card, CardBody, CardHeader, LinkButton, Pill } from "@/components/ui";
import { initials } from "@/lib/format";
import { db } from "@/lib/db";
import { sessions, sessionParticipants, users, profiles, conversations, messages } from "@/db/schema";
import { and, desc, eq, gt, inArray, isNull, ne, or, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

function elapsedHms(d: Date | null): string {
  if (!d) return "00:00:00";
  const ms = Date.now() - d.getTime();
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default async function AdminSessionsPage() {
  const [live, recordings, flaggedConvs] = await Promise.all([
    db
      .select({
        id: sessions.id,
        title: sessions.title,
        startedAt: sessions.startedAt,
        hostName: profiles.fullName,
        hostEmail: users.email,
      })
      .from(sessions)
      .innerJoin(users, eq(users.id, sessions.hostId))
      .leftJoin(profiles, eq(profiles.userId, sessions.hostId))
      .where(eq(sessions.status, "live"))
      .orderBy(desc(sessions.startedAt))
      .limit(20),
    db
      .select({
        id: sessions.id,
        title: sessions.title,
        startedAt: sessions.startedAt,
        endedAt: sessions.endedAt,
        durationMinutes: sessions.durationMinutes,
        hostName: profiles.fullName,
        hostEmail: users.email,
      })
      .from(sessions)
      .innerJoin(users, eq(users.id, sessions.hostId))
      .leftJoin(profiles, eq(profiles.userId, sessions.hostId))
      .where(eq(sessions.status, "completed"))
      .orderBy(desc(sessions.endedAt))
      .limit(20),
    db
      .select({
        id: conversations.id,
        title: conversations.title,
        lastMessageAt: conversations.lastMessageAt,
      })
      .from(conversations)
      .where(eq(conversations.flagged, true))
      .orderBy(desc(conversations.lastMessageAt))
      .limit(20),
  ]);

  const sessionIds = [...live.map((s: any) => s.id), ...recordings.map((s: any) => s.id)];
  const participantCounts = new Map<string, number>();
  if (sessionIds.length) {
    const rows = await db
      .select({
        sessionId: sessionParticipants.sessionId,
        count: sql<number>`count(*)::int`,
      })
      .from(sessionParticipants)
      .where(inArray(sessionParticipants.sessionId, sessionIds))
      .groupBy(sessionParticipants.sessionId);
    for (const r of rows as any[]) participantCounts.set(r.sessionId, Number(r.count));
  }

  return (
    <Shell
      role="admin"
      active="sessions"
      pageCode="A.05 — SESSION MONITOR"
      pageTitle="Session monitor"
      pageSubtitle="Live oversight of in-progress sessions, with TOS-disclosed silent observe."
      actions={
        <input
          placeholder="Search session, mentor, student…"
          className="rounded-input border border-rule-strong px-3 py-2 text-sm w-72 focus:outline-none focus:border-primary"
        />
      }
    >
      <Card className="mb-6">
        <CardBody className="flex flex-wrap items-center gap-6">
          <div>
            <div className="meta">ACTIVE STREAMS</div>
            <div className="font-serif text-3xl text-primary-deep mt-1">
              {live.length}
            </div>
          </div>
          <div>
            <div className="meta">RECORDINGS</div>
            <div className="font-serif text-3xl text-primary-deep mt-1">
              {recordings.length}
            </div>
          </div>
          <div>
            <div className="meta">FLAGGED CONVOS</div>
            <div className="font-serif text-3xl text-primary-deep mt-1">
              {flaggedConvs.length}
            </div>
          </div>
          <Pill tone="primary" className="ml-auto">
            ● {live.length === 0 ? "No live sessions" : "All systems nominal"}
          </Pill>
        </CardBody>
      </Card>

      <div className="meta mb-3">LIVE NOW</div>
      {live.length === 0 ? (
        <Card className="mb-8">
          <CardBody>
            <div className="text-sm text-ink-soft text-center py-6">
              No live sessions right now.
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="grid gap-3 mb-8">
          {live.map((s: any) => {
            const mentorName = s.hostName ?? s.hostEmail.split("@")[0];
            const count = participantCounts.get(s.id) ?? 0;
            return (
              <Card key={s.id}>
                <CardBody className="flex flex-wrap items-center gap-4">
                  <div className="flex-1 min-w-[260px]">
                    <div className="flex items-center gap-3 flex-wrap">
                      <Pill tone="coral">● LIVE</Pill>
                      <span className="font-mono text-sm">{elapsedHms(s.startedAt)}</span>
                      {count > 0 && <Pill tone="neutral">{count} attendees</Pill>}
                    </div>
                    <div className="font-serif text-lg mt-2">{s.title}</div>
                    <div className="flex items-center gap-3 mt-2 text-sm text-ink-soft">
                      <span className="avatar !w-7 !h-7 !text-xs">{initials(mentorName)}</span>
                      <span>{mentorName}</span>
                    </div>
                  </div>
                  <LinkButton href={`/admin/sessions/${s.id}/observe`} size="sm">
                    Watch silently →
                  </LinkButton>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      <p className="meta italic mb-8">
        Admin silent observe is disclosed in mentor & student TOS. Oversight is a feature, not surveillance.
      </p>

      <Card className="mb-6">
        <CardHeader meta="FLAGGED CONVERSATIONS" title={`${flaggedConvs.length} items`} />
        {flaggedConvs.length === 0 ? (
          <CardBody>
            <div className="text-sm text-ink-soft text-center py-4">No flagged conversations.</div>
          </CardBody>
        ) : (
          <ul>
            {flaggedConvs.map((f: any) => (
              <li
                key={f.id}
                className="flex items-center justify-between gap-3 px-5 py-3 border-t border-rule first:border-t-0"
              >
                <div>
                  <div className="text-sm">{f.title ?? "Untitled conversation"}</div>
                  <div className="meta mt-0.5">
                    Flagged {f.lastMessageAt ? new Date(f.lastMessageAt).toLocaleString() : ""}
                  </div>
                </div>
                <LinkButton href={`/admin/conversations/${f.id}`} variant="ghost" size="sm">
                  Review →
                </LinkButton>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <CardHeader meta="RECENT RECORDINGS" title="Watch playback" />
        {recordings.length === 0 ? (
          <CardBody>
            <div className="text-sm text-ink-soft text-center py-4">No recordings yet.</div>
          </CardBody>
        ) : (
          <ul>
            {recordings.map((r: any) => {
              const mentorName = r.hostName ?? r.hostEmail.split("@")[0];
              return (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-3 px-5 py-3 border-t border-rule first:border-t-0"
                >
                  <div>
                    <div className="text-sm">{r.title}</div>
                    <div className="meta mt-0.5">
                      {mentorName} · {r.durationMinutes} min · {r.endedAt ? new Date(r.endedAt).toLocaleDateString() : ""}
                    </div>
                  </div>
                  <LinkButton href={`/admin/sessions/${r.id}/recording`} variant="ghost" size="sm">
                    Watch →
                  </LinkButton>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </Shell>
  );
}
