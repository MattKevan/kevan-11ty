# Astro + EmDash migration design

**Date:** 2026-09-29  
**Status:** Approved design; awaiting spec review before implementation

## Goal

Convert the existing Kevan.tv 11ty site to Astro, EmDash, and Tailwind CSS 4. Make editorial content editable in EmDash, preserve the site's established presentation and important URLs, and prepare the application for a free Cloudflare account. Run the application locally for the owner's review before deployment. No deployment is part of this work until that review is complete and the owner requests it.

## Existing site context

The current site is an 11ty project with its package configuration at the repository root and its content under `src/`. The content includes approximately 24 article files, 14 case studies, 8 projects, 9 artwork entries, and several landing pages. It also has local images and patterns, custom CSS and JavaScript, an RSS feed, SEO metadata, a standalone `/bbc` application, and a palette-generator page. The repository contains a pre-existing untracked `src/index 2.html`; it must be preserved without modification.

## Chosen approach

Convert the existing application in place. Keep the current repository and public URL structure rather than scaffolding a parallel site. Replace 11ty templates and build tooling with Astro pages and layouts, retain and adapt the current content and visual system, and connect EmDash as the editing and runtime content source.

### Content model and migration

Create EmDash collections for articles, projects, work/case studies, artwork, and general pages. Represent each entry's title, slug, description, date, image/banner, taxonomy, featured state, and long-form content with appropriate structured fields. Migrate the existing Markdown and HTML content into these collections while retaining existing slugs and route patterns, including trailing slash behavior. Include landing-page copy and site-level text in editable content where practical. Keep design templates, navigation behavior, and presentation code in Astro.

Preserve local media references during local migration and provide a clear path to EmDash media storage. Reuse the site's existing local media where possible rather than replacing it with unrelated imagery. Retain metadata behavior, canonical URLs, RSS output, and the 404 page.

### Frontend and legacy assets

Recreate the shared header, footer, page shell, cards, listing pages, and detail templates as Astro components. Use Tailwind CSS 4 via its Vite integration and migrate the existing utility styling and custom CSS without redesigning the site. Ensure existing interactive pages and assets remain reachable. Continue serving the `/bbc` application as a static subtree and preserve standalone tools such as the palette generator unless a route conflict requires a specific equivalent.

### EmDash and environments

Use EmDash's Astro integration and React integration for its admin interface. Use local SQLite and local media storage for local development and the review site so that editorial editing works without Cloudflare credentials. Configure the production Astro target for Cloudflare Workers, with D1 for content and R2 for media. Keep Cloudflare resource identifiers and secrets out of source control; document the values and account setup needed when deployment is requested. Deploy to Workers, not Pages.

### Review and acceptance

Before any deployment, start the application locally and provide the local public-site and EmDash admin URLs. The owner reviews both the rendered site and editing workflow. The conversion is ready for that review when the Astro application starts, the migrated content is present in public routes and in the editor, existing key routes/assets are retained, and the Cloudflare production configuration is present without requiring production resources during local review.

## Alternatives considered

1. **Convert in place (selected):** preserves the existing repository, content, assets, and URL structure with the least duplication.
2. **Create a parallel Astro app in a new subdirectory:** gives a clean scaffold but duplicates or relocates a large amount of content and introduces route and review drift.
3. **Keep Markdown as the editorial source with another Git-based editor:** avoids migrating stored content but does not make EmDash the site's actual content editor and source of truth.

## Risks and boundaries

- Existing content uses mixed Markdown, raw HTML, custom frontmatter, remote images, and hand-built interactive pages. The migration must preserve supported content and flag entries that need a manual representation.
- EmDash stores content in its database after migration; subsequent edits in the admin are not automatically written back to the original Markdown files.
- Cloudflare D1/R2 resources and production secrets are account-specific. They can be configured after local review; no account credentials are needed for local development.
- The root `package.json`, lockfile, and Eleventy/Astro configuration are one directory above the currently writable `src/` directory, so filesystem access to those repository-root files is required for implementation.
