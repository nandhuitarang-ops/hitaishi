# Plan: Hitaishi Production Performance Fix

**Generated**: July 4, 2026
**Estimated Complexity**: High (8 critical, 6 high, 6 medium fixes across 3 sprints)

## Overview

Remediate all critical + high priority performance issues identified by the coordinated audit of 6 subagents (`@performance` × 4 flows, `@debugger`, `@database-administrator`). Fixes range from config tweaks to schema migrations to code refactors, ordered by severity.

## Subagent Configuration

Before starting any fix, register all needed subagents in `~/.config/opencode/opencode.jsonc`:

- `performance` — Web performance optimization (Lighthouse, caching, bundles)
- `debugger` — Code-level issue diagnosis and fix
- `database-administrator` — DB indexes, queries, connection pooling
- `security-auditor` — Security config review
- `security-engineer` — Security hardening
- `multi-agent-coordinator` — Orchestrate multi-file fixes
- `backend-developer` — API route optimization
- `frontend-design` — Frontend component optimization

Each task below specifies which subagent (`@agent-name`) to invoke for execution.

## Prerequisites

- Access to production env or staging mirror for DB migration testing
- Postgres client (psql or drizzle-kit) for running index migrations
- PM2 access for restart after config changes
- Upstash Redis account configured (already in env)

---

## Sprint 1: Critical Fixes

**Goal**: Eliminate top-7 blockers causing the most user-facing slowdowns.
**Demo/Validation**: Run `npm run build && npm run start` — page loads should feel noticeably faster. Run `npx lighthouse http://localhost:3000` — scores should improve.

---

### Task 1.1: Reduce bcrypt cost factor (5 min)
- **Subagent**: `@debugger`
- **Location**: `lib/auth.ts:4`
- **Description**: Change `BCRYPT_COST = 12` to `BCRYPT_COST = 10`. Cost 12 blocks the event loop ~300-400ms per auth op; cost 10 is ~80ms — still exceeds OWASP recommendations.
- **Files**: `lib/auth.ts`
- **Acceptance Criteria**: Login/signup completes in <200ms instead of >500ms
- **Validation**: `npm test` passes, manual login flow works

### Task 1.2: Remove artificial 1.5s load delay (10 min)
- **Subagent**: `@performance`
- **Location**: `components/TransitionLoader.tsx:21`
- **Description**: Change `MIN_LOAD_TIME = 1500` to `MIN_LOAD_TIME = 300`. The 1.5s minimum makes every navigation feel artificially slow.
- **Files**: `components/TransitionLoader.tsx`
- **Acceptance Criteria**: Page transitions no longer have a perceptible 1.5s delay
- **Validation**: Navigate between pages — transitions feel instant

### Task 1.3: Add 9 missing DB indexes (30 min)
- **Subagent**: `@database-administrator`
- **Location**: Create new migration file `db/migrations/0006_add_performance_indexes.ts`
- **Description**: Add these indexes via Drizzle migration:
  ```sql
  -- Critical
  CREATE INDEX IF NOT EXISTS idx_audit_log_actor_id ON audit_log(actor_id);
  CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
  CREATE INDEX IF NOT EXISTS idx_conversation_participants_user_id ON conversation_participants(user_id);
  CREATE INDEX IF NOT EXISTS idx_notifications_recipient_id ON notifications(recipient_id);
  CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
  CREATE INDEX IF NOT EXISTS idx_doubts_claimed_by ON doubts(claimed_by);
  
  -- High priority composite
  CREATE INDEX IF NOT EXISTS idx_assignments_mentor_status ON assignments(mentor_id, status);
  CREATE INDEX IF NOT EXISTS idx_sessions_status_scheduled ON sessions(status, scheduled_at);
  CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON messages(conversation_id, created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_doubts_student_status ON doubts(student_id, status);
  CREATE INDEX IF NOT EXISTS idx_sessions_host_scheduled ON sessions(host_id, scheduled_at);
  CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_leads_type ON leads(type);
  CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
  ```
- **Files**: New migration file + `db/schema/` files if schema annotations needed
- **Acceptance Criteria**: All indexes created without errors
- **Validation**: Run `npx drizzle-kit push` or use `EXPLAIN ANALYZE` on admin dashboard query to confirm index usage

