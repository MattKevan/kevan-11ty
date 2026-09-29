# Astro + EmDash Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert Kevan.tv from Eleventy to Astro with EmDash and Tailwind CSS 4, migrate editable content, preserve routes and legacy assets, and run a local review site before any deployment.

**Architecture:** Keep the repository root as the Astro app and `src/` as Astro's source folder. Use EmDash collections as the editorial source of truth, a local SQLite/media configuration for the review server, and Cloudflare Workers with D1/R2 configured for production. Preserve the existing site structure and URLs with Astro layouts, collection templates, and public static assets.

**Tech Stack:** Astro 6+, EmDash, React integration for EmDash admin, Tailwind CSS 4 via `@tailwindcss/vite`, Cloudflare Workers adapter, EmDash D1/R2 adapters, SQLite/local media for local development.

---

## File map

- Modify repository-root `package.json` and `package-lock.json` to replace Eleventy/PostCSS scripts and dependencies with Astro/EmDash/Tailwind/Cloudflare dependencies.
- Replace repository-root `.eleventy.js`, `tailwind.config.js`, and `postcss.config.js` with `astro.config.mjs`, `wrangler.jsonc`, and Tailwind v4 CSS-first configuration; retain any still-needed postcss settings only if a dependency requires them.
- Create `src/live.config.ts` for EmDash's live content collection and `src/content.config.ts` only if required by the chosen Astro version/configuration.
- Create Astro layouts and focused components under `src/layouts/` and `src/components/` for document metadata, site navigation, footer, cards, and portable rich content.
- Replace old template pages under `src/pages/` with Astro routes for home, article/project/work/artwork listings and details, about, 404, feed, and existing utility pages.
- Create a one-time migration utility under `scripts/` to parse existing frontmatter/Markdown/raw HTML and seed the EmDash local database while keeping route slugs and media references.
- Move or copy static content required at runtime into repository-root `public/` (`images`, `bbc`, legacy CSS/JS and other passthrough assets), preserving URLs; do not alter `src/index 2.html`.
- Update `.gitignore` for local database, local uploads, generated EmDash types, and secrets. Keep `.env` untracked.

## Task 1: Convert the root build configuration

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Delete or replace: `.eleventy.js`, `tailwind.config.js`, `postcss.config.js` as their responsibilities move to Astro/Vite
- Create: `astro.config.mjs`
- Create: `.gitignore` additions

- [ ] Install Astro 6+, `emdash`, `@astrojs/react`, `react`, `react-dom`, `@astrojs/cloudflare`, `@emdash-cms/cloudflare`, `tailwindcss@^4`, `@tailwindcss/vite`, and Wrangler. Keep existing packages only if still required by retained pages/scripts.
- [ ] Set npm scripts to `dev: astro dev`, `build: astro build`, and `preview: astro preview`; add explicit seed/type scripts for EmDash after the migration command is established.
- [ ] Configure `astro.config.mjs` with server output, Cloudflare adapter, React integration, Tailwind Vite plugin, and EmDash. Select SQLite/local file uploads for development and D1/R2 bindings `DB`/`MEDIA` in production.
- [ ] Configure `wrangler.jsonc` with a Worker name, supported compatibility date/flags, D1 binding `DB`, and R2 binding `MEDIA`. Use an obvious placeholder database id until a Cloudflare account resource is provisioned; never commit credentials or encryption secrets.
- [ ] Add `data.db`, `uploads/`, `.env`, and generated `emdash-env.d.ts` to `.gitignore` without hiding source content.

## Task 2: Move static assets and create the shared Astro shell

