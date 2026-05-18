# PILOT — Soft launch checklist

10 friendly/comp students + 2 mentors. Bug bash, then enable paid signups.

## Pre-pilot (week before)

- [ ] Drizzle migrations applied to prod DB (`npm run db:migrate`)
- [ ] Seed: 1 admin, 2 mentors (manually approved), 1 plan (`JEE_ADV_6MO`, ₹14,999)
- [ ] Razorpay in **test mode** still — pilot students get comp accounts via admin "Add manually"
- [ ] `PROVISIONING_ENABLED=false` so the webhook returns 503 (no payments yet)
- [ ] All 18 portal pages reachable from the 3 cookies (`mentoriit_role={student,mentor,admin}` for local; real signed sessions in prod)
- [ ] Mentor and student have signed a one-page TOS that names admin oversight explicitly
- [ ] Sentry capturing errors, PostHog capturing pageviews

## Day 0 — onboard pilot cohort

1. Admin creates 2 mentor accounts in `/admin/mentors` (mark verified)
2. Admin uses "Add manually" on `/admin/students` to create 10 comp accounts
3. Welcome email goes out (Resend) with magic-link login
4. Each student is auto-assigned to a mentor via round-robin

## Bug bash signals

Watch for these in Sentry/PostHog over the first 7 days:

| Signal | Action |
|---|---|
| `instrumentation.ts` env validation fails on boot | fix `.env`, restart |
| `/api/webhooks/razorpay` 503s (expected pre-Phase-2f) | OK — confirm via log |
| Sentry: > 5 distinct errors in first 24h | pause new signups |
| PostHog funnel: < 50% of students reach S.03 chat | UX problem on dashboard |
| Mentor inbox empty after 24h | student onboarding bug |

## Switching on payments (after bug bash)

1. Wire the `ProvisioningStore` adapter against Drizzle (Phase 2f work)
2. Set `PROVISIONING_ENABLED=true`
3. Razorpay → live mode keys swapped into env
4. Razorpay webhook URL pointed at prod
5. Send Razorpay a **test event** from their dashboard, confirm `webhook_events` row + provisioned user
6. Public landing page CTA goes live

## Killswitches

If something goes wrong:

- **Pause provisioning**: `PROVISIONING_ENABLED=false`, `pm2 reload mentoriit`
- **Pause chat**: stop the Soketi container — students fall back to REST refresh on conversation open
- **Pause new sessions**: admin manually cancels via `/admin/sessions`
- **Refund a student**: admin uses `/admin/payments` refund flow — atomic refund + access revoke

## Success criteria for graduating pilot

- [ ] All 10 students have at least one mentor message exchange
- [ ] At least 5 live video sessions completed without admin intervention
- [ ] At least 2 doubts asked and answered
- [ ] Zero CRITICAL Sentry errors
- [ ] Zero failed webhooks (or all successfully retried)
- [ ] Daily DB backups verified to be restorable

Then: enable public signups, raise the price cap to real (₹14,999), and start month-2 marketing.