### Task 1.4: Increase DB connection pool (5 min)
- **Subagent**: `@database-administrator`
- **Location**: `lib/db.ts:21`
- **Description**: Change `max: 5` to `max: 15`. Add `max_lifetime: 60 * 30` and `idle_timeout: 30`. With 2 PM2 instances and 12+ queries per dashboard load, 5 connections cause queueing.
- **Files**: `lib/db.ts`
- **Acceptance Criteria**: Under load, DB query queueing drops from ~500ms-2s to near zero
- **Validation**: Load test with `npx autocannon http://localhost:3000/student/dashboard -c 10 -d 30`

### Task 1.5: Limit chat message queries (15 min)
- **Subagent**: `@performance`
- **Locations**:
  - `app/student/chat/page.tsx:61` — add `.limit(50)`
  - `app/api/chat/conversations/route.ts:48` — add `.limit(100)` and cursor-based pagination
  - `app/mentor/chat/page.tsx` — same fix
  - `app/admin/chat/page.tsx` — same fix
- **Description**: Chat loads ALL messages with no LIMIT clause. Add `.limit()` to every message fetch. For API route, implement cursor-based pagination.
- **Files**: `app/student/chat/page.tsx`, `app/api/chat/conversations/route.ts`, `app/mentor/chat/page.tsx`, `app/admin/chat/page.tsx`
- **Acceptance Criteria**: Chat page loads only latest 50 messages; API returns max 100 per request
- **Validation**: Hard refresh chat page — payload size drops from ~200KB to ~10KB

### Task 1.6: Replace in-process rate limiter with Upstash Redis (30 min)
- **Subagent**: `@backend-developer`
- **Location**: `app/api/chat/conversations/[id]/messages/route.ts:13-21`
- **Description**: Replace the per-instance `Map<string, number[]>` rate limiter with `@upstash/ratelimit` sliding window. The current limiter is per-PM2-instance so it's 2x ineffective.
- **Files**: `app/api/chat/conversations/[id]/messages/route.ts`
- **Acceptance Criteria**: Rate limit of 20 msg/10s enforced globally across all PM2 instances
- **Validation**: Send 21 messages rapidly from same user — 21st is 429 blocked

### Task 1.7: Add Cache-Control headers to all GET API routes (20 min)
- **Subagent**: `@backend-developer`
- **Locations**: All `app/api/*/route.ts` GET handlers
- **Description**: Add appropriate Cache-Control headers:
  - Admin routes: `private, max-age=0, stale-while-revalidate=60`
  - Student/Mentor dashboard data: `private, max-age=30, stale-while-revalidate=120`
  - Chat: `no-store`
  - Static/public data (mentors listing, pricing): `public, max-age=300, stale-while-revalidate=3600`
- **Files**: Every `route.ts` in `app/api/`
- **Acceptance Criteria**: Every API response has a Cache-Control header
- **Validation**: `curl -I http://localhost:3000/api/mentors` shows Cache-Control header

### Task 1.8: Increase PM2 memory limit (5 min)
- **Subagent**: `@devops-engineer`
- **Location**: `ecosystem.config.js:12`
- **Description**: Change `max_memory_restart: "512M"` to `max_memory_restart: "1024M"`. Each instance gets 512MB instead of 256MB. Verify server has ≥2GB RAM.
- **Files**: `ecosystem.config.js`
- **Acceptance Criteria**: PM2 restarts instances at 1GB instead of 512MB
- **Validation**: `pm2 show hitaishi` — memory limit shows 1024M

---

## Sprint 2: High Priority Fixes

**Goal**: Fix caching strategy, composite indexes, loading states.
**Demo/Validation**: All page loads now have proper loading skeletons. Admin dashboard renders in <2s. Mentor dashboard sorts correctly.

---

### Task 2.1: Add composite indexes for top query patterns (20 min)
- **Subagent**: `@database-administrator`
- **Description**: Already included in Task 1.3 migration. Verify composite indexes are being used by running `EXPLAIN ANALYZE` on the slowest queries.
- **Files**: Same migration as Task 1.3
- **Validation**: `EXPLAIN ANALYZE SELECT ... FROM assignments WHERE mentor_id = X AND status = 'active'` shows `Index Scan`

