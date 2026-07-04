# SECURITY.md — Hitaishi Codebase Security Audit

**Audit date:** 2026-06-26
**Scope:** `C:\Users\brije\OneDrive\Pictures\Documents\Hitaishi-main` (research-only — no implementation files were modified)
**Stack:** Next.js 16.2.9 (App Router, `proxy.ts` request gate), Supabase Postgres (Drizzle ORM), Supabase Realtime, bcrypt sessions, Razorpay / MSG91 / Resend / Soketi / R2 integrations.
**ASVS reference level:** 2

---

## 1. Threat Model Summary

### Assets
| Asset | Sensitivity | Store |
|-------|-------------|-------|
| User PII (name, email, phone, city, institute, JEE rank) | High | `users`, `profiles`, `mentor_verifications` |
| Password hashes | Critical | `users.password_hash` |
| Session tokens | Critical | `auth_sessions.session_token` |
| Sales leads (name, email, phone, message) | High | `leads` |
| Chat messages + content-scan flags | High | `messages`, `conversations` |
| Payment data (Razorpay order/payment IDs, amounts) | High | `payments`, `payouts`, `refunds`, `subscriptions` |
| Session / meet links | Medium | `sessions.meet_link` |
| Mentor verification documents (LinkedIn, docs JSON) | High | `mentor_verifications` |
| Audit log | Medium | `audit_log` |

### Attack Surfaces
1. **Next.js API routes** (`/api/leads`, `/api/chat/**`, `/api/auth/demo`, `/api/mentor/sessions/create`, `/api/admin/sessions/[id]/observe`, `/api/session/[id]/chat`, `/api/health`).
2. **Supabase PostgREST** auto REST API at `https://<project>.supabase.co/rest/v1/` — reachable with the public `NEXT_PUBLIC_SUPABASE_ANON_KEY` (embedded in the client bundle at `lib/realtime/client.ts:9`).
3. **Supabase Realtime** broadcast + `postgres_changes` channels (`lib/realtime/server.ts`, `lib/realtime/client.ts`).
4. **Auth** — email/password (bcrypt) + a demo login shortcut.
5. **Request gate** — `proxy.ts` (Next.js 16 renamed `middleware` → `proxy`; confirmed against the v16 docs index). Enforces session-cookie presence, admin Basic Auth, and `/api/leads` Basic Auth for non-POST.
6. **Third-party integrations** — Razorpay (payments/webhooks), MSG91 (SMS/WhatsApp), Resend (email), Soketi/Pusher (realtime fallback), Cloudflare R2 (files).
7. **File uploads / resources** — `resources` table + R2 (`r2_key`, `external_url`).

---

## 2. OWASP Top 10 (2021) Coverage Matrix

| OWASP Category | Status | Notes |
|----------------|--------|-------|
| A01 Broken Access Control | **GAP** | RLS missing on ~20 tables; demo admin login; realtime broadcast not auth-gated. |
| A02 Cryptographic Failures | **GAP** | `users.password_hash` and `auth_sessions.session_token` readable via PostgREST without RLS. |
| A03 Injection (XSS) | Adequate | No `eval`/`innerHTML`/`dangerouslySetInnerHTML` in app source; React text rendering; CSP present (but `unsafe-inline` scripts in prod). |
| A04 Insecure Design | Weak | Rate limiting inconsistent; audit logging built but not wired. |
| A05 Security Misconfiguration | **GAP** | `ADMIN_USER`/`ADMIN_PASSWORD` not boot-validated; docker-compose defaults; CSP `unsafe-inline`. |
| A06 Vulnerable Components | Unknown | No `npm audit` run in this research-only pass; `package-lock.json` present. |
| A07 ID & Auth Failures | **GAP** | Demo login active in all envs; session-gate is presence-only. |
| A08 Integrity Failures | Adequate | No unsafe deserialization; Drizzle typed queries. |
| A09 Logging/Monitoring Failures | Weak | `buildAuditEntry` exists with redaction but no route handler persists audit rows. |
| A10 SSRF | Adequate | No user-driven outbound fetch/URL inclusion found; `meet.ts` uses a static host. |

