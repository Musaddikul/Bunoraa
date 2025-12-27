# SEO Changes Applied (Automated Updates)

This file lists concrete changes implemented and next high-impact tasks to continue the SEO program.

## Changes implemented (code-level, deployed-ready)

- Canonicalization & robots
  - Added `canonical_url` and `meta_robots` to `core.context_processors.site_settings` (strips tracking params, preserves q/page, marks search/account/cart/checkout/wishlist wizard as `noindex, follow`).

- Render cold-start / performance
  - Added `gunicorn_conf.py` and updated `Procfile` + `render.yaml` to use it (preload worker, worker count, timeout, keepalive) to reduce cold-start impact.
  - Added a Render cron `warmup` job in `render.yaml` that hits `/health/` every 5 minutes to keep service warm.
  - Added `apps.seo.tasks.warmup_service` Celery task and `apps.seo.management.commands.warmup` for internal warm-ups.
  - Added `prerender_pages` management command to snapshot important pages and `BotPreRenderMiddleware` to serve cached snapshots to crawlers, plus `CacheControlHTMLMiddleware` to enable edge caching.
  - Added `EarlyHintsMiddleware` to emit `Link` headers for preload of main CSS and JS.
  - Inline critical CSS and non-blocking stylesheet preload added to `templates/base.html` to remove blank-first-paint and reduce LCP.
  - `static/robots.txt` now disallows `/account/`, `/cart/`, `/checkout/`, `/search/`, `/admin/` and points to `/sitemap.xml`.
  - Added `HostCanonicalMiddleware` to redirect `www.` host to apex (non-www).
  - Added `SEOHeadersMiddleware` to set `X-Robots-Tag: noindex, follow` for non-content paths.

- Meta & Titles
  - Introduced template filters `seo_title` (≤60 chars) and `seo_desc` (≤155 chars) in `core.templatetags.seo_tags`.
  - Applied filters across product, category, page, and home templates.
  - Search results now include `<meta name="robots" content="noindex, follow">` and rel prev/next links.

- Structured data & sitemaps
  - Added Product JSON-LD + BreadcrumbList to `templates/products/detail.html` (product name, images, offers, availability, aggregateRating if present).
  - Enhanced `ProductSitemap` to include image info (`images()` method) so image entries appear in `sitemap.xml`.

- Performance & headers
  - Enabled `GZipMiddleware` for backend compression.
  - Ensured main product LCP image uses `loading="eager"` and `fetchpriority="high"` for faster LCP.

- Analytics
  - Inject GA4 snippet into `base.html` when `GOOGLE_ANALYTICS_ID` is present in site settings (anonymize_ip configured).

## Next high-impact tasks (recommended automation & tasks to complete)

1. Implement programmatic keyword research pipeline (GSC API integration + SERP scraping / SERP API fallback).
2. Build content cluster management: a script to generate landing pages for keyword sets and track performance by URL.
3. Add FAQ/HowTo schema for content pages and product FAQ microdata for PAA inclusion.
4. Establish automated link outreach workflows and content brief generation from competitor gaps.
5. Integrate monitoring: automatic GSC data pull, weekly ranking diff, CTR, and automated content refresh scheduling.

For scripts and automated research we will need credentials for Google APIs and permission to access the live GSC account.

---

Changes are committed to the repository. Run tests and a staging deploy to verify templates and middleware under your staging environment before rolling to production.
