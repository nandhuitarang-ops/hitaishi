import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Shell } from "@/components/Shell";
import { Card, CardBody, CardHeader, LinkButton, Pill } from "@/components/ui";
import { initials, formatLastSeen } from "@/lib/format";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { users, profiles, assignments, mentorVerifications } from "@/db/schema";
import { and, desc, eq, isNull } from "drizzle-orm";
import { DeleteMentorButton } from "./DeleteMentorButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mentor Details — Hitaishi Admin",
  robots: "noindex, nofollow",
};

interface PageProps {
  params: Promise<{ mentorId: string }>;
}

type Tone = "primary" | "coral" | "warn" | "error" | "neutral";
const docTone: Record<"ok" | "pending" | "missing", Tone> = {
  ok: "primary",
  pending: "warn",
  missing: "error",
};

function docsFromVerification(
  row: { documents: unknown; linkedinUrl: string | null },
): { degree: "ok" | "pending" | "missing"; id: "ok" | "pending" | "missing"; scorecard: "ok" | "pending" | "missing"; linkedin: "ok" | "pending" | "missing" } {
  const docs = (row.documents ?? {}) as Record<string, string | null | undefined>;
  const pick = (v: string | null | undefined): "ok" | "pending" | "missing" =>
    v === "ok" || v === "verified" || v === "present"
      ? "ok"
      : v === "missing" || v === "absent" || v === "rejected"
        ? "missing"
        : "pending";
  return {
    degree: pick(docs.degree),
    id: pick(docs.id ?? docs.id_card ?? docs.idCard),
    scorecard: pick(docs.scorecard ?? docs.jee_scorecard),
    linkedin: row.linkedinUrl ? "ok" : "pending",
  };
}

