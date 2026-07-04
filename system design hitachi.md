# A closed coaching platform *for the kids who actually want IIT.*

**Hitaishi — System Design Document v0.1**
*Drafted for Aditya / iTarang*

---

> Hitaishi is a private mentorship & guidance platform that connects JEE/IIT aspirants with verified IIT mentors. Every user is hand-picked or paid in — no public signups, no spam, no fraud. This document specifies the full system: three role-based portals, the tech stack behind them, and the UI of every page in v1.

## 01. Overview

### What we're building

A web platform with **three separate portals**, one shared backend, and a strict access model: a student pays through the platform → automation issues credentials → student logs into their own portal and is matched with a mentor. The platform is the single space where they chat, share files, and join live sessions.

The CEO/admin portal sits above all of this: it sees everything, controls access, manages who's a mentor, and steps in when something goes wrong.

### Three principles that drive every decision

- **Closed by default.** No one gets in without paying or being invited. This kills the trust problem before it starts.
- **Automate the common case, human-handle the edges.** Payments → access happens automatically. Disputes, refunds, bad mentors → admin handles by hand.
- **Oversight is a feature, not surveillance.** Admin can see chats and sessions because parents are paying for quality. Disclosed clearly in onboarding.

> **The platform's job is not to be impressive. It's to be the boring, reliable place where a 17-year-old in Indore can talk to an IIT-Bombay second-year who's actually been through it.**

## 02. The Three Portals

Each portal is a distinct application — separate URL, separate UI, separate permissions — but they all talk to the same backend and database. A user has exactly one role. The CEO portal is the only one that can see across all three.

**Student Portal** (Role 01 — Student)
  JEE/IIT aspirants who pay for access. They get matched with one mentor, join 1:1 and group sessions, message their mentor, post doubts that their mentor answers, and download shared resources.
  *6 pages*

**Mentor Portal** (Role 02 — Mentor)
  Verified IIT seniors / alumni / professionals running structured long-form mentorship. They see their assigned students, conduct 1:1 and group sessions, answer their students' doubts, share resources, and write progress notes.
  *6 pages*

**Admin Portal** (Role 03 — CEO / Admin)
  Internal team (you). Verifies mentors, manages access, monitors all sessions and chats, handles payments and refunds, and sees system-wide analytics. The control room for the entire platform.
  *6 pages*

#### Why mentors own both mentorship and doubt-clearing

Keeping doubts inside the mentor relationship is a deliberate choice. A mentor who already knows the student's syllabus, weak spots, and pace can answer a doubt with the right depth — a stranger from a queue can't. It also keeps the platform simple in v1: one trust relationship, one chat thread, one earnings ledger per mentor. A separate fast-doubt-clearing tier can be added in v2 once we know what students actually struggle with.

## 03. Tech Stack & Why

The stack is chosen for three reasons: **(a)** you already know parts of it from iTarang, so the team can move fast; **(b)** it's boring and stable — every piece has been used by thousands of production apps; **(c)** it scales from 50 to 50,000 users without a rewrite.

**Frontend Framework** — Next.js 15 App Router · React 19 · TypeScript
  Already the iTarang stack. Server components reduce client-side JS. Built-in routing, image optimization, API routes if needed. One framework for all four portals via middleware-based role routing.

**UI Layer** — Tailwind CSS + shadcn/ui + Radix primitives
  shadcn gives you accessible, owned components (you copy code, no npm dep). Tailwind keeps styling co-located. Radix handles focus/keyboard correctly — important for an education platform used on cheap laptops.

**Mobile Experience** — Progressive Web App via next-pwa, installable, offline-capable
  **Biggest single student-retention win.** Students install the platform as a home-screen icon — feels like a native app, opens instantly, sends push notifications, caches resources for offline reading. ~1 week of engineering vs ~3 months for React Native. PWAs that students install have 3-4x the return-visit rate of bookmarked websites. Built with `next-pwa`; service worker handles caching of static assets, PDFs, and the last 10 chat messages per conversation.

**Database** — PostgreSQL 16 via Drizzle ORM
  Same as iTarang. Postgres handles relational data (users → sessions → messages) and JSON columns when needed. Drizzle gives type-safe queries without the heaviness of Prisma. Self-hosted on the Hostinger VPS — same Postgres instance pattern you already run for iTarang.

**Authentication** — NextAuth.js v5 WhatsApp OTP primary, email fallback
  **Big change for student UX.** Indian students live in WhatsApp, not email — OTPs delivered there arrive in 2 seconds, never end up in Promotions tab. Primary login is phone number → WhatsApp OTP via MSG91. Email magic link kept as fallback for the rare student without WhatsApp. Sessions stored in Postgres. Role-based middleware redirects users to the right portal at every request.

**Real-Time Chat** — Soketi self-hosted on the VPS, Pusher-API compatible
  Soketi is the open-source, Pusher-compatible WebSocket server. Runs as a single Docker container on the Hostinger VPS — adds ~5% CPU, no extra hardware. Pusher SDK clients work without changes. Critical for student UX: latency is half what Pusher gives you because the server is in India, not US/EU. Graduate to managed Ably or Pusher only if VPS becomes the bottleneck.

**Video Sessions** — 100ms (Indian, alt: Daily.co)
  100ms is built in India, has Hindi-language docs and INR billing, and supports recording out of the box (needed for admin oversight). 1:1 and group rooms via the same SDK. Daily.co is the Western alternative if 100ms uptime ever disappoints.

**File Storage** — Cloudflare R2 S3-compatible, zero egress
  Mentors share PDFs and notes. R2 has the same API as S3 but no egress fees — students downloading the same chapter PDF 200 times costs nothing. Pre-signed URLs for access control.

**Background Jobs** — BullMQ + Redis Upstash, with circuit breaker
  You already run this stack on iTarang and have hardened it. Used here for: scheduling session reminders (SMS/email), async file processing, payout calculations, retry logic for failed webhooks.

**Payments** — Razorpay Subscriptions + Routes for payouts
  India-first. UPI, cards, netbanking, EMI. Razorpay Routes handles paying mentors directly from collected payments — saves you running your own settlement logic. Webhook → automated access provisioning.

**Messaging (OTP & Notifications)** — MSG91 WhatsApp + Resend WhatsApp for OTPs, email for receipts
  MSG91 WhatsApp Business API for login OTPs and time-sensitive alerts (₹0.35/OTP, delivered in 2 seconds, always read). DLT-compliant SMS fallback for the 5% of students without WhatsApp. Resend for transactional email (receipts, session summaries, weekly progress reports) — clean API, good deliverability.

