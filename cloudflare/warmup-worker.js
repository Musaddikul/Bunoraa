// Warmup Worker (module syntax)
// Deploy as a Cloudflare Worker and add a Cron Trigger (e.g., every 5 minutes).
// The scheduled event will fetch your health endpoint to keep the origin warm.

export default {
  async scheduled(event, env, ctx) {
    const urls = (env.WARMUP_URLS || 'https://bunoraa.com/healthz').split(',').map(s => s.trim()).filter(Boolean);
    for (const url of urls) {
      try {
        const res = await fetch(url, { method: 'GET', cf: { cacheEverything: 'force-cache' } });
        console.log('warmup', url, res.status);
      } catch (err) {
        console.error('warmup failed for', url, err);
      }
    }
  }
};

// Optional: expose a simple fetch handler so the worker service can be called manually
export async function fetch(request, env) {
  return new Response('ok', { status: 200 });
}