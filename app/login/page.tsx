import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "./LoginForm";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { LoginIllustration } from "./LoginIllustration";
import { RoleDecorations } from "./RoleDecorations";
import { getCurrentUser } from "@/lib/session";
import { Card, CardBody } from "@/components/ui";

interface PageProps {
  searchParams?: any;
}

const ROLE_CONFIG: Record<string, { title: string; subtitle: string; accent: string; showGoogle: boolean }> = {
  student: {
    title: "Student Login",
    subtitle: "Hey, Enter your details to sign in and connect with your IITian mentor.",
    accent: "from-primary to-emerald-400",
    showGoogle: true,
  },
  mentor: {
    title: "Mentor Login",
    subtitle: "Welcome back, mentor. Sign in to manage your students and sessions.",
    accent: "from-blue-500 to-violet-500",
    showGoogle: true,
  },
  admin: {
    title: "Admin Login",
    subtitle: "Restricted access. Sign in with your admin credentials.",
    accent: "from-slate-600 to-slate-800",
    showGoogle: false,
  },
};

export default async function LoginPage({ searchParams }: PageProps) {
  let me = null;
  try {
    me = await getCurrentUser();
  } catch {
    // ignore — let the login form render
  }
  if (me) redirect(`/${me.role}/dashboard`);

  const resolved = await searchParams;
  const role = (resolved?.role as "student" | "mentor" | "admin") ?? "student";
  const config = ROLE_CONFIG[role];

  return (
    <main className="min-h-screen bg-surface text-ink relative flex flex-col justify-between overflow-hidden">
      {/* ── ROLE-SPECIFIC BACKGROUND DECORATIONS ── */}
      <RoleDecorations role={role} />

      {/* ── HEADER ── */}
      <header className="relative z-10 w-full px-6 md:px-12 py-5 flex items-center justify-between bg-transparent">
        <div className="flex flex-col">
          <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-ink">
            Hitaishi
          </Link>
          <span className="text-[10px] font-mono text-ink-faint mt-0.5">hello@hitaishi.in →</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/signup" className="text-sm font-medium text-ink-soft hover:text-primary transition-colors">
            Sign up
          </Link>
          <Link
            href="/student-onboarding"
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-white shadow-soft hover:bg-primary-hover hover:scale-[1.02] transition-all"
          >
            Request Demo
          </Link>
        </div>
      </header>

      {/* ── CENTERED LOGIN CARD ── */}
      <div className="relative z-10 max-w-5xl w-full mx-auto px-6 py-8 flex-grow flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* LEFT: Lottie Illustration (hidden on small screens) */}
          <div className="hidden lg:flex flex-col items-center justify-center">
            <LoginIllustration role={role} />
            <div className="mt-6 text-center max-w-xs">
              <h3 className="font-serif text-lg font-medium text-ink">
                {role === "student"
                  ? "Your JEE journey starts here"
                  : role === "mentor"
                    ? "Empower the next generation"
                    : "Full platform control"}
              </h3>
              <p className="text-xs text-ink-soft mt-2 leading-relaxed">
                {role === "student"
                  ? "Get matched with an IITian mentor who understands your unique preparation needs."
                  : role === "mentor"
                    ? "Guide aspiring IITians with personalised strategies and real-time session tools."
                    : "Monitor sessions, manage users, and review analytics across the entire platform."}
              </p>
            </div>
          </div>

          {/* RIGHT: Login Card */}
          <Card className={`backdrop-blur-xl bg-white/80 border border-white/60 shadow-lift rounded-3xl relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-1.5 before:bg-gradient-to-r before:${config.accent}`}>
            <CardBody className="p-8 md:p-10">
              {/* Role Tabs */}
              <div className="flex gap-1.5 p-1 bg-surface-elevated/70 border border-rule rounded-pill w-full mb-6">
                {(["student", "mentor", "admin"] as const).map((r) => (
                  <Link
                    key={r}
                    href={`/login?role=${r}`}
                    className={`flex-1 py-1.5 rounded-pill text-xs font-mono text-center uppercase tracking-wider transition-all ${
                      role === r
                        ? "bg-primary text-white shadow-sm"
                        : "text-ink-soft hover:text-ink hover:bg-surface-solid/55"
                    }`}
                  >
                    {r}
                  </Link>
                ))}
              </div>

              {/* Title */}
              <div className="text-center mb-6">
                <h2 className="font-serif text-3xl font-semibold text-ink">
                  {config.title}
                </h2>
                <p className="text-sm text-ink-soft mt-2 leading-relaxed">
                  {config.subtitle}
                </p>
              </div>

              {/* Login Form */}
              <LoginForm />

              {/* Google Sign In */}
              {config.showGoogle && (
                <div className="mt-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-grow border-t border-rule" />
                    <span className="px-3 font-mono text-[10px] uppercase text-ink-faint">Or continue with</span>
                    <div className="flex-grow border-t border-rule" />
                  </div>
                  <GoogleSignInButton />
                </div>
              )}

              {/* Footer link */}
              <div className="mt-8 text-center text-xs text-ink-soft">
                Don&apos;t have an account?{" "}
                <Link href={role === "mentor" ? "/become-a-mentor" : "/signup"} className="text-primary font-medium hover:underline">
                  {role === "admin" ? "Contact admin" : "Request Now"}
                </Link>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 w-full text-center py-6 border-t border-rule bg-transparent text-xs text-ink-faint">
        Copyright @hitaishi 2026 |{" "}
        <Link href="/privacy" className="hover:underline">
          Privacy Policy
        </Link>
      </footer>
    </main>
  );
}
