const cacheName = "hp-sofa-catalog-v1092-chair-photo-stable";
const patchCacheName = "hp-sofa-patch-cache";
const appFiles = [
  "./",
  "./index.html",
  "./styles.css?v=v1092-chair-photo-stable",
  "./app-version.js?v=v1092-chair-photo-stable",
  "./app.js?v=v1092-chair-photo-stable"
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    await Promise.allSettled(appFiles.map(async (url) => {
      const response = await fetch(url, { cache: "reload" });
      if (response.ok) await cache.put(url, response);
    }));
  })());
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter((key) => key !== cacheName && key !== patchCacheName)
      .map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith((async () => {
    const patched = await matchPatchCache(event.request);
    if (patched) return patched;

    const cached = await caches.match(event.request);
    if (cached) return cached;

    const response = await fetch(event.request);
    const url = new URL(event.request.url);
    if (response && response.ok && url.origin === self.location.origin) {
      const copy = response.clone();
      caches.open(cacheName)
        .then((cache) => cache.put(event.request, copy))
        .catch(() => {});
    }
    return response;
  })());
});

async function matchPatchCache(request) {
  const cache = await caches.open(patchCacheName);
  const exact = await cache.match(request);
  if (exact) return exact;

  const url = new URL(request.url);
  if (url.pathname.endsWith("/")) {
    const indexUrl = new URL(url.href);
    indexUrl.pathname = `${url.pathname}index.html`;
    indexUrl.search = "";
    const rootIndex = await cache.match(indexUrl.href);
    if (rootIndex) return rootIndex;
  }

  url.search = "";
  const withoutSearch = await cache.match(url.href);
  if (withoutSearch) return withoutSearch;

  if (url.pathname.endsWith("/")) {
    url.pathname = `${url.pathname}index.html`;
    return cache.match(url.href);
  }
  return null;
}




