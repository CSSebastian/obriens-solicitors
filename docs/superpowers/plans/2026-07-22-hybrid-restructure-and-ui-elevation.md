# O'Briens — One-page restructure + style-guide adoption + UI/UX elevation

> **For agentic workers:** implement stage-by-stage. Commit at the end of each stage. Do NOT push — the client reviews commits first.

**Goal:** Turn the home page into a single-page experience (with practice-area deep pages kept as real routes for SEO), adopt the official style guide (colours, fonts, components), and add a considered, premium motion layer.

**Architecture:** Content lives once in typed content modules (`practice-areas.ts` with `summary` + `full`). Home renders one section per practice area with anchor ids; nav links smooth-scroll (ported Riverglen `slowScrollTo`). Deep pages stay for SEO with 301s for old URLs. Motion = IntersectionObserver reveals (CSS) + GSAP/ScrollTrigger for parallax + one pinned moment. All gated on `prefers-reduced-motion` and animate from a visible baseline.

**Tech stack:** Next 16 App Router, React 19, Tailwind v4 (`@theme`), `next/font/google`, GSAP 3.13 (100% free incl. ScrollTrigger since Apr 2025).

**Verified facts (from codebase + web):**
- Tokens/fonts are placeholders: navy `#14213d` already correct; surface `#f8f9fa` already correct; fonts are DM Sans / PT Serif stand-ins. 4 `TBC from Figma` markers remain.
- No hardcoded hex in components (only `globals.css` + `emails/`). Keep it that way.
- `faqs-desktop.tsx` = hand-rolled rAF interaction — **DO NOT TOUCH**. `faqs.tsx` wraps it (section `id="faqs"`).
- Unified `Button` already has primary/outline variants, zero radius, serif label. `Section` supports `id`. Content in `src/content/site.ts`.
- Riverglen `slowScrollTo`: quartic ease-in-out, `dur = clamp(1100, 2400, |dist|*1.15)`, offset 84, reduced→instant, **does NOT update hash** (must add), delegated `a[href^="#"]` interceptor.

---

## STAGE 0 — Adopt official style guide (commit separately, first)

**Colour tokens** (`globals.css @theme`): navy `#14213D` (already), Athens Gray surface `#F8F9FA` (already), add `--color-slate-gray #708090` (muted text), `--color-tundora #444444` (body on light), `--color-outer-space #22342C` (dark-green accent, used ONCE — footer band — flag `TODO: confirm Outer Space accent usage with designer`). Add a neutral ramp `--color-neutral-{50..900}`. Re-point `--color-text-muted-on-light` → slate-gray, `--color-text-on-light` body → tundora where full navy too heavy. Remove all 4 `TBC from Figma` comments as resolved.

**Fonts** (`fonts.ts` + `globals.css` + `layout.tsx`): replace `DM_Sans`→`Rethink_Sans` (headings), `PT_Serif`→`Roboto_Serif` (body). `next/font/google`, `display:swap`, subset latin, only used weights. Update `@theme` `--font-sans`/`--font-serif` vars + variable names. Update `layout.tsx` className. Remove old refs entirely.

**Emails** (`emails/shell.ts`): can't load web fonts — update fallback stacks to closest matches (grotesque for Rethink Sans, Roboto-Serif-leaning serif for body). Keep hex brand tokens (email needs literal hex).

**Components audit:** Button proportions vs guide; form inputs (label above, square, 1px border, generous height, muted placeholder) in contact form + modal; cards (square, thin border, flush image) across article/team/practice cards. Confirm zero radius holds.

**Verify:** grep no new hardcoded hex; no `TBC from Figma` left; both fonts load (network); visual pass every page for new font rhythm (re-wrapping headings, spacing). Report conflicts + resolutions. **Commit.**

---

## STAGE 1 — Hybrid structure (commit)

**Content** — create `src/content/practice-areas.ts` (typed), single source. Type:
`{ slug, id, navLabel, title, heading, eyebrow, tagline, icon, services[], summary[] (2-3 paras, home), full[] ({heading,text}, deep page), metaTitle, metaDescription, sensitive?, todo? }`.
Fill with tidied real copy from spec: Conveyancing, Estate Planning & Probate, Commercial Law, Family Law (sensitive: warm/calm, prominent confidential-consultation path), Criminal Law (careful placeholder + `TODO: client to supply criminal law copy`), Rural/Agribusiness (placeholder + `TODO: client to supply agribusiness copy`). Migrate `site.ts` practice data out; update all importers (`services.tsx`, deep pages, `sitemap.ts`, `practice-area-page.tsx`).

