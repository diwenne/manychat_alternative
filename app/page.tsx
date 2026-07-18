import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "OpenReply - Open source Instagram comment-to-DM automation",
  description:
    "A free, self-hosted ManyChat alternative. Turn Instagram keyword comments into automatic private replies using the official Meta API.",
};

const navLinks = [
  { label: "Templates", href: "/templates" },
  { label: "Product", href: "#product" },
  { label: "Use cases", href: "#use-cases" },
  { label: "Security", href: "#security" },
  { label: "Pricing", href: "#pricing" },
  { label: "Founding offer", href: "#founding-offer" },
];

const seoLinks = [
  { label: "Manychat alternative", href: "/manychat-alternative" },
  { label: "Comment-to-DM templates", href: "/instagram-comment-to-dm-templates" },
  { label: "Agencies", href: "/instagram-dm-automation-agencies" },
  { label: "Comment LINK automation", href: "/comment-link-automation" },
];

const heroStats = [
  { value: "24/7", label: "Comment monitoring" },
  { value: "1", label: "DM per matched comment" },
  { value: "0", label: "Scraping required" },
];

const audiences = [
  "DTC store",
  "Creator studio",
  "Agency desk",
  "Course seller",
  "Launch team",
  "Beauty brand",
  "Fitness coach",
  "Event team",
];

const flowSteps = [
  {
    eyebrow: "Connect",
    title: "Link your Instagram professional account",
    description:
      "Owners sign in by email, connect Instagram once, and manage the account as a workspace integration.",
  },
  {
    eyebrow: "Build",
    title: "Choose a post, keywords, and the exact DM",
    description:
      "Create campaigns for reels, posts, launches, product drops, lead magnets, and client work.",
  },
  {
    eyebrow: "Deliver",
    title: "Send comment-based private replies safely",
    description:
      "Meta webhooks are deduped, queued, checked against limits, and sent through the private reply flow.",
  },
];

const campaignCards = [
  {
    title: "Lead magnets",
    description:
      "Send guides, checklists, discount links, webinar links, or gated resources the moment someone asks.",
  },
  {
    title: "Social commerce",
    description:
      "Turn comments like PRICE, LINK, SIZE, or BUY into an instant product conversation inside Instagram.",
  },
  {
    title: "Agency workflows",
    description:
      "Package repeatable comment-to-DM funnels for campaign clients without relying on manual inbox work.",
  },
  {
    title: "Creator launches",
    description:
      "Capture spikes from reels, stories, and launches while the audience is actively engaging.",
  },
];

const platformFeatures = [
  "Email magic-link signup",
  "Workspace-based tenancy",
  "Agency multi-account support",
  "No plan limits — fully self-hosted",
  "Encrypted Instagram tokens",
  "Webhook event storage",
  "Queue-backed delivery worker",
  "DM logs and statuses",
  "Token refresh maintenance",
];

const pricingTiers = [
  {
    name: "Self-hosted",
    price: "$0",
    label: "Everything included",
    description: "Run it on your own infrastructure with no limits.",
    features: [
      "Unlimited campaigns",
      "Unlimited DMs per month",
      "Unlimited Instagram accounts",
      "Queue-backed worker",
      "Member roles and reports",
    ],
    cta: "Get started",
    featured: false,
  },
];

const foundingOffer = [
  "Founding Agency badge on your client reports during beta",
  "Manual onboarding for up to 10 Instagram client accounts",
  "Campaign template setup for your first 3 client campaigns",
  "Direct feedback channel for shaping agency reports and analytics",
];

const referralLoop = [
  "Invite an agency operator",
  "They launch a tracked campaign",
  "Both accounts get founding-agency onboarding support",
];

const faqs = [
  {
    question: "Does OpenReply use the official Meta API?",
    answer:
      "Yes. The product is built around Meta webhooks and Instagram private replies, not scraping, browser automation, or password sharing.",
  },
  {
    question: "Is there a monthly DM limit?",
    answer:
      "No. This build is self-hosted with no plan caps. An hourly rate limit still applies to stay within Meta's own messaging limits, and any throttled reply is logged so you can see what happened.",
  },
  {
    question: "Can users sign up without Instagram first?",
    answer:
      "Yes. Signup uses email magic links. Instagram is connected after the workspace exists, which is cleaner for a B2B SaaS flow.",
  },
  {
    question: "Is this ready for public launch?",
    answer:
      "The app is implementation-ready, but public launch still depends on production credentials, deployment, and Meta App Review approval.",
  },
];

/* Landing-page product replicas — faithful, static copies of the real
   Overview and Dashboard screens, built in the app's own design tokens so
   what visitors see is what the app actually looks like. */

