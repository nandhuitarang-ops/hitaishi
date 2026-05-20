import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "./LoginForm";
import { demoLoginAction } from "./actions";
import { getCurrentUser } from "@/lib/session";
import { Card, CardBody, Pill } from "@/components/ui";

const DEMOS = [
  { role: "student" as const, label: "Student", desc: "Arjun · JEE Adv 2027" },
  { role: "mentor" as const, label: "Mentor", desc: "Priya · IIT Bombay '24" },
  { role: "admin" as const, label: "Admin", desc: "Internal control" },
];

interface PageProps {
  searchParams?: { role?: string };
}

export default async function LoginPage({ searchParams }: PageProps) {
  const me = await getCurrentUser();
  if (me) redirect(`/${me.role}/dashboard`);

  const role = (searchParams?.role as "student" | "mentor" | "admin") ?? "student";
  const isAdmin = role === "admin";

  return (
    <main className="min-h-screen bg-surface grid lg:grid-cols-2">
      <aside className="hidden lg:flex flex-col justify-between bg-primary-deep text-primary-on px-12 py-10">
        <Link href="/" className="font-serif text-3xl">
          MentorIIT
        </Link>
        <div>
          <div className="font-mono text-xs uppercase tracking-widest opacity-70">
            S.01 · M.01 · A.01 — Sign in
          </div>
          <h1 className="font-serif text-4xl mt-4 leading-tight">
            Rooted in excellence.
          </h1>
          <p className="opacity-90 mt-4 max-w-[45ch]">
            Private mentorship from JEE-clearing IITians. Daily chat, weekly
            calls, hand-curated resources.
          </p>
        </div>
        <div className="font-mono text-xs opacity-60">
          AES-256 · IP allowlisting · 2FA on admin accounts
        </div>
      </aside>

      <section className="flex flex-col justify-center px-6 md:px-16 py-10">
        <div className="max-w-md w-full mx-auto">
          <div className="font-mono text-xs uppercase tracking-widest text-ink-faint">
            Sign in as
          </div>
          <div role="tablist" className="flex gap-2 mt-2 mb-8">
            {(["student", "mentor", "admin"] as const).map((r) => (
              <Link
                key={r}
                href={`/login?role=${r}`}
                role="tab"
                aria-selected={role === r}
                className={`px-4 py-2 rounded-pill text-sm capitalize ${
                  role === r
                    ? "bg-primary text-primary-on"
                    : "bg-surface-card border border-rule text-ink-soft hover:bg-surface-elevated"
                }`}
              >
                {r}
              </Link>
            ))}
          </div>

          <h2 className="font-serif text-3xl">
            {role === "admin"
              ? "Admin sign in."
              : role === "mentor"
                ? "Welcome back, mentor."
                : "Welcome back."}
          </h2>
          <p className="text-sm text-ink-soft mt-2">
            {role === "admin"
              ? "Email + password + 2FA. IP allowlisted access."
              : "Sign in with your email and password, or jump in as a demo."}
          </p>

          <Card className="mt-6">
            <CardBody>
              <LoginForm />
              {isAdmin && (
                <div className="mt-4 pt-4 border-t border-rule">
                  <div className="meta">2FA REQUIRED</div>
                  <input
                    placeholder="6-digit code"
                    inputMode="numeric"
                    maxLength={6}
                    className="mt-2 w-full rounded-input border border-rule-strong px-3 py-2 font-mono text-lg tracking-widest text-center focus:outline-none focus:border-primary"
                  />
                  <p className="text-xs text-ink-faint mt-2 font-mono">
                    Enter the 6-digit code from your registered TOTP device.
                  </p>
                </div>
              )}
            </CardBody>
          </Card>

          {!isAdmin && (
            <>
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-rule" />
                <span className="meta">or try a demo</span>
                <div className="flex-1 h-px bg-rule" />
              </div>

              <div className="grid gap-3">
                {DEMOS.map((d) => (
                  <form key={d.role} action={demoLoginAction}>
                    <input type="hidden" name="role" value={d.role} />
                    <button
                      type="submit"
                      className="w-full text-left bg-surface-card border border-rule rounded-card p-4 hover:bg-surface-elevated transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-serif text-lg">
                          Sign in as demo {d.label}
                        </div>
                        <Pill tone="neutral">{d.role}</Pill>
                      </div>
                      <div className="text-sm text-ink-soft mt-1">{d.desc}</div>
                    </button>
                  </form>
                ))}
              </div>
            </>
          )}

          {role === "mentor" && (
            <p className="text-sm text-ink-soft mt-6">
              New mentor?{" "}
              <Link href="/mentor/onboarding" className="text-primary-deep underline">
                Apply here →
              </Link>
            </p>
          )}

          <div className="meta text-center mt-8">
            <Link href="/" className="underline">
              ← Public landing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