**Hosting** — Hostinger VPS (KVM 2) + Cloudflare ~₹500–700/mo, scales to KVM 4/8
  Hostinger KVM 2 (2 vCPU, 8GB RAM, 100GB NVMe) hosts the full stack — Next.js (PM2), Postgres, Soketi (Docker), BullMQ workers. Same VPS pattern as iTarang, so your team already knows the deployment muscle. Cloudflare in front for CDN, DDoS protection, free SSL, and R2 lives on the same Cloudflare account. Upgrade to KVM 4 around 200 active students, KVM 8 around 500.

**Monitoring** — Sentry + PostHog errors + product analytics
  Sentry for runtime errors (catches the bug before the user emails you). PostHog for funnels — "of 100 students who land on the payment page, how many actually pay" — and session replays when something feels off.

#### What we're explicitly *not* using and why

- **No mobile native apps in v1.** A responsive web app on phones is enough. Building React Native triples the effort. Add it once retention is proven.
- **No microservices.** One Next.js monolith with clean module boundaries. Microservices solve a problem you don't have at this scale and create five new ones.
- **No GraphQL.** tRPC if internal API typing matters; otherwise plain Next.js Server Actions and route handlers. GraphQL is overkill for one client.
- **No AI features in v1.** Tempting to add an "AI doubt solver" — resist. Real mentors are the product. AI can come later as a mentor-assist tool.

## 04. System Architecture

Three portals, one backend, several external services. Everything authenticated through NextAuth; everything role-checked at the middleware layer before any data is touched.

```text
System Architecture:
  Clients: Student Portal /student/* | Mentor Portal /mentor/* | Admin Portal /admin/*
  Edge: Cloudflare CDN + WAF
  Application [Hostinger VPS]: Next.js 15 monolith (PM2) + Soketi (Docker, chat) + BullMQ workers — role-based middleware, NextAuth sessions, all on one KVM 2 box
  Data & State [Hostinger VPS]: PostgreSQL 16 on-VPS, primary store | Redis on-VPS, queues + cache | Cloudflare R2 files + recordings
  External APIs: Razorpay payments | 100ms video | MSG91 WhatsApp OTP | Resend email
```

#### Critical flow: payment → access (WhatsApp-first)

Student pays on landing page → Razorpay returns success → Razorpay webhook fires to `/api/webhooks/razorpay` → BullMQ job `provision-student-access` runs → creates user row, generates credentials, assigns mentor (round-robin or admin-curated), sends welcome WhatsApp message with deep link to login → student taps link, receives WhatsApp OTP, logs in. The whole thing is idempotent — duplicate webhooks don't double-create users.

---

## Portal 01 / Student: Student Portal

Six pages. Designed for a tired 17-year-old on a 6-inch phone screen at 11pm. Mobile-first, single primary action per screen, friction reduced to nearly zero. Login persists; once they're in, they're in.

### S.01 — Payment / Landing Page

*Purpose:* Public page (no login). The only way to enter the platform. Explains what students get, the price, and a single "Pay & Get Access" button. Razorpay checkout opens inline.

*[Wireframe mockup omitted — see HTML version for visual]*

*Wireframe: S.01. Payment / Landing — public, conversion-focused*

**Key UX choices:** One CTA visible above the fold. No "browse mentors" — that creates choice paralysis. Trust signals (Razorpay badge, refund policy) just above the price. Razorpay opens as overlay, not redirect, so they never lose the page.

### S.02 — Student Dashboard

*Purpose:* Home after login. Shows the three things that matter: the mentor (with chat shortcut), upcoming sessions, and recent shared resources. Everything else is a tab away.

*[Wireframe mockup omitted — see HTML version for visual]*

*Wireframe: S.02. Dashboard — single screen, three priorities*

**Key UX choices:** Mentor card is the largest element — relationship is the product. "Day 47/180" creates accountability. Stats are aspirational, not vanity. No notifications bell — important things are pushed via SMS, the dashboard isn't a notification center.

### S.03 — Mentor Chat

*Purpose:* The most-used screen on the platform. Standard messaging UI: text, file attachments, image preview, scheduled session inline cards. Nothing fancy — just reliable.

*[Wireframe mockup omitted — see HTML version for visual]*

*Wireframe: S.03. Mentor Chat — async-first, sync-capable*

**Key UX choices:** "Schedule call" is in the chat header, not a separate page — most calls are decided inside a conversation. File attachments render inline. Online status visible but not weaponized — no read receipts (avoids the WhatsApp anxiety pattern).

### S.04 — Sessions (Live + Past)

*Purpose:* List of upcoming group sessions and 1:1 calls, plus a history of past sessions with their recordings (if recorded). Joining is one click — opens the 100ms video room.

*[Wireframe mockup omitted — see HTML version for visual]*

*Wireframe: S.04. Sessions — upcoming highlighted, past archived*

**Key UX choices:** Sessions starting within 15 minutes get a highlighted border and "Join now" CTA. Recordings auto-uploaded to R2 after session ends — link appears the next day, not instantly (avoid showing broken state during transcoding).

### S.05 — Resources Library

*Purpose:* Every PDF, note, and link a mentor has shared. Filterable by subject and date. Searchable. Downloads served via signed Cloudflare R2 URLs.

*[Wireframe mockup omitted — see HTML version for visual]*

*Wireframe: S.05. Resources — searchable, filterable, fast*

**Key UX choices:** Subject pills above content because students browse by subject 90% of the time. Resources include both file uploads and external links (mentors share YouTube videos and articles). Each item shows who shared it — credit reinforces relationship.

### S.06 — Profile & Plan

*Purpose:* Student's own info, plan details, payment history, and account actions. Minimal — most settings (notifications, password) are below the fold or in a sub-page.

*[Wireframe mockup omitted — see HTML version for visual]*

*Wireframe: S.06. Profile & Plan — focused, minimal*

**Key UX choices:** Plan card shows expiry prominently — drives renewals. Subject focus tags feed the matching algorithm so the platform improves recommendations over time. No "delete account" hidden in settings — that's a request that goes to admin (intentional friction, matches the closed-platform model).

---

## Portal 02 / Mentor: Mentor Portal

Six pages. Designed for someone who has 5 students and 90 minutes between IIT classes to mentor them well. Density over decoration — they need to see all their students at once and know who needs attention right now.

### M.01 — Mentor Dashboard

*Purpose:* Triage screen. Shows assigned students sorted by who-needs-attention-now (unread messages, missed sessions, falling behind). Today's calendar on the right.

*[Wireframe mockup omitted — see HTML version for visual]*

*Wireframe: M.01. Mentor Dashboard — triage, not vanity*

**Key UX choices:** "Needs your attention" is the headline section — sorted by urgency signals (unread count + last reply time + recent test score drop). Stats on top tell mentor they're doing fine; triage list tells them what to do next. Ranking algorithm runs server-side, refreshed every page load.

### M.02 — My Students

