import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
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

const tabs = ["All", "Waiting", "Answered", "Resolved"] as const;

type StatusKey = "waiting" | "answered" | "resolved";

function subjectLabel(s: string): string {
  if (s === "physics") return "Physics";
  if (s === "chemistry") return "Chemistry";
  if (s === "maths") return "Math";
  return s;
}

function statusKeyFromDb(status: string): StatusKey {
  if (status === "answered") return "answered";
  if (status === "abandoned") return "resolved";
  return "waiting";
}

function statusToneFor(key: StatusKey): "warn" | "primary" | "neutral" {
  if (key === "waiting") return "warn";
  if (key === "answered") return "primary";
  return "neutral";
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

export default async function StudentDoubtsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "student") redirect(`/${user.role}/dashboard`);

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

      <div className="flex flex-wrap gap-2 mb-5">
        {tabs.map((t, i) => (
          <button
            key={t}
            className={`px-4 py-2 rounded-pill text-sm font-medium ${
              i === 0
                ? "bg-primary text-primary-on"
                : "bg-surface-card border border-rule text-ink-soft hover:bg-surface-elevated"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {doubtRows.length === 0 ? (
        <Card>
          <CardBody>
            <p className="text-sm text-ink-soft text-center py-6">
              No doubts yet.
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="grid gap-3">
          {doubtRows.map((d: any) => {
            const statusKey = statusKeyFromDb(d.status);
            const title = d.topic?.trim() || d.body.slice(0, 140);
            return (
              <Card key={d.id}>
                <CardBody className="flex flex-wrap items-start gap-4">
                  <div className="flex-1 min-w-[260px]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Pill tone="primary">{subjectLabel(d.subject)}</Pill>
                      <Pill tone={statusToneFor(statusKey)}>
                        {statusKey} · {elapsedFrom(d.createdAt)}
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
                    {statusKey === "waiting" ? "Edit doubt →" : "View thread →"}
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
