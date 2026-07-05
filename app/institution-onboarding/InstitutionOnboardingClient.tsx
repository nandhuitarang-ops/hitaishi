"use client";

import { useState } from "react";
import Link from "next/link";
import { Stepper, Card, CardBody, Field, Input, Select, Button, Pill } from "@/components/ui";

const STEPS = [
  { label: "Details", emoji: "🏢", color: "#F4CA3E" },
  { label: "Cohort", emoji: "👥", color: "#7c3aed" },
  { label: "Goals", emoji: "🎯", color: "#2563eb" },
];

const COHORT_SIZES = [
  "< 50",
  "50–200",
  "200–500",
  "500–1000",
  "1000+",
];

const BATCHES = [
  "Class XI Foundation",
  "Class XII Syllabus & Boards",
  "Droppers — Intensive JEE",
] as const;

export function InstitutionOnboardingClient() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<"idle" | "submitting" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [institutionName, setInstitutionName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  const [studentCount, setStudentCount] = useState("");
  const [batches, setBatches] = useState<string[]>([]);

  const [integrationModel, setIntegrationModel] = useState("");
  const [primaryGoal, setPrimaryGoal] = useState("");
  const [message, setMessage] = useState("");

  const toggleBatch = (batch: string) => {
    setBatches((prev) =>
      prev.includes(batch) ? prev.filter((b) => b !== batch) : [...prev, batch]
    );
  };

  const validateStep = () => {
    setErrorMsg(null);
    if (step === 0) {
      if (!institutionName.trim() || !contactPerson.trim() || !role.trim() || !email.trim() || !phone.trim() || !city.trim()) {
        setErrorMsg("Please fill in all required fields.");
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setErrorMsg("Please enter a valid email address.");
        return false;
      }
      if (!/^[\d+\-\s()]{7,20}$/.test(phone)) {
        setErrorMsg("Please enter a valid phone number.");
        return false;
      }
    } else if (step === 1) {
      if (!studentCount) {
        setErrorMsg("Please select your student cohort size.");
        return false;
      }
    } else if (step === 2) {
      if (!integrationModel) {
        setErrorMsg("Please select your preferred integration model.");
        return false;
      }
      if (!primaryGoal) {
        setErrorMsg("Please select your primary partnership goal.");
        return false;
      }
    }
    return true;
  };

  const goForward = () => {
    if (validateStep()) {
      setStep((s) => Math.min(2, s + 1));
    }
  };

  const goBack = () => {
    setErrorMsg(null);
    setStep((s) => Math.max(0, s - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    setState("submitting");
    setErrorMsg(null);

    const payload = {
      type: "institution-partner",
      institutionName,
      contactPerson,
      role,
      email,
      phone,
      city,
      studentCount,
      partnershipModel: integrationModel,
      message: `Primary Goal: ${primaryGoal}. Batches: ${batches.join(", ")}. ${message || ""}`.trim(),
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? `Submission failed (${res.status})`);
      }
      setState("ok");
    } catch (err: any) {
      setState("error");
      setErrorMsg(err.message || "Something went wrong.");
    }
  };

  if (state === "ok") {
    return (
      <div className="rounded-3xl border border-[var(--color-sky)]/40 bg-[var(--color-sky-soft)]/40 p-10 text-center md:p-14">
        <p className="text-4xl">🏫</p>
        <h2 className="mt-4 font-serif text-3xl font-medium leading-tight text-ink md:text-4xl">
          Thank you — your partnership enquiry is in!
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink-soft md:text-lg">
          Our team will review your details and reach out within 2 working days to schedule a demo and design a custom mentorship integration plan for your students.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white shadow-soft hover:bg-primary-hover transition-colors"
        >
          Back to home →
        </Link>
      </div>
    );
  }

  const current = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="space-y-8">
      {/* Stepper progress indicator */}
      <div className="flex items-center justify-between gap-4">
        {STEPS.map((s, i) => (
          <button
            key={s.label}
            onClick={() => i < step && setStep(i)}
            disabled={i > step}
            className={`flex-1 flex items-center gap-1.5 text-xs font-medium transition-all pb-2 border-b-2 ${
              i === step
                ? "text-ink border-primary"
                : i < step
                  ? "text-primary border-primary/40 cursor-pointer hover:border-primary"
                  : "text-ink-faint/30 border-rule cursor-not-allowed"
            }`}
            style={i === step ? { borderColor: current.color } : undefined}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              i === step
                ? "text-white shadow-sm"
                : i < step
                  ? "bg-primary/15 text-primary"
                  : "bg-surface-elevated text-ink-faint/40"
            }`}
              style={i === step ? { backgroundColor: current.color } : undefined}
            >
              {i < step ? "✓" : i + 1}
            </span>
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="h-[3px] bg-surface-elevated rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%`, backgroundColor: current.color }}
        />
      </div>

      <Card className="backdrop-blur-xl bg-white/70 border border-white/50 shadow-lift rounded-3xl relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-1.5 before:bg-gradient-to-r before:from-primary before:to-secondary">
        <CardBody className="p-6 md:p-10">
          <div className="meta text-xs tracking-widest font-mono text-primary font-semibold uppercase">
            STEP {step + 1} OF 3 · {Math.round(progress)}%
          </div>

          {errorMsg && (
            <div className="mt-4 p-4 rounded-xl bg-red-50 text-red-700 border border-red-200 text-sm flex items-start gap-2.5">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ── STEP 0: DETAILS ── */}
          {step === 0 && (
            <div className="mt-6 space-y-5">
              <h2 className="font-serif text-3xl font-medium text-ink">Institutional Details</h2>
              <p className="text-sm text-ink-soft leading-relaxed">
                Tell us about your coaching center or academy.
              </p>

              <div className="grid gap-4 mt-6">
                <Field label="Institution Name" required>
                  <Input value={institutionName} onChange={(e) => setInstitutionName(e.target.value)} placeholder="e.g. Bright Future JEE Academy" required />
                </Field>
                <Field label="Contact Person Name" required>
                  <Input value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} placeholder="Full name" required />
                </Field>
                <Field label="Your Role" required>
                  <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Director, Principal, Academic Head" required />
                </Field>
                <div className="grid md:grid-cols-2 gap-4">
                  <Field label="Official Email" required>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="director@brightfuture.com" required />
                  </Field>
                  <Field label="Phone Number" required>
                    <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. +91 98765 43210" required />
                  </Field>
                </div>
                <Field label="City" required>
                  <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Hyderabad" required />
                </Field>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-rule/50">
                <Button type="button" size="lg" onClick={goForward}>
                  Continue →
                </Button>
              </div>
            </div>
          )}

          {/* ── STEP 1: COHORT ── */}
          {step === 1 && (
            <div className="mt-6 space-y-5">
              <h2 className="font-serif text-3xl font-medium text-ink">Student Cohort Details</h2>
              <p className="text-sm text-ink-soft leading-relaxed">
                Help us estimate the mentor capacity needed for your batches.
              </p>

              <div className="grid gap-5 mt-6">
                <Field label="Number of JEE Students" required>
                  <Select value={studentCount} onChange={(e) => setStudentCount(e.target.value)} required>
                    <option value="">Select size…</option>
                    {COHORT_SIZES.map((size) => (
                      <option key={size} value={size}>
                        {size} students
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field label="Batches Running Currently">
                  <div className="flex flex-col gap-3 mt-2">
                    {BATCHES.map((batch) => {
                      const isChecked = batches.includes(batch);
                      return (
                        <button
                          key={batch}
                          type="button"
                          onClick={() => toggleBatch(batch)}
                          className="flex items-center gap-3 text-left w-full hover:bg-surface-elevated/40 p-2 rounded-xl transition-colors"
                        >
                          <span className={`flex items-center justify-center w-5 h-5 rounded border transition-colors ${
                            isChecked
                              ? "bg-primary border-primary text-white"
                              : "border-rule-strong bg-white"
                          }`}>
                            {isChecked && "✓"}
                          </span>
                          <span className="text-sm text-ink">{batch}</span>
                        </button>
                      );
                    })}
                  </div>
                </Field>
              </div>

              <div className="flex justify-between gap-3 pt-6 border-t border-rule/50 mt-4">
                <button type="button" onClick={goBack} className="px-5 py-2.5 rounded-xl text-sm font-medium text-ink-soft border border-rule hover:bg-surface-elevated transition-colors">
                  ← Back
                </button>
                <Button type="button" size="lg" onClick={goForward}>
                  Continue →
                </Button>
              </div>
            </div>
          )}

          {/* ── STEP 2: GOALS ── */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <h2 className="font-serif text-3xl font-medium text-ink">Partnership Goals</h2>
              <p className="text-sm text-ink-soft leading-relaxed">
                Define how Hitaishi&apos;s IITian mentors can support your institution.
              </p>

              <div className="grid gap-5 mt-6">
                <Field label="Preferred Integration Model" required>
                  <Select value={integrationModel} onChange={(e) => setIntegrationModel(e.target.value)} required>
                    <option value="">Select model…</option>
                    <option value="addon">Add-on service for our students</option>
                    <option value="integrated">Integrated into our fee structure</option>
                    <option value="pilot">Pilot batch / small cohort</option>
                    <option value="discussion">Not sure — let&apos;s discuss</option>
                  </Select>
                </Field>

                <Field label="Primary Partnership Goal" required>
                  <Select value={primaryGoal} onChange={(e) => setPrimaryGoal(e.target.value)} required>
                    <option value="">Select goal…</option>
                    <option value="backlog">Reduce doubt backlog & clear concepts</option>
                    <option value="guidance">Provide personal study strategies</option>
                    <option value="analytics">Performance analytics & reviews</option>
                    <option value="marketing">Gain a marketing edge with IITian mentors</option>
                  </Select>
                </Field>

                <Field label="Special Requests or Message (optional)">
                  <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us any specific requirements or timelines..." />
                </Field>
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between mt-6 pt-6 border-t border-rule/50">
                <button type="button" onClick={goBack} className="px-5 py-2.5 rounded-xl text-sm font-medium text-ink-soft border border-rule hover:bg-surface-elevated transition-colors">
                  ← Back
                </button>
                <div className="flex gap-3 items-center">
                  <Link
                    href="/"
                    className="text-sm text-ink-soft hover:text-primary-deep underline underline-offset-2"
                  >
                    Skip for now
                  </Link>
                  <Button type="submit" size="lg" disabled={state === "submitting"}>
                    {state === "submitting" ? "Submitting Inquiry…" : "Submit Partnership Enquiry →"}
                  </Button>
                </div>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 border-t border-rule/60 pt-8">
            <div className="rounded-xl border border-rule/60 p-5 bg-white/50">
              <Pill tone="primary">INSTITUTIONS</Pill>
              <h4 className="font-serif text-lg mt-3 text-ink">White-Labeled Reports</h4>
              <p className="text-xs text-ink-soft mt-1 leading-relaxed">
                Receive weekly engagement and confidence ratings per student batch.
              </p>
            </div>
            <div className="rounded-xl border border-rule/60 p-5 bg-white/50">
              <Pill tone="coral">SCALABLE</Pill>
              <h4 className="font-serif text-lg mt-3 text-ink">IITian Mentor Matching</h4>
              <p className="text-xs text-ink-soft mt-1 leading-relaxed">
                Every student gets one-on-one time with high rankers from top IITs.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