*Purpose:* Roster view of all assigned students with at-a-glance health (engagement, recent test scores, last session date). Click into any student for full profile + chat + notes.

*[Wireframe mockup omitted — see HTML version for visual]*

*Wireframe: M.02. My Students — table-dense, scannable*

**Key UX choices:** Tabular layout (not cards) because mentors with 10+ students need density. Trend arrows next to test scores. "Engagement" is a derived metric (messages + session attendance + resource opens). Filter pills let mentor focus on the half of students that need work.

### M.03 — Student Conversation (Detail)

*Purpose:* The mentor's chat view of a single student — but with a side panel showing the student's progress, notes, shared resources, and session history. Mentor doesn't have to context-switch.

*[Wireframe mockup omitted — see HTML version for visual]*

*Wireframe: M.03. Student Conversation — chat + context, side-by-side*

**Key UX choices:** Side panel surfaces context the mentor would otherwise have to dig for. Notes are private to the mentor (admin can see them; student cannot) — encourages honest assessment. Conversation history persists across sessions; mentor never loses thread continuity.

### M.04 — Calendar & Availability

*Purpose:* Mentor sets weekly availability slots. Students book within those slots. View shows confirmed sessions in week or month layout.

*[Wireframe mockup omitted — see HTML version for visual]*

*Wireframe: M.04. Calendar & Availability — set + view in one place*

**Key UX choices:** Default mode is "Availability" (set slots). Tab switches to "Bookings" view. Drag to create slots. Mentor can also be set as "admin-curated" mode (CEO controls slots) for v1; mentor-driven mode unlocks once we trust the supply side.

### M.05 — Resources (Upload & Share)

*Purpose:* Mentor uploads PDFs, links, etc. and chooses to share with one student, all their students, or platform-wide (admin must approve platform-wide).

*[Wireframe mockup omitted — see HTML version for visual]*

*Wireframe: M.05. Resources — upload, scope, manage*

**Key UX choices:** Sharing scope is explicit and visible (Private / Per-student / All my students / Platform-wide). Platform-wide goes through admin approval — prevents quality issues. Files stored in R2 with mentor-scoped folder paths.

### M.06 — Earnings & Payouts

*Purpose:* Mentor sees what they've earned this month, payout schedule, past statements, and tax docs. Razorpay Routes handles the actual transfer; this page is the read-only ledger.

*[Wireframe mockup omitted — see HTML version for visual]*

*Wireframe: M.06. Earnings & Payouts — read-only ledger*

**Key UX choices:** "Next payout" and amount is the most prominent — answers the only question mentors actually have. Tax docs stub now, full TDS workflow in v2. Razorpay Routes pushes money directly to mentor's verified bank account; platform takes its cut before transfer.

---

## Portal 03 / CEO & Admin: Admin Portal

Six pages. Built for the team running the platform — you. Sees everything, controls everything. Mentor verification, payment overrides, session monitoring, refunds, analytics. Density-first design; admins live here all day.

### A.01 — Master Dashboard

*Purpose:* System-wide health: active students, pending mentor verifications, payment failures in last 24h, sessions happening right now, recent flags. The control room overview.

*[Wireframe mockup omitted — see HTML version for visual]*

*Wireframe: A.01. Master Dashboard — control room view*

**Key UX choices:** "Needs your attention" is the focal point — admin opens this page with intent. "Watch" buttons on live sessions invoke the oversight feature (admin can join silently). Stats feed off cached aggregates (Redis), refresh every 30s — not real-time, but feels live.

### A.02 — Students Management

*Purpose:* Searchable, filterable list of every student. Click any one for full profile, payment history, mentor assignment, conversation logs, and admin actions (extend access, reassign mentor, refund, ban).

*[Wireframe mockup omitted — see HTML version for visual]*

*Wireframe: A.02. Students Management — searchable, action-rich*

**Key UX choices:** Inline status badges (refund, banned, expired) catch the eye in a long table. "Add manually" handles edge cases like comp accounts, sponsorships, or payment-out-of-band scenarios. Click into a student → full detail page (not a modal — too much info to cram).

### A.03 — Mentors Management (Verification)

*Purpose:* Verify new mentor applications, manage existing mentors, set their payout rate, suspend bad actors. Verification is the most important workflow: review documents, check credentials, approve.

*[Wireframe mockup omitted — see HTML version for visual]*

*Wireframe: A.03. Mentors Management — verification + roster*

**Key UX choices:** Pending verifications are at the top, visually loud — biggest priority. Document badges open a viewer modal (R2 signed URL) so admin can see proof before approving. Approval triggers credential email, mentor profile listing, and ability to be assigned students.

### A.04 — Session Monitor (Oversight)

*Purpose:* The "what's happening right now" page. Live sessions admin can join silently. Recent chats searchable. Recordings library. Flagged conversations queue.

*[Wireframe mockup omitted — see HTML version for visual]*

*Wireframe: A.04. Session Monitor — oversight without spying*

**Key UX choices:** "Watch silently" joins as invisible participant via 100ms's spectator mode — disclosed in TOS. "Flagged" surfaces from automatic content scans (phone numbers, "let's meet outside the platform" patterns). Avoids reading every chat — only the ones a heuristic catches or a user reports.

### A.05 — Payments & Access Control

*Purpose:* Every transaction. Filter by status, date, plan. Issue refunds. Manually grant or revoke access. Failed webhooks queue with retry button.

*[Wireframe mockup omitted — see HTML version for visual]*

*Wireframe: A.05. Payments & Access — money + access in one ledger*

**Key UX choices:** Failed webhooks at top because they break the auto-provisioning promise. "Retry" replays the BullMQ job; "Manual provision" lets admin override and create the account by hand. Refund flow returns money via Razorpay AND immediately revokes access — atomic operation.

### A.06 — Analytics

*Purpose:* Cohorts, retention, revenue trends, mentor performance, doubt-resolution SLAs. Charts driven by PostHog data, key business numbers from Postgres.

*[Wireframe mockup omitted — see HTML version for visual]*

*Wireframe: A.06. Analytics — business signal, not data noise*

**Key UX choices:** Two charts only (revenue + retention) — these are the two numbers that matter. Mentor performance ranking surfaces underperformers ("Watch") so you can intervene before students churn. Built on PostHog SDK + custom Postgres queries.

## 05. Database Schema

PostgreSQL 16 via Drizzle ORM. **24 tables** grouped into seven domains. All tables include `created_at` and `updated_at` timestamps (omitted below for brevity). All primary keys are `uuid` generated server-side. Soft deletes use `deleted_at NULL` where indicated.

Tag legend: PK primary key  ·  FK foreign key  ·  UQ unique  ·  IX indexed

#### D.01 — Identity & Access

**Table: `users`** — Every human in the system

