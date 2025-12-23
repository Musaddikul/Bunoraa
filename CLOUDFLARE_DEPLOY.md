# Cloudflare Deployment Guide (Pages & Workers)

This guide explains how to deploy your project to Cloudflare Pages (static assets) and Cloudflare Workers (edge middleware / API proxy).

## Files created
- `wrangler.toml` — minimal Pages configuration (keeps `pages_build_output_dir`).
- `wrangler.worker.toml` — production-ready Worker configuration for `bunoraa-worker`.

## High-level recommendations
- Use Pages for static assets (the result of `python manage.py collectstatic`, placed at `staticfiles/`).
- Use Workers for edge-level middleware, rewrites, caching, or API proxying to your origin server (Django app hosted on an origin service).
- Do NOT attempt to run a full Django instance inside a Worker — keep server-side work on origin.

## Setup steps (production)
1. Ensure the `name` field is set in `wrangler.toml` (already present).
2. Configure Cloudflare Pages project (in the Dashboard):
   - Build command: set to `exit 0` or use the GitHub/Pages UI to configure a custom build that runs your `collectstatic` step in CI and writes into `staticfiles`.
   - Build output directory: `staticfiles`.
3. Set your Worker `account_id`, `route` and `zone_id` in `wrangler.worker.toml` if needed.
4. Add secrets for production (do not store them in the repo):
   - Locally or in CI, run:
     - `wrangler secret put SECRET_KEY --env production`
     - `wrangler secret put DATABASE_URL --env production`
     - `wrangler secret put SENTRY_DSN --env production` (if used)
   - Alternatively, set them in the Cloudflare Dashboard (Workers > your Worker > Settings > Variables & Secrets > Secrets).
5. Publish your Worker (after setting secrets and confirming build output):
   - `wrangler publish --env production --config wrangler.worker.toml`

## CI notes
- Run DB migrations on your origin server (not during Pages or Worker builds). Migrations require DB credentials and should be performed by backend deployment process or separate migration job.
- Use CI to set secrets in Cloudflare via the API or the `wrangler` CLI.

## Troubleshooting
- If Pages complains about `wrangler.toml` being invalid:
  - Ensure the file is Pages-compatible: include `name` and `pages_build_output_dir` only (no Worker-only keys like `type` or `route`).
- If Worker deployment fails due to missing secrets, ensure `wrangler secret list --env production` shows them.

---
If you'd like, I can:
- Create a small `workers/` example (a proxy middleware) and a minimal `requirements-worker.txt` for the worker runtime.
- Add GitHub Actions or a sample CI job to automatically set secrets and publish the Worker when you push to `main`.

Which next step would you like me to implement? (example: add a sample Worker script, or add CI deployment config) ✨
