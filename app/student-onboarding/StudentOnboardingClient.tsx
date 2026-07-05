"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Field, Input, Select, Button } from "@/components/ui";
import { getAuthClient } from "@/lib/supabase/auth-client";

/* ────────────────────── STEP CONFIG ────────────────────── */

const STEPS = [
  {
    key: "account",
    label: "Account",
    emoji: "👤",
    headline: "Let\u2019s get you started",
    subline: "Create your account or sign in to save progress and get matched with an IITian mentor.",
    color: "#F4CA3E",
  },
  {
    key: "goals",
    label: "Goals",
    emoji: "🎯",
    headline: "Set your target",
    subline: "Honest targets help us build a realistic, milestone-based roadmap for your JEE prep.",
    color: "#2563eb",
  },
  {
    key: "subjects",
    label: "Subjects",
    emoji: "📚",
    headline: "Know your strengths",
    subline: "Rate yourself per subject — this directly shapes the mentor we match you with.",
    color: "#7c3aed",
  },
  {
    key: "ready",
    label: "Launch",
    emoji: "🚀",
    headline: "Almost there!",
    subline: "Tell us your biggest challenges and we\u2019ll prepare your mentor for day one.",
    color: "#f59e0b",
  },
];

const SUBJECTS_DATA = [
  { key: "physics", label: "Physics",   emoji: "⚡", desc: "Mechanics, Optics, Electrodynamics" },
  { key: "chem",    label: "Chemistry", emoji: "🧪", desc: "Organic, Inorganic, Physical" },
  { key: "math",    label: "Maths",     emoji: "📐", desc: "Calculus, Algebra, Coordinate Geometry" },
];

const LEVELS = ["Strong", "OK", "Weak"] as const;

const CHALLENGES = [
  { key: "time",       label: "Time Management",    emoji: "⏱️" },
  { key: "anxiety",    label: "Exam Anxiety",        emoji: "😰" },
  { key: "concept",    label: "Concept Clarity",     emoji: "💡" },
  { key: "motivation", label: "Staying Motivated",   emoji: "🔥" },
  { key: "revision",   label: "Revision Strategy",   emoji: "🔄" },
  { key: "silly",      label: "Silly Mistakes",      emoji: "✏️" },
];

/* ────────────────────── MAIN COMPONENT ────────────────────── */

interface Props {
  currentUser: any;
}

