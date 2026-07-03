import { Shell } from "@/components/Shell";
import { Card, CardBody, CardHeader, Pill } from "@/components/ui";
import { db } from "@/lib/db";
import { mentorAvailability, sessions } from "@/db/schema";
import { and, asc, eq, gte, lt } from "drizzle-orm";
import { requireRole } from "@/lib/session";

export const dynamic = "force-dynamic";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = [
  "06:00",
  "08:00",
  "10:00",
  "12:00",
  "14:00",
  "16:00",
  "18:00",
  "20:00",
  "22:00",
];

const DAY_INDEX_MAP: Record<number, string> = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
};

type Slot = "off" | "available" | "booked" | "ooo" | "past";

function startOfWeek(d: Date): Date {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfWeek(d: Date): Date {
  const x = startOfWeek(d);
  x.setDate(x.getDate() + 7);
  return x;
}

function hourLabelToInt(label: string): number {
  return Number(label.slice(0, 2));
}

const legend: { slot: Slot; label: string; cls: string }[] = [
  { slot: "available", label: "Available", cls: "bg-primary text-primary-on" },
  { slot: "booked", label: "Booked", cls: "bg-secondary text-white" },
  { slot: "ooo", label: "Out of office", cls: "bg-surface-elevated text-ink-faint" },
  { slot: "off", label: "Unavailable", cls: "bg-surface-card border border-rule text-ink-faint" },
  { slot: "past", label: "Past", cls: "bg-surface-card border border-rule opacity-40" },
];

function slotClass(s: Slot): string {
  switch (s) {
    case "available":
      return "bg-primary text-primary-on";
    case "booked":
      return "bg-secondary text-white";
    case "ooo":
      return "bg-surface-elevated text-ink-faint";
    case "past":
      return "bg-surface-card border border-rule opacity-40";
    default:
      return "bg-surface-card border border-rule hover:bg-primary-soft";
  }
}

function timeStringToMinutes(t: string): number {
  const [h, m] = t.split(":").map((x) => Number(x));
  return h * 60 + m;
}

export default async function MentorCalendarPage() {
  const user = await requireRole("mentor");
  const now = new Date();
  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);

  const [availabilityRows, weekSessions] = await Promise.all([
    db
      .select({
        dayOfWeek: mentorAvailability.dayOfWeek,
        startTime: mentorAvailability.startTime,
        endTime: mentorAvailability.endTime,
      })
      .from(mentorAvailability)
      .where(eq(mentorAvailability.mentorId, user.id)),
    db
      .select({
        id: sessions.id,
        scheduledAt: sessions.scheduledAt,
        durationMinutes: sessions.durationMinutes,
        status: sessions.status,
      })
      .from(sessions)
      .where(
        and(
          eq(sessions.hostId, user.id),
          gte(sessions.scheduledAt, weekStart),
          lt(sessions.scheduledAt, weekEnd),
        ),
      ),
  ]);

  const cellHasBooked = new Set<string>();
  const bookedByDayHour: Record<string, number> = {};
  for (const s of weekSessions) {
    const d = s.scheduledAt;
    if (d.getTime() < now.getTime()) continue;
    const dayIdx = (d.getDay() + 6) % 7;
    const hr = d.getHours();
    const dayLabel = days[dayIdx];
    const hourLabel = `${String(hr).padStart(2, "0")}:00`;
    cellHasBooked.add(`${dayLabel}-${hourLabel}`);
    const key = `${dayLabel}-${hourLabel}`;
    bookedByDayHour[key] = (bookedByDayHour[key] ?? 0) + 1;
  }

  const slotData: Record<string, Slot> = {};
  let availableCount = 0;
  let bookedCount = cellHasBooked.size;

  for (const a of availabilityRows) {
    const dayLabel = DAY_INDEX_MAP[a.dayOfWeek];
    if (!dayLabel) continue;
    const startMin = timeStringToMinutes(String(a.startTime));
    const endMin = timeStringToMinutes(String(a.endTime));
    for (const h of hours) {
      const hr = hourLabelToInt(h);
      const cellStart = hr * 60;
      const cellEnd = cellStart + 60;
      if (cellStart >= startMin && cellEnd <= endMin) {
        const key = `${dayLabel}-${h}`;
        if (!slotData[key] || slotData[key] === "off") {
          if (cellHasBooked.has(key)) {
            slotData[key] = "booked";
          } else {
            slotData[key] = "available";
            availableCount++;
          }
        }
      }
    }
  }

  for (const key of cellHasBooked) {
    if (!slotData[key]) {
      slotData[key] = "booked";
    }
  }

  const totalSlots = availableCount + bookedCount;
  const fillRate = totalSlots > 0 ? Math.round((bookedCount / totalSlots) * 100) : 0;

  let topDay: string | null = null;
  let topDayCount = 0;
  const byDayCount: Record<string, number> = {};
  for (const [key, count] of Object.entries(bookedByDayHour)) {
    const day = key.split("-")[0];
    byDayCount[day] = (byDayCount[day] ?? 0) + count;
    if (byDayCount[day] > topDayCount) {
      topDay = day;
      topDayCount = byDayCount[day];
    }
  }

  return (
    <Shell
      role="mentor"
      active="calendar"
      pageCode="M.07 — CALENDAR"
      pageTitle="Availability"
      pageSubtitle="Tap a cell to toggle. Booked slots can't be edited from here — cancel via the session."
      actions={
        <div className="flex items-center gap-2">
          <button className="chip-cta text-xs">Availability</button>
          <button className="chip-ghost text-xs">Bookings</button>
        </div>
      }
    >
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {legend.map((l) => (
          <div key={l.slot} className="flex items-center gap-2">
            <span className={`inline-block w-4 h-4 rounded-input ${l.cls}`} />
            <span className="meta">{l.label}</span>
          </div>
        ))}
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-surface-elevated">
              <th className="px-3 py-2 text-left meta">Hour</th>
              {days.map((d) => (
                <th key={d} className="px-3 py-2 meta">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map((h) => (
              <tr key={h} className="border-t border-rule">
                <td className="px-3 py-1 meta">{h}</td>
                {days.map((d) => {
                  const key = `${d}-${h}`;
                  const slot = slotData[key] ?? "off";
                  return (
                    <td key={d} className="p-1">
                      <button
                        className={`w-full h-10 rounded-input text-[10px] font-mono uppercase ${slotClass(slot)}`}
                        aria-label={`${d} ${h}: ${slot}`}
                      >
                        {slot === "booked" ? "Booked" : ""}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card className="mt-5">
        <CardHeader meta="THIS WEEK" title="At a glance" />
        <CardBody className="flex flex-wrap gap-4">
          <div>
            <div className="meta">SLOTS OFFERED</div>
            <div className="font-serif text-2xl text-primary-deep">{availableCount}</div>
          </div>
          <div>
            <div className="meta">SLOTS BOOKED</div>
            <div className="font-serif text-2xl text-primary-deep">{bookedCount}</div>
          </div>
          <div>
            <div className="meta">FILL RATE</div>
            <div className="font-serif text-2xl text-primary-deep">{fillRate}%</div>
          </div>
          {topDay && topDayCount > 0 ? (
            <Pill tone="primary" className="ml-auto self-center">
              {topDay} — {topDayCount} slot{topDayCount === 1 ? "" : "s"} booked
            </Pill>
          ) : (
            <Pill tone="neutral" className="ml-auto self-center">
              No bookings this week
            </Pill>
          )}
        </CardBody>
      </Card>
    </Shell>
  );
}
