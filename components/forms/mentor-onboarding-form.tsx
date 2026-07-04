"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { mentorApplicationSchema } from "@/lib/leadSchemas";
import { FieldShell, TextInput, TextArea, Select, CheckGroup } from "./form-fields";

type Values = z.infer<typeof mentorApplicationSchema>;

const STEPS = [
  { label: "About you", fields: ["name", "email", "phone", "city", "gender"] },
  { label: "Credentials", fields: ["institute", "branch", "yearOfStudy", "jeeExam", "jeeYear", "jeeRank"] },
  {
    label: "Mentorship",
    fields: ["subjects", "preferredLevel", "languages", "weeklyHours", "preferredSlots"],
  },
  { label: "Your story", fields: ["motivation", "priorExperience"] },
  { label: "Review", fields: [] as string[] },
] as const;

const SUBJECTS = [
  { value: "Physics", label: "Physics" },
  { value: "Chemistry", label: "Chemistry" },
  { value: "Maths", label: "Maths" },
];
const LANGUAGES = [
  { value: "English", label: "English" },
  { value: "Hindi", label: "Hindi" },
  { value: "Telugu", label: "Telugu" },
  { value: "Tamil", label: "Tamil" },
  { value: "Other", label: "Other" },
];
const SLOTS = [
  { value: "Mornings", label: "Mornings" },
  { value: "Afternoons", label: "Afternoons" },
  { value: "Evenings", label: "Evenings" },
  { value: "Late night", label: "Late night" },
  { value: "Weekends", label: "Weekends" },
];
const HOURS = ["2–4", "5–8", "9–12", "12+"];
const YEARS = ["1st", "2nd", "3rd", "4th", "5th", "Graduated"];
const LEVELS = ["Class 11", "Class 12", "Droppers", "All"];

