/* 3861 adapter: existing catalog/slot state, 3776-style controls, original photos. */
(function () {
  "use strict";
  const api = window.HP_ZOLANO_3861_LAYOUT;
  if (!api || typeof syncZolanoModulePicker !== "function") return;
  const MATERIALS = ["FSA", "MF", "NUBUCK"];
  const LABELS = { FSA: "F/SA 皮质", MF: "M/F 布艺", NUBUCK: "NuBuck" };
  const INDEX = { MF: 0, FSA: 1, NUBUCK: 2 };
  const cache = new Map();
  const cutouts = new WeakMap();
  const wedgeRenders = new WeakMap();
  let angleDeg = api.ZL3861_ESTIMATED_ANGLE_DEG, angleEdited = false;
  const previewSize = value => Math.ceil(value / 10) * 10;
  // Explicit paths keep every material preview visible to release validation.
  const MATERIAL_PHOTOS = {
  "1ER": {
    "FSA": "assets/generated/zolano/3861-rounded-r7/1ERC-FSA.webp",
    "MF": "assets/generated/zolano/3861-rounded-r7/1ERC-MF.webp",
    "NUBUCK": "assets/generated/zolano/3861-rounded-r7/1ERC-NUBUCK.webp"
  },
  "1NA": {
    "FSA": "assets/generated/zolano/3861-rounded-r7/1NA-FSA.webp",
    "MF": "assets/generated/zolano/3861-rounded-r7/1NA-MF.webp",
    "NUBUCK": "assets/generated/zolano/3861-rounded-r7/1NA-NUBUCK.webp"
  },
  "1EL": {
    "MF": "assets/generated/zolano/3861-materials-r1/1EL-MF.webp",
    "NUBUCK": "assets/generated/zolano/3861-materials-r1/1EL-NUBUCK.webp",
    "FSA": "assets/generated/zolano/verified-module-crops/3861/1EL-top.png"
  },
  "TABLE": {
    "MF": "assets/generated/zolano/3861-materials-r1/TABLE-MF.webp",
    "NUBUCK": "assets/generated/zolano/3861-materials-r1/TABLE-NUBUCK.webp",
    "FSA": "assets/generated/zolano/verified-module-crops/3861/TABLE-top.png"
  }
};
  function materialPhoto(kind, key) {
    return MATERIAL_PHOTOS[kind]?.[key] || "";
  }
  let tableStandardCount = 0;
  let previousIds = [], materials = [], placements = [], motorCount = 0, selectedIndex = -1, defaultMaterial = "FSA", busy = false, activeBefore = false;
  const escape = value => escapeHtml(String(value ?? ""));
  const displayConfiguration = value => String(value ?? "").replace(/R\/DPU|R\/DP|R\/PU/g, "R/SB");
  const active = () => ["zolano", "zolanoFull", "reclinerSofa"].includes(activeCatalogKey) && getActiveZolanoModuleSeries() === "3861";
  const modules = () => window.zolano3861Modules || [];
  const selected = () => [...slotGrid.querySelectorAll(".slot-select")]
    .map(node => node.value).filter(Boolean).map(id => getActiveManualModuleItem(id)).filter(Boolean);

  function motorCapacity(items) { return items.filter(item => ["1EL","1ER"].includes(api.getZl3861ModuleKind(item))).length; }

  function reconcile(items) {
    const queues = new Map();
    previousIds.forEach((id, index) => {
      if (!queues.has(id)) queues.set(id, []);
      queues.get(id).push({material:materials[index] || defaultMaterial,placement:placements[index] || {rotationDeg:0,flipX:false}});
    });
    const oldSelectedId=selectedIndex>=0?previousIds[selectedIndex]:null;
    const oldSelectedOccurrence=oldSelectedId?previousIds.slice(0,selectedIndex+1).filter(id=>id===oldSelectedId).length:0;
    const seen=new Map();
    const restored=items.map((item,index)=>{
      const value=queues.get(item.id)?.shift();
      const count=(seen.get(item.id)||0)+1;seen.set(item.id,count);
      if(item.id===oldSelectedId && count===oldSelectedOccurrence)selectedIndex=index;
      return value || {material:defaultMaterial,placement:{rotationDeg:0,flipX:false}};
    });
    if(oldSelectedId && !restored.some((value,index)=>items[index].id===oldSelectedId))selectedIndex=-1;
    materials=restored.map(value=>value.material);
    placements=restored.map(value=>value.placement);
    if (materials.length && materials.every(key => key === materials[0])) defaultMaterial = materials[0];
    previousIds = items.map(item => item.id);
    pieceMaterialSelections = Object.fromEntries(materials.map((key, index) => [index, INDEX[key]]));
    if (materialSelect) materialSelect.value = String(INDEX[defaultMaterial]);
  }

  function update(ids, keys, nextPlacements) {
    if (ids.length > 10) return;
    busy = true;
    try {
      ids.forEach(id => getActiveManualModuleItem(id));
      setBuilderSelections(ids);
      previousIds = ids.slice();
      materials = keys.slice();
      placements = nextPlacements.map(value=>({...value}));
      pieceMaterialSelections = Object.fromEntries(keys.map((key, i) => [i, INDEX[key]]));
    } finally { busy = false; }
    paint();
  }

  function add(id) {
    const items = selected();
    if (items.length + tableStandardCount >= 10 || !modules().some(module => module.id === id)) return;
    const ids=items.map(item=>item.id),keys=materials.slice(),states=placements.map(value=>({...value}));
    const kind=api.getZl3861ModuleKind(modules().find(module=>module.id===id));
    const end=items.findIndex(item=>api.getZl3861ModuleKind(item)==="1ER");
    const at=kind==="1EL"?0:kind!=="1ER"&&end>=0?end:items.length;
    ids.splice(at,0,id);keys.splice(at,0,defaultMaterial);states.splice(at,0,{rotationDeg:0,flipX:false});update(ids,keys,states);selectedIndex=at;paint();
  }
  function remove(index) {
    const ids = selected().map(item => item.id), keys = materials.slice(),states=placements.map(value=>({...value}));
    if (!Number.isInteger(index) || index < 0 || index >= ids.length) return;
    ids.splice(index, 1); keys.splice(index, 1);states.splice(index,1);update(ids, keys,states);
    if(selectedIndex===index)selectedIndex=-1;else if(selectedIndex>index)selectedIndex--;paint();
  }
  function move(from, to) {
    const ids = selected().map(item => item.id), keys = materials.slice(),states=placements.map(value=>({...value}));
    if (from === to || from < 0 || to < 0 || from >= ids.length || to >= ids.length) return;
    ids.splice(to, 0, ids.splice(from, 1)[0]);
    keys.splice(to, 0, keys.splice(from, 1)[0]);
    states.splice(to,0,states.splice(from,1)[0]);update(ids,keys,states);
    if(selectedIndex===from)selectedIndex=to;else if(from<selectedIndex && to>=selectedIndex)selectedIndex--;else if(from>selectedIndex && to<=selectedIndex)selectedIndex++;paint();
  }
  function selectPiece(index) {
    if(!Number.isInteger(index) || index<0 || index>=placements.length)return;
    selectedIndex=index;
    paint();
  }
  function rotateSelected(){if(selectedIndex<0)return;placements[selectedIndex].rotationDeg=(placements[selectedIndex].rotationDeg+90)%360;paint();}
  function mirrorSelected(){if(selectedIndex<0)return;placements[selectedIndex].flipX=!placements[selectedIndex].flipX;paint();}
  function resetSelected(){if(selectedIndex<0)return;placements[selectedIndex]={rotationDeg:0,flipX:false};paint();}

  function card(module, count, total) {
    const kind = api.getZl3861ModuleKind(module);
    const unit = window.HP_ZOLANO_3861_PRICING?.unitPrice(kind, defaultMaterial);
    const basePrice = unit?.retail != null ? `${money.format(unit.retail)} 售价` : "待核价";
    const priceNote = unit?.retail == null ? " · 材质待确认"
      : unit?.motorIncluded ? " · 含R/SB电动" : "";
    return `<article class="module-picker-button${count ? " is-active" : ""}" data-module-card-id="${escape(module.id)}">
      ${count ? '<span class="module-picker-added-badge">已加入组合</span>' : ""}
      <button class="module-picker-add-zone" type="button" data-zl3861-add="${escape(module.id)}" aria-label="${escape(module.label)} +1" ${total >= 10 ? "disabled" : ""}>
        <span class="module-picker-image"><img src="${escape(materialPhoto(api.getZl3861ModuleKind(module),defaultMaterial))}" alt="${escape(module.label)}" draggable="false" loading="eager" data-module-preview="3861"></span>
        <strong>${escape(kind==="TABLE"?"TABLE B":displayConfiguration(module.label))}</strong><small class="module-picker-price" data-zl3861-unit-price="${escape(kind)}">${escape(basePrice + priceNote)}</small></button>
      <div class="module-picker-quantity-control">
        <button class="module-picker-step module-picker-minus" type="button" data-zl3861-minus="${escape(module.id)}" aria-label="减少 ${escape(module.label)}" ${count ? "" : "disabled"}>−</button>
        <output class="module-picker-quantity-value" aria-live="polite">${count}</output>
        <button class="module-picker-step module-picker-plus" type="button" data-zl3861-add="${escape(module.id)}" aria-label="增加 ${escape(module.label)}" ${total >= 10 ? "disabled" : ""}>+</button>
      </div></article>`;
  }

  function standardTableCard(items) {
    const unit=window.HP_ZOLANO_3861_PRICING?.unitPrice("TABLE_STANDARD",defaultMaterial);
    const price=unit?.retail == null ? "待核价" : money.format(unit.retail)+" 售价";
    return `<article class="module-picker-button" data-zl3861-accessory="TABLE_STANDARD">
      <span class="module-picker-image" style="display:grid;place-content:center;text-align:center;font-size:12px">3821 TABLE<br>独立配件<br>尺寸待确认</span>
      <strong>TABLE（普通款）</strong><small class="module-picker-price">${escape(price)}</small>
      <div class="module-picker-quantity-control"><button type="button" data-zl3861-table-minus ${tableStandardCount?"":"disabled"} aria-label="减少普通 TABLE">−</button><output data-zl3861-table-count>${tableStandardCount}</output><button type="button" data-zl3861-table-add ${items.length && items.length+tableStandardCount<10?"":"disabled"} aria-label="增加普通 TABLE">+</button></div>
      <small>加入组合报价，单独摆放</small></article>`;
  }

  function settings(items) {
    return `<div class="zl3861-materials" aria-label="材质设置">${MATERIALS.map(key =>
      `<button type="button" data-zl3861-global-material="${key}" aria-pressed="${materials.every(k => k === key) && defaultMaterial === key}">${LABELS[key]}</button>`).join("")}</div>
      <div class="zl3861-motors" aria-label="电动功能设置"><strong>电动功能 ¥2,600/个</strong><button type="button" data-zl3861-motor-minus aria-label="减少电动功能" ${motorCount===0?"disabled":""}>−</button><output data-zl3861-motor-count>${motorCount}</output><button type="button" data-zl3861-motor-add aria-label="增加电动功能" ${motorCount>=motorCapacity(items)?"disabled":""}>＋</button><span data-zl3861-motor-subtotal>小计 ¥${motorCount*2600}</span></div>
      <details class="zl3861-settings"><summary>模块设置 · ${items.length} 件</summary>
        ${items.map((item, i) => `<div class="zl3861-setting-row">
          <span>${i + 1}. ${escape(api.getZl3861ModuleKind(item)==="TABLE"?"TABLE B":displayConfiguration(item.configuration))}<small>${escape(api.formatZl3861PieceDimension(api.getZl3861ModuleKind(item)))}</small></span>
          <select aria-label="第${i + 1}件材质" data-zl3861-material-slot="${i}">${MATERIALS.map(key => `<option value="${key}" ${materials[i] === key ? "selected" : ""}>${LABELS[key]}</option>`).join("")}</select>
          <button type="button" data-zl3861-move-left="${i}" aria-label="第${i + 1}件前移" ${i ? "" : "disabled"}>←</button>
          <button type="button" data-zl3861-move-right="${i}" aria-label="第${i + 1}件后移" ${i < items.length - 1 ? "" : "disabled"}>→</button>
          <button type="button" data-zl3861-remove-slot="${i}" aria-label="移除第${i + 1}件">×</button>
        </div>`).join("")}</details>`;
  }

  function quoteDetails(items) {
    return window.HP_ZOLANO_3861_PRICING?.quote(items.map((item,i)=>({
      kind: api.getZl3861ModuleKind(item), material: materials[i]
    })).concat(Array.from({length:tableStandardCount},()=>({kind:"TABLE_STANDARD",material:defaultMaterial}))), selectedDiscountRate, motorCount) || null;
  }
  function quote(items) {
    const result=quoteDetails(items);
    return result && !result.unknownMaterialPending && result.total != null ? money.format(result.total) : "待核价";
  }
  function quoteSummary(items) {
    const result=quoteDetails(items);
    const amount=value=>result && Number.isFinite(value)?money.format(value):"待核价";
    const unknownPending=Boolean(result?.unknownMaterialPending);
    const label=selectedDiscountRate===1?"原价":String(Math.round(selectedDiscountRate*100)/10)+"折";
    return '<div class="zl3861-price-summary">' +
      '<span>组合原价</span><strong data-zl3861-original>'+amount(result?.original)+'</strong>' +
      '<span>所选折扣</span><span>'+escape(label)+'</span>' +
      '<strong>'+(unknownPending?'待核价':'折后价')+'</strong><strong data-zl3861-price>'+(unknownPending?'待核价':amount(result?.total))+'</strong>' +
      '<span>'+(unknownPending?'材质':'优惠')+'</span><span data-zl3861-savings>'+(unknownPending?'待核':amount(result?.savings))+'</span></div>' +
      '';
  }

  function preview(items, layout) {
    const title = '<div class="zl3776-live-preview-heading"><strong>组合预览</strong></div>';
    if (!items.length) return `<section class="zl3776-live-preview is-empty" data-zl3861-composer>${title}<p>点上方卡片或 + 加入模块，即时拼接组合。最多10件。</p><div class="zl3861-motors" aria-label="电动功能设置"><strong>电动功能 ¥2,600/个</strong><button type="button" data-zl3861-motor-minus disabled aria-label="减少电动功能">−</button><output data-zl3861-motor-count>0</output><button type="button" data-zl3861-motor-add disabled aria-label="增加电动功能">＋</button><span data-zl3861-motor-subtotal>小计 ¥0</span></div></section>`;
    return `<section class="zl3776-live-preview" data-zl3861-composer>${title}
      <div class="zl3861-stage"><canvas width="1200" height="600" data-zl3861-canvas aria-label="3861拼接组合"></canvas>
        <div class="zl3861-hotspots">${layout.pieces.map((piece, i) => `<div class="zl3861-piece${selectedIndex===i?" is-selected":""}" data-zl3861-piece="${i}" data-zl3861-kind="${piece.kind}" data-zl3861-material="${materials[i]}" data-zl3861-rotation="${piece.rotationDeg}" data-zl3861-flip-x="${piece.flipX}" data-zl3861-src="${materialPhoto(piece.kind,materials[i])}" role="button" aria-pressed="${selectedIndex===i}" tabindex="0" aria-label="${escape(items[i].configuration)}，${LABELS[materials[i]]}"><span>${escape(piece.kind)} · ${materials[i]}</span></div>`).join("")}</div>
      </div>${selectedIndex>=0?`<div class="zl3861-placement-toolbar" role="toolbar" aria-label="模块摆放设置"><strong>已选 ${selectedIndex+1}</strong><button type="button" data-zl3861-rotate aria-label="旋转90°">旋转90°</button><button type="button" data-zl3861-mirror aria-label="左右翻转">左右翻转</button><button type="button" data-zl3861-placement-reset>恢复摆放</button></div>`:""}${settings(items)}
      ${layout.turned ? `<div class="zl3861-angle-settings"><label>斜边转向角 <input data-zl3861-angle type="number" min="0" max="55" step="0.5" value="${angleDeg}" aria-label="斜边转向角">°</label>
        <span>${angleEdited ? "按输入角度估算" : `${api.ZL3861_ESTIMATED_ANGLE_DEG}°按所选工厂图推算，非标注角度`}</span><button type="button" data-zl3861-angle-reset>恢复工厂图角度</button></div>` : ""}
      <div class="zl3861-facts">${quoteSummary(items)}${tableStandardCount?`<p data-zl3861-accessory-note>另含 3821 TABLE 普通款 × ${tableStandardCount}；独立配件，尺寸待确认。</p>`:""}
        <p data-zl3861-size data-width-mm="${layout.widthMm}" data-depth-mm="${layout.depthMm}">转向后外框约 ${previewSize(layout.widthMm)} × ${previewSize(layout.depthMm)} mm · 高${layout.heightMm}mm</p>
        ${layout.turned ? `<p data-zl3861-angle-label>每处斜接转向 ${angleDeg}° · 内夹角 ${180-angleDeg}°</p>` : ""}
        <div class="zl3861-discounts" aria-label="折扣设置">${[[1,"原价"],[.88,"88折"],[.85,"85折"],[.83,"83折"],[.8,"8折"],[.75,"75折"],[.73,"73折"],[.7,"7折"]].map(([rate,label])=>`<button type="button" data-zl3861-discount="${rate}" aria-pressed="${selectedDiscountRate === rate}">${label}</button>`).join("")}</div>
      </div></section>`;
  }

  function loadImage(src) {
    if (!cache.has(src)) cache.set(src, new Promise((resolve, reject) => {
      const image = new Image(); image.onload = () => resolve(image); image.onerror = () => reject(new Error("3861图片加载失败")); image.src = src;
    }));
    return cache.get(src);
  }
  function cutout(image) {
    if (cutouts.has(image)) return cutouts.get(image);
    const source=document.createElement("canvas");source.width=image.naturalWidth;source.height=image.naturalHeight;
    const ctx=source.getContext("2d",{willReadFrequently:true});ctx.drawImage(image,0,0);
    let pixels;
    try {
      pixels = ctx.getImageData(0,0,source.width,source.height);
    } catch {
      // Local file previews can taint a canvas even when the production site
      // is same-origin. Keep the verified photo intact instead of breaking
      // the whole 3861 preview when pixel inspection is unavailable.
      cutouts.set(image, image);
      return image;
    }
    const data=pixels.data,rows=[];
    const fabric=/-MF\.(?:png|webp)(?:$|[?#])/i.test(image.src);
    let minX=source.width,maxX=-1,minY=source.height,maxY=-1;
    for(let y=0;y<source.height;y++) {
      let left=source.width,right=-1;
      for(let x=0;x<source.width;x++) {
        const i=(y*source.width+x)*4,r=data[i],g=data[i+1],b=data[i+2];
        const body=data[i+3]>100 && (fabric?(r+g+b)/3<185:r-b>18 && r-g>3 && (r+g+b)/3<244);
        if(body){left=Math.min(left,x);right=x;}
      }
      rows.push([left,right]);
      if(right>=left){minX=Math.min(minX,left);maxX=Math.max(maxX,right);minY=Math.min(minY,y);maxY=Math.max(maxY,y);}
    }
    if(maxX<minX) return image;
    // Remove only background outside each scanline's body; preserve chrome cups
    // and seams inside it. Crop against upholstery, not the grey floor shadow.
    for(let y=0;y<source.height;y++) for(let x=0;x<source.width;x++) {
      if(x<rows[y][0] || x>rows[y][1]) data[(y*source.width+x)*4+3]=0;
    }
    ctx.putImageData(pixels,0,0);
    const canvas=document.createElement("canvas");canvas.width=maxX-minX+1;canvas.height=maxY-minY+1;
    canvas.getContext("2d").drawImage(source,minX,minY,canvas.width,canvas.height,0,0,canvas.width,canvas.height);
    cutouts.set(image,canvas);return canvas;
  }
  function wedgeImage(image, piece) {
    const source=cutout(image);
    if (!source.getContext) return source;
    const key=piece.polygon[3].x+":"+piece.polygon[4].y;
    if (!wedgeRenders.has(image)) wedgeRenders.set(image,new Map());
    const renders=wedgeRenders.get(image);
    if (renders.has(key)) return renders.get(key);
    const w=source.width,h=source.height,data=source.getContext("2d").getImageData(0,0,w,h).data;
    // Fit the source photo's straight lower edge, excluding its rounded corners
    // and headrest. Remap the complete texture; never cut a new polygon into it.
    let n=0,sx=0,sy=0,sxy=0,syy=0;
    for(let y=Math.ceil(h*.4);y<h*.85;y++){
      let x=0;while(x<w && data[(y*w+x)*4+3]<100)x++;
      if(x===w)continue;n++;sx+=x;sy+=y;sxy+=x*y;syy+=y*y;
    }
    if(n<2)return source;
    const slope=(n*sxy-sx*sy)/(n*syy-sy*sy),intercept=(sx-slope*sy)/n;
    const canvas=document.createElement("canvas");canvas.width=w;canvas.height=h;
    const ctx=canvas.getContext("2d"),shoulder=piece.polygon[4].y;
    for(let y=0;y<h;y++){
      const oldLeft=Math.max(0,Math.min(w*.8,slope*y+intercept));
      const newLeft=Math.max(0,(y/h*piece.depthMm-shoulder)/(piece.depthMm-shoulder))*piece.polygon[3].x/piece.widthMm*w;
      const scale=(w-newLeft)/(w-oldLeft);
      ctx.drawImage(source,0,y,w,1,newLeft-oldLeft*scale,y,w*scale,1);
    }
    renders.set(key,canvas);return canvas;
  }
  async function draw(canvas, layout) {
    canvas.dataset.renderComplete = "false";
    try {
      const images = await Promise.all(layout.pieces.map((piece,i) => loadImage(materialPhoto(piece.kind,materials[i]))));
      if (!canvas.isConnected) return;
      const context = canvas.getContext("2d");
      const scale = Math.min(1010 / layout.widthMm, 430 / layout.depthMm);
      const ox = (1120 - layout.widthMm * scale) / 2, oy = (530 - layout.depthMm * scale) / 2;
      context.clearRect(0, 0, 1200, 600);
      layout.pieces.forEach((piece, index) => {
        const image = piece.kind==="1ER" ? wedgeImage(images[index],piece) : cutout(images[index]);
        const x = ox + piece.centerMm.x * scale, y = oy + piece.centerMm.y * scale;
        const w = piece.widthMm * scale, h = piece.depthMm * scale;
        const edited=piece.placementRotationDeg!==0 || piece.flipX;
        const seamBleed = index > 0 && !edited ? 24 * scale : 0;
        context.save();context.translate(x,y);context.rotate(piece.rotationDeg*Math.PI/180);context.scale(piece.flipX?-1:1,1);
        if(edited){context.beginPath();piece.polygon.forEach((point,i)=>{const px=(point.x-piece.widthMm/2)*scale,py=(point.y-piece.depthMm/2)*scale;i?context.lineTo(px,py):context.moveTo(px,py);});context.closePath();context.clip();}
        context.drawImage(image,-w/2-seamBleed,-h/2,w+seamBleed,h);context.restore();
        const hit = canvas.parentElement.querySelector(`[data-zl3861-piece="${index}"]`);
        Object.assign(hit.style, {left: `${(x-w/2)/12}%`, top:`${(y-h/2)/6}%`,width:`${w/12}%`,height:`${h/6}%`,rotate:`${piece.rotationDeg}deg`,scale:piece.flipX?"-1 1":"1 1",transformOrigin:"50% 50%",
          clipPath:`polygon(${piece.polygon.map(p=>`${100*p.x/piece.widthMm}% ${100*p.y/piece.depthMm}%`).join(",")})`});
      });
      const right=ox+layout.widthMm*scale,bottom=oy+layout.depthMm*scale;
      context.save();context.strokeStyle="#14756d";context.fillStyle="#23574e";context.lineWidth=2;context.font="bold 27px sans-serif";context.textAlign="center";
      context.beginPath();context.moveTo(ox,bottom+26);context.lineTo(right,bottom+26);context.moveTo(ox,bottom+18);context.lineTo(ox,bottom+34);context.moveTo(right,bottom+18);context.lineTo(right,bottom+34);context.stroke();
      context.fillText(`宽约 ${previewSize(layout.widthMm)} mm`,(ox+right)/2,bottom+60);
      context.translate(right+34,(oy+bottom)/2);context.rotate(Math.PI/2);context.fillText(`进深约 ${previewSize(layout.depthMm)} mm`,0,0);context.restore();
      canvas.dataset.renderComplete = "true";
    } catch (error) {
      if (!canvas.isConnected) return;
      canvas.dataset.renderError = "true";
      const message = document.createElement("p"); message.className = "zl3861-note"; message.textContent = "图片未能加载，请刷新重试。";
      canvas.parentElement.append(message);
      console.error(error);
    }
  }

  function bind() {
    const root = zolanoModulePicker;
    const each = (selector, fn) => root.querySelectorAll(selector).forEach(fn);
    each("[data-zl3861-angle]", input=>input.addEventListener("change",()=>{
      const value=Number(input.value);
      if(input.value.trim()==="" || !Number.isFinite(value) || value<0 || value>55){input.value=String(angleDeg);return;}
      angleDeg=value;angleEdited=true;paint();
    }));
    each("[data-zl3861-angle-reset]", button=>button.addEventListener("click",()=>{angleDeg=api.ZL3861_ESTIMATED_ANGLE_DEG;angleEdited=false;paint();}));
    each("[data-zl3861-rotate]",button=>button.addEventListener("click",rotateSelected));
    each("[data-zl3861-mirror]",button=>button.addEventListener("click",mirrorSelected));
    each("[data-zl3861-placement-reset]",button=>button.addEventListener("click",resetSelected));
    each("[data-zl3861-add]", button => button.addEventListener("click", () => add(button.dataset.zl3861Add)));
    each("[data-zl3861-add] .module-picker-image", image => image.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      const button = image.closest("[data-zl3861-add]");
      if (button && !button.disabled) add(button.dataset.zl3861Add);
    }));
    each("[data-zl3861-minus]", button => button.addEventListener("click", () => remove(selected().findIndex(item => item.id === button.dataset.zl3861Minus))));
    each("[data-zl3861-remove-slot]", button => button.addEventListener("click", () => remove(Number(button.dataset.zl3861RemoveSlot))));
    each("[data-zl3861-move-left]", button => button.addEventListener("click", () => move(Number(button.dataset.zl3861MoveLeft), Number(button.dataset.zl3861MoveLeft)-1)));
    each("[data-zl3861-move-right]", button => button.addEventListener("click", () => move(Number(button.dataset.zl3861MoveRight), Number(button.dataset.zl3861MoveRight)+1)));
    each("[data-zl3861-global-material]", button => button.addEventListener("click", () => {
      defaultMaterial = button.dataset.zl3861GlobalMaterial; materials.fill(defaultMaterial); paint();
    }));
    each("[data-zl3861-material-slot]", select => select.addEventListener("change", () => {
      materials[Number(select.dataset.zl3861MaterialSlot)] = select.value; paint(true);
    }));
    each("[data-zl3861-table-add]", button => button.addEventListener("click", () => { if(selected().length+tableStandardCount<10){tableStandardCount++;paint();} }));
    each("[data-zl3861-table-minus]", button => button.addEventListener("click", () => { tableStandardCount=Math.max(0,tableStandardCount-1);paint(); }));
    each("[data-zl3861-motor-add]", button => button.addEventListener("click", () => { if(motorCount<motorCapacity(selected())) { motorCount++; paint(true); } }));
    each("[data-zl3861-motor-minus]", button => button.addEventListener("click", () => { motorCount=Math.max(0, motorCount-1); paint(true); }));
    each("[data-zl3861-discount]", button => button.addEventListener("click", () => {
      selectedDiscountRate = Number(button.dataset.zl3861Discount); paint();
    }));
    each("[data-zl3861-piece]", piece => {
      const index = Number(piece.dataset.zl3861Piece); let pointer = null;
      piece.addEventListener("pointerdown", event => {
        if (event.button !== 0) return;
        pointer = {id:event.pointerId,x:event.clientX,y:event.clientY}; piece.setPointerCapture(event.pointerId);
      });
      piece.addEventListener("pointermove", event => {
        if (!pointer || event.pointerId !== pointer.id) return;
        const dx=event.clientX-pointer.x,dy=event.clientY-pointer.y;
        if (Math.hypot(dx,dy)>8) {piece.classList.add("is-moving"); piece.style.transform=`translate(${dx}px,${dy}px)`;}
      });
      piece.addEventListener("pointerup", event => {
        if (!pointer || event.pointerId !== pointer.id) return;
        const distance=Math.hypot(event.clientX-pointer.x,event.clientY-pointer.y); pointer=null;
        piece.releasePointerCapture(event.pointerId); piece.style.transform=""; piece.classList.remove("is-moving");
        if (distance<=8) {selectPiece(index);return;}
        const rect=piece.closest(".zl3861-stage").getBoundingClientRect();
        if (event.clientX<rect.left-20 || event.clientX>rect.right+20 || event.clientY<rect.top-20 || event.clientY>rect.bottom+20) {remove(index);return;}
        piece.style.pointerEvents="none";
        const target=document.elementFromPoint(event.clientX,event.clientY)?.closest("[data-zl3861-piece]");
        piece.style.pointerEvents="";
        if (target) move(index, Number(target.dataset.zl3861Piece));
      });
      piece.addEventListener("pointercancel", () => {pointer=null;piece.style.transform="";piece.classList.remove("is-moving");});
      piece.addEventListener("keydown", event => {
        if (!["Enter"," ","ArrowLeft","ArrowRight","Delete","Backspace"].includes(event.key)) return;
        event.preventDefault();
        if (event.key==="Enter" || event.key===" ") selectPiece(index);
        else if (event.key==="ArrowLeft") move(index,index-1);
        else if (event.key==="ArrowRight") move(index,index+1);
        else remove(index);
      });
    });
  }

  function paint(openSettings) {
    if (busy || !zolanoModulePicker) return;
    const isActive = active();
    document.body.classList.toggle("is-zl3861-composer", isActive);
    if (!isActive) {activeBefore=false;return;}
    const items = selected();
    motorCount=Math.min(Number.isSafeInteger(motorCount)&&motorCount>=0?motorCount:0,motorCapacity(items));
    if (!items.length) {motorCount=0;tableStandardCount=0;}
    if (!activeBefore && !items.length) {previousIds=[];materials=[];placements=[];defaultMaterial="FSA";}
    activeBefore=true;
    reconcile(items);
    const expanded = Boolean(openSettings || zolanoModulePicker.querySelector(".zl3861-settings")?.open);
    const renderKey=JSON.stringify([items.map(item=>[item.id,item.price,item.priceOptions,item.pricePending,item.priceIsFinal]),materials,motorCount,tableStandardCount,placements,selectedIndex,defaultMaterial,selectedDiscountRate,angleDeg,angleEdited,expanded]);
    if(zolanoModulePicker.dataset.zl3861RenderKey===renderKey && zolanoModulePicker.querySelector("[data-zl3861-composer]")) return;
    zolanoModulePicker.dataset.zl3861RenderKey=renderKey;
    const baseLayout = api.buildZl3861PreviewPieces(items,{angleDeg});
    const layout = window.HP_ZOLANO_3861_PLACEMENT.buildZl3861PlacedPreview(baseLayout,placements);
    zolanoModulePicker.hidden=false;
    zolanoModulePicker.innerHTML=`<div class="module-picker-heading"><strong>3861 模块</strong></div>
      <div class="module-picker-grid is-zl3861-four">${modules().map(module=>card(module,items.filter(item=>item.id===module.id).length,items.length+tableStandardCount)).join("")}${standardTableCard(items)}</div>${preview(items,layout)}`;
    if (expanded && items.length) zolanoModulePicker.querySelector(".zl3861-settings").open=true;
    if (setTotal) setTotal.textContent=items.length?quote(items):"—";
    bind();
    const canvas=zolanoModulePicker.querySelector("[data-zl3861-canvas]");
    if(canvas) draw(canvas,layout);
  }

  const oldSync = syncZolanoModulePicker;
  syncZolanoModulePicker = function () {
    if (active()) {paint();return;}
    document.body.classList.remove("is-zl3861-composer"); activeBefore=false;
    return oldSync.apply(this, arguments);
  };
  const oldPreview = renderSetPreview;
  renderSetPreview = function () {
    if(active()) {paint();return;}
    document.body.classList.remove("is-zl3861-composer"); activeBefore=false;
    return oldPreview.apply(this, arguments);
  };
  window.paintZl3861Composer=paint;
  window.HP_ZOLANO_3861_COMPOSER={getState:()=>({angleDeg,ids:previousIds.slice(),materials:materials.slice(),motorCount,tableStandardCount,defaultMaterial,placements:placements.map(value=>({...value})),selectedIndex,discountRate:selectedDiscountRate})};
  function boot() {
    if (new URLSearchParams(location.search).get("model") === "3861" && typeof openZl3861 === "function") openZl3861();
    paint();
  }
  if (document.readyState==="loading") document.addEventListener("DOMContentLoaded",boot); else boot();
})();
