import { Shell } from "@/components/Shell";
import { Card, CardBody, CardHeader, LinkButton, Pill, Field, Input, Select, Textarea } from "@/components/ui";

// TODO(phase-2f): hydrate from resources + resourceShares; the create form should POST to /api/resources
const tabs = [
  { key: "all", label: "All", count: 42 },
  { key: "private", label: "Private", count: 11 },
  { key: "shared", label: "Shared", count: 28 },
  { key: "pending", label: "Pending approval", count: 3 },
];

const SCOPES = [
  { value: "private", label: "Private — only me" },
  { value: "per_user", label: "Individual student" },
  { value: "mentor_cohort", label: "All my students" },
  { value: "platform", label: "Platform-wide (admin approval)" },
];

const resources = [
  {
    id: "r1",
    title: "Intro to Thermodynamics",
    kind: "PDF",
    scope: "mentor_cohort",
    scopeLabel: "My students",
    sharedAvatars: ["A", "M", "K", "R"],
    extra: 8,
    sharedAt: "12 Feb",
    views: 45,
    downloads: 12,
  },
  {
    id: "r2",
    title: "Chemistry — Aldol interactive demo",
    kind: "Link",
    scope: "private",
    scopeLabel: "Private",
    sharedAvatars: [],
    extra: 0,
    sharedAt: "08 Feb",
    views: 0,
    downloads: 0,
  },
  {
    id: "r3",
    title: "Math — calculus framework",
    kind: "PDF",
    scope: "platform",
    scopeLabel: "Platform",
    sharedAvatars: [],
    extra: 0,
    sharedAt: "01 Feb",
    views: 1240,
    downloads: 340,
  },
];

export default function MentorResourcesPage() {
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
                Shared with
              </th>
              <th className="px-4 py-3 text-right font-mono text-[11px] uppercase tracking-wider text-ink-soft hidden lg:table-cell">
                Views / DLs
              </th>
              <th className="px-4 py-3 text-right font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {resources.map((r) => (
              <tr key={r.id} className="border-b border-rule last:border-0">
                <td className="px-4 py-3 font-medium">{r.title}</td>
                <td className="px-4 py-3">
                  <Pill tone="neutral">{r.kind}</Pill>
                </td>
                <td className="px-4 py-3">
                  <Pill tone="primary">{r.scopeLabel}</Pill>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <div className="flex items-center -space-x-2">
                    {r.sharedAvatars.map((a) => (
                      <span
                        key={a}
                        className="w-6 h-6 rounded-full bg-primary text-primary-on text-[10px] flex items-center justify-center border-2 border-surface-card"
                      >
                        {a}
                      </span>
                    ))}
                    {r.extra > 0 && (
                      <span className="text-xs text-ink-faint ml-3">
                        +{r.extra}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right hidden lg:table-cell font-mono text-xs">
                  {r.views} / {r.downloads}
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

      <div className="mt-5 meta text-center">
        Showing 1–{resources.length} of 42 resources
      </div>
    </Shell>
  );
}