- `id PK` (uuid): Server-generated
- `email UQ` (varchar(255)): Login identifier; lowercased on write
- `phone IX` (varchar(15)): E.164 format; required for SMS OTP
- `password_hash` (varchar(255)): bcrypt, cost 12
- `role IX` (enum): student | mentor | admin
- `status` (enum): pending | active | suspended | banned
- `last_login_at` (timestamptz): Updated on session creation
- `deleted_at` (timestamptz): Soft delete; nullable

**Table: `profiles`** — Display info, separate from auth

- `user_id PK FK` (uuid): → users.id; one-to-one
- `full_name` (varchar(120)):
- `photo_url` (text): R2 signed URL or external
- `bio` (text): Mentors only
- `target_exam` (enum): jee_main | jee_advanced | both — students only
- `target_year` (integer): e.g. 2027 — students only
- `subjects_focus` (jsonb): [{"subject":"physics","level":"weak"}]
- `institute` (varchar(120)): Mentors/scorers: IIT-B, IIT-D etc.
- `graduation_year` (integer): Mentors/scorers

**Table: `mentor_verifications`** — KYC documents for mentor approval

- `id PK` (uuid):
- `user_id FK IX` (uuid): → users.id
- `documents` (jsonb): [{"type":"degree","r2_key":"...","verified":true}]
- `linkedin_url` (text):
- `jee_rank` (integer): Optional, claimed
- `status IX` (enum): pending | approved | rejected
- `reviewed_by FK` (uuid): → users.id (admin who decided)
- `review_notes` (text): Internal-only

**Table: `auth_sessions`** — NextAuth session storage

- `id PK` (uuid):
- `user_id FK IX` (uuid): → users.id
- `session_token UQ` (varchar(255)): Cookie value
- `expires_at` (timestamptz): Sliding 30-day window
- `user_agent` (text): For "active devices" view
- `ip_address` (inet): Stored for fraud signals

#### D.02 — Plans & Payments

**Table: `plans`** — Catalog of purchasable plans

- `id PK` (uuid):
- `code UQ` (varchar(40)): e.g. JEE_ADV_6MO
- `name` (varchar(120)): User-facing
- `price_inr` (integer): In paise (₹14999 = 1499900)
- `duration_days` (integer): e.g. 180
- `features` (jsonb): {"sessions":24,"doubts":"unlimited"}
- `is_active` (boolean): Hide from checkout when false

**Table: `subscriptions`** — Student's active access window

- `id PK` (uuid):
- `user_id FK IX` (uuid): → users.id
- `plan_id FK` (uuid): → plans.id
- `payment_id FK` (uuid): → payments.id
- `started_at` (timestamptz):
- `expires_at IX` (timestamptz): Hot index — used in every auth check
- `status` (enum): active | expired | refunded | revoked

**Table: `payments`** — Razorpay transaction records

- `id PK` (uuid):
- `user_id FK IX` (uuid): → users.id (may be null pre-signup)
- `razorpay_order_id UQ` (varchar(40)): Created at checkout init
- `razorpay_payment_id` (varchar(40)): Set on success
- `amount_inr` (integer): In paise
- `status IX` (enum): created | success | failed | refunded
- `method` (varchar(20)): upi | card | netbanking | emi
- `webhook_payload` (jsonb): Full Razorpay event payload

**Table: `refunds`** — Refund requests & outcomes

- `id PK` (uuid):
- `payment_id FK` (uuid): → payments.id
- `requested_by FK` (uuid): → users.id
- `approved_by FK` (uuid): → users.id (admin)
- `reason` (text): Student-provided
- `amount_inr` (integer): May be partial
- `razorpay_refund_id` (varchar(40)): Set on Razorpay confirmation
- `status` (enum): pending | approved | rejected | processed

**Table: `payouts`** — Mentor earnings ledger

- `id PK` (uuid):
- `user_id FK IX` (uuid): → users.id (recipient)
- `period_start` (date): e.g. 2026-03-01
- `period_end` (date):
- `gross_inr` (integer): Before platform cut + TDS
- `platform_fee_inr` (integer): Typically 15-25%
- `tds_inr` (integer): 10% above ₹30K threshold
- `net_inr` (integer): Actually transferred
- `razorpay_transfer_id` (varchar(40)): Razorpay Routes transfer
- `status IX` (enum): pending | processing | paid | failed

#### D.03 — Mentorship

**Table: `assignments`** — Student↔mentor pairings

- `id PK` (uuid):
- `student_id FK IX` (uuid): → users.id
- `mentor_id FK IX` (uuid): → users.id
- `started_at` (timestamptz):
- `ended_at` (timestamptz): Null while active
- `status` (enum): active | reassigned | ended
- `mentor_notes` (text): Private to mentor & admin

**Table: `conversations`** — A chat thread (any type)

- `id PK` (uuid):
- `type IX` (enum): student_mentor | doubt_thread | group
- `title` (varchar(200)): Group only
- `last_message_at IX` (timestamptz): For sorting inbox
- `flagged` (boolean): Set by content scanner

**Table: `conversation_participants`** — Who's in each conversation

- `conversation_id FK` (uuid): → conversations.id
- `user_id FK` (uuid): → users.id
- `last_read_at` (timestamptz): For unread counts
- `muted` (boolean): Suppress notifications

**Table: `messages`** — Individual chat messages

- `id PK` (uuid):
- `conversation_id FK IX` (uuid): → conversations.id
- `sender_id FK` (uuid): → users.id
- `body` (text): Plain text + Markdown
- `attachments` (jsonb): [{"r2_key":"...","filename":"...","mime":"..."}]
- `edited_at` (timestamptz):

#### D.04 — Live Sessions (Video)

**Table: `mentor_availability`** — When mentors can take sessions

- `id PK` (uuid):
- `mentor_id FK IX` (uuid): → users.id
- `day_of_week` (smallint): 0=Sun ... 6=Sat (recurring)
- `start_time` (time): Local IST
- `end_time` (time):
- `slot_minutes` (smallint): 30 | 45 | 60
- `set_by` (enum): mentor | admin (v1 = admin only)

**Table: `sessions`** — A scheduled or live video session

- `id PK` (uuid):
- `host_id FK IX` (uuid): → users.id (mentor)
- `type` (enum): one_on_one | group
- `title` (varchar(200)): e.g. "Rotational Mechanics"
- `scheduled_at IX` (timestamptz): Hot index — upcoming queries
- `duration_minutes` (smallint):
- `hms_room_id` (varchar(60)): 100ms room reference
- `status` (enum): scheduled | live | completed | cancelled
- `started_at / ended_at` (timestamptz): Set when actually live

**Table: `session_participants`** — Who's invited / who joined

- `session_id FK` (uuid): → sessions.id
- `user_id FK` (uuid): → users.id
- `role_in_session` (enum): host | participant | observer (admin)
- `joined_at` (timestamptz): Null = no-show
- `left_at` (timestamptz):

