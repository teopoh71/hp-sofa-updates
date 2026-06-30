const cacheName = "hp-sofa-catalog-v165-photo-longpress";
const patchCacheName = "hp-sofa-patch-cache";
const appFiles = [
  "./",
  "./index.html",
  "./photo-viewer.html",
  "./styles.css?v=165-photo-longpress",
  "./app-version.js?v=165-photo-longpress",
  "./mixed-material-pricing.js?v=1",
  "./zolano-3776-layout.js?v=1",
  "./app.js?v=165-photo-longpress",
  "./assets/individual-item-photos.js?v=1",
  "./sofa-data.js?v=125-chinese-materials",
  "./sofa-recommendations.js?v=125-chinese-materials",
  "./zolano-data.js?v=42",
  "./chair-data.js?v=2",
  "./bed-data.js?v=125-chinese-materials",
  "./matching-data.js?v=147-bed-size-options",
  "./assets/photo-overrides.js?v=130-button-photo-swap",
  "./assets/photo-gallery.js?v=135-bed-effect-photos",
  "./assets/entry-gallery.js?v=156-patch-engine",
  "./assets/sofa-asset-gallery.js?v=2",
  "./manifest.json",
  "./update.json",
  "./assets/app-icon.svg",
  "./assets/zolano/zl-2807.jpg",
  "./assets/generated/zolano/ZL2802TARZ.jpg",
  "./assets/zolano/zl-2707.jpg",
  "./assets/zolano/zl-2868.jpg",
  "./assets/generated/zolano/ZL3776.jpg",
  "./assets/generated/zolano/ZL37762.jpg",
  "./assets/zolano/zl-3817.jpg",
  "./assets/zolano/zl-3778.jpg",
  "./assets/zolano/zl-3753.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => cache.addAll(appFiles))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== cacheName && key !== patchCacheName).map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    matchPatchCache(event.request).then((patched) => {
      if (patched) return patched;
      return caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(cacheName).then((cache) => cache.put(event.request, copy));
        return response;
      }));
    })
  );
});

async function matchPatchCache(request) {
  const cache = await caches.open(patchCacheName);
  const exact = await cache.match(request);
  if (exact) return exact;
  const url = new URL(request.url);
  if (url.pathname.endsWith("/app.js")) return null;
  if (!url.search) return null;
  url.search = "";
  return cache.match(url.href);
}





