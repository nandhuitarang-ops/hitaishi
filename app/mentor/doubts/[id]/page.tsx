import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { Shell } from "@/components/Shell";
import { Card, CardBody, Field, Textarea } from "@/components/ui";
import { db } from "@/lib/db";
import { doubts, doubtAnswers, profiles, users } from "@/db/schema";
import { requireRole } from "@/lib/session";
import { claimDoubt, answerDoubt } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Doubts — Hitaishi Mentor",
  robots: "noindex, nofollow",
};

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

export default async function MentorDoubtDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireRole("mentor");
  const { id } = await params;

  const [doubt] = await db
    .select({
      id: doubts.id,
      subject: doubts.subject,
      topic: doubts.topic,
      body: doubts.body,
      status: doubts.status,
      claimedBy: doubts.claimedBy,
      claimedAt: doubts.claimedAt,
      createdAt: doubts.createdAt,
      studentName: profiles.fullName,
      studentEmail: users.email,
    })
    .from(doubts)
    .innerJoin(users, eq(users.id, doubts.studentId))
    .leftJoin(profiles, eq(profiles.userId, doubts.studentId))
    .where(eq(doubts.id, id))
    .limit(1);

  if (!doubt) notFound();

  const answer =
    doubt.status === "answered" || doubt.status === "claimed"
      ? (
          await db
            .select({
              body: doubtAnswers.body,
              answererName: profiles.fullName,
              createdAt: doubtAnswers.createdAt,
            })
            .from(doubtAnswers)
            .leftJoin(profiles, eq(profiles.userId, doubtAnswers.answererId))
            .where(eq(doubtAnswers.doubtId, id))
            .limit(1)
        )[0] ?? null
      : null;

  const isClaimed = doubt.status === "claimed" && doubt.claimedBy === user.id;
  const isOpen = doubt.status === "open";
  const isAnswered = doubt.status === "answered";

  return (
    <Shell
      role="mentor"
      active="doubts"
      pageCode="M.06a"
      pageTitle="Doubt detail"
      pageSubtitle={`From ${doubt.studentName ?? doubt.studentEmail}`}
      user={user}
    >
      <Card className="mb-6">
        <CardBody>
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span className="px-3 py-1 rounded-pill text-xs font-medium bg-primary/10 text-primary-deep">
              {subjectLabel(doubt.subject)}
            </span>
            {doubt.topic && (
              <span className="px-3 py-1 rounded-pill text-xs bg-surface-elevated text-ink-soft border border-rule">
                {doubt.topic}
              </span>
            )}
            <span className="ml-auto text-xs text-ink-faint">
              {elapsed(doubt.createdAt)}
            </span>
          </div>

          <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap">
            {doubt.body}
          </p>
        </CardBody>
      </Card>

      {isOpen && (
        <form action={claimDoubt.bind(null, id)}>
          <button
            type="submit"
            className="px-6 py-3 rounded-card bg-primary text-primary-on text-sm font-medium hover:bg-primary-deep transition-colors w-full"
          >
            Claim this doubt
          </button>
        </form>
      )}

      {isClaimed && !answer && (
        <Card>
          <CardBody>
            <p className="text-sm text-ink-soft mb-4">
              You claimed this doubt. Write your answer below.
            </p>
            <form
              action={async (formData: FormData) => {
                "use server";
                const body = (formData.get("body") as string) || "";
                await answerDoubt(id, body);
              }}
            >
              <Field label="Your answer" required>
                <Textarea
                  name="body"
                  rows={6}
                  required
                  placeholder="Explain the solution step by step..."
                />
              </Field>
              <button
                type="submit"
                className="mt-4 px-6 py-3 rounded-card bg-primary text-primary-on text-sm font-medium hover:bg-primary-deep transition-colors"
              >
                Submit answer
              </button>
            </form>
          </CardBody>
        </Card>
      )}

      {isAnswered && answer && (
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
          </CardBody>
        </Card>
      )}
    </Shell>
  );
}
