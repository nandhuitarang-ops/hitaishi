import Link from "next/link";
import { redirect } from "next/navigation";
import { and, eq, inArray, isNull, or } from "drizzle-orm";
import { getCurrentUser } from "@/lib/session";
import { PrivacyNoticeBanner } from "@/components/PrivacyNoticeBanner";
import { SessionRoomClient } from "./SessionRoomClient";
import { db } from "@/lib/db";
import { sessions, sessionParticipants, users, profiles } from "@/db/schema";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function SessionRoomPage({ params }: PageProps) {
  const { sessionId } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "student" && user.role !== "mentor") {
    redirect(`/${user.role}/dashboard`);
  }

  if (!UUID_RE.test(sessionId)) {
    return (
      <main className="min-h-screen bg-[#0c1612] text-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="font-serif text-2xl mb-2">Session not found</div>
          <Link href={`/${user.role}/sessions`} className="text-white/60 underline">
            Back to sessions
          </Link>
        </div>
      </main>
    );
  }

  const sessionRow = await db.query.sessions.findFirst({
    where: eq(sessions.id, sessionId),
  });

  if (!sessionRow) {
    return (
      <main className="min-h-screen bg-[#0c1612] text-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="font-serif text-2xl mb-2">Session not found</div>
          <Link href={`/${user.role}/sessions`} className="text-white/60 underline">
            Back to sessions
          </Link>
        </div>
      </main>
    );
  }

  const isHost = sessionRow.hostId === user.id;
  const isParticipant = isHost
    ? true
    : (await db
        .select({ sessionId: sessionParticipants.sessionId })
        .from(sessionParticipants)
        .where(
          and(
            eq(sessionParticipants.sessionId, sessionRow.id),
            eq(sessionParticipants.userId, user.id),
          ),
        )
        .limit(1)).length > 0;

  if (!isHost && !isParticipant) {
    redirect(`/${user.role}/sessions`);
  }

  const hostRow = await db
    .select({ fullName: profiles.fullName, email: users.email })
    .from(users)
    .leftJoin(profiles, eq(profiles.userId, users.id))
    .where(eq(users.id, sessionRow.hostId))
    .limit(1);
  const hostName = hostRow[0]?.fullName ?? hostRow[0]?.email.split("@")[0] ?? "Mentor";

  const participants = await db
    .select({
      userId: sessionParticipants.userId,
      fullName: profiles.fullName,
      email: users.email,
      roleInSession: sessionParticipants.roleInSession,
    })
    .from(sessionParticipants)
    .innerJoin(users, eq(users.id, sessionParticipants.userId))
    .leftJoin(profiles, eq(profiles.userId, users.id))
    .where(eq(sessionParticipants.sessionId, sessionRow.id));

  const participantList = [
    {
      id: sessionRow.hostId,
      name: hostName,
      role: "mentor" as const,
      muted: false,
      raised: false,
      primary: true,
    },
    ...participants
      .filter((p: any) => p.userId !== sessionRow.hostId)
      .map((p: any) => ({
        id: p.userId,
        name: p.fullName ?? p.email.split("@")[0],
        role: "student" as const,
        muted: false,
        raised: false,
      })),
  ];

  const elapsedHms = sessionRow.startedAt
    ? (() => {
        const ms = Date.now() - sessionRow.startedAt!.getTime();
        const total = Math.max(0, Math.floor(ms / 1000));
        const h = Math.floor(total / 3600);
        const m = Math.floor((total % 3600) / 60);
        const s = total % 60;
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
      })()
    : null;

  return (
    <main className="min-h-screen bg-[#0c1612] text-white flex flex-col">
      <PrivacyNoticeBanner />
      <header className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-white/60 font-mono">
            S.08 · {sessionRow.status === "live" ? "LIVE SESSION" : "SESSION ROOM"}
          </div>
          <h1 className="font-serif text-lg mt-0.5">{sessionRow.title}</h1>
        </div>
        <div className="flex items-center gap-4">
          {sessionRow.status === "live" && elapsedHms && (
            <span className="font-mono text-sm text-white/70">{elapsedHms}</span>
          )}
          <Link
            href={`/${user.role}/sessions`}
            className="px-3 py-1.5 rounded-btn bg-red-600 hover:bg-red-700 text-sm font-medium"
          >
            Leave session
          </Link>
        </div>
      </header>

      <SessionRoomClient
        sessionId={sessionRow.id}
        meetLink={sessionRow.meetLink}
        status={sessionRow.status}
        participants={participantList}
        mentorName={hostName}
        currentUserId={user.id}
      />
    </main>
  );
}
