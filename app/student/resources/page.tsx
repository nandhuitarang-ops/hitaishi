import { redirect } from "next/navigation";
import { and, desc, eq, or } from "drizzle-orm";
import { Shell } from "@/components/Shell";
import { Card, CardBody, LinkButton, Pill } from "@/components/ui";
import { formatLastSeen, initials } from "@/lib/format";
import { db } from "@/lib/db";
import { profiles, resourceShares, resources, users } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

const tabs = ["All", "Physics", "Chemistry", "Math", "Mock Tests"];

function subjectLabel(s: string): string {
  if (s === "physics") return "Physics";
  if (s === "chemistry") return "Chemistry";
  if (s === "maths") return "Math";
  return s;
}

function formatKindLabel(kind: string): string {
  if (kind === "file") return "FILE";
  if (kind === "link") return "LINK";
  return kind.toUpperCase();
}

function formatResourceSize(bytes: number | null | undefined): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function describeResource(kind: string, subject: string): string {
  const subj = subjectLabel(subject).toLowerCase();
  if (kind === "file") return `Downloadable ${subj} study material`;
  return `External ${subj} resource link`;
}

export default async function StudentResourcesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "student") redirect(`/${user.role}/dashboard`);

  const [sharedResources, platformResources] = await Promise.all([
    db
      .select({
        id: resources.id,
        title: resources.title,
        subject: resources.subject,
        kind: resources.kind,
        sizeBytes: resources.sizeBytes,
        uploaderName: profiles.fullName,
        uploaderEmail: users.email,
        createdAt: resources.createdAt,
      })
      .from(resourceShares)
      .innerJoin(resources, eq(resources.id, resourceShares.resourceId))
      .leftJoin(profiles, eq(profiles.userId, resources.uploaderId))
      .leftJoin(users, eq(users.id, resources.uploaderId))
      .where(eq(resourceShares.targetUserId, user.id))
      .orderBy(desc(resources.createdAt)),
    db
      .select({
        id: resources.id,
        title: resources.title,
        subject: resources.subject,
        kind: resources.kind,
        sizeBytes: resources.sizeBytes,
        uploaderName: profiles.fullName,
        uploaderEmail: users.email,
        createdAt: resources.createdAt,
      })
      .from(resources)
      .leftJoin(profiles, eq(profiles.userId, resources.uploaderId))
      .leftJoin(users, eq(users.id, resources.uploaderId))
      .where(
        and(
          eq(resources.scope, "platform"),
          eq(resources.platformApproved, true),
        ),
      )
      .orderBy(desc(resources.createdAt)),
  ]);

  const seen = new Set<string>();
  const allResources: typeof sharedResources = [];
  for (const r of [...sharedResources, ...platformResources]) {
    if (!seen.has(r.id)) {
      seen.add(r.id);
      allResources.push(r);
    }
  }
  allResources.sort((a: any, b: any) => {
    const at = a.createdAt?.getTime() ?? 0;
    const bt = b.createdAt?.getTime() ?? 0;
    return bt - at;
  });

  return (
    <Shell
      role="student"
      active="resources"
      pageCode="S.07 — RESOURCES LIBRARY"
      pageTitle="Resources"
      pageSubtitle="Curated by your mentors. Filter by subject or recency."
      actions={
        <input
          placeholder="Search resources…"
          className="rounded-input border border-rule-strong px-3 py-2 text-sm w-64 focus:outline-none focus:border-primary"
        />
      }
    >
      <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
        <div className="flex flex-wrap gap-2">
          {tabs.map((t, i) => (
            <button
              key={t}
              className={`px-4 py-2 rounded-pill text-sm font-medium ${
                i === 0
                  ? "bg-primary text-primary-on"
                  : "bg-surface-card border border-rule text-ink-soft hover:bg-surface-elevated"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <select className="rounded-input border border-rule-strong px-3 py-2 text-sm bg-surface-card">
          <option>Newest first</option>
          <option>By subject</option>
        </select>
      </div>

      {allResources.length === 0 ? (
        <Card>
          <CardBody>
            <p className="text-sm text-ink-soft text-center py-6">
              No resources yet.
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="grid gap-3">
          {allResources.map((r: any) => {
            const sharedBy = r.uploaderName ?? r.uploaderEmail ?? "";
            return (
              <Card key={r.id}>
                <CardBody className="flex flex-wrap items-start gap-4">
                  <div className="flex-1 min-w-[260px]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Pill tone="primary">{subjectLabel(r.subject)}</Pill>
                      <Pill tone="neutral">{formatKindLabel(r.kind)}</Pill>
                      {r.sizeBytes ? (
                        <span className="meta">{formatResourceSize(r.sizeBytes)}</span>
                      ) : null}
                    </div>
                    <div className="font-serif text-lg mt-2">{r.title}</div>
                    <div className="text-sm text-ink-soft mt-1">
                      {describeResource(r.kind, r.subject)}
                    </div>
                    <div className="meta mt-2 flex items-center gap-2 flex-wrap">
                      <span className="avatar !w-5 !h-5 !text-[10px]">
                        {initials(sharedBy)}
                      </span>
                      <span>
                        Shared by {sharedBy} ·{" "}
                        {r.createdAt ? formatLastSeen(r.createdAt) : "recently"}
                      </span>
                    </div>
                  </div>
                  <LinkButton
                    href="/student/resources"
                    variant="primary"
                    size="sm"
                  >
                    Open →
                  </LinkButton>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      <div className="mt-6 text-center">
        <div className="meta mb-3">
          Showing {allResources.length} of {allResources.length} resources
        </div>
        <button className="chip-ghost">Load more resources →</button>
      </div>
    </Shell>
  );
}
