const runtimeCache = "hp-sofa-runtime-v1407";
const patchCache = "hp-sofa-ui-patches-v1407";
self.addEventListener("install", event => { event.waitUntil(self.skipWaiting()); });
self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith("hp-sofa-catalog-runtime-")).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});
function canonical(request) {
  const url = new URL(request.url);
  url.search = "";
  if (url.pathname.endsWith("/")) url.pathname += "index.html";
  return url.href;
}
self.addEventListener("fetch", event => {
  const request = event.request, url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  // Update manifests must always be fresh, never read from an app cache.
  if (/\/(?:patch|update-mobile|test-patch)\.json$/.test(url.pathname)) return;
  event.respondWith((async () => {
    const patches = await caches.open(patchCache);
    const patched = await patches.match(request) || await patches.match(canonical(request));
    if (patched) return patched;
    const runtime = await caches.open(runtimeCache);
    const code = request.mode === "navigate" || /\.(?:js|css|html|json)$/.test(url.pathname);
    if (!code) {
      const cached = await runtime.match(request);
      if (cached) return cached;
    }
    try {
      const response = await fetch(request, { cache: code ? "no-store" : "default" });
      if (response.ok) {
        await runtime.put(request, response.clone());
        if (request.mode === "navigate") await runtime.put(canonical(request), response.clone());
      }
      return response;
    } catch (error) {
      const cached = await runtime.match(request) || await runtime.match(canonical(request));
      if (cached) return cached;
      throw error;
    }
  })());
});
