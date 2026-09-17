# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

Personal portfolio site for Jung In-Soo (정인수) — "Marketer · AI Builder · AI SaaS".
Korean-language UI throughout. Live: <https://isjung.mktinsight.kr> (Vercel; `https://junginsu-make-github-io.vercel.app` also valid).

> Note: the sibling product **Naver Shopping Insight (NSI)** lives at `https://shopping.mktinsight.kr` — a *separate* app/infra, not this repo. This repo is only the portfolio.

## Commands

Package manager: **pnpm** (10.33.2, via corepack). All scripts run from the project root.

| Task | Command |
|---|---|
| Dev server (incl. chat API) | `pnpm dev` (Next.js dev; `/api/chat` route works if `GEMINI_API_KEY` is set in `.env.local`) |
| Production build | `pnpm build` (`next build` → `.next/`, Vercel server runtime — **not** a static export) |
| Run all tests | `pnpm test` (vitest run, node env) |
| Watch tests | `pnpm test:watch` |
| Single test file | `pnpm test tests/api-chat.test.ts` |
| Single test by name | `pnpm test -t "knowledge base"` |
| Capture URL screenshots | `pnpm capture` (Playwright, reads `scripts/url-list.json`) |
| Optimize images | `pnpm optimize` (sharp; converts to webp/avif) |
| Portfolio PDF | `pnpm pdf` (`capture-portfolio-pdf.ts`) |

There is **no lint or typecheck script** — type errors surface during `next build`. To typecheck without building, use `pnpm dlx tsc --noEmit`.

## Architecture

### Deploy: Vercel single deploy (server runtime)

The site runs on **Vercel with a Next.js server runtime** (`next.config.ts`: no `output: "export"`, `trailingSlash: true`, `images.unoptimized`). Pushing to **`main` auto-deploys** to production (Vercel project `junginsu-make-github-io`, team `junginsus-projects`).

- Route Handlers (`app/api/*`), SSG (`generateStaticParams`), and normal server features **are available** — use them. (The old `output: "export"` + Cloudflare Pages + GitHub Pages split deploy is **retired**; `.github/workflows/deploy.yml` was deleted. Only `generate-pdf.yml`, a manual workflow, remains.)
- The chat secret `GEMINI_API_KEY` is set in the **Vercel dashboard** (Environment Variables) — Claude can't set it; a redeploy applies it.
- **Storage: Upstash for Redis** (Vercel Marketplace resource `portfolio-counter`, free plan) backs the footer visitor counter. Env vars are `KV_REST_API_URL` / `KV_REST_API_TOKEN` — **not** `UPSTASH_REDIS_REST_URL`; `Redis.fromEnv()` falls back to the `KV_*` names, so it works unchanged. Pull them locally with `vercel env pull .env.local`. Keys: `visits:total`, `visits:day:<KST date>`, `visits:uv:<KST date>` (48h TTL). See `lib/visits.ts`.
- Custom domain: `isjung.mktinsight.kr` (Gabia DNS, CNAME → `cname.vercel-dns.com`) is attached to **this** Vercel project. If a domain returns `404 DEPLOYMENT_NOT_FOUND`, it's attached to the wrong Vercel project — add it to the portfolio project.

### App Router layout

- `app/layout.tsx` is the **only place** that mounts `ThemeProvider`, `LenisProvider`, `Nav`, `Footer`, `ScrollToTop`, `ChatWidget`, `CursorFollower`, and `MobileTabbar`. Page files only render section components — they don't re-mount layout chrome.
- **Dark mode is the default** (localStorage key `theme-v2`), enforced by an inline `<script>` in `<head>` that sets `data-theme` *before* React hydrates (prevents flash). Light is available via the toggle. Don't replace this with a React-only solution. The default is written in **three** places that must agree — the inline script's `s || 'dark'` and its `catch` fallback in `app/layout.tsx`, plus `useState<Theme>("dark")` and `saved ?? "dark"` in `lib/theme.tsx`. Read the code, not this line, before making contrast decisions.
- `metadataBase` in `app/layout.tsx` is `https://isjung.mktinsight.kr` (drives OG/canonical) — keep it in sync with the live domain.
- Pretendard Variable is loaded via jsdelivr CDN (not `next/font/google`) because it's not in Google Fonts. `Fraunces` (display) and `JetBrains_Mono` are loaded via `next/font/google`.
- Path alias `@/*` maps to the project root (see `tsconfig.json`).

### Page → section composition

Each route under `app/` is a thin composer that imports section components from `components/<page>/`:

- `app/page.tsx` → `components/home/{manifesto,counter-section,saas-cycle,three-categories,duality,cta}.tsx`
- `app/about/page.tsx` → `components/about/*`
- `app/builder/page.tsx`, `app/builder/[slug]/`, `app/builder/scenarios/` → `components/builder/*`
- `app/career/page.tsx` → `components/career/*`
- `app/marketing/{page,content,teaching}.tsx` → `components/marketing/*`

When asked to "fix the home counter section," edit `components/home/counter-section.tsx`, not the page file.

### Data layer

All page content lives in `lib/data/*.ts` as typed constants — there is no CMS, no fetch, no DB. Files map roughly 1:1 to pages (`home.ts`, `career.ts`, `marketing.ts`, `saas.ts`, `scenarios.ts`, …).

`lib/data/knowledge-base.ts` is special: it composes the other data files (plus `resume.ts`) into the `KNOWLEDGE_BASE` string injected into the chat system prompt, and carries `KNOWLEDGE_BASE_VERSION`. **When you change page content that the chat could be asked about, also update the corresponding section (and bump the version) so the KB stays in sync** — the chat is instructed to refuse anything not in the KB.

### AI Chat Widget

