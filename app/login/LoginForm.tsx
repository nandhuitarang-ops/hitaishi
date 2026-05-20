"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Field, Input, Button } from "@/components/ui";
import { loginAction, type LoginState } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full">
      {pending ? "Signing in…" : "Sign in"}
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useFormState<LoginState, FormData>(loginAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field label="Email" required>
        <Input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@school.edu"
        />
      </Field>
      <Field label="Password" required>
        <Input
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />
      </Field>
      {state?.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}
      <SubmitButton />
    </form>
  );
}
