import { readLeads } from "@/lib/leadsStore";
import type { Lead } from "@/lib/leadTypes";
import { LeadsTableActions } from "./LeadsTableActions";
import { Mail, Phone, Inbox, Calendar, MessageSquare } from "lucide-react";

export const dynamic = "force-dynamic";

const TYPE_LABEL: Record<Lead["type"], string> = {
  "student-inquiry": "Student",
  "mentor-application": "Mentor",
  "institution-partner": "Institution",
  general: "General",
};

const TYPE_TONE: Record<Lead["type"], string> = {
  "student-inquiry": "bg-amber-50 text-amber-800 border-amber-200",
  "mentor-application": "bg-emerald-50 text-emerald-800 border-emerald-200",
  "institution-partner": "bg-indigo-50 text-indigo-800 border-indigo-200",
  general: "bg-slate-100 text-slate-700 border-slate-200",
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function summarize(lead: Lead): string {
  switch (lead.type) {
    case "student-inquiry":
      return `Class ${lead.currentClass}${lead.coachingInstitute ? ` · ${lead.coachingInstitute}` : ""} · ${lead.city}`;
    case "institution-partner":
      return `${lead.institutionName} · ${lead.studentCount} students · ${lead.partnershipModel}`;
    case "mentor-application":
      return `${lead.institute} · ${lead.branch} · JEE ${lead.jeeYear} rank ${lead.jeeRank} · ${lead.subjects.join("/")}`;
    case "general":
      return `${lead.role} · ${lead.message}`;
  }
}

function computeStats(leads: Lead[]): { total: number; today: number; week: number } {
  const todayStr = new Date().toDateString();
  const nowMs = Date.now();
  const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  let today = 0;
  let week = 0;
  for (const l of leads) {
    const created = new Date(l.createdAt);
    if (created.toDateString() === todayStr) today += 1;
    if (nowMs - created.getTime() <= WEEK_MS) week += 1;
  }
  return { total: leads.length, today, week };
}

export default async function LeadsAdminPage() {
  const leads = await readLeads();
  leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const { total, today, week } = computeStats(leads);

  return (
    <>
      <section className="border-b border-[var(--color-border)] bg-[var(--color-background)]">
        <div className="mx-auto max-w-7xl px-6 py-10 md:py-14 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-sky)]">
                Leads dashboard
              </p>
              <h1 className="mt-3 font-serif text-3xl font-medium leading-tight text-[var(--color-fg)] md:text-4xl">
                All Hitaishi submissions
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-[var(--color-fg-muted)] md:text-base">
                Student inquiries, mentor applications, institution partnership requests, and
                general contact-form messages. Newest first.
              </p>
            </div>
            <LeadsTableActions count={total} />
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-6 max-w-7xl px-6 lg:px-8">
        <div className="relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard icon={<Inbox size={18} aria-hidden />} label="Total" value={total} />
          <StatCard icon={<Calendar size={18} aria-hidden />} label="Today" value={today} />
          <StatCard icon={<MessageSquare size={18} aria-hidden />} label="Last 7 days" value={week} />
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {leads.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-background-alt)] p-16 text-center">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-sky-soft)] text-[var(--color-sky-hover)]">
                <Inbox size={24} aria-hidden />
              </div>
              <p className="text-base font-medium text-[var(--color-fg)]">No leads yet</p>
              <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
                Submit any of the site forms to see entries appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-solid)] shadow-[var(--shadow-soft)]">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[var(--color-background-alt)] text-left">
                    <tr>
                      <Th>Created</Th>
                      <Th>Type</Th>
                      <Th>Name</Th>
                      <Th>Contact</Th>
                      <Th>Details</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="border-t border-[var(--color-border)] transition-colors hover:bg-[var(--color-surface-hover)]"
                      >
                        <Td className="whitespace-nowrap text-[var(--color-fg-muted)]">
                          {formatDate(lead.createdAt)}
                        </Td>
                        <Td>
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${TYPE_TONE[lead.type]}`}
                          >
                            {TYPE_LABEL[lead.type]}
                          </span>
                        </Td>
                        <Td>
                          <div className="font-semibold text-[var(--color-fg)]">{lead.name}</div>
                        </Td>
                        <Td>
                          <div className="flex flex-col gap-1.5">
                            <a
                              href={`mailto:${encodeURIComponent(lead.email)}`}
                              className="inline-flex items-center gap-1.5 text-[var(--color-accent)] hover:underline"
                            >
                              <Mail size={13} aria-hidden /> {lead.email}
                            </a>
                            {"phone" in lead && lead.phone && (
                              <a
                                href={`tel:${encodeURIComponent(lead.phone)}`}
                                className="inline-flex items-center gap-1.5 text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
                              >
                                <Phone size={13} aria-hidden /> {lead.phone}
                              </a>
                            )}
                          </div>
                        </Td>
                        <Td className="max-w-md">
                          <p className="whitespace-pre-wrap leading-relaxed text-[var(--color-fg)]">
                            {summarize(lead)}
                          </p>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-solid)] p-5 shadow-[var(--shadow-soft)]">
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--color-sky)]/30 bg-[var(--color-sky-soft)] text-[var(--color-sky-hover)]">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-[var(--color-fg-subtle)]">
          {label}
        </p>
        <p className="mt-1 font-serif text-2xl font-medium text-[var(--color-fg)]">{value}</p>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-fg-subtle)]">
      {children}
    </th>
  );
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-5 py-4 align-top ${className}`}>{children}</td>;
}
