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

## Worker CI example (GitHub Actions)
Use the provided `.github/workflows/worker-deploy.yml` to publish the Worker automatically. Add these repository secrets in GitHub before running the workflow:

- `CF_API_TOKEN` — Cloudflare API token with `account.workers.*` and `account.secrets` permissions.
- `CF_ACCOUNT_ID` — Cloudflare account id for your account (used by some workflows / logs).
- `DATABASE_URL` — (optional) DB URL used by the origin or for build-time checks (only if required).
- `SECRET_KEY` — (optional) Django `SECRET_KEY` (if your Worker/Build requires it).
- `SENTRY_DSN` — (optional) Sentry DSN for error reporting.

Tip: Commit a `package-lock.json` to the repository to allow `npm ci` in CI for faster, reproducible installs. If you can't commit a lockfile, the workflows now fall back to `npm install` automatically.

The workflow will:
- Install `wrangler` and publish with `npx wrangler publish --config ./wrangler.worker.toml --env production`.
- For secrets defined in GitHub Secrets, it will call `npx wrangler secret put <NAME> --env production` (non-interactive) to install them into Cloudflare for the Worker.

### Example local commands
- Publish locally (after setting `CLOUDFLARE_API_TOKEN` env var):
  - `npx wrangler publish --config ./wrangler.worker.toml --env production`
- Put a secret locally:
  - `printf '%s' "${DATABASE_URL}" | npx wrangler secret put DATABASE_URL --env production --config ./wrangler.worker.toml`

---

If you'd like, I can also:
- Create a minimal `workers/` proxy example and `requirements-worker.txt` for packaging worker code.
- Add deployment checks (smoke tests) to the workflow.

Which of those should I create next?
