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

/* Local store wood retail revision. No original costs are included. */
(function(root){
 'use strict';
 const revision='wood-retail-23-20261018';
 if(root.HP_WOOD_PRICE_23_REVISION===revision)return;
 const maps={"legacy22":{"tables":{"kjt-6748":{"135-80":875600,"150-90":1007600},"kjt-6738":{"135-80":941600,"150-90":1117600},"kjt-254":{"135-80":743600,"150-90":875600},"kjt-020":{"135-80":633600,"150-90":765600},"kjt-13":{"135-80":633600,"150-90":765600},"kjt-261":{"135-80":655600,"150-90":787600},"kjt-28":{"135-80":633600,"150-90":765600},"kjt-68":{"135-80":572000,"150-90":682000},"kjt-18":{"135-80":407000,"150-90":517000},"kjt-08":{"120":505780,"135":593780},"kjt-58":{"160x90":561000,"180x90":627000},"kjt-73":{"160x90":589600,"180x90":655600},"kjt-8910":{"160x85":413600,"180x90":523600},"kjt-707":{"160x90":413600,"180x90":479600},"kjt-336":{"160x80":241780,"180x90":285780},"kjt-688":{}},"chairs":{"c943":94600,"c50":101200,"c2602":79200,"c335":72600,"c29":48400,"c46":61600,"c6898":83600,"c67-c72":105600,"c2601":66000,"c42":57200,"c2331":58300,"c6901":70400,"c51":46200,"c33":64900,"c296":64900,"c52":74800,"c60":79200,"c70":99000},"sideboards":{"sideboard-row24":391600,"sideboard-2426":369600}},"public28":{"tables":{"kjt-6748":{"135-80":1114400,"150-90":1282400},"kjt-6738":{"135-80":1198400,"150-90":1422400},"kjt-254":{"135-80":946400,"150-90":1114400},"kjt-020":{"135-80":806400,"150-90":974400},"kjt-13":{"135-80":806400,"150-90":974400},"kjt-261":{"135-80":834400,"150-90":1002400},"kjt-28":{"135-80":806400,"150-90":974400},"kjt-68":{"135-80":728000,"150-90":868000},"kjt-18":{"135-80":518000,"150-90":658000},"kjt-08":{"120":643720,"135":755720},"kjt-58":{"160x90":714000,"180x90":798000},"kjt-73":{"160x90":750400,"180x90":834400},"kjt-8910":{"160x85":526400,"180x90":666400},"kjt-707":{"160x90":526400,"180x90":610400},"kjt-336":{"160x80":307720,"180x90":363720},"kjt-688":{"180x90":974400,"200x100":1058400}},"chairs":{"c943":120400,"c50":128800,"c2602":100800,"c335":92400,"c29":61600,"c46":78400,"c6898":106400,"c67-c72":134400,"c2601":84000,"c42":72800,"c2331":74200,"c6901":89600,"c51":58800,"c33":82600,"c296":82600,"c52":95200,"c60":100800,"c70":126000},"sideboards":{"sideboard-row24":498400,"sideboard-2426":470400}},"after23":{"tables":{"kjt-6748":{"135-80":915400,"150-90":1053400},"kjt-6738":{"135-80":984400,"150-90":1168400},"kjt-254":{"135-80":777400,"150-90":915400},"kjt-020":{"135-80":662400,"150-90":800400},"kjt-13":{"135-80":662400,"150-90":800400},"kjt-261":{"135-80":685400,"150-90":823400},"kjt-28":{"135-80":662400,"150-90":800400},"kjt-68":{"135-80":598000,"150-90":713000},"kjt-18":{"135-80":425500,"150-90":540500},"kjt-08":{"120":528770,"135":620770},"kjt-58":{"160x90":586500,"180x90":655500},"kjt-73":{"160x90":616400,"180x90":685400},"kjt-8910":{"160x85":432400,"180x90":547400},"kjt-707":{"160x90":432400,"180x90":501400},"kjt-336":{"160x80":252770,"180x90":298770},"kjt-688":{"180x90":800400,"200x100":869400}},"chairs":{"c943":98900,"c50":105800,"c2602":82800,"c335":75900,"c29":50600,"c46":64400,"c6898":87400,"c67-c72":110400,"c2601":69000,"c42":59800,"c2331":60950,"c6901":73600,"c51":48300,"c33":67850,"c296":67850,"c52":78200,"c60":82800,"c70":103500},"sideboards":{"sideboard-row24":409400,"sideboard-2426":386400}}};
 function total(data,s){
  if(!s||typeof s!=='object'||!Number.isInteger(s.chairQty)||s.chairQty<1)return null;
  const table=data.tables[s.tableId],v=table&&table[s.variantId],c=data.chairs[s.chairId],b=s.sideboardId?data.sideboards[s.sideboardId]:0;
  if(!Number.isFinite(v)||!Number.isFinite(c)||!Number.isFinite(b))return null;
  return (v+c*s.chairQty+b)/100;
 }
 function wrap(core){
  if(!core||core.woodPrice23Revision===revision||typeof core.snapshot!=='function')return core;
  const original=core.snapshot;
  core.snapshot=function(value){
   const row=original(value);let key;try{key=JSON.parse(row.key);}catch{return row;}
   if(!Array.isArray(key)||key.length!==2||key[0]!=='wood'||row.priceMode==='manual')return row;
   const target=total(maps.after23,key[1]);if(target===null||row.basePrice===target)return row;
   const allowed=[total(maps.public28,key[1]),total(maps.legacy22,key[1])].filter(x=>x!==null);
   if(!allowed.includes(row.basePrice))return row;
   const expected=core.discountPrice({...row},row.discountRate).price;if(row.price!==expected)return row;
   return core.discountPrice({...row,basePrice:target},row.discountRate);
  };
  core.woodPrice23Revision=revision;return core;
 }
 let current=wrap(root.HP_QUOTATION_CORE);
 const descriptor=Object.getOwnPropertyDescriptor(root,'HP_QUOTATION_CORE');
 if(!descriptor||descriptor.configurable)Object.defineProperty(root,'HP_QUOTATION_CORE',{configurable:true,enumerable:true,get:()=>current,set:value=>{current=wrap(value);}});
 root.HP_WOOD_PRICE_23_REVISION=revision;
})(window);