function AppWindow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background shadow-2xl shadow-black/50">
      <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="ml-2 text-xs text-muted">{label}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-border bg-surface p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

const overviewStats = [
  ["Views", "847.2K"],
  ["Reach", "612.4K"],
  ["Likes", "38.1K"],
  ["Comments", "4,204"],
  ["Saved", "9,712"],
  ["Shares", "2,340"],
];

const overviewPosts = [
  ["Spring drop reel", "214.8K", "9.1K", "Apr 3"],
  ["Restock haul", "88.4K", "5.2K", "Mar 28"],
  ["Behind the studio", "51.3K", "3.4K", "Mar 21"],
];

function OverviewPreview() {
  return (
    <AppWindow label="app / overview">
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">Overview</h3>
          <p className="mt-1 text-xs text-muted">
            Recent — 24 posts from @studio.store
          </p>
        </div>
        <span className="rounded border border-border px-2 py-1 text-xs text-muted">
          Last 50
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {overviewStats.map(([label, value]) => (
          <Stat key={label} label={label} value={value} />
        ))}
      </div>

      <div className="mt-4 rounded border border-border bg-surface p-4">
        <p className="text-sm font-semibold text-foreground">Posts</p>
        <table className="mt-3 w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-zinc-500">
              <th className="pb-2 pr-3 font-medium">Post</th>
              <th className="pb-2 px-3 text-right font-medium">Views</th>
              <th className="pb-2 px-3 text-right font-medium">Likes</th>
              <th className="pb-2 pl-3 text-right font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {overviewPosts.map(([post, views, likes, date]) => (
              <tr key={post} className="border-b border-border last:border-0">
                <td className="py-2 pr-3 text-foreground">{post}</td>
                <td className="py-2 px-3 text-right text-muted">{views}</td>
                <td className="py-2 px-3 text-right text-muted">{likes}</td>
                <td className="py-2 pl-3 text-right text-zinc-500">{date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppWindow>
  );
}

function MatchedCommentCard() {
  return (
    <div className="w-64 rounded-lg border border-border bg-surface p-4 shadow-2xl shadow-black/50">
      <p className="text-xs text-muted">New comment</p>
      <p className="mt-1 text-sm font-semibold text-foreground">@maya.co</p>
      <p className="mt-1 text-sm text-muted">LINK please</p>
      <div className="mt-3 border-t border-border pt-3">
        <p className="text-xs text-muted">
          Matched <span className="text-accent">GUIDE</span>
        </p>
        <p className="mt-1 text-sm font-medium text-success">
          Queued private reply
        </p>
      </div>
    </div>
  );
}

const dashboardStats = [
  ["Active Campaigns", "8"],
  ["DMs Sent", "1,284"],
  ["Skipped", "42"],
  ["Failed", "3"],
  ["Clicks", "356"],
  ["CTR", "27.7%"],
];

const dashboardChart: [string, number][] = [
  ["Mon", 42],
  ["Tue", 68],
  ["Wed", 51],
  ["Thu", 94],
  ["Fri", 120],
  ["Sat", 86],
  ["Sun", 73],
];

const dashboardActivity = [
  ["@maya.co", "Product guide reply", "Sent", "text-success"],
  ["@founder.ray", "Price request", "Sent", "text-success"],
  ["@shop.ava", "Lead magnet", "Queued", "text-warning"],
];

function DashboardPreview() {
  const maxDM = Math.max(...dashboardChart.map(([, n]) => n));
  return (
    <AppWindow label="app / dashboard">
      <h3 className="text-base font-semibold text-foreground">Hello, Maya!</h3>
      <p className="mt-1 text-xs text-muted">2 connected accounts · 340 contacts</p>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {dashboardStats.map(([label, value]) => (
          <Stat key={label} label={label} value={value} />
        ))}
      </div>

      <div className="mt-4 rounded border border-border bg-surface p-4">
        <p className="text-sm font-semibold text-foreground">DMs — Last 7 Days</p>
        <div className="mt-4 flex h-32 items-end gap-2">
          {dashboardChart.map(([day, n]) => (
            <div key={day} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-[10px] text-muted">{n}</span>
              <div
                className="w-full rounded-sm bg-accent"
                style={{ height: `${Math.max((n / maxDM) * 100, 4)}%` }}
              />
              <span className="text-[10px] text-zinc-500">{day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded border border-border bg-surface p-4">
        <p className="text-sm font-semibold text-foreground">Recent Activity</p>
        <div className="mt-3 space-y-2">
          {dashboardActivity.map(([user, automation, status, color]) => (
            <div
              key={user}
              className="flex items-center justify-between gap-3 border-b border-border py-2 text-sm last:border-0"
            >
              <span className="truncate text-foreground">{user}</span>
              <span className="truncate text-muted">{automation}</span>
              <span className={`text-sm ${color}`}>{status}</span>
            </div>
          ))}
        </div>
      </div>
    </AppWindow>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="OpenReply home">
            <span className="text-lg font-bold text-white">OpenReply</span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-zinc-400 transition hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:text-white sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-cyan-300 px-4 py-2 text-sm font-bold text-zinc-950 transition hover:bg-cyan-200"
            >
              Start free
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 pb-16 pt-12 sm:px-6 sm:pt-18 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:pb-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-sm font-semibold text-emerald-100">
            Built for Meta-compliant Instagram growth
          </div>

          <h1 className="mt-7 text-balance text-5xl font-black leading-[1.02] text-white sm:text-6xl lg:text-7xl">
            Make every comment start the right DM
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            OpenReply turns keyword comments on posts and reels into private
            replies, campaign logs, and measurable lead capture for businesses,
            creators, and agencies.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-cyan-300 px-6 py-3 text-sm font-bold text-zinc-950 shadow-cyan-950/40 transition hover:bg-cyan-200"
            >
              Start free
            </Link>
            <a
              href="#product"
              className="inline-flex items-center justify-center border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-bold text-white transition hover:border-white/20 hover:bg-white/[0.08]"
            >
              See the workflow
            </a>
          </div>

          <dl className="mt-10 grid max-w-xl grid-cols-3 gap-3">
            {heroStats.map((stat) => (
              <div key={stat.label} className="border border-white/10 bg-white/[0.035] p-4">
                <dt className="text-2xl font-black text-white">{stat.value}</dt>
                <dd className="mt-1 text-xs leading-5 text-zinc-500">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <OverviewPreview />
          <div className="absolute -bottom-8 -left-6 hidden lg:block">
            <MatchedCommentCard />
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-zinc-950/55 py-6">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-zinc-400">
            Designed for teams turning social attention into owned conversations
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
            {audiences.map((audience) => (
              <div
                key={audience}
                className="border border-white/10 bg-white/[0.03] px-3 py-3 text-center text-sm font-semibold text-zinc-300"
              >
                {audience}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="product" className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase text-cyan-200">Product workflow</p>
            <h2 className="mt-3 text-4xl font-black leading-tight text-white sm:text-5xl">
              A cleaner way to run Instagram DM campaigns
            </h2>
            <p className="mt-5 text-base leading-8 text-zinc-400">
              The app separates business signup from Instagram connection, then
              gives each workspace real usage, billing, delivery, and log state.
            </p>
          </div>

          <div className="grid gap-4">
            {flowSteps.map((step) => (
              <article
                key={step.title}
                className="grid gap-4 border border-white/10 bg-white/[0.035] p-5 sm:grid-cols-[140px_1fr]"
              >
                <p className="text-sm font-bold text-emerald-200">{step.eyebrow}</p>
                <div>
                  <h3 className="text-xl font-bold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{step.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.025] py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:items-center">
          <DashboardPreview />

          <div>
            <p className="text-sm font-bold uppercase text-emerald-200">Operator dashboard</p>
            <h2 className="mt-3 text-4xl font-black leading-tight text-white sm:text-5xl">
              Built to show what happened, not hide it
            </h2>
            <p className="mt-5 text-base leading-8 text-zinc-400">
              Every comment event becomes traceable: queued, matched, sent,
              skipped, failed, or rate-limited.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {platformFeatures.slice(0, 4).map((feature) => (
                <div key={feature} className="flex items-center gap-3 text-sm text-zinc-300">
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="use-cases" className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase text-cyan-200">Use cases</p>
          <h2 className="mt-3 text-4xl font-black leading-tight text-white sm:text-5xl">
            Campaigns your team can launch without inbox chaos
          </h2>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {campaignCards.map((card) => (
            <article key={card.title} className="border border-white/10 bg-zinc-950 p-5">
              <div className="mb-6 flex h-10 w-10 items-center justify-center border border-cyan-200/20 bg-cyan-300/10 text-cyan-100">
              </div>
              <h3 className="text-xl font-bold text-white">{card.title}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="security" className="border-y border-white/10 bg-zinc-950/60 py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase text-emerald-200">Trust and compliance</p>
            <h2 className="mt-3 text-4xl font-black leading-tight text-white sm:text-5xl">
              Serious foundations for a public B2B product
            </h2>
            <p className="mt-5 text-base leading-8 text-zinc-400">
              The system is designed around official APIs, encrypted tokens,
              and idempotent queue processing.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {platformFeatures.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-3 border border-white/10 bg-white/[0.035] p-4 text-sm font-semibold text-zinc-200"
              >
                {feature}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase text-cyan-200">Pricing</p>
          <h2 className="mt-3 text-4xl font-black leading-tight text-white sm:text-5xl">
            Free to test, simple to scale
          </h2>
          <p className="mt-5 text-base leading-8 text-zinc-400">
            Self-hosted and free. No plan tiers, no usage caps, no checkout.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {pricingTiers.map((tier) => (
            <article
              key={tier.name}
              className={`border p-6 ${
                tier.featured
                  ? "border-cyan-200/40 bg-cyan-300/10"
                  : "border-white/10 bg-white/[0.035]"
              }`}
            >
              <div className="flex min-h-24 items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-black text-white">{tier.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{tier.description}</p>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-bold ${
                    tier.featured
                      ? "bg-cyan-300 text-zinc-950"
                      : "border border-white/10 text-zinc-400"
                  }`}
                >
                  {tier.label}
                </span>
              </div>

              <div className="mt-7 flex items-end gap-1">
                <span className="text-5xl font-black text-white">{tier.price}</span>
                <span className="pb-2 text-sm text-zinc-500">/mo</span>
              </div>

              <ul className="mt-7 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm text-zinc-300">
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/login"
                className={`mt-8 inline-flex w-full items-center justify-center gap-2 px-5 py-3 text-sm font-bold transition ${
                  tier.featured
                    ? "bg-cyan-300 text-zinc-950 hover:bg-cyan-200"
                    : "border border-white/10 bg-white/[0.04] text-white hover:border-white/20 hover:bg-white/[0.08]"
                }`}
              >
                {tier.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section
        id="founding-offer"
        className="border-y border-white/10 bg-zinc-950/70 py-20"
      >
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase text-rose-200">
              Founding agency offer
            </p>
            <h2 className="mt-3 text-4xl font-black leading-tight text-white sm:text-5xl">
              Bring your first clients before the market gets noisy
            </h2>
            <p className="mt-5 text-base leading-8 text-zinc-400">
              Early agencies get hands-on onboarding, template help, and a say
              in the agency reporting roadmap. The offer is designed for teams
              already managing Instagram campaigns for multiple clients.
            </p>
            <Link
              href="/login"
              className="mt-8 inline-flex items-center justify-center gap-2 bg-rose-200 px-6 py-3 text-sm font-bold text-zinc-950 transition hover:bg-rose-100"
            >
              Claim founding access
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="border border-rose-200/20 bg-rose-300/10 p-6">
              <h3 className="text-2xl font-black text-white">
                What founders get
              </h3>
              <ul className="mt-6 space-y-3">
                {foundingOffer.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-zinc-300">
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <article className="border border-white/10 bg-white/[0.035] p-6">
              <h3 className="text-2xl font-black text-white">
                Referral loop
              </h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Referrals start as a manual founding-agency loop first, with
                credits handled manually while abuse controls are proven.
              </p>
              <ol className="mt-6 space-y-3">
                {referralLoop.map((item, index) => (
                  <li key={item} className="flex gap-3 text-sm text-zinc-300">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-cyan-200/20 text-xs font-black text-cyan-100">
                      {index + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </article>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.025] py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-bold uppercase text-emerald-200">FAQ</p>
              <h2 className="mt-3 text-4xl font-black leading-tight text-white">
                Questions before you launch
              </h2>
            </div>
            <div className="grid gap-3">
              {faqs.map((faq) => (
                <article key={faq.question} className="border border-white/10 bg-zinc-950 p-5">
                  <h3 className="text-lg font-bold text-white">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 border border-white/10 bg-surface p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase text-cyan-100">
              Ready when your next reel goes live
            </p>
            <h2 className="mt-3 max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl">
              Start free and turn keyword comments into private replies
            </h2>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 bg-cyan-300 px-6 py-3 text-sm font-bold text-zinc-950 transition hover:bg-cyan-200"
          >
            Start free
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 text-sm text-zinc-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <span>OpenReply</span>
          </div>
          <div className="flex flex-wrap gap-4">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="transition hover:text-white">
                {link.label}
              </a>
            ))}
            {seoLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-white">
                {link.label}
              </Link>
            ))}
            <Link href="/login" className="transition hover:text-white">
              Sign in
            </Link>
            <Link href="/privacy" className="transition hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-white">
              Terms
            </Link>
            <Link href="/data-deletion" className="transition hover:text-white">
              Data deletion
            </Link>
            <Link href="/meta-review" className="transition hover:text-white">
              Meta review
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
