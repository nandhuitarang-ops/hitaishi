import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { sessions } from "@/db/schema";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function RecordingPage({ params }: PageProps) {
  const { id } = await params;
  await requireRole("admin");

  const rows = await db
    .select({ title: sessions.title })
    .from(sessions)
    .where(eq(sessions.id, id))
    .limit(1);

  const session = rows[0] ?? null;

  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="max-w-2xl mx-auto mt-12 text-center">
        <div className="font-serif text-4xl text-primary-deep mb-4">Recording Playback</div>
        {session && <p className="text-lg mb-2">{session.title}</p>}
        <p className="text-sm text-ink-soft mb-8">
          Recording playback is coming soon. Session recordings will be available here once processing is complete.
        </p>
        <Link
          href="/admin/sessions"
          className="rounded-button bg-primary text-white px-6 py-2 text-sm hover:bg-primary-deep transition-colors"
        >
          ← Back to session monitor
        </Link>
      </div>
    </div>
  );
}