**Table: `recordings`** — Video recording artifacts

- `id PK` (uuid):
- `session_id FK UQ` (uuid): → sessions.id (one recording per session)
- `r2_key` (text): Object key in R2 bucket
- `duration_seconds` (integer):
- `size_bytes` (bigint): For storage cost tracking
- `processing_status` (enum): processing | ready | failed

#### D.05 — Doubts & Mentor Q&A

**Table: `doubts`** — A student's question

- `id PK` (uuid):
- `student_id FK IX` (uuid): → users.id
- `subject IX` (enum): physics | chemistry | maths
- `topic` (varchar(120)): e.g. "Rotational Motion"
- `body` (text): Question text
- `attachments` (jsonb): Image of student's working
- `claimed_by FK` (uuid): → users.id (top scorer); null while open
- `claimed_at` (timestamptz): 30-min soft lock
- `status IX` (enum): open | claimed | answered | abandoned
- `payout_inr` (integer): Locked at claim time (e.g. ₹40)

**Table: `doubt_answers`** — Top scorer's response

- `id PK` (uuid):
- `doubt_id FK UQ` (uuid): → doubts.id (one final answer)
- `answerer_id FK` (uuid): → users.id
- `body` (text): Markdown + LaTeX
- `attachments` (jsonb): Voice clip, image, etc.
- `response_seconds` (integer): claimed_at → answered_at, for SLA
- `student_rating` (smallint): 1–5; null until rated
- `student_feedback` (text): Optional

#### D.06 — Resources

**Table: `resources`** — Uploaded files & saved links

- `id PK` (uuid):
- `uploader_id FK IX` (uuid): → users.id
- `kind` (enum): file | link
- `title` (varchar(200)):
- `subject` (enum): physics | chemistry | maths | other
- `r2_key` (text): file kind only
- `external_url` (text): link kind only
- `size_bytes` (bigint):
- `scope` (enum): private | per_user | mentor_cohort | platform
- `platform_approved` (boolean): Required if scope = platform

**Table: `resource_shares`** — Per-student sharing grants

- `resource_id FK` (uuid): → resources.id
- `target_user_id FK` (uuid): → users.id (the recipient student)
- `shared_at` (timestamptz):

#### D.07 — System (Notifications, Audit, Webhooks)

**Table: `notifications`** — Outbound log (email, SMS, push)

- `id PK` (uuid):
- `recipient_id FK` (uuid): → users.id
- `channel` (enum): email | sms | push | in_app
- `template_code` (varchar(60)): e.g. SESSION_REMINDER_15M
- `payload` (jsonb): Variables fed to template
- `provider_id` (varchar(80)): Resend/MSG91 message id
- `status` (enum): queued | sent | delivered | failed

**Table: `audit_log`** — Admin actions & sensitive events

- `id PK` (bigint): Auto-increment for ordering
- `actor_id FK` (uuid): → users.id (who did it)
- `action` (varchar(60)): e.g. mentor.approved, refund.issued
- `target_type` (varchar(40)): e.g. user, payment
- `target_id` (uuid):
- `metadata` (jsonb): Before/after diff if relevant
- `ip_address` (inet):

**Table: `webhook_events`** — Idempotent inbound webhooks

- `id PK` (uuid):
- `provider` (enum): razorpay | hms_100 | msg91 | resend
- `external_id UQ` (varchar(120)): Provider's event id — drops duplicates
- `event_type` (varchar(60)): e.g. payment.captured
- `payload` (jsonb): Full body
- `processed_at` (timestamptz): Null until handler completes
- `processing_attempts` (smallint): For retry caps

#### Schema decisions worth flagging

- **One `users` table for all roles** — keeps auth logic simple. Role-specific fields live in `profiles` or sister tables.
- **Soft delete on users only.** Messages, payments, and audit logs are never deleted — required for compliance and dispute resolution.
- **Money stored in paise (integer)** — never floats. ₹14,999 = `1499900`. Same convention as Razorpay.
- **jsonb for flexible fields** (attachments, features, profile.subjects_focus) — but core relations stay in proper columns. Don't use jsonb as a junk drawer.
- **Idempotency on every webhook** via `webhook_events.external_id` — duplicate Razorpay or 100ms callbacks become no-ops, not double-bookings.

## 06. Third-Party APIs

Nine external services. The platform wouldn't exist without them — each one replaces months of engineering work for a few thousand rupees a month. Listed in order of how critical they are to v1.

Handles every rupee that flows in and out. Students pay through Razorpay Checkout (UPI, cards, netbanking, EMI). Mentors and top scorers receive payouts through Razorpay Routes — money is split and transferred directly from the platform's collected funds, so we don't manually bank-transfer anyone.

Powers all 1:1 calls and group sessions. Indian company, INR billing, good docs. Recording is built-in and lands in our R2 bucket via their delivery webhook. Critical feature for us: *spectator mode* — admin can join a session as an invisible observer without disrupting the call (the legal disclosure is in the student/mentor TOS).

Every chat message goes through Pusher. We publish from the Next.js server when a message is saved; clients subscribe to their conversation channels. Presence channels handle "online/offline" status. Self-hosting Socket.io was an option but adds DevOps load that doesn't pay off until thousands of concurrent users.

India-mandatory: any SMS to Indian numbers must come from a DLT-registered template. MSG91 handles registration and sends. We use it for OTP verification (login from new device), credential delivery after payment, and session reminders 15 minutes before start.

Transactional email — receipts, welcome flow, weekly progress digests for parents (v2). Resend pairs naturally with React Email so we author templates as JSX components, not raw HTML. Replaces the old SES-based flow that's a pain to set up.

Stores everything that isn't a database row: chat attachments, mentor-shared PDFs, doubt-image uploads, voice clips, session recordings. The killer feature is zero-egress pricing — students download the same chapter PDF 200 times and it costs us nothing. Same S3 SDK works against R2.

Two services, paired. **PostHog** tracks the funnel — landing page → checkout → payment → first session — and lets you replay sessions to see why a student bounced. **Sentry** catches every runtime error in dev and production with stack traces and user context. Together they answer the two important questions: what broke, and why didn't they convert.

For v1, mentor verification is manual — admin reviews uploaded scans of degree, ID, and JEE scorecard. For v2, we add automated KYC via Decentro: PAN match, eAadhaar pull through DigiLocker, and bank account verification (penny drop) before activating Razorpay Routes payouts. Reduces verification time from days to minutes and protects against fraud.

#### Service redundancy & vendor risk

