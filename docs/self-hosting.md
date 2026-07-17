# Self-hosting

This covers the environment variables and the production layout. For the Meta side, read [instagram-setup.md](instagram-setup.md), which is the harder half.

## Architecture

OpenReply is two processes and two datastores.

- Web app and API: Next.js. Handles the dashboard, the OAuth callback, and the incoming webhook. Runs well on Vercel.
- Worker: a long-running Node process (`npm run worker`) that consumes the send queue. It cannot run on Vercel, because serverless functions are short-lived and a queue consumer has to stay up. Railway, Render, Fly, or any box that runs a process works.
- PostgreSQL: campaigns, logs, accounts, sessions.
- Redis: the BullMQ send queue and the per-account rate limiter.

The web app and the worker must share the same `DATABASE_URL`, the same `REDIS_URL`, and the same `ENCRYPTION_KEY`. The web app writes an encrypted Instagram token; the worker decrypts it to send. Different keys mean every send fails to decrypt.

## Environment variables

Copy `.env.example` to `.env` and fill these in.

| Variable | What it is |
| --- | --- |
| `NEXTAUTH_URL` | Your public URL. Locally, your tunnel URL. |
| `NEXTAUTH_SECRET` | Random secret. `openssl rand -base64 32` |
| `CRON_SECRET` | Random secret protecting the token-refresh cron. |
| `ENCRYPTION_KEY` | 32-byte hex. `openssl rand -hex 32`. Encrypts Instagram tokens. Identical across web and worker. |
| `DATABASE_URL` | PostgreSQL connection string. |
| `REDIS_URL` | Redis connection string. Must support blocking commands, so an HTTP-only Redis will not work with BullMQ. |
| `RESEND_API_KEY` | Resend key. Login is email magic links only, so without this nobody can sign in. |
| `EMAIL_FROM` | A sender on a domain you verified in Resend. The placeholder will not deliver. |
| `META_GRAPH_API_VERSION` | Graph API version, for example `v25.0`. |
| `INSTAGRAM_APP_ID` | From the Meta app, see the Instagram setup guide. |
| `INSTAGRAM_APP_SECRET` | From the Meta app. |
| `FACEBOOK_APP_SECRET` | From the Meta app. |
| `WEBHOOK_VERIFY_TOKEN` | Any random string. You paste the same value into Meta's webhook config. |

The `ENCRYPTION_KEY` has to be exactly 64 hex characters or the app throws on boot.

## Local development

You need Postgres and Redis. The included `docker-compose.yml` starts both:

```bash
docker-compose up -d
npm run db:generate
npm run db:migrate
```

If you would rather install them natively, on macOS:

```bash
brew install postgresql@16 redis
brew services start postgresql@16
brew services start redis
createdb openreply
```

Then set `DATABASE_URL` to match your local user, for example `postgresql://YOUR_USER@localhost:5432/openreply`.

Run the two processes in separate terminals:

```bash
npm run dev
npm run worker
```

For Meta to reach your local webhook, run a tunnel and point `NEXTAUTH_URL` and the Meta webhook and redirect URLs at the tunnel:

```bash
ngrok http 3000
```

## Production

### Web app on Vercel

1. Create a Vercel project from your repo.
2. Add every environment variable listed above. `NEXTAUTH_URL` is your Vercel domain. `DATABASE_URL` and `REDIS_URL` point at your managed Postgres and Redis, not localhost.
3. Deploy. The build runs `prisma generate` before `next build`, so the Prisma client is generated fresh even though it is gitignored.
4. The daily token-refresh cron is wired up in `vercel.json`.

Use the public connection URLs for your database and Redis, not internal hostnames. Vercel runs outside your database provider's private network, so an internal hostname like `something.railway.internal` will hang and time out.

### Worker on Railway

1. Create a service from the same repo.
2. Start command: `npm run worker`.
3. Give it the same variables as the web app. Inside the same provider network it can use internal hostnames, which are faster and avoid egress cost.

Run the migration against your production database once before taking traffic:

```bash
DATABASE_URL="your-production-url" npm run db:migrate
```

## Checking it is healthy

Hit `/api/health`. It reports the database, Redis, queue, and worker heartbeat. If `worker.healthy` is false, the worker is not running or cannot reach Redis, and no DM will send even though webhooks are being received.

## Security notes

- `.env` is gitignored. Keep it that way.
- Rotate any secret that has been pasted anywhere it could be logged, including a chat with an AI assistant.
- Instagram tokens are encrypted at rest with `ENCRYPTION_KEY`. Losing or changing it means every connected account has to reconnect.
