import Link from "next/link";
import { Stepper, Card, CardBody, Field, Input, Select, Textarea, Button, Pill } from "@/components/ui";

const STEPS = [
  { label: "Profile" },
  { label: "Subjects" },
  { label: "Availability" },
  { label: "Payout" },
];

const SUBJECTS = ["Physics", "Chemistry", "Mathematics"] as const;
const LEVELS = ["Foundational", "Advanced (JEE Adv)"] as const;
const COHORTS = [
  "Class XI Foundation",
  "Class XII Syllabus & Boards",
  "Droppers — Intensive JEE",
] as const;
const TEACHING_TAGS = [
  "Concept building",
  "Problem solving",
  "Exam strategy",
  "Doubt clearing",
  "Speed tactics",
] as const;

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SLOTS = ["Mor", "Aft", "Eve", "Night"];

interface Props {
  searchParams?: { step?: string };
}

export default function MentorOnboardingPage({ searchParams }: Props) {
  const step = Math.max(0, Math.min(3, Number(searchParams?.step ?? 0)));

  return (
    <main className="min-h-screen bg-surface text-ink">
      <header className="border-b border-rule bg-surface-card px-6 md:px-10 py-5 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl text-primary-deep">
          MentorIIT
        </Link>
        <div className="meta">M.02 — MENTOR ONBOARDING</div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <Stepper steps={STEPS} current={step} className="mb-10" />

        {step === 0 && <Step1Profile />}
        {step === 1 && <Step2Subjects />}
        {step === 2 && <Step3Availability />}
        {step === 3 && <Step4Payout />}
      </div>
    </main>
  );
}

