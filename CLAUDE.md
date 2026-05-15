# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

Personal portfolio site for Jung In-Soo (정인수) — "Marketer · AI Builder · AI SaaS".
Korean-language UI throughout. Live: <https://junginsu-portfolio.pages.dev>.

## Commands

Package manager: **pnpm** (10.33.2). All scripts run from the project root.

| Task | Command |
|---|---|
| Dev server | `pnpm dev` (Next.js dev, no chat API) |
| Production build | `pnpm build` (static export to `out/`) |
| Run all tests | `pnpm test` (vitest run, node env) |
| Watch tests | `pnpm test:watch` |
| Single test file | `pnpm test tests/api-chat.test.ts` |
| Single test by name | `pnpm test -t "knowledge base"` |
| Local chat API (Pages Function) | After `pnpm build`: `pnpm dlx wrangler pages dev out --compatibility-date=2025-01-01` (requires `.dev.vars` with `GEMINI_API_KEY`) |
| Capture URL screenshots | `pnpm capture` (Playwright, reads `scripts/url-list.json`) |
| Optimize images | `pnpm optimize` (sharp; converts to webp/avif) |

There is **no lint or typecheck script** — type errors surface during `next build`. To typecheck without building, use `pnpm dlx tsc --noEmit`.

## Architecture

### Static export + Edge Function (split deploy)

The site is configured for `output: "export"` (`next.config.ts`), producing a fully static `out/` directory. There is **no Next.js server runtime in production** — no SSR, no Route Handlers, no Server Actions. Two deploy targets work together:

- **GitHub Pages** (`.github/workflows/deploy.yml`): builds and serves the static `out/`.
- **Cloudflare Pages**: serves the same `out/` *plus* runs the Pages Function at `functions/api/chat.ts`. The Cloudflare deploy is the live URL above; GitHub Pages is a fallback mirror without the chat API.

When adding features, do not reach for SSR-only APIs (Route Handlers under `app/api/`, `dynamic = 'force-dynamic'`, server actions). Use the Cloudflare Pages Function path under `functions/` instead, and remember it runs on the Workers runtime (no Node built-ins beyond what Workers polyfills).

### App Router layout

- `app/layout.tsx` is the **only place** that mounts `ThemeProvider`, `LenisProvider`, `Nav`, `Footer`, `ScrollToTop`, and `ChatWidget`. Page files only render section components — they don't re-mount layout chrome.
- Dark mode default is enforced by an inline `<script>` in `<head>` that sets `data-theme` and `.dark` *before* React hydrates (prevents flash). Don't replace this with a React-only solution.
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

`lib/data/knowledge-base.ts` is special: it composes the other data files (plus `resume.ts`) into the `KNOWLEDGE_BASE` string injected into the chat system prompt. **When you change page content that the chat could be asked about, also update the corresponding section so the KB stays in sync** — the chat is instructed to refuse anything not in the KB.

### AI Chat Widget

- UI: `components/chat/{chat-widget,chat-message,walking-character}.tsx` — bottom-left floating widget with a 6-frame walking mascot.
- API: `functions/api/chat.ts` → POST `/api/chat`, proxies to Gemini 2.5 Flash (`gemini-2.5-flash`).
- Policy (enforced in the system prompt): KB-only for questions about Jung In-Soo; general questions allowed but must be prefixed with "정인수님과 관련 없는 일반 질문" disclosure; strict Korean grammar rules; hard refusals for impersonation / KB exfiltration.
- Tests: `tests/api-chat.test.ts`, `tests/knowledge-base.test.ts`, `tests/chat-widget.smoke.test.ts`. The API test imports `SYSTEM_PROMPT_FOR_TESTS` (exported only for this purpose).
- Local secret: `.dev.vars` (gitignored) with `GEMINI_API_KEY=...`. Never commit. Production secret is set in Cloudflare Pages dashboard.

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
- `optimize-images.ts` — sharp-based image optimization
- `process-mascot.ts` — slices the mascot sprite sheet into 6 walking frames
- `convert-portfolio-pdf.ts` — PDF → images (for the resume KB)
- `build-ai-builder-mosaic.ts`, `recapture-tickpoint.ts` — one-off content tools

## Conventions

### Korean content
All user-facing text is Korean. The chat system prompt has detailed Korean grammar rules (띄어쓰기, 조사 선택, 종결어미). When generating Korean copy or modifying chat behavior, re-read `functions/api/chat.ts` rather than guessing.

### Surgical changes (project rule)
The site has been through many design rounds with explicit content/design decisions captured in `docs/superpowers/specs/` and `docs/superpowers/plans/`. Before changing visible content (counters, copy, layout structure), check these documents — many "obvious improvements" have already been tried and reverted. Don't redesign sections that weren't part of the request.

### Image assets
- Originals stay in `image/` and `Character image/` (both gitignored). The build pipeline writes optimized output to `public/`.
- Use `public/` paths directly in components — `next/image` runs in `unoptimized` mode because of static export.

### Functions tsconfig is separate
`functions/tsconfig.json` is distinct from the app's `tsconfig.json` and the app's tsconfig excludes `functions/`. Edits to the Pages Function don't affect Next.js type-checking and vice versa.
