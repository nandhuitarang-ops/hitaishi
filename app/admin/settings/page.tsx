import { Shell } from "@/components/Shell";
import { Card, CardBody, CardHeader, Field, Input, Pill } from "@/components/ui";
import { requireRole } from "@/lib/session";

export const dynamic = "force-dynamic";

type Tone = "primary" | "coral" | "warn" | "error" | "neutral";

const featureFlags = [
  { key: "betaDoubtAuction", label: "Beta — doubt auction", value: false, desc: "Mentors bid response times on new doubts." },
  { key: "groupSessions", label: "Group sessions", value: true, desc: "12-student group rooms via Jitsi." },

  { key: "newOnboarding", label: "New onboarding (S.02 v2)", value: true, desc: "3-step student onboarding with goal capture." },
];

function envStatus(name: string, label: string, envKey: string, fallback: { tone: Tone; status: string }) {
  const has = Boolean(process.env[envKey]);
  return {
    name: label,
    env: envKey,
    status: has ? "Configured" : "Not configured",
    tone: (has ? "primary" : fallback.tone) as Tone,
    lastChecked: "process.env",
  };
}

const integrations = [
  { name: "Jitsi Meet", env: "—", status: "Active", tone: "primary" as Tone, lastChecked: "always" },
  envStatus("msg91", "MSG91 (SMS)", "MSG91_AUTH_KEY", { tone: "warn", status: "Not configured" }),
  envStatus("resend", "Resend (Email)", "RESEND_API_KEY", { tone: "warn", status: "Not configured" }),
];

export default async function AdminSettingsPage() {
  await requireRole("admin");

  return (
    <Shell
      role="admin"
      active="settings"
      pageCode="A.08 — SETTINGS & CONFIGURATION"
      pageTitle="Platform settings"
      pageSubtitle="Feature flags, integrations, security policies."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader meta="FEATURE FLAGS" title="Runtime toggles" />
          <ul>
            {featureFlags.map((f) => (
              <li
                key={f.key}
                className="flex items-center gap-4 px-5 py-4 border-t border-rule first:border-t-0"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{f.label}</div>
                  <div className="meta mt-0.5">{f.key}</div>
                  <div className="text-xs text-ink-soft mt-1">{f.desc}</div>
                </div>
                <label className="cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={f.value}
                    className="w-10 h-5 accent-primary"
                  />
                </label>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader meta="INTEGRATIONS" title="Connected services" />
          <ul>
            {integrations.map((i) => (
              <li
                key={i.name}
                className="flex items-center gap-4 px-5 py-4 border-t border-rule first:border-t-0"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{i.name}</div>
                  <div className="meta mt-0.5">{i.env}</div>
                </div>
                <div className="text-right">
                  <Pill tone={i.tone}>{i.status}</Pill>
                  <div className="meta mt-1">checked {i.lastChecked}</div>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader meta="SECURITY POLICIES" title="Admin-only controls" />
          <CardBody className="grid gap-3">
            <label className="flex items-center justify-between py-2 border-b border-rule">
              <div>
                <div className="text-sm">Require 2FA for admins</div>
                <div className="meta mt-0.5">TOTP via authenticator app</div>
              </div>
              <input type="checkbox" defaultChecked className="w-10 h-5 accent-primary" />
            </label>
            <label className="flex items-center justify-between py-2 border-b border-rule">
              <div>
                <div className="text-sm">IP allowlist on /admin/*</div>
                <div className="meta mt-0.5">—</div>
              </div>
              <input type="checkbox" defaultChecked className="w-10 h-5 accent-primary" />
            </label>
            <label className="flex items-center justify-between py-2 border-b border-rule">
              <div>
                <div className="text-sm">Auto-flag off-platform mentions</div>
                <div className="meta mt-0.5">Sends to /admin/sessions flagged tab</div>
              </div>
              <input type="checkbox" defaultChecked className="w-10 h-5 accent-primary" />
            </label>
            <Field label="Session JWT TTL (minutes)">
              <Input type="number" defaultValue={90} />
            </Field>
            <Field label="Audit log retention (days)">
              <Input type="number" defaultValue={730} />
            </Field>
            <button className="chip-cta mt-2">Save security policies</button>
          </CardBody>
        </Card>
      </div>

      <Card className="mt-5">
        <CardHeader meta="BRANDING" title="Public landing copy" />
        <CardBody className="grid md:grid-cols-2 gap-4">
          <Field label="Tagline">
            <Input defaultValue="Your IIT mentor, every single day until JEE." />
          </Field>
          <Field label="Live counter override" hint="Leave blank for live count">
            <Input
              type="number"
              defaultValue=""
              placeholder="0"
            />
          </Field>
        </CardBody>
      </Card>
    </Shell>
  );
}
