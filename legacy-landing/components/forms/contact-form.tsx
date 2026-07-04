"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generalInquirySchema } from "@/lib/leadSchemas";
import { FieldShell, TextInput, TextArea, Select } from "./form-fields";

type Values = z.infer<typeof generalInquirySchema>;

export function ContactForm() {
  const [state, setState] = useState<"idle" | "submitting" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(generalInquirySchema),
    defaultValues: { type: "general", role: "Student" },
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
      reset({ type: "general", role: "Student", name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  });

  if (state === "ok") {
    return (
      <div className="rounded-2xl border border-[var(--color-sky)]/40 bg-[var(--color-sky-soft)]/40 p-8 text-center">
        <p className="font-serif text-2xl font-medium text-[var(--color-fg)]">
          Thank you. We&apos;ll be in touch within 2 working days.
        </p>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="mt-6 text-sm font-medium text-[var(--color-sky-hover)] underline-offset-4 hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <input type="hidden" {...register("type")} value="general" />
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
      <FieldShell label="Your name" required error={errors.name?.message}>
        <TextInput placeholder="Anjali Sharma" autoComplete="name" {...register("name")} />
      </FieldShell>
      <FieldShell label="Email" required error={errors.email?.message}>
        <TextInput type="email" placeholder="you@example.com" autoComplete="email" {...register("email")} />
      </FieldShell>
      <div className="grid gap-5 md:grid-cols-2">
        <FieldShell label="Phone (optional)" error={errors.phone?.message}>
          <TextInput type="tel" placeholder="+91" autoComplete="tel" {...register("phone")} />
        </FieldShell>
        <FieldShell label="I am a" required error={errors.role?.message}>
          <Select {...register("role")}>
            <option>Student</option>
            <option>Mentor</option>
            <option>Institution</option>
            <option>Other</option>
          </Select>
        </FieldShell>
      </div>
      <FieldShell label="Message" required error={errors.message?.message}>
        <TextArea placeholder="Tell us what you need." rows={5} {...register("message")} />
      </FieldShell>

      {state === "error" && errorMsg && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[var(--color-sky)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-sky-hover)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {state === "submitting" ? "Sending…" : "Send message →"}
      </button>
    </form>
  );
}
