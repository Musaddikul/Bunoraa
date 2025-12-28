Cloudflare Warmup Worker

Goal:
- Keep origin instances (e.g. free Render / Heroku spin-down instances) warm by scheduling an edge Worker to periodically hit a fast health endpoint (e.g., `/healthz`).

Options:
1) Cloudflare Dashboard (recommended)
   - Workers > Create a new Worker, paste `warmup-worker.js` code.
   - Save & Deploy.
   - In Worker > Triggers > Cron Triggers, add a Cron Trigger with a schedule. Example cron expressions:
     - Every 5 minutes: `*/5 * * * *`
     - Every 10 minutes: `*/10 * * * *`
   - Set a Worker environment variable `WARMUP_URLS` if you need to warm multiple URLs (comma-separated), e.g.:
     - `WARMUP_URLS=https://bunoraa.com/healthz,https://bunoraa.com/`

2) Wrangler CLI (deploy + schedule using dashboard or API)
   - Install wrangler: `npm i -g wrangler`
   - `wrangler init warmup-worker --type=javascript` then replace the generated script with `warmup-worker.js` contents.
   - `wrangler publish`
   - Add a Cron Trigger in the Cloudflare dashboard (Wrangler currently does not manage Cron Triggers on free accounts directly).

Notes & best practices:
- Use a short, cacheable health endpoint (we added `/healthz` middleware in the project). Keep the handler lightweight (no DB/auth).
- Schedule frequency: every 5 minutes is common; tune based on your host's spin-down behavior to reduce unnecessary pings.
- Optionally let the worker fetch `/` occasionally to warm caches and generate a quick HTML render, but prefer `/healthz` to avoid heavy work.
- If Cron Triggers are unavailable on your plan, use an external uptime monitor (UptimeRobot, Pingdom) pointed at `/healthz`.

Security & costs:
- Worker invocations will count against your Cloudflare Workers quota; check limits on the free plan. Cron Triggers may have restrictions depending on plan.

Example event logs:
- A successful fetch logs: `warmup https://bunoraa.com/healthz 200`.
- Errors are logged to the Worker logs; check Cloudflare's Logs/Analytics if you need to debug timeouts.

CI / GitHub Actions (recommended)
- I added a `wrangler.toml` at `cloudflare/wrangler.toml` and a GitHub Action workflow at `.github/workflows/deploy-warmup-worker.yml` to publish the worker on push.
- Add these secrets to your repository Settings → Secrets & variables → Actions:
  - `CF_API_TOKEN` — API token with `Workers Scripts: edit` permissions.
  - `CF_ACCOUNT_ID` — your Cloudflare account ID.
- After adding secrets: push the `cloudflare/` folder and trigger the workflow (Actions → Deploy Warmup Worker → Run workflow).

Workflow verification
- The workflow includes a post-deploy verification step which reads `WARMUP_URLS` from repository secrets (or defaults to `https://bunoraa.com/healthz`) and retries checks up to 5 times. If any URL does not return HTTP 200, the workflow fails to alert you.

Local publish (optional)
- Install wrangler: `npm i -g wrangler`
- Build (optional): `npm run build`
- Pages deploy command (if Cloudflare Pages requires a Deploy command):
  - Set Deploy command to `npm run pages:deploy` (this runs the static build and is a safe no-op for Worker deploy).
- Worker deploy (via GitHub Action or local):
  - `npx wrangler deploy`  # only run this from CI or your local environment, not in Pages build

