import { Shell } from "@/components/Shell";

const SUBJECTS = ["All", "Physics", "Chemistry", "Maths"] as const;

const mockResources = [
  {
    id: "r1",
    title: "Newton's laws cheat sheet",
    subject: "Physics",
    kind: "PDF",
    sharedBy: "Rohan Kapoor",
    sharedAt: "2 hrs ago",
  },
  {
    id: "r2",
    title: "Mole concept playlist",
    subject: "Chemistry",
    kind: "Link",
    sharedBy: "Rohan Kapoor",
    sharedAt: "yesterday",
  },
  {
    id: "r3",
    title: "Integration by parts — worked examples",
    subject: "Maths",
    kind: "PDF",
    sharedBy: "Rohan Kapoor",
    sharedAt: "3 days ago",
  },
  {
    id: "r4",
    title: "Rotational mechanics formula derivations",
    subject: "Physics",
    kind: "PDF",
    sharedBy: "Rohan Kapoor",
    sharedAt: "1 week ago",
  },
  {
    id: "r5",
    title: "Organic chemistry — named reactions",
    subject: "Chemistry",
    kind: "PDF",
    sharedBy: "Rohan Kapoor",
    sharedAt: "1 week ago",
  },
];

export default function StudentResources() {
  return (
    <Shell role="student" active="resources" pageCode="S.05 — Resources" pageTitle="Resources library.">
      <div className="flex flex-wrap gap-2 -mt-1">
        {SUBJECTS.map((s, i) => (
          <button
            key={s}
            className={`px-3 py-1.5 text-sm border ${
              i === 0
                ? "bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]"
                : "border-[var(--rule-strong)] text-[var(--ink)]"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="rule" aria-hidden />

      <ul className="flex flex-col">
        {mockResources.map((r) => (
          <li
            key={r.id}
            className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_120px_120px_60px]
                       gap-3 py-4 border-b border-[var(--rule)] items-baseline"
          >
            <div>
              <div className="text-[15px]">{r.title}</div>
              <div className="text-xs text-[var(--ink-soft)] mt-1">
                Shared by {r.sharedBy} · {r.sharedAt}
              </div>
            </div>
            <div className="meta hidden md:block">{r.subject}</div>
            <div className="italic-serif text-sm text-[var(--ink-soft)] hidden md:block">
              {r.kind}
            </div>
            <a href="#" className="italic-serif text-sm text-[var(--ink)] underline text-right">
              Open →
            </a>
          </li>
        ))}
      </ul>
    </Shell>
  );
}
