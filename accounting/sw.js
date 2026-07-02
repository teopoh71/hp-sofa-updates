const PATCH_CACHE = "accounting-ui-patch-v1";
const PATCH_PATHS = new Set([
  "/index.html",
  "/src/app.js",
  "/src/accounting-core.mjs",
  "/src/styles.css",
  "/data/company-data.json"
]);

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;
  const path = url.pathname.endsWith("/") ? `${url.pathname}index.html` : url.pathname;
  if (!PATCH_PATHS.has(path)) return;
  event.respondWith(cacheFirst(event.request));
});

async function cacheFirst(request) {
  const cache = await caches.open(PATCH_CACHE);
  const cached = await cache.match(request, { ignoreSearch: true });
  return cached || fetch(request);
}
