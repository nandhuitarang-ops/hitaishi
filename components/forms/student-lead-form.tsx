"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { studentInquirySchema } from "@/lib/leadSchemas";
import { FieldShell, TextInput, Select } from "./form-fields";

type Values = z.infer<typeof studentInquirySchema>;

const CLASSES = ["Class 11", "Class 12", "Dropper / Repeater", "Other"];

export function StudentLeadForm() {
  const [state, setState] = useState<"idle" | "submitting" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(studentInquirySchema),
    defaultValues: { type: "student-inquiry", currentClass: "Class 12" },
  });

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
      reset();
    } catch (err) {
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  });

  if (state === "ok") {
    return (
      <div className="rounded-2xl border border-[var(--color-sky)]/40 bg-[var(--color-sky-soft)]/40 p-8 text-center">
        <p className="font-serif text-2xl font-medium text-[var(--color-fg)]">
          Your mentor request is in.
        </p>
        <p className="mt-3 text-base text-[var(--color-fg-muted)]">
          We&apos;ll match you with the right IITian or top-ranker and reach out within 48 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <input type="hidden" {...register("type")} value="student-inquiry" />
      {/* Honeypot: visually offscreen + hidden from a11y. Bots fill all inputs and get caught. */}
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
      <div className="grid gap-5 md:grid-cols-2">
        <FieldShell label="Full name" required error={errors.name?.message}>
          <TextInput placeholder="Anjali Sharma" autoComplete="name" {...register("name")} />
        </FieldShell>
        <FieldShell label="Phone / WhatsApp" required error={errors.phone?.message}>
          <TextInput type="tel" placeholder="+91" autoComplete="tel" {...register("phone")} />
        </FieldShell>
      </div>
      <FieldShell label="Email" required error={errors.email?.message}>
        <TextInput type="email" placeholder="you@example.com" autoComplete="email" {...register("email")} />
      </FieldShell>
      <div className="grid gap-5 md:grid-cols-2">
        <FieldShell label="Current class" required error={errors.currentClass?.message}>
          <Select {...register("currentClass")}>
            {CLASSES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
        </FieldShell>
        <FieldShell label="City" required error={errors.city?.message}>
          <TextInput placeholder="Hyderabad" autoComplete="address-level2" {...register("city")} />
        </FieldShell>
      </div>
      <FieldShell label="Coaching institute (optional)" error={errors.coachingInstitute?.message}>
        <TextInput placeholder="e.g. FIITJEE, Allen, Aakash" {...register("coachingInstitute")} />
      </FieldShell>

      {state === "error" && errorMsg && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{errorMsg}</p>
      )}
      <button
        type="submit"
        disabled={state === "submitting"}
        className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[var(--color-sky)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-sky-hover)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {state === "submitting" ? "Sending…" : "Get Your Mentor →"}
      </button>
    </form>
  );
}
