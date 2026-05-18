# DEPLOY — Hostinger VPS

Operational runbook for shipping MentorIIT to production. Mirrors design doc §08.

## One-time VPS setup

1. **Provision Hostinger KVM 2**, Ubuntu 24.04, Mumbai DC.
2. **Harden SSH**: disable root login, key-only auth, non-default port. Use iTarang playbook.
3. **Install runtime** (`apt`):
   - Node.js 20 LTS, `npm i -g pm2`
   - PostgreSQL 16, listening on `localhost` only
   - Redis 7
   - Docker (for Soketi only)
   - Caddy
4. **Create DB + user**:
   ```sql
   CREATE DATABASE mentoriit;
   CREATE USER mentoriit WITH ENCRYPTED PASSWORD 'strong-random';
   GRANT ALL PRIVILEGES ON DATABASE mentoriit TO mentoriit;
   ```
5. **Soketi container**:
   ```bash
   docker run -d --name soketi --restart unless-stopped \
     -p 6001:6001 \
     -e SOKETI_DEFAULT_APP_ID=mentoriit \
     -e SOKETI_DEFAULT_APP_KEY="$SOKETI_KEY" \
     -e SOKETI_DEFAULT_APP_SECRET="$SOKETI_SECRET" \
     quay.io/soketi/soketi:1.6-16-alpine
   ```
6. **Cloudflare DNS**: point nameservers, add `A` records:
   - `mentoriit.com` → VPS IP
   - `realtime.mentoriit.com` → VPS IP
7. **Caddyfile** (`/etc/caddy/Caddyfile`):
   ```
   mentoriit.com {
     reverse_proxy localhost:3000
     encode gzip
   }
   realtime.mentoriit.com {
     reverse_proxy localhost:6001
   }
   ```
   Then `systemctl reload caddy`.

## Environment variables (`/opt/mentoriit/.env`)

Required at boot — `instrumentation.ts` calls `validateEnv()` and exits if missing.

| Variable | Notes |
|---|---|
| `NODE_ENV=production` | unlocks the prod env checks |
| `DATABASE_URL` | `postgres://mentoriit:...@localhost:5432/mentoriit` |
| `AUTH_SECRET` | 32+ chars, `openssl rand -hex 32` |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` | from Razorpay dashboard, **live mode** |
| `HMS_ACCESS_KEY`, `HMS_SECRET` | from 100ms dashboard, secret must be 32+ chars |
| `SOKETI_KEY`, `SOKETI_SECRET` | match the docker container |
| `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET` | Cloudflare R2 API tokens |
| `REDIS_URL=redis://localhost:6379` | local |
| `MSG91_AUTH_KEY`, `MSG91_TEMPLATE_ID` | once WhatsApp Business templates are approved |
| `RESEND_API_KEY`, `RESEND_FROM` | transactional email |
| `SENTRY_DSN`, `POSTHOG_KEY` | observability |
| `PROVISIONING_ENABLED=true` | **gate** — the razorpay webhook returns 503 until this is set |

## Deploy workflow

```bash
# on VPS
cd /opt/mentoriit
git pull
npm ci --omit=dev
npm run db:migrate          # tsx db/migrate.ts
npm run build
pm2 reload ecosystem.config.js
curl -fsS http://localhost:3000/api/health || (echo "healthcheck failed"; exit 1)
```

Automate via GitHub Actions over SSH (same pattern as iTarang).

## Daily Postgres backup → R2

`/etc/cron.daily/mentoriit-backup`:
```bash
#!/bin/bash
set -e
TS=$(date +%Y%m%d-%H%M)
pg_dump -U mentoriit mentoriit | gzip | \
  aws s3 cp - "s3://mentoriit-backups/db-$TS.sql.gz" \
  --endpoint-url "https://$R2_ACCOUNT_ID.r2.cloudflarestorage.com"
# Retention: 30 days
aws s3 ls "s3://mentoriit-backups/" --endpoint-url ... | \
  awk -v cutoff="$(date -d '30 days ago' +%Y-%m-%d)" '$1 < cutoff {print $4}' | \
  xargs -I {} aws s3 rm "s3://mentoriit-backups/{}" --endpoint-url ...
```

## UptimeRobot

- Monitor: `https://mentoriit.com/api/health`
- Interval: 5 min
- Alert: Telegram + your phone

## Disaster recovery (target: 20 min)

1. Provision new Hostinger KVM (`~10 min`)
2. Restore latest backup: `aws s3 cp s3://mentoriit-backups/db-LATEST.sql.gz - | gunzip | psql -U mentoriit mentoriit`
3. Re-run deploy workflow above
4. Practice this **once** before pilot launch.

## Pre-deploy checklist

- [ ] `npx tsc --noEmit` clean
- [ ] `npx vitest run` 100% pass
- [ ] `npm run build` clean
- [ ] All env vars set in `/opt/mentoriit/.env`
- [ ] Razorpay webhook URL updated to `https://mentoriit.com/api/webhooks/razorpay`
- [ ] 100ms webhook URL set (recording delivery)
- [ ] Daily backup cron tested manually
- [ ] UptimeRobot configured
- [ ] DR restore drilled once
- [ ] TOS includes admin oversight disclosure (per design §A.04)
