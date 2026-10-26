# O'Briens Solicitors

Website for [O'Briens Solicitors](https://www.obriens-solicitors.com), a law
firm in Berri, South Australia, built from the design files in [`design/`](./design).

**Stack:** Next.js 16 (App Router, TypeScript, `src/`) · Tailwind CSS v4
(CSS-first `@theme`) · Vercel AI SDK with the Google provider · Resend ·
Cloudflare Turnstile · Upstash Redis · deployed on Vercel.

---

## Getting started

```bash
npm install
cp .env.local.example .env.local   # then fill in the keys you need
npm run dev                        # http://localhost:3000
```

The site runs with **no** environment variables set. In that state the chatbot
shows its "reach us directly" fallback and the contact form returns a friendly
error instead of sending. Everything else works.

```bash
npm run build     # production build
npm run lint      # ESLint
npx tsc --noEmit  # typecheck
```

---

## Environment variables

Every variable is documented in [`.env.local.example`](./.env.local.example).
Summary:

| Variable | Required | Purpose |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | for the chatbot | [Anthropic Console](https://console.anthropic.com) key. Pay-as-you-go — a Claude Pro/Max subscription is *not* API access. |
| `CHATBOT_DAILY_BUDGET` | no (default `600`) | Site-wide cap on assistant replies per day — the hard ceiling on chatbot cost. |
| `RESEND_API_KEY` | for the contact form | [Resend](https://resend.com/api-keys) API key. |
| `CONTACT_EMAIL_TO` | for the contact form | Where enquiries are delivered. |
| `CONTACT_EMAIL_FROM` | no | Verified Resend sender. Falls back to Resend's sandbox address. |
| `EMAIL_ASSET_BASE_URL` | recommended pre-launch | Public base URL for images in emails (the logo). See note below. |
| `TURNSTILE_SECRET_KEY` | recommended in prod | Cloudflare Turnstile secret. Verification is skipped when unset. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | recommended in prod | Turnstile site key. The widget is not rendered when unset. |
| `UPSTASH_REDIS_REST_URL` | **yes in prod** | Shared rate-limit + quota store. |
| `UPSTASH_REDIS_REST_TOKEN` | **yes in prod** | Shared rate-limit + quota store. |

> Without Upstash the app falls back to an **in-memory** limiter. That is fine
> locally, but on Vercel each serverless instance would keep its own counters,
> so the site-wide chat limits and daily budget would not actually be
> enforced — the cost ceiling would leak. Set the Upstash
> variables before going live.

### Email logo — `EMAIL_ASSET_BASE_URL`

The transactional emails (contact-form notification + auto-reply) embed the firm
logo as an image. Email clients load that image over the public internet, so the
URL must resolve to a host that is **already serving** `/email/logo.png`.

`site.url` (`https://www.obriens-solicitors.com`) is the real domain, but it does
**not** serve the site until launch day — so before launch the logo must be
sourced from somewhere that is live now:

- **Before launch:** set `EMAIL_ASSET_BASE_URL` (locally *and* in Vercel) to the
  current Vercel deployment URL, e.g. `https://obriens.vercel.app`. Emails render
  the logo today.
- **At launch:** change `EMAIL_ASSET_BASE_URL` to `https://www.obriens-solicitors.com`
  (or simply remove it once `site.url` is live — see the fallback order).

Resolution order (in [`src/emails/shell.ts`](./src/emails/shell.ts)):
`EMAIL_ASSET_BASE_URL` → Vercel's `VERCEL_PROJECT_PRODUCTION_URL` → `site.url`.
The variable is used **only** for email image URLs; site links always use
`site.url`.

`EMAIL_LOGO_URL` overrides the whole thing with a single, direct image URL —
handy for pointing at a hosted file such as a **Vercel Blob** URL that is public
today while the domain is not yet serving the site. It wins over the base above;
clear it at launch to fall back to `EMAIL_ASSET_BASE_URL` / `site.url`.

---

## Deploying to Vercel

1. Push the repository to GitHub/GitLab/Bitbucket.
2. In Vercel, **Add New → Project** and import the repo. The Next.js preset is
   detected automatically; no build settings need changing.
3. Add every variable from `.env.local.example` under **Settings → Environment
   Variables** for Production (and Preview, if you want the chatbot and form
   working on preview deployments).
4. Add the custom domain under **Settings → Domains**, then update `site.url`
   in `src/content/site.ts` if the final domain differs — it feeds
   `metadataBase`, `sitemap.xml` and `robots.txt`.
5. Add the production domain to the Turnstile widget's allowed hostnames, and
   verify the sending domain in Resend.

Or from the CLI:

```bash
npx vercel link
npx vercel env pull .env.local   # fetch configured vars
npx vercel --prod
```

---

## The chatbot

The website assistant runs **Claude Haiku 4.5** through the **Vercel AI SDK**
(`@ai-sdk/anthropic`), streaming from `src/app/api/chat/route.ts` to the
`useChat` widget in `src/components/chat/chat-widget.tsx`.

### Its knowledge

The assistant knows only what `src/lib/firm-knowledge.ts` builds into its system
prompt, and that is **generated from the site's own content** — `src/content/site.ts`
(firm details, team, FAQs, articles) and `src/content/practice-areas.ts`. Change
a fact on the site and the assistant's answers follow automatically; there is no
second copy to keep in sync.

`src/content/firm-knowledge.md` is the hand-authored overflow for facts that
appear nowhere on the site (parking, appointment practicalities). It is plain
markdown with editing instructions inside it, safe for a non-developer to edit.
Its HTML comments and its `## Not yet confirmed` checklist are stripped before
the prompt is sent, so notes-to-self cost nothing and never reach the model.
`next.config.ts` traces the file into the serverless bundle.

### Its guardrails

Layered, in order:

1. **Origin check** — a POST from another site's browser is rejected 403.
2. **Schema** — the request body accepts only `user` and `assistant` roles. A
   client cannot send a `system` turn, and every message is rebuilt from its
   plain text, so no file, tool call or provider metadata can reach the model.
3. **Size** — any message over 1,000 characters is rejected 413; history is
   truncated to the last 6 turns; output is capped at 500 tokens.
4. **Rate limits and daily budget** — see below.
5. **System prompt** — an explicit instruction hierarchy (conversation text is
   visitor content, never instruction), no legal advice, this-firm-only scope,
   no other capabilities, no prompt disclosure, and no stating a fact it wasn't
   given. Out-of-scope requests get one short on-brand redirect to the office.

### Swapping model or provider

Model is one line — `MODEL_ID` in `src/app/api/chat/route.ts`. Another provider
is two: install its `@ai-sdk/*` package and change `anthropic(MODEL_ID)`.
`streamText`, the streaming response and the `useChat` client all stay the same.

---

## Project structure

```
design/                         The four reference PNGs
src/
  app/
    layout.tsx                  Header + Footer + chat provider/widget
    page.tsx                    Home
    contact/                    Contact page
    about/ team/ insights/      Secondary pages
    <practice-area>/            commercial-law, family-law, conveyancing,
                                estate-planning, criminal-law
    practice-areas/             Index of the above
    privacy-policy/ terms-of-service/ cookies-settings/
    api/chat/                   Streaming chatbot endpoint
    api/contact/                Contact form endpoint
    sitemap.ts robots.ts
  components/
    home/                       Home page sections
    site/                       Header, footer, cards, shared page templates
    contact/                    Contact form + Turnstile
    chat/                       Chat context + floating widget
    ui/                         Button, Container, Section, PlaceholderImage
    icons.tsx                   All inline SVG icons
  content/
    site.ts                     * Single source of truth for firm details
    firm-knowledge.md           * Editable chatbot knowledge base
  lib/
    fonts.ts                    Rethink Sans + Roboto Serif (local files in src/fonts, via next/font/local)
    rate-limit.ts               Upstash / in-memory limiters and daily budget
    firm-knowledge.ts           Builds the assistant's system prompt
    contact-schema.ts           Zod schema shared by client and server
```

### The two files the client's content lives in

- **`src/content/site.ts`** — phone, email, address, hours, ABN, established
  year, practice areas, team, articles, FAQs, navigation and social links.
  Components never hardcode contact details; they import from here.
- **`src/content/firm-knowledge.md`** — plain markdown the chatbot is given as
  context. Safe for a non-developer to edit.

---

## Design system

Tokens are defined with Tailwind v4's CSS-first `@theme` block in
[`src/app/globals.css`](./src/app/globals.css), sampled from the design PNGs.
Values that could not be read exactly are marked `TBC from Figma`.

| Token | Value | Used for |
| --- | --- | --- |
| `--color-navy` | `#14213d` | Hero, "Why", History bands |
| `--color-navy-deep` | `#101a30` | Services, Insights, CTA, footer |
| `--color-surface` | `#f8f9fa` | Header bar, Team and FAQ bands |
| `--color-paper` | `#ffffff` | Newsletter band |
| `--color-button-light` | `#f3f3f3` | Solid light buttons |
| `--color-line-on-dark` | `#ffffff` | Input borders, footer divider |

- **Border radius is 0 everywhere** — enforced by a base rule in `globals.css`.
- **Type:** DM Sans for headings, PT Serif for body copy, labels and button
  text (both stand-ins, TBC from Figma). Scale: H1 72/40px, H2 52/36px,
  H3 28/24px, body 18/16px at line-height 1.5.
- Semantic type classes (`type-display`, `type-h2`, `type-body`, `type-eyebrow`,
  …) live in the `@layer components` block.

---

## Chatbot rate limits and cost

The Anthropic API is pay-as-you-go, so the limits in `src/lib/rate-limit.ts` are
there to bound **cost and abuse**, not to fit under a free tier. In order:

1. **8 requests/minute** and **30/hour** per IP — one visitor cannot run up the
   bill.
2. **20 requests/minute site-wide** — a burst ceiling against scripted traffic.
3. A **daily counter** blocked at `CHATBOT_DAILY_BUDGET` (default 600 replies).

The daily counter is only *read* when checking and incremented after Anthropic
has actually served a response, so a failed call never spends budget. Upstash
backs the counters in production; an in-memory fallback covers local dev.

The system prompt measures ~3,850 tokens, so a reply costs about half a cent
and the 600/day ceiling works out near **$3/day** — that is the ceiling, not
the expectation; real traffic for a site this size is cents. If traffic ever justifies it, Anthropic prompt
caching on the system prompt is the next lever.

The route also truncates history to the last 6 messages, rejects messages over
1,000 characters, caps output at 500 tokens, and retries once on an
upstream 429. On any failure the widget switches to "Our assistant is taking a
break — you can reach us directly" with the phone number and a link to
`/contact`. It never shows a broken state.

A persistent privacy notice sits above the conversation, and the system prompt
forbids giving legal advice or asking for personal details.

---

## SEO & AI discoverability

The site is built to rank in local search **and** to be citable by AI answer
engines (ChatGPT, Claude, Perplexity, Google AI Overviews).

- **Structured data (JSON-LD)** — generated, never hand-written, from
  `src/content` by [`src/lib/structured-data.ts`](./src/lib/structured-data.ts)
  and rendered via [`<JsonLd>`](./src/components/site/json-ld.tsx):
  - Home: `LegalService` + `LocalBusiness` firm entity, `WebSite`, `FAQPage`,
    and `Person` for each solicitor (currently none — see below).
  - Practice-area pages: `Service` (linked to the firm) + `BreadcrumbList`.
  - Team / practice-areas index: `BreadcrumbList` (+ `Person` on the team page).
  - The `Person` nodes are scaffolded now and **auto-populate** once the
    placeholder `"Name"` team entries in `site.ts` become real people.
- **Metadata** — every page has a unique title/description, canonical, Open
  Graph and Twitter card. `metadataBase` is `site.url`. The social share image
  is generated at build by [`opengraph-image.tsx`](./src/app/opengraph-image.tsx)
  (reused for Twitter) — no static asset to maintain.
- **`robots.txt`** ([`robots.ts`](./src/app/robots.ts)) explicitly **allows the
  major AI crawlers** (GPTBot, ClaudeBot, PerplexityBot, Google-Extended,
  Applebot-Extended, CCBot, Bingbot…). This is a deliberate visibility-over-
  protection decision; reverse it by flipping a bot's rule to `disallow`.
- **[`/public/llms.txt`](./public/llms.txt)** — a plain-language, fact-first
  summary of the firm for AI systems. Keep it in sync with `site.ts` by hand.
- **Sitemap** ([`sitemap.ts`](./src/app/sitemap.ts)) covers the home page, every
  deep page and the legal pages, and is referenced from `robots.txt`.

### IndexNow (instant Bing / AI-search indexing)

After a **production deploy**, ping IndexNow so Bing (and the AI products it
feeds) re-crawl within minutes:

```bash
npm run indexnow
```

It fetches the live `sitemap.xml` and submits every URL. It is best-effort and
**never fails a pipeline** — errors are logged and it exits 0.

- The verification key is public at `/public/1b2b97a033a052d61b24b82aaecd5b59.txt`
  — **do not delete that file** or IndexNow submissions are rejected.
- Override the origin or key with `SITE_URL` / `INDEXNOW_KEY` env vars.
- [`src/lib/indexnow.ts`](./src/lib/indexnow.ts) exposes `submitUrls()` if you
  ever want to trigger a ping from a route or webhook instead.

---

## Outstanding TODOs

Search the codebase for `TODO:` — the current list:

- Founding year: **1920** is used everywhere ("Since 1920").
- Facebook is the only social profile (`site.socials`) only.
- Search for `TODO CONFIRM`, `TODO ON HOLD` and `TODO APPROVAL` for the open
  items from the change brief (Google Maps key/billing, Legal Aid notice,
  community descriptions/photos, per-person practice areas, and approval of
  the five legal pages before launch).
- Google Maps: set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` and
  `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` in Vercel (see `.env.local.example`); until
  then the site shows a static fallback map.
- Final logo artwork. A client-supplied placeholder wordmark is in use
  (`/public/logo.png` navy + `/public/logo-light.png` off-white, recoloured
  from the original in `src/components/site/logo.tsx`); swap for the final
  vector/high-res files when available.
- Real photography (`PlaceholderImage` renders neutral grey blocks).
- Real team names, roles and photos.
- Real article content — `/insights/[slug]` pages are stubs.
- Confirm the "Anti-Money Laundering Laws" headline with the designer (the
  design reads "Anti-Lundering Money Laws").
- Confirm the newsletter band's content — its heading ("Proud Sponsors of Local
  Sporting Club") does not match the subscribe copy beneath it.
- Wire the newsletter signup to a real email service (it is UI only).
- Replace the placeholder privacy policy, terms and cookies copy.
- Confirm the placeholder FAQ answers in `firm-knowledge.md`.
- Verify a real sending domain in Resend and set `CONTACT_EMAIL_FROM`.