**Home sections** (`page.tsx` order): Hero → Services overview (6-area grid, each card scrolls to its section) → Conveyancing → Estate Planning → Commercial → Family → Criminal+Rural(combined) → What sets us apart (Why) → History → Team → Insights (collapsed: featured + 3 + "See all →" /insights) → FAQs (untouched) → Final CTA → Footer. Each PA section: eyebrow, `h2`, 2–3 para summary, services list, image, "Read more about X →" to deep page, contact CTA (modal). One `h1` (hero) only; section `id`s match anchors.

**New component:** `src/components/home/practice-section.tsx` (renders a PA section from content). Add to home in order.

**Nav** (`site.ts` + `header.tsx` + `mobile-menu.tsx`): items → anchors. Commercial→`/#commercial-law`, Family→`/#family-law`, Conveyancing→`/#conveyancing`, More▾ (Estate→`/#estate-planning`, Criminal→`/#criminal-law`, About→`/about`, Our team→`/team`, Insights→`/insights`). Insights = real page. Anchors work from deep pages (`/#family-law` navigates+scrolls). Keep collapse-on-scroll + Contact/phone buttons unchanged.

**Smooth scroll** — port Riverglen `slowScrollTo` + `useSlowScrollAnchors` into `src/lib/smooth-scroll.ts` + a client mount in layout (or home). Match easing/duration exactly. Additions: offset = header height (~90); **add `history.pushState(null,'',hash)` to update URL without jump**; cross-page: on deep page a `/#id` link must navigate then scroll (handle hash on load); respect reduced-motion (instant); must not fight FAQ rAF logic (it reads scroll pos regardless — compatible; just ensure offset consistent).

**SEO:** deep pages keep unique title/description/canonical/OG (Berri/Riverland intent). `next.config.ts` 301s: `/estate-planning-administration`→`/estate-planning`, `/our-team`→`/team`, `/contact-us`→`/contact`. Home JSON-LD `LegalService`/`LocalBusiness` (name, 11 Riverview Drive Berri SA 5343, phone, hours, geo, areaServed) + `FAQPage` from faqs. Heading hierarchy. `sitemap.ts` already has deep pages — verify + add any new (rural). **Commit.**

**301 note:** Next `redirects()` in `next.config.ts`, `permanent: true`.

---

## STAGE 2 — UI/UX elevation (commit)

**Install** `gsap` (3.13). Code-split: import `gsap`/`ScrollTrigger` only in the client components that use it (dynamic import in effect) so it's not in the main bundle. Report bundle before/after.

**Reveal utility** — `src/lib/use-reveal.ts` (IntersectionObserver + CSS transition). Reveal from **visible baseline** (class toggles, no hidden-until-JS): headings/paras/cards fade+rise 20–30px, 500–700ms ease-out, staggered, once only. No-JS fallback: content visible.

**Parallax** — `src/components/motion/parallax.tsx` (GSAP ScrollTrigger, images 10–15% slower; hero image). Disabled < `lg` and under reduced-motion.

**One pinned moment** — choose the single best (decision: "What sets us apart" / Why). GSAP pin, brief, content advances. lg+ only, reduced-motion off.

**Micro-interactions:** refine button/link hovers (no scale); nav active-section indicator (scroll-spy, updates active anchor); considered focus style. Section rhythm: vary navy/light cadence down the long page.

**Non-negotiables:** reduced-motion disables ALL scroll anim/parallax/pin (content immediate, usable); no hidden-until-animated that breaks w/o JS; transforms+opacity only (no layout shift); mobile <lg reduce/disable parallax+pin; 60fps (no scroll layout reads, sparse will-change, kill ScrollTriggers on unmount). **Commit.**

---

## Final verification (before finishing, do NOT push)
grep no hardcoded hex outside `@theme`/emails; no unresolved `TBC from Figma`; fonts load no FOUT. Every nav item scrolls correct w/ offset from home AND deep page. 5 old URLs 301. Deep pages full content + unique meta. JSON-LD parses/valid. reduced-motion disables everything; readable w/o JS. FAQ untouched + works; modal/chat/mobile-menu work. 390px: no jank/overflow, section rhythm OK. Lighthouse home — report score. `next build` + `eslint` + types pass. Summarise files changed + every `TODO:` left.

## Decisions I'm making (flagging per spec)
- Pinned section: **"What sets us apart" (Why)** — calmer than pinning the services grid.
- Outer Space `#22342C`: **darker footer band only** — `TODO: confirm Outer Space accent usage with designer`.
- Criminal + Rural/Agribusiness: careful placeholders + `TODO:` copy markers.
- Font weights: Rethink Sans 500/600/700 (headings/eyebrow), Roboto Serif 400 (+ 400 italic if used), trimmed to actual usage.
