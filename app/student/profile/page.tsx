import { Shell } from "@/components/Shell";
import { formatInr, initials } from "@/lib/format";

const mockProfile = {
  fullName: "Aarav Sharma",
  email: "aarav@example.com",
  phone: "+91 98765 43210",
  targetExam: "JEE Advanced",
  targetYear: 2027,
  subjects: ["Physics", "Chemistry", "Maths"],
};

const mockPlan = {
  name: "JEE Adv · 6 months",
  pricePaise: 1_499_900,
  startedAt: new Date(Date.now() - 47 * 24 * 3600_000),
  expiresAt: new Date(Date.now() + 133 * 24 * 3600_000),
};

const mockHistory = [
  {
    id: "h1",
    label: "JEE Adv · 6 months",
    at: "2 Apr 2026",
    amountPaise: 1_499_900,
  },
];

export default function StudentProfile() {
  return (
    <Shell role="student" active="profile" pageCode="S.06 — Profile" pageTitle="Your profile.">
      <article className="flex items-center gap-4 border border-[var(--rule)] p-5">
        <div className="avatar w-16 h-16 text-xl">
          {initials(mockProfile.fullName)}
        </div>
        <div className="flex-1">
          <div className="serif text-xl font-bold">{mockProfile.fullName}</div>
          <div className="text-sm text-[var(--ink-soft)] mt-1">
            {mockProfile.email} · {mockProfile.phone}
          </div>
        </div>
        <button className="chip-ghost">Edit</button>
      </article>

      <section>
        <div className="meta mb-3">Plan</div>
        <div className="flex items-end justify-between border-t-2 border-[var(--ink)] pt-3">
          <div>
            <div className="serif text-2xl font-bold">{mockPlan.name}</div>
            <div className="text-sm text-[var(--ink-soft)] mt-1">
              Expires{" "}
              {mockPlan.expiresAt.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>
          <div className="serif text-3xl font-bold">
            {formatInr(mockPlan.pricePaise)}
          </div>
        </div>
      </section>

      <section>
        <div className="meta mb-3">Focus subjects</div>
        <div className="flex flex-wrap gap-2">
          {mockProfile.subjects.map((s) => (
            <span
              key={s}
              className="px-3 py-1.5 text-sm border border-[var(--rule-strong)]"
            >
              {s}
            </span>
          ))}
          <button className="px-3 py-1.5 text-sm italic-serif text-[var(--ink-soft)]">
            + add subject
          </button>
        </div>
      </section>

      <section>
        <div className="meta mb-3">Payment history</div>
        <ul className="flex flex-col">
          {mockHistory.map((h) => (
            <li
              key={h.id}
              className="flex items-center justify-between py-3 border-b border-[var(--rule)]"
            >
              <div>
                <div className="text-[15px]">{h.label}</div>
                <div className="text-xs text-[var(--ink-soft)] mt-1">{h.at}</div>
              </div>
              <div className="serif text-lg font-bold">
                {formatInr(h.amountPaise)}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-xs text-[var(--ink-soft)] mt-4">
        Need to cancel or transfer your account?{" "}
        <a href="/student/chat" className="underline">
          Message admin
        </a>{" "}
        — intentional friction, by design.
      </p>
    </Shell>
  );
}
