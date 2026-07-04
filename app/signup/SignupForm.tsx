"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  studentSignupSchema,
  CLASSES,
  BOARDS,
  GENDERS,
  TARGET_EXAMS,
  TARGET_YEARS,
  SUBJECTS,
  STRENGTH_LEVELS,
  type StudentSignupValues,
  type SubjectFocus,
} from "@/lib/signupSchema";
import { Field, Input, Select, Textarea, Button, Card, CardBody } from "@/components/ui";

const SUBJECT_LABELS: Record<string, string> = {
  physics: "Physics",
  chemistry: "Chemistry",
  math: "Math",
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-xs font-medium uppercase tracking-wider text-ink-faint mt-8 mb-3 first:mt-0">
      {children}
    </div>
  );
}

export function SignupForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPw, setShowPw] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<StudentSignupValues>({
    resolver: zodResolver(studentSignupSchema),
    defaultValues: {
      type: "student-signup",
      currentClass: "Class 12",
      board: "CBSE",
      targetExam: "jee_main",
      targetYear: "2026",
      subjectsFocus: SUBJECTS.map((s) => ({ subject: s, level: "ok" })) as SubjectFocus[],
    },
  });

  const subjectsFocus = useWatch({ control, name: "subjectsFocus" }) ?? [];

  const setSubjectLevel = (subject: string, level: string) => {
    const next = subjectsFocus.map((sf) =>
      sf.subject === subject ? { ...sf, level: level as SubjectFocus["level"] } : sf,
    );
    setValue("subjectsFocus", next, { shouldValidate: true });
  };

  const onSubmit = handleSubmit(async (data) => {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? `Request failed (${res.status})`);
      }
      reset();
      router.push("/student-onboarding");
    } catch (err) {
      setSubmitting(false);
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <input type="hidden" {...register("type")} value="student-signup" />
      {/* Honeypot: visually offscreen + hidden from a11y. Bots fill all inputs. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website (leave blank)
          <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
        </label>
      </div>

      <Card>
        <CardBody className="flex flex-col gap-4 p-6">
          <SectionTitle>Account</SectionTitle>
          <Field label="Email" required error={errors.email?.message}>
            <Input type="email" autoComplete="email" placeholder="you@example.com" {...register("email")} />
          </Field>
          <Field label="Password" required error={errors.password?.message} hint="At least 8 characters, one letter and one number.">
            <div className="relative">
              <Input
                type={showPw ? "text" : "password"}
                autoComplete="new-password"
                className="pr-10"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPw((p) => !p)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-ink-faint hover:text-ink hover:bg-surface-elevated transition-colors"
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
          </Field>
          <Field label="Confirm password" required error={errors.confirmPassword?.message}>
            <Input type={showPw ? "text" : "password"} autoComplete="new-password" {...register("confirmPassword")} />
          </Field>

          <SectionTitle>About you</SectionTitle>
          <Field label="Full name" required error={errors.fullName?.message}>
            <Input autoComplete="name" placeholder="Anjali Sharma" {...register("fullName")} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Date of birth" required error={errors.dateOfBirth?.message}>
              <Input type="date" {...register("dateOfBirth")} />
            </Field>
            <Field label="Gender" error={errors.gender?.message}>
              <Select {...register("gender")}>
                <option value="">Select…</option>
                {GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <SectionTitle>Contact</SectionTitle>
          <Field label="Phone / WhatsApp" required error={errors.phone?.message}>
            <Input type="tel" autoComplete="tel" placeholder="+91" {...register("phone")} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Parent / guardian name" error={errors.parentName?.message}>
              <Input autoComplete="name" {...register("parentName")} />
            </Field>
            <Field label="Parent / guardian phone" error={errors.parentPhone?.message}>
              <Input type="tel" autoComplete="tel" {...register("parentPhone")} />
            </Field>
          </div>

          <SectionTitle>Address</SectionTitle>
          <Field label="Address line 1" required error={errors.addressLine1?.message}>
            <Input autoComplete="address-line1" placeholder="House no, street, area" {...register("addressLine1")} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="City" required error={errors.city?.message}>
              <Input autoComplete="address-level2" {...register("city")} />
            </Field>
            <Field label="State" required error={errors.state?.message}>
              <Input autoComplete="address-level1" {...register("state")} />
            </Field>
          </div>
          <Field label="Pincode" required error={errors.pincode?.message}>
            <Input inputMode="numeric" maxLength={6} placeholder="500001" className="max-w-[200px]" {...register("pincode")} />
          </Field>

          <SectionTitle>Academics</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Current class" required error={errors.currentClass?.message}>
              <Select {...register("currentClass")}>
                {CLASSES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </Select>
            </Field>
            <Field label="Board" required error={errors.board?.message}>
              <Select {...register("board")}>
                {BOARDS.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </Select>
            </Field>
          </div>
          <Field label="Coaching institute / school" error={errors.coachingInstitute?.message} hint="Where you currently study (e.g. FIITJEE, Allen, Aakash).">
            <Input {...register("coachingInstitute")} />
          </Field>

          <SectionTitle>Aim</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Target exam" required error={errors.targetExam?.message}>
              <Select {...register("targetExam")}>
                {TARGET_EXAMS.map((e) => (
                  <option key={e} value={e}>
                    {e === "jee_main" ? "JEE Main" : e === "jee_advanced" ? "JEE Advanced" : "Both"}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Attempt year" required error={errors.targetYear?.message}>
              <Select {...register("targetYear")}>
                {TARGET_YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <Field label="Target AIR rank" error={errors.targetRank?.message} hint="Optional, 1–50000.">
            <Input type="number" min={1} max={50000} placeholder="500" className="max-w-[200px]" {...register("targetRank")} />
          </Field>
          <Field label="Anything else about your goal?" error={errors.aimText?.message} hint="Optional — tell us about your aim in your own words.">
            <Textarea rows={3} maxLength={2000} {...register("aimText")} />
          </Field>

          <SectionTitle>Subject focus</SectionTitle>
          <p className="text-xs text-ink-faint -mt-1">
            Rate yourself by subject — this helps match you with the right mentor.
          </p>
          {errors.subjectsFocus && (
            <p className="text-xs text-danger">{errors.subjectsFocus.message}</p>
          )}
          <div className="flex flex-col gap-3">
            {SUBJECTS.map((s) => {
              const current = subjectsFocus.find((sf) => sf.subject === s)?.level ?? "ok";
              return (
                <div key={s} className="border border-rule rounded-input p-4 bg-surface-card">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="font-serif text-base">{SUBJECT_LABELS[s]}</div>
                    <div role="radiogroup" aria-label={`${SUBJECT_LABELS[s]} strength`} className="flex gap-2">
                      {STRENGTH_LEVELS.map((lvl) => (
                        <label key={lvl} className="cursor-pointer">
                          <input
                            type="radio"
                            name={`level-${s}`}
                            value={lvl}
                            checked={current === lvl}
                            onChange={() => setSubjectLevel(s, lvl)}
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
              );
            })}
          </div>

          {serverError && (
            <p role="alert" className="text-sm text-danger mt-2">
              {serverError}
            </p>
          )}

          <div className="mt-4">
            <Button type="submit" size="lg" disabled={submitting} className="w-full">
              {submitting ? "Creating account\u2026" : "Create account →"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </form>
  );
}