export function StudentOnboardingClient({ currentUser }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [user, setUser] = useState(currentUser);
  const [authMode, setAuthMode] = useState<"signup" | "login">("signup");

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState(currentUser?.fullName ?? "");
  const [currentClass, setCurrentClass] = useState("");
  const [board, setBoard] = useState("CBSE");
  const [city, setCity] = useState("");

  const [college, setCollege] = useState("");
  const [year, setYear] = useState("2026");
  const [targetRank, setTargetRank] = useState("");
  const [hours, setHours] = useState("");

  const [subjectLevels, setSubjectLevels] = useState<Record<string, string>>({
    physics: "", chem: "", math: "",
  });
  const [mockScore, setMockScore] = useState("");

  const [coaching, setCoaching] = useState("");
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const goForward = useCallback(() => setStep((s) => Math.min(3, s + 1)), []);
  const goBack = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const cleanOrigin = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "");
      if (cleanOrigin(event.origin) !== cleanOrigin(window.location.origin)) return;

      if (event.data?.type === "GOOGLE_AUTH_SUCCESS") {
        const { user: authedUser } = event.data;
        setUser(authedUser);
        setFullName(authedUser?.fullName || "");
        goForward();
        setLoading(false);
      } else if (event.data?.type === "GOOGLE_AUTH_FAILURE") {
        setError(event.data.error || "Google sign-in failed.");
        setLoading(false);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [goForward]);

  // Detect when the popup hangs (e.g. Supabase redirected to localhost instead of production)
  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => {
      setLoading(false);
      setError(
        "Google sign-in timed out. If the popup redirected to localhost, your Supabase Redirect URL is not configured for this domain. " +
        "Go to Supabase Dashboard → Authentication → URL Configuration and add: " +
        window.location.origin + "/auth/callback"
      );
    }, 120000); // 2 minutes
    return () => clearTimeout(timer);
  }, [loading]);

  const toggleChallenge = (key: string) => {
    setSelectedChallenges((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  /* ── AUTH ── */
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (user) { goForward(); return; }
    setLoading(true);
    try {
      if (authMode === "signup") {
        if (!email || !password || !fullName) throw new Error("All fields required.");
        const res = await fetch("/api/onboarding/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, fullName }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Signup failed");
        setUser({ email, fullName });
        goForward();
      } else {
        if (!email || !password) throw new Error("Email and password required.");
        const res = await fetch("/api/onboarding/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Login failed");
        setUser({ email });
        goForward();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const client = getAuthClient();
      const redirectTo = `${window.location.origin}/auth/callback`;
      const { data, error: oauthError } = await client.auth.signInWithOAuth({
        provider: "google",
        options: {
          skipBrowserRedirect: true,
          redirectTo,
        },
      });

      if (oauthError) throw oauthError;
      let oauthUrl = data.url;
      if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname.includes("127.0.0.1"))) {
        oauthUrl = `${window.location.origin}/auth/google-sim`;
      }

      const width = 500;
      const height = 650;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const popup = window.open(
        oauthUrl,
        "GoogleSignIn",
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,status=yes`
      );

      if (!popup) {
        throw new Error("Popup blocked by browser. Please allow popups for this website to proceed.");
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/student/dashboard");
  };

  const current = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-surface text-ink flex flex-col">
      {/* ═══════ STICKY HEADER + PROGRESS ═══════ */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-rule/40">
        <div className="max-w-3xl mx-auto px-5 py-3 flex items-center justify-between">
          <Link href="/" className="text-xs font-medium text-ink-soft hover:text-ink transition-colors flex items-center gap-1">
            ← Back to site
          </Link>
          <div className="flex items-center gap-4">
            {STEPS.map((s, i) => (
              <button
                key={s.key}
                onClick={() => i < step && setStep(i)}
                disabled={i > step}
                className={`hidden sm:flex items-center gap-1.5 text-xs font-medium transition-all ${
                  i === step
                    ? "text-ink"
                    : i < step
                      ? "text-primary cursor-pointer hover:underline"
                      : "text-ink-faint/40 cursor-not-allowed"
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                  i === step
                    ? "text-white shadow-sm"
                    : i < step
                      ? "bg-primary/15 text-primary"
                      : "bg-surface-elevated text-ink-faint/40"
                }`}
                  style={i === step ? { backgroundColor: current.color } : undefined}
                >
                  {i < step ? "✓" : i + 1}
                </span>
                <span className="hidden md:inline">{s.label}</span>
              </button>
            ))}
            <span className="sm:hidden text-xs font-mono text-ink-faint">{step + 1}/{STEPS.length}</span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-[3px] bg-surface-elevated">
          <div
            className="h-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%`, backgroundColor: current.color }}
          />
        </div>
      </header>

      {/* ═══════ HERO SECTION ═══════ */}
      <section
        className="relative overflow-hidden transition-all duration-500"
        style={{ background: `linear-gradient(135deg, ${current.color}11 0%, ${current.color}05 100%)` }}
      >
        {/* Decorative circles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div
            className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-[0.07] transition-colors duration-700"
            style={{ backgroundColor: current.color }}
          />
          <div
            className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-[0.05] transition-colors duration-700"
            style={{ backgroundColor: current.color }}
          />
        </div>

        <div className="relative max-w-3xl mx-auto px-5 pt-12 pb-10 md:pt-16 md:pb-14 text-center">
          {/* Animated emoji */}
          <div
            className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-3xl text-3xl md:text-4xl mb-5 shadow-lg transition-colors duration-500"
            style={{ backgroundColor: `${current.color}15`, boxShadow: `0 8px 30px ${current.color}15` }}
          >
            {current.emoji}
          </div>

          <h1 className="font-serif text-3xl md:text-5xl font-semibold text-ink leading-tight tracking-tight">
            {current.headline}
          </h1>
          <p className="text-ink-soft text-sm md:text-base mt-3 max-w-lg mx-auto leading-relaxed">
            {current.subline}
          </p>
        </div>
      </section>

      {/* ═══════ FORM SECTION ═══════ */}
      <section className="flex-1 -mt-1">
        <div className="max-w-xl mx-auto px-5 py-10 md:py-14">
          {/* Error banner */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 text-red-700 border border-red-200 text-sm flex items-start gap-2.5">
              <span className="text-lg leading-none">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* ── STEP 0: ACCOUNT ── */}
          {step === 0 && (
            <div className="space-y-5">
              {!user && (
                <>
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white border-2 border-rule hover:border-primary/30 rounded-2xl text-sm font-medium text-ink transition-all hover:shadow-soft active:scale-[0.99]"
                  >
                    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-rule" />
                    <span className="text-[10px] font-mono uppercase text-ink-faint tracking-widest">or use email</span>
                    <div className="flex-1 h-px bg-rule" />
                  </div>

                  <div className="flex p-1 bg-surface-elevated/80 border border-rule rounded-2xl">
                    {(["signup", "login"] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setAuthMode(mode)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                          authMode === mode
                            ? "bg-white text-ink shadow-sm"
                            : "text-ink-soft hover:text-ink"
                        }`}
                      >
                        {mode === "signup" ? "Create Account" : "Sign In"}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {!user && (
                  <>
                    <Field label="Email address" required>
                      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your.email@school.com" required />
                    </Field>
                    <Field label="Password" required>
                      <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters" required />
                    </Field>
                  </>
                )}
                {(authMode === "signup" || user) && (
                  <>
                    <Field label="Full name" required>
                      <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Arjun Srinivasan" required />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Class" required>
                        <Select value={currentClass} onChange={(e) => setCurrentClass(e.target.value)} required>
                          <option value="">Select…</option>
                          <option value="11">Class XI</option>
                          <option value="12">Class XII</option>
                          <option value="dropper">Dropper</option>
                        </Select>
                      </Field>
                      <Field label="Board">
                        <Select value={board} onChange={(e) => setBoard(e.target.value)}>
                          <option>CBSE</option>
                          <option>ICSE</option>
                          <option>State Board</option>
                        </Select>
                      </Field>
                    </div>
                    <Field label="City">
                      <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Kota, Hyderabad…" />
                    </Field>
                  </>
                )}
                <Button type="submit" size="lg" disabled={loading} className="w-full mt-2">
                  {loading ? "Processing…" : "Continue →"}
                </Button>
              </form>
            </div>
          )}

          {/* ── STEP 1: GOALS ── */}
          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); goForward(); }} className="space-y-5">
              <Field label="Dream college">
                <div className="grid grid-cols-3 gap-2">
                  {["IIT Bombay", "IIT Delhi", "IIT Madras", "IIT Kanpur", "IIT KGP", "Any IIT"].map((c) => (
                    <button
                      key={c} type="button"
                      onClick={() => setCollege(c)}
                      className={`py-3 px-2 rounded-2xl text-xs font-medium border-2 transition-all ${
                        college === c
                          ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                          : "border-rule bg-white text-ink-soft hover:border-blue-200"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="JEE attempt year">
                  <Select value={year} onChange={(e) => setYear(e.target.value)}>
                    <option>2026</option><option>2027</option><option>2028</option>
                  </Select>
                </Field>
                <Field label="Target AIR" hint="Be honest!">
                  <Input type="number" value={targetRank} onChange={(e) => setTargetRank(e.target.value)} placeholder="e.g. 500" />
                </Field>
              </div>

              <Field label="Daily study hours">
                <div className="grid grid-cols-4 gap-2">
                  {["4–6h", "6–8h", "8–10h", "10h+"].map((h) => (
                    <button
                      key={h} type="button"
                      onClick={() => setHours(h)}
                      className={`py-3 rounded-2xl text-xs font-medium border-2 transition-all ${
                        hours === h
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-rule bg-white text-ink-soft hover:border-blue-200"
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </Field>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={goBack} className="px-5 py-2.5 rounded-xl text-sm font-medium text-ink-soft border border-rule hover:bg-surface-elevated transition-colors">
                  ← Back
                </button>
                <Button type="submit" size="lg" className="flex-1">Continue →</Button>
              </div>
            </form>
          )}

          {/* ── STEP 2: SUBJECTS ── */}
          {step === 2 && (
            <form onSubmit={(e) => { e.preventDefault(); goForward(); }} className="space-y-5">
              {SUBJECTS_DATA.map((sub) => (
                <div key={sub.key} className="rounded-2xl border-2 border-rule bg-white p-5 hover:border-violet-200 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{sub.emoji}</span>
                    <div>
                      <div className="font-semibold text-ink">{sub.label}</div>
                      <div className="text-xs text-ink-soft">{sub.desc}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {LEVELS.map((lvl) => (
                      <button
                        key={lvl} type="button"
                        onClick={() => setSubjectLevels((p) => ({ ...p, [sub.key]: lvl }))}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider border-2 transition-all ${
                          subjectLevels[sub.key] === lvl
                            ? lvl === "Strong"
                              ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]/20 text-[var(--color-primary-deep)]"
                              : lvl === "OK"
                                ? "border-amber-400 bg-amber-50 text-amber-700"
                                : "border-red-400 bg-red-50 text-red-700"
                            : "border-rule bg-surface text-ink-soft hover:border-violet-200"
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <Field label="Last mock test score" hint="Out of 300 (optional)">
                <Input type="number" value={mockScore} onChange={(e) => setMockScore(e.target.value)} placeholder="e.g. 180" />
              </Field>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={goBack} className="px-5 py-2.5 rounded-xl text-sm font-medium text-ink-soft border border-rule hover:bg-surface-elevated transition-colors">
                  ← Back
                </button>
                <Button type="submit" size="lg" className="flex-1">Continue →</Button>
              </div>
            </form>
          )}

          {/* ── STEP 3: CHALLENGES ── */}
          {step === 3 && (
            <form onSubmit={handleFinalSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-2.5">
                {CHALLENGES.map((ch) => (
                  <button
                    key={ch.key} type="button"
                    onClick={() => toggleChallenge(ch.key)}
                    className={`flex items-center gap-2.5 p-4 rounded-2xl border-2 text-left transition-all ${
                      selectedChallenges.includes(ch.key)
                        ? "border-amber-400 bg-amber-50 shadow-sm"
                        : "border-rule bg-white hover:border-amber-200"
                    }`}
                  >
                    <span className="text-xl">{ch.emoji}</span>
                    <span className="text-xs font-medium text-ink">{ch.label}</span>
                  </button>
                ))}
              </div>

              <Field label="Current coaching" hint="Optional">
                <Input value={coaching} onChange={(e) => setCoaching(e.target.value)} placeholder="Allen, FIITJEE, Self-study…" />
              </Field>

              {/* What you unlock */}
              <div className="rounded-2xl p-5 border-2 border-dashed border-primary/20 bg-primary/[0.02]">
                <div className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold mb-4">What you unlock</div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: "📊", title: "Analytics", desc: "Progress tracking & mock forecasting" },
                    { icon: "🧠", title: "Psychology", desc: "Stress coaching & exam routines" },
                    { icon: "📖", title: "Library", desc: "Curated PDFs & question banks" },
                  ].map((f) => (
                    <div key={f.title} className="text-center">
                      <div className="text-2xl mb-2">{f.icon}</div>
                      <div className="text-xs font-bold text-ink">{f.title}</div>
                      <div className="text-[10px] text-ink-soft mt-0.5 leading-snug">{f.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={goBack} className="px-5 py-2.5 rounded-xl text-sm font-medium text-ink-soft border border-rule hover:bg-surface-elevated transition-colors">
                  ← Back
                </button>
                <div className="flex-1 flex gap-3">
                  <Link
                    href="/student/dashboard"
                    className="flex-shrink-0 px-4 py-2.5 rounded-xl text-sm text-ink-soft hover:text-primary underline underline-offset-2 flex items-center"
                  >
                    Skip
                  </Link>
                  <Button type="submit" size="lg" className="flex-1">
                    Meet your mentor 🚀
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="text-center py-5 text-[10px] text-ink-faint border-t border-rule/30">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline font-medium">Sign in</Link>
        {" · "}
        <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
      </footer>
    </div>
  );
}
