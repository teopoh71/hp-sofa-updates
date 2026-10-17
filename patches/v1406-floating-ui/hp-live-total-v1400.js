/* v1400: 详情页底部浮动合计。只读取页面上已经算好的合计文字，不参与计价。
   位置贴在"加入购物车 / 报价购物车"横条上方；滚动时一直可见，点一下跳到合计区。 */
(function () {
  window.HP_LIVE_TOTAL_REVISION = 1406;
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
    // Existing worker already reads updated cache entries first. Re-registering and
    // immediately forcing update can stall the legacy WebView at "安装 2/2".
    if (typeof window.refreshServiceWorkerAfterPatch === 'function') {
      window.refreshServiceWorkerAfterPatch = async function () {
        if (!('serviceWorker' in navigator)) throw new Error('当前环境不支持界面更新，请使用手机 APP');
        var registration = await navigator.serviceWorker.getRegistration();
        if (!registration) registration = await navigator.serviceWorker.register('sw.js?v=1396');
        if (navigator.serviceWorker.controller) return;
        await new Promise(function (resolve, reject) {
          var timer = setTimeout(function () { cleanup(); reject(new Error('界面已下载，请关闭并重新打开 APP')); }, 15000);
          function cleanup() { clearTimeout(timer); navigator.serviceWorker.removeEventListener('controllerchange', ready); }
          function ready() { if (navigator.serviceWorker.controller) { cleanup(); resolve(); } }
          navigator.serviceWorker.addEventListener('controllerchange', ready);
          ready();
        });
      };
    }
    ensureBar();
    new MutationObserver(function (list) { for (var i = 0; i < list.length; i++) { if (!bar || !bar.contains(list[i].target) && list[i].target !== bar) { schedule(); return; } } }).observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['class', 'hidden', 'style'] });
    window.addEventListener('resize', schedule);
    window.addEventListener('scroll', schedule, {passive:true});
    if (window.visualViewport) { window.visualViewport.addEventListener('resize', schedule); window.visualViewport.addEventListener('scroll', schedule); }
    schedule();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