/* Reuse previously accepted3752 height candidate. */
/* Local candidate: verified closed heights; existing media and prices remain unchanged. */
(function(root){
 'use strict';
 function apply(){
  if(root.HP_3752_HEIGHT_EVIDENCE?.applied)return;
  const model=root.ZOLANO_FIRST10_REGISTRY?.['3752'];
  const definitions=[['ZL3752-10',930,'1R'],['ZL3752-20',1510,'2R'],['ZL3752-30',2030,'3R']];
  const modules=definitions.map(([id])=>model?.modules?.find(m=>m.id===id));
  if(modules.some((m,i)=>!m||m.width!==definitions[i][1]||m.depth!==940||![0,1060].includes(m.height))){root.HP_3752_HEIGHT_EVIDENCE={applied:false,reason:'source-shape-changed'};return;}
  modules.forEach((m,i)=>{
   m.height=1060;
   m.closedHeightEvidence3752={manufacturerConfiguration:definitions[i][2],closedHeightMm:1060,
    sourceImage:'assets/reference/zolano-full-original-v1278/ZL3752-original.jpg',
    sourceSha256:'e26970526cb64a564d9050fbbce55838b4b75701aef1955e4260d5350198a24e',
    corroboratingOriginal:'D:/BaiduNetdiskDownload/bdpan/zolano photo/Recliner/ZL 3752.jpg',
    corroboratingSha256:'f8d3b12e0a5bbd809b75cec81f31ab3def5986059048ea55e912837156963572',
    scope:'Closed overall height only. No image, independent-photo, open-height, TABLE or price change.'};
  });
  root.HP_3752_HEIGHT_EVIDENCE={applied:true,revision:'3752-closed-height-20261018',verifiedHeights:3,photosAdded:0};
 }
 if(root.document?.readyState==='loading')root.document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
})(typeof window!=='undefined'?window:globalThis);

/* Local candidate: do not infer chaise depth/height from the ordinary seat side view. */
(function(root){
 'use strict';
 function apply(){
  if(root.HP_3705_CHASE_EVIDENCE?.applied)return;
  const m=root.ZOLANO_FIRST10_REGISTRY?.['3705']?.modules?.find(x=>x.id==='ZL3705-1ERT');
  if(!m||m.width!==860||m.depth!==1120||m.height!==800){root.HP_3705_CHASE_EVIDENCE={applied:false,reason:'source-shape-changed'};return;}
  m.previousUnverifiedDimensions3705={depth:m.depth,height:m.height,openDepth:m.openDepth,dimensionStatus:m.dimensionStatus,dimensionText:m.dimensionText};
  m.depth=0;m.openDepth=0;m.height=0;m.label='1ER/T（尺寸待核）';
  m.dimensionStatus='pending';
  m.dimensionText='宽 860 mm；贵妃独立深度、高度待原厂确认';
  m.dimensionSource='assets/generated/zolano/ZL3705.jpg: 1ER/T top view labels only L860; D1120/H800 belong to the ordinary seat side view.';
  m.compositionDisabled=true;m.compositionBlockedReason='贵妃独立深度、高度待原厂确认';
  m.chaiseDimensionEvidence3705={sourceImage:'assets/generated/zolano/ZL3705.jpg',verifiedWidthMm:860,missing:['independent chaise depth','independent chaise height'],review:'Original manufacturer board visually inspected 2026-10-18; no length derived from image proportions.'};
  root.HP_3705_CHASE_EVIDENCE={applied:true,revision:'3705-chaise-evidence-20261018',moduleId:m.id};
 }
 if(root.document?.readyState==='loading')root.document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
})(typeof window!=='undefined'?window:globalThis);
