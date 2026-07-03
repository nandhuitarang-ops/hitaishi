import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { Shell } from "@/components/Shell";
import { Card, CardBody, Pill } from "@/components/ui";
import { db } from "@/lib/db";
import { doubts, doubtAnswers, profiles, users } from "@/db/schema";
import { requireRole } from "@/lib/session";

export const dynamic = "force-dynamic";

function subjectLabel(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function elapsed(d: Date, now: Date = new Date()): string {
  const ms = now.getTime() - d.getTime();
  const min = Math.floor(ms / 60000);
  if (min < 60) return `${min}m ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  return `${days}d ago`;
}

function statusLabel(s: string): string {
  if (s === "open") return "Waiting for mentor";
  if (s === "claimed") return "Mentor is working on it";
  if (s === "answered") return "Answered";
  if (s === "abandoned") return "Closed";
  return s;
}

function statusTone(s: string): "warn" | "primary" | "neutral" {
  if (s === "open" || s === "waiting" || s === "pending") return "warn";
  if (s === "answered") return "primary";
  return "neutral";
}

export default async function StudentDoubtDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireRole("student");
  const { id } = await params;

  const [doubt] = await db
    .select({
      id: doubts.id,
      subject: doubts.subject,
      topic: doubts.topic,
      body: doubts.body,
      status: doubts.status,
      claimedBy: doubts.claimedBy,
      createdAt: doubts.createdAt,
      mentorName: profiles.fullName,
      mentorEmail: users.email,
    })
    .from(doubts)
    .leftJoin(users, eq(users.id, doubts.claimedBy))
    .leftJoin(profiles, eq(profiles.userId, doubts.claimedBy))
    .where(eq(doubts.id, id))
    .limit(1);

  if (!doubt) notFound();

  const answer =
    doubt.status === "answered"
      ? (
          await db
            .select({
              body: doubtAnswers.body,
              answererName: profiles.fullName,
              createdAt: doubtAnswers.createdAt,
              studentRating: doubtAnswers.studentRating,
              studentFeedback: doubtAnswers.studentFeedback,
            })
            .from(doubtAnswers)
            .leftJoin(profiles, eq(profiles.userId, doubtAnswers.answererId))
            .where(eq(doubtAnswers.doubtId, id))
            .limit(1)
        )[0] ?? null
      : null;

  return (
    <Shell
      role="student"
      active="doubts"
      pageCode="S.05a"
      pageTitle="Doubt detail"
    >
      <Card className="mb-6">
        <CardBody>
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <Pill tone="primary">{subjectLabel(doubt.subject)}</Pill>
            {doubt.topic && (
              <Pill tone="neutral">{doubt.topic}</Pill>
            )}
            <Pill tone={statusTone(doubt.status)}>
              {statusLabel(doubt.status)}
            </Pill>
            <span className="ml-auto text-xs text-ink-faint">
              {elapsed(doubt.createdAt)}
            </span>
          </div>

          <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap">
            {doubt.body}
          </p>
        </CardBody>
      </Card>

      {(doubt.status === "claimed" || doubt.status === "answered") && doubt.mentorName && (
        <div className="text-xs text-ink-soft mb-4">
          Claimed by <span className="font-medium text-ink">{doubt.mentorName}</span>
        </div>
      )}

      {doubt.status === "answered" && answer && (
        <Card>
          <CardBody>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium text-ink">
                Answer by {answer.answererName ?? "Mentor"}
              </span>
              <span className="text-xs text-ink-faint">
                · {elapsed(answer.createdAt)}
              </span>
            </div>
            <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap">
              {answer.body}
            </p>
            {answer.studentRating != null && (
              <div className="mt-4 pt-3 border-t border-rule">
                <Pill tone="primary">Your rating: ★ {answer.studentRating}/5</Pill>
                {answer.studentFeedback && (
                  <p className="text-xs text-ink-soft mt-2">{answer.studentFeedback}</p>
                )}
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {doubt.status === "open" && (
        <Card>
          <CardBody>
            <p className="text-sm text-ink-soft text-center py-4">
              Your doubt is waiting for a mentor to claim it. Average response time: 2 hours.
            </p>
          </CardBody>
        </Card>
      )}

      {doubt.status === "claimed" && !answer && (
        <Card>
          <CardBody>
            <p className="text-sm text-ink-soft text-center py-4">
              Your mentor is preparing an answer. This usually takes 15-30 minutes.
            </p>
          </CardBody>
        </Card>
      )}
    </Shell>
  );
}