- **Razorpay** — no real backup. Cashfree is the alternate; switching is a 2-week project. Acceptable risk; Razorpay's uptime is good.
- **100ms** — Daily.co is the swap-in. SDK shapes are different; would take ~1 week. Worth keeping a Daily account warm.
- **Pusher** — Ably is API-compatible-ish; switching is a few days. Or self-host Socket.io if cost forces it.
- **MSG91** — Gupshup or Twilio for fallback. DLT templates need re-registration on switch (3-day process).
- **R2** — AWS S3 is a drop-in via same SDK. Egress costs would bite, but the migration itself is just a bucket sync.

## 07. Budget & Cost Projections

> Every service we picked has a free tier. Pilot phase fits inside those tiers almost entirely. Real costs only kick in past 100–150 active students. Below: per-service pricing, cheaper alternatives, and total cost estimates at three growth stages.

All prices verified **May 2026**. INR conversions assume `$1 ≈ ₹85`. Costs scale with usage, not user count, so these are estimates — the real bill on launch day depends on how chatty mentors are and how long sessions actually run.

### Per-service pricing & alternatives

### Scaled cost scenarios

Three stages, all assuming the ₹14,999 / 6-month plan and steady-state operation. "Active students" = enrolled and using the platform; "new/month" = the cohort signing up that month.

| Service | Pilot Soft launch 50 active · 8 new/mo | Launch Real users 200 active · 35 new/mo | Scale Real money 1,000 active · 175 new/mo |
|---|---|---|---|
| Infrastructure (per month) |  |  |  |
| 100ms (video) | ~₹17,000 10K free min, ~50K used | ₹78,000 ~240K participant-min | ₹3,80,000 enterprise rate likely lower |
| Pusher (chat) | FREE | ₹4,200 (Startup) | ₹8,300 (Pro) |
| MSG91 (SMS) | ₹100 ~500 SMS/mo | ₹500 ~2,500 SMS/mo | ₹2,400 ~12,000 SMS/mo |
| Resend (email) | FREE | ₹1,700 (Pro) | ₹2,000 Pro + small overage |
| Cloudflare R2 | FREE | ₹420 ~50 GB stored | ₹1,250 ~200 GB stored |
| PostHog | FREE | FREE | ₹4,200 (usage-based) |
| Sentry | FREE | ₹2,200 (Team) | ₹6,700 (Business) |
| Decentro (v2 only) | — | ₹150 ~6 mentor checks | ₹450 ~30 mentor checks |
| Transaction costs (per month) |  |  |  |
| Razorpay (2% + GST) | ₹2,830 8 × ₹14,999 | ₹12,400 35 × ₹14,999 | ₹61,950 175 × ₹14,999 |
| TOTAL / MONTH | ~₹20,000 | ~₹1,00,000 | ~₹4,67,000 |
| Reference: revenue at this stage |  |  |  |
| Monthly revenue | ₹1.2 L 8 × ₹14,999 | ₹5.25 L 35 × ₹14,999 | ₹26.25 L 175 × ₹14,999 |
| Infra as % of revenue | ~17% | ~19% | ~18% |

*Note: video minutes are the biggest unknown. Estimates assume 4 hrs/student/month with avg 5 participants per session. Heavy group sessions push this higher; mostly-async students push lower. The Razorpay line is the headline transaction fee — actual settlement may include additional GST on the platform fee component.*

#### What this tells us

- **Pilot phase is essentially free** for chat/email/storage/analytics. Only video and a few SMS messages cost real money. Your first 50 students cost ~₹400/student/month in infra.
- **Video is the dominant cost line** at every stage — 70%+ of infrastructure spend. This is the place to negotiate or optimize.
- **Margins stay healthy at scale** — infrastructure is roughly 18% of revenue throughout. Add salaries, marketing, mentor payouts (50-60% of revenue), and you're in standard SaaS territory.
- **The "after free" cliff is gentle**. Most services give you free runway long enough to validate the product. By the time you're paying real money for any of them, you have real revenue too.

### Cost optimization plays

These are the levers that meaningfully change the bill. Rough monthly savings shown for the Launch stage (200 students).

**Realistic v1 budget recommendation:** Plan for **₹25,000–₹35,000/month in infrastructure** for the first 3 months while you're under 100 students. Most of that is video — everything else stays in free tier. As you cross 200 students, budget jumps to ₹85K–₹1L/month, but revenue should be at ₹4–5L/month by then. If video costs feel high, skip 100ms in v1 and start with scheduled Google Meet links — primitive but free, lets you ship faster and add proper video infra in v1.5 once you've validated the product.

## 08. Deployment on Hostinger VPS

> The whole platform runs on a single Hostinger KVM VPS plus Cloudflare's free tier in front. Same pattern as the iTarang setup — you already know how to operate this.

### Recommended VPS sizing

| Hostinger plan | Specs | Cost (~) | Good for |
|---|---|---|---|
| KVM 2 (start here) | 2 vCPU · 8 GB RAM · 100 GB NVMe · 8 TB bandwidth | ₹500–700/mo | 0–200 active students. Runs Next.js + Postgres + Soketi + Redis + BullMQ workers comfortably. |
| KVM 4 | 4 vCPU · 16 GB RAM · 200 GB NVMe · 16 TB bandwidth | ₹900–1,200/mo | 200–500 active students. Upgrade when CPU sustained over 60% or Postgres hits memory pressure. |
| KVM 8 | 8 vCPU · 32 GB RAM · 400 GB NVMe · 32 TB bandwidth | ₹1,800–2,400/mo | 500–1500 students. At this scale, also consider moving Postgres to a managed service (Neon) so the VPS only runs app code. |

**Start with KVM 2.** The KVM 4 is tempting "for headroom," but you'll have months of warning before you outgrow KVM 2 — and upgrading on Hostinger is a 10-minute reboot, not a migration.

### What runs on the VPS