---

## 3. Findings

| # | Severity | Description | Location | Status | Remediation |
|---|----------|-------------|----------|--------|-------------|
| F1 | **Critical** | **RLS enabled on only 3 of ~23 tables.** Migrations contain zero `ENABLE ROW LEVEL SECURITY` / `CREATE POLICY` statements. Only `scripts/add-chat-rls.ts` covers `messages`, `conversations`, `conversation_participants`. The public anon key (in the client bundle) can therefore read — and by default write — `users` (incl. `password_hash`), `auth_sessions` (incl. `session_token` → full session hijacking), `leads` (PII), `payments`, `profiles`, `mentor_verifications`, etc. via the Supabase REST API. | `db/migrations/0000_small_mister_fear.sql` (entire file); `db/migrations/0002_thankful_veda.sql`; `scripts/add-chat-rls.ts:12-20`; anon key at `lib/realtime/client.ts:9` | Missing | Enable RLS + least-privilege policies on **every** table; add the RLS statements to a tracked migration (not a one-off script); revoke default `anon` grants on sensitive columns; never expose `password_hash` / `session_token` (consider a view or column-level deny). |
| F2 | **Critical** | **Demo login endpoint is production-active with no env guard.** `GET /api/auth/demo?role=admin` logs in the admin demo account using the hardcoded password `demo1234`; `demoLoginAction` does the same. Neither checks `NODE_ENV`. If demo accounts were seeded into the prod DB, anyone can become admin in one request. | `app/api/auth/demo/route.ts:15-36`; `app/login/actions.ts:62-70`; `db/seed.ts:15-37`; whitelisted as public at `proxy.ts:15` | Missing | Gate demo login behind `NODE_ENV !== "production"` (hard-block in prod); never seed demo/admin accounts into prod; rotate admin credentials; remove the route from the public allowlist in prod. |
| F3 | **High** | **Supabase Realtime broadcast channels are not auth-gated.** The server publishes full message bodies on `messages-conv-${conversationId}` using the service-role key; any client can subscribe to that channel with the public anon key. Realtime *broadcast* channels bypass RLS, so an attacker with the anon key + a conversation UUID can intercept live messages. | `lib/realtime/server.ts:36-44`; `lib/realtime/client.ts:31-60` | Missing | Authorize channel subscriptions server-side (Soketi/Supabase channel auth endpoint using `isAuthorizedForChannel`); or move delivery to `postgres_changes` only (which is RLS-enforced) and drop broadcast payloads; treat conversation IDs as untrusted secrets. |
| F4 | **High** | **`/api/leads` (main app) has no rate limiting.** The legacy-landing copy uses `@upstash/ratelimit` (5 POST/min/IP); the active main-app handler omits it entirely, leaving the public POST open to spam/flooding. | `app/api/leads/route.ts:15-65` (none); compare `legacy-landing/app/api/leads/route.ts:2,18-30` | Missing | Port the Upstash sliding-window limiter from the legacy route; the dependency is already in `package.json`. |
| F5 | **High** | **Chat rate limiter is in-process and breaks under clustering.** A `Map<string, number[]>` limits 20 msgs/10s but is per-instance. `ecosystem.config.js` runs `instances: 2, exec_mode: "cluster"`, so the effective cap is 2× and resets on each restart/deploy. | `app/api/chat/conversations/[id]/messages/route.ts:12-22`; `ecosystem.config.js:10` | Weak | Replace with the already-installed `@upstash/ratelimit` (shared Redis state) keyed by user id. |
| F6 | **High** | **Request-gate session check is presence-only.** `proxy.ts` only tests `Boolean(req.cookies.get(SESSION_COOKIE)?.value)` — any non-empty cookie value passes the gate and avoids the `/login` redirect. Genuine validation occurs later in `getCurrentUser()` per route, but the gate itself does not verify the token against the DB. | `proxy.ts:66-73` | Weak | Either accept this as defense-in-depth (document it) or validate the session token in the gate via a lightweight DB/Redis lookup; keep the per-route `getCurrentUser()` as the authoritative check. |
| F7 | **Medium** | **Admin Basic-Auth credentials are not boot-validated.** `proxy.ts` requires `ADMIN_USER` / `ADMIN_PASSWORD` for `/admin/*` and `/api/leads` GET/DELETE, but these vars are absent from `.env.example` and from `lib/env.ts` `validateEnv`. If unset the system fails *closed* (401 on all admin access) with no fail-fast signal; if set weakly there is no enforcement. | `proxy.ts:37-39`; `lib/env.ts:23-37`; `.env.example` | Weak | Add `ADMIN_USER`/`ADMIN_PASSWORD` to the production env schema with a min-length/refine rule; fail fast in `instrumentation.ts` if missing in prod. |
| F8 | **Medium** | **CSP permits `unsafe-inline` for scripts in production.** `script-src 'self' 'unsafe-inline'` weakens XSS mitigation. (`unsafe-eval` is correctly dev-only.) | `next.config.ts:7-9` | Weak | Move to a nonce-based CSP (`script-src 'self' 'nonce-...'`) and drop `unsafe-inline`; tighten `style-src` next. |
| F9 | **Medium** | **Realtime list subscription uses anon key with no Supabase-Auth session.** `subscribeToConversationList` listens to `event: "*"` on `messages` with `auth: { persistSession: false }`, so `auth.uid()` is null. RLS (enabled on `messages`) will block rows — which is safe but means the feature is likely non-functional, and any future RLS relaxation would silently leak all messages. | `lib/realtime/client.ts:66-82` | Weak | Authenticate the realtime client per-user (pass a Supabase-Auth session) so RLS filters correctly; or remove the wildcard subscription. |
| F10 | **Medium** | **docker-compose ships default credentials.** `POSTGRES_PASSWORD: postgres` and `SOKETI_DEFAULT_APP_SECRET: app-secret`. Acceptable for local dev but dangerous if reused in staging. | `docker-compose.yml:7,23` | Weak | Document these as dev-only; require overrides via `.env` for any non-local deploy. |
| F11 | **Low** | **One route echoes internal error messages.** `/api/mentor/sessions/create` returns `err.message` on 500, which can leak DB/internal details. | `app/api/mentor/sessions/create/route.ts:125-130` | Weak | Return a generic message; log the detail server-side (the other routes already follow this pattern). |
| F12 | **Low** | **Audit logging is built but not wired.** `buildAuditEntry` (with sensitive-key redaction) exists, but no route handler was found that persists audit rows to `audit_log`. | `lib/audit.ts:38-48`; (no callers in `app/api/**`) | Missing | Call `buildAuditEntry` + insert into `audit_log` for sensitive actions (login, session create, admin observe, lead delete). |
| F13 | **Low** | **Hardcoded demo password in source.** `"demo1234"` appears in seed, demo route, and `demoLoginAction`. | `db/seed.ts:18,25,32`; `app/api/auth/demo/route.ts:32`; `app/login/actions.ts:67` | Weak | See F2 — block in prod and remove demo accounts from prod. |

