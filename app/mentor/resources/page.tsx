import { Shell } from "@/components/Shell";

const SCOPES = ["Private", "Per-student", "All my students", "Platform-wide (admin approval)"];

const mockUploaded = [
  { id: "r1", title: "Newton's laws cheat sheet", scope: "All my students", shared: 5, when: "yesterday" },
  { id: "r2", title: "Mole concept playlist", scope: "Per-student (Aarav)", shared: 1, when: "today" },
  { id: "r3", title: "Integration tricks", scope: "Platform-wide", shared: 47, when: "1 week ago" },
];

export default function MentorResources() {
  return (
    <Shell role="mentor" active="resources" pageCode="M.05 — Resources" pageTitle="What you've shared.">
      <article className="border-2 border-dashed border-[var(--rule-strong)] p-6 text-center">
        <div className="meta">Upload</div>
        <div className="serif text-lg font-bold mt-1">Drop a PDF or paste a link.</div>
        <div className="flex justify-center gap-2 mt-4">
          <select className="border border-[var(--rule-strong)] px-3 py-2 text-sm bg-[var(--paper)]">
            {SCOPES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <button className="chip-cta">Upload →</button>
        </div>
      </article>

      <ul className="flex flex-col">
        {mockUploaded.map((r) => (
          <li
            key={r.id}
            className="grid grid-cols-[1fr_auto_auto] gap-4 py-3 border-b border-[var(--rule)] items-baseline"
          >
            <div>
              <div className="text-[15px]">{r.title}</div>
              <div className="text-xs text-[var(--ink-soft)] mt-1">
                {r.scope} · shared with {r.shared} · {r.when}
              </div>
            </div>
            <div className="meta">{r.shared}</div>
            <a href="#" className="italic-serif text-sm underline">Manage →</a>
          </li>
        ))}
      </ul>
    </Shell>
  );
}
