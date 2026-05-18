import { Shell } from "@/components/Shell";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = ["10am", "12pm", "2pm", "4pm", "6pm", "8pm", "10pm"];

const mockSlots: Record<string, string[]> = {
  Mon: ["10am", "8pm", "10pm"],
  Tue: ["12pm", "8pm"],
  Wed: ["10am", "10pm"],
  Thu: ["8pm", "10pm"],
  Fri: ["6pm", "8pm", "10pm"],
  Sat: ["10am", "12pm", "2pm", "4pm", "6pm"],
  Sun: ["10am", "12pm"],
};

const mockBookings = new Set(["Mon-10pm", "Tue-8pm", "Sat-10am", "Sat-12pm"]);

export default function MentorCalendar() {
  return (
    <Shell role="mentor" active="calendar" pageCode="M.04 — Calendar" pageTitle="When you're available.">
      <div className="flex gap-2 -mt-1">
        <button className="chip-cta">Availability</button>
        <button className="chip-ghost">Bookings</button>
      </div>
      <p className="text-sm text-[var(--ink-soft)]">
        Tap a cell to toggle. Filled = available · highlighted = booked.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left py-2 meta"></th>
              {days.map((d) => (
                <th key={d} className="meta py-2">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map((h) => (
              <tr key={h} className="border-t border-[var(--rule)]">
                <td className="meta py-3 pr-3">{h}</td>
                {days.map((d) => {
                  const isAvail = mockSlots[d]?.includes(h);
                  const isBooked = mockBookings.has(`${d}-${h}`);
                  return (
                    <td key={d} className="p-1">
                      <div
                        className={`h-10 border ${
                          isBooked
                            ? "bg-[var(--signal-soft)] border-[var(--signal)]"
                            : isAvail
                              ? "bg-[var(--ink)] border-[var(--ink)]"
                              : "border-[var(--rule)]"
                        }`}
                        aria-label={`${d} ${h}: ${isBooked ? "booked" : isAvail ? "available" : "off"}`}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="meta">Phase 5: admin sets your slots. Mentor-driven mode unlocks in v2.</p>
    </Shell>
  );
}
