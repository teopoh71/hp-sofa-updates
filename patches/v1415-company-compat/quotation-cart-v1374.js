(function(){
  'use strict';
  const Q=window.HP_QUOTATION_CORE,B=window.HP_QUOTE_BRIDGE;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const font="system-ui,-apple-system,'PingFang SC','Microsoft YaHei',sans-serif";
  let rows=[],db=null,ready=false,writeQueue=Promise.resolve(),undo=null,pages=[],previewGeneration=0;
  const outputOptionsKey='hp-quotation-customer-output-options';
  let outputOptions=Q.normalizeOutputOptions((()=>{try{return JSON.parse(localStorage.getItem(outputOptionsKey)||'{}');}catch{return {};}})());
  const pendingImages=new Set();
  function el(tag,attrs={}){return Object.assign(document.createElement(tag),attrs);}
  const bar=el('div',{id:'hq-bar'});bar.innerHTML='<button type="button" id="hq-add" disabled>加入购物车</button><button type="button" id="hq-open">报价购物车 · 0</button>';document.body.append(bar);
  function dialog(id,title,sub){const d=el('dialog',{id,className:'hq-dialog'});d.innerHTML=`<header class="hq-head"><div><h2>${title}</h2><p>${sub}</p></div><button type="button" data-close aria-label="关闭">关闭</button></header><div class="hq-body"></div>`;document.body.append(d);d.querySelector('[data-close]').onclick=()=>d.close();return d;}
  const cart=dialog('hq-cart','报价购物车','先检查产品、材质和尺寸，再预览报价图片');
  cart.insertAdjacentHTML('beforeend','<p class="hq-status" role="status"></p><footer class="hq-footer"><button type="button" id="hq-copy-text">复制报价文字</button><button type="button" id="hq-preview" class="hq-primary">预览报价图片</button></footer>');
  const customerLinks=dialog('hq-customer-links','顾客修改沙发组合','将对应链接连同报价图片发给顾客。');
  function showCustomerLinks(list){customerLinks.querySelector('.hq-body').innerHTML=list.filter(r=>r.customerUrl).map(r=>`<section data-base-url="${esc(r.customerUrl)}"><strong>${esc(r.title)}</strong><label style="display:flex;align-items:center;gap:8px;min-height:44px"><input type="checkbox" data-customer-show-price>显示价格</label><p><a href="${esc(window.HPModelCustomerShare.withPrice(r.customerUrl))}" target="_blank" rel="noopener">打开顾客组合页面</a></p><textarea readonly aria-label="${esc(r.title)} 顾客组合链接" style="width:100%;min-height:90px">${esc(window.HPModelCustomerShare.withPrice(r.customerUrl))}</textarea><button type="button" data-copy-customer-link>复制链接</button><p role="status"></p></section>`).join('')||'<p>请先选择模块，再加入购物车。</p>';customerLinks.showModal();}
  async function copyCustomerLinkInput(input){
    try{if(navigator.clipboard?.writeText&&window.isSecureContext){await navigator.clipboard.writeText(input.value);return true;}}catch{}
    input.focus();input.select();input.setSelectionRange?.(0,input.value.length);
    try{return document.execCommand('copy')===true;}catch{return false;}
  }
  customerLinks.addEventListener('change',e=>{if(!e.target.matches('[data-customer-show-price]'))return;const section=e.target.closest('section'),url=window.HPModelCustomerShare.withPrice(section.dataset.baseUrl,e.target.checked);section.querySelector('textarea').value=url;section.querySelector('a').href=url;section.querySelector('[role=status]').textContent='';});
  customerLinks.addEventListener('click',async e=>{if(!e.target.closest('[data-copy-customer-link]'))return;const section=e.target.closest('section'),input=section.querySelector('textarea'),status=section.querySelector('[role=status]');input.focus();input.select();const copied=await copyCustomerLinkInput(input);status.textContent=copied?'组合链接已复制。':'链接已选中，请长按复制。';});
  const preview=dialog('hq-image-preview','报价图片','确认后保存或分享；也可以长按图片保存');
  function previewCustomerLinks(list){return '<section class="hq-direct-customer-links" aria-label="客户组合链接"><h3>客户组合链接</h3><p>复制图片后先粘贴发送，再复制链接发送。</p>'+(list.filter(r=>r.customerUrl).map(r=>`<section data-base-url="${esc(r.customerUrl)}"><strong>${esc(r.title)}</strong><label style="display:flex;align-items:center;gap:8px;min-height:44px"><input type="checkbox" data-customer-show-price style="width:18px;min-width:18px;height:18px;min-height:18px;flex:0 0 18px;margin:0">显示价格</label><p><a href="${esc(window.HPModelCustomerShare.withPrice(r.customerUrl))}" target="_blank" rel="noopener">打开顾客组合页面</a></p><textarea readonly aria-label="${esc(r.title)} 顾客组合链接" style="width:100%;min-height:90px">${esc(window.HPModelCustomerShare.withPrice(r.customerUrl))}</textarea><button type="button" data-copy-customer-link>复制链接</button><p role="status"></p></section>`).join('')||'<p>请先选择模块，再加入购物车。</p>')+'</section>';}
  preview.addEventListener('change',e=>{if(!e.target.matches('[data-customer-show-price]'))return;const section=e.target.closest('section'),url=window.HPModelCustomerShare.withPrice(section.dataset.baseUrl,e.target.checked);section.querySelector('textarea').value=url;section.querySelector('a').href=url;section.querySelector('[role=status]').textContent='';});
  preview.addEventListener('click',async e=>{if(!e.target.closest('[data-copy-customer-link]'))return;const section=e.target.closest('section'),input=section.querySelector('textarea'),status=section.querySelector('[role=status]');input.focus();input.select();const copied=await copyCustomerLinkInput(input);status.textContent=copied?'组合链接已复制。':'链接已选中，请长按复制。';});
  const manual=dialog('hq-manual','手动复制报价','自动复制未成功，请长按内容全选并复制');
  manual.querySelector('.hq-body').append(el('textarea',{className:'hq-manual',readOnly:true,ariaLabel:'完整报价文字'}));
  const notice=el('div',{className:'hq-toast',role:'status',hidden:true});let timer;
  function toast(t){clearTimeout(timer);notice.textContent=t;notice.hidden=false;([...document.querySelectorAll('dialog[open]')].at(-1)||document.body).append(notice);timer=setTimeout(()=>notice.hidden=true,4000);}
  const storageError=()=>cart.querySelector('.hq-status').textContent='暂时无法保存购物车，请在关闭页面前保存报价图片。';
  function persist(){const copy=rows.map(Q.snapshot);writeQueue=writeQueue.then(()=>new Promise((resolve,reject)=>{if(!db){storageError();resolve();return;}const tx=db.transaction('quotes','readwrite');tx.objectStore('quotes').put(copy,'cart');tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);})).catch(storageError);return writeQueue;}
  async function restore(){try{db=await new Promise((resolve,reject)=>{const req=indexedDB.open('hp-quotation-cart',1);req.onupgradeneeded=()=>req.result.createObjectStore('quotes');req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);req.onblocked=()=>reject(Error('storage blocked'));});const saved=await new Promise((resolve,reject)=>{const req=db.transaction('quotes').objectStore('quotes').get('cart');req.onsuccess=()=>resolve(req.result||[]);req.onerror=()=>reject(req.error);});rows=saved.map(Q.snapshot);}catch{storageError();}ready=true;bar.querySelector('#hq-add').disabled=false;render();}
  function canExport(){return rows.length>0&&(outputOptions.hidePrice||!Q.summary(rows).pending);}
  function priceStatus(r){return '折扣基准价：'+(r.basePrice==null?'待核价':Q.cash(r.basePrice))+(r.priceMode==='manual'?' · 已手动改价':r.priceMode==='discount'?' · '+Q.discountLabel(r.discountRate):'');}
  const pricingHTML=(list,scope)=>Q.priceLines(list,{},scope).filter(l=>l.kind!=='pending').map(l=>`<div class="hq-breakdown-row hq-breakdown-${esc(l.kind)}"><span>${esc(l.label)}</span><strong>${esc(l.value)}</strong></div>`).join('');
  function updateTotals(){
    const total=Q.summary(rows);
    const sum=cart.querySelector('.hq-summary');
    if(sum)sum.innerHTML=pricingHTML(rows,'total');
    const pending=cart.querySelector('[data-pending-total]');
    if(pending){pending.hidden=!total.pending;pending.textContent=total.pending?'含 '+total.pending+' 件待核价，核实前不能出具正式报价。':'';}
    for(const id of ['hq-preview','hq-copy-text']){const button=cart.querySelector('#'+id);button.disabled=!canExport();button.title=total.pending&&!outputOptions.hidePrice?'含待核价项目，请先核实价格或选择隐藏价格的选款单':'';}
    for(const card of cart.querySelectorAll('.hq-card')){
      const row=rows.find(r=>r.id===card.dataset.id);if(!row)continue;
      const subtotal=card.querySelector('.hq-price');subtotal.textContent=row.price==null?'待核价':Q.cash(Math.round(row.price*100)*row.quantity/100);subtotal.classList.toggle('hq-pending',row.price==null);
      card.querySelector('[data-price-status]').textContent=priceStatus(row);
      card.querySelector('[data-line-breakdown]').innerHTML=pricingHTML([row],'line');
      card.querySelector('[data-price-reset]').disabled=row.basePrice==null;
    }
    for(const button of cart.querySelectorAll('[data-quote-discount]')){
      const rate=Number(button.dataset.quoteDiscount),priced=rows.filter(r=>r.basePrice!=null);
      button.setAttribute('aria-pressed',String(priced.length>0&&priced.every(r=>rate===1?r.priceMode==='original':r.priceMode==='discount'&&r.discountRate===rate)));
    }
  }
  function render(){const s=Q.summary(rows);bar.querySelector('#hq-open').textContent='报价购物车 · '+s.quantity;cart.querySelector('#hq-copy-text').disabled=!rows.length;cart.querySelector('#hq-preview').disabled=!rows.length;
    cart.querySelector('.hq-body').innerHTML=rows.length?`<div class="hq-tools"><span class="hq-note">${s.count} 款 · ${s.quantity} 件</span><button type="button" class="hq-danger" data-clear>一键清空</button></div>
      <section class="hq-output-options" aria-label="客户报价输出"><strong>客户报价输出</strong><label><input type="checkbox" data-output-option="hidePrice" ${outputOptions.hidePrice?'checked':''}> 不显示价格</label><label><input type="checkbox" data-output-option="hideDiscount" ${outputOptions.hideDiscount?'checked':''}> 不显示折扣</label><label><input type="checkbox" data-output-option="hideDetails" ${outputOptions.hideDetails?'checked':''}> 不显示细节</label><p>仅影响复制文字和报价图片，购物车中的编辑价格不变。</p></section><section class="hq-discounts" aria-label="整单折扣"><strong>整单折扣</strong><div class="hq-discount-buttons">${[...Q.discountRates,1].map(rate=>`<button type="button" data-quote-discount="${rate}" aria-pressed="false">${Q.discountLabel(rate)}</button>`).join('')}</div><p>按各产品的折扣基准价计算，不重复打折。折后进位到百元，单价可再修改。</p></section>`+rows.map(r=>`<article class="hq-card" data-id="${esc(r.id)}">${r.image?`<img class="hq-photo" src="${esc(r.image)}" alt="${esc(r.title)}" loading="lazy">`:'<div class="hq-photo hq-note">暂无图片</div>'}<div><h3>${esc(r.title)}</h3><p>${esc(r.configuration)}</p><p>材质：${esc(r.material||'待确认')}</p><p class="hq-size">尺寸：${esc(r.dimensions||'待核价')}</p>${r.imageNote?`<p class="hq-note">${esc(r.imageNote)}</p>`:''}${r.customerUrl?`<button type="button" data-customer-link>顾客修改此组合</button>`:''}
      <label class="hq-unit-price"><span>报价单价（元）</span><input type="number" data-unit-price ${r.pricePending?'disabled':''} min="0" max="1000000000" step="0.01" inputmode="decimal" value="${r.price??''}" placeholder="待核价" aria-label="${esc(r.title)} 报价单价"></label><div class="hq-price-tools"><p class="hq-note" data-price-status>${esc(priceStatus(r))}</p><button type="button" data-price-reset ${r.basePrice==null?'disabled':''}>恢复</button></div>
      <div class="hq-breakdown" data-line-breakdown></div><div class="hq-line"><div class="hq-quantity"><button type="button" data-qty="-1" aria-label="减少数量">−</button><input type="number" min="1" max="999" step="1" inputmode="numeric" value="${r.quantity}" aria-label="${esc(r.title)} 数量"><button type="button" data-qty="1" aria-label="增加数量">＋</button></div><strong class="hq-price ${r.price==null?'hq-pending':''}">${r.price==null?'待核价':esc(Q.cash(Math.round(r.price*100)*r.quantity/100))}</strong><button type="button" data-remove aria-label="删除 ${esc(r.title)}">删除</button></div></div></article>`).join('')+`<div class="hq-summary"><span>${s.pending?'已知小计':'合计'}</span><strong>${esc(Q.cash(s.amount))}</strong></div><p class="hq-pending" data-pending-total ${s.pending?'':'hidden'}></p><p class="hq-note">改价只影响本报价单。基准价为加入时的单价；待核价项目须先核实价格依据，不能以手填价替代。更换配置请重新加入。</p>`:'<div class="hq-empty"><strong>还没有加入产品</strong><p>选好规格和皮料后，点下方「加入购物车」。</p></div>';
    if(undo)cart.querySelector('.hq-body').insertAdjacentHTML('beforeend','<button type="button" data-undo>撤销清空</button>');
    updateTotals();
  }
  function changed(){previewGeneration++;render();persist();}
  cart.addEventListener('click',e=>{const target=e.target.closest('button');if(!target)return;if(target.hasAttribute('data-quote-discount')){const rate=Number(target.dataset.quoteDiscount);rows=rows.map(r=>Q.discountPrice(r,rate));changed();toast(rate===1?'已恢复各产品基准价':'已应用 '+Q.discountLabel(rate)+'，待核价产品除外');return;}if(target.hasAttribute('data-clear')){undo=rows.map(Q.snapshot);rows=[];changed();toast('购物车已清空，可撤销');return;}if(target.hasAttribute('data-undo')){rows.push(...undo);undo=null;changed();return;}const id=target.closest('[data-id]')?.dataset.id,r=rows.find(x=>x.id===id);if(!r)return;if(target.hasAttribute('data-customer-link')){showCustomerLinks([r]);return;}if(target.hasAttribute('data-price-reset')){Object.assign(r,Q.discountPrice(r,1));changed();return;}if(target.hasAttribute('data-remove'))rows=rows.filter(x=>x.id!==id);else if(target.hasAttribute('data-qty')){const next=r.quantity+Number(target.dataset.qty);if(next<1||next>999)return;r.quantity=next;}else return;changed();});
  cart.addEventListener('change',e=>{if(e.target.matches('[data-output-option]')){outputOptions=Q.normalizeOutputOptions({...outputOptions,[e.target.dataset.outputOption]:e.target.checked});try{localStorage.setItem(outputOptionsKey,JSON.stringify(outputOptions));}catch{}previewGeneration++;render();return;}if(e.target.matches('[data-unit-price]')){const r=rows.find(x=>x.id===e.target.closest('[data-id]').dataset.id);try{Object.assign(r,Q.manualPrice(r,e.target.value));e.target.value=r.price;previewGeneration++;updateTotals();persist();}catch(error){e.target.value=r.price??'';toast(error.message);}return;}if(!e.target.matches('.hq-quantity input'))return;const r=rows.find(x=>x.id===e.target.closest('[data-id]').dataset.id),quantity=Number(e.target.value);try{Q.snapshot({...r,quantity});r.quantity=quantity;changed();}catch(error){e.target.value=r.quantity;toast(error.message);}});
  cart.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.matches('[data-unit-price]')){e.preventDefault();e.target.blur();}});
  function loadImage(src){return new Promise((resolve,reject)=>{const im=new Image();if(!/^(data:|blob:)/.test(src))im.crossOrigin='anonymous';im.onload=()=>resolve(im);im.onerror=()=>reject(Error('图片未能加载'));im.src=src;});}
  const canvas=(w,h)=>Object.assign(document.createElement('canvas'),{width:Math.ceil(w),height:Math.ceil(h)});
  function fit(ctx,im,x,y,w,h){const scale=Math.min(w/im.width,h/im.height);ctx.drawImage(im,x+(w-im.width*scale)/2,y+(h-im.height*scale)/2,im.width*scale,im.height*scale);}
  const dataURL=blob=>new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(blob);});
  function freezeSVG(svg){const clone=svg.cloneNode(true),original=[svg,...svg.querySelectorAll('*')],copies=[clone,...clone.querySelectorAll('*')];original.forEach((node,i)=>{const style=getComputedStyle(node);for(const key of ['fill','stroke','stroke-width','opacity','font-family','font-size','font-weight'])copies[i].style.setProperty(key,style.getPropertyValue(key));});const width=svg.clientWidth,height=svg.clientHeight;if(width>0&&height>0){clone.setAttribute('width',String(width));clone.setAttribute('height',String(height));clone.style.setProperty('width',width+'px');clone.style.setProperty('height',height+'px');}clone.setAttribute('xmlns','http://www.w3.org/2000/svg');return clone;}
  function trimCanvas(source){try{const width=source.width||source.naturalWidth,height=source.height||source.naturalHeight,pixels=source.getContext?source:canvas(width,height);if(pixels!==source)pixels.getContext('2d').drawImage(source,0,0,width,height);const {data}=pixels.getContext('2d').getImageData(0,0,width,height);let left=width,top=height,right=-1,bottom=-1;for(let y=0;y<height;y++)for(let x=0;x<width;x++){const i=(y*width+x)*4;if(data[i+3]>8&&(data[i]<248||data[i+1]<248||data[i+2]<248)){left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y);}}if(right<left||bottom<top)return source;const cropWidth=right-left+1,cropHeight=bottom-top+1;if(cropWidth===width&&cropHeight===height)return source;const cropped=canvas(cropWidth,cropHeight);cropped.getContext('2d').drawImage(pixels,left,top,cropWidth,cropHeight,0,0,cropWidth,cropHeight);return cropped;}catch{return source;}}
  async function svgURL(clone){for(const im of clone.querySelectorAll('image')){const href=im.getAttribute('href')||im.getAttribute('xlink:href');if(href&&!href.startsWith('data:')){const res=await fetch(href);if(!res.ok)throw Error('图片未能加载');const d=await dataURL(await res.blob());im.setAttribute('href',d);im.setAttributeNS('http://www.w3.org/1999/xlink','href',d);}}return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(clone));}
  // Read geometry and copy graphics immediately, before the user changes the configuration.
  function capture(selection){let work;const visual=selection.visual;
    if(visual?.tagName.toLowerCase()==='canvas'&&visual.dataset.renderComplete==='true'){const frozen=visual.toDataURL('image/png');work=()=>loadImage(frozen);}
    else if(visual?.tagName.toLowerCase()==='svg'){const frozen=freezeSVG(visual);work=async()=>loadImage(await svgURL(frozen));}
    else if(visual){const base=visual.getBoundingClientRect();const nodes=[...visual.querySelectorAll('.zl10-piece-shape,.zolano-3776-live-piece.is-layout-piece')];const frozen=nodes.map(n=>{const g=n.querySelector('svg,img');if(!g)return null;const rect=n.getBoundingClientRect(),matrix=new DOMMatrix(getComputedStyle(n).transform),angle=Math.atan2(matrix.b,matrix.a);const imgTransform=g.tagName.toLowerCase()==='img'?getComputedStyle(g).transform:'none';return {cx:rect.x+rect.width/2-base.x,cy:rect.y+rect.height/2-base.y,w:n.offsetWidth,h:n.offsetHeight,gw:g.clientWidth,gh:g.clientHeight,fill:n.matches('.zolano-3776-live-piece'),angle,svg:g.tagName.toLowerCase()==='svg'?freezeSVG(g):null,src:g.currentSrc||g.src,imgTransform};}).filter(Boolean);
      if(frozen.length&&base.width&&base.height)work=async()=>{const c=canvas(base.width*2,base.height*2),ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);ctx.scale(2,2);for(const p of frozen){const im=await loadImage(p.svg?await svgURL(p.svg):p.src);ctx.save();ctx.translate(p.cx,p.cy);ctx.rotate(p.angle);const matrix=new DOMMatrix(p.imgTransform);ctx.transform(matrix.a,matrix.b,matrix.c,matrix.d,0,0);if(p.fill)ctx.drawImage(im,-p.gw/2,-p.gh/2,p.gw,p.gh);else fit(ctx,im,-p.w/2,-p.h/2,p.w,p.h);ctx.restore();}return c;};
    }
    return (async()=>{let im,note=selection.imageNote||'';try{if(work){im=await work();if(note==='组合示意'&&visual)im=trimCanvas(im);}else throw Error('reference');}catch{if(!selection.image)return {image:'',imageNote:'暂无组合图片，配置以文字为准'};try{im=await loadImage(selection.image);if(visual)note='型号参考图 · 配置以文字为准';}catch{return {image:'',imageNote:'图片暂未加载，配置以文字为准'};}}try{const c=canvas(900,520),ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,900,520);fit(ctx,im,15,15,870,490);return {image:c.toDataURL('image/jpeg',.88),imageNote:note};}catch{return {image:'',imageNote:'图片暂不可导出，配置以文字为准'};}})();
  }
  function addSelection(selection){if(!ready)return;const customerUrl=window.HPModelCustomerShare?.fromQuote(selection,window.HPModelCustomerShare.createReference(window));const frozen={...selection,pricePending:selection.price==null||selection.basePrice===null,customerUrl:customerUrl||'',version:'1386'};const drawing=capture(frozen);const r=Q.add(rows,{...frozen,image:''});changed();toast('已加入 1 件 · 购物车共 '+Q.summary(rows).quantity+' 件');const id=r.id;
    const job=drawing.then(result=>{const target=rows.find(r=>r.id===id),undone=undo?.find(r=>r.id===id);if(undone)Object.assign(undone,result);if(target){Object.assign(target,result);const card=[...cart.querySelectorAll('.hq-card')].find(c=>c.dataset.id===id);if(card&&target.image)card.querySelector('.hq-photo')?.replaceWith(el('img',{className:'hq-photo',src:target.image,alt:target.title}));persist();}}).catch(()=>toast('产品已加入，图片暂未加载')).finally(()=>pendingImages.delete(job));pendingImages.add(job);
  }
  bar.querySelector('#hq-add').onclick=()=>{try{addSelection(B.current());}catch(e){toast(e.message||'请先选好产品规格');}};
  document.addEventListener('click',e=>{const b=e.target.closest('[data-hq-choice]');if(!b)return;try{const title=B.chooseGallery(b.dataset.hqCatalog,b.dataset.hqChoice,Number(b.closest('.clearance-card')?.querySelector('[data-hq-variant]')?.value??-1));document.querySelectorAll('[data-hq-choice]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));toast('已选 '+title+'，点击下方加入购物车');}catch(error){toast(error.message);}});
  document.addEventListener('change',e=>{if(!e.target.matches('[data-hq-variant]'))return;const b=e.target.closest('.clearance-card').querySelector('[data-hq-choice]');if(b?.getAttribute('aria-pressed')==='true')try{B.chooseGallery(b.dataset.hqCatalog,b.dataset.hqChoice,Number(e.target.value));}catch(error){toast(error.message);}});
  bar.querySelector('#hq-open').onclick=()=>{render();cart.showModal();};
  async function copyText(){let value;try{value=Q.text(rows,new Date().toLocaleDateString('zh-CN'),outputOptions);}catch(error){toast(error.message);return;}const ok=await Q.copy(value,{writeText:navigator.clipboard?.writeText?.bind(navigator.clipboard),legacyCopy:t=>{const input=el('textarea',{value:t});input.style.cssText='position:fixed;top:0;left:0;width:1px;height:1px;opacity:.01';cart.append(input);input.focus();input.select();input.setSelectionRange(0,t.length);let success=false;try{success=document.execCommand('copy');}finally{input.remove();}return success;},manual:t=>{manual.querySelector('textarea').value=t;manual.showModal();manual.querySelector('textarea').focus();manual.querySelector('textarea').select();}});if(ok)toast('报价文字已复制');}
  cart.querySelector('#hq-copy-text').onclick=copyText;
  preview.addEventListener('click',e=>{if(!e.target.closest('[data-preview-customer-links]'))return;const choices=[...preview.querySelectorAll('[data-copy-customer-link]')];if(choices.length===1){choices[0].click();return;}preview.querySelector('.hq-direct-customer-links')?.scrollIntoView({block:'start'});toast(choices.length?'请选择对应组合的复制链接按钮':'当前产品没有组合链接');});
  function wrap(ctx,text,width){const lines=[];for(const part of String(text||'').split('\n')){let line='';for(const token of part.match(/[A-Za-z0-9][A-Za-z0-9.,\/_()+×-]*|[ \t]+|./gu)||[]){if(line&&ctx.measureText(line+token).width>width){lines.push(line.trimEnd());line='';}if(ctx.measureText(token).width>width){for(const char of token){if(line&&ctx.measureText(line+char).width>width){lines.push(line);line='';}line+=char;}}else line+=token;}lines.push(line);}return lines;}
  async function quoteImages(list,options={}){
    options=Q.normalizeOutputOptions(options);list=list.filter(r=>r.selected!==false);if(Q.summary(list).pending&&!options.hidePrice)throw Error('含待核价项目，核实前不能出具正式报价');await document.fonts.ready;
    const [logo,headerPhoto]=await Promise.all([loadImage('assets/brand/zolano-wordmark.png'),loadImage('assets/generated/zolano/recovered-d-drive/ZL3861-FIRENZE-original.jpg').catch(()=>null)]);
    const measure=canvas(1,1).getContext('2d');
    const imageX=52,imageW=400,middleX=472,contentRight=1028,contentW=556,columnW=266,discountX=762,photoH=240;
    const items=list.map(r=>{
      const d=Q.customerDisplay(r,options);measure.font='25px '+font;
      const detail=[...d.details,'数量：'+d.quantity].flatMap(t=>wrap(measure,t,contentW));
      measure.font='700 32px '+font;const title=wrap(measure,r.title,contentW);
      measure.font='18px '+font;const notes=wrap(measure,r.imageNote||'产品图片',imageW);
      const allLines=Q.priceLines([r],options,'line');
      const prices=allLines.filter(l=>l.kind==='original'||l.kind==='final').map(l=>({label:l.kind==='original'?'原价':'折后价',value:l.value,kind:l.kind}));
      const pending=allLines.filter(l=>l.kind==='pending');
      const priceRows=prices.map(line=>{measure.font=(line.kind==='final'?'700 30px ':'600 26px ')+font;return {line,amount:wrap(measure,line.value,columnW)};});
      measure.font='20px '+font;
      const pendingRows=pending.map(line=>({line,parts:wrap(measure,line.value,contentW)}));
      const titleHeight=title.length*44,detailHeight=detail.length*37;
      const priceHeight=priceRows.length?34+Math.max(...priceRows.map(row=>row.amount.length))*34:0;
      const pendingHeight=pendingRows.reduce((h,row)=>h+Math.max(26,row.parts.length*26),0);
      const textHeight=39+titleHeight+detailHeight+20+priceHeight+(pendingRows.length?18+pendingHeight:0);
      return {r,detail,title,notes,priceRows,pendingRows,height:Math.max(300,photoH+notes.length*24+28,textHeight)};
    });
    const groups=[];let group=[],height=0;
    for(const entry of items){if(group.length&&(height+entry.height>4000||group.length===8)){groups.push(group);group=[];height=0;}group.push(entry);height+=entry.height;}if(group.length)groups.push(group);
    const result=[],summary=Q.summary(list),date=new Date().toLocaleDateString('zh-CN');
    for(let index=0;index<groups.length;index++){
      const group=groups[index],last=index===groups.length-1;
      const footerLines=Q.priceLines(last?list:group.map(i=>i.r),options,last?'total':'page').filter(l=>l.kind==='original'||l.kind==='final'||l.kind==='pending').map(l=>l.kind==='original'?{...l,label:'原价合计'}:l.kind==='final'?{...l,label:'折后合计'}:l);
      const footerRows=footerLines.map(line=>{measure.font=(line.kind==='pending'?'22px ':line.kind==='final'?'700 38px ':'600 28px ')+font;return {line,parts:wrap(measure,line.value,line.kind==='pending'?976:476)};});
      const footerPrices=footerRows.filter(row=>row.line.kind!=='pending'),footerPending=footerRows.filter(row=>row.line.kind==='pending');
      const footerPairHeight=footerPrices.length?44+Math.max(...footerPrices.map(row=>row.parts.length))*38:0;
      const footerHeight=footerPairHeight+footerPending.reduce((h,row)=>h+Math.max(54,row.parts.length*28),0)+130;
      const body=group.reduce((h,item)=>h+item.height,0),c=canvas(1080,body+248+footerHeight),ctx=c.getContext('2d');
      ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='#10293e';ctx.fillRect(0,0,1080,216);
      // Crop the existing original sofa photograph; exclude its title and module diagrams.
      if(headerPhoto){ctx.save();ctx.globalAlpha=.38;ctx.drawImage(headerPhoto,60,260,800,320,490,0,590,216);ctx.restore();const shade=ctx.createLinearGradient(490,0,1080,0);shade.addColorStop(0,'rgba(16,41,62,1)');shade.addColorStop(.28,'rgba(16,41,62,.28)');shade.addColorStop(1,'rgba(16,41,62,.12)');ctx.fillStyle=shade;ctx.fillRect(490,0,590,216);}
      ctx.fillStyle='#b59a6a';ctx.fillRect(52,214,976,2);
      ctx.drawImage(logo,71,221,371,73,52,26,220,220*73/371);
      ctx.fillStyle='#d2dce6';ctx.font='600 18px '+font;ctx.textAlign='right';ctx.fillText('PRODUCT QUOTATION',contentRight,53);ctx.textAlign='left';
      ctx.fillStyle='#fff';ctx.font='700 48px '+font;ctx.fillText(options.hidePrice?'产品选款单':'产品报价单',52,127);
      ctx.font='23px '+font;ctx.fillStyle='#d1dce6';ctx.fillText(date+'  ·  '+summary.quantity+' 件  ·  '+(index+1)+' / '+groups.length,52,174);
      let y=248;
      for(const item of group){
        const {r,detail,title,notes,priceRows,pendingRows}=item;
        ctx.fillStyle='#f3f5f7';ctx.fillRect(imageX,y,imageW,photoH);
        if(r.image){try{const photo=await loadImage(r.image);fit(ctx,r.imageNote==='组合示意'?trimCanvas(photo):photo,imageX+8,y+8,imageW-16,photoH-16);}catch{}}
        ctx.fillStyle='#71808c';ctx.font='18px '+font;notes.forEach((line,i)=>ctx.fillText(line,imageX,y+photoH+24+i*24));
        let ty=y+39;ctx.fillStyle='#10293e';ctx.font='700 32px '+font;for(const line of title){ctx.fillText(line,middleX,ty);ty+=44;}
        ctx.font='25px '+font;ctx.fillStyle='#506170';for(const line of detail){ctx.fillText(line,middleX,ty);ty+=37;}
        let labelY=ty+20;
        if(priceRows.length){
          const amountLines=Math.max(...priceRows.map(row=>row.amount.length));
          ctx.font='25px '+font;ctx.fillStyle='#506170';ctx.textAlign='left';
          for(const row of priceRows){const x=row.line.kind==='final'?discountX:middleX;ctx.fillText(row.line.label,x,labelY);}
          const amountY=labelY+34;
          for(const row of priceRows){const x=row.line.kind==='final'?discountX:middleX;ctx.textAlign='right';ctx.fillStyle=row.line.kind==='final'?'#10293e':'#506170';ctx.font=(row.line.kind==='final'?'700 30px ':'600 26px ')+font;row.amount.forEach((part,i)=>ctx.fillText(part,x+columnW,amountY+i*34));}
          labelY=amountY+amountLines*34;
        }
        if(pendingRows.length){labelY+=18;ctx.textAlign='left';ctx.fillStyle='#985612';ctx.font='20px '+font;for(const row of pendingRows){row.parts.forEach((part,i)=>ctx.fillText(part,middleX,labelY+i*26));labelY+=Math.max(26,row.parts.length*26);}}
        ctx.textAlign='left';y+=item.height;ctx.strokeStyle='#e1e7ec';ctx.beginPath();ctx.moveTo(48,y);ctx.lineTo(1032,y);ctx.stroke();
      }
      y+=52;
      if(footerPrices.length){
        ctx.textAlign='left';ctx.fillStyle='#506170';ctx.font='25px '+font;
        for(const row of footerPrices){const x=row.line.kind==='final'?552:52;ctx.fillText(row.line.label,x,y);}
        const amountY=y+44;
        for(const row of footerPrices){const x=row.line.kind==='final'?552:52;ctx.textAlign='right';ctx.fillStyle='#10293e';ctx.font=(row.line.kind==='final'?'700 38px ':'600 28px ')+font;row.parts.forEach((part,i)=>ctx.fillText(part,x+476,amountY+i*38));}
        y+=footerPairHeight;
      }
      for(const row of footerPending){ctx.textAlign='left';ctx.fillStyle='#985612';ctx.font='22px '+font;row.parts.forEach((part,i)=>ctx.fillText(part,52,y+i*28));y+=Math.max(54,row.parts.length*28);}
      ctx.textAlign='left';ctx.font='20px '+font;ctx.fillStyle='#71808c';ctx.fillText(options.hideDetails?'以双方确认的产品为准。':'尺寸和配置以本报价单所列内容为准。',52,y+8);
      if(groups.length>1)ctx.fillText('本报价共 '+groups.length+' 张，请一起发送。',52,y+42);
      const blob=await new Promise((resolve,reject)=>c.toBlob(b=>b?resolve(b):reject(Error('图片生成失败')),'image/png'));
      result.push({blob,url:URL.createObjectURL(blob),name:'报价单-'+date.replaceAll('/','-')+'-'+(index+1)+'.png'});
    }
    return result;
  }

  cart.querySelector('#hq-preview').onclick=async()=>{const button=cart.querySelector('#hq-preview');button.disabled=true;button.textContent='正在生成图片…';const revision=previewGeneration;try{await Promise.all([...pendingImages]);if(revision!==previewGeneration)throw Error('购物车已更新，请重新预览');const list=rows.map(Q.snapshot);if(!list.length)return;if(Q.summary(list).pending&&!outputOptions.hidePrice)throw Error('含待核价项目，核实前不能出具正式报价');const fresh=await quoteImages(list,outputOptions);if(revision!==previewGeneration){fresh.forEach(p=>URL.revokeObjectURL(p.url));throw Error('购物车已更新，请重新预览');}pages.forEach(p=>URL.revokeObjectURL(p.url));pages=fresh;preview.querySelector('.hq-body').innerHTML=pages.map((p,i)=>`<section class="hq-page"><img src="${p.url}" alt="报价图片 ${i+1}，共 ${pages.length} 张"><div class="hq-page-controls"><button type="button" class="hq-button hq-primary" data-save-image="${i}">保存图片${pages.length>1?' '+(i+1):''}</button><button type="button" class="hq-button hq-primary" data-copy-image="${i}">复制图片</button><button type="button" class="hq-button hq-primary" data-preview-customer-links>复制链接</button><button type="button" data-share-image="${i}">分享图片</button></div></section>`).join('')+previewCustomerLinks(list);preview.showModal();}catch(e){toast(e.message||'图片未能生成，请稍后重试');}finally{button.disabled=!canExport();button.textContent='预览报价图片';}};
  function nativePhotoActions(){const cap=window.Capacitor;if(cap?.getPlatform?.()!=='android')return null;if(cap.Plugins?.PhotoActions)return cap.Plugins.PhotoActions;if(cap.isPluginAvailable?.('PhotoActions')&&cap.registerPlugin)return cap.registerPlugin('PhotoActions');const error=Error('Native photo actions require an updated APK');error.code='PHOTO_PLUGIN_UNAVAILABLE';throw error;}
  async function nativeImagePayload(page){const base64=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]);reader.onerror=()=>reject(Error('图片转换失败'));reader.readAsDataURL(page.blob);});return {base64,name:page.name,title:'产品报价单'};}
  preview.addEventListener('click',async e=>{const button=e.target.closest('button');if(!button)return;const copy=button.hasAttribute('data-copy-image'),share=button.hasAttribute('data-share-image'),save=button.hasAttribute('data-save-image');if(!copy&&!share&&!save)return;e.preventDefault();if(Q.summary(rows).pending&&!outputOptions.hidePrice){toast('含待核价项目，核实前不能出具正式报价');return;}if(button.disabled)return;const page=pages[Number(copy?button.dataset.copyImage:share?button.dataset.shareImage:button.dataset.saveImage)];if(!page)return;button.disabled=true;try{const native=nativePhotoActions();if(native){const method=copy?'copyImage':share?'shareImage':'saveImage';await native[method](await nativeImagePayload(page));toast(copy?'报价图片已复制':share?'已打开分享':'报价图片已保存');}else if(save){const link=document.createElement('a');link.href=page.url;link.download=page.name;link.rel='noopener';document.body.append(link);link.click();link.remove();toast('已开始下载');}else if(copy){if(!navigator.clipboard?.write||!window.ClipboardItem)throw Error('unsupported');await navigator.clipboard.write([new ClipboardItem({'image/png':page.blob})]);toast('报价图片已复制');}else{const file=new File([page.blob],page.name,{type:'image/png'});if(!navigator.canShare?.({files:[file]}))throw Error('unsupported');await navigator.share({files:[file],title:'产品报价单'});toast('已打开分享');}}catch(error){if(error.name==='AbortError'||error.code==='CANCELLED'||error.code==='CANCELED')return;if(error.code==='PHOTO_PLUGIN_UNAVAILABLE')toast('请安装新版 App 后使用图片功能');else toast(copy?'无法直接复制图片，请保存图片或长按图片复制。':share?'此设备暂不支持直接分享，请先保存图片。':'图片保存未完成，请重试');}finally{button.disabled=false;}});
  restore();
})();
