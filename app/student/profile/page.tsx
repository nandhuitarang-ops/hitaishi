import { Shell } from "@/components/Shell";
import { Card, CardBody, CardHeader, LinkButton, Pill, Field, Input, Select } from "@/components/ui";

// TODO(phase-2f): hydrate from profiles + subscriptions + payments queries
const mockProfile = {
  fullName: "Arjun Srinivasan",
  email: "arjun.s@example.com",
  phone: "+91 98XX XXXX01",
  targetExam: "JEE Adv 2027",
  targetInstitute: "IIT Bombay · CS",
  subjects: ["Physics", "Math", "Chemistry"],
};

const mockPlan = {
  name: "6-month Academic Plan",
  purchasedOn: "12 Dec 2025",
  expiresOn: "12 Jun 2026",
  daysUsed: 47,
  totalDays: 180,
  amountInr: 24999,
};

const mockTransactions = [
  { id: "t1", label: "6-month Academic Plan", amountInr: 24999, date: "12 Dec 2025" },
  { id: "t2", label: "Registration Fee", amountInr: 999, date: "10 Dec 2025" },
];

const notificationPrefs = [
  { key: "wa", label: "WhatsApp updates", value: true },
  { key: "email", label: "Email digests", value: true },
  { key: "session", label: "Session reminders", value: true },
];

export default function StudentProfilePage() {
  return (
    <Shell
      role="student"
      active="profile"
      pageCode="S.09 — PROFILE & PLAN"
      pageTitle="Your profile"
      pageSubtitle="Manage personal details, plan, and notification preferences."
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">
        <Card>
          <CardHeader meta="PERSONAL INFO" title="Identity" />
          <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Full name">
              <Input defaultValue={mockProfile.fullName} />
            </Field>
            <Field label="Email">
              <Input defaultValue={mockProfile.email} readOnly />
            </Field>
            <Field label="Phone">
              <Input defaultValue={mockProfile.phone} />
            </Field>
            <Field label="Target exam">
              <Select defaultValue={mockProfile.targetExam}>
                <option>JEE Main 2026</option>
                <option>JEE Adv 2026</option>
                <option>JEE Adv 2027</option>
              </Select>
            </Field>
            <Field label="Dream institute">
              <Input defaultValue={mockProfile.targetInstitute} />
            </Field>
            <Field label="Subjects (priority order)">
              <div className="flex gap-2 flex-wrap">
                {mockProfile.subjects.map((s, i) => (
                  <Pill key={s} tone="primary">
                    {i + 1}. {s}
                  </Pill>
                ))}
              </div>
            </Field>
            <div className="md:col-span-2 flex justify-end">
              <button className="chip-cta">Save changes</button>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader meta="CURRENT PLAN" title={mockPlan.name} />
          <CardBody>
            <div className="meta">EXPIRES</div>
            <div className="font-serif text-2xl mt-1">{mockPlan.expiresOn}</div>
            <div className="text-sm text-ink-soft mt-1">
              {mockPlan.daysUsed} of {mockPlan.totalDays} days used
            </div>
            <div className="h-2 bg-surface-elevated rounded-pill mt-3 overflow-hidden">
              <div
                className="bg-primary h-full"
                style={{
                  width: `${(mockPlan.daysUsed / mockPlan.totalDays) * 100}%`,
                }}
              />
            </div>
            <div className="meta mt-5">PURCHASED</div>
            <div className="text-sm">
              {mockPlan.purchasedOn} · ₹{mockPlan.amountInr.toLocaleString("en-IN")}
            </div>
            <LinkButton href="/checkout" size="md" className="mt-5 w-full">
              Renew plan
            </LinkButton>
          </CardBody>
        </Card>
      </div>

      <Card className="mt-5">
        <CardHeader meta="TRANSACTIONS" title="Recent transactions" />
        <ul>
          {mockTransactions.map((t) => (
            <li
              key={t.id}
              className="flex items-center justify-between px-5 py-4 border-t border-rule first:border-t-0"
            >
              <div>
                <div className="text-sm font-medium">{t.label}</div>
                <div className="meta mt-1">{t.date}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="font-mono text-sm">
                  ₹{t.amountInr.toLocaleString("en-IN")}
                </div>
                <LinkButton href="/student/profile" variant="ghost" size="sm">
                  Receipt
                </LinkButton>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="mt-5">
        <CardHeader meta="NOTIFICATIONS" title="Preferences" />
        <CardBody className="flex flex-col gap-3">
          {notificationPrefs.map((p) => (
            <label
              key={p.key}
              className="flex items-center justify-between py-2 border-b border-rule last:border-0"
            >
              <span className="text-sm">{p.label}</span>
              <input
                type="checkbox"
                defaultChecked={p.value}
                className="w-10 h-5 accent-primary"
              />
            </label>
          ))}
        </CardBody>
      </Card>

      <Card className="mt-5">
        <CardHeader meta="ACCOUNT" title="Security" />
        <CardBody className="flex flex-wrap gap-3">
          <button className="chip-ghost">Change phone number</button>
          <button className="chip-ghost">Download my data</button>
          <button className="chip-ghost text-red-600 border-red-200 hover:bg-red-50">
            Delete account
          </button>
        </CardBody>
      </Card>
    </Shell>
  );
}
