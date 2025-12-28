const CACHE_NAME = 'bunoraa-shell-v1';
// Only precache static assets, avoid caching the HTML document to prevent serving stale/partial pages
const PRECACHE_URLS = [
  '/static/css/styles.css',
  '/static/js/app.bundle.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Avoid caching crossorigin requests
  if (url.origin !== location.origin) return;

  // For navigation/document requests, prefer network-first to ensure we don't serve stale or partial HTML
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then(r => {
          // Optionally update cache of the document only if you want an offline fallback (not recommended for dynamic sites)
          return r;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Network-first for API requests
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/api')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for static assets (scripts/styles/images)
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request).then(r => {
      // Optionally cache fetched assets
      if (event.request.destination === 'script' || event.request.destination === 'style' || event.request.destination === 'image') {
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, r.clone()));
      }
      return r;
    }))
  );
});