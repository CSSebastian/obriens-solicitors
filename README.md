# O'Briens Solicitors

Website for [O'Briens Solicitors](https://www.obriens-solicitors.com.au), a law
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
| `GOOGLE_GENERATIVE_AI_API_KEY` | for the chatbot | [Google AI Studio](https://aistudio.google.com/apikey) key. Free tier. |
| `CHATBOT_DAILY_BUDGET` | no (default `600`) | Site-wide cap on assistant replies per day. |
| `RESEND_API_KEY` | for the contact form | [Resend](https://resend.com/api-keys) API key. |
| `CONTACT_EMAIL_TO` | for the contact form | Where enquiries are delivered. |
| `CONTACT_EMAIL_FROM` | no | Verified Resend sender. Falls back to Resend's sandbox address. |
| `TURNSTILE_SECRET_KEY` | recommended in prod | Cloudflare Turnstile secret. Verification is skipped when unset. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | recommended in prod | Turnstile site key. The widget is not rendered when unset. |
| `UPSTASH_REDIS_REST_URL` | **yes in prod** | Shared rate-limit + quota store. |
| `UPSTASH_REDIS_REST_TOKEN` | **yes in prod** | Shared rate-limit + quota store. |

> Without Upstash the app falls back to an **in-memory** limiter. That is fine
> locally, but on Vercel each serverless instance would keep its own counters,
> so the site-wide Gemini quota would not actually be enforced. Set the Upstash
> variables before going live.

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

## Switching AI providers

The chatbot goes through the **Vercel AI SDK**, so swapping models or providers
is a one-line change in [`src/app/api/chat/route.ts`](./src/app/api/chat/route.ts):

```ts
import { google } from "@ai-sdk/google";
const MODEL_ID = "gemini-2.5-flash-lite";
// ...
model: google(MODEL_ID),
```

To move to, say, Anthropic:

```bash
npm install @ai-sdk/anthropic
```

```ts
import { anthropic } from "@ai-sdk/anthropic";
// ...
model: anthropic("claude-haiku-4-5-20251001"),
```

Set that provider's API key (`ANTHROPIC_API_KEY`) and nothing else changes —
`streamText`, the streaming response and the `useChat` client all stay the same.
Consider relaxing the rate limits in `src/lib/rate-limit.ts`, which are tuned
for Google's free tier (~15 req/min, ~1,000 req/day site-wide).

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
    fonts.ts                    DM Sans + PT Serif (self-hosted via next/font)
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

## Chatbot quota protection

`gemini-2.5-flash-lite` on Google AI Studio's free tier allows roughly 15
requests/minute and 1,000/day **for the whole site**. `src/lib/rate-limit.ts`
therefore enforces, in order:

1. **6 requests/minute** and **30/hour** per IP — one visitor cannot exhaust the
   shared quota.
2. **10 requests/minute site-wide** — below Google's ~15/min ceiling.
3. A **daily counter** blocked at `CHATBOT_DAILY_BUDGET` (default 600).

The route also truncates history to the last 6 messages, rejects user messages
over 1,000 characters, caps output at 500 tokens, and retries once on an
upstream 429. On any failure the widget switches to "Our assistant is taking a
break — you can reach us directly" with the phone number and a link to
`/contact`. It never shows a broken state.

A persistent privacy notice sits above the conversation, and the system prompt
forbids giving legal advice or asking for personal details.

---

## Outstanding TODOs

Search the codebase for `TODO:` — the current list:

- Confirm the founding year (`site.established`): the design says 1926, the
  firm's current site says 1920. **1920** is used everywhere.
- Real social profile URLs, or remove the icons (`site.socials` is empty, so
  nothing renders today).
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