---

## 4. Controls Verified as Adequate (No Action)

| Control | Evidence |
|---------|----------|
| Password hashing | bcrypt cost 12 (`lib/auth.ts:4,10`); timing-attack mitigated with dummy hash on missing user (`app/login/actions.ts:38-43`). |
| Session tokens | 32 random bytes hex (`lib/auth.ts:21-23`); httpOnly + SameSite=Lax + secure-in-prod + 7-day expiry (`lib/session.ts:21-31`); DB-validated with `expiresAt` + `deletedAt` + `status` checks (`lib/session.ts:46-81`). |
| SQL injection | All queries parameterized via Drizzle + `postgres` tagged templates; no string-concatenated SQL, no `.unsafe()` in app code. |
| Input validation | Zod schemas on leads (`lib/leadSchemas.ts`), chat body (`messages/route.ts:24-26`), login (`actions.ts:12-15`); UUID regex on path params; 32 KB body cap + honeypot on leads (`leads/route.ts:8,42-45`). |
| XSS output encoding | No `eval`/`innerHTML`/`dangerouslySetInnerHTML`/`document.write` in application source; messages rendered as React text children. |
| Security headers | HSTS, `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, CSP, admin `noindex`/`no-store` (`next.config.ts:21-36`). |
| Env validation at boot | `instrumentation.ts` calls `validateEnv` and `process.exit(1)` in prod; rejects default-looking `AUTH_SECRET` (`lib/env.ts:3-21`). |
| RBAC | Per-layout `requireRole` for student/mentor/admin (`app/*/layout.tsx`); per-API role checks; channel authz `isAuthorizedForChannel` (`lib/channels.ts:26-40`). |
| Secrets hygiene | `.env.example` values are empty placeholders; `.env` is gitignored (`.gitignore:6-8`); service-role key used server-side only (`lib/realtime/server.ts:8`); `NEXT_PUBLIC_*` limited to URL + anon key (designed-public). |
| DB transport | `ssl: "require"` on all Postgres connections (`lib/db.ts:22`; `db/seed.ts:45`; `scripts/*.ts`). |
| Content safety | Chat content scanner detects phone/email/off-platform escalation (`lib/content-scanner.ts`); message body capped at 4000 chars. |
| CORS | No permissive CORS — API routes are same-origin by default (no `Access-Control-Allow-*` headers set). |

---

## 5. Prioritized Remediation List

**P0 — Fix before any production deploy**
1. **(F1)** Enable RLS + least-privilege policies on **all** tables (especially `users`, `auth_sessions`, `leads`, `payments`, `profiles`, `mentor_verifications`). Move RLS into a tracked migration. Revoke `anon` access to `password_hash` and `session_token` columns. *This single fix closes the password-hash and session-token disclosure paths.*
2. **(F2)** Hard-block demo login (`/api/auth/demo` + `demoLoginAction`) when `NODE_ENV === "production"`; ensure demo/admin accounts are never seeded into prod; rotate admin credentials.

**P1 — Fix before launch**
3. **(F3)** Add server-side authorization to Realtime channel subscriptions (channel-auth endpoint using `isAuthorizedForChannel`) or switch to RLS-enforced `postgres_changes` only.
4. **(F4)** Port the Upstash rate limiter to the main-app `/api/leads` POST.
5. **(F5)** Replace the in-process chat rate limiter with shared `@upstash/ratelimit` (already a dependency).
6. **(F6)** Decide whether the `proxy.ts` session gate is defense-in-depth (document it) or validate the token in-gate.

**P2 — Harden**
7. **(F7)** Add `ADMIN_USER`/`ADMIN_PASSWORD` to the production env schema; fail fast if missing.
8. **(F8)** Move CSP to nonce-based scripts; drop `unsafe-inline`.
9. **(F9)** Authenticate the Realtime client per-user so RLS filters `subscribeToConversationList` correctly.
10. **(F10)** Mark docker-compose credentials dev-only; require env overrides for non-local.

**P3 — Hygiene**
11. **(F11)** Stop returning `err.message` from `/api/mentor/sessions/create`.
12. **(F12)** Wire `buildAuditEntry` into sensitive route handlers and persist to `audit_log`.
13. **(F13)** Remove demo password hardcoding (covered by F2).

---

## 6. Open Items / Assumptions

- **Dependency vulnerabilities (A06):** not assessed in this research-only pass. Run `npm audit --omit=dev` and address high/critical advisories before launch.
- **Webhook signature verification:** `/api/webhooks/*` routes are referenced in the RBAC allowlist (`lib/rbac.ts:17-20`) but no webhook route files exist in `app/api/` yet. Verify HMAC signature checks (Razorpay `RAZORPAY_WEBHOOK_SECRET`, MSG91, Resend) when these ship.
- **R2 / file-upload validation:** no upload route was found in this audit; validate MIME/type/size limits and path-traversal safety when implemented.
- This audit did not execute the app or DB; RLS absence is inferred from migration + script source. Confirm the live DB state with `\d+ <table>` / Supabase advisors before relying on this report for go-live.