export function MentorOnboardingForm() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<"idle" | "submitting" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    control,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(mentorApplicationSchema),
    mode: "onTouched",
    defaultValues: {
      type: "mentor-application",
      subjects: [],
      languages: [],
      preferredSlots: [],
      jeeExam: "JEE Advanced",
      yearOfStudy: "1st",
      weeklyHours: "5–8",
      preferredLevel: "Class 12",
    },
  });

  const subjects = useWatch({ control, name: "subjects" }) ?? [];
  const languages = useWatch({ control, name: "languages" }) ?? [];
  const preferredSlots = useWatch({ control, name: "preferredSlots" }) ?? [];

  const next = async () => {
    const fields = STEPS[step].fields as (keyof Values)[];
    const valid = fields.length === 0 ? true : await trigger(fields);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = handleSubmit(async (data) => {
    setState("submitting");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? `Request failed (${res.status})`);
      }
      setState("ok");
    } catch (err) {
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  });

  if (state === "ok") {
    return (
      <div className="rounded-3xl border border-[var(--color-sky)]/40 bg-[var(--color-sky-soft)]/40 p-10 text-center md:p-14">
        <p className="text-3xl">✅</p>
        <h2 className="mt-4 font-serif text-3xl font-medium leading-tight text-[var(--color-fg)] md:text-4xl">
          Thank you for applying to Hitaishi!
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-fg-muted)] md:text-lg">
          Your application is in. Our team will review your details and reach out within 2–3
          working days to schedule a short onboarding call. Welcome to the start of something
          meaningful.
        </p>
        <p className="mt-8 font-serif text-lg italic text-[var(--color-fg-muted)]">
          &ldquo;You worked hard to get into IIT. Now let that hard work work for someone else too.&rdquo;
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--color-fg)] px-6 py-3 text-sm font-medium text-[var(--color-background)]"
        >
          Back to home →
        </Link>
      </div>
    );
  }

  const v = getValues();

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Stepper */}
      <ol className="flex flex-wrap gap-2 text-xs font-medium uppercase tracking-[0.12em]">
        {STEPS.map((s, i) => (
          <li
            key={s.label}
            className={`rounded-full border px-3 py-1 ${
              i === step
                ? "border-[var(--color-sky)] bg-[var(--color-sky-soft)] text-[var(--color-fg)]"
                : i < step
                ? "border-[var(--color-sky)]/30 bg-[var(--color-sky-soft)]/40 text-[var(--color-fg-muted)]"
                : "border-[var(--color-border)] text-[var(--color-fg-subtle)]"
            }`}
          >
            {i + 1}. {s.label}
          </li>
        ))}
      </ol>

      <input type="hidden" {...register("type")} value="mentor-application" />
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website (leave blank)
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("website")}
          />
        </label>
      </div>

      {step === 0 && (
        <div className="space-y-5">
          <FieldShell label="Full name" required error={errors.name?.message}>
            <TextInput autoComplete="name" {...register("name")} />
          </FieldShell>
          <div className="grid gap-5 md:grid-cols-2">
            <FieldShell label="Email" required error={errors.email?.message}>
              <TextInput type="email" autoComplete="email" {...register("email")} />
            </FieldShell>
            <FieldShell label="Phone / WhatsApp" required error={errors.phone?.message}>
              <TextInput type="tel" autoComplete="tel" {...register("phone")} />
            </FieldShell>
            <FieldShell label="City" required error={errors.city?.message}>
              <TextInput {...register("city")} />
            </FieldShell>
            <FieldShell label="Gender (optional)" error={errors.gender?.message}>
              <Select {...register("gender")}>
                <option value="">Prefer not to say</option>
                <option>Female</option>
                <option>Male</option>
                <option>Non-binary</option>
                <option>Other</option>
              </Select>
            </FieldShell>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <FieldShell label="Current institute (IIT / NIT / Other)" required error={errors.institute?.message}>
              <TextInput placeholder="e.g. IIT Hyderabad" {...register("institute")} />
            </FieldShell>
            <FieldShell label="Branch / Department" required error={errors.branch?.message}>
              <TextInput placeholder="e.g. Computer Science" {...register("branch")} />
            </FieldShell>
            <FieldShell label="Year of study" required error={errors.yearOfStudy?.message}>
              <Select {...register("yearOfStudy")}>
                {YEARS.map((y) => <option key={y}>{y}</option>)}
              </Select>
            </FieldShell>
            <FieldShell label="JEE exam appeared" required error={errors.jeeExam?.message}>
              <Select {...register("jeeExam")}>
                <option>JEE Main</option>
                <option>JEE Advanced</option>
                <option>Both</option>
              </Select>
            </FieldShell>
            <FieldShell label="JEE year" required error={errors.jeeYear?.message}>
              <TextInput placeholder="e.g. 2022" {...register("jeeYear")} />
            </FieldShell>
            <FieldShell label="JEE rank" required error={errors.jeeRank?.message}>
              <TextInput placeholder="Main and/or Advanced rank" {...register("jeeRank")} />
            </FieldShell>
          </div>
          <p className="text-xs text-[var(--color-fg-subtle)]">
            ID / proof of admission is requested by email after we review your application.
          </p>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <FieldShell label="Subjects you're strongest in" required error={errors.subjects?.message}>
            <CheckGroup
              options={SUBJECTS}
              value={subjects}
              onChange={(v) => setValue("subjects", v, { shouldValidate: true })}
              columns={3}
            />
          </FieldShell>
          <FieldShell label="Preferred student level" required error={errors.preferredLevel?.message}>
            <Select {...register("preferredLevel")}>
              {LEVELS.map((l) => <option key={l}>{l}</option>)}
            </Select>
          </FieldShell>
          <FieldShell label="Languages you can mentor in" required error={errors.languages?.message}>
            <CheckGroup
              options={LANGUAGES}
              value={languages}
              onChange={(v) => setValue("languages", v, { shouldValidate: true })}
              columns={3}
            />
          </FieldShell>
          <FieldShell label="Weekly hours you can commit" required error={errors.weeklyHours?.message}>
            <Select {...register("weeklyHours")}>
              {HOURS.map((h) => <option key={h}>{h}</option>)}
            </Select>
          </FieldShell>
          <FieldShell label="Preferred time slots" required error={errors.preferredSlots?.message}>
            <CheckGroup
              options={SLOTS}
              value={preferredSlots}
              onChange={(v) => setValue("preferredSlots", v, { shouldValidate: true })}
              columns={3}
            />
          </FieldShell>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <FieldShell label="Why do you want to mentor JEE aspirants?" required error={errors.motivation?.message}>
            <TextArea rows={6} placeholder="A few sentences — what you'd bring, what you'd want for your mentee." {...register("motivation")} />
          </FieldShell>
          <FieldShell label="Prior teaching / mentoring experience (optional)" error={errors.priorExperience?.message}>
            <TextArea rows={4} {...register("priorExperience")} />
          </FieldShell>
          <p className="text-xs text-[var(--color-fg-subtle)]">
            Resume / CV is requested by email after we review your application.
          </p>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-5">
          <h3 className="font-serif text-2xl font-medium text-[var(--color-fg)]">Review your application</h3>
          <dl className="grid gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-solid)] p-5 text-sm md:grid-cols-2 md:p-6">
            {[
              ["Name", v.name],
              ["Email", v.email],
              ["Phone", v.phone],
              ["City", v.city],
              ["Institute", v.institute],
              ["Branch", v.branch],
              ["Year of study", v.yearOfStudy],
              ["JEE exam", v.jeeExam],
              ["JEE year", v.jeeYear],
              ["JEE rank", v.jeeRank],
              ["Subjects", (v.subjects ?? []).join(", ")],
              ["Preferred level", v.preferredLevel],
              ["Languages", (v.languages ?? []).join(", ")],
              ["Weekly hours", v.weeklyHours],
              ["Preferred slots", (v.preferredSlots ?? []).join(", ")],
            ].map(([k, val]) => (
              <div key={String(k)} className="flex min-w-0 flex-col">
                <dt className="text-xs uppercase tracking-wide text-[var(--color-fg-subtle)]">{k}</dt>
                <dd className="break-words text-[var(--color-fg)]">{val || <span className="italic text-[var(--color-fg-subtle)]">—</span>}</dd>
              </div>
            ))}
          </dl>
          <p className="text-sm text-[var(--color-fg-muted)]">
            By submitting, you confirm the information above is accurate and consent to Hitaishi
            verifying your credentials and contacting you for onboarding.
          </p>
        </div>
      )}

      {state === "error" && errorMsg && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{errorMsg}</p>
      )}

      <div className="flex items-center justify-between gap-3 border-t border-[var(--color-border)] pt-6">
        {step > 0 ? (
          <button
            type="button"
            onClick={back}
            className="inline-flex min-h-[44px] items-center rounded-full border border-[var(--color-border)] px-5 py-3 text-sm font-medium text-[var(--color-fg)] hover:bg-[var(--color-surface-hover)]"
          >
            ← Back
          </button>
        ) : (
          <span />
        )}
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={next}
            className="inline-flex min-h-[44px] items-center rounded-full bg-[var(--color-sky)] px-6 py-3 text-sm font-medium text-white hover:bg-[var(--color-sky-hover)]"
          >
            Continue →
          </button>
        ) : (
          <button
            type="submit"
            disabled={state === "submitting"}
            className="inline-flex min-h-[44px] items-center rounded-full bg-[var(--color-sky)] px-6 py-3 text-sm font-medium text-white hover:bg-[var(--color-sky-hover)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {state === "submitting" ? "Submitting…" : "Submit Application →"}
          </button>
        )}
      </div>
    </form>
  );
}
