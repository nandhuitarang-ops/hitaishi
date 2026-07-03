import { Suspense } from "react";
import { redirect } from "next/navigation";
import { and, desc, eq, or, sql, SQL } from "drizzle-orm";
import { Shell } from "@/components/Shell";
import {
  Card,
  CardBody,
  CardHeader,
  LinkButton,
  Pill,
  Field,
  Select,
  Textarea,
} from "@/components/ui";
import { db } from "@/lib/db";
import { doubtAnswers, doubts } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";
import { createDoubt } from "./actions";
import { DoubtTabs, type TabKey } from "./DoubtTabs";

export const dynamic = "force-dynamic";

function subjectLabel(s: string): string {
  if (s === "physics") return "Physics";
  if (s === "chemistry") return "Chemistry";
  if (s === "maths") return "Math";
  return s;
}

function statusTone(s: string): "warn" | "primary" | "neutral" {
  if (s === "open" || s === "waiting" || s === "pending" || s === "claimed")
    return "warn";
  if (s === "answered") return "primary";
  return "neutral";
}

function statusLabel(s: string): string {
  if (s === "open" || s === "waiting" || s === "pending") return "waiting";
  if (s === "claimed") return "claimed";
  if (s === "answered") return "answered";
  if (s === "abandoned") return "resolved";
  return s;
}

function elapsedFrom(d: Date, now: Date = new Date()): string {
  const diff = now.getTime() - d.getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h`;
  const days = Math.floor(h / 24);
  if (days === 1) return "yesterday";
  return `${days}d`;
}

function statusFilterCondition(tab: TabKey): SQL | undefined {
  if (tab === "waiting") {
    return or(
      eq(doubts.status, "open"),
      eq(doubts.status, "waiting"),
      eq(doubts.status, "pending"),
      eq(doubts.status, "claimed"),
    );
  }
  if (tab === "answered") return eq(doubts.status, "answered");
  if (tab === "resolved") return eq(doubts.status, "abandoned");
  return undefined; // "all" — no filter
}

export default async function StudentDoubtsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "student") redirect(`/${user.role}/dashboard`);

  const { tab: rawTab } = await searchParams;
  const tab = (rawTab as TabKey) || "all";

  const where = statusFilterCondition(tab);

  const doubtRows = await db
    .select({
      id: doubts.id,
      subject: doubts.subject,
      topic: doubts.topic,
      body: doubts.body,
      status: doubts.status,
      createdAt: doubts.createdAt,
      studentRating: doubtAnswers.studentRating,
    })
    .from(doubts)
    .leftJoin(doubtAnswers, eq(doubtAnswers.doubtId, doubts.id))
    .where(
      where
        ? and(eq(doubts.studentId, user.id), where)
        : eq(doubts.studentId, user.id),
    )
    .orderBy(desc(doubts.createdAt));

  // Count each category for tab badges
  const [allCount, waitingCount, answeredCount, resolvedCount] =
    await Promise.all([
      db
        .select({ c: sql<number>`count(*)::int` })
        .from(doubts)
        .where(eq(doubts.studentId, user.id)),
      db
        .select({ c: sql<number>`count(*)::int` })
        .from(doubts)
        .where(
          and(
            eq(doubts.studentId, user.id),
            or(
              eq(doubts.status, "open"),
              eq(doubts.status, "waiting"),
              eq(doubts.status, "pending"),
              eq(doubts.status, "claimed"),
            ),
          ),
        ),
      db
        .select({ c: sql<number>`count(*)::int` })
        .from(doubts)
        .where(
          and(
            eq(doubts.studentId, user.id),
            eq(doubts.status, "answered"),
          ),
        ),
      db
        .select({ c: sql<number>`count(*)::int` })
        .from(doubts)
        .where(
          and(
            eq(doubts.studentId, user.id),
            eq(doubts.status, "abandoned"),
          ),
        ),
    ]);

  const counts: Record<TabKey, number> = {
    all: Number(allCount[0]?.c ?? 0),
    waiting: Number(waitingCount[0]?.c ?? 0),
    answered: Number(answeredCount[0]?.c ?? 0),
    resolved: Number(resolvedCount[0]?.c ?? 0),
  };

  return (
    <Shell
      role="student"
      active="doubts"
      pageCode="S.06 — DOUBT QUEUE"
      pageTitle="Resolve your concepts"
      pageSubtitle="Ask anything in plain English. Average mentor response: 2 hours."
    >
      <Card className="mb-6">
        <CardHeader meta="ASK A NEW DOUBT" title="Have a doubt? Ask now." />
        <CardBody>
          <form action={createDoubt} className="grid md:grid-cols-[1fr_1fr] gap-4">
            <Field label="Subject" required>
              <Select name="subject" required>
                <option value="physics">Physics</option>
                <option value="chemistry">Chemistry</option>
                <option value="maths">Math</option>
                <option value="other">Other</option>
              </Select>
            </Field>
            <Field label="Topic">
              <Select name="topic">
                <option>General mechanics</option>
                <option>Thermodynamics</option>
                <option>Electrostatics</option>
                <option>Modern physics</option>
                <option>Optics</option>
              </Select>
            </Field>
            <div className="md:col-span-2">
              <Field label="Describe your doubt" required>
                <Textarea
                  name="body"
                  rows={4}
                  required
                  placeholder="Write your question as clearly as you can. You can attach a photo of your working below."
                />
              </Field>
            </div>
            <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button type="button" className="chip-ghost">
                  📷 Photo
                </button>
                <button type="button" className="chip-ghost">
                  🎙 Voice
                </button>
              </div>
              <div className="flex items-center gap-4">
                <span className="meta">Avg response: 2h</span>
                <button type="submit" className="chip-cta">
                  Submit doubt →
                </button>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>

      <Suspense fallback={<div className="flex gap-2 mb-5">{["All","Waiting","Answered","Resolved"].map(t => <div key={t} className="h-10 w-24 rounded-pill bg-surface-elevated" />)}</div>}>
        <DoubtTabs counts={counts} />
      </Suspense>

      {doubtRows.length === 0 ? (
        <Card>
          <CardBody>
            <p className="text-sm text-ink-soft text-center py-6">
              {tab === "all"
                ? "No doubts yet."
                : tab === "waiting"
                  ? "No doubts waiting."
                  : tab === "answered"
                    ? "No answered doubts yet."
                    : "No resolved doubts."}
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="grid gap-3">
          {doubtRows.map((d: any) => {
            const label = statusLabel(d.status);
            const title = d.topic?.trim() || d.body.slice(0, 140);
            return (
              <Card key={d.id}>
                <CardBody className="flex flex-wrap items-start gap-4">
                  <div className="flex-1 min-w-[260px]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Pill tone="primary">{subjectLabel(d.subject)}</Pill>
                      <Pill tone={statusTone(d.status)}>
                        {label} · {elapsedFrom(d.createdAt)}
                      </Pill>
                      {d.studentRating != null && (
                        <Pill tone="primary">
                          ★ {d.studentRating}/5
                        </Pill>
                      )}
                    </div>
                    <div className="font-serif text-base mt-3 leading-snug">
                      {title}
                    </div>
                  </div>
                  <LinkButton
                    href={`/student/doubts/${d.id}`}
                    variant="ghost"
                    size="sm"
                  >
                    {label === "waiting" ? "Edit doubt →" : "View thread →"}
                  </LinkButton>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </Shell>
  );
}
