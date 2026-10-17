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
