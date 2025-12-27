# SEO Pipeline Setup

This document explains how to use and configure the SEO keyword/research pipeline scaffolding.

## Overview

- `apps.seo` contains models for `Keyword`, `KeywordURLMapping`, `SERPSnapshot`, and `GSCMetric`.
- Two management commands:
  - `python manage.py seo_snapshot_serp "keyword" --num 10` — captures live SERP rows into `SERPSnapshot`.
  - `python manage.py seo_fetch_gsc --start-date YYYY-MM-DD --end-date YYYY-MM-DD` — imports GSC metrics (requires a service account JSON and `GSC_SERVICE_ACCOUNT_FILE` env var).

## Environment variables

- `SERPAPI_KEY` — optional, if present the SERP snapshot command will use SerpAPI (recommended for reliability).
- `GSC_SERVICE_ACCOUNT_FILE` — path to Google service account JSON for Search Console API.
- `GSC_SITE_URL` — the site URL configured in Search Console (e.g., `https://bunoraa.com`).
- `SEO_USER_AGENT` — optional; default is a Bunoraa SEO agent string.

## Installation

1. Add packages (already added in `requirements.txt`):
   - `google-api-python-client`, `google-auth`, `beautifulsoup4`, `serpapi` (optional), `requests`
2. Run migrations:
   - `python manage.py makemigrations apps.seo`
   - `python manage.py migrate`

## Usage

- Add target keywords via Django Admin (SEO > Keywords) and mark `is_target=True` for tracked terms.
- Run snapshots via cron or Celery beat:
  - `python manage.py seo_snapshot_serp "best wireless earbuds 2025" --num 10`
  - Or schedule Celery beat task `apps.seo.tasks.snapshot_all_keywords_serp` to run daily.
- Pull GSC metrics daily to populate `GSCMetric` for target keywords by scheduling `apps.seo.tasks.fetch_gsc_for_targets` or running management command:
  - `python manage.py seo_fetch_gsc --start-date 2025-12-25 --end-date 2025-12-25`

### Example Celery Beat schedule (add via Django admin or fixture)

```
# daily serp snapshot at 02:00 UTC
apps.seo.tasks.snapshot_all_keywords_serp -> crontab(hour=2, minute=0)
# daily GSC pull at 03:00 UTC
apps.seo.tasks.fetch_gsc_for_targets -> crontab(hour=3, minute=0)
```

Make sure Celery worker + beat are running and that the environment variables (`GSC_SERVICE_ACCOUNT_FILE`, `SERPAPI_KEY`) are configured for production usage.

## Next improvements (not yet implemented)

- Automated daily scheduling (Celery beat job).
- SERP feature detection (PAA, featured snippet, knowledge card) and SERP intent classification.
- Keyword clustering & automated content brief generation (top-content brief generator implemented).
- Integration with content generation and landing page scaffolding.


### Content brief generator

- Use `python manage.py seo_generate_brief "keyword" --top 5` to generate a content brief.
- The command pulls top SERP pages (from `SERPSnapshot`), fetches their HTML, extracts H1/H2/H3, tokenizes visible paragraphs, and suggests headings and top terms.
- Requires `beautifulsoup4` to be installed in the environment.
- Generated briefs are stored in `apps.seo.models.ContentBrief` and viewable in Django admin.

Tip: Mark high-priority `Keyword.is_target=True` and schedule `apps.seo.tasks.snapshot_all_keywords_serp` then run `seo_generate_brief` in a pipeline for automated briefs.

### Warm-up & prerender scheduling

- Use `apps.seo.tasks.warmup_service` as a Celery beat periodic task to hit configured `PRERENDER_PATHS` every 1-5 minutes to prevent Render cold starts.
- Use `python manage.py prerender_pages` to save snapshots that `BotPreRenderMiddleware` will serve to crawlers.
- Example Celery beat (use django-celery-beat schedule): run `apps.seo.tasks.warmup_service` every 3 minutes and `apps.seo.tasks.snapshot_all_keywords_serp` daily at 03:00 UTC.
