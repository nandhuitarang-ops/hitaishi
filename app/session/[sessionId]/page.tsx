import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { Pill } from "@/components/ui";

// TODO(phase-2f): integrate @100mslive/react-sdk client room; this page server-issues the token via lib/hms.ts
// then a client component initializes the SDK with the token.

interface PageProps {
  params: { sessionId: string };
}

export default async function SessionRoomPage({ params }: PageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "student" && user.role !== "mentor") {
    redirect(`/${user.role}/dashboard`);
  }

  // Mock — until 100ms wiring lands
  const session = {
    title: "Advanced Calculus: Integration by Parts & Series",
    mentor: { name: "Priya Sharma", initials: "P" },
    elapsedHms: "00:42:15",
  };

  const participants = [
    { id: "p1", name: "Priya Sharma", role: "mentor", muted: false, raised: false, primary: true },
    { id: "p2", name: "Arush V.", role: "student", muted: false, raised: true },
    { id: "p3", name: "Meera K.", role: "student", muted: false, raised: false },
    { id: "p4", name: "Rohan S.", role: "student", muted: true, raised: false },
    { id: "p5", name: "Sarah L.", role: "student", muted: true, raised: false, voiceOnly: true },
  ];

  const chat = [
    { id: "c1", who: "Priya", at: "00:38:12", body: "Has everyone reviewed the notes on Gaussian integration?" },
    { id: "c2", who: "Arush", at: "00:38:55", body: "Got through the first half. Q14 still stuck." },
    { id: "c3", who: "Meera", at: "00:41:01", body: "Ditto on Q14." },
  ];

  return (
    <main className="min-h-screen bg-[#0c1612] text-white flex flex-col">
      <header className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-white/60 font-mono">
            S.08 · LIVE SESSION
          </div>
          <h1 className="font-serif text-lg mt-0.5">{session.title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm text-white/70">
            ⏱ {session.elapsedHms}
          </span>
          <Link
            href={`/${user.role}/sessions`}
            className="px-3 py-1.5 rounded-btn bg-red-600 hover:bg-red-700 text-sm font-medium"
          >
            Leave session
          </Link>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-0">
        <section className="p-6 flex flex-col gap-4 overflow-y-auto">
          <div className="bg-[#16241d] rounded-card border border-white/10 aspect-video relative flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center font-serif text-4xl mx-auto">
                {session.mentor.initials}
              </div>
              <div className="mt-4 font-serif text-xl">{session.mentor.name}</div>
              <div className="text-xs text-white/60 mt-1 font-mono uppercase tracking-wider">
                ● Speaking
              </div>
            </div>
            <span className="absolute top-3 left-3"><Pill tone="primary">MENTOR</Pill></span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {participants.slice(1).map((p) => (
              <div
                key={p.id}
                className="bg-[#16241d] rounded-card border border-white/10 aspect-video flex flex-col items-center justify-center relative p-2"
              >
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-lg font-mono">
                  {p.name[0]}
                </div>
                <div className="text-xs mt-2 text-white/80">{p.name}</div>
                <div className="absolute bottom-2 right-2 flex gap-1 text-xs">
                  {p.muted && <span>🔇</span>}
                  {p.raised && <Pill tone="coral">✋ raised</Pill>}
                  {p.voiceOnly && <span className="text-white/40 text-[10px]">voice only</span>}
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="bg-[#0a120e] border-l border-white/10 flex flex-col">
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <div className="text-xs uppercase tracking-wider text-white/60 font-mono">
              Live chat · {participants.length} in room
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 text-sm">
            {chat.map((c) => (
              <div key={c.id}>
                <div className="flex items-baseline gap-2">
                  <span className="font-medium text-primary-fixed-dim">{c.who}</span>
                  <span className="font-mono text-[10px] text-white/40">
                    {c.at}
                  </span>
                </div>
                <div className="text-white/85">{c.body}</div>
              </div>
            ))}
          </div>
          <form className="border-t border-white/10 p-3 flex items-center gap-2">
            <input
              placeholder="Message room…"
              className="flex-1 bg-white/5 border border-white/10 rounded-input px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
            <button className="px-3 py-2 rounded-btn bg-primary hover:bg-primary-hover text-sm">
              Send
            </button>
          </form>
        </aside>
      </div>

      <div className="border-t border-white/10 bg-[#0a120e] px-6 py-3 flex items-center justify-center gap-3">
        {[
          { label: "🎙 Mic" },
          { label: "📹 Cam" },
          { label: "✋ Raise" },
          { label: "🖥 Share" },
          { label: "💬 Chat" },
          { label: "👥 People" },
        ].map((b) => (
          <button
            key={b.label}
            className="px-4 py-2 rounded-btn bg-white/10 hover:bg-white/20 text-sm"
          >
            {b.label}
          </button>
        ))}
      </div>
    </main>
  );
}
