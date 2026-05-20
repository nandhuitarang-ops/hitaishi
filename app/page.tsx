import Link from "next/link";
import { LinkButton } from "@/components/ui";

const valueProps = [
  {
    title: "Daily chat access",
    body: "Message your mentor anytime and get a response within hours, not days.",
  },
  {
    title: "Weekly 1:1 video calls",
    body: "Strategy reviews, stress management, and exam-week psychology with your IITian.",
  },
  {
    title: "Curated resource library",
    body: "Handwritten notes, marking schemes, and problem-solving frameworks — vetted, not scraped.",
  },
  {
    title: "Group doubt sessions",
    body: "Bi-weekly peer learning rooms moderated by a verified mentor.",
  },
];

const mentors = [
  {
    name: "Priya",
    branch: "CS, IIT Bombay",
    focus: "Calculus & integration",
    note: "40+ mentored students",
  },
  {
    name: "Rahul",
    branch: "ME, IIT Delhi",
    focus: "Mechanics & electrodynamics",
    note: "Top 1% Physics scorer",
  },
  {
    name: "Ananya",
    branch: "EE, IIT Madras",
    focus: "Organic chemistry",
    note: "Repeat-mentor for 3 cohorts",
  },
];

const faqs = [
  {
    q: "How do you pick mentors?",
    a: "Only IITians from the top 1,000 ranks in JEE Advanced, vetted through a 3-step pedagogical audit before they meet a student.",
  },
  {
    q: "Is this a replacement for coaching?",
    a: "No — we sit alongside your coaching. The mentor handles strategy, stuck-points, and exam psychology, not the syllabus grind.",
  },
  {
    q: "What if I don't like my mentor?",
    a: "Tell us within the first 14 days and we will reassign you, no questions asked.",
  },
  {
    q: "How is access delivered?",
    a: "Through this portal. Daily chat, scheduled video calls, and the shared resource library — all in one place.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-surface text-ink">
      <header className="border-b border-rule bg-surface-card">
        <div className="max-w-container mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-2xl font-medium text-primary-deep"
          >
            MentorIIT
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-ink-soft">
            <a href="#method">The Method</a>
            <a href="#mentors">Mentors</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-ink-soft hover:text-primary-deep"
            >
              Sign in
            </Link>
            <LinkButton href="/checkout" size="sm">
              Pay & Get Access
            </LinkButton>
          </div>
        </div>
      </header>

      <section className="max-w-container mx-auto px-6 md:px-10 py-16 md:py-24 grid md:grid-cols-[1.2fr_1fr] gap-12 items-center">
        <div>
          <div className="meta mb-4">PRIVATE 1:1 MENTORSHIP · S.01</div>
          <h1 className="font-serif text-4xl md:text-6xl leading-tight">
            Your IIT mentor, every single day until JEE.
          </h1>
          <p className="text-lg text-ink-soft mt-6 max-w-[55ch]">
            Private 1:1 mentorship from recent JEE-clearing IIT students. Daily
            chat, weekly video calls, curated resources — not another coaching
            class.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <LinkButton href="/checkout" size="lg">
              Pay & Get Access
            </LinkButton>
            <div className="text-sm text-ink-soft">
              <span className="primary-dot mr-2" /> 128 aspirants in 1:1
              sessions today
            </div>
          </div>
          <p className="text-xs text-ink-faint mt-4 font-mono">
            Secured by Razorpay · 7-day full refund · GST included
          </p>
        </div>
        <div className="bg-surface-card border border-rule rounded-card p-6 shadow-overlay">
          <div className="meta">RESERVE A SLOT</div>
          <div className="font-serif text-2xl mt-2">6-month Full Access</div>
          <div className="font-serif text-5xl text-primary-deep mt-4">
            ₹14,999
          </div>
          <div className="text-sm text-ink-soft mt-1">total · taxes included</div>
          <ul className="text-sm text-ink-soft mt-6 space-y-2">
            <li>· Daily chat with your mentor</li>
            <li>· Personalized study plan</li>
            <li>· Weekly 1:1 video calls</li>
            <li>· Full resource library + group doubt rooms</li>
          </ul>
          <LinkButton href="/checkout" size="md" className="mt-6 w-full">
            Reserve your slot →
          </LinkButton>
        </div>
      </section>

      <section
        id="method"
        className="border-y border-rule bg-surface-card py-16"
      >
        <div className="max-w-container mx-auto px-6 md:px-10">
          <div className="meta">THE GARDEN METHOD</div>
          <h2 className="font-serif text-3xl md:text-4xl mt-2 max-w-[30ch]">
            Four pieces, working together.
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
            {valueProps.map((v) => (
              <div
                key={v.title}
                className="border border-rule rounded-card p-5 bg-surface"
              >
                <div className="font-serif text-xl">{v.title}</div>
                <p className="text-sm text-ink-soft mt-3">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="mentors" className="py-16">
        <div className="max-w-container mx-auto px-6 md:px-10">
          <div className="meta">VERIFIED MENTORS</div>
          <h2 className="font-serif text-3xl md:text-4xl mt-2 max-w-[35ch]">
            Only top-1,000 JEE Advanced rankers. Audited before they meet you.
          </h2>
          <div className="grid md:grid-cols-3 gap-5 mt-10">
            {mentors.map((m) => (
              <div
                key={m.name}
                className="bg-surface-card border border-rule rounded-card p-6"
              >
                <div className="avatar mb-4">{m.name[0]}</div>
                <div className="font-serif text-xl">{m.name}</div>
                <div className="text-sm text-ink-soft mt-1">{m.branch}</div>
                <div className="text-sm mt-3">{m.focus}</div>
                <div className="meta mt-3">{m.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="pricing"
        className="border-y border-rule bg-surface-elevated py-16"
      >
        <div className="max-w-container mx-auto px-6 md:px-10 grid md:grid-cols-[1fr_1fr] gap-12 items-center">
          <div>
            <div className="meta">PRICING</div>
            <h2 className="font-serif text-3xl md:text-4xl mt-2">
              One plan. No upsells. No hidden tiers.
            </h2>
            <p className="text-ink-soft mt-4 max-w-[50ch]">
              You either need a mentor or you don't. We don't believe in
              fragmenting access to your own strategist.
            </p>
          </div>
          <div className="bg-surface-card border border-rule rounded-card p-8">
            <div className="meta">6-MONTH FULL ACCESS</div>
            <div className="font-serif text-5xl text-primary-deep mt-2">
              ₹14,999
            </div>
            <div className="text-sm text-ink-soft mt-1">
              total · taxes included
            </div>
            <LinkButton href="/checkout" size="lg" className="mt-8 w-full">
              Reserve your slot
            </LinkButton>
            <p className="text-xs text-ink-faint mt-4 font-mono text-center">
              7-day refund · No auto-renewal
            </p>
          </div>
        </div>
      </section>

      <section id="faq" className="py-16">
        <div className="max-w-container mx-auto px-6 md:px-10">
          <div className="meta">FREQUENTLY ASKED</div>
          <h2 className="font-serif text-3xl md:text-4xl mt-2">
            The honest answers.
          </h2>
          <dl className="mt-10 max-w-[70ch] space-y-6">
            {faqs.map((f) => (
              <div key={f.q} className="border-b border-rule pb-6">
                <dt className="font-serif text-xl">{f.q}</dt>
                <dd className="text-ink-soft mt-2">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <footer className="border-t border-rule bg-surface-card py-8">
        <div className="max-w-container mx-auto px-6 md:px-10 flex flex-wrap items-center justify-between gap-4 text-sm text-ink-faint">
          <div>© 2026 MentorIIT · For JEE aspirants, by IITians</div>
          <div className="flex items-center gap-5">
            <Link href="/support">Support</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
