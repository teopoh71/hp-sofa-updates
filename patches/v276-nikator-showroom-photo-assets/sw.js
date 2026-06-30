const cacheName = "hp-sofa-catalog-v276-nikator-showroom-photo-assets-local";
const patchCacheName = "hp-sofa-patch-cache";
const appFiles = [
  "./",
  "./index.html",
  "./photo-viewer.html",
  "./styles.css?v=v276-nikator-showroom-photo-assets-local",
  "./app-version.js?v=v276-nikator-showroom-photo-assets-local",
  "./mixed-material-pricing.js?v=1",
  "./zolano-3776-layout.js?v=1",
  "./app.js?v=v276-nikator-showroom-photo-assets-local",
  "./assets/individual-item-photos.js?v=2628-3817-merge",
  "./sofa-data.js?v=125-chinese-materials",
  "./sofa-recommendations.js?v=125-chinese-materials",
  "./zolano-data.js?v=2868-close-arm-fix",
  "./zolano-selling-overrides.js?v=2868-selling-price",
  "./zolano-excel-price-overrides.js?v=v276-nikator-showroom-photo-assets-local",
  "./zolano-visual-overrides.js?v=v276-nikator-showroom-photo-assets-local",
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
  "./assets/generated/zolano/MONTIERIZL2628.jpg",
  "./assets/generated/zolano/ZL3776.jpg",
  "./assets/generated/zolano/ZL37762.jpg",
  "./assets/generated/zolano/ZL3821ROVIGO.jpg",
  "./assets/generated/zolano/FG3129BISENZIO.jpg",
  "./assets/generated/zolano/ZL3805POTENZA.jpg",
  "./assets/generated/zolano/ZL3838DURAZZI.jpg",
  "./assets/generated/zolano/ZL3856MALKAM.jpg",
  "./assets/generated/zolano/ZL3863MARVELLO.jpg",
  "./assets/quick-thumbs/nikator/NK0003SF.jpg",
  "./assets/generated/nikator/NK0003SF.jpg",
  "./assets/quick-thumbs/nikator/NK0042SF.jpg",
  "./assets/generated/nikator/NK0042SF.jpg",
  "./assets/quick-thumbs/nikator/NK0024SF.jpg",
  "./assets/generated/nikator/NK0024SF.jpg",
  "./assets/quick-thumbs/nikator/NK0001SF.jpg",
  "./assets/generated/nikator/NK0001SF.jpg",
  "./assets/quick-thumbs/nikator/NK0011SF.jpg",
  "./assets/generated/nikator/NK0011SF.jpg",
  "./assets/quick-thumbs/nikator/LE8817SF.jpg",
  "./assets/generated/nikator/LE8817SF.jpg",
  "./assets/quick-thumbs/nikator/LE8803SF.jpg",
  "./assets/generated/nikator/LE8803SF.jpg",
  "./assets/quick-thumbs/nikator/LE8807SF.jpg",
  "./assets/generated/nikator/LE8807SF.jpg",
  "./assets/quick-thumbs/nikator/LE8815SF.jpg",
  "./assets/generated/nikator/LE8815SF.jpg",
  "./assets/quick-thumbs/nikator/LE8821SF.jpg",
  "./assets/generated/nikator/LE8821SF.jpg",
  "./assets/gallery/LE8821SF/01.jpg",
  "./assets/gallery/LE8821SF/02.jpg",
  "./assets/generated/zolano/line-strips/ZL2868LAOREST-strip.png",
  "./assets/generated/zolano/line-strips/ZL2707KANDER-strip.png",
  "./assets/generated/zolano/line-strips/ZL2807-strip.png",
  "./assets/generated/zolano/line-strips/ZL2802TARZ-strip.png",
  "./assets/generated/zolano/line-strips/ZL375342-strip.png",
  "./assets/generated/zolano/line-strips/ZL2672VICE-strip.png",
  "./assets/generated/zolano/line-strips/ZL2897-strip.png",
  "./assets/generated/zolano/line-strips/ZL2831-strip.png",
  "./assets/generated/zolano/line-strips/ZL3778-strip.png",
  "./assets/generated/zolano/line-strips/ZL3817MELFE-strip.png",
  "./assets/generated/zolano/line-strips/ZL3776-strip.png",
  "./assets/generated/zolano/line-strips/ZL2911-strip.png",
  "./assets/generated/zolano/line-strips/MONTIERIZL2628-strip.png",
  "./assets/generated/zolano/parts/MONTIERIZL2628-1ELT-top.png",
  "./assets/generated/zolano/parts/MONTIERIZL2628-1ERT-top.png",
  "./assets/generated/zolano/parts/MONTIERIZL2628-2EL-top.png",
  "./assets/generated/zolano/parts/MONTIERIZL2628-2NA-top.png",
  "./assets/generated/zolano/parts/MONTIERIZL2628-1NA-top.png",
  "./assets/generated/zolano/parts/MONTIERIZL2628-CORNER-top.png",
  "./assets/generated/zolano/parts/MONTIERIZL2628-2ER-top.png",
  "./assets/generated/zolano/parts/ZL3817MELFE-1ELT-top.png",
  "./assets/generated/zolano/parts/ZL3817MELFE-2ER-top.png",
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
  if (
    url.pathname.endsWith("/styles.css")
    || url.pathname.endsWith("/app-version.js")
    || url.pathname.endsWith("/zolano-visual-overrides.js")
    || url.pathname.endsWith("/index.html")
    || url.pathname.endsWith("/")
  ) return null;
  if (!url.search) return null;
  url.search = "";
  return cache.match(url.href);
}
































