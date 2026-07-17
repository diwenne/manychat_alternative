# Setup Checklist

Everything needed to run this app locally and in production, and what's already done.

## Status summary

| Thing | Status |
| --- | --- |
| `.env` file | Created |
| `NEXTAUTH_SECRET`, `CRON_SECRET`, `ENCRYPTION_KEY` | Generated |
| `WEBHOOK_VERIFY_TOKEN` | Generated |
| `RESEND_API_KEY` | Set |
| `EMAIL_FROM` | **Placeholder — must fix** |
| Postgres | **Not installed** |
| Redis | **Not installed** |
| Meta app credentials | **Empty — must obtain** |
| Public HTTPS URL | **Not set up** |
| Meta App Review | **Not submitted** |

---

## 1. Accounts to create

| Service | Why | Cost |
| --- | --- | --- |
| [Meta for Developers](https://developers.facebook.com/) | Instagram OAuth + webhooks. Nothing works without it. | Free |
| Instagram **professional** account | Must be Business or Creator. A personal account cannot be connected. | Free |
| [Resend](https://resend.com/) | Login is email magic-link only. No Resend, no way to sign in. | Free tier fine |
| [Railway](https://railway.app/) | Runs the worker, Postgres, Redis. | ~$5/mo |
| [Vercel](https://vercel.com/) | Hosts the Next.js web app. | Free tier fine |
| [ngrok](https://ngrok.com/) | Local dev only — Meta can't reach `localhost`. | Free tier fine |

---

## 2. Local machine

Neither is installed right now. Pick one path:

**Docker (matches `docker-compose.yml`):**
```bash
# install Docker Desktop first — `docker` is not on PATH
docker-compose up -d
```

**Or native:**
```bash
brew install postgresql@16 redis
brew services start postgresql@16
brew services start redis
createdb manychat-alternative
```

Then, either way:
```bash
npm ci
npm run db:generate
npm run db:migrate
```

---

## 3. Environment variables

All live in `.env` (gitignored — never commit it). Both Vercel **and** Railway need every one of these.

### Already generated — don't regenerate
| Var | Note |
| --- | --- |
| `NEXTAUTH_SECRET` | — |
| `CRON_SECRET` | Protects `/api/cron/refresh-tokens` |
| `ENCRYPTION_KEY` | 64 hex chars. Encrypts Instagram tokens. |
| `WEBHOOK_VERIFY_TOKEN` | Paste this same value into Meta's webhook config |

> **`ENCRYPTION_KEY` must be identical across web and worker.** The worker decrypts tokens the web app encrypted. Mismatch = every send fails. Changing it later orphans all stored tokens and every connected account must reconnect.

### You must fill in
| Var | Where to get it |
| --- | --- |
| `INSTAGRAM_APP_ID` | Meta app → Instagram product |
| `INSTAGRAM_APP_SECRET` | Meta app → Instagram product |
| `FACEBOOK_APP_SECRET` | Meta app → Settings → Basic. Verifies webhook signatures. |
| `EMAIL_FROM` | Currently `login@example.com`, which is fake. Must be an address on a domain you verified in Resend, or magic links won't deliver. |
| `NEXTAUTH_URL` | Local: your ngrok URL. Prod: your real domain. |
| `DATABASE_URL` | Local default is set. Prod: from Railway. |
| `REDIS_URL` | Local default is set. Prod: from Railway. |

---

## 4. Meta app setup

1. Create an app at developers.facebook.com (type: Business).
2. Add the **Instagram** product.
3. Connect your Instagram professional account.
4. OAuth redirect URI: `https://<your-domain>/api/instagram/callback`
5. Webhooks → subscribe to the **`comments`** field.
   - Callback URL: `https://<your-domain>/api/webhook`
   - Verify token: your `WEBHOOK_VERIFY_TOKEN`
6. Permissions needed: `instagram_business_basic`, `instagram_business_manage_messages`, `instagram_business_manage_comments`.

**Until App Review passes, DMs only work to accounts with a role on your app** (yourself, testers). Fine for testing, not for real users. See `META_APP_REVIEW.md`.

---

## 5. Running it

Two processes, always. This is the part that trips people up.

```bash
npm run dev      # web app — receives webhooks, serves dashboard
npm run worker   # queue worker — ACTUALLY SENDS THE DMs
```

The webhook only *enqueues*. Without the worker running, comments arrive, jobs pile up in Redis, DM logs show rows, and **nothing ever sends**. If DMs silently never arrive, check the worker first.

For local webhook testing:
```bash
ngrok http 3000
# set NEXTAUTH_URL to the ngrok https URL
# set Meta's webhook callback to <ngrok-url>/api/webhook
```

---

## 6. Production

Two services from this same repo (see `DEPLOYMENT.md`):

- **Vercel** — the Next.js app. Also runs the daily token-refresh cron via `vercel.json` (05:00 UTC).
- **Railway** — a second service, start command `npm run worker`. Must be a persistent service.

**Vercel cannot run the worker.** Serverless functions are short-lived; BullMQ needs a process that lives indefinitely. That's why it's two services.

Provision Postgres and Redis on Railway and point both services at them. If you swap Redis providers, it must support blocking commands (`BRPOPLPUSH`) — an HTTP-only Redis won't work with BullMQ.

Run `npm run db:migrate` against production before taking traffic.

---

## 7. Security notes

- `.env` is covered by `.gitignore` (`.env*`). Keep it that way.
- **The current Resend key was pasted into a chat transcript.** Rotate it in the Resend dashboard if that transcript is stored or shared.
- Instagram tokens are encrypted at rest with `ENCRYPTION_KEY`. Treat it like a password — losing it means every account reconnects.
- `FACEBOOK_APP_SECRET` verifies webhook signatures. Without it, `/api/webhook` rejects everything (401).

---

## Order to do things

1. Install Docker **or** Postgres+Redis → `npm run db:migrate`
2. Verify a domain in Resend → set a real `EMAIL_FROM`
3. `npm run dev` → confirm you can log in via magic link
4. Create the Meta app → fill the three Meta vars
5. `ngrok http 3000` → set `NEXTAUTH_URL` + Meta webhook URL
6. Connect Instagram in Settings
7. `npm run worker` in a second terminal
8. Comment a keyword on your own post from a *different* account → watch DM logs
9. Deploy: Vercel (web) + Railway (worker)
10. Submit for Meta App Review

> Step 8 must use a different account. The app ignores comments from the connected account itself (`lib/meta/webhook.ts`) — Meta rejects private replies to yourself, so self-comments are skipped by design.
