# MentorIIT

Private, paid coaching platform connecting JEE/IIT aspirants with verified IIT mentors. Three role-based portals (Student, Mentor, Admin), one Next.js monolith, deployed to a single Hostinger VPS.

See [`system design hitachi.md`](./system%20design%20hitachi.md) for the full spec and [`implementation-plan.md`](./implementation-plan.md) for phasing.

## Status (May 2026)

| Phase | Status |
|---|---|
| 0 Foundation | done |
| 1 DB schema + role middleware + auth utils | done (24 tables, 22 hot indexes) |
| 2 Razorpay webhook + provisioning (atomic) | done — DB adapter pending (Phase 2f) |
| 3 Chat domain (scanner, channels, sendMessage) | done — Soketi adapter pending |
| 4 Student portal (S.01–S.06) | done |
| 5 Mentor portal (M.01–M.06) | done |
| 6 100ms JWT issuance | done — session routes pending |
| 7 Admin portal (A.01–A.06) | done |
| 8 Doubts (claim logic) | done |
| 9 Env validator + audit log + PWA manifest | done |
| 10 Deploy runbook | [DEPLOY.md](./DEPLOY.md) |
| 11 Pilot checklist | [PILOT.md](./PILOT.md) |

**Tests:** 200+ across pure domain logic. `npm test` to run, `npm run test:coverage` for the report.

## Quick start

```bash
npm install
docker compose up -d                    # postgres + redis + soketi
cp .env.example .env.local              # fill in dev values
npm run db:generate && npm run db:migrate
npm run dev
```

Visit:
- `http://localhost:3000` — public landing
- `http://localhost:3000/student/dashboard` — set cookie `mentoriit_role=student`
- `http://localhost:3000/mentor/dashboard` — set cookie `mentoriit_role=mentor`
- `http://localhost:3000/admin/dashboard` — set cookie `mentoriit_role=admin`

> Cookie auth is dev-only. `middleware.ts` throws in production until Phase 1d wires signed session lookup.

## Architecture (high level)

```
Browser ─┬─ Next.js 14 (PM2 cluster)  ──┬─ Postgres 16 (Drizzle)
         │                              ├─ Redis 7 (BullMQ)
         ├─ Soketi (Docker)             └─ Cloudflare R2 (files)
         │
         └─ Razorpay · 100ms · MSG91 · Resend
```

Single Hostinger KVM 2 VPS. Same pattern as iTarang. See [DEPLOY.md](./DEPLOY.md).

## Project layout

```
app/                  Next.js App Router pages
  (public)            /, /checkout
  student/            S.01–S.06
  mentor/             M.01–M.06
  admin/              A.01–A.06
  api/                webhooks, health
components/           Shared UI (Shell)
db/schema/            Drizzle tables (7 domain files, 24 tables)
lib/                  Pure domain logic — TDD'd
  rbac, auth          Phase 1
  razorpay*, provisioning, webhook-handler
                      Phase 2
  content-scanner, channels, messages
                      Phase 3
  format, triage      Phase 4-5
  hms                 Phase 6
  doubts              Phase 8
  env, audit          Phase 9
lib/test-helpers/     In-memory store fakes
middleware.ts         Role-aware route guards
instrumentation.ts    Boot-time env validation
```

## What's deliberately NOT built yet

- **Drizzle-backed store adapters** for `ProvisioningStore` / `MessageStore` — pure logic is wired through ports; flipping to live Postgres is a Phase 2f exercise
- **Signed session auth** — middleware uses a plaintext cookie `mentoriit_role` for dev. **DO NOT DEPLOY** without wiring the signed `auth_sessions` lookup (middleware.ts throws in production as a tripwire)
- **Live Pusher/Soketi auth endpoint** — `lib/channels.ts` has the authz function, the route handler is one file away
- **PWA service worker** — manifest is in place, SW comes with Phase 9 polish
- **MSG91 WhatsApp OTP** — Brevo email magic-link will ship pilot; swap to MSG91 once templates approved

## License

Private — © iTarang.
