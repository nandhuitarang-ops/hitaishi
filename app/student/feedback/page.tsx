import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { eq, and, desc } from "drizzle-orm";
import { Shell } from "@/components/Shell";
import { Card, CardBody, CardHeader } from "@/components/ui";
import { db } from "@/lib/db";
import { assignments, users, mentorFeedbacks, profiles } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";
import { StudentFeedbackForm } from "@/components/student/StudentFeedbackForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Feedback — Hitaishi Student",
  robots: "noindex, nofollow",
};

interface SearchProps {
  searchParams: Promise<{ sessionId?: string; sessionTitle?: string }>;
}

export default async function StudentFeedbackPage({ searchParams }: SearchProps) {
  const { sessionId, sessionTitle } = await searchParams;
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "student") redirect(`/${user.role}/dashboard`);

  // 1. Get active assignment
  const [activeAssignment] = await db
    .select({
      mentorId: assignments.mentorId,
      mentorName: profiles.fullName,
    })
    .from(assignments)
    .leftJoin(profiles, eq(assignments.mentorId, profiles.userId))
    .where(and(eq(assignments.studentId, user.id), eq(assignments.status, "active")))
    .limit(1);

  // 2. Fetch past feedbacks
  const pastFeedbacks = await db
    .select({
      id: mentorFeedbacks.id,
      rating: mentorFeedbacks.rating,
      content: mentorFeedbacks.content,
      createdAt: mentorFeedbacks.createdAt,
      mentorName: profiles.fullName,
    })
    .from(mentorFeedbacks)
    .leftJoin(profiles, eq(mentorFeedbacks.mentorId, profiles.userId))
    .where(eq(mentorFeedbacks.studentId, user.id))
    .orderBy(desc(mentorFeedbacks.createdAt));

  return (
    <Shell
      role="student"
      active="feedback"
      pageCode="S.10 — FEEDBACK"
      pageTitle="Mentor Feedback"
      pageSubtitle="Share feedback about your mentorship experience to help us maintain high service quality."
      user={user}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
        {/* Form Card */}
        <Card>
          <CardHeader meta="SUBMIT FEEDBACK" title="Mentorship Review" />
          <CardBody>
            {activeAssignment ? (
              <StudentFeedbackForm
                mentorName={activeAssignment.mentorName || "your assigned mentor"}
                sessionId={sessionId}
                sessionTitle={sessionTitle}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-3xl">ℹ️</p>
                <h4 className="font-serif text-lg font-medium text-ink mt-2">No Active Mentor Assignment</h4>
                <p className="text-sm text-ink-soft mt-1 max-w-sm mx-auto">
                  You are not currently matched with an active mentor. Once matched, you can provide weekly ratings and feedback comments here.
                </p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Info Card */}
        <Card>
          <CardHeader meta="QUALITY GUIDELINE" title="Why share feedback?" />
          <CardBody className="space-y-3 text-sm text-ink-soft">
            <p>
              Your feedback is crucial. It is used directly by our matching and operations teams to monitor mentorship quality, reward outstanding mentors, and intervene when problems arise.
            </p>
            <p>
              🌟 <strong>What to look for:</strong> Did your mentor explain concepts clearly? Were they helpful, punctual, and encouraging during your sessions?
            </p>
            <p>
              🔒 <strong>Confidentiality:</strong> Individual ratings and comments are shared directly with site administrators to ensure safety and quality standards.
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Submission History */}
      <Card className="mt-6">
        <CardHeader meta="LOGS" title="Your Feedback History" />
        <CardBody>
          {pastFeedbacks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-rule/50 text-ink-soft uppercase text-xs tracking-wider">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Mentor</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4">Comments</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule/35">
                  {(pastFeedbacks as any[]).map((fb: any) => (
                    <tr key={fb.id} className="hover:bg-surface-elevated/40 transition-colors">
                      <td className="py-3 px-4 text-xs text-ink-soft font-mono">
                        {new Date(fb.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-3 px-4 font-medium text-ink">{fb.mentorName || "Unknown"}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-0.5 text-base text-[var(--color-primary)]">
                          {Array.from({ length: fb.rating }).map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                          {Array.from({ length: 5 - fb.rating }).map((_, i) => (
                            <span key={i} className="text-slate-200">★</span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-ink-soft max-w-xs truncate" title={fb.content}>
                        {fb.content}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-ink-soft text-center py-6">
              You haven&apos;t submitted any feedback logs yet.
            </p>
          )}
        </CardBody>
      </Card>
    </Shell>
  );
}
