import Link from "next/link";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/session";
import { PrivacyNoticeBanner } from "@/components/PrivacyNoticeBanner";
import { ClientRedirector } from "./ClientRedirector";
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
      <main className="min-h-screen bg-surface flex items-center justify-center p-6">
        <div className="text-center">
          <div className="font-serif text-2xl mb-2 text-ink">Session not found</div>
          <Link href={`/${user.role}/sessions`} className="text-ink-soft underline text-sm">
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
      <main className="min-h-screen bg-surface flex items-center justify-center p-6">
        <div className="text-center">
          <div className="font-serif text-2xl mb-2 text-ink">Session not found</div>
          <Link href={`/${user.role}/sessions`} className="text-ink-soft underline text-sm">
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

  // If mentor/host enters and status is scheduled, mark session as live and redirect
  if (isHost && sessionRow.status === "scheduled") {
    await db
      .update(sessions)
      .set({ status: "live", startedAt: new Date() })
      .where(eq(sessions.id, sessionId));
    sessionRow.status = "live";
  }

  // If the session is already live, redirect directly to Jitsi
  if (sessionRow.status === "live" && sessionRow.meetLink) {
    redirect(sessionRow.meetLink);
  }

  const hostRow = await db
    .select({ fullName: profiles.fullName, email: users.email })
    .from(users)
    .leftJoin(profiles, eq(profiles.userId, users.id))
    .where(eq(users.id, sessionRow.hostId))
    .limit(1);
  const hostName = hostRow[0]?.fullName ?? hostRow[0]?.email.split("@")[0] ?? "Mentor";

  return (
    <main className="min-h-screen bg-surface flex items-center justify-center p-6">
      <PrivacyNoticeBanner />
      <ClientRedirector
        sessionId={sessionId}
        meetLink={sessionRow.meetLink}
        title={sessionRow.title}
        hostName={hostName}
        role={user.role}
      />
    </main>
  );
}
