import Link from "next/link";

export default function AcademicIntegrityPage() {
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
        <div className="text-xs uppercase tracking-wider text-primary-deep font-semibold">Academic Policy</div>
        <h1 className="font-serif text-3xl md:text-4xl mt-2">Academic Integrity Guidelines</h1>
        <p className="text-sm text-ink-faint mt-2">Last updated: July 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-ink-soft">
          <section>
            <h2 className="font-serif text-xl text-ink mb-2">Our Commitment</h2>
            <p>
              At Hitaishi, we believe that true learning and success are built on a foundation of honesty, trust, and mutual respect. As a platform connecting aspirants with IITian mentors, our mission is to cultivate deep understanding, critical thinking, and genuine problem-solving skills necessary to excel in IIT-JEE, NEET, and other competitive examinations.
            </p>
            <p className="mt-3">
              We strictly enforce these Academic Integrity Guidelines to ensure a fair, honest, and high-quality educational environment for all students and mentors.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink mb-2">1. Student Code of Conduct</h2>
            <p>Students using Hitaishi agree to adhere to the following principles:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>
                <strong>Do Your Own Work:</strong> Mentorship sessions and resources are designed to help you understand concepts, not to do the work for you. Always attempt problems yourself before seeking help.
              </li>
              <li>
                <strong>No Active Exam Assistance:</strong> You must not request assistance from mentors during active, timed examinations, quizzes, or graded tests administered by your school, coaching institute, or any official testing body.
              </li>
              <li>
                <strong>Respect Intellectual Property:</strong> Do not share copyrighted books, proprietary coaching materials, test papers, or answers without proper authorization. Use shared study materials solely for personal learning.
              </li>
              <li>
                <strong>Honest Interactions:</strong> Provide accurate information regarding your academic performance, mock test scores, and learning progress to help your mentor guide you effectively.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink mb-2">2. Mentor Code of Conduct</h2>
            <p>Mentors on Hitaishi are role models and must uphold the highest academic standards:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>
                <strong>Guide, Don&apos;t Give Answers:</strong> Focus on explaining fundamental concepts, problem-solving methodologies, and test-taking strategies. Do not simply provide final answers or complete assignments on behalf of students.
              </li>
              <li>
                <strong>Refuse Academic Dishonesty:</strong> Immediately decline any request to assist with active, live tests, examinations, or copy-paste assignments. Encourage students to solve their own work.
              </li>
              <li>
                <strong>Original Content:</strong> Ensure all explanations, notes, and resources shared with students are original, properly credited, or ethically sourced.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink mb-2">3. Integrity Monitoring & Policy Enforcement</h2>
            <p>
              Hitaishi proactively monitors platform activity to maintain educational quality and compliance:
            </p>
            <p className="mt-3">
              Administrators and systems review platform communications, chat messages, shared resources, and live session records for signs of academic misconduct (such as requesting live exam solutions, sharing answers during tests, or distributing unauthorized commercial material).
            </p>
            <p className="mt-3">
              Any detected violation will lead to an immediate investigation.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink mb-2">4. Consequences of Violations</h2>
            <p>
              Violations of academic integrity undermine the value of mentorship and hurt the community. Depending on the severity and frequency of the violation, Hitaishi may take the following actions:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>First offense: A formal written warning and mandatory educational review of our policy.</li>
              <li>Second offense: Temporary suspension of account access (typically 7 to 14 days).</li>
              <li>Third/Severe offense: Permanent ban from the Hitaishi platform with no refund for outstanding subscriptions or payouts.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink mb-2">5. Reporting Academic Misconduct</h2>
            <p>
              If you witness or suspect any form of academic dishonesty, cheating, or policy violation on the platform, please report it immediately to our support team at <a href="mailto:integrity@hitaishi.app" className="underline text-primary-deep hover:text-ink">integrity@hitaishi.app</a>. All reports are kept strictly confidential.
            </p>
          </section>
        </div>
      </div>

      <footer className="border-t border-rule bg-surface-card py-8">
        <div className="max-w-container mx-auto px-6 md:px-10 flex flex-wrap items-center justify-between gap-4 text-sm text-ink-faint">
          <div>© 2026 Hitaishi</div>
          <div className="flex items-center gap-5">
            <Link href="/privacy">Privacy</Link>
            <Link href="/policy/academic-integrity">Academic Integrity</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
