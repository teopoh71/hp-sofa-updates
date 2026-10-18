/* v1400: 详情页底部浮动合计。只读取页面上已经算好的合计文字，不参与计价。
   位置贴在"加入购物车 / 报价购物车"横条上方；滚动时一直可见，点一下跳到合计区。 */
(function () {
  window.HP_LIVE_TOTAL_REVISION = 1407;
  var SOURCES = ['#figaroModularComposer .fg-summary', '.zl10-price-summary', '.zl3861-price-summary', '.combo-total', '.stareep-component-total'];
  var SIZES = ['#figaroModularComposer .fg-combination-size', '.combo-dimension', '.zl10-size', '[data-zl3861-size]'];
  var bar, label, amount, size, source, pending = false;

  function visible(el) {
    if (!el) return false;
    var cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    var r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }
  function firstVisible(list) {
    for (var i = 0; i < list.length; i++) {
      var els = document.querySelectorAll(list[i]);
      for (var j = 0; j < els.length; j++) if (visible(els[j])) return els[j];
    }
    return null;
  }
  function ensureBar() {
    if (bar) return;
    bar = document.createElement('button');
    bar.type = 'button';
    bar.id = 'hpLiveTotal';
    bar.className = 'hp-live-total';
    bar.setAttribute('aria-live', 'polite');
    bar.innerHTML = '<span class="hp-live-total-label"></span><strong class="hp-live-total-amount"></strong><small class="hp-live-total-size"></small>';
    label = bar.children[0]; amount = bar.children[1]; size = bar.children[2];
    bar.addEventListener('click', function () {
      if (source) source.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    document.body.appendChild(bar);
  }
  function setText(el, t) { if (el.textContent !== t) el.textContent = t; }
  function syncUpdateShortcut() {
    var head = document.querySelector('#hpModelLanding .hp-picker-head');
    var original = document.querySelector('.app-update-strip .app-check-update-button:not(.hp-local-reinstall):not(.app-story-button)');
    if (!head || !original) return;
    var shortcut = document.getElementById('hpHomeCheckUpdate');
    if (!shortcut) {
      shortcut = document.createElement('button'); shortcut.type = 'button'; shortcut.id = 'hpHomeCheckUpdate';
      shortcut.addEventListener('click', function () { original.click(); });
      head.appendChild(shortcut);
    }
    if (shortcut.disabled !== original.disabled) shortcut.disabled = original.disabled;
    setText(shortcut, original.textContent);
  }
  function update() {
    pending = false;
    syncUpdateShortcut();
    var detail = document.body.classList.contains('hp-page-detail');
    var el = detail ? firstVisible(SOURCES) : null;
    var text = el ? (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim() : '';
    var keys = ['折后价', '组合小计', '整套合计', '合计', '小计', '总计'], value = '', name = '合计';
    for (var k = 0; k < keys.length && !value; k++) {
      var m = text.match(new RegExp(keys[k] + '\\s*(¥\\s?[\\d,]+(?:\\.\\d+)?)'));
      if (m) { value = m[1].replace(/\s/g, ''); name = keys[k] === '折后价' ? '合计' : keys[k]; }
    }
    if (!value) { var all = text.match(/¥\s?[\d,]+(?:\.\d+)?/g); value = all ? all[all.length - 1].replace(/\s/g, '') : ''; }
    var pendingPrice = /待核价|价格待核|价格待确认/.test(text);
    var emptyFigaro = el && el.matches('.fg-summary') && /已选\s*0\s*项/.test(text);
    if (pendingPrice) { name = value ? '已知小计' : '合计'; if (!value) value = '待核价'; }
    if (emptyFigaro) value = '¥0';
    ensureBar();
    if (!el || !value) {
      if (!bar.hidden) bar.hidden = true;
      if (document.body.classList.contains('hp-has-live-total')) document.body.classList.remove('hp-has-live-total');
      return;
    }
    source = el;
    var sizeEl = firstVisible(SIZES);
    var sizeText = sizeEl ? (sizeEl.innerText || '').replace(/\s+/g, ' ').replace(/^(整套尺寸|组合尺寸)[：:\s]*/, '').trim() : '';
    var pendingCount = text.match(/\d+\s*项待核价/);
    if (pendingPrice && value !== '待核价') sizeText = (pendingCount ? pendingCount[0] : '部分待核价') + (sizeText ? ' · ' + sizeText : '');
    setText(label, name);
    setText(amount, value);
    setText(size, sizeText);
    if (size.hidden !== !sizeText) size.hidden = !sizeText;
    var hq = document.getElementById('hq-bar');
    var offset = hq && visible(hq) ? Math.round(window.innerHeight - hq.getBoundingClientRect().top) : 0;
    var bottom = (offset + 8) + 'px';
    if (bar.style.bottom !== bottom) bar.style.bottom = bottom;
    if (bar.hidden) bar.hidden = false;
    if (!document.body.classList.contains('hp-has-live-total')) document.body.classList.add('hp-has-live-total');
  }
  function schedule() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(update);
  }
  function start() {
    ensureBar();
    new MutationObserver(function (list) { for (var i = 0; i < list.length; i++) { if (!bar || !bar.contains(list[i].target) && list[i].target !== bar) { schedule(); return; } } }).observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['class', 'hidden', 'style'] });
    window.addEventListener('resize', schedule);
    window.addEventListener('scroll', schedule, {passive:true});
    if (window.visualViewport) { window.visualViewport.addEventListener('resize', schedule); window.visualViewport.addEventListener('scroll', schedule); }
    schedule();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();

/* v1407 compatibility updater. Delivered through the existing v1400 UI slot.
   Keeps the original APK, worker, cache namespace, cart and pricing unchanged. */
(function () {
  function installLegacyUpdater() {
  if (typeof currentAppVersion === "undefined" || Number(currentAppVersion.versionCode) >= 1407) return;
  window.HP_ONLINE_UPDATE_REVISION = 1407;
  window.refreshServiceWorkerAfterPatch = async function () {
    if (!("serviceWorker" in navigator)) throw new Error("当前环境不支持在线界面更新");
    if (navigator.serviceWorker.controller) return;
    let registration = await navigator.serviceWorker.getRegistration();
    if (!registration) registration = await navigator.serviceWorker.register("sw.js?v=1396");
    await new Promise((resolve, reject) => {
      const ready = () => {
        if (navigator.serviceWorker.controller) {
          clearTimeout(timer);
          navigator.serviceWorker.removeEventListener("controllerchange", ready);
          resolve();
        }
      };
      const timer = setTimeout(() => {
        navigator.serviceWorker.removeEventListener("controllerchange", ready);
        reject(new Error("更新服务尚未就绪，请关闭并重新打开APP后重试"));
      }, 15000);
      navigator.serviceWorker.addEventListener("controllerchange", ready);
      ready();
    });
  };
window.applyOnlinePatch = async function (patch, manifestUrl, onProgress) {
  if (!("caches" in window)) throw new Error("这个设备不支持界面更新");
  if (Number(patch.minAppVersionCode || 0) > Number(currentAppVersion.versionCode || 0))
    throw new Error("请先从官方下载页升级完整 APP");
  const files = Array.isArray(patch.files) ? patch.files : [];
  if (!files.length) throw new Error("更新文件列表为空");
  const manifestBaseUrl = new URL(manifestUrl, location.href);
  const prepared = [];
  const paths = new Set();
  for (let index = 0; index < files.length; index++) {
    const file = files[index];
    const localPath = String(file.path || file.target || "").trim();
    if (!localPath || localPath.startsWith("/") || localPath.includes(String.fromCharCode(92)) ||
        localPath.split("/").includes("..") || /^[a-z]+:/i.test(localPath) || paths.has(localPath))
      throw new Error("更新文件路径无效");
    const name = localPath.split("/").pop();
    if (["index.html", "sw.js", "app.js", "app-version.js", "styles.css", "3152-boot.js", "2628-arm-modules-v1370.js", "chair-catalog-additions-v1281.js"].includes(name))
      throw new Error("该更新包含当前版本不支持的文件");
    paths.add(localPath);
    const remoteUrl = new URL(file.url || file.source || localPath, manifestBaseUrl);
    if (!["https:", "http:"].includes(remoteUrl.protocol)) throw new Error("更新地址无效");
    onProgress?.({ phase: "下载", done: index + 1, total: files.length });
    remoteUrl.searchParams.set("t", String(Date.now()));
    const response = await fetchWithTimeout(remoteUrl.href, { cache: "no-store" }, 30000);
    if (!response.ok) throw new Error("下载失败 " + localPath);
    const body = await response.arrayBuffer();
    const digest = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", body)),
      value => value.toString(16).padStart(2, "0")).join("");
    if (!file.sha256 || digest !== String(file.sha256).toLowerCase() ||
        (Number.isFinite(file.size) && body.byteLength !== file.size))
      throw new Error("文件校验失败，请重试");
    prepared.push({ localPath, body, headers: new Headers({
      "content-type": file.contentType || response.headers.get("content-type") || guessPatchContentType(localPath)
    }) });
  }
  // A prepared worker is required before cache/version changes are committed.
  await refreshServiceWorkerAfterPatch();
  const cache = await caches.open(patchCacheName);
  const previous = [];
  try {
    for (let index = 0; index < prepared.length; index++) {
      const file = prepared[index];
      onProgress?.({ phase: "应用", done: index + 1, total: prepared.length });
      for (const url of getPatchCacheUrls(file.localPath)) {
        previous.push({ url, response: await cache.match(url) });
        await cache.put(url, new Response(file.body, { headers: file.headers }));
      }
    }
  } catch (error) {
    for (const entry of previous) {
      if (entry.response) await cache.put(entry.url, entry.response);
      else await cache.delete(entry.url);
    }
    throw error;
  }
  const version = String(patch.patchVersionCode || 0);
  localStorage.setItem(patchVersionStorageKey, version);
  localStorage.setItem(patchNameStorageKey, patch.patchVersionName || "");
  localStorage.setItem(patchSeenVersionStorageKey, version);
  sessionStorage.setItem(patchSeenVersionStorageKey, version);
  currentAppVersion.patchVersionCode = Number(version);
  currentAppVersion.patchVersionName = patch.patchVersionName || "";
};

  window.checkForOnlinePatch = async function (force = false) {
    if (!force) return;
    const manifestUrl = getPatchManifestUrl();
    if (!manifestUrl || !("caches" in window)) throw new Error("当前环境不支持在线界面更新");
    const url = new URL(manifestUrl, location.href);
    url.searchParams.set("t", String(Date.now()));
    const response = await fetchWithTimeout(url.href, {cache:"no-store"}, 25000);
    if (!response.ok) throw new Error("更新检查失败，请稍后重试");
    const patch = await response.json();
    if (!Array.isArray(patch.files) || !patch.files.length || !Number.isFinite(Number(patch.patchVersionCode)))
      throw new Error("更新资料无效");
    const installed = Math.max(Number(currentAppVersion.patchVersionCode || 0),
      Number(localStorage.getItem(patchVersionStorageKey) || 0));
    if (Number(patch.patchVersionCode) > installed) showPatchBanner(patch, manifestUrl);
  };
  window.showPatchBanner = function (patch, manifestUrl) {
    if (document.querySelector(".patch-banner")) return;
    const banner = document.createElement("aside");
    banner.className = "update-banner patch-banner";
    const title = document.createElement("strong");
    title.textContent = "有界面更新";
    const message = document.createElement("span");
    message.textContent = (patch.patchVersionName || "界面更新") + "，无需安装APK";
    const actions = document.createElement("div");
    actions.className = "update-banner-actions";
    const later = document.createElement("button");
    later.type = "button"; later.textContent = "稍后";
    later.onclick = () => banner.remove();
    const update = document.createElement("button");
    update.type = "button"; update.className = "primary-button"; update.textContent = "立即更新";
    update.onclick = async () => {
      update.disabled = true;
      try {
        await applyOnlinePatch(patch, manifestUrl, ({phase,done,total}) => {
          update.textContent = phase + " " + done + "/" + total;
        });
        update.textContent = "更新完成，刷新中";
        const target = new URL("index.html", location.href);
        target.searchParams.set("fresh", String(Date.now()));
        setTimeout(() => location.replace(target.href), 250);
      } catch (error) {
        update.disabled = false; update.textContent = "重试";
        message.textContent = "更新未完成：" + (error.message || "请检查网络后重试");
      }
    };
    actions.append(later, update); banner.append(title, message, actions);
    document.body.append(banner);
  };
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", installLegacyUpdater, {once:true});
  else installLegacyUpdater();
})();

;/* Approved 2628 buyer-show recovery, 2026-10-17. */
window.ZOLANO_2628_GALLERY_BATCH={"revision":"2628-gallery-review-20261017","modelIds":["2628","26282"],"source":"kdocs 买家秀合集 / 2868等425个文件.zip","sourceKind":"buyer-show-original","photos":[{"src":"assets/gallery/buyer-show-20261001/26282/1d839b5d0c8e90084c61.jpg","label":"2628 / 26282 买家秀 1","kind":"buyer-show-original","sha256":"b0e45a0e9a5ce221c49f03ea46c11784fc008919faa5aea4bd2f0afb51003cf0","bytes":184231},{"src":"assets/gallery/buyer-show-20261001/26282/315f2aa0b44c9d3703dd.jpg","label":"2628 / 26282 买家秀 2","kind":"buyer-show-original","sha256":"7bf460d8b41747b58b2ffe26f1ea9ec03df1d67824f7557313e4a0bd258f0eb4","bytes":231108},{"src":"assets/gallery/buyer-show-20261001/26282/9c46f47d8477c345b04b.jpg","label":"2628 / 26282 买家秀 3","kind":"buyer-show-original","sha256":"7413510d024ab838da3f23830b278b8d5aa4368d95401062f7a1d1b193576342","bytes":160640},{"src":"assets/gallery/buyer-show-20261001/26282/3403dc4ee0cd3da94d7e.jpg","label":"2628 / 26282 买家秀 4","kind":"buyer-show-original","sha256":"0841b5b41f5562d0eea7e5ac9d698c9363fd239984d58f1ed5d5b5e56ae61dfe","bytes":83881},{"src":"assets/gallery/buyer-show-20261001/26282/603651926b350ce41ed4.jpg","label":"2628 / 26282 买家秀 5","kind":"buyer-show-original","sha256":"04fd19a7dc98fd378ecc26785c3d55d2feb2f0b82dde8f5d6f1976c541c9041d","bytes":77697},{"src":"assets/gallery/buyer-show-20261001/26282/e7c6fcbb178796637260.jpg","label":"2628 / 26282 买家秀 6","kind":"buyer-show-original","sha256":"9fc4fcbbc6bbc35c5a7c050165802c4e544cc0c375b2a9719912481197ebd285","bytes":159638},{"src":"assets/gallery/buyer-show-20261001/26282/84bc89372acb2dccbd95.jpg","label":"2628 / 26282 买家秀 7","kind":"buyer-show-original","sha256":"4e663f7ed7e29f4c2a637f03c8eb1fb719326913e0043b95b00e99711a988a1b","bytes":77481},{"src":"assets/gallery/buyer-show-20261001/26282/1310e6d8f32d97d5c002.jpg","label":"2628 / 26282 买家秀 8","kind":"buyer-show-original","sha256":"bbbe57a5e4a514f6751fc332d41390ba4fd1a4d11799706483d430b2d3c6153e","bytes":130097},{"src":"assets/gallery/buyer-show-20261001/26282/d23287f2dbaa94b2c685.jpg","label":"2628 / 26282 买家秀 9","kind":"buyer-show-original","sha256":"99551a44454d4485ffd601272e099a7d0908ea73b34cf162fb050f4bde0c1377","bytes":128115},{"src":"assets/gallery/buyer-show-20261001/26282/b1b3210bba74e72cb186.jpg","label":"2628 / 26282 买家秀 10","kind":"buyer-show-original","sha256":"7523f3162aa2050cdafc1ce250b1d5ef19ce25f3fdd17f31ed7c218f0880a5c0","bytes":217569},{"src":"assets/gallery/buyer-show-20261001/26282/a430a9af0b0cbbc6cb02.jpg","label":"2628 / 26282 买家秀 11","kind":"buyer-show-original","sha256":"0d13bbeac352a645447d03d5466659c5bcfec9f23e51032d73f56ca845badd15","bytes":87308},{"src":"assets/gallery/buyer-show-20261001/26282/55a8949a07c18bb4508f.jpg","label":"2628 / 26282 买家秀 12","kind":"buyer-show-original","sha256":"667c47328ed3cc16877e4a65eaba203ee458c229ab15ad4f698473b3e2e71c38","bytes":124392},{"src":"assets/gallery/buyer-show-20261001/26282/b299b8514a6891182b54.jpg","label":"2628 / 26282 买家秀 13","kind":"buyer-show-original","sha256":"e44c260b3a07de65ed653cf8d4b93c918660308409e8e0a8228fc9c87abc9261","bytes":166655},{"src":"assets/gallery/buyer-show-20261001/26282/e5c6797ac99c23c380a2.jpg","label":"2628 / 26282 买家秀 14","kind":"buyer-show-original","sha256":"0337b547352839981798092bdc9396435d6096feeb68944e810a13390e061f81","bytes":150850},{"src":"assets/gallery/buyer-show-20261001/26282/7abbb34c0edc003991aa.jpg","label":"2628 / 26282 买家秀 15","kind":"buyer-show-original","sha256":"b1c4ce28303e8b01a796ad5188ea6c3afa6b8236b65b4337a34644e6924f32b4","bytes":82625},{"src":"assets/gallery/buyer-show-20261001/26282/a410f3d8bc49f59e1571.jpg","label":"2628 / 26282 买家秀 16","kind":"buyer-show-original","sha256":"9282cbf81477a0ec466fd2ab35c72a6135d814a4463bc3e3ab2699b4bf8d4813","bytes":248980},{"src":"assets/gallery/buyer-show-20261001/26282/e8f696105fde5a2183bd.jpg","label":"2628 / 26282 买家秀 17","kind":"buyer-show-original","sha256":"6beaaf2add4ffe4a9e119638c8849e79e4e90cff4fc19453f59912ddf7c0a76e","bytes":93483},{"src":"assets/gallery/buyer-show-20261001/26282/b4df0603c1c9bd207d85.jpg","label":"2628 / 26282 买家秀 18","kind":"buyer-show-original","sha256":"f591cdfa0c6ce2f37354c64856f6b131a57448bc9aa25602273ec537341d2a6a","bytes":250728},{"src":"assets/gallery/buyer-show-20261001/26282/fbff02f3794f6acab76c.jpg","label":"2628 / 26282 买家秀 19","kind":"buyer-show-original","sha256":"0d712fcc08f2ccafb05d4eb82ef17221e47412450f37f9d9b520925a146fdc4c","bytes":69716},{"src":"assets/gallery/buyer-show-20261001/26282/6d323fc28d3478aad610.jpg","label":"2628 / 26282 买家秀 20","kind":"buyer-show-original","sha256":"97b3a78943714b8bdcc0883fd460a2bced6cf973c3c0d90c030e1cb386d397c1","bytes":247749},{"src":"assets/gallery/buyer-show-20261001/26282/6bc1499020ec3c3403dd.jpg","label":"2628 / 26282 买家秀 21","kind":"buyer-show-original","sha256":"bd41adaf9ca787dc0be526683ae85c555df2729698d6525ff0e72b411b113814","bytes":141763},{"src":"assets/gallery/buyer-show-20261001/26282/51eea16ad64dfa357608.jpg","label":"2628 / 26282 买家秀 22","kind":"buyer-show-original","sha256":"0558ec9c6a01a6696bfeaefc1c5d1e0127e714f28a78e4db6c7917ce372e6beb","bytes":232036},{"src":"assets/gallery/buyer-show-20261001/26282/065537d8ae27d8d0b7d5.jpg","label":"2628 / 26282 买家秀 23","kind":"buyer-show-original","sha256":"2c8203d7bbd07509f0a17ae36e141a65e82e4f506109c6c31c605ad3d30ce20f","bytes":162913},{"src":"assets/gallery/buyer-show-20261001/26282/8c23e3cb4c0d19993420.jpg","label":"2628 / 26282 买家秀 24","kind":"buyer-show-original","sha256":"2e17ed9d7ee203be829acc68917c0d72a4280b0c5333294b2417e9606e931c6a","bytes":171509}],"scope":"Whole-sofa customer photographs only. No independent-module photo or dimension claim."};

(function(){function installGallery2628AfterLoad(){
(function install2628GalleryBatch(root) {
  'use strict';
  const data = root.ZOLANO_2628_GALLERY_BATCH;
  if (!data || data.revision !== '2628-gallery-review-20261017') return;
  const exactModel = series => String(series || '').match(/(?:^|[^0-9])([0-9]{3,5})(?=[^0-9]|$)/)?.[1] || '';
  const matches = series => ['2628', '26282'].includes(exactModel(series));
  const photos = [...new Set(data.photos.filter(row => row.kind === 'buyer-show-original'
    && /^assets\/gallery\/buyer-show-20261001\/26282\/[a-f0-9]+\.jpg$/.test(row.src)).map(row => row.src))];
  if (photos.length !== 24) return;
  const oldBuyerPhotos = root.HP_BUYER_SHOW_PHOTOS;
  if (typeof oldBuyerPhotos === 'function' && !oldBuyerPhotos.__gallery2628Batch) {
    const buyerPhotos = series => matches(series) ? [...new Set([...(oldBuyerPhotos(series) || []), ...photos])] : oldBuyerPhotos(series);
    buyerPhotos.__gallery2628Batch = true;
    root.HP_BUYER_SHOW_PHOTOS = buyerPhotos;
  }
  const dealer = root.DEALER_GALLERY;
  if (dealer && typeof dealer.photos === 'function' && !dealer.photos.__gallery2628Batch) {
    const oldDealerPhotos = dealer.photos;
    const dealerPhotos = series => matches(series) ? dealer.unique([...(oldDealerPhotos(series) || []), ...photos]) : oldDealerPhotos(series);
    dealerPhotos.__gallery2628Batch = true;
    dealer.photos = dealerPhotos;
    dealer.models = [...new Set([...dealer.models, '2628'])];
  }
  const gallery = root.HP_ORIGINAL_SERIES_GALLERY;
  if (gallery && typeof gallery.render === 'function' && !gallery.render.__gallery2628Batch) {
    const oldRender = gallery.render;
    const render = function(series, item) {
      const html = oldRender.call(this, series, item);
      if (!matches(series) || !html || html.includes('data-2628-photo-source')) return html;
      return html.replace(/(<section\b[^>]*>)/, '$1<p data-2628-photo-source style="margin:10px 12px;color:#665546;font-size:13px;line-height:1.5">2628 / 26282 买家秀 · 24 张实拍参考。照片中的颜色、扶手与组合以实拍为准；单件尺寸请查看原厂资料。</p>');
    };
    // Preserve existing renderer decorators' idempotence flags.
    Object.assign(render, oldRender);
    render.__gallery2628Batch = true;
    gallery.render = render;
  }
  root.HP_2628_GALLERY_BATCH = Object.freeze({revision:data.revision,photoCount:photos.length,sourceKind:'buyer-show-original'});
})(typeof window !== 'undefined' ? window : globalThis);

}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",installGallery2628AfterLoad,{once:true});else installGallery2628AfterLoad();})();

/* Store wood prices, revision 1410. Public retail values only. */
(function(root){
  'use strict';
  if(root.HP_WOOD_PRICING_REVISION===1410)return;
  var maps={"before":{"tables":{"kjt-6748":{"135-80":875600,"150-90":1007600},"kjt-6738":{"135-80":941600,"150-90":1117600},"kjt-254":{"135-80":743600,"150-90":875600},"kjt-020":{"135-80":633600,"150-90":765600},"kjt-13":{"135-80":633600,"150-90":765600},"kjt-261":{"135-80":655600,"150-90":787600},"kjt-28":{"135-80":633600,"150-90":765600},"kjt-68":{"135-80":572000,"150-90":682000},"kjt-18":{"135-80":407000,"150-90":517000},"kjt-08":{"120":505780,"135":593780},"kjt-58":{"160x90":561000,"180x90":627000},"kjt-73":{"160x90":589600,"180x90":655600},"kjt-8910":{"160x85":413600,"180x90":523600},"kjt-707":{"160x90":413600,"180x90":479600},"kjt-336":{"160x80":241780,"180x90":285780},"kjt-688":{"pending-reference":null}},"chairs":{"c943":94600,"c50":101200,"c2602":79200,"c335":72600,"c29":48400,"c46":61600,"c6898":83600,"c67-c72":105600,"c2601":66000,"c42":57200,"c2331":58300,"c6901":70400,"c51":46200,"c33":64900,"c296":64900,"c52":74800,"c60":79200,"c70":99000,"c316":null},"sideboards":{"sideboard-row24":391600,"sideboard-2426":369600}},"after":{"tables":{"kjt-6748":{"135-80":1114400,"150-90":1282400},"kjt-6738":{"135-80":1198400,"150-90":1422400},"kjt-254":{"135-80":946400,"150-90":1114400},"kjt-020":{"135-80":806400,"150-90":974400},"kjt-13":{"135-80":806400,"150-90":974400},"kjt-261":{"135-80":834400,"150-90":1002400},"kjt-28":{"135-80":806400,"150-90":974400},"kjt-68":{"135-80":728000,"150-90":868000},"kjt-18":{"135-80":518000,"150-90":658000},"kjt-08":{"120":643720,"135":755720},"kjt-58":{"160x90":714000,"180x90":798000},"kjt-73":{"160x90":750400,"180x90":834400},"kjt-8910":{"160x85":526400,"180x90":666400},"kjt-707":{"160x90":526400,"180x90":610400},"kjt-336":{"160x80":307720,"180x90":363720},"kjt-688":{"pending-reference":null}},"chairs":{"c943":120400,"c50":128800,"c2602":100800,"c335":92400,"c29":61600,"c46":78400,"c6898":106400,"c67-c72":134400,"c2601":84000,"c42":72800,"c2331":74200,"c6901":89600,"c51":58800,"c33":82600,"c296":82600,"c52":95200,"c60":100800,"c70":126000,"c316":null},"sideboards":{"sideboard-row24":498400,"sideboard-2426":470400}}};
  function total(data,state){
    if(!state||typeof state!=='object'||!Number.isInteger(state.chairQty)||state.chairQty<1)return null;
    var table=data.tables[state.tableId],chair=data.chairs[state.chairId];
    var variant=table&&table[state.variantId];
    var side=state.sideboardId?data.sideboards[state.sideboardId]:0;
    if(!Number.isFinite(variant)||!Number.isFinite(chair)||!Number.isFinite(side))return null;
    return (variant+chair*state.chairQty+side)/100;
  }
  function wrap(core){
    if(!core||core.woodPricingRevision===1410||typeof core.snapshot!=='function')return core;
    var snapshot=core.snapshot;
    core.snapshot=function(value){
      var row=snapshot(value),key;
      try{key=JSON.parse(row.key);}catch(e){return row;}
      if(!Array.isArray(key)||key.length!==2||key[0]!=='wood'||row.priceMode==='manual')return row;
      var before=total(maps.before,key[1]),after=total(maps.after,key[1]);
      if(before===null||after===null||row.basePrice!==before)return row;
      // Preserve staff-entered prices even in malformed legacy snapshots.
      var expected=core.discountPrice(Object.assign({},row,{basePrice:before}),row.discountRate).price;
      if(row.price!==expected)return row;
      return core.discountPrice(Object.assign({},row,{basePrice:after}),row.discountRate);
    };
    core.woodPricingRevision=1410;
    return core;
  }
  // The existing UI script loads before the quotation core in both supported bases.
  var current=wrap(root.HP_QUOTATION_CORE);
  var descriptor=Object.getOwnPropertyDescriptor(root,'HP_QUOTATION_CORE');
  if(!descriptor||descriptor.configurable){
    Object.defineProperty(root,'HP_QUOTATION_CORE',{configurable:true,enumerable:true,
      get:function(){return current;},set:function(core){current=wrap(core);}});
  }
  root.HP_WOOD_PRICING_REVISION=1410;
})(window);
