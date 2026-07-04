import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { sessions } from "@/db/schema";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function ObserveSessionPage({ params }: PageProps) {
  const { id } = await params;
  await requireRole("admin");

  const rows = await db
    .select({ meetLink: sessions.meetLink, title: sessions.title })
    .from(sessions)
    .where(eq(sessions.id, id))
    .limit(1);

  const session = rows[0] ?? null;

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface p-6">
        <div className="text-center">
          <div className="font-serif text-4xl text-primary-deep mb-4">Session not found</div>
          <a href="/admin/sessions" className="text-primary underline text-sm">
            ← Back to session monitor
          </a>
        </div>
      </div>
    );
  }

  if (!session.meetLink) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface p-6">
        <div className="text-center">
          <div className="font-serif text-2xl mb-2">No meet link available</div>
          <p className="text-sm text-ink-soft mb-4">This session hasn't generated a meet link yet.</p>
          <a href="/admin/sessions" className="text-primary underline text-sm">
            ← Back to session monitor
          </a>
        </div>
      </div>
    );
  }

  redirect(session.meetLink);
}
