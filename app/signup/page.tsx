import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { SignupForm } from "./SignupForm";

export default async function SignupPage() {
  let me = null;
  try {
    me = await getCurrentUser();
  } catch {
    // ignore — let the signup form render
  }
  if (me) redirect(`/${me.role}/dashboard`);

  return (
    <main className="min-h-screen bg-surface grid lg:grid-cols-2">
      <aside className="hidden lg:flex flex-col justify-start gap-10 bg-primary-deep text-white px-12 py-10">
        <Link href="/" className="font-serif text-3xl text-white">
          Hitaishi
        </Link>
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-white/70">
            S.00 — Sign up
          </div>
          <h1 className="font-serif text-4xl mt-4 leading-tight text-white">
            Start your JEE journey.
          </h1>
          <p className="text-white/90 mt-4 max-w-[45ch]">
            Private mentorship from JEE-clearing IITians. Tell us about yourself
            and we&apos;ll match you with the right mentor.
          </p>
        </div>
        <div className="font-mono text-xs text-white/60">
          Daily chat · Weekly calls · Hand-curated resources
        </div>
      </aside>

      <section className="flex flex-col justify-center px-6 md:px-12 py-10">
        <div className="max-w-lg w-full mx-auto">
          <div className="font-mono text-xs uppercase tracking-widest text-ink-faint">
            Create your student account
          </div>
          <h2 className="font-serif text-3xl mt-2">Join Hitaishi.</h2>
          <p className="text-sm text-ink-soft mt-2">
            Fill in your details to get matched with an IITian mentor.
          </p>

          <div className="mt-6">
            <SignupForm />
          </div>

          <p className="text-sm text-ink-soft mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-primary-deep underline">
              Sign in →
            </Link>
          </p>

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
