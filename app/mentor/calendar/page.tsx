import { Shell } from "@/components/Shell";
import { Card, CardBody, CardHeader, Pill } from "@/components/ui";

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

// TODO(phase-2f): hydrate from mentorAvailability + sessions
type Slot = "off" | "available" | "booked" | "ooo" | "past";
const slotData: Record<string, Slot> = {
  "Mon-10:00": "available",
  "Mon-18:00": "booked",
  "Mon-20:00": "available",
  "Tue-10:00": "available",
  "Tue-16:00": "booked",
  "Tue-18:00": "available",
  "Wed-10:00": "ooo",
  "Wed-12:00": "ooo",
  "Wed-18:00": "available",
  "Thu-18:00": "booked",
  "Thu-20:00": "booked",
  "Fri-18:00": "available",
  "Fri-20:00": "available",
  "Sat-10:00": "booked",
  "Sat-12:00": "booked",
  "Sat-14:00": "available",
  "Sat-16:00": "available",
  "Sun-10:00": "available",
};

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

export default function MentorCalendarPage() {
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
            <div className="font-serif text-2xl text-primary-deep">18</div>
          </div>
          <div>
            <div className="meta">SLOTS BOOKED</div>
            <div className="font-serif text-2xl text-primary-deep">5</div>
          </div>
          <div>
            <div className="meta">FILL RATE</div>
            <div className="font-serif text-2xl text-primary-deep">27%</div>
          </div>
          <Pill tone="primary" className="ml-auto self-center">
            Friday — 4 slots booked
          </Pill>
        </CardBody>
      </Card>
    </Shell>
  );
}
