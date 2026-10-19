/* Handphone wood furniture adapter. Existing product pixels and reviewed rooms only. */
(function(root){
'use strict';
var zoomDialog;
function current(){return root.HP_WOOD_CURRENT_MODEL;}
function esc(s){return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function parentCap(){try{return root.parent && root.parent!==root ? root.parent.Capacitor : root.Capacitor;}catch(e){return null;}}
function nativePhoto(){var cap=parentCap();if(!cap||cap.getPlatform?.()!=='android')return null;return cap.Plugins?.PhotoActions || (cap.isPluginAvailable?.('PhotoActions')&&cap.registerPlugin?cap.registerPlugin('PhotoActions'):null);}
function handleNative(method,dataUrl,requestId){var p=nativePhoto();if(!p){root.__zwfNativeActionResult(requestId,false,'当前设备暂不支持此操作');return;}var save=method==='saveSceneImage';Promise.resolve(p[save?'saveImage':'shareImage']({base64:String(dataUrl).split(',')[1],name:'ZOLANO-wood-'+Date.now()+'.jpg',title:'ZOLANO 木家具'})).then(function(){root.__zwfNativeActionResult(requestId,true,save?'图片已保存':'已打开系统分享');},function(){root.__zwfNativeActionResult(requestId,false,'操作未完成，请重试');});}
if(nativePhoto())root.ZolanoCustomerActions={saveSceneImage:function(d,r){handleNative('saveSceneImage',d,r);},shareSceneImage:function(d,r){handleNative('shareSceneImage',d,r);}};
function quoteSnapshot(){
var m=current();if(!m?.table||!m.variant||!m.chair)throw Error('请先选择木家具');
var preview=document.querySelector('.zwf-scene');var source=preview?.getAttribute('src')||m.table.image;
var kind=document.querySelector('[data-zwf-preview-kind]')?.dataset.zwfPreviewKind;
var parts=[m.table.model+' '+m.variant.label,m.chair.model+' × '+m.state.chairQty].concat(m.sideboard?[m.sideboard.model]:[]);
return {key:JSON.stringify(['wood',m.state]),title:'木家具 · '+m.table.model,configuration:parts.join(' + '),parts:parts,material:m.table.material||'',dimensions:m.variant.label,price:Number.isFinite(m.totalCents)?m.totalCents/100:null,basePrice:Number.isFinite(m.totalCents)?m.totalCents/100:null,quantity:1,priceMode:'original',discountRate:1,origin:'',image:new URL(source,location.href).href,imageNote:!preview?'餐桌参考图 · 配置以文字为准':kind==='room'?'AI 室内搭配示意 · 以实物为准':kind==='reference'?'单品原始参考照片 · 配置以文字为准':'产品照片搭配示意 · 比例仅供参考'};
}
function showPhoto(source,label){
if(!zoomDialog){zoomDialog=document.createElement('dialog');zoomDialog.className='hp-wood-photo-dialog';zoomDialog.setAttribute('aria-label','单品照片大图');zoomDialog.innerHTML='<header><strong></strong><button type="button" data-zoom-minus aria-label="缩小单品照片">−</button><button type="button" data-zoom-plus aria-label="放大单品照片">+</button><button type="button" data-close-photo>关闭</button></header><figure><img alt=""></figure>';document.body.appendChild(zoomDialog);var scale=1;var adjust=function(n){scale=Math.max(1,Math.min(3,scale+n));zoomDialog.querySelector('img').style.width=(scale*100)+'%';zoomDialog.querySelector('img').style.maxWidth='none';};zoomDialog.querySelector('[data-zoom-minus]').onclick=function(){adjust(-.25);};zoomDialog.querySelector('[data-zoom-plus]').onclick=function(){adjust(.25);};zoomDialog.querySelector('[data-close-photo]').onclick=function(){zoomDialog.close();};zoomDialog.addEventListener('close',function(){scale=1;zoomDialog.querySelector('img').style.width='100%';});}
zoomDialog.querySelector('strong').textContent=label;zoomDialog.querySelector('img').src=source;zoomDialog.querySelector('img').alt=label;zoomDialog.showModal();
}
function mountPhotoTools(){
var m=current(),app=document.getElementById('zwfApp');if(!m||!app||app.querySelector('.zwf-wood-photo-tools'))return;
var section=document.createElement('section');section.className='zwf-wood-photo-tools';section.setAttribute('aria-label','单品照片查看');section.innerHTML='<h2>查看单品大图</h2>';
[[m.table,'餐桌'],[m.chair,'餐椅'],[m.sideboard,'餐边柜']].forEach(function(pair){var item=pair[0];if(!item)return;[['image','正面'],['imageBack','背面'],['referenceImage','原图']].forEach(function(v){if(!item[v[0]])return;var b=document.createElement('button');b.type='button';b.textContent=item.model+' · '+v[1];b.dataset.woodPhoto=item.id+':'+v[0];b.onclick=function(){showPhoto(item[v[0]],item.model+' · '+v[1]);};section.appendChild(b);});});
var target=app.querySelector('.zwf-products');if(target)target.after(section);
}
root.HP_WOOD_UI={getQuoteSnapshot:quoteSnapshot,getState:function(){return current()?.state;},closePhoto:function(){var scene=document.querySelector('[data-zwf-lightbox]');if(scene&&!scene.hidden){var close=scene.querySelector('[data-zwf-close-scene]');if(close)close.click();else scene.hidden=true;return true;}if(zoomDialog?.open){zoomDialog.close();return true;}return false;}};
new MutationObserver(mountPhotoTools).observe(document.getElementById('zwfApp'),{childList:true,subtree:true});
mountPhotoTools();
})(window);
/* KJT-688 confirmed specifications; preserve reference-photo provenance. */
(function(root){
 'use strict';
 function updateCaption(){
  var m=root.HP_WOOD_CURRENT_MODEL;
  if(!m||m.table.id!=='kjt-688'||m.table.sourceStatus!=='user-confirmed-spec-price')return;
  var caption=document.querySelector('.zwf-caption');if(!caption)return;
  var walker=document.createTreeWalker(caption,NodeFilter.SHOW_TEXT),node;
  var prior='KJT-688 / C316 来源：供应商图册第54页；规格与零售价待确认。';
  var current='KJT-688原产品照片来源：供应商图册第54页；桌面材质以天然冰花实物为准。'+(m.chair.id==='c316'?'C316椅价格待确认。':'');
  while((node=walker.nextNode()))if(node.nodeValue.indexOf(prior)>=0)node.nodeValue=node.nodeValue.replace(prior,current);
 }
 new MutationObserver(updateCaption).observe(document.getElementById('zwfApp'),{childList:true,subtree:true});
 updateCaption();root.HP_WOOD_KJT688_REVISION=1411;
})(window);

/* v1414: fifteen accepted scenes, exact configuration keys and AI disclosure. */
(function(root){
"use strict";
const revision="v1414-scenes15";if(root.HP_WOOD_RELEASE15_REVISION===revision)return;
const additions=[{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"150-90","chairId":"c60","chairQty":4,"sideboardId":"","image":"scene-images/v1414/kjt-6748-150-90-c60-4.png","stoneRepair":"v1414-scenes15"},{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"150-90","chairId":"c60","chairQty":6,"sideboardId":"","image":"scene-images/v1414/kjt-6748-150-90-c60-6.png","stoneRepair":"v1414-scenes15"},{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"150-90","chairId":"c60","chairQty":8,"sideboardId":"","image":"scene-images/v1414/kjt-6748-150-90-c60-8.png","stoneRepair":"v1414-scenes15"},{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"135-80","chairId":"c60","chairQty":6,"sideboardId":"","image":"scene-images/v1414/kjt-6748-135-80-c60-6.png","stoneRepair":"v1414-scenes15"},{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"135-80","chairId":"c60","chairQty":8,"sideboardId":"","image":"scene-images/v1414/kjt-6748-135-80-c60-8.png","stoneRepair":"v1414-scenes15"},{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"150-90","chairId":"c52","chairQty":4,"sideboardId":"","image":"scene-images/v1414/kjt-6748-150-90-c52-4.png","stoneRepair":"v1414-scenes15"},{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"150-90","chairId":"c52","chairQty":6,"sideboardId":"","image":"scene-images/v1414/kjt-6748-150-90-c52-6.png","stoneRepair":"v1414-scenes15"},{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"150-90","chairId":"c52","chairQty":8,"sideboardId":"","image":"scene-images/v1414/kjt-6748-150-90-c52-8.png","stoneRepair":"v1414-scenes15"},{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"135-80","chairId":"c52","chairQty":6,"sideboardId":"","image":"scene-images/v1414/kjt-6748-135-80-c52-6.png","stoneRepair":"v1414-scenes15"},{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"135-80","chairId":"c52","chairQty":8,"sideboardId":"","image":"scene-images/v1414/kjt-6748-135-80-c52-8.png","stoneRepair":"v1414-scenes15"},{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"150-90","chairId":"c70","chairQty":4,"sideboardId":"","image":"scene-images/v1414/kjt-6748-150-90-c70-4.png","stoneRepair":"v1414-scenes15"},{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"150-90","chairId":"c70","chairQty":6,"sideboardId":"","image":"scene-images/v1414/kjt-6748-150-90-c70-6.png","stoneRepair":"v1414-scenes15"},{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"150-90","chairId":"c70","chairQty":8,"sideboardId":"","image":"scene-images/v1414/kjt-6748-150-90-c70-8.png","stoneRepair":"v1414-scenes15"},{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"135-80","chairId":"c70","chairQty":6,"sideboardId":"","image":"scene-images/v1414/kjt-6748-135-80-c70-6.png","stoneRepair":"v1414-scenes15"},{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"135-80","chairId":"c70","chairQty":8,"sideboardId":"","image":"scene-images/v1414/kjt-6748-135-80-c70-8.png","stoneRepair":"v1414-scenes15"}],scenes=root.WOOD_FURNITURE_SCENES;if(!Array.isArray(scenes))return;
const key=s=>[s.tableId,s.variantId,s.chairId,s.chairQty,s.sideboardId||""].join("|"),keys=new Set(additions.map(key));
additions.forEach(s=>{if(!scenes.some(x=>key(x)===key(s)))scenes.push(s);});
const note="AI 搭配展示图 · 非实拍；尺寸以配置文字为准，石纹与颜色以实物为准";
function label(){const m=root.HP_WOOD_CURRENT_MODEL;if(m?.scene?.stoneRepair!==revision||!keys.has(key(m.scene)))return;const preview=document.querySelector("[data-zwf-preview-kind]");if(preview)preview.dataset.zwfPreviewKind="scene";const caption=document.querySelector(".zwf-caption"),last=caption&&caption.lastChild;if(last&&last.nodeType===3&&last.nodeValue!==note)last.nodeValue=note;}
const ui=root.HP_WOOD_UI;if(ui&&!ui.__release15Disclosure){const original=ui.getQuoteSnapshot;ui.getQuoteSnapshot=function(){const q=original.apply(this,arguments),s=root.HP_WOOD_CURRENT_MODEL?.scene;if(s?.stoneRepair===revision&&keys.has(key(s)))q.imageNote=note;return q;};ui.__release15Disclosure=true;}
const app=document.getElementById("zwfApp");if(app)new MutationObserver(label).observe(app,{childList:true,subtree:true});root.HP_WOOD_RELEASE15_REVISION=revision;document.querySelector('[data-zwf-variant][aria-pressed="true"]')?.click();label();
})(window);

/* v1416: three C335 scenes with source-backed material and exact configuration keys. */
(function(root){
"use strict";
const revision="v1416-c335-scenes3";if(root.HP_WOOD_C335_REVISION===revision)return;
const additions=[{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"150-90","chairId":"c335","chairQty":4,"sideboardId":"","image":"scene-images/v1416/kjt-6748-150-90-c335-4.png","stoneRepair":"v1416-c335-scenes3"},{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"150-90","chairId":"c335","chairQty":6,"sideboardId":"","image":"scene-images/v1416/kjt-6748-150-90-c335-6.png","stoneRepair":"v1416-c335-scenes3"},{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"150-90","chairId":"c335","chairQty":8,"sideboardId":"","image":"scene-images/v1416/kjt-6748-150-90-c335-8.png","stoneRepair":"v1416-c335-scenes3"}],scenes=root.WOOD_FURNITURE_SCENES;if(!Array.isArray(scenes))return;
const key=s=>[s.tableId,s.variantId,s.chairId,s.chairQty,s.sideboardId||""].join("|"),keys=new Set(additions.map(key));
additions.forEach(s=>{if(!scenes.some(x=>key(x)===key(s)))scenes.push(s);});
const note="AI 搭配展示图 · 非实拍；尺寸以配置文字为准，石纹与颜色以实物为准";
function label(){const m=root.HP_WOOD_CURRENT_MODEL;if(m?.scene?.stoneRepair!==revision||!keys.has(key(m.scene)))return;const preview=document.querySelector("[data-zwf-preview-kind]");if(preview)preview.dataset.zwfPreviewKind="scene";const caption=document.querySelector(".zwf-caption"),last=caption&&caption.lastChild;if(last&&last.nodeType===3&&last.nodeValue!==note)last.nodeValue=note;}
const ui=root.HP_WOOD_UI;if(ui&&!ui.__c335Disclosure){const original=ui.getQuoteSnapshot;ui.getQuoteSnapshot=function(){const q=original.apply(this,arguments),s=root.HP_WOOD_CURRENT_MODEL?.scene;if(s?.stoneRepair===revision&&keys.has(key(s)))q.imageNote=note;return q;};ui.__c335Disclosure=true;}
const app=document.getElementById("zwfApp");if(app)new MutationObserver(label).observe(app,{childList:true,subtree:true});root.HP_WOOD_C335_REVISION=revision;document.querySelector('[data-zwf-variant][aria-pressed="true"]')?.click();label();
})(window);

/* v1417: three C2602 scenes with source-backed material and exact configuration keys. */
(function(root){
"use strict";
const revision="v1417-c2602-scenes3";if(root.HP_WOOD_C2602_REVISION===revision)return;
const additions=[{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"150-90","chairId":"c2602","chairQty":4,"sideboardId":"","image":"scene-images/v1417/kjt-6748-150-90-c2602-4.png","stoneRepair":"v1417-c2602-scenes3"},{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"150-90","chairId":"c2602","chairQty":6,"sideboardId":"","image":"scene-images/v1417/kjt-6748-150-90-c2602-6.png","stoneRepair":"v1417-c2602-scenes3"},{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"150-90","chairId":"c2602","chairQty":8,"sideboardId":"","image":"scene-images/v1417/kjt-6748-150-90-c2602-8.png","stoneRepair":"v1417-c2602-scenes3"}],scenes=root.WOOD_FURNITURE_SCENES;if(!Array.isArray(scenes))return;
const key=s=>[s.tableId,s.variantId,s.chairId,s.chairQty,s.sideboardId||""].join("|"),keys=new Set(additions.map(key));
additions.forEach(s=>{if(!scenes.some(x=>key(x)===key(s)))scenes.push(s);});
const note="AI 搭配展示图 · 非实拍；尺寸以配置文字为准，石纹与颜色以实物为准";
function label(){const m=root.HP_WOOD_CURRENT_MODEL;if(m?.scene?.stoneRepair!==revision||!keys.has(key(m.scene)))return;const preview=document.querySelector("[data-zwf-preview-kind]");if(preview)preview.dataset.zwfPreviewKind="scene";const caption=document.querySelector(".zwf-caption"),last=caption&&caption.lastChild;if(last&&last.nodeType===3&&last.nodeValue!==note)last.nodeValue=note;}
const ui=root.HP_WOOD_UI;if(ui&&!ui.__c2602Disclosure){const original=ui.getQuoteSnapshot;ui.getQuoteSnapshot=function(){const q=original.apply(this,arguments),s=root.HP_WOOD_CURRENT_MODEL?.scene;if(s?.stoneRepair===revision&&keys.has(key(s)))q.imageNote=note;return q;};ui.__c2602Disclosure=true;}
const app=document.getElementById("zwfApp");if(app)new MutationObserver(label).observe(app,{childList:true,subtree:true});root.HP_WOOD_C2602_REVISION=revision;document.querySelector('[data-zwf-variant][aria-pressed="true"]')?.click();label();
})(window);

/* v1418: three C6898 scenes with source-backed material and exact configuration keys. */
(function(root){
"use strict";
const revision="v1418-c6898-scenes3";if(root.HP_WOOD_C6898_REVISION===revision)return;
const additions=[{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"150-90","chairId":"c6898","chairQty":4,"sideboardId":"","image":"scene-images/v1418/kjt-6748-150-90-c6898-4.png","stoneRepair":"v1418-c6898-scenes3"},{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"150-90","chairId":"c6898","chairQty":6,"sideboardId":"","image":"scene-images/v1418/kjt-6748-150-90-c6898-6.png","stoneRepair":"v1418-c6898-scenes3"},{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"150-90","chairId":"c6898","chairQty":8,"sideboardId":"","image":"scene-images/v1418/kjt-6748-150-90-c6898-8.png","stoneRepair":"v1418-c6898-scenes3"}],scenes=root.WOOD_FURNITURE_SCENES;if(!Array.isArray(scenes))return;
const key=s=>[s.tableId,s.variantId,s.chairId,s.chairQty,s.sideboardId||""].join("|"),keys=new Set(additions.map(key));
additions.forEach(s=>{if(!scenes.some(x=>key(x)===key(s)))scenes.push(s);});
const note="AI 搭配展示图 · 非实拍；尺寸以配置文字为准，石纹与颜色以实物为准";
function label(){const m=root.HP_WOOD_CURRENT_MODEL;if(m?.scene?.stoneRepair!==revision||!keys.has(key(m.scene)))return;const preview=document.querySelector("[data-zwf-preview-kind]");if(preview)preview.dataset.zwfPreviewKind="scene";const caption=document.querySelector(".zwf-caption"),last=caption&&caption.lastChild;if(last&&last.nodeType===3&&last.nodeValue!==note)last.nodeValue=note;}
const ui=root.HP_WOOD_UI;if(ui&&!ui.__c6898Disclosure){const original=ui.getQuoteSnapshot;ui.getQuoteSnapshot=function(){const q=original.apply(this,arguments),s=root.HP_WOOD_CURRENT_MODEL?.scene;if(s?.stoneRepair===revision&&keys.has(key(s)))q.imageNote=note;return q;};ui.__c6898Disclosure=true;}
const app=document.getElementById("zwfApp");if(app)new MutationObserver(label).observe(app,{childList:true,subtree:true});root.HP_WOOD_C6898_REVISION=revision;document.querySelector('[data-zwf-variant][aria-pressed="true"]')?.click();label();
})(window);

/* v1419: three C46 scenes with source-backed material and exact configuration keys. */
(function(root){
"use strict";
const revision="v1419-c46-scenes3";if(root.HP_WOOD_C46_REVISION===revision)return;
const additions=[{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"150-90","chairId":"c46","chairQty":4,"sideboardId":"","image":"scene-images/v1419/kjt-6748-150-90-c46-4.png","stoneRepair":"v1419-c46-scenes3"},{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"150-90","chairId":"c46","chairQty":6,"sideboardId":"","image":"scene-images/v1419/kjt-6748-150-90-c46-6.png","stoneRepair":"v1419-c46-scenes3"},{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"150-90","chairId":"c46","chairQty":8,"sideboardId":"","image":"scene-images/v1419/kjt-6748-150-90-c46-8.png","stoneRepair":"v1419-c46-scenes3"}],scenes=root.WOOD_FURNITURE_SCENES;if(!Array.isArray(scenes))return;
const key=s=>[s.tableId,s.variantId,s.chairId,s.chairQty,s.sideboardId||""].join("|"),keys=new Set(additions.map(key));
additions.forEach(s=>{if(!scenes.some(x=>key(x)===key(s)))scenes.push(s);});
const note="AI 搭配展示图 · 非实拍；尺寸以配置文字为准，石纹与颜色以实物为准";
function label(){const m=root.HP_WOOD_CURRENT_MODEL;if(m?.scene?.stoneRepair!==revision||!keys.has(key(m.scene)))return;const preview=document.querySelector("[data-zwf-preview-kind]");if(preview)preview.dataset.zwfPreviewKind="scene";const caption=document.querySelector(".zwf-caption"),last=caption&&caption.lastChild;if(last&&last.nodeType===3&&last.nodeValue!==note)last.nodeValue=note;}
const ui=root.HP_WOOD_UI;if(ui&&!ui.__c46Disclosure){const original=ui.getQuoteSnapshot;ui.getQuoteSnapshot=function(){const q=original.apply(this,arguments),s=root.HP_WOOD_CURRENT_MODEL?.scene;if(s?.stoneRepair===revision&&keys.has(key(s)))q.imageNote=note;return q;};ui.__c46Disclosure=true;}
const app=document.getElementById("zwfApp");if(app)new MutationObserver(label).observe(app,{childList:true,subtree:true});root.HP_WOOD_C46_REVISION=revision;document.querySelector('[data-zwf-variant][aria-pressed="true"]')?.click();label();
})(window);

/* v1420: three C2331 scenes with source-backed material and exact configuration keys. */
(function(root){
"use strict";
const revision="v1420-c2331-scenes3";if(root.HP_WOOD_C2331_REVISION===revision)return;
const additions=[{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"150-90","chairId":"c2331","chairQty":4,"sideboardId":"","image":"scene-images/v1420/kjt-6748-150-90-c2331-4.png","stoneRepair":"v1420-c2331-scenes3"},{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"150-90","chairId":"c2331","chairQty":6,"sideboardId":"","image":"scene-images/v1420/kjt-6748-150-90-c2331-6.png","stoneRepair":"v1420-c2331-scenes3"},{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"150-90","chairId":"c2331","chairQty":8,"sideboardId":"","image":"scene-images/v1420/kjt-6748-150-90-c2331-8.png","stoneRepair":"v1420-c2331-scenes3"}],scenes=root.WOOD_FURNITURE_SCENES;if(!Array.isArray(scenes))return;
const key=s=>[s.tableId,s.variantId,s.chairId,s.chairQty,s.sideboardId||""].join("|"),keys=new Set(additions.map(key));
additions.forEach(s=>{if(!scenes.some(x=>key(x)===key(s)))scenes.push(s);});
const note="AI 搭配展示图 · 非实拍；尺寸以配置文字为准，石纹与颜色以实物为准";
function label(){const m=root.HP_WOOD_CURRENT_MODEL;if(m?.scene?.stoneRepair!==revision||!keys.has(key(m.scene)))return;const preview=document.querySelector("[data-zwf-preview-kind]");if(preview)preview.dataset.zwfPreviewKind="scene";const caption=document.querySelector(".zwf-caption"),last=caption&&caption.lastChild;if(last&&last.nodeType===3&&last.nodeValue!==note)last.nodeValue=note;}
const ui=root.HP_WOOD_UI;if(ui&&!ui.__c2331Disclosure){const original=ui.getQuoteSnapshot;ui.getQuoteSnapshot=function(){const q=original.apply(this,arguments),s=root.HP_WOOD_CURRENT_MODEL?.scene;if(s?.stoneRepair===revision&&keys.has(key(s)))q.imageNote=note;return q;};ui.__c2331Disclosure=true;}
const app=document.getElementById("zwfApp");if(app)new MutationObserver(label).observe(app,{childList:true,subtree:true});root.HP_WOOD_C2331_REVISION=revision;document.querySelector('[data-zwf-variant][aria-pressed="true"]')?.click();label();
})(window);

/* v1421: three C33 scenes with source-backed material and exact configuration keys. */
(function(root){
"use strict";
const revision="v1421-c33-scenes3";if(root.HP_WOOD_C33_REVISION===revision)return;
const additions=[{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"150-90","chairId":"c33","chairQty":4,"sideboardId":"","image":"scene-images/v1421/kjt-6748-150-90-c33-4.png","stoneRepair":"v1421-c33-scenes3"},{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"150-90","chairId":"c33","chairQty":6,"sideboardId":"","image":"scene-images/v1421/kjt-6748-150-90-c33-6.png","stoneRepair":"v1421-c33-scenes3"},{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"150-90","chairId":"c33","chairQty":8,"sideboardId":"","image":"scene-images/v1421/kjt-6748-150-90-c33-8.png","stoneRepair":"v1421-c33-scenes3"}],scenes=root.WOOD_FURNITURE_SCENES;if(!Array.isArray(scenes))return;
const key=s=>[s.tableId,s.variantId,s.chairId,s.chairQty,s.sideboardId||""].join("|"),keys=new Set(additions.map(key));
additions.forEach(s=>{if(!scenes.some(x=>key(x)===key(s)))scenes.push(s);});
const note="AI 搭配展示图 · 非实拍；尺寸以配置文字为准，石纹与颜色以实物为准";
function label(){const m=root.HP_WOOD_CURRENT_MODEL;if(m?.scene?.stoneRepair!==revision||!keys.has(key(m.scene)))return;const preview=document.querySelector("[data-zwf-preview-kind]");if(preview)preview.dataset.zwfPreviewKind="scene";const caption=document.querySelector(".zwf-caption"),last=caption&&caption.lastChild;if(last&&last.nodeType===3&&last.nodeValue!==note)last.nodeValue=note;}
const ui=root.HP_WOOD_UI;if(ui&&!ui.__c33Disclosure){const original=ui.getQuoteSnapshot;ui.getQuoteSnapshot=function(){const q=original.apply(this,arguments),s=root.HP_WOOD_CURRENT_MODEL?.scene;if(s?.stoneRepair===revision&&keys.has(key(s)))q.imageNote=note;return q;};ui.__c33Disclosure=true;}
const app=document.getElementById("zwfApp");if(app)new MutationObserver(label).observe(app,{childList:true,subtree:true});root.HP_WOOD_C33_REVISION=revision;document.querySelector('[data-zwf-variant][aria-pressed="true"]')?.click();label();
})(window);

/* v1422: three C67-C72 scenes with source-backed material and exact configuration keys. */
(function(root){
"use strict";
const revision="v1422-c67-c72-scenes3";if(root.HP_WOOD_C67_C72_REVISION===revision)return;
const additions=[{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"150-90","chairId":"c67-c72","chairQty":4,"sideboardId":"","image":"scene-images/v1422/kjt-6748-150-90-c67-c72-4.png","stoneRepair":"v1422-c67-c72-scenes3"},{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"150-90","chairId":"c67-c72","chairQty":6,"sideboardId":"","image":"scene-images/v1422/kjt-6748-150-90-c67-c72-6.png","stoneRepair":"v1422-c67-c72-scenes3"},{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"150-90","chairId":"c67-c72","chairQty":8,"sideboardId":"","image":"scene-images/v1422/kjt-6748-150-90-c67-c72-8.png","stoneRepair":"v1422-c67-c72-scenes3"}],scenes=root.WOOD_FURNITURE_SCENES;if(!Array.isArray(scenes))return;
const key=s=>[s.tableId,s.variantId,s.chairId,s.chairQty,s.sideboardId||""].join("|"),keys=new Set(additions.map(key));
additions.forEach(s=>{if(!scenes.some(x=>key(x)===key(s)))scenes.push(s);});
const note="AI 搭配展示图 · 非实拍；尺寸以配置文字为准，石纹与颜色以实物为准";
function label(){const m=root.HP_WOOD_CURRENT_MODEL;if(m?.scene?.stoneRepair!==revision||!keys.has(key(m.scene)))return;const preview=document.querySelector("[data-zwf-preview-kind]");if(preview)preview.dataset.zwfPreviewKind="scene";const caption=document.querySelector(".zwf-caption"),last=caption&&caption.lastChild;if(last&&last.nodeType===3&&last.nodeValue!==note)last.nodeValue=note;}
const ui=root.HP_WOOD_UI;if(ui&&!ui.__c67c72Disclosure){const original=ui.getQuoteSnapshot;ui.getQuoteSnapshot=function(){const q=original.apply(this,arguments),s=root.HP_WOOD_CURRENT_MODEL?.scene;if(s?.stoneRepair===revision&&keys.has(key(s)))q.imageNote=note;return q;};ui.__c67c72Disclosure=true;}
const app=document.getElementById("zwfApp");if(app)new MutationObserver(label).observe(app,{childList:true,subtree:true});root.HP_WOOD_C67_C72_REVISION=revision;document.querySelector('[data-zwf-variant][aria-pressed="true"]')?.click();label();
})(window);

/* v1423: three C6901 scenes with source-backed material and exact configuration keys. */
(function(root){
"use strict";
const revision="v1423-c6901-scenes3";if(root.HP_WOOD_C6901_REVISION===revision)return;
const additions=[{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"150-90","chairId":"c6901","chairQty":4,"sideboardId":"","image":"scene-images/v1423/kjt-6748-150-90-c6901-4.png","stoneRepair":"v1423-c6901-scenes3"},{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"135-80","chairId":"c6901","chairQty":6,"sideboardId":"","image":"scene-images/v1423/kjt-6748-135-80-c6901-6.png","stoneRepair":"v1423-c6901-scenes3"},{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"150-90","chairId":"c6901","chairQty":8,"sideboardId":"","image":"scene-images/v1423/kjt-6748-150-90-c6901-8.png","stoneRepair":"v1423-c6901-scenes3"}],scenes=root.WOOD_FURNITURE_SCENES;if(!Array.isArray(scenes))return;
const key=s=>[s.tableId,s.variantId,s.chairId,s.chairQty,s.sideboardId||""].join("|"),keys=new Set(additions.map(key));
additions.forEach(s=>{if(!scenes.some(x=>key(x)===key(s)))scenes.push(s);});
const note="AI 搭配展示图 · 非实拍；尺寸以配置文字为准，石纹与颜色以实物为准";
function label(){const m=root.HP_WOOD_CURRENT_MODEL;if(m?.scene?.stoneRepair!==revision||!keys.has(key(m.scene)))return;const preview=document.querySelector("[data-zwf-preview-kind]");if(preview)preview.dataset.zwfPreviewKind="scene";const caption=document.querySelector(".zwf-caption"),last=caption&&caption.lastChild;if(last&&last.nodeType===3&&last.nodeValue!==note)last.nodeValue=note;}
const ui=root.HP_WOOD_UI;if(ui&&!ui.__c6901Disclosure){const original=ui.getQuoteSnapshot;ui.getQuoteSnapshot=function(){const q=original.apply(this,arguments),s=root.HP_WOOD_CURRENT_MODEL?.scene;if(s?.stoneRepair===revision&&keys.has(key(s)))q.imageNote=note;return q;};ui.__c6901Disclosure=true;}
const app=document.getElementById("zwfApp");if(app)new MutationObserver(label).observe(app,{childList:true,subtree:true});root.HP_WOOD_C6901_REVISION=revision;document.querySelector('[data-zwf-variant][aria-pressed="true"]')?.click();label();
})(window);

/* v1424: three 135/80 eight-chair scenes with source-backed material and exact configuration keys. */
(function(root){
"use strict";
const revision="v1424-135-eight3";if(root.HP_WOOD_135_EIGHT3_REVISION===revision)return;
const additions=[{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"135-80","chairId":"c2602","chairQty":8,"sideboardId":"","image":"scene-images/v1424/kjt-6748-135-80-c2602-8.png","stoneRepair":"v1424-135-eight3"},{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"135-80","chairId":"c67-c72","chairQty":8,"sideboardId":"","image":"scene-images/v1424/kjt-6748-135-80-c67-c72-8.png","stoneRepair":"v1424-135-eight3"},{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"135-80","chairId":"c2331","chairQty":8,"sideboardId":"","image":"scene-images/v1424/kjt-6748-135-80-c2331-8.png","stoneRepair":"v1424-135-eight3"}],scenes=root.WOOD_FURNITURE_SCENES;if(!Array.isArray(scenes))return;
const key=s=>[s.tableId,s.variantId,s.chairId,s.chairQty,s.sideboardId||""].join("|"),keys=new Set(additions.map(key));
additions.forEach(s=>{if(!scenes.some(x=>key(x)===key(s)))scenes.push(s);});
const note="AI 搭配展示图 · 非实拍；尺寸以配置文字为准，石纹与颜色以实物为准";
function label(){const m=root.HP_WOOD_CURRENT_MODEL;if(m?.scene?.stoneRepair!==revision||!keys.has(key(m.scene)))return;const preview=document.querySelector("[data-zwf-preview-kind]");if(preview)preview.dataset.zwfPreviewKind="scene";const caption=document.querySelector(".zwf-caption"),last=caption&&caption.lastChild;if(last&&last.nodeType===3&&last.nodeValue!==note)last.nodeValue=note;}
const ui=root.HP_WOOD_UI;if(ui&&!ui.__135Eight3Disclosure){const original=ui.getQuoteSnapshot;ui.getQuoteSnapshot=function(){const q=original.apply(this,arguments),s=root.HP_WOOD_CURRENT_MODEL?.scene;if(s?.stoneRepair===revision&&keys.has(key(s)))q.imageNote=note;return q;};ui.__135Eight3Disclosure=true;}
const app=document.getElementById("zwfApp");if(app)new MutationObserver(label).observe(app,{childList:true,subtree:true});root.HP_WOOD_135_EIGHT3_REVISION=revision;document.querySelector('[data-zwf-variant][aria-pressed="true"]')?.click();label();
})(window);

/* v1425: three135/80 C6901 and C6898 scenes with source-backed material and exact configuration keys. */
(function(root){
"use strict";
const revision="v1425-135-next3";if(root.HP_WOOD_135_NEXT3_REVISION===revision)return;
const additions=[{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"135-80","chairId":"c6901","chairQty":8,"sideboardId":"","image":"scene-images/v1425/kjt-6748-135-80-c6901-8.png","stoneRepair":"v1425-135-next3"},{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"135-80","chairId":"c6898","chairQty":6,"sideboardId":"","image":"scene-images/v1425/kjt-6748-135-80-c6898-6.png","stoneRepair":"v1425-135-next3"},{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"135-80","chairId":"c6898","chairQty":8,"sideboardId":"","image":"scene-images/v1425/kjt-6748-135-80-c6898-8.png","stoneRepair":"v1425-135-next3"}],scenes=root.WOOD_FURNITURE_SCENES;if(!Array.isArray(scenes))return;
const key=s=>[s.tableId,s.variantId,s.chairId,s.chairQty,s.sideboardId||""].join("|"),keys=new Set(additions.map(key));
additions.forEach(s=>{if(!scenes.some(x=>key(x)===key(s)))scenes.push(s);});
const note="AI 搭配展示图 · 非实拍；尺寸以配置文字为准，石纹与颜色以实物为准";
function label(){const m=root.HP_WOOD_CURRENT_MODEL;if(m?.scene?.stoneRepair!==revision||!keys.has(key(m.scene)))return;const preview=document.querySelector("[data-zwf-preview-kind]");if(preview)preview.dataset.zwfPreviewKind="scene";const caption=document.querySelector(".zwf-caption"),last=caption&&caption.lastChild;if(last&&last.nodeType===3&&last.nodeValue!==note)last.nodeValue=note;}
const ui=root.HP_WOOD_UI;if(ui&&!ui.__135Next3Disclosure){const original=ui.getQuoteSnapshot;ui.getQuoteSnapshot=function(){const q=original.apply(this,arguments),s=root.HP_WOOD_CURRENT_MODEL?.scene;if(s?.stoneRepair===revision&&keys.has(key(s)))q.imageNote=note;return q;};ui.__135Next3Disclosure=true;}
const app=document.getElementById("zwfApp");if(app)new MutationObserver(label).observe(app,{childList:true,subtree:true});root.HP_WOOD_135_NEXT3_REVISION=revision;document.querySelector('[data-zwf-variant][aria-pressed="true"]')?.click();label();
})(window);

/* v1426: two135/80 C33 scenes with source-backed material and exact configuration keys. */
(function(root){
"use strict";
const revision="v1426-135-c33-final2";if(root.HP_WOOD_135_C33_FINAL2_REVISION===revision)return;
const additions=[{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"135-80","chairId":"c33","chairQty":6,"sideboardId":"","image":"scene-images/v1426/kjt-6748-135-80-c33-6.png","stoneRepair":"v1426-135-c33-final2"},{"generatedIllustration":true,"sizeStatus":"illustrative","tableId":"kjt-6748","variantId":"135-80","chairId":"c33","chairQty":8,"sideboardId":"","image":"scene-images/v1426/kjt-6748-135-80-c33-8.png","stoneRepair":"v1426-135-c33-final2"}],scenes=root.WOOD_FURNITURE_SCENES;if(!Array.isArray(scenes))return;
const key=s=>[s.tableId,s.variantId,s.chairId,s.chairQty,s.sideboardId||""].join("|"),keys=new Set(additions.map(key));
additions.forEach(s=>{if(!scenes.some(x=>key(x)===key(s)))scenes.push(s);});
const note="AI 搭配展示图 · 非实拍；尺寸以配置文字为准，石纹与颜色以实物为准";
function label(){const m=root.HP_WOOD_CURRENT_MODEL;if(m?.scene?.stoneRepair!==revision||!keys.has(key(m.scene)))return;const preview=document.querySelector("[data-zwf-preview-kind]");if(preview)preview.dataset.zwfPreviewKind="scene";const caption=document.querySelector(".zwf-caption"),last=caption&&caption.lastChild;if(last&&last.nodeType===3&&last.nodeValue!==note)last.nodeValue=note;}
const ui=root.HP_WOOD_UI;if(ui&&!ui.__135C33Final2Disclosure){const original=ui.getQuoteSnapshot;ui.getQuoteSnapshot=function(){const q=original.apply(this,arguments),s=root.HP_WOOD_CURRENT_MODEL?.scene;if(s?.stoneRepair===revision&&keys.has(key(s)))q.imageNote=note;return q;};ui.__135C33Final2Disclosure=true;}
const app=document.getElementById("zwfApp");if(app)new MutationObserver(label).observe(app,{childList:true,subtree:true});root.HP_WOOD_135_C33_FINAL2_REVISION=revision;document.querySelector('[data-zwf-variant][aria-pressed="true"]')?.click();label();
})(window);
