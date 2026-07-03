"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Stepper, Card, CardBody, Field, Input, Select, Textarea, Button } from "@/components/ui";

const STEPS = [
  { label: "Profile", emoji: "👤", color: "#059669" },
  { label: "Subjects", emoji: "📚", color: "#7c3aed" },
  { label: "Availability", emoji: "🗓️", color: "#2563eb" },
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

export function MentorOnboardingClient() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<"idle" | "submitting" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const [jeeRank, setJeeRank] = useState("");
  const [institute, setInstitute] = useState("IIT Bombay");
  const [branch, setBranch] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [bio, setBio] = useState("");

  const [selectedSubjects, setSelectedSubjects] = useState<Record<string, string[]>>({
    Physics: [], Chemistry: [], Mathematics: []
  });
  const [batches, setBatches] = useState<string[]>([]);
  const [styles, setStyles] = useState<string[]>([]);

  const [availability, setAvailability] = useState<string[]>([]);
  const [timezone, setTimezone] = useState("ist");
  const [weeklyHours, setWeeklyHours] = useState("10");
  const [motivation, setMotivation] = useState("");
  const [priorExperience, setPriorExperience] = useState("");

  const toggleSubjectLevel = (sub: string, lvl: string) => {
    setSelectedSubjects((prev) => {
      const current = prev[sub] || [];
      const updated = current.includes(lvl)
        ? current.filter((l) => l !== lvl)
        : [...current, lvl];
      return { ...prev, [sub]: updated };
    });
  };

  const toggleBatch = (batch: string) => {
    setBatches((prev) =>
      prev.includes(batch) ? prev.filter((b) => b !== batch) : [...prev, batch]
    );
  };

  const toggleStyle = (style: string) => {
    setStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const toggleAvailability = (day: string, slot: string) => {
    const key = `${day}-${slot}`;
    setAvailability((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const validateStep = () => {
    setErrorMsg(null);
    if (step === 0) {
      if (!fullName.trim() || !email.trim() || !phone.trim() || !city.trim() || !branch.trim() || !gradYear.trim()) {
        setErrorMsg("Please fill in all required fields.");
        return false;
      }
      if (!/^\d{4}$/.test(gradYear)) {
        setErrorMsg("Graduation year must be a 4-digit number.");
        return false;
      }
      if (!/^[\d+\-\s()]{7,20}$/.test(phone)) {
        setErrorMsg("Please enter a valid phone number.");
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setErrorMsg("Please enter a valid email address.");
        return false;
      }
    } else if (step === 1) {
      const hasSubject = Object.values(selectedSubjects).some(arr => arr.length > 0);
      if (!hasSubject) {
        setErrorMsg("Please select at least one subject and expertise level.");
        return false;
      }
    } else if (step === 2) {
      if (availability.length === 0) {
        setErrorMsg("Please select at least one availability slot.");
        return false;
      }
      if (motivation.trim().length < 20) {
        setErrorMsg("Motivation statement must be at least 20 characters.");
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

    // Map client state to lead schema format
    const subjectsList: string[] = [];
    Object.entries(selectedSubjects).forEach(([sub, lvls]) => {
      if (lvls.length > 0) subjectsList.push(sub);
    });

    const payload = {
      type: "mentor-application",
      name: fullName,
      email,
      phone,
      city,
      gender: gender || "",
      institute,
      branch,
      yearOfStudy: "Graduated",
      jeeExam: "JEE Advanced",
      jeeYear: gradYear,
      jeeRank: jeeRank || "N/A",
      subjects: subjectsList,
      preferredLevel: batches.join(", ").slice(0, 80) || "All",
      languages: ["English", "Hindi"],
      weeklyHours: `${weeklyHours} hours`,
      preferredSlots: availability,
      motivation,
      priorExperience: priorExperience || "",
      website: "",
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
        <p className="text-4xl">🚀</p>
        <h2 className="mt-4 font-serif text-3xl font-medium leading-tight text-ink md:text-4xl">
          Thank you for applying to Hitaishi!
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink-soft md:text-lg">
          Your application is in. Our team will review your details and reach out within 2–3
          working days to schedule a short onboarding call. Welcome to the start of something
          meaningful.
        </p>
        <p className="mt-8 font-serif text-lg italic text-ink-soft">
          &ldquo;You worked hard to get into IIT. Now let that hard work work for someone else too.&rdquo;
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

          {/* ── STEP 0: PROFILE ── */}
          {step === 0 && (
            <div className="mt-6 space-y-5">
              <h2 className="font-serif text-3xl font-medium text-ink">Tell students about you</h2>
              <p className="text-sm text-ink-soft leading-relaxed">
                Profile information is automatically cross-referenced with IIT institutional databases.
              </p>

              <div className="grid gap-4 mt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Field label="Display Name" required>
                    <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Priya Sharma" required />
                  </Field>
                  <Field label="JEE Adv Rank">
                    <Input type="number" value={jeeRank} onChange={(e) => setJeeRank(e.target.value)} placeholder="227" />
                  </Field>
                  <Field label="Email Address" required>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="priya@iitb.ac.in" required />
                  </Field>
                  <Field label="Phone / WhatsApp" required>
                    <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" required />
                  </Field>
                  <Field label="IIT" required>
                    <Select value={institute} onChange={(e) => setInstitute(e.target.value)} required>
                      <option>IIT Bombay</option>
                      <option>IIT Delhi</option>
                      <option>IIT Madras</option>
                      <option>IIT Kanpur</option>
                      <option>IIT Kharagpur</option>
                      <option>Other IIT</option>
                    </Select>
                  </Field>
                  <Field label="Branch" required>
                    <Input value={branch} onChange={(e) => setBranch(e.target.value)} placeholder="Computer Science" required />
                  </Field>
                  <Field label="Graduation Year" required>
                    <Input type="number" value={gradYear} onChange={(e) => setGradYear(e.target.value)} placeholder="2024" required />
                  </Field>
                  <Field label="City" required>
                    <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Mumbai, Hyderabad" required />
                  </Field>
                  <Field label="Gender">
                    <Select value={gender} onChange={(e) => setGender(e.target.value)}>
                      <option value="">Prefer not to say</option>
                      <option>Female</option>
                      <option>Male</option>
                      <option>Non-binary</option>
                    </Select>
                  </Field>
                  <Field label="LinkedIn URL">
                    <Input type="url" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/priya" />
                  </Field>
                  <div className="md:col-span-2">
                    <Field label="Bio" hint="Max 280 characters — shown during student selection.">
                      <Textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                        maxLength={280}
                        placeholder="Cleared JEE Adv 2020 in top 250. I focus on building intuition, not shortcuts."
                      />
                    </Field>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-rule/50">
                <Button type="button" size="lg" onClick={goForward}>
                  Continue →
                </Button>
              </div>
            </div>
          )}

          {/* ── STEP 1: SUBJECTS ── */}
          {step === 1 && (
            <div className="mt-6 space-y-5">
              <h2 className="font-serif text-3xl font-medium text-ink">What you teach</h2>
              <p className="text-sm text-ink-soft leading-relaxed">
                Subject expertise and pedagogical style. Pick what&apos;s true, not what markets well.
              </p>

              <div className="grid gap-4 mt-6">
                <div className="grid gap-3">
                  {SUBJECTS.map((s) => {
                    const currentLevels = selectedSubjects[s] || [];
                    return (
                      <div key={s} className="border border-rule bg-surface-card/50 rounded-card p-4">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="font-medium text-ink">{s}</div>
                          <div className="flex gap-2">
                            {LEVELS.map((lvl) => (
                              <button
                                key={lvl}
                                type="button"
                                onClick={() => toggleSubjectLevel(s, lvl)}
                                className={`px-3 py-1.5 rounded-pill text-xs font-mono uppercase tracking-wider border transition-all duration-200 ${
                                  currentLevels.includes(lvl)
                                    ? "bg-primary text-white border-primary"
                                    : "border-rule-strong bg-white/50 hover:bg-surface text-ink-soft"
                                }`}
                              >
                                {lvl}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Field label="Preferred student batches">
                  <div className="flex flex-wrap gap-2 mt-1">
                    {COHORTS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleBatch(c)}
                        className={`px-3 py-2 rounded-pill text-sm border transition-all duration-200 ${
                          batches.includes(c)
                            ? "bg-primary text-white border-primary"
                            : "border-rule-strong bg-white/50 hover:bg-surface text-ink-soft"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Teaching style" hint="Pick up to two.">
                  <div className="flex flex-wrap gap-2 mt-1">
                    {TEACHING_TAGS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => toggleStyle(t)}
                        className={`px-3 py-1.5 rounded-pill text-xs font-mono uppercase tracking-wider border transition-all duration-200 ${
                          styles.includes(t)
                            ? "bg-secondary text-white border-secondary"
                            : "border-rule-strong bg-white/50 hover:bg-surface text-ink-soft"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </Field>

                <p className="text-xs text-ink-faint italic mt-2">
                  Students often value &ldquo;Concept building&rdquo; over pure shortcuts.
                </p>
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

          {/* ── STEP 2: AVAILABILITY ── */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <h2 className="font-serif text-3xl font-medium text-ink">When you&apos;re available</h2>
              <p className="text-sm text-ink-soft leading-relaxed">
                Tap to toggle blocks. You can refine this any time after activation.
              </p>

              <div className="grid gap-5 mt-6">
                <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr] gap-1 text-center overflow-x-auto">
                  <div />
                  {SLOTS.map((s) => (
                    <div key={s} className="meta py-2 text-ink-soft font-medium text-xs">
                      {s}
                    </div>
                  ))}
                  {DAYS.map((d) => (
                    <div key={d} className="contents">
                      <div className="meta py-2 text-left font-semibold text-ink-soft text-xs self-center">{d}</div>
                      {SLOTS.map((s) => {
                        const cellKey = `${d}-${s}`;
                        const isChecked = availability.includes(cellKey);
                        return (
                          <button
                            key={cellKey}
                            type="button"
                            onClick={() => toggleAvailability(d, s)}
                            className={`block h-10 rounded-input border transition-colors duration-150 ${
                              isChecked
                                ? "bg-primary border-primary"
                                : "bg-white/50 border-rule-strong hover:bg-surface"
                            }`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-2">
                  <Field label="Time zone">
                    <Select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                      <option value="ist">IST (GMT+5:30)</option>
                      <option value="utc">UTC</option>
                      <option value="pst">PST</option>
                    </Select>
                  </Field>
                  <Field label="Target hours per week" hint="2–40 hours">
                    <Input
                      type="number"
                      value={weeklyHours}
                      onChange={(e) => setWeeklyHours(e.target.value)}
                      min={2}
                      max={40}
                    />
                  </Field>
                </div>

                <Field label="Why do you want to mentor JEE aspirants?" required>
                  <Textarea
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    rows={4}
                    placeholder="Provide a short statement on what you hope to achieve and why you want to guide mentees (min. 20 characters)."
                    required
                  />
                </Field>

                <Field label="Prior teaching / mentoring experience (optional)">
                  <Textarea
                    value={priorExperience}
                    onChange={(e) => setPriorExperience(e.target.value)}
                    rows={3}
                    placeholder="Briefly describe any prior tutoring, teaching assistant roles, or mentorship experience."
                  />
                </Field>
              </div>

              <div className="flex justify-between gap-3 pt-6 border-t border-rule/50 mt-4">
                <button type="button" onClick={goBack} className="px-5 py-2.5 rounded-xl text-sm font-medium text-ink-soft border border-rule hover:bg-surface-elevated transition-colors">
                  ← Back
                </button>
                <Button type="submit" size="lg" disabled={state === "submitting"}>
                  {state === "submitting" ? "Submitting…" : "Activate my profile →"}
                </Button>
              </div>
            </form>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
