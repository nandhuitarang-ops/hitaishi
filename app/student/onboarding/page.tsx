import Link from "next/link";
import { Stepper, Card, CardBody, Field, Input, Select, Button, Pill } from "@/components/ui";

const STEPS = [
  { label: "Basics" },
  { label: "Goal" },
  { label: "Subjects" },
];

const SUBJECTS = [
  { key: "physics", label: "Physics", focus: "Mechanics & Optics", icon: "🔥" },
  { key: "chem", label: "Chemistry", focus: "Organic Synthesis", icon: "⚗️" },
  { key: "math", label: "Math", focus: "Calculus & Vectors", icon: "ƒ" },
];

const STRENGTH_LEVELS = ["Strong", "OK", "Struggling"] as const;

interface Props {
  searchParams?: { step?: string };
}

export default function StudentOnboardingPage({ searchParams }: Props) {
  const step = Math.max(0, Math.min(2, Number(searchParams?.step ?? 0)));

  return (
    <main className="min-h-screen bg-surface text-ink">
      <header className="border-b border-rule bg-surface-card px-6 md:px-10 py-5 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl text-primary-deep">
          MentorIIT
        </Link>
        <div className="meta">S.02 — ONBOARDING</div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <Stepper steps={STEPS} current={step} className="mb-10" />

        {step === 0 && <Step1Basics />}
        {step === 1 && <Step2Goal />}
        {step === 2 && <Step3Subjects />}
      </div>
    </main>
  );
}

function Step1Basics() {
  return (
    <Card>
      <CardBody>
        <div className="meta">STEP 1 OF 3</div>
        <h2 className="font-serif text-3xl mt-1">Tell us about yourself</h2>
        <p className="text-sm text-ink-soft mt-2">
          We'll use this to personalize your mentorship path.
        </p>
        <form
          action="/student/onboarding?step=1"
          method="get"
          className="grid gap-4 mt-8"
        >
          <Field label="Full name" required>
            <Input name="fullName" placeholder="Arjun Srinivasan" required />
          </Field>
          <Field label="Current class" required>
            <Select name="class" required>
              <option value="">Select…</option>
              <option value="11">Class XI</option>
              <option value="12">Class XII</option>
              <option value="dropper">Dropper</option>
            </Select>
          </Field>
          <Field label="Board">
            <Select name="board">
              <option>CBSE</option>
              <option>ICSE</option>
              <option>State board</option>
            </Select>
          </Field>
          <Field label="City">
            <Input name="city" placeholder="Indore" />
          </Field>
          <input type="hidden" name="step" value="1" />
          <div className="flex justify-end mt-4">
            <Button type="submit" size="lg">
              Continue →
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

function Step2Goal() {
  return (
    <Card>
      <CardBody>
        <div className="meta">STEP 2 OF 3</div>
        <h2 className="font-serif text-3xl mt-1">What are you aiming for?</h2>
        <p className="text-sm text-ink-soft mt-2">
          Clear targets help us customize your learning path.
        </p>
        <form
          action="/student/onboarding?step=2"
          method="get"
          className="grid gap-4 mt-8"
        >
          <Field label="Target college">
            <Select name="college">
              <option>IIT Bombay</option>
              <option>IIT Delhi</option>
              <option>IIT Madras</option>
              <option>IIT Kanpur</option>
              <option>IIT Kharagpur</option>
              <option>Any IIT</option>
            </Select>
          </Field>
          <Field label="JEE attempt year">
            <Select name="year">
              <option>2026</option>
              <option>2027</option>
              <option>2028</option>
            </Select>
          </Field>
          <Field label="Target AIR rank" hint="Be honest — we'll set milestones from here.">
            <Input
              type="number"
              name="targetRank"
              min={1}
              max={50000}
              placeholder="500"
            />
          </Field>
          <Field label="Study hours per day">
            <Select name="hours">
              <option>4–6 hours</option>
              <option>6–8 hours</option>
              <option>8–10 hours</option>
              <option>10+ hours</option>
            </Select>
          </Field>
          <input type="hidden" name="step" value="2" />
          <div className="flex justify-between mt-4">
            <Link
              href="/student/onboarding?step=0"
              className="chip-ghost"
            >
              ← Back
            </Link>
            <Button type="submit" size="lg">
              Continue →
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

function Step3Subjects() {
  return (
    <Card>
      <CardBody>
        <div className="meta">STEP 3 OF 3 · 100%</div>
        <h2 className="font-serif text-3xl mt-1">Subject focus</h2>
        <p className="text-sm text-ink-soft mt-2">
          Rate yourself by subject — this matches you with the right mentor.
        </p>

        <form
          action="/student/dashboard"
          method="get"
          className="grid gap-5 mt-8"
        >
          {SUBJECTS.map((s) => (
            <div key={s.key} className="border border-rule rounded-card p-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <div className="font-serif text-lg flex items-center gap-2">
                    <span aria-hidden>{s.icon}</span> {s.label}
                  </div>
                  <div className="text-sm text-ink-soft mt-0.5">
                    Focus area: {s.focus}
                  </div>
                </div>
                <div role="radiogroup" className="flex gap-2">
                  {STRENGTH_LEVELS.map((lvl, idx) => (
                    <label
                      key={lvl}
                      className="cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={`level-${s.key}`}
                        value={lvl}
                        defaultChecked={idx === 1}
                        className="sr-only peer"
                      />
                      <span className="px-3 py-1.5 rounded-pill text-xs font-mono uppercase tracking-wider border border-rule-strong bg-surface-card peer-checked:bg-primary peer-checked:text-primary-on peer-checked:border-primary">
                        {lvl}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <Field label="Last mock test score" hint="Out of 300 (optional)">
            <Input
              type="number"
              name="mockScore"
              min={0}
              max={300}
              placeholder="220"
            />
          </Field>

          <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between mt-2">
            <Link
              href="/student/onboarding?step=1"
              className="chip-ghost"
            >
              ← Back
            </Link>
            <div className="flex gap-3">
              <Link
                href="/student/dashboard"
                className="text-sm text-ink-soft hover:text-primary-deep underline underline-offset-2"
              >
                Skip for now
              </Link>
              <Button type="submit" size="lg">
                Meet your mentor →
              </Button>
            </div>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-10">
          <div className="rounded-card border border-rule p-4 bg-surface">
            <Pill tone="primary">Analytics</Pill>
            <p className="text-sm text-ink-soft mt-2">
              Daily progress, weekly review, mock-score forecasting.
            </p>
          </div>
          <div className="rounded-card border border-rule p-4 bg-surface">
            <Pill tone="coral">Psychology</Pill>
            <p className="text-sm text-ink-soft mt-2">
              Exam-week routines and stress drills from your mentor.
            </p>
          </div>
          <div className="rounded-card border border-rule p-4 bg-surface">
            <Pill tone="neutral">Library</Pill>
            <p className="text-sm text-ink-soft mt-2">
              Hand-curated PDFs, walkthroughs, and mock-test sets.
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