### Task 2.2: Add missing loading.tsx files (15 min)
- **Subagent**: `@frontend-design`
- **Locations**:
  - `app/student/doubts/loading.tsx` (create)
  - `app/student/profile/loading.tsx` (create)
  - `app/student/resources/loading.tsx` (create)
  - `app/student/checkout/loading.tsx` (create)
  - `app/admin/sessions/loading.tsx` (create)
  - `app/mentor/doubts/loading.tsx` (create)
- **Description**: Create simple loading skeleton components for pages missing them. Use existing patterns from `app/student/dashboard/loading.tsx` as reference.
- **Files**: 6 new files
- **Acceptance Criteria**: All student sub-pages display a loading state during navigation
- **Validation**: Navigate to each page with slow 3G in DevTools — loading skeleton appears

### Task 2.3: Cache admin dashboard live sessions (20 min)
- **Subagent**: `@performance`
- **Location**: `lib/admin-cache.ts`, `app/admin/dashboard/page.tsx`
- **Description**: Add `getLiveSessions()` to `admin-cache.ts` with 15s revalidation. Move the live session query out of the page component into a cached function.
- **Files**: `lib/admin-cache.ts`, `app/admin/dashboard/page.tsx`
- **Acceptance Criteria**: Admin dashboard live sessions cached with 15s TTL
- **Validation**: First load takes normal time; second load within 15s returns instant

### Task 2.4: Add pagination to admin students list (30 min)
- **Subagent**: `@backend-developer`
- **Location**: `app/admin/students/page.tsx`
- **Description**: Implement cursor-based pagination replacing the hardcoded `STUDENT_LIMIT = 50`. Add "Previous" / "Next" buttons. Use URL search params for page state.
- **Files**: `app/admin/students/page.tsx`, `app/api/admin/students/route.ts` (if exists)
- **Acceptance Criteria**: Admin can paginate through all students, not just first 50
- **Validation**: Navigate to `/admin/students?page=2` — shows next set

### Task 2.5: Remove redundant getCurrentUser() in Shell.tsx (30 min)
- **Subagent**: `@debugger`
- **Location**: `components/Shell.tsx:88`
- **Description**: Remove `getCurrentUser()` call from Shell component. Pass `user` as prop from page components instead. Every page already calls auth — this doubles it.
- **Files**: `components/Shell.tsx`, `app/student/layout.tsx`, `app/mentor/layout.tsx`, `app/admin/layout.tsx`
- **Acceptance Criteria**: Only one auth check per page load instead of two
- **Validation**: Check Network tab — auth endpoints called once instead of twice

### Task 2.6: Implement server-side search for admin students (1 hr)
- **Subagent**: `@backend-developer`
- **Location**: `app/admin/students/page.tsx:27`
- **Description**: Replace the decorative search input with actual server-side filtering. Add query params for `?q=searchterm` and filter the DB query with `ILIKE`.
- **Files**: `app/admin/students/page.tsx`
- **Acceptance Criteria**: Typing in search box filters students on the server
- **Validation**: Search "test" — only matching students shown

### Task 2.7: Set immutable cache for static assets (10 min)
- **Subagent**: `@performance`
- **Location**: `next.config.mjs`
- **Description**: Add cache header rule for `/_next/static/:path*` → `public, max-age=31536000, immutable`
- **Files**: `next.config.mjs`
- **Acceptance Criteria**: All `_next/static/*` files served with immutable cache header
- **Validation**: `curl -I http://localhost:3000/_next/static/chunks/app/layout-*.js` shows `Cache-Control: public, max-age=31536000, immutable`

---

## Sprint 3: Medium Priority Fixes

**Goal**: Polish, proxy optimization, speculation rules, partial indexes.

---

### Task 3.1: Add partial index for doubt OR query (10 min)
- **Subagent**: `@database-administrator`
- **Description**: Add partial index: `CREATE INDEX IF NOT EXISTS idx_doubts_open_or_claimed ON doubts(student_id, status, claimed_by) WHERE status = 'open' OR (status = 'claimed' AND claimed_by IS NOT NULL);`
- **Files**: New migration or append to Task 1.3 migration
- **Validation**: `EXPLAIN ANALYZE` on mentor doubts query shows `Index Scan`

