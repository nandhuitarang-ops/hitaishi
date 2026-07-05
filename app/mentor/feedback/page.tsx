import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { eq, desc, avg, count } from "drizzle-orm";
import { Shell } from "@/components/Shell";
import { Card, CardBody, CardHeader } from "@/components/ui";
import { db } from "@/lib/db";
import { mentorFeedbacks, users, profiles, sessions } from "@/db/schema";
import { requireRole } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Student Feedback — Hitaishi Mentor",
  robots: "noindex, nofollow",
};

export default async function MentorFeedbackPage() {
  const user = await requireRole("mentor");

  // 1. Fetch feedbacks
  const feedbacks = await db
    .select({
      id: mentorFeedbacks.id,
      rating: mentorFeedbacks.rating,
      content: mentorFeedbacks.content,
      createdAt: mentorFeedbacks.createdAt,
      studentName: profiles.fullName,
      sessionTitle: sessions.title,
    })
    .from(mentorFeedbacks)
    .leftJoin(profiles, eq(mentorFeedbacks.studentId, profiles.userId))
    .leftJoin(sessions, eq(mentorFeedbacks.sessionId, sessions.id))
    .where(eq(mentorFeedbacks.mentorId, user.id))
    .orderBy(desc(mentorFeedbacks.createdAt));

  // 2. Calculate summary statistics
  const totalCount = feedbacks.length;
  const avgRating = totalCount > 0 
    ? (feedbacks.reduce((acc: number, curr: any) => acc + curr.rating, 0) / totalCount).toFixed(1)
    : "N/A";

  return (
    <Shell
      role="mentor"
      active="feedback"
      pageCode="M.08 — STUDENT FEEDBACK"
      pageTitle="Student Feedback Logs"
      pageSubtitle="Review your weekly performance ratings and comments submitted by your students."
      user={user}
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <Card className="p-5">
          <div className="meta text-xs uppercase tracking-wider text-ink-soft">Average Rating</div>
          <div className="font-serif text-3xl mt-2 text-primary-deep flex items-baseline gap-1">
            {avgRating} <span className="text-xl text-[var(--color-primary)]">★</span>
          </div>
        </Card>
        <Card className="p-5">
          <div className="meta text-xs uppercase tracking-wider text-ink-soft">Total Responses</div>
          <div className="font-serif text-3xl mt-2 text-primary-deep">{totalCount}</div>
        </Card>
        <Card className="p-5">
          <div className="meta text-xs uppercase tracking-wider text-ink-soft">Target Rating</div>
          <div className="font-serif text-3xl mt-2 text-slate-400">4.5+</div>
        </Card>
      </div>

      {/* Feedbacks List */}
      <Card>
        <CardHeader meta="RESPONSES" title="Reviews from matched students" />
        <CardBody>
          {feedbacks.length > 0 ? (
            <div className="space-y-4 divide-y divide-rule/35">
              {(feedbacks as any[]).map((fb: any, idx: number) => (
                <div key={fb.id} className={`pt-4 ${idx === 0 ? "pt-0" : ""}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-sm text-ink flex flex-wrap items-center gap-2">
                        <span>{fb.studentName || "Anonymous Student"}</span>
                        {fb.sessionTitle && (
                          <span className="text-[10px] bg-primary/10 text-primary-deep font-mono px-2 py-0.5 rounded-full border border-primary/20">
                            Session: {fb.sessionTitle}
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-ink-soft font-mono mt-0.5">
                        {new Date(fb.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex gap-0.5 text-sm text-[var(--color-primary)]">
                      {Array.from({ length: fb.rating }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                      {Array.from({ length: 5 - fb.rating }).map((_, i) => (
                        <span key={i} className="text-slate-200">★</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-ink-soft mt-2 leading-relaxed bg-surface-elevated/20 p-3 rounded-xl border border-rule/30">
                    &ldquo;{fb.content}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-soft text-center py-6">
              You haven&apos;t received any feedback reviews from students yet.
            </p>
          )}
        </CardBody>
      </Card>
    </Shell>
  );
}
