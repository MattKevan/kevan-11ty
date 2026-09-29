# Kevan.tv

Personal portfolio built with Astro, EmDash, and Tailwind CSS 4.

## Local development

Requirements: Node.js 22.16 or newer.

```sh
npm install
npx emdash secrets generate --write .env
npm run emdash:seed
npm run dev
```

The public site runs at `http://localhost:4322/`. EmDash admin is at `http://localhost:4322/_emdash/admin/`. Use `localhost` for local passkey setup. The local config uses SQLite (`data.db`) and local uploads (`uploads/`). Both are ignored by Git. The first admin visit opens EmDash setup; finish the passkey setup in your browser.

`npm run emdash:seed` rebuilds `.emdash/seed.json` from the archived source content in `src/articles`, `src/projects`, `src/work`, `src/artwork`, and `src/content-source/pages`, then applies it to the local SQLite database. The seed contains 60 entries across five editable collections.

## Build

```sh
npm run build
```

The default Astro configuration targets Cloudflare Workers. `npm run dev` explicitly selects `astro.config.local.mjs` so local SQLite runs under the Node adapter.

## Cloudflare Workers deployment

The production configuration uses a Worker, D1 for EmDash content, R2 for media, KV for Astro/EmDash sessions, and the Workers Assets binding for static files. It is intended for Cloudflare's free account; service quotas and current Cloudflare plan limits apply.

Before deploying:

1. Create a D1 database, an R2 bucket, and a KV namespace in the Cloudflare dashboard or with Wrangler.
2. Replace the placeholder identifiers and bucket/database names in `wrangler.jsonc` with those resources. Bind the KV namespace as `SESSION`.
3. Back up the local EmDash content and configure the production `EMDASH_ENCRYPTION_KEY` with `npx wrangler secret put EMDASH_ENCRYPTION_KEY`. Do not commit `.env` or the key.
4. Apply EmDash's production D1 migrations and import the seed/content into the production database and media bucket.
5. Build and deploy to **Workers**, not Pages, after local review is complete.

No production account identifiers or secrets are included in this repository yet.