function Step1Profile() {
  return (
    <Card>
      <CardBody>
        <div className="meta">STEP 1 OF 4 · 25%</div>
        <h2 className="font-serif text-3xl mt-1">Tell students about you</h2>
        <p className="text-sm text-ink-soft mt-2">
          Profile information is automatically cross-referenced with IIT
          institutional databases.
        </p>

        <form
          action="/mentor/onboarding?step=1"
          method="get"
          className="grid gap-4 mt-8"
        >
          <div className="flex items-center gap-4 p-4 bg-surface-elevated rounded-card">
            <div className="w-20 h-20 rounded-full bg-surface-card border border-rule-strong flex items-center justify-center text-3xl text-ink-faint">
              📷
            </div>
            <div>
              <div className="text-sm font-medium">Professional headshot</div>
              <div className="meta mt-1">Shown to prospective students</div>
              <button type="button" className="chip-ghost text-xs mt-2">
                Upload photo
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Display name" required>
              <Input name="displayName" placeholder="Priya Sharma" required />
            </Field>
            <Field label="JEE Adv rank">
              <Input type="number" name="jeeRank" placeholder="227" />
            </Field>
            <Field label="IIT" required>
              <Select name="iit" required>
                <option>IIT Bombay</option>
                <option>IIT Delhi</option>
                <option>IIT Madras</option>
                <option>IIT Kanpur</option>
                <option>IIT Kharagpur</option>
                <option>Other IIT</option>
              </Select>
            </Field>
            <Field label="Branch" required>
              <Input name="branch" placeholder="Computer Science" required />
            </Field>
            <Field label="Graduation year" required>
              <Input type="number" name="gradYear" placeholder="2024" required />
            </Field>
            <Field label="LinkedIn URL">
              <Input
                type="url"
                name="linkedin"
                placeholder="https://linkedin.com/in/priya"
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Bio" hint="Max 280 characters — shown during student selection.">
                <Textarea
                  name="bio"
                  rows={3}
                  maxLength={280}
                  placeholder="Cleared JEE Adv 2020 in top 250. I focus on building intuition, not shortcuts."
                />
              </Field>
            </div>
          </div>

          <input type="hidden" name="step" value="1" />
          <div className="flex justify-between mt-4">
            <button type="button" className="chip-ghost">Save draft</button>
            <Button type="submit" size="lg">
              Continue →
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

function Step2Subjects() {
  return (
    <Card>
      <CardBody>
        <div className="meta">STEP 2 OF 4 · 50%</div>
        <h2 className="font-serif text-3xl mt-1">What you teach</h2>
        <p className="text-sm text-ink-soft mt-2">
          Subject expertise and pedagogical style. Pick what's true, not what
          markets well.
        </p>

        <form
          action="/mentor/onboarding?step=2"
          method="get"
          className="grid gap-5 mt-8"
        >
          <div className="grid gap-3">
            {SUBJECTS.map((s) => (
              <div key={s} className="border border-rule rounded-card p-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="font-medium">{s}</div>
                  <div className="flex gap-2">
                    {LEVELS.map((lvl) => (
                      <label key={lvl} className="cursor-pointer">
                        <input
                          type="checkbox"
                          name={`level-${s}`}
                          value={lvl}
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
          </div>

          <Field label="Preferred student batches">
            <div className="flex flex-wrap gap-2">
              {COHORTS.map((c) => (
                <label key={c} className="cursor-pointer">
                  <input type="checkbox" name="batches" value={c} className="sr-only peer" />
                  <span className="px-3 py-2 rounded-pill text-sm border border-rule-strong bg-surface-card peer-checked:bg-primary peer-checked:text-primary-on peer-checked:border-primary">
                    {c}
                  </span>
                </label>
              ))}
            </div>
          </Field>

          <Field label="Teaching style" hint="Pick up to two.">
            <div className="flex flex-wrap gap-2">
              {TEACHING_TAGS.map((t) => (
                <label key={t} className="cursor-pointer">
                  <input type="checkbox" name="style" value={t} className="sr-only peer" />
                  <span className="px-3 py-1.5 rounded-pill text-xs font-mono uppercase tracking-wider border border-rule-strong bg-surface-card peer-checked:bg-secondary peer-checked:text-white peer-checked:border-secondary">
                    {t}
                  </span>
                </label>
              ))}
            </div>
          </Field>

          <p className="text-xs text-ink-faint italic">
            Students often value "Concept building" over pure shortcuts.
          </p>

          <input type="hidden" name="step" value="2" />
          <div className="flex justify-between mt-2">
            <Link href="/mentor/onboarding?step=0" className="chip-ghost">
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

function Step3Availability() {
  return (
    <Card>
      <CardBody>
        <div className="meta">STEP 3 OF 4 · 75%</div>
        <h2 className="font-serif text-3xl mt-1">When you're available</h2>
        <p className="text-sm text-ink-soft mt-2">
          Tap to toggle blocks. You can refine this any time after activation.
        </p>

        <form
          action="/mentor/onboarding?step=3"
          method="get"
          className="grid gap-5 mt-8"
        >
          <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr] gap-1 text-center">
            <div />
            {SLOTS.map((s) => (
              <div key={s} className="meta py-2">
                {s}
              </div>
            ))}
            {DAYS.map((d) => (
              <div key={d} className="contents">
                <div className="meta py-2 text-left">{d}</div>
                {SLOTS.map((s) => (
                  <label key={`${d}-${s}`} className="cursor-pointer">
                    <input
                      type="checkbox"
                      name={`avail-${d}-${s}`}
                      className="sr-only peer"
                    />
                    <span className="block h-10 rounded-input bg-surface-card border border-rule peer-checked:bg-primary peer-checked:border-primary" />
                  </label>
                ))}
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <Field label="Time zone">
              <Select defaultValue="ist">
                <option value="ist">IST (GMT+5:30)</option>
                <option value="utc">UTC</option>
                <option value="pst">PST</option>
              </Select>
            </Field>
            <Field label="Target hours per week" hint="2–40 hours">
              <Input
                type="number"
                name="weeklyHours"
                min={2}
                max={40}
                defaultValue={10}
              />
            </Field>
          </div>

          <input type="hidden" name="step" value="3" />
          <div className="flex justify-between mt-2">
            <Link href="/mentor/onboarding?step=1" className="chip-ghost">
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

function Step4Payout() {
  return (
    <Card>
      <CardBody>
        <div className="meta">STEP 4 OF 4 · 100%</div>
        <h2 className="font-serif text-3xl mt-1">Get paid</h2>
        <p className="text-sm text-ink-soft mt-2">
          Payouts via Razorpay Routes. Bank verification is instant. KYC + PAN
          required by Indian tax law.
        </p>

        <form
          action="/mentor/dashboard"
          method="get"
          className="grid gap-4 mt-8"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Account holder name" required>
              <Input name="holderName" required />
            </Field>
            <Field label="PAN number" required>
              <Input
                name="pan"
                pattern="[A-Z]{5}[0-9]{4}[A-Z]"
                placeholder="ABCDE1234F"
                required
              />
            </Field>
            <Field label="Bank account number" required>
              <Input name="account" inputMode="numeric" required />
            </Field>
            <Field label="Confirm account number" required>
              <Input name="accountConfirm" inputMode="numeric" required />
            </Field>
            <Field label="IFSC code" required>
              <Input name="ifsc" pattern="[A-Z]{4}0[A-Z0-9]{6}" required />
            </Field>
            <Field label="Bank name (auto from IFSC)">
              <Input name="bankName" readOnly placeholder="HDFC Bank — Indiranagar branch" />
            </Field>
          </div>

          <div className="bg-primary-soft border border-primary/30 rounded-card p-4 flex items-center gap-3 text-sm">
            <Pill tone="primary">RAZORPAY</Pill>
            <div>
              End-to-end encrypted payouts · TDS-compliant · Instant settlement
              after each session.
            </div>
          </div>

          <label className="flex items-start gap-2 text-sm text-ink-soft">
            <input type="checkbox" required className="mt-1" />
            <span>
              I agree to the{" "}
              <a className="underline" href="/policy/mentor-payout-terms">
                Mentor Payout Terms
              </a>{" "}
              and the platform&apos;s academic integrity policy.
            </span>
          </label>

          <div className="flex justify-between mt-4">
            <Link href="/mentor/onboarding?step=2" className="chip-ghost">
              ← Back
            </Link>
            <Button type="submit" size="lg">
              Activate my profile →
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