- **Next.js app** — managed by PM2 (auto-restart on crash), 2 instances in cluster mode to use both vCPUs
- **PostgreSQL 16** — native install, listening on localhost only. Daily `pg_dump` via cron, uploaded to Cloudflare R2 for backups
- **Soketi** — single Docker container for WebSocket chat. Exposed via Cloudflare subdomain `realtime.mentoriit.com`
- **Redis** — native install, used for BullMQ queues and Next.js session/rate-limit cache
- **BullMQ workers** — separate PM2 process for background jobs (Razorpay webhooks, reminders, payouts)
- **Caddy or Nginx** — reverse proxy in front, terminates SSL (free Let's Encrypt cert), routes `/realtime` to Soketi, everything else to Next.js

### What lives outside the VPS

- **Cloudflare** — DNS, CDN, WAF, R2 file storage (files + session recordings)
- **Razorpay** — payments + payouts via Routes
- **100ms** — video infrastructure (you don't want to run TURN/STUN/SFU on a VPS, ever)
- **MSG91** — WhatsApp OTP + DLT-registered SMS fallback
- **Resend** — transactional email

### Initial Hostinger setup checklist

1. **Provision KVM 2** in Hostinger panel, choose Ubuntu 24.04, pick the data center closest to your users — **Mumbai (in-asia-south)** if available, else Singapore.
2. **Harden SSH** — disable root login, key-only auth, change default port. Standard checklist from your iTarang playbook.
3. **Install Node.js 20 LTS + PM2 + PostgreSQL 16 + Redis 7** via apt. Install Docker for Soketi only.
4. **Point DNS to Cloudflare** — change nameservers in Hostinger panel to Cloudflare's. Add A records for `mentoriit.com` and `realtime.mentoriit.com` pointing to the VPS IP.
5. **Set up Caddy** with automatic Let's Encrypt — single Caddyfile, ~10 lines, handles SSL for both subdomains.
6. **Deploy via GitHub Actions** — same workflow pattern as iTarang. SSH into VPS, `git pull`, run migrations, `pm2 reload`. Add a healthcheck step before declaring the deploy successful.
7. **Set up daily Postgres backup** — cron job runs `pg_dump | gzip | aws s3 cp - s3://mentoriit-backups/...` at 3 AM IST. Retention: 30 days.
8. **Set up uptime monitoring** — UptimeRobot free tier pings `/api/health` every 5 min, alerts you on Telegram/WhatsApp when down.

### Why not Vercel for the Next.js app?

Vercel is tempting — zero-config deploys, great DX, free for hobby use. But:

- Vercel's free tier has bandwidth limits that students downloading PDFs will blow through quickly
- Paid tier starts at $20/user/month — you'd pay more for Vercel alone than for the full Hostinger VPS
- BullMQ workers and Soketi don't run on Vercel — you'd need a VPS anyway, so why pay for two?
- Latency from Vercel's edge to your Mumbai Postgres = bad. Keeping everything on one Mumbai VPS = fast.

If you ever outgrow the VPS, the right move is bigger Hostinger plan or moving to AWS/GCP — not Vercel.

### Disaster recovery plan

- **VPS dies completely** — provision new Hostinger KVM (10 min) → restore latest Postgres backup from R2 (5 min) → redeploy via GitHub Actions (5 min). Total recovery: ~20 minutes if you've practiced once.
- **Postgres corruption** — restore from yesterday's R2 backup. Maximum data loss: 24 hours. For lower RPO, set up logical replication to a second Hostinger VPS (~₹500/mo extra) once revenue justifies it.
- **Hostinger as a company has an outage** — rare but possible. Static fallback landing page on Cloudflare Pages (free) showing "we're down, back soon" and your WhatsApp number for emergencies.

> **One VPS. One database. One deployment. Resist the urge to spread services across providers until you have actual scale problems — debugging a 4-provider outage at 2 AM is the worst part of running a small startup.**

## 09. Free Stack Playbook

> Almost every paid service in our stack has a free open-source equivalent. If you already have an iTarang VPS running, you can host a v0 of MentorIIT for essentially ₹0/month — except for Razorpay's 2% (unavoidable for taking payments in India).

The trade-off is operational. Free means you run it, monitor it, and fix it when it breaks at 2 AM. That's a fair price for a pilot — but past 100 paying students, the time you spend babysitting infrastructure costs more than the SaaS subscription you replaced. Use this section to ship cheap, then graduate intentionally.

### The "all-free v0" stack

Below: every layer of the system, swapped to its free equivalent. This entire stack runs on the existing iTarang Hostinger VPS plus Cloudflare's free tier.

### How to use each free option

Concrete setup steps and trade-offs for each free swap. Difficulty badges show roughly how much DevOps time you're spending.

1. SSH into the iTarang VPS. Run Soketi via Docker — one container, no extra dependencies.
2. Add a Cloudflare subdomain (e.g. `realtime.mentoriit.com`) pointing to the VPS, with a Cloudflare Origin Certificate for HTTPS.
3. In the Next.js app, configure the existing Pusher SDK to point at Soketi instead of Pusher.com — same SDK, just different URL and credentials.

- You're responsible for uptime — if Soketi crashes, chat goes down until you restart it. Mitigate with PM2 or Docker auto-restart.
- Single VPS = single region. Pusher.com is multi-region by default. For an India-only audience this is fine.
- No built-in monitoring dashboard like Pusher's. Use Sentry/PostHog to track connection errors yourself.

1. Provision a separate VPS (Jitsi is heavy — don't share with iTarang). Minimum 4 GB RAM, 2 vCPU. Hostinger has a ~₹600/month plan that works.
2. Run the official quickstart: `apt install jitsi-meet` on Ubuntu. Cleanest path is following Jitsi's Docker setup if you prefer container-based.
3. Use the Jitsi IFrame API to embed rooms inside your Next.js pages — students never leave MentorIIT to join a session.
4. For recording: install Jibri (Jitsi's recording bot). This is the painful part; budget extra time.

- Jitsi quality on cheap servers is mediocre. 100ms's killer feature is consistent quality on weak Indian networks; Jitsi struggles below 4G.
- Recording (Jibri) is genuinely complex to set up — many teams skip recording on Jitsi entirely.
- No native admin spectator mode. You can join silently as a "moderator with camera/mic off" but it's not the same as 100ms.
- 15+ participants in one room starts hitting CPU limits on a small VPS.

1. When a session is scheduled, generate a Google Meet link via Google Calendar API (free with any Google account) — or have the mentor paste a Meet link into the session record.
2. Store the Meet URL in the `sessions` table instead of `hms_room_id`.
3. "Join session" button just opens the Meet URL in a new tab. Done.

- No admin spectator mode — admin can join the meeting if invited, but they're visible. Honest disclosure required.
- No in-platform UX — students leave your site to join. Dilutes brand experience.
- No recording in your control (depends on whoever hosts the Meet). Inconsistent.
- Best when: you want to ship a v0 in a weekend and validate whether students actually attend sessions before investing in real video infra.

1. GlitchTip ships as a Docker Compose file. Clone the repo, set environment variables, run `docker compose up -d`. Needs Postgres + Redis (you already have both).
2. Point a subdomain at it (e.g. `errors.mentoriit.com`).
3. In your Next.js app, replace the Sentry DSN with GlitchTip's. The Sentry SDK works unchanged — GlitchTip implements the same wire protocol.

- Smaller community than Sentry. New features lag by a few months.
- No session replay (Sentry's replay feature is proprietary). Acceptable loss for v0.
- You manage retention — old errors won't auto-archive. Set a cron to delete events older than 30 days.

1. Sign up at brevo.com. Verify your sending domain by adding the SPF, DKIM, and DMARC DNS records to Cloudflare. Critical for deliverability.
2. Generate an API key from Brevo dashboard.
3. Use Brevo's transactional API (or SMTP) — most email libraries support both. React Email templates work with their HTML output.

- Less developer-polished than Resend. UI is busy because Brevo also does marketing/CRM.
- 9,000/month is enough until ~300 active students. Then upgrade or move to AWS SES.
- Templates are a separate system (not React Email-native). Workaround: send pre-rendered HTML.

1. NextAuth has an Email Provider built in. Configure it with your Brevo SMTP credentials.
2. When a student tries to log in, NextAuth emails them a one-click sign-in link. They click it, they're in.
3. For initial credential delivery (after Razorpay payment), email them a "set your password" link instead of a generated password over SMS.

- SMS-first audience expects SMS. Indian users are more conditioned to OTPs than email links — be ready for support tickets like "I didn't get my OTP" (it's in their email, not SMS).
- Slower than SMS by a few seconds. Acceptable for login; bad for time-critical alerts.
- Easy to add MSG91 later when you have ₹500/month to spare.

1. Use the same Postgres instance iTarang already runs on the VPS. Create a new database: `CREATE DATABASE mentoriit;`
2. Apply Drizzle migrations against the new database. Your existing Drizzle setup from iTarang is reusable as a template.
3. Schedule a daily `pg_dump` via cron, push to R2 free tier — that's your backup strategy until you can afford Neon.

- iTarang and MentorIIT now share resources. A bad query in one can affect the other. Watch CPU and connection pool usage.
- No automatic point-in-time recovery. If you delete data accidentally at 3 PM, you can only restore to last night's backup.
- VPS disk is your storage limit. Keep an eye on it; storage bloat at iTarang already taught us this.

1. Sign up at posthog.com EU region (faster from India than US).
2. Add the PostHog JS snippet to your Next.js layout. Done — events flow automatically.
3. Be selective about `capture` calls. 1M events sounds huge but a chatty client-side autocapture can burn through it fast.

- Self-hosted PostHog needs ClickHouse + Kafka + Redis + Postgres. That's a separate beast — don't put it on the iTarang VPS.
- 1M events/month covers ~500 active users with reasonable instrumentation. By the time you exceed it, you have revenue to pay PostHog.
- Even at $50/month for cloud, you'll spend more than that in DevOps time managing self-hosted. Don't do it.

1. Mentor uploads degree, ID card, JEE scorecard via the application form. Files go to R2 with a `verifications/` prefix.
2. Admin sees the application in the admin portal (page A.03). Reviews docs, checks LinkedIn, makes a decision.
3. Approve → mentor gets activation email. Reject → polite rejection email with reason.

- Doesn't scale past 200 mentor applications/month — you're spending real time per review.
- Quality is actually higher than automated KYC for the first cohort. You're hand-picking; you can spot fakes that an API can't.
- Plan to switch to Decentro at the moment manual review becomes the bottleneck — usually around 50–100 active mentors.

### When to graduate from each free option

Free choices are temporary by design. The right time to swap each one for paid is when the ops cost (your time + risk of downtime) exceeds the SaaS subscription.

| Free option | Graduate to | Switch when… |
|---|---|---|
| Soketi (self-hosted) | Pusher / Ably | Concurrent connections cross 200, OR you've had 2+ unplanned chat outages from VPS issues. Your time managing it costs more than $49/mo. |
| Jitsi / Google Meet | 100ms or LiveKit Cloud | You hit 50 paying students and call quality complaints become the #1 support ticket. Or you need admin oversight (spectator mode) for compliance. |
| Brevo free | Brevo paid / Resend / AWS SES | You exceed 9,000 emails/month — typically around 300 active students. SES at $0.10/1000 is the cheapest scale-up. |
| Email magic links | MSG91 SMS OTP | Support tickets about "didn't get OTP" become repetitive, OR you need to send time-critical alerts (session starting in 15 min) where SMS reliability matters. |
| GlitchTip (self-hosted) | Sentry cloud | Two engineers on the team — coordinating issue triage on self-hosted is annoying without Sentry's collaboration features. Or when GlitchTip's storage on VPS becomes a chore. |
| VPS Postgres | Neon / Supabase managed Postgres | Your iTarang VPS is at 70%+ CPU, OR you've had a near-miss data loss. Managed Postgres handles backups + PITR + connection pooling for ~$20/mo. |
| Manual mentor KYC | Decentro / Surepass | 50+ pending mentor applications in queue, OR a mentor slipped through with falsified docs. Automation pays for itself by the time you have a queue. |
| PostHog free tier | PostHog Cloud paid | You hit 1M events/month and lose visibility into the funnel. Don't optimize this away — analytics blindness is more expensive than the bill. |

#### The shipping plan, then

- **Week 1–4:** Build the four portals on the all-free stack. Ship to 10 friendly students (free or comped) to find bugs before you take real money.
- **Month 2:** Open paid signups. Razorpay activated. Everything else still free. Operate on ₹3,000–₹8,000/month total infra cost up to ~50 students.
- **Month 3–4:** First graduation — usually video. Move to 100ms or LiveKit Cloud once a critical mass of students complain about Meet/Jitsi quality.
- **Month 5–6:** Selectively upgrade what's actively breaking. Move chat to Pusher if Soketi has caused issues. Move email to paid Brevo if you've hit the cap.
- **Beyond:** Follow the graduation table above. You're never "done" — you'll keep moving services from free to paid as the ops cost crosses the SaaS cost.

> **The point of the free stack isn't to save money forever. It's to let you ship in 4 weeks instead of 4 months, validate that students actually pay, and then upgrade with revenue rather than runway.**

## 10. Roadmap

### v1 — Launch (3–4 months)

- All four portals with the pages above (skip "advanced" features marked v2 in notes)
- Razorpay checkout → automated provisioning
- Text chat + file sharing (Pusher + R2)
- 1:1 and group video sessions (100ms) with recording
- Doubt queue with manual claim + ₹40 flat per-doubt payout
- Admin oversight: live watch, recording library, basic flags
- Single plan to start (₹14,999 / 6mo) — pricing experimentation comes later

### v2 — Scale (months 5–8)

- Mentor-driven availability (move off admin-curated when 200+ students)
- Tiered plans (Bronze / Silver / Gold)
- Subject-specific doubt routing & SLAs
- Better progress tracking (test scores, weakness mapping)
- Mentor-shared resource library (curated by admin) browsable by all students
- Mobile-app-like PWA polish; push notifications

### v3 — Differentiate (months 9–12)

- Cohort-based group programs (one mentor, 30 students, 90-day arc)
- AI-assisted doubt triage (mentor gets a suggested answer; they edit and send)
- Parent dashboard (read-only progress for paying parents)
- White-labeled enterprise version for coaching institutes

> **Ship v1 narrow. Add the rest only after real students and real mentors tell you what's missing. Every feature built without a user behind it will need to be re-built once you have one.**
