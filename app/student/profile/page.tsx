import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { Shell } from "@/components/Shell";
import {
  Card,
  CardBody,
  CardHeader,
  Pill,
  Field,
  Input,
  Select,
} from "@/components/ui";
import { db } from "@/lib/db";
import { profiles, users } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

const notificationPrefs = [
  { key: "wa", label: "WhatsApp updates", value: true },
  { key: "email", label: "Email digests", value: true },
  { key: "session", label: "Session reminders", value: true },
];

function examLabel(targetExam: string | null | undefined): string {
  if (targetExam === "jee_main") return "JEE Main";
  if (targetExam === "jee_advanced") return "JEE Adv";
  if (targetExam === "both") return "JEE Main + Adv";
  return "JEE";
}

function subjectLabel(s: string): string {
  if (s === "physics") return "Physics";
  if (s === "chemistry") return "Chemistry";
  if (s === "maths") return "Math";
  return s;
}

export default async function StudentProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "student") redirect(`/${user.role}/dashboard`);

  const [profileRow] = await Promise.all([
    db
      .select({
        email: users.email,
        phone: users.phone,
        fullName: profiles.fullName,
        bio: profiles.bio,
        targetExam: profiles.targetExam,
        targetYear: profiles.targetYear,
        institute: profiles.institute,
        subjectsFocus: profiles.subjectsFocus,
      })
      .from(users)
      .leftJoin(profiles, eq(profiles.userId, users.id))
      .where(eq(users.id, user.id))
      .limit(1),
  ]);

  const profile = profileRow[0] ?? null;
  const activeSubscription = null;
  const fullName = profile?.fullName ?? user.fullName;
  const email = profile?.email ?? user.email;
  const phone = profile?.phone ?? "";
  const targetExam = examLabel(profile?.targetExam);
  const targetYear = profile?.targetYear ?? null;
  const targetExamFull = targetYear ? `${targetExam} ${targetYear}` : targetExam;
  const institute = profile?.institute ?? "";
  const subjects: string[] = Array.isArray(profile?.subjectsFocus)
    ? (profile!.subjectsFocus as string[])
    : [];

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
              <Input defaultValue={fullName} />
            </Field>
            <Field label="Email">
              <Input defaultValue={email} readOnly />
            </Field>
            <Field label="Phone">
              <Input defaultValue={phone} />
            </Field>
            <Field label="Target exam">
              <Select defaultValue={targetExamFull}>
                <option>JEE Main 2026</option>
                <option>JEE Adv 2026</option>
                <option>JEE Adv 2027</option>
              </Select>
            </Field>
            <Field label="Dream institute">
              <Input defaultValue={institute} />
            </Field>
            <Field label="Subjects (priority order)">
              <div className="flex gap-2 flex-wrap">
                {subjects.length === 0 ? (
                  <span className="text-sm text-ink-faint">
                    No subjects added yet.
                  </span>
                ) : (
                  subjects.map((s, i) => (
                    <Pill key={s} tone="primary">
                      {i + 1}. {subjectLabel(s)}
                    </Pill>
                  ))
                )}
              </div>
            </Field>
            <div className="md:col-span-2 flex justify-end">
              <button className="chip-cta">Save changes</button>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader meta="CURRENT PLAN" title="No active plan" />
          <CardBody>
            <div className="font-serif text-2xl text-ink-soft mt-1">
              No active plan
            </div>
            <div className="text-sm text-ink-soft mt-1">
              Pick a plan to unlock sessions, doubts, and resources.
            </div>
          </CardBody>
        </Card>
      </div>

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
