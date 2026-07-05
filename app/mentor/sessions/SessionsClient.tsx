"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, LinkButton, Pill, Button } from "@/components/ui";
import { CompleteSessionButton } from "@/components/CompleteSessionButton";

type Attendee = { id: string; name: string };
type StudentOption = { id: string; name: string; email: string };
type SessionRow = {
  id: string;
  title: string;
  type: "one_on_one" | "group";
  status: "scheduled" | "live" | "completed" | "cancelled";
  scheduledAt: string;
  durationMinutes: number;
  meetLink: string | null;
  attendees: Attendee[];
  startedAgoMin: number | null;
  elapsedHms: string | null;
};

function fmtDate(d: string) {
  const dt = new Date(d);
  const today = new Date();
  const isToday = dt.toDateString() === today.toDateString();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const isTomorrow = dt.toDateString() === tomorrow.toDateString();
  const time = dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (isToday) return `Today · ${time}`;
  if (isTomorrow) return `Tomorrow · ${time}`;
  return `${dt.toLocaleDateString([], { day: "2-digit", month: "short" })} · ${time}`;
}

function fmtDateShort(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function attendeesLabel(a: Attendee[], type: string) {
  if (type === "group") return a.length > 0 ? `${a.length} attending` : "0 attending";
  return a[0]?.name ?? "TBD";
}

export function SessionsClient({
  live,
  upcoming,
  past,
  students,
}: {
  live: SessionRow[];
  upcoming: SessionRow[];
  past: SessionRow[];
  students: StudentOption[];
}) {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <>
      <div className="flex justify-end mb-5">
        <Button size="sm" onClick={() => setShowCreate(true)}>
          + Create session
        </Button>
      </div>

      {showCreate && (
        <CreateSessionModal
          onClose={() => setShowCreate(false)}
          students={students}
        />
      )}

      {live.length > 0 && (
        <section className="mb-8">
          <div className="meta mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            LIVE NOW
          </div>
          <div className="grid gap-3">
            {live.map((s) => (
              <Card key={s.id}>
                <CardBody className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex-1 min-w-[200px]">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Pill tone="coral">LIVE</Pill>
                        <Pill tone="primary">{s.type === "group" ? "Group" : "1-on-1"}</Pill>
                        {s.elapsedHms && (
                          <span className="font-mono text-xs text-ink-faint">{s.elapsedHms}</span>
                        )}
                      </div>
                      <div className="font-serif text-lg mt-1">{s.title}</div>
                      <div className="text-sm text-ink-soft mt-1">
                        {attendeesLabel(s.attendees, s.type)} · {s.startedAgoMin ?? 0}m in
                      </div>
                    </div>
                    <LinkButton href={`/session/${s.id}`} size="sm" target="_blank">
                      Join session →
                    </LinkButton>
                  </div>
                  <div className="border-t border-rule/35 pt-2 flex items-center justify-between text-xs text-ink-soft">
                    <span>Finished the mentoring session? Mark it as completed:</span>
                    <CompleteSessionButton sessionId={s.id} sessionTitle={s.title} role="mentor" />
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section className="mb-8">
        <div className="meta mb-3">UPCOMING</div>
        {upcoming.length === 0 ? (
          <Card>
            <CardBody>
              <div className="text-sm text-ink-soft text-center py-6">
                No upcoming sessions. Click <strong>+ Create session</strong> to schedule one.
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="grid gap-3">
            {upcoming.map((s) => (
              <Card key={s.id}>
                <CardBody className="flex flex-wrap items-center gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Pill tone="neutral">{s.type === "group" ? "Group" : "1-on-1"}</Pill>
                      <span className="text-xs text-ink-faint">{s.durationMinutes} min</span>
                    </div>
                    <div className="font-serif text-lg mt-1">{s.title}</div>
                    <div className="text-sm text-ink-soft mt-1">
                      {attendeesLabel(s.attendees, s.type)} · {fmtDate(s.scheduledAt)}
                    </div>
                  </div>
                  {s.meetLink ? (
                    <LinkButton href={`/session/${s.id}`} size="sm" variant="ghost" target="_blank">
                      Join →
                    </LinkButton>
                  ) : (
                    <Pill tone="warn">No link yet</Pill>
                  )}
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="meta mb-3">PAST SESSIONS</div>
        {past.length === 0 ? (
          <Card>
            <CardBody>
              <div className="text-sm text-ink-soft text-center py-6">
                No past sessions yet.
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="grid gap-3">
            {past.map((s) => (
              <Card key={s.id}>
                <CardBody className="flex flex-wrap items-center gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Pill tone="neutral">{s.type === "group" ? "Group" : "1-on-1"}</Pill>
                      <span className="text-xs text-ink-faint">{s.durationMinutes} min</span>
                      <Pill tone={s.status === "cancelled" ? "error" : "neutral"}>{s.status}</Pill>
                    </div>
                    <div className="font-serif text-lg mt-1">{s.title}</div>
                    <div className="text-sm text-ink-soft mt-1">
                      {attendeesLabel(s.attendees, s.type)} · {fmtDateShort(s.scheduledAt)}
                    </div>
                  </div>
                  <LinkButton href={`/session/${s.id}`} variant="ghost" size="sm">
                    Details
                  </LinkButton>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function CreateSessionModal({
  onClose,
  students,
}: {
  onClose: () => void;
  students: StudentOption[];
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ id: string; meetLink: string } | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [sessionType, setSessionType] = useState<"1-on-1" | "Group">("1-on-1");
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  function now() {
    const d = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    return {
      date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
      time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
    };
  }

  const { date: today, time: nowTime } = now();
  const minTime = selectedDate === today ? nowTime : undefined;

  function handleBlur(name: string, value: string) {
    setTouched((prev) => ({ ...prev, [name]: true }));
    let err = "";
    if (name === "title" && !value.trim()) err = "Session title is required";
    if (name === "date") {
      if (!value) err = "Date is required";
      else if (value < today) err = "Date cannot be in the past";
    }
    if (name === "time") {
      if (!value) err = "Time is required";
      else if (selectedDate === today && value < nowTime) err = "Time cannot be in the past";
    }
    setFieldErrors((prev) => ({ ...prev, [name]: err }));
  }

  function toggleStudent(id: string) {
    setSelectedStudentIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (sessionType === "1-on-1") return [id];
      return [...prev, id];
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    const data = new FormData(e.currentTarget);
    const title = (data.get("title") as string) ?? "";
    const sessionTypeValue = (data.get("type") as string) ?? "";
    const date = (data.get("date") as string) ?? "";
    const time = (data.get("time") as string) ?? "";

    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "Session title is required";
    if (!date) errs.date = "Date is required";
    else if (date < today) errs.date = "Date cannot be in the past";
    if (!time) errs.time = "Time is required";
    else if (date === today && time < nowTime) errs.time = "Time cannot be in the past";
    if (selectedStudentIds.length === 0) errs.students = "Select at least one student";
    if (sessionTypeValue === "1-on-1" && selectedStudentIds.length > 1) {
      errs.students = "1-on-1 sessions can only include one student";
    }

    setFieldErrors(errs);
    setTouched({ title: true, date: true, time: true, students: true });
    if (errs.title || errs.date || errs.time || errs.students) return;

    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/mentor/sessions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          type: sessionTypeValue === "Group" ? "group" : "one_on_one",
          scheduledAt: new Date(`${date}T${time}:00+05:30`).toISOString(),
          durationMinutes: 60,
          studentIds: selectedStudentIds,
        }),
      });
      const resData = await res.json();
      if (!resData.success) {
        setError(resData.error ?? "Failed to create session");
      } else {
        setResult(resData.data);
        router.refresh();
      }
    } catch {
      setError("Network error — try again");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-surface-card border border-rule rounded-card w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-5 border-b border-rule flex items-center justify-between">
          <div>
            <div className="meta">NEW SESSION</div>
            <h2 className="font-serif text-xl mt-1">Create a mentoring session</h2>
          </div>
          <button onClick={onClose} className="text-ink-faint hover:text-ink text-xl">&times;</button>
        </div>

        {result ? (
          <div className="px-6 py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 text-primary text-2xl">&#10003;</div>
            <div className="font-serif text-lg mb-2">Session created!</div>
            <p className="text-sm text-ink-soft mb-4">
              Your mentoring session has been scheduled successfully.
            </p>
            
            <div className="bg-amber-50 border border-amber-200 rounded-card p-4 mb-4 text-left text-xs text-amber-800 space-y-2">
              <p className="font-bold">⚠️ IMPORTANT SECURITY REQUIREMENT:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Do <strong>NOT</strong> share the direct Jitsi link with your student.</li>
                <li>Your student will automatically receive a secure Hitaishi portal access link.</li>
                <li><strong>Join the Hitaishi Session Room first</strong> (before the student) to claim moderator privileges and secure the room.</li>
              </ul>
            </div>

            <div className="text-xs text-ink-soft text-left mb-1 font-mono uppercase tracking-wider font-semibold">
              Hitaishi Session Portal Link:
            </div>
            <div className="bg-secondary-soft rounded-card px-4 py-3 mb-5 break-all text-sm font-mono text-left select-all">
              {typeof window !== "undefined" ? window.location.origin : ""}/session/{result.id}
            </div>

            <div className="flex items-center gap-3 justify-center">
              <a href={`/session/${result.id}`} target="_blank" rel="noopener noreferrer">
                <Button size="sm">Open Session Room</Button>
              </a>
              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  onClose();
                }}
                className="px-4 py-2 text-sm text-ink-soft hover:text-ink"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4 bg-secondary-soft border-b border-secondary/20">
              <p className="text-xs text-[#74240a]">
                By creating this session, you agree that admins may observe for quality
                assurance. Do not share personal contact information with students.
                All communication must stay within the Hitaishi platform.
              </p>
            </div>

            <div className="px-6 py-5 flex flex-col gap-4">
              <div>
                <label className="meta block mb-1">Session title *</label>
                <input
                  id="session-title"
                  name="title"
                  className={`w-full rounded-input border px-3 py-2 text-sm focus:outline-none ${touched.title && fieldErrors.title ? "border-red-500" : "border-rule-strong focus:border-primary"}`}
                  placeholder="e.g. Thermodynamics — Advanced Practice"
                  onBlur={(e) => handleBlur("title", e.target.value)}
                />
                {touched.title && fieldErrors.title && (
                  <p className="text-xs text-red-500 mt-1">{fieldErrors.title}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="meta block mb-1">Subject</label>
                  <select name="subject" className="w-full rounded-input border border-rule-strong px-3 py-2 text-sm focus:outline-none focus:border-primary bg-surface-card">
                    <option>Physics</option>
                    <option>Chemistry</option>
                    <option>Mathematics</option>
                    <option>General</option>
                  </select>
                </div>
                <div>
                  <label className="meta block mb-1">Type</label>
                  <select
                    name="type"
                    value={sessionType}
                    onChange={(e) => {
                      const v = e.target.value as "1-on-1" | "Group";
                      setSessionType(v);
                      if (v === "1-on-1" && selectedStudentIds.length > 1) {
                        setSelectedStudentIds(selectedStudentIds.slice(0, 1));
                      }
                    }}
                    className="w-full rounded-input border border-rule-strong px-3 py-2 text-sm focus:outline-none focus:border-primary bg-surface-card"
                  >
                    <option value="1-on-1">1-on-1</option>
                    <option value="Group">Group</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="meta block mb-1">Date *</label>
                  <input
                    id="session-date"
                    name="date"
                    type="date"
                    min={today}
                    className={`w-full rounded-input border px-3 py-2 text-sm focus:outline-none ${touched.date && fieldErrors.date ? "border-red-500" : "border-rule-strong focus:border-primary"}`}
                    onBlur={(e) => handleBlur("date", e.target.value)}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                  {touched.date && fieldErrors.date && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.date}</p>
                  )}
                </div>
                <div>
                  <label className="meta block mb-1">Time *</label>
                  <input
                    id="session-time"
                    name="time"
                    type="time"
                    min={minTime}
                    className={`w-full rounded-input border px-3 py-2 text-sm focus:outline-none ${touched.time && fieldErrors.time ? "border-red-500" : "border-rule-strong focus:border-primary"}`}
                    onBlur={(e) => handleBlur("time", e.target.value)}
                  />
                  {touched.time && fieldErrors.time && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.time}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="meta block mb-1">
                  {sessionType === "1-on-1" ? "Student *" : "Students *"}
                </label>
                {students.length === 0 ? (
                  <p className="text-xs text-ink-soft border border-dashed border-rule rounded-input px-3 py-2">
                    You have no active student assignments. Ask an admin to assign students before scheduling a session.
                  </p>
                ) : (
                  <div className="border border-rule rounded-input max-h-40 overflow-y-auto divide-y divide-rule">
                    {students.map((s) => {
                      const checked = selectedStudentIds.includes(s.id);
                      return (
                        <label
                          key={s.id}
                          className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-surface-elevated text-sm"
                        >
                          <input
                            type={sessionType === "1-on-1" ? "radio" : "checkbox"}
                            name="studentIds"
                            value={s.id}
                            checked={checked}
                            onChange={() => toggleStudent(s.id)}
                            className="accent-primary"
                          />
                          <span className="flex-1 min-w-0 truncate">{s.name}</span>
                          <span className="text-xs text-ink-faint truncate">{s.email}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
                {touched.students && fieldErrors.students && (
                  <p className="text-xs text-red-500 mt-1">{fieldErrors.students}</p>
                )}
              </div>

              {error && (
                <div className="text-xs text-red-600 bg-red-50 rounded-input px-3 py-2">{error}</div>
              )}

              <div className="border-t border-rule pt-4 mt-2">
                <p className="text-xs text-ink-faint mb-3">
                  A Jitsi Meet link will be auto-generated when you create this session. The Meet room
                  will be empty — you are the host and must admit participants.
                </p>
                <div className="flex items-center gap-3">
                  <Button type="submit" size="md" className="flex-1" disabled={submitting}>
                    {submitting ? "Creating…" : "Generate Meet Link & Create"}
                  </Button>
                  <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-ink-soft hover:text-ink">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
