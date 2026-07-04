"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { institutionPartnerSchema } from "@/lib/leadSchemas";
import { FieldShell, TextInput, TextArea, Select } from "./form-fields";

type Values = z.infer<typeof institutionPartnerSchema>;

const STUDENT_BANDS = ["< 50", "50–200", "200–500", "500–1000", "1000+"];
const MODELS = [
  "Add-on service for our students",
  "Integrated into our fee structure",
  "Pilot batch / small cohort",
  "Not sure — let's discuss",
];

export function InstitutionLeadForm() {
  const [state, setState] = useState<"idle" | "submitting" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(institutionPartnerSchema),
    defaultValues: { type: "institution-partner" },
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
          Thank you — your partnership enquiry is in.
        </p>
        <p className="mt-3 text-base text-[var(--color-fg-muted)]">
          Our team will reach out within 2 working days to design a model that fits.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <input type="hidden" {...register("type")} value="institution-partner" />
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
        <FieldShell label="Institution name" required error={errors.institutionName?.message}>
          <TextInput placeholder="e.g. Bright Future JEE Academy" {...register("institutionName")} />
        </FieldShell>
        <FieldShell label="Contact person" required error={errors.contactPerson?.message}>
          <TextInput placeholder="Full name" autoComplete="name" {...register("contactPerson")} />
        </FieldShell>
        <FieldShell label="Your role" required error={errors.role?.message}>
          <TextInput placeholder="e.g. Director of Academics" {...register("role")} />
        </FieldShell>
        <FieldShell label="Email" required error={errors.email?.message}>
          <TextInput type="email" autoComplete="email" {...register("email")} />
        </FieldShell>
        <FieldShell label="Phone" required error={errors.phone?.message}>
          <TextInput type="tel" autoComplete="tel" {...register("phone")} />
        </FieldShell>
        <FieldShell label="City" required error={errors.city?.message}>
          <TextInput autoComplete="address-level2" {...register("city")} />
        </FieldShell>
        <FieldShell label="Number of students" required error={errors.studentCount?.message}>
          <Select {...register("studentCount")}>
            <option value="">Select…</option>
            {STUDENT_BANDS.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </Select>
        </FieldShell>
        <FieldShell label="Partnership model" required error={errors.partnershipModel?.message}>
          <Select {...register("partnershipModel")}>
            <option value="">Select…</option>
            {MODELS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </Select>
        </FieldShell>
      </div>
      <FieldShell label="Tell us more (optional)" error={errors.message?.message}>
        <TextArea rows={4} placeholder="Anything that would help us prepare for the conversation." {...register("message")} />
      </FieldShell>

      {state === "error" && errorMsg && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{errorMsg}</p>
      )}
      <button
        type="submit"
        disabled={state === "submitting"}
        className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[var(--color-sky)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-sky-hover)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {state === "submitting" ? "Sending…" : "Partner With Us →"}
      </button>
    </form>
  );
}
