import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-surface text-ink">
      <header className="border-b border-rule bg-surface-card">
        <div className="max-w-container mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-medium text-primary-deep">
            Hitaishi
          </Link>
          <Link href="/" className="text-sm text-ink-soft hover:text-primary-deep">
            ← Back to home
          </Link>
        </div>
      </header>

      <div className="max-w-[720px] mx-auto px-6 md:px-10 py-12 md:py-16">
        <div className="meta">PRIVACY POLICY</div>
        <h1 className="font-serif text-3xl md:text-4xl mt-2">How we handle your data.</h1>
        <p className="text-sm text-ink-faint mt-2">Last updated: May 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-ink-soft">
          <section>
            <h2 className="font-serif text-xl text-ink mb-2">1. What we collect</h2>
            <p>We collect the minimum required to operate the platform: name, email, phone number, and academic information (target exam, subjects). For mentors, we collect verification documents and payment details.</p>
            <p className="mt-3">Chat messages, session recordings, and resource uploads are stored to provide the service and for quality assurance purposes.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink mb-2">2. Monitoring & oversight</h2>
            <p>By using Hitaishi, you acknowledge that platform administrators may monitor chat conversations, session recordings, and shared resources for quality assurance, safety, and compliance with our Terms of Service.</p>
            <p className="mt-3">Administrators may join live sessions without prior consent from participants for quality monitoring purposes. This is disclosed through a warning popup shown to mentors before creating any session.</p>
            <p className="mt-3">This oversight is disclosed to all users during onboarding, is prominently displayed within chat and session interfaces via a dismissible banner, and is shown again via a popup before session creation. It is a feature of the platform, not surveillance.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink mb-2">3. No personal information sharing</h2>
            <p>To protect all users, Hitaishi strictly prohibits sharing personal contact information (phone numbers, email addresses, social media handles, bank details, UPI IDs, or off-platform meeting arrangements) through platform communications.</p>
            <p className="mt-3">All communication between students and mentors must occur through the in-app chat and session systems. Users who share personal contact information will receive a warning. Repeated violations may result in account suspension or termination.</p>
            <p className="mt-3">A privacy notice reminding users of this policy is displayed in chat interfaces and session creation flows.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink mb-2">4. Data storage & security</h2>
            <p>Data is stored on encrypted servers. All connections use TLS encryption. Chat messages are encrypted in transit. We do not sell your data to third parties.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink mb-2">5. Your rights</h2>
            <p>You may request a copy of your data, request deletion of your account, or opt out of communications at any time by contacting support.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink mb-2">6. Contact</h2>
            <p>For privacy-related inquiries, contact us at privacy@hitaishii.com.</p>
          </section>
        </div>
      </div>

      <footer className="border-t border-rule bg-surface-card py-8">
        <div className="max-w-container mx-auto px-6 md:px-10 flex flex-wrap items-center justify-between gap-4 text-sm text-ink-faint">
          <div>© 2026 Hitaishi</div>
          <div className="flex items-center gap-5">
            <Link href="/privacy">Privacy</Link>
            <span className="text-ink-faint">Terms</span>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
