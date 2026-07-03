import { Shell } from "@/components/Shell";
import { Card, CardBody, CardHeader, LinkButton, Pill, Field, Input, Select, Textarea } from "@/components/ui";
import { db } from "@/lib/db";
import { resources } from "@/db/schema";
import { and, desc, eq, ne, sql } from "drizzle-orm";
import { requireRole } from "@/lib/session";

export const dynamic = "force-dynamic";

const SCOPES = [
  { value: "private", label: "Private — only me" },
  { value: "per_user", label: "Individual student" },
  { value: "mentor_cohort", label: "All my students" },
  { value: "platform", label: "Platform-wide (admin approval)" },
];

const SCOPE_LABEL: Record<string, string> = {
  private: "Private",
  per_user: "Individual",
  mentor_cohort: "My students",
  platform: "Platform",
};

const KIND_LABEL: Record<string, string> = {
  file: "File",
  link: "Link",
};

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

export default async function MentorResourcesPage() {
  const user = await requireRole("mentor");

  const [allRow, privateRow, sharedRow, pendingRow] = await Promise.all([
    db
      .select({ c: sql<number>`count(*)::int` })
      .from(resources)
      .where(eq(resources.uploaderId, user.id)),
    db
      .select({ c: sql<number>`count(*)::int` })
      .from(resources)
      .where(and(eq(resources.uploaderId, user.id), eq(resources.scope, "private"))),
    db
      .select({ c: sql<number>`count(*)::int` })
      .from(resources)
      .where(and(eq(resources.uploaderId, user.id), ne(resources.scope, "private"))),
    db
      .select({ c: sql<number>`count(*)::int` })
      .from(resources)
      .where(
        and(
          eq(resources.uploaderId, user.id),
          eq(resources.scope, "platform"),
          eq(resources.platformApproved, false),
        ),
      ),
  ]);

  const tabs = [
    { key: "all", label: "All", count: Number(allRow?.c ?? 0) },
    { key: "private", label: "Private", count: Number(privateRow?.c ?? 0) },
    { key: "shared", label: "Shared", count: Number(sharedRow?.c ?? 0) },
    { key: "pending", label: "Pending approval", count: Number(pendingRow?.c ?? 0) },
  ];

  const rows = await db
    .select({
      id: resources.id,
      title: resources.title,
      kind: resources.kind,
      scope: resources.scope,
      platformApproved: resources.platformApproved,
      createdAt: resources.createdAt,
    })
    .from(resources)
    .where(eq(resources.uploaderId, user.id))
    .orderBy(desc(resources.createdAt))
    .limit(50);

  const resourcesView = rows.map((r: any) => ({
    id: r.id,
    title: r.title,
    kind: KIND_LABEL[r.kind] ?? r.kind,
    scope: r.scope,
    scopeLabel: SCOPE_LABEL[r.scope] ?? r.scope,
    pending: r.scope === "platform" && !r.platformApproved,
    sharedAt: formatDate(r.createdAt),
  }));

  const totalCount = Number(allRow?.c ?? 0);

  return (
    <Shell
      role="mentor"
      active="resources"
      pageCode="M.08 — RESOURCES (UPLOAD & SHARE)"
      pageTitle="Resources you've shared"
      pageSubtitle="Upload notes, link to videos, and pick who can see them."
    >
      <Card className="mb-6">
        <CardHeader meta="UPLOAD" title="Add a new resource" />
        <CardBody>
          <div className="border-2 border-dashed border-rule-strong rounded-card p-8 text-center bg-surface">
            <div className="text-3xl">📎</div>
            <div className="font-serif text-lg mt-2">
              Drop a file or paste a link
            </div>
            <div className="text-xs text-ink-faint mt-1 font-mono">
              PDF, DOCX, ZIP, or MP4 · max 50 MB
            </div>
          </div>
          <form className="grid md:grid-cols-2 gap-4 mt-5">
            <Field label="Resource title" required>
              <Input placeholder="Wave optics — JEE Adv shortcuts" required />
            </Field>
            <Field label="Subject">
              <Select>
                <option>General</option>
                <option>Physics</option>
                <option>Chemistry</option>
                <option>Math</option>
              </Select>
            </Field>
            <Field label="Visibility">
              <Select>
                {SCOPES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Tags (comma-separated)">
              <Input placeholder="mechanics, electrostatics" />
            </Field>
            <div className="md:col-span-2">
              <Field label="Description">
                <Textarea
                  rows={3}
                  placeholder="What students should look for in this resource."
                />
              </Field>
            </div>
            <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-xs text-ink-soft">
                <input type="checkbox" />
                <span>
                  I confirm this content follows the{" "}
                  <a className="underline" href="/policy/academic-integrity">
                    Academic Integrity Policy
                  </a>
                  .
                </span>
              </label>
              <button type="submit" className="chip-cta">Publish →</button>
            </div>
          </form>
        </CardBody>
      </Card>

      <div className="flex flex-wrap gap-2 mb-5">
        {tabs.map((t, i) => (
          <button
            key={t.key}
            className={`px-4 py-2 rounded-pill text-sm flex items-center gap-2 ${
              i === 0
                ? "bg-primary text-primary-on"
                : "bg-surface-card border border-rule text-ink-soft hover:bg-surface-elevated"
            }`}
          >
            {t.label}
            <span className="font-mono text-xs opacity-70">{t.count}</span>
          </button>
        ))}
      </div>

      {resourcesView.length === 0 ? (
        <Card>
          <CardBody>
            <div className="text-sm text-ink-soft text-center py-6">
              You haven&apos;t uploaded any resources yet.
            </div>
          </CardBody>
        </Card>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-elevated border-b border-rule">
                <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                  Title
                </th>
                <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                  Type
                </th>
                <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                  Scope
                </th>
                <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-wider text-ink-soft hidden md:table-cell">
                  Shared on
                </th>
                <th className="px-4 py-3 text-right font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {resourcesView.map((r: any) => (
                <tr key={r.id} className="border-b border-rule last:border-0">
                  <td className="px-4 py-3 font-medium">{r.title}</td>
                  <td className="px-4 py-3">
                    <Pill tone="neutral">{r.kind}</Pill>
                  </td>
                  <td className="px-4 py-3">
                    <Pill tone={r.pending ? "warn" : "primary"}>
                      {r.pending ? "Pending review" : r.scopeLabel}
                    </Pill>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell font-mono text-xs text-ink-faint">
                    {r.sharedAt}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <LinkButton href="/mentor/resources" variant="ghost" size="sm">
                      Manage
                    </LinkButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <div className="mt-5 meta text-center">
        {totalCount === 0
          ? "No resources yet"
          : `Showing 1–${Math.min(resourcesView.length, totalCount)} of ${totalCount} resource${totalCount === 1 ? "" : "s"}`}
      </div>
    </Shell>
  );
}