### Task 3.2: Optimize DB proxy — use direct export (15 min)
- **Subagent**: `@debugger`
- **Location**: `lib/db.ts:34-43`
- **Description**: Replace the Proxy pattern that creates a new bound function on every property access with a direct export: `export const db = getDb()`. This reduces GC pressure.
- **Files**: `lib/db.ts`
- **Acceptance Criteria**: No behavior change; GC pressure reduced
- **Validation**: `npm test` passes, spot-check 3 pages load correctly

### Task 3.3: Add unstable_cache to student dashboard (45 min)
- **Subagent**: `@performance`
- **Location**: `app/student/dashboard/page.tsx`
- **Description**: Wrap non-personalized data queries in `unstable_cache` with 30s revalidation. Cache session count, mentor request status, resources count.
- **Files**: `app/student/dashboard/page.tsx`, `lib/student-cache.ts` (new)
- **Acceptance Criteria**: Student dashboard makes fewer DB queries on repeat visits within 30s
- **Validation**: Navigate away and back within 30s — cached data loads instantly

### Task 3.4: Add speculation rules for instant navigations (15 min)
- **Subagent**: `@performance`
- **Location**: `app/layout.tsx`
- **Description**: Add `<script type="speculationrules">` to root layout for `prerender` with `eagerness: "moderate"`. This pre-renders likely-next pages on hover.
- **Files**: `app/layout.tsx`
- **Acceptance Criteria**: Hovering over a link triggers pre-rendering
- **Validation**: Open DevTools → hover a nav link → network shows pre-rendering

### Task 3.5: Monitor leads table — add email index (10 min)
- **Subagent**: `@database-administrator`
- **Description**: `CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);`
- **Files**: Migration
- **Validation**: Duplicate lead check queries use index

---

## Testing Strategy

| Sprint | Test Method | Tool |
|--------|------------|------|
| Sprint 1 | Manual + Lighthouse | `npx lighthouse http://localhost:3000/student/dashboard` |
| Sprint 1 | Load test | `npx autocannon -c 25 -d 60 http://localhost:3000/api/health` |
| Sprint 1 | Index verification | `psql -c "EXPLAIN ANALYZE [slow query]"` |
| Sprint 2 | Page load verification | Chrome DevTools Network + Performance tabs |
| Sprint 2 | Cache header check | `curl -I [url]` |
| Sprint 3 | GC pressure | Chrome DevTools Memory tab |
| All | Unit tests | `npm test` (must not regress) |

## Potential Risks & Gotchas

1. **DB migration in production**: Adding indexes is non-blocking in PG16 (`CREATE INDEX CONCURRENTLY`), but remember to use `CONCURRENTLY` to avoid table locks. Drizzle may not add this automatically — verify the generated SQL.
2. **bcrypt cost change**: If users have existing sessions, they are unaffected. Only new password hashes and comparisons use the new cost.
3. **Rate limiter swap**: The in-process limiter is removed — if Upstash is down, rate limiting fails open (allows all requests). Add a fallback or circuit breaker.
4. **PM2 memory change**: If the server has <2GB RAM, increasing to 1024M per instance may cause OOM at the OS level. Check `free -m` first.
5. **Cache-Control on admin routes**: Stale data could confuse admins. Use `stale-while-revalidate` rather than `max-age` alone to ensure background refresh.
6. **Shell.tsx refactor**: Every page layout that uses `<Shell>` needs the `user` prop added. This is a potentially broad change — grep all usages first.
7. **Proxy removal in `lib/db.ts`**: The Proxy ensures lazy initialization. Direct export will eagerly connect on module import during server startup. Ensure `getDb()` handles connection race conditions.

## Rollback Plan

| Task | Rollback |
|------|----------|
| All config changes | `git checkout -- [file]` + `pm2 restart` |
| DB indexes | `DROP INDEX IF EXISTS idx_[name]` (reversible) |
| Rate limiter swap | Revert to in-process limiter (keep it as fallback) |
| DB pool change | Revert to `max: 5` |
| Code refactors | `git revert [commit]` |
| Migration | `npx drizzle-kit drop` or manual `DROP INDEX` |
