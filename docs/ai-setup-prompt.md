# Set up with an AI assistant

If you run an AI coding assistant like Claude Code or Cursor, it can drive most of the setup for you. Open a clone of this repo inside your assistant and paste the prompt below. Give it your keys as it asks for them. It will handle the deploy, the database, and walk you through the Meta app screen by screen.

A word of caution: the assistant will need real secrets to finish (Meta app secrets, a Resend key, database URLs). Only paste those into a tool and environment you trust, and rotate them afterward if you are unsure.

## The prompt

Copy everything in the block below.

```
You are helping me self-host OpenReply, an open source Instagram comment-to-DM
automation tool, in this repository. Read README.md, docs/self-hosting.md, and
docs/instagram-setup.md first, then help me get it running end to end.

My goal: <describe it. For example: run it for my own Instagram account only,
or host it for other people to sign up.>

Work through this in order and stop to ask me whenever you need a value or an
action only I can do:

1. Local or hosted. Ask me which I want. If hosted, we use Vercel for the web
   app and Railway for the worker plus Postgres and Redis. If local, we use
   docker-compose and a tunnel.

2. Datastores. Help me get a Postgres and a Redis running, then run the Prisma
   migration against them.

3. Environment. Generate NEXTAUTH_SECRET, CRON_SECRET, ENCRYPTION_KEY, and
   WEBHOOK_VERIFY_TOKEN for me. Ask me for my Resend API key and a verified
   sender address, and for the three Meta secrets once I create the app. Make
   sure ENCRYPTION_KEY is identical on the web app and the worker.

4. Deploy both processes and confirm /api/health returns ok with the worker
   healthy.

5. Meta app. Walk me through docs/instagram-setup.md one step at a time. This is
   the slow part. Tell me exactly what to click and what to paste. Remember the
   account ID trap (store user_id, not id) and that the app must be published
   for real webhooks to arrive.

6. Test. Have me create a campaign and comment a keyword from a second account,
   then confirm the DM sent by checking the DmLog table and the DM Logs page.

Rules for you:
- Never invent Meta dashboard steps. If a screen does not match the guide, ask
  me to screenshot it.
- Diagnose failures by querying the Postgres tables directly: WebhookEvent for
  delivery, DmLog for send status, OperationalEvent for worker errors. This is
  faster than logs.
- Remind me to rotate any secret I paste to you before real use.

Start by reading the three docs, then ask me question 1.
```

## What good looks like

By the end, `/api/health` returns `status: ok` with `worker.healthy: true`, and a comment with your keyword from a second account produces a `SENT` row in the DM logs. If you get there, you are done. Everything after that is optional, like App Review to let other people connect their own accounts.
