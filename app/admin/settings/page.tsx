import { Shell } from "@/components/Shell";
import { Card, CardBody, CardHeader, Field, Input, Pill } from "@/components/ui";

// TODO(phase-2f): persist to a system_config jsonb table; reads default from process.env
const featureFlags = [
  { key: "betaDoubtAuction", label: "Beta — doubt auction", value: false, desc: "Mentors bid response times on new doubts." },
  { key: "groupSessions", label: "Group sessions", value: true, desc: "12-student group rooms via 100ms." },
  { key: "mentorPayoutSelfServe", label: "Mentor payout self-serve", value: false, desc: "Mentors can request off-cycle payouts." },
  { key: "newOnboarding", label: "New onboarding (S.02 v2)", value: true, desc: "3-step student onboarding with goal capture." },
];

const integrations = [
  { name: "Razorpay", env: "RAZORPAY_KEY_ID", status: "Connected", tone: "primary" as const, lastChecked: "2 min ago" },
  { name: "100ms", env: "HMS_APP_KEY", status: "Connected", tone: "primary" as const, lastChecked: "8 min ago" },
  { name: "MSG91 (SMS)", env: "MSG91_AUTH_KEY", status: "Connected", tone: "primary" as const, lastChecked: "4 min ago" },
  { name: "Resend (Email)", env: "RESEND_API_KEY", status: "Degraded", tone: "warn" as const, lastChecked: "12 min ago" },
];

export default function AdminSettingsPage() {
  return (
    <Shell
      role="admin"
      active="settings"
      pageCode="A.08 — SETTINGS & CONFIGURATION"
      pageTitle="Platform settings"
      pageSubtitle="Feature flags, pricing, integrations, security policies."
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
          <CardHeader meta="PRICING" title="Plan amounts (paise)" />
          <CardBody className="grid gap-4">
            <Field label="JEE Adv · 6 months">
              <Input
                type="number"
                defaultValue={1499900}
                step={100}
              />
            </Field>
            <Field label="JEE Main · 6 months">
              <Input type="number" defaultValue={849900} step={100} />
            </Field>
            <Field label="Mentor share %">
              <Input type="number" defaultValue={20} min={0} max={100} />
            </Field>
            <Field label="Refund window (days)">
              <Input type="number" defaultValue={7} min={0} max={30} />
            </Field>
            <button className="chip-cta mt-2">Save pricing</button>
          </CardBody>
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
                <div className="meta mt-0.5">3 IPs whitelisted</div>
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
          <Field label="Live counter override">
            <Input
              type="number"
              defaultValue={128}
              placeholder="Leave blank for live count"
            />
          </Field>
        </CardBody>
      </Card>
    </Shell>
  );
}
