import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { and, desc, eq, sql } from "drizzle-orm";
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

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Doubts — Hitaishi Student",
  robots: "noindex, nofollow",
};

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

function isWaiting(s: string): boolean {
  return s === "open" || s === "waiting" || s === "pending" || s === "claimed";
}

function elapsedFrom(d: Date | string | null | undefined, now: Date = new Date()): string {
  if (!d) return "recently";
  const dateObj = typeof d === "string" ? new Date(d) : d;
  if (!dateObj || isNaN(dateObj.getTime())) return "recently";
  const diff = now.getTime() - dateObj.getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h`;
  const days = Math.floor(h / 24);
  if (days === 1) return "yesterday";
  return `${days}d`;
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
  const activeTab = rawTab === "waiting" || rawTab === "answered" || rawTab === "resolved" ? rawTab : "all";

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
    .where(eq(doubts.studentId, user.id))
    .orderBy(desc(doubts.createdAt));

  // Compute counts in JS instead of extra DB queries
  let waitingCount = 0;
  let answeredCount = 0;
  let resolvedCount = 0;
  for (const d of doubtRows) {
    if (isWaiting(d.status)) waitingCount++;
    else if (d.status === "answered") answeredCount++;
    else if (d.status === "abandoned") resolvedCount++;
  }
  const allCount = doubtRows.length;

  const counts = { all: allCount, waiting: waitingCount, answered: answeredCount, resolved: resolvedCount };

  // Filter client-side based on tab
  const filteredRows =
    activeTab === "all"
      ? doubtRows
      : activeTab === "waiting"
        ? doubtRows.filter((d: typeof doubtRows[number]) => isWaiting(d.status))
        : activeTab === "answered"
          ? doubtRows.filter((d: typeof doubtRows[number]) => d.status === "answered")
          : doubtRows.filter((d: typeof doubtRows[number]) => d.status === "abandoned");

  const TABS = [
    { key: "all" as const, label: "All" },
    { key: "waiting" as const, label: "Waiting" },
    { key: "answered" as const, label: "Answered" },
    { key: "resolved" as const, label: "Resolved" },
  ];

  return (
    <Shell
      role="student"
      active="doubts"
      pageCode="S.06 — DOUBT QUEUE"
      pageTitle="Resolve your concepts"
      pageSubtitle="Ask anything in plain English. Average mentor response: 2 hours."
      user={user}
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

      <div className="flex flex-wrap gap-2 mb-5">
        {TABS.map((t) => (
          <a
            key={t.key}
            href={t.key === "all" ? "/student/doubts" : `/student/doubts?tab=${t.key}`}
            className={`px-4 py-2 rounded-pill text-sm font-medium transition-colors ${
              activeTab === t.key
                ? "bg-primary text-primary-on"
                : "bg-surface-card border border-rule text-ink-soft hover:bg-surface-elevated"
            }`}
          >
            {t.label}
            <span className="ml-1.5 font-mono text-xs opacity-70">{counts[t.key]}</span>
          </a>
        ))}
      </div>

      {filteredRows.length === 0 ? (
        <Card>
          <CardBody>
            <p className="text-sm text-ink-soft text-center py-6">
              {activeTab === "all"
                ? "No doubts yet."
                : activeTab === "waiting"
                  ? "No doubts waiting."
                  : activeTab === "answered"
                    ? "No answered doubts yet."
                    : "No resolved doubts."}
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filteredRows.map((d: any) => {
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
