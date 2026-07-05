"use client";

import { useState, FormEvent, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardBody, Button } from "@/components/ui";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Missing reset token.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login?role=mentor");
      }, 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-btn text-xs mb-4">
          {error}
        </div>
      )}

      {success ? (
        <div className="text-center py-6 space-y-3">
          <div className="text-4xl">🎉</div>
          <h3 className="font-semibold text-[var(--color-primary-deep)]">Password Set Successfully!</h3>
          <p className="text-xs text-ink-soft">
            Your new password is saved. Redirecting you to the login page...
          </p>
        </div>
      ) : !token ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-btn text-xs text-center py-6">
          <strong>Invalid Request:</strong> Missing secure password reset token. Please check the link in your email or contact your administrator.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-ink-soft uppercase tracking-wider mb-1">
              New Password
            </label>
            <input
              type="password"
              required
              disabled={loading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-btn border border-rule px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="At least 8 characters"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-ink-soft uppercase tracking-wider mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              disabled={loading}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-btn border border-rule px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Confirm your password"
            />
          </div>

          <Button
            type="submit"
            loading={loading}
            variant="primary"
            className="w-full py-2.5 font-semibold text-sm shadow-soft mt-6"
          >
            Save & Log In
          </Button>
        </form>
      )}
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-surface text-ink relative flex flex-col justify-between overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-400/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Header */}
      <header className="relative z-10 w-full px-6 md:px-12 py-5 flex items-center justify-between bg-transparent">
        <div className="flex flex-col">
          <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-ink">
            Hitaishii
          </Link>
          <span className="text-[10px] font-mono text-ink-faint mt-0.5">hello@hitaishii.com</span>
        </div>
      </header>

      {/* Main Form Content */}
      <div className="relative z-10 max-w-md w-full mx-auto px-6 py-8 flex-grow flex items-center justify-center">
        <Card className="backdrop-blur-xl bg-white/80 border border-white/60 shadow-lift rounded-3xl relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-1.5 before:bg-gradient-to-r before:from-primary before:to-amber-400 w-full">
          <CardBody className="p-8 md:p-10">
            <div className="text-center mb-6">
              <h2 className="font-serif text-2xl font-semibold text-ink">
                Set Secure Password
              </h2>
              <p className="text-xs text-ink-soft mt-2">
                Create a new password to access your Hitaishii mentor account.
              </p>
            </div>

            <Suspense fallback={<div className="text-center py-6 text-xs text-ink-soft">Loading password reset form...</div>}>
              <ResetPasswordForm />
            </Suspense>
          </CardBody>
        </Card>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full py-5 text-center text-xs text-ink-faint">
        © 2026 Hitaishii. All rights reserved.
      </footer>
    </main>
  );
}