**Files:**
- Create: `public/images/`, `public/bbc/`, `public/css/`, and `public/js/` from their existing `src/` counterparts
- Create: `src/styles/global.css`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/SiteHeader.astro`, `SiteFooter.astro`, `PageBanner.astro`
- Modify: `src/styles/main.css`, `src/css/custom.css` only where migration requires

- [ ] Copy the assets referenced by the existing HTML to matching `public/` paths so `/images/...`, `/bbc/...`, `/css/...`, and `/js/...` URLs continue to work. Preserve originals until routes and rendering are confirmed; leave the untracked `index 2.html` untouched.
- [ ] Replace Tailwind 3 directives/configuration with Tailwind 4 `@import "tailwindcss";`, the Vite plugin, and CSS-first theme/custom component rules.
- [ ] Build a shared Astro document shell that carries over title, description, canonical URL, Open Graph/Twitter image behavior, theme color, favicon, RSS link, and analytics scripts from `_includes/head.liquid`.
- [ ] Rebuild the existing fixed bottom navigation and patterned footer, retaining menu destinations and small-screen behavior.
- [ ] Remove external script dependencies only if their existing behavior is recreated locally; retain scripts that support currently visible functionality.

## Task 3: Define and migrate the EmDash content model

**Files:**
- Create: EmDash seed/model files as required by current EmDash schema tooling
- Create: `scripts/migrate-legacy-content.mjs`
- Create: `scripts/README.md` with repeatable local migration instructions
- Create: `src/live.config.ts`

- [ ] Define collections for `articles`, `projects`, `work`, `artwork`, and `pages`, including stable slug/title, description, date, taxonomy, image/banner, featured flag, and Portable Text body fields where relevant.
- [ ] Read all existing `src/articles/`, `src/projects/`, `src/work/`, `src/artwork/`, and editable page files. Preserve original slugs and route mapping; normalize legacy date and boolean formats without dropping empty-but-intentional values.
- [ ] Convert Markdown and embedded HTML into EmDash-compatible Portable Text or supported raw/HTML blocks. Preserve media URLs and local asset references, and record unsupported blocks for follow-up rather than silently omitting them.
- [ ] Seed a local SQLite database from the migrated source in an idempotent way, keyed by collection and slug so repeat runs update rather than duplicate entries.
- [ ] Register `_emdash` with `defineLiveCollection({ loader: emdashLoader() })`, generate EmDash types through its CLI, and query a sample entry to establish the data contract before building route templates.

## Task 4: Rebuild site routes with the existing URL structure

**Files:**
- Create/modify: `src/pages/index.astro`
- Create/modify: `src/pages/articles/index.astro`, `src/pages/articles/[slug].astro`
- Create/modify: `src/pages/projects/index.astro`, `src/pages/projects/[slug].astro`
- Create/modify: `src/pages/work/index.astro`, `src/pages/work/[slug].astro`
- Create/modify: `src/pages/artwork/index.astro`, `src/pages/artwork/[slug].astro`
- Create/modify: `src/pages/about.astro`, `src/pages/404.astro`, `src/pages/feed.xml.ts`
- Create: focused card and Portable Text rendering components under `src/components/`
- Preserve or adapt: `src/articles/colour-palette-generator.html` and `src/artwork/*.html`

- [ ] Implement home modules from the existing 11ty homepage: featured article, recent articles, featured projects, and recent artwork, driven by EmDash queries.
- [ ] Implement the listing and detail pages for every editorial collection, including category grouping/filtering used by Work and featured ordering used by Projects.
- [ ] Render Portable Text bodies with semantic headings, lists, links, images, captions, and supported embeds; retain existing custom CSS for code, image layout, and special article content.
- [ ] Preserve trailing-slash routes, slugs, canonical metadata, title/description fallbacks, and old path forms where possible; add redirects for any unavoidable route changes in `_redirects`.
- [ ] Recreate RSS output from published articles and preserve the 404 page.
- [ ] Preserve the `/bbc` subtree and standalone HTML pages as static public assets; make sure their image/script relative paths continue to resolve.

## Task 5: Prepare Cloudflare production configuration and local editing

**Files:**
- Modify: `astro.config.mjs`, `wrangler.jsonc`, `.gitignore`, `package.json`
- Create/modify: `README.md` deployment and local setup section

- [ ] Verify the local dev config uses SQLite and local media so `npm run dev` works without Cloudflare credentials.
- [ ] Ensure production mode selects Cloudflare D1/R2 bindings and that Wrangler targets Workers, not Pages.
- [ ] Document the Cloudflare Free account steps needed later: create D1 and R2 resources, place their identifiers in `wrangler.jsonc`, set `EMDASH_ENCRYPTION_KEY` as a Worker secret, apply EmDash migrations, and deploy only when the owner requests it.
- [ ] Ensure EmDash admin route remains available at `/_emdash/admin/` and migrated collection entries can be edited and republished.

## Task 6: Start and present the local review site

**Files:**
- All implementation files above

- [ ] Run `npm run build` and resolve build-time configuration or content errors.
- [ ] Run `npm run dev -- --host 0.0.0.0` as a persistent local server and report the public site URL and `/_emdash/admin/` URL.
- [ ] Confirm representative routes return correctly: `/`, `/articles/`, one article detail, `/projects/`, `/work/`, `/artwork/`, `/about/`, `/bbc/`, and `/404.html` or Astro's 404 route.
- [ ] Report any content that needs manual editing, any URLs that could not be preserved, and the production-only Cloudflare values still needed. Do not deploy.