- UI: `components/chat/{chat-widget,chat-message,walking-character}.tsx` — bottom-left floating widget with a 6-frame walking mascot. Fetches `POST /api/chat/`.
- **Logic lives in `lib/chat-core.ts`** (`chat()` + `SYSTEM_PROMPT`), a platform-agnostic Web-API core. It's called from two thin adapters:
  - `app/api/chat/route.ts` — the **live** Vercel Route Handler (`process.env.GEMINI_API_KEY`), proxying to Gemini 2.5 Flash.
  - `functions/api/chat.ts` — a legacy thin wrapper for the retired Cloudflare Pages Function (kept for tests; not the live path).
- Policy (in `SYSTEM_PROMPT`): KB-only for questions about Jung In-Soo; general questions allowed but prefixed with a "정인수님과 관련 없는 일반 질문" disclosure; strict Korean grammar rules; hard refusals for impersonation / KB exfiltration; **client company names are confidential — never reveal real names**.
- Tests: `tests/api-chat.test.ts`, `tests/knowledge-base.test.ts`, `tests/chat-widget.smoke.test.ts`. The API test imports `SYSTEM_PROMPT_FOR_TESTS`.
- Local secret: `.env.local` / `.dev.vars` (gitignored) with `GEMINI_API_KEY=...`. Never commit. Production secret is in the **Vercel dashboard**.

### Motion system

`components/motion/*` are project-specific primitives built on GSAP + Lenis + Framer Motion. Reuse them instead of pulling in new animation libs:

- `lenis-provider` — smooth scroll (mounted once in layout)
- `scroll-reveal`, `pin-section` — scroll-triggered animations (GSAP ScrollTrigger)
- `counter`, `pulse-number` — animated numbers
- `kinetic-text`, `word-highlight`, `color-sweep`, `mask-reveal` — text effects
- `magnetic` — hover magnetism

`lib/motion.ts` holds shared easing/duration tokens.

### UI primitives

`components/ui/*` are shadcn-style wrappers over Radix primitives (`@radix-ui/react-{dialog,tabs,tooltip,switch,slot}`). When adding a new primitive, check `frontend.md` global rule: shadcn first, query context7 MCP for the latest API.

### Scripts

`scripts/*.ts` run via `tsx` (not bundled). They're devtime tools, not part of the build:

- `capture-urls.ts` — Playwright screenshot capture per `url-list.json`
- `optimize-images.ts` — sharp-based image optimization (walks the `PUBLIC_DIRS` list; register new SaaS folders there)
- `capture-portfolio-pdf.ts` — live site → slide PDF (`pnpm pdf`)
- `process-mascot.ts` — slices the mascot sprite sheet into 6 walking frames
- `convert-portfolio-pdf.ts` — PDF → images (for the resume KB)
- `build-ai-builder-mosaic.ts`, `recapture-tickpoint.ts` — one-off content tools

## Conventions

### SaaS catalog (`lib/data/saas.ts`)

`SAAS_LIST` currently holds **8 live SaaS** (`tickpoint`, `lumio`, `os-agent`, `mkt-automation`, `propintel`, `architect`, `factto`, `shopping-insight`). When adding/removing one:

- **⚠️ Images must be 16:10 (1.60 ratio).** The home `SaasCycle` carousel, the detail gallery, and the index card are all `aspect-[16/10] object-cover` — any wider band (1.8, 2.0…) gets **cropped on the sides**. Crop full-page captures to a 16:10 top band (sharp `extract`; jpg q82 / webp q80 / avif q65). Files: `public/captured/<slug>/home/desktop.{jpg,webp,avif}` (card + hero) and `public/saas-folders/<slug>/NN.{jpg,webp,avif}` (gallery; the detail page reads `*.webp` via `fs.readdirSync`). `mobile.*` is unused by the code (can be skipped).
- **⚠️ Metric values render in a huge display font** (`saas-detail/metrics`). Use **short numbers / number+suffix** only ("20", "30일", "2종", "2+"). Long text values ("기기·성별·연령") wrap to 2 lines and break the layout.
- **Count sync**: the SaaS count appears in several spots — prefer `list.length` where possible; otherwise update `builder-hero`, `home.ts` counters, `app/layout`/`app/builder/page` metadata, `builder-stack.ts`, `home/duality`, `home/three-categories` captions, and the KB ("N Live SaaS").
- Register capture/optimize in `scripts/url-list.json` and `scripts/optimize-images.ts`.
- Tests to update: `tests/data/saas.test.ts` (length + slug order), `tests/knowledge-base.test.ts`.

### Client confidentiality

AI SaaS PL client company names are **anonymized** across all public surfaces (e.g. "대형 건설·부동산 그룹", "대형 법무법인", "대기업 그룹사"). Never reintroduce real client names in `lib/data/*` or the KB. `tests/data/marketing.test.ts` guards against real names.

### Korean content
All user-facing text is Korean. The chat system prompt has detailed Korean grammar rules (띄어쓰기, 조사 선택, 종결어미). When generating Korean copy or modifying chat behavior, re-read `lib/chat-core.ts` rather than guessing.

### Surgical changes (project rule)
The site has been through many design rounds with explicit content/design decisions captured in `docs/superpowers/specs/` and `docs/superpowers/plans/`. Before changing visible content (counters, copy, layout structure), check these documents — many "obvious improvements" have already been tried and reverted. Don't redesign sections that weren't part of the request.

### Image assets
- Originals stay in `image/` and `Character image/` (both gitignored). The pipeline writes optimized output to `public/`.
- Use `public/` paths directly in components — `next/image` runs in `unoptimized` mode.

### Functions tsconfig is separate
`functions/tsconfig.json` is distinct from the app's `tsconfig.json` (which excludes `functions/`). Edits to the legacy Pages Function don't affect Next.js type-checking and vice versa.
