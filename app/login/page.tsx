import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "./LoginForm";
import { LoginIllustration } from "./LoginIllustration";
import { RoleDecorations } from "./RoleDecorations";
import { getCurrentUser } from "@/lib/session";
import { Card, CardBody } from "@/components/ui";

interface PageProps {
  searchParams?: any;
}

const ROLE_CONFIG: Record<string, { title: string; subtitle: string; accent: string; socialProviders: string[] }> = {
  student: {
    title: "Student Login",
    subtitle: "Hey, Enter your details to sign in and connect with your IITian mentor.",
    accent: "from-primary to-emerald-400",
    socialProviders: ["google", "apple", "whatsapp"],
  },
  mentor: {
    title: "Mentor Login",
    subtitle: "Welcome back, mentor. Sign in to manage your students and sessions.",
    accent: "from-blue-500 to-violet-500",
    socialProviders: ["google", "apple"],
  },
  admin: {
    title: "Admin Login",
    subtitle: "Restricted access. Sign in with your admin credentials.",
    accent: "from-slate-600 to-slate-800",
    socialProviders: [],
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

              {/* Social Logins */}
              {config.socialProviders.length > 0 && (
                <div className="mt-6 text-center">
                  <div className="flex items-center mb-4">
                    <div className="flex-grow border-t border-rule" />
                    <span className="px-3 font-mono text-[10px] uppercase text-ink-faint">Or Sign in with</span>
                    <div className="flex-grow border-t border-rule" />
                  </div>

                  <div className={`grid gap-2 ${config.socialProviders.length === 3 ? "grid-cols-3" : config.socialProviders.length === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
                    {config.socialProviders.includes("google") && (
                      <button
                        type="button"
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 border border-rule-strong bg-white hover:bg-surface-elevated rounded-xl text-xs font-medium text-ink transition-all hover:shadow-soft"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        <span>Google</span>
                      </button>
                    )}
                    {config.socialProviders.includes("apple") && (
                      <button
                        type="button"
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 border border-rule-strong bg-white hover:bg-surface-elevated rounded-xl text-xs font-medium text-ink transition-all hover:shadow-soft"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.49-.62.71-1.16 1.85-1.01 2.96 1.12.09 2.27-.58 2.94-1.39" />
                        </svg>
                        <span>Apple ID</span>
                      </button>
                    )}
                    {config.socialProviders.includes("whatsapp") && (
                      <button
                        type="button"
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 border border-rule-strong bg-white hover:bg-surface-elevated rounded-xl text-xs font-medium text-ink transition-all hover:shadow-soft"
                      >
                        <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        <span>WhatsApp</span>
                      </button>
                    )}
                  </div>
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