export default async function AdminMentorProfilePage({ params }: PageProps) {
  const user = await requireRole("admin");
  const { mentorId } = await params;

  // Fetch mentor with profile
  const [mentorRow] = await db
    .select()
    .from(users)
    .leftJoin(profiles, eq(profiles.userId, users.id))
    .where(and(eq(users.id, mentorId), eq(users.role, "mentor"), isNull(users.deletedAt)))
    .limit(1);

  if (!mentorRow) notFound();

  const mentor = mentorRow.users;
  const profile = mentorRow.profiles;
  const name = profile?.fullName ?? mentor.email.split("@")[0];

  // Fetch assigned students
  const activeAssignments = await db
    .select({
      id: assignments.id,
      studentId: users.id,
      studentName: profiles.fullName,
      studentEmail: users.email,
      startedAt: assignments.startedAt,
    })
    .from(assignments)
    .innerJoin(users, eq(users.id, assignments.studentId))
    .leftJoin(profiles, eq(profiles.userId, assignments.studentId))
    .where(and(eq(assignments.mentorId, mentorId), eq(assignments.status, "active")))
    .orderBy(desc(assignments.startedAt));

  // Fetch verification entry
  const [verifRow] = await db
    .select()
    .from(mentorVerifications)
    .where(eq(mentorVerifications.userId, mentorId))
    .limit(1)
    .catch(() => [] as any[]);

  const docs = verifRow
    ? docsFromVerification({ documents: verifRow.documents, linkedinUrl: verifRow.linkedinUrl })
    : null;

  return (
    <Shell
      role="admin"
      active="mentors"
      pageCode="A.04 — MENTOR PROFILE"
      pageTitle={name}
      pageSubtitle={mentor.email}
      user={user}
      actions={
        <LinkButton href="/admin/mentors" variant="ghost" size="sm">
          ← Back to Mentors
        </LinkButton>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* LEFT: Mentor Info & Deletion */}
        <div className="lg:col-span-1 space-y-5">
          <Card>
            <CardBody className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="avatar !w-20 !h-20 !text-2xl mb-4">
                  {initials(name)}
                </div>
                <h2 className="font-serif text-xl font-semibold">{name}</h2>
                <p className="meta mt-1">{mentor.email}</p>
                {mentor.phone && <p className="text-sm text-ink-soft mt-1">{mentor.phone}</p>}
                <div className="mt-4">
                  <Pill tone="primary">{mentor.status}</Pill>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-rule space-y-3">
                <ProfileField label="Institute" value={profile?.institute} />
                <ProfileField label="Graduation Year" value={profile?.graduationYear?.toString()} />
                <ProfileField label="City" value={profile?.city} />
                <ProfileField label="Gender" value={profile?.gender} />
                <ProfileField label="Last Login" value={mentor.lastLoginAt ? formatLastSeen(mentor.lastLoginAt) + " ago" : "Never"} />
              </div>
            </CardBody>
          </Card>

          {/* Verification Badges */}
          {docs && (
            <Card>
              <CardHeader meta="VERIFICATION STATUS" title="Submitted Credentials" />
              <CardBody className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Degree Certificate</span>
                  <Pill tone={docTone[docs.degree]}>{docs.degree === "ok" ? "Verified" : docs.degree}</Pill>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">ID Card</span>
                  <Pill tone={docTone[docs.id]}>{docs.id === "ok" ? "Verified" : docs.id}</Pill>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">JEE Scorecard</span>
                  <Pill tone={docTone[docs.scorecard]}>{docs.scorecard === "ok" ? "Verified" : docs.scorecard}</Pill>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">LinkedIn</span>
                  <Pill tone={docTone[docs.linkedin]}>{docs.linkedin === "ok" ? "Verified" : docs.linkedin}</Pill>
                </div>
                {verifRow.jeeRank && (
                  <div className="border-t border-rule pt-3 mt-3 flex justify-between items-center text-sm">
                    <span className="font-mono text-ink-soft text-xs uppercase tracking-wider">JEE Rank</span>
                    <span className="font-medium">AIR {verifRow.jeeRank}</span>
                  </div>
                )}
              </CardBody>
            </Card>
          )}

          {/* Danger Zone / Delete */}
          <Card className="border-red-200 bg-red-50/20">
            <CardHeader meta="DANGER ZONE" title="Actions" />
            <CardBody>
              <p className="text-xs text-ink-soft">
                Deleting this mentor will immediately suspend their account, block portal access, and terminate all active student matches.
              </p>
              <DeleteMentorButton mentorId={mentor.id} mentorName={name} />
            </CardBody>
          </Card>
        </div>

        {/* RIGHT: Roster & Details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Active Assignments */}
          <Card>
            <CardHeader
              meta="ASSIGNMENTS"
              title={`Assigned Students (${activeAssignments.length})`}
            />
            {activeAssignments.length === 0 ? (
              <CardBody>
                <p className="text-sm text-ink-soft text-center py-6">
                  No active students are currently matched with this mentor.
                </p>
              </CardBody>
            ) : (
              <ul>
                {activeAssignments.map((a: any) => {
                  const studentName = a.studentName ?? a.studentEmail.split("@")[0];
                  return (
                    <li
                      key={a.id}
                      className="flex items-center justify-between gap-4 px-5 py-4 border-t border-rule first:border-t-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="avatar !w-8 !h-8 !text-xs">
                          {initials(studentName)}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{studentName}</div>
                          <div className="meta">{a.studentEmail}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="meta text-xs">
                          Matched {formatLastSeen(a.startedAt)} ago
                        </span>
                        <LinkButton
                          href={`/admin/students/${a.studentId}`}
                          variant="ghost"
                          size="sm"
                        >
                          View Student →
                        </LinkButton>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          {/* About / Bio Card */}
          {profile?.bio && (
            <Card>
              <CardHeader meta="BIO" title="About Mentor" />
              <CardBody>
                <p className="text-sm leading-relaxed whitespace-pre-wrap italic text-ink-soft">
                  &ldquo;{profile.bio}&rdquo;
                </p>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </Shell>
  );
}

function ProfileField({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs font-mono uppercase tracking-wider text-ink-soft">{label}</span>
      <span className="text-sm font-medium text-ink">{value}</span>
    </div>
  );
}
