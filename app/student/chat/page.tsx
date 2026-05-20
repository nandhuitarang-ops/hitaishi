import { Shell } from "@/components/Shell";
import { Card, CardBody, LinkButton, Pill } from "@/components/ui";
import { initials } from "@/lib/format";

// TODO(phase-2f): replace with real conversation queries from db/schema/mentorship
const mockMentor = {
  fullName: "Priya Sharma",
  institute: "IIT Bombay '24",
  activeAgo: "12m",
};
const conversations = [
  {
    id: "1",
    name: "Priya Sharma",
    institute: "IIT Bombay '24",
    preview: "How is the thermodynamics prep going?",
    unread: 2,
    active: true,
  },
  {
    id: "2",
    name: "Rahul Verma",
    institute: "IIT Delhi '23",
    preview: "Physics doubt session scheduled for Saturday at 5pm.",
    unread: 0,
    active: false,
  },
];
const messages = [
  {
    id: "m1",
    from: "mentor" as const,
    body: "How did the rotational mechanics worksheet feel? Anything you got stuck on?",
    at: "Yesterday · 4:12 PM",
  },
  {
    id: "m2",
    from: "student" as const,
    body: "Q11 and Q14 broke me. I couldn't decouple the torque about the COM from the friction term.",
    at: "Yesterday · 9:31 PM",
  },
  {
    id: "m3",
    from: "mentor" as const,
    body: "That's a really common stuck-point. Quick read this before our call.",
    at: "Mon · 8:14 AM",
    attachment: { name: "Mechanics_Notes.pdf", size: "12 MB" },
  },
  {
    id: "m4",
    from: "mentor" as const,
    body: "Bring Q11 to our 5:30 PM call and we'll walk through it together.",
    at: "Mon · 8:15 AM",
  },
];

export default function StudentChatPage() {
  return (
    <Shell
      role="student"
      active="chat"
      pageCode="S.04 — MENTOR CHAT"
      pageTitle={mockMentor.fullName}
      pageSubtitle={`${mockMentor.institute} · Active ${mockMentor.activeAgo} ago`}
      actions={<LinkButton href="/student/sessions" variant="ghost" size="sm">Schedule call</LinkButton>}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_280px] gap-5 h-[70vh]">
        <Card className="overflow-y-auto">
          <div className="px-4 py-3 border-b border-rule">
            <div className="meta">ACTIVE CONVERSATIONS</div>
          </div>
          <ul>
            {conversations.map((c) => (
              <li
                key={c.id}
                className={`px-4 py-3 border-b border-rule cursor-pointer hover:bg-surface-elevated ${c.active ? "bg-primary-soft" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div className="avatar !w-9 !h-9 !text-sm">
                    {initials(c.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline gap-2">
                      <span className="text-sm font-medium truncate">{c.name}</span>
                      {c.unread > 0 && <Pill tone="coral">{c.unread}</Pill>}
                    </div>
                    <div className="text-xs text-ink-faint truncate">
                      {c.preview}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="flex flex-col">
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
            <div className="meta text-center">MON 14 FEB</div>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.from === "student" ? "flex-row-reverse" : ""}`}
              >
                <div className="avatar !w-8 !h-8 !text-xs flex-shrink-0">
                  {m.from === "mentor" ? "P" : "A"}
                </div>
                <div className={`max-w-[70%] ${m.from === "student" ? "items-end" : "items-start"} flex flex-col`}>
                  <div
                    className={`rounded-card px-4 py-3 text-sm ${m.from === "mentor" ? "bg-surface-elevated text-ink" : "bg-primary text-primary-on"}`}
                  >
                    {m.body}
                    {m.attachment && (
                      <div className="mt-3 flex items-center gap-2 text-xs font-mono px-3 py-2 bg-surface-card text-ink rounded-input border border-rule">
                        📎 {m.attachment.name} · {m.attachment.size}
                      </div>
                    )}
                  </div>
                  <span className="meta mt-1">{m.at}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-rule p-4 flex items-center gap-3">
            <button
              aria-label="Attach file"
              className="text-ink-soft hover:text-primary-deep text-xl"
            >
              📎
            </button>
            <input
              placeholder="Type a message to your mentor…"
              className="flex-1 rounded-input border border-rule-strong px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
            <button className="chip-cta">Send</button>
          </div>
          <div className="px-4 py-2 border-t border-rule meta text-center">
            Messages are encrypted and private
          </div>
        </Card>

        <div className="hidden lg:block">
          <Card>
            <div className="px-4 py-3 border-b border-rule">
              <div className="meta">UPCOMING SESSION</div>
            </div>
            <CardBody>
              <div className="font-serif text-lg">Thermodynamics</div>
              <div className="text-sm text-ink-soft mt-1">
                Oct 14 · 5:30 PM (45 min)
              </div>
              <LinkButton href="/student/sessions" size="md" className="mt-4 w-full">
                Join session
              </LinkButton>
            </CardBody>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
