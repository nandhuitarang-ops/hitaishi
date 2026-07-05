import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { eq, desc } from "drizzle-orm";
import { Shell } from "@/components/Shell";
import { Card, CardBody, CardHeader, Pill } from "@/components/ui";
import { db } from "@/lib/db";
import { mentorFeedbacks, users, profiles, sessions } from "@/db/schema";
import { requireRole } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Feedback Log — Hitaishi Admin",
  robots: "noindex, nofollow",
};

export default async function AdminFeedbackPage() {
  const user = await requireRole("admin");

  // 1. Fetch all feedbacks
  const list = await db
    .select({
      id: mentorFeedbacks.id,
      rating: mentorFeedbacks.rating,
      content: mentorFeedbacks.content,
      createdAt: mentorFeedbacks.createdAt,
      studentId: mentorFeedbacks.studentId,
      mentorId: mentorFeedbacks.mentorId,
      sessionTitle: sessions.title,
    })
    .from(mentorFeedbacks)
    .leftJoin(sessions, eq(mentorFeedbacks.sessionId, sessions.id))
    .orderBy(desc(mentorFeedbacks.createdAt));

  // 2. Fetch users to map IDs to names
  const userList = await db
    .select({ id: users.id, fullName: profiles.fullName })
    .from(users)
    .leftJoin(profiles, eq(users.id, profiles.userId));
  const userMap = new Map(
    (userList as { id: string; fullName: string | null }[]).map(u => [u.id, u.fullName || "Unknown"])
  );

  const feedbacks = (list as any[]).map((item: any) => ({
    ...item,
    studentName: userMap.get(item.studentId) || "Unknown Student",
    mentorName: userMap.get(item.mentorId) || "Unknown Mentor",
  }));

  // 3. Calculate statistics
  const totalCount = feedbacks.length;
  const avgRating = totalCount > 0
    ? (feedbacks.reduce((acc: number, curr: any) => acc + curr.rating, 0) / totalCount).toFixed(2)
    : "0.00";

  // Calculate rating breakdown
  const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  feedbacks.forEach(f => {
    const r = f.rating as 1 | 2 | 3 | 4 | 5;
    if (ratingDistribution[r] !== undefined) {
      ratingDistribution[r]++;
    }
  });

  return (
    <Shell
      role="admin"
      active="feedback"
      pageCode="A.09 — FEEDBACK LOG"
      pageTitle="Feedback Auditing"
      pageSubtitle="Monitor system-wide session and mentorship quality feedback left by students."
      user={user}
    >
      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
        <Card className="p-5">
          <div className="meta text-xs uppercase tracking-wider text-ink-soft">Total Feedbacks</div>
          <div className="font-serif text-3xl mt-2 text-primary-deep">{totalCount}</div>
        </Card>
        <Card className="p-5">
          <div className="meta text-xs uppercase tracking-wider text-ink-soft">Platform Avg Rating</div>
          <div className="font-serif text-3xl mt-2 text-primary-deep flex items-baseline gap-1">
            {avgRating} <span className="text-xl text-[var(--color-primary)]">★</span>
          </div>
        </Card>
        <Card className="p-5 md:col-span-2">
          <div className="meta text-xs uppercase tracking-wider text-ink-soft mb-2">Rating Distribution</div>
          <div className="flex items-center gap-3 text-xs">
            {[5, 4, 3, 2, 1].map(r => {
              const countVal = ratingDistribution[r as 1 | 2 | 3 | 4 | 5];
              const pct = totalCount > 0 ? Math.round((countVal / totalCount) * 100) : 0;
              return (
                <div key={r} className="flex-1 flex flex-col gap-1">
                  <div className="flex justify-between font-mono">
                    <span>{r}★</span>
                    <span>{countVal}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-primary)]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader meta="AUDIT TABLE" title="All Student Feedback Submissions" />
        <CardBody>
          {feedbacks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-rule/50 text-ink-soft uppercase text-xs tracking-wider">
                    <th className="py-3 px-4">Submitted At</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Mentor</th>
                    <th className="py-3 px-4">Session</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4">Feedback Content</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule/35">
                  {feedbacks.map((fb) => (
                    <tr key={fb.id} className="hover:bg-surface-elevated/40 transition-colors">
                      <td className="py-3 px-4 text-xs font-mono text-ink-soft">
                        {new Date(fb.createdAt).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          href={`/admin/students/${fb.studentId}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {fb.studentName}
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          href={`/admin/mentors/${fb.mentorId}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {fb.mentorName}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-ink-soft max-w-[150px] truncate" title={fb.sessionTitle || undefined}>
                        {fb.sessionTitle ?? <span className="text-slate-400/80 italic text-xs">Weekly Log</span>}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-0.5 text-sm text-[var(--color-primary)]">
                          {Array.from({ length: fb.rating }).map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                          {Array.from({ length: 5 - fb.rating }).map((_, i) => (
                            <span key={i} className="text-slate-200">★</span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-ink-soft max-w-sm truncate" title={fb.content}>
                        {fb.content}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-ink-soft text-center py-8">
              No feedback submissions have been logged on the platform yet.
            </p>
          )}
        </CardBody>
      </Card>
    </Shell>
  );
}
