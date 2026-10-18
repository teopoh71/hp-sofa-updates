/* Figaro source-backed selection. Whole-set quotes never split into module prices. */
(function () {
"use strict";
// Inferred whole-unit previews from the verified FG3135 workbook photograph.
window.FIGARO_MODULE_PREVIEWS=window.FIGARO_MODULE_PREVIEWS||{};
// FG3132 generated structural illustrations from its verified product photo; no measured dimensions inferred.
window.FIGARO_MODULE_PREVIEWS["FG 3132"]=Object.fromEntries(Object.entries({"2EL":[20,20,1110,690],"1NA/T":[1200,20,930,690]}).map(([configuration,crop])=>[configuration,{image:"assets/generated/figaro/FG3132-modules-v1268.webp",crop,width:2145,height:733,status:"generated-product-preview"}]));
window.FIGARO_MODULE_PREVIEWS["FG 3135"]=Object.fromEntries(Object.entries({"4S":[20,70,820,390],"3S":[850,70,665,390],"2S":[80,540,690,405],"1S":[920,540,515,405]}).map(([configuration,crop])=>[configuration,{image:"assets/generated/figaro/FG3135-modules-v1267.webp",crop,status:"generated-product-preview"}]));
window.FIGARO_MODULE_PREVIEWS["FG 3133"]=Object.fromEntries(Object.entries({"2EL":[20,110,800,590],"1NA":[850,110,410,590],"1ER/T":[1310,110,695,590]}).map(([configuration,crop])=>[configuration,{image:"assets/generated/figaro/FG3133-modules-v1267.webp",crop,width:2027,height:776,status:"generated-product-preview"}]));
window.FIGARO_TOP_V1267={image:"assets/generated/figaro/FG3133-top-v1267.webp",width:1774,height:887,parts:{"2EL":{crop:[72,130,760,467],ratioWidth:164,ratioDepth:105},"1NA":{crop:[880,130,291,467],ratioWidth:66,ratioDepth:105},"1ER/T":{crop:[1230,130,446,651],ratioWidth:98,ratioDepth:166}}};
const source = (window.BAIDU_FIGARO_SOFA_DATA || []).filter(x => x.catalogBrand === "Figaro");
const groups = new Map();
source.forEach(row => { if (!groups.has(row.series)) groups.set(row.series, []); if (row.configuration && !/^(R\/PU|R\/SB|ARM IS FIXED)$/i.test(row.configuration)) groups.get(row.series).push(row); });
const states = new Map();
let current = "", root, drag = -1, scheduled = false;
const esc = x => String(x == null ? "" : x).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const cash = n => n > 0 ? "¥" + n.toLocaleString("zh-CN",{maximumFractionDigits:2}) : "待核价";
const SOURCE_GALLERY = {
 "FG 3135": { image:"assets/generated/figaro/FG3135-1.png", source:"EXPORT 2020 (FG ).xls#Sheet1!FG3135/Picture8/rows311-313" },
 "FG 3120": { image:"assets/generated/figaro/FG3120-1.png", source:"EXPORT 2020 (FG ).xls#Sheet1!FG3120/Picture/source extraction" }
};
function sourceGallery(series) {
 const row=source.find(row=>row.series===series && row.photo);
 const item=SOURCE_GALLERY[series] || (row ? {image:row.photo} : null);
 if(!item)return '<section class="fg-source-gallery"><h4>原版图 / 效果图</h4><p>此型号原图待补</p></section>';
 return '<section class="series-effect-gallery fg-source-gallery" data-fg-source-gallery="'+esc(series)+'" aria-label="原版图/效果图"><h4>原版图 / 效果图</h4><button type="button" class="photo-open-button set-photo-main-button" data-full-photo="'+esc(item.image)+'" aria-label="点击放大 '+esc(series)+' 原版图"><img class="set-main-photo" loading="lazy" src="'+esc(item.image)+'" alt="'+esc(series)+' 原版图 / 效果图"></button></section>';
}
function getState(series) {
 if (!states.has(series)) {
  const materials = series==="FG 3052"?[...new Set((groups.get(series)||[]).flatMap(x=>x.materials||[]))]:["M/F", "F/SA", "NuBuck"];
  states.set(series,{placements:[],pieces:[],discount:1,material:materials.includes("M/F")?"M/F":materials[0]||"",materials});
 }
 return states.get(series);
}
function placement(state,index){return state.placements[index]||(state.placements[index]={dx:0,dy:0,rotation:0,mirror:false});}
function reorder(state,from,to){
 const positions=state.pieces.map((_,i)=>placement(state,i));
 state.pieces.splice(to,0,state.pieces.splice(from,1)[0]);positions.splice(to,0,positions.splice(from,1)[0]);state.placements=positions;
}
function editPlan(plan,state){
 if(current!=="FG 3052")return plan;
 plan.pieces=plan.pieces.map(p=>{const q=placement(state,p.index),angle=(p.rotationDeg+q.rotation)%360;
 const width=angle%180?p.physicalDepth:p.physicalWidth,depth=angle%180?p.physicalWidth:p.physicalDepth;
 return {...p,x:p.x+q.dx,y:p.y+q.dy,rotationDeg:angle,width,depth,flip:q.mirror?!p.flip:p.flip};});
 const pad=600,minX=Math.min(0,...plan.pieces.map(p=>p.x))-pad,minY=Math.min(0,...plan.pieces.map(p=>p.y))-pad;
 if(!state.layoutViewBox)state.layoutViewBox=[minX,minY,Math.max(plan.width,...plan.pieces.map(p=>p.x+p.width))+pad-minX,Math.max(plan.depth,...plan.pieces.map(p=>p.y+p.depth))+pad-minY];plan.viewBox=state.layoutViewBox.slice();state.renderedPlan=plan.pieces;return plan;
}
function selectedControls(rows,state){
 const index=state.selectedIndex,row=rows.find(r=>r.id===state.pieces[index]);
 return '<div class="fg-selected-toolbar" role="group" aria-label="当前模块操作">'+(row?'<strong>'+rowLabel(row)+'</strong><span>'+esc(row.dimensions)+' · '+priceMarkup(row,state)+'</span>'+[['rotate','旋转90°'],['mirror','左右翻转'],['delete','删除']].map(([action,label])=>'<button type="button" data-fg-action="'+action+'" data-index="'+index+'">'+label+'</button>').join(''):'<span>点选预览中的模块进行操作；拖出预览即可删除</span>')+'<button type="button" data-fg-action="reset-layout">恢复摆放</button></div>';
}
function selectionMarkup(rows,state,covered){
 if(current==='FG 3052')return '<section class="fg-selection fg-direct-composer">'+joinedPreview(rows,state)+selectedControls(rows,state)+'</section>';
 return '<section class="fg-selection fg-direct-composer">'+joinedPreview(rows,state)+'</section>';
}
function placementControls(index){return '<div class="fg-placement-controls">'+[['left','顺序前移'],['right','顺序后移'],['move-left','←'],['move-right','→'],['move-up','↑'],['move-down','↓'],['rotate','转90°'],['mirror','左右镜像'],['delete','移除']].map(([action,label])=>'<button type="button" data-fg-action="'+action+'" data-index="'+index+'">'+label+'</button>').join('')+'</div>';}
function quote(row, material) {
 if (!row || !material || row.pricePending) return 0;
 return window.SOFA_MATERIAL_PRICING.resolve(row.fixedAccessoryPrice>0?{...row,materials:["TABLE"],priceOptions:[row.fixedAccessoryPrice]}:row,row.fixedAccessoryPrice>0?"TABLE":material).sellingPrice;
}
function shownQuote(row,state){return Math.ceil(quote(row,state.material)*(state.discount||1)/100)*100;}
function priceMarkup(row,state){
 const base=quote(row,state.material),sale=shownQuote(row,state);
 if(!(base>0)&&row){
  const rows=groups.get(row.series)||[],label=String(row.configuration).replace(/[\s/]/g,'').toUpperCase();
  const hasBundle=rows.some(candidate=>window.HP_FIGARO_COMPOSITION_V1335.bundleSpec(candidate,rows)?.has(label)&&shownQuote(candidate,state)>0);
  if(hasBundle)return '<b>随整套计价</b>';
 }
 return (base>0&&state.discount<1?'<del>'+cash(base)+'</del> ':'')+'<b>'+cash(sale)+'</b>';
}
function bundle(row) { return /\+/.test(row.configuration); }
 function cardMarkup(row,state) { return '<article class="fg-module-card '+(state.pieces.includes(row.id)?"is-selected":"")+'"><button type="button" class="fg-add-card" aria-label="添加 '+esc(row.configuration)+'" data-fg-action="add" data-row="'+esc(row.id)+'">'+photoMarkup(row)+'<strong>'+rowLabel(row)+'</strong><small>'+compactDimensions(row)+'</small><span>'+priceMarkup(row,state)+'</span></button><div class="fg-controls"><button type="button" data-fg-action="minus" data-row="'+esc(row.id)+'" aria-label="减少 '+esc(row.configuration)+'" '+(!state.pieces.includes(row.id)?"disabled":"")+'>−</button><b>'+state.pieces.filter(id=>id===row.id).length+'</b><button type="button" data-fg-action="add" data-row="'+esc(row.id)+'" aria-label="添加 '+esc(row.configuration)+'">＋</button></div>'+(bundle(row)?'<small class="fg-note">整套报价；按整套加入，不拆分单价</small>':"")+'</article>'; }
 function cardGroup(rows,state,title,className) { return rows.length?'<section class="fg-row-group '+className+'"><h4>'+title+'</h4><div class="fg-module-grid">'+rows.map(row=>cardMarkup(row,state)).join('')+'</div></section>':''; }
function preview(row) {
 if(row.modulePreview) return row.modulePreview;
 const custom = window.FIGARO_MODULE_PREVIEWS?.[row.series]?.[row.configuration];
 if (custom && ["verified-real-module-photo","generated-topdown-preview","generated-product-preview"].includes(custom.status)) return custom;
 if (row.modulePhoto && ["verified-real-module-photo","generated-topdown-preview","verified-topdown","source-line-art-crop"].includes(row.modulePhotoType)) return {image:row.modulePhoto,status:row.modulePhotoType};
 return null;
}
function photoMarkup(row) {
 const p=preview(row);
 if(row.moduleComponents?.some(part=>partTop(part))&&(!p||row.moduleComponents.every(part=>partTop(part)))){const parts=rowParts(row);const generated=parts.some(part=>String(part.top?.status||'').startsWith('generated'));return '<div class="fg-card-components">'+parts.map((part,index)=>'<div>'+topViewMarkup(part.top,part.label,'card-'+row.id+'-'+index)+'</div>').join('')+'</div>'+(generated?'':'<small>原厂模块顶视组合</small>');}
 const label=p?.status==="verified-whole-set-photo"?"整套配置照片":p?.status==="source-line-art-crop"?"原厂模块尺寸图":p?.status==="verified-manufacturer-module-diagram"?"原厂模块图":p?.status?.startsWith("generated")?"AI 模块示意 · 材质以实物为准":"独立模块照片";
 const visibleLabel=p?.status?.startsWith("generated")?"":label;
 if(p?.crop)return '<svg class="fg-module-photo" style="'+(p.mirrorX?'transform:scaleX(-1)':'')+'" viewBox="'+p.crop.join(' ')+'" role="img" aria-label="'+esc(row.series+' '+row.configuration+' '+label)+'"><defs><clipPath id="fg-crop-'+esc(row.id)+'"><rect x="'+p.crop[0]+'" y="'+p.crop[1]+'" width="'+p.crop[2]+'" height="'+p.crop[3]+'"/></clipPath></defs><image clip-path="url(#fg-crop-'+esc(row.id)+')" href="'+esc(p.image)+'" width="'+(p.width||1536)+'" height="'+(p.height||1024)+'"/></svg>'+(visibleLabel?'<small>'+visibleLabel+'</small>':'');
  return p?'<img loading="lazy" src="'+esc(p.image)+'" alt="'+esc(row.series+" "+row.configuration)+'">'+(visibleLabel?'<small>'+visibleLabel+'</small>':''):'<span class="fg-photo-pending">'+(bundle(row)?'整套配置图片待补':'独立模块图片待补')+'</span>';
}
function compactDimensions(row){
 const nums=String(row.dimensions||'').match(/\d+(?:\.\d+)?/g);
 if(row.widthMm&&row.depthMm)return esc([row.widthMm,row.depthMm].map(n=>n/10).join('×')+' cm');
 return nums?.length>=2&&/mm/i.test(row.dimensions)?esc(nums.slice(0,2).map(n=>Number(n)/10).join('×')+' cm'):esc(row.dimensions||'尺寸待核实');
}
function materialLabel(value){return ({MF:'布艺',FSA:'皮革',NUBUCK:'牛巴皮',NEOBUCK:'牛巴皮'})[String(value).toUpperCase().replace(/[\s/._-]/g,'')]||value;}
function rowLabel(row) {
 const duplicates=(groups.get(current)||[]).filter(x=>x.configuration===row.configuration);
 return esc(/Table ([123])$/i.test(row.configuration)?'桌 '+/Table ([123])$/i.exec(row.configuration)[1]:row.configuration)+(duplicates.length>1?'<small>款式 '+(duplicates.indexOf(row)+1)+'</small>':"");
}
function topViewMarkup(top,label,key){
 if(!top)return '<span class="fg-top-missing">顶视图待核实</span><small class="fg-top-piece-label">'+esc(label)+'</small>';
 const ratio=(Number(top.ratioWidth)||1)+' / '+(Number(top.ratioDepth)||1);
 const labelText=String(top.status||'').startsWith('generated')?'AI 顶视示意':'原厂顶视图';
 if(top.crop){const clip='fg-source-top-'+String(key).replace(/[^a-z0-9_-]/gi,'-');return '<svg class="fg-top-source" style="aspect-ratio:'+ratio+'" viewBox="'+top.crop.join(' ')+'" role="img" aria-label="'+esc(label+' '+labelText)+'"><defs><clipPath id="'+clip+'"><rect x="'+top.crop[0]+'" y="'+top.crop[1]+'" width="'+top.crop[2]+'" height="'+top.crop[3]+'"/></clipPath></defs><image href="'+esc(top.image)+'" width="'+(top.width||1536)+'" height="'+(top.height||1024)+'" clip-path="url(#'+clip+')"/></svg><small class="fg-top-piece-label">'+esc(label)+'</small>'}
 return '<img class="fg-top-source" loading="lazy" style="aspect-ratio:'+ratio+'" src="'+esc(top.image)+'" alt="'+esc(label+' '+labelText)+'"><small class="fg-top-piece-label">'+esc(label)+'</small>';
}
// Normalize only explicitly verified top-view records. Front and whole-set previews
// stay out of the composition plane unless the source marks view=top with ratios.
function partTop(part){
 const direct=part?.topView||part?.top;
 if(direct&&direct.view==="top"&&Number(direct.ratioWidth)>0&&Number(direct.ratioDepth)>0)return direct;
 const preview=part?.modulePreview;
 return preview&&preview.view==="top"&&Number(preview.ratioWidth)>0&&Number(preview.ratioDepth)>0?preview:null;
}
function rowParts(row){
 if(Array.isArray(row?.moduleComponents)&&row.moduleComponents.length)
  return row.moduleComponents.map(part=>({label:part.configuration||part.label||"模块",top:partTop(part)}));
 return [{label:row?.configuration||"模块",top:partTop(row)}];
}
function compositionQuote(series,ids,material,discount=1){
 const rows=groups.get(series)||[];
 return window.HP_FIGARO_COMPOSITION_V1335.quoteSelection(rows,ids,row=>shownQuote(row,{material,discount}));
}
function planImage(piece,key){
 const top=piece.top,w=piece.physicalWidth,h=piece.physicalDepth;
 const displayCrop=top.crop&&(window.FIGARO_PHOTO_MARGINS_V1335?.[top.image+'|'+top.crop.join(',')]||top.crop);
 let content=top.crop
  ? '<svg class="fg-top-source" width="'+w+'" height="'+h+'" viewBox="'+displayCrop.join(' ')+'" preserveAspectRatio="none" overflow="hidden"><image href="'+esc(top.image)+'" width="'+(top.width||1536)+'" height="'+(top.height||1024)+'"/></svg>'
  : '<image class="fg-top-source" href="'+esc(top.image)+'" width="'+w+'" height="'+h+'" preserveAspectRatio="none"/>';
 if(top.footprintPolygon){const clip='fg-footprint-'+key;content='<defs><clipPath id="'+clip+'"><polygon points="'+top.footprintPolygon.map(p=>p.join(',')).join(' ')+'"/></clipPath></defs><g clip-path="url(#'+clip+')">'+content+'</g>';}
 return piece.flip?'<g transform="translate('+w+' 0) scale(-1 1)">'+content+'</g>':content;
}
function joinedPreview(rows,state){
 const selected=state.pieces.map(id=>rows.find(x=>x.id===id)).filter(Boolean);
 const units=selected.map((row,index)=>({row,index,parts:rowParts(row)}));
 if(['FG 3132','FG 3133'].includes(current)){
  const atlas=current==='FG 3132'?{image:'assets/generated/figaro/FG3132-top-v1268.webp',width:2145,height:733,parts:{'2EL':{crop:[198,20,930,590],ratioWidth:158,ratioDepth:105},'1NA/T':{crop:[1412,20,420,690],ratioWidth:121,ratioDepth:105}}}:window.FIGARO_TOP_V1267;
  units.forEach(unit=>{const part=atlas?.parts[unit.row.configuration];if(part)unit.parts=[{label:unit.row.configuration,top:{...part,image:atlas.image,width:atlas.width,height:atlas.height,view:'top'}}];});
 }
 state.summaryPlan=null;
 if(!selected.length)return '<div class="fg-joined-preview"><h4>组合预览</h4><p class="fg-empty">点击上方模块开始组合</p></div>';
 if(current==='FG 3135')return '<div class="fg-joined-preview fg3135-selected-preview"><h4>组合预览 · 已选配置</h4><div class="fg3135-source-status">配置示意，非按尺寸拼接；原厂尺寸与俯视模块图待补。</div><div class="fg3135-selected-grid" style="display:flex;flex-wrap:wrap;gap:12px">'+selected.map((row,index)=>'<article class="fg3135-selected-piece" data-index="'+index+'" style="flex:1 1 180px;max-width:320px;padding:12px;border:1px solid #dce4e9;border-radius:10px"><div>'+photoMarkup(row)+'</div><strong>'+rowLabel(row)+'</strong><div>'+compactDimensions(row)+'</div><div>'+priceMarkup(row,state)+'</div><button type="button" data-fg-action="delete" data-index="'+index+'">移除此项</button></article>').join('')+'</div></div>';
 const plan=editPlan(window.HP_FIGARO_COMPOSITION_V1335.buildPlan(units,window.buildZolanoPlan),state);
 state.summaryPlan=plan;
 const pending=plan.missing.length?'<p>'+plan.missing.map(p=>esc(p.label)).join('、')+'：顶视图待补</p>':'';
 const drawing=plan.pieces.length?'<svg class="fg-plan-canvas" viewBox="'+(plan.viewBox||[0,0,plan.width,plan.depth]).join(' ')+'" aria-label="'+esc(current)+' 拼接组合">'+plan.pieces.map((piece,i)=>{
  const angle=piece.rotationDeg,tx=piece.x+(angle===90||angle===180?piece.width:0),ty=piece.y+(angle===180||angle===270?piece.depth:0);
  return '<g class="fg-stage-piece'+(state.selectedIndex===piece.index?' is-selected':'')+'" data-index="'+piece.index+'" data-rotation="'+angle+'" data-module-label="'+esc(piece.label)+'" data-photo-mirrored="'+!!piece.flip+'" tabindex="0" role="button" aria-label="'+esc(piece.label)+'，点击选中；拖动移动，拖出预览删除" transform="translate('+tx+' '+ty+') rotate('+angle+')"><rect width="'+piece.physicalWidth+'" height="'+piece.physicalDepth+'" fill="transparent"/>'+planImage(piece,i)+'</g>';
 }).join('')+'</svg>':'';
 return '<div class="fg-joined-preview"><h4>组合预览</h4>'+(current==='FG 3052'?'<p>拖动拼接，靠近边缘自动吸附；点选可旋转或翻转。顶视示意，尺寸按原厂标注。</p>':'')+'<div class="fg-joined-plan">'+drawing+'</div>'+pending+'</div>';
}
function dimensionText(plan){
 const size=window.HP_FIGARO_COMPOSITION_V1335.measurePlan(plan);
 return size?'组合尺寸：'+[size.widthMm,size.depthMm].map(n=>Number((n/10).toFixed(1))).join(' × ')+' cm':'组合尺寸：待核';
}
function dimensionMarkup(state){return '<span class="fg-combination-size" aria-live="polite">'+(state.pieces.length?dimensionText(state.summaryPlan):'组合尺寸：—')+'</span>';}
function render() {
 if (!root || !current) return;
 root.dataset.series=current;
 const rows=groups.get(current)||[], state=getState(current);
 const result=compositionQuote(current,state.pieces,state.material,state.discount);
 const {subtotal,pending}=result;
 const covered=new Set(result.coveredIndices);
 const selection=selectionMarkup(rows,state,covered);
 root.innerHTML='<div class="fg-head"><h3>'+esc(current)+(current==='FG 3135'?' · 配置选择':' · 模块组合')+'</h3><div class="fg-head-actions"><button type="button" data-fg-customer-link>复制顾客链接</button><button type="button" data-fg-action="clear">清空全部</button></div></div>'+
 '<div class="fg-materials"><strong>面料 · 全套统一</strong>'+state.materials.map(m=>'<button type="button" data-fg-action="material" data-material="'+esc(m)+'" aria-pressed="'+(state.material===m)+'">'+esc(materialLabel(m))+'</button>').join("")+'</div>'+
  cardGroup(rows.filter(row=>!bundle(row)),state,current==='FG 3135'?'成品配置':'独立模块','fg-independent-modules')+
  cardGroup(rows.filter(row=>bundle(row)),state,'整套配置','fg-whole-set-configurations')+
 (!rows.length?'<p>此型号模块配置与售价待补。</p>':"")+
 '<div class="fg-summary"><span>已选 '+state.pieces.length+' 项</span>'+dimensionMarkup(state)+'<strong>'+(state.pieces.length?(pending?(subtotal>0?'已知小计 '+cash(subtotal)+'；':'')+pending+' 项待核价':cash(subtotal)):'—')+'</strong></div>'+
 (result.bundles.length?'<div class="fg-bundle-prices">'+result.bundles.map(b=>'<p>'+esc(b.row.configuration)+' × '+b.quantity+' · 整套价 <strong>'+cash(b.total)+'</strong></p>').join('')+'</div>':'')+
 selection+
  '<div class="fg-summary"><span>已选 '+state.pieces.length+' 项</span>'+dimensionMarkup(state)+'<strong>'+(state.pieces.length?(pending?(subtotal>0?'已知小计 '+cash(subtotal)+'；':'')+pending+' 项待核价':cash(subtotal)):'—')+'</strong></div>'+
  '<div class="fg-discounts" aria-label="折扣">'+[[1,'原价'],[.88,'88折'],[.85,'85折'],[.83,'83折'],[.8,'8折'],[.75,'75折'],[.73,'73折'],[.7,'7折']].map(([rate,label])=>'<button type="button" data-fg-action="discount" data-material="'+rate+'" aria-pressed="'+(state.discount===rate)+'">'+label+'</button>').join('')+'</div>'+sourceGallery(current);
 window.HP_BIND_PHOTO_GALLERY?.(root);
}
function mutate(action,id,index,material) {
 if(!current)return;
 const state=getState(current),rows=groups.get(current)||[];
 if(["add","minus","delete","left","right","clear","rotate","reset-layout"].includes(action))state.layoutViewBox=null;
 if(action==="add"&&rows.some(x=>x.id===id)){state.pieces.push(id);state.placements.push({dx:0,dy:0,rotation:0,mirror:false});state.selectedIndex=state.pieces.length-1;}
 if(action==="minus"){const i=state.pieces.lastIndexOf(id);if(i>=0){state.pieces.splice(i,1);state.placements.splice(i,1);}}
 if(action==="delete"&&index>=0&&index<state.pieces.length){state.pieces.splice(index,1);state.placements.splice(index,1);state.selectedIndex=-1;}
 if(action==="left"&&index>0)reorder(state,index,index-1);
 if(action==="right"&&index<state.pieces.length-1)reorder(state,index,index+1);
 if(action==="clear"){state.pieces=[];state.placements=[];state.selectedIndex=-1;}
 if(action==="reset-layout")state.placements=[];
 if(current==="FG 3052"&&index>=0&&index<state.pieces.length){
 const p=placement(state,index);
 if(action==="move-left")p.dx-=100;if(action==="move-right")p.dx+=100;
 if(action==="move-up")p.dy-=100;if(action==="move-down")p.dy+=100;
 if(action==="rotate")p.rotation=(p.rotation+90)%360;if(action==="mirror")p.mirror=!p.mirror;
 }
 if(action==="material"&&state.materials.includes(material))state.material=material;
 if(action==="discount"&&[1,.88,.85,.83,.8,.75,.73,.7].includes(Number(material)))state.discount=Number(material);
 render();
 // Rotation changes the joining width. Reattach the selected instance using
 // its new footprint so the outer edge remains flush in an L return.
 if(action==="rotate"&&current==="FG 3052"&&window.FG3052_LAYOUT){
 const pieces=state.renderedPlan||[],original=pieces.find(p=>p.index===index),snapped=window.FG3052_LAYOUT.snap(pieces,index);
 if(original&&snapped?.snapped){const q=placement(state,index);q.dx+=snapped.x-original.x;q.dy+=snapped.y-original.y;state.layoutViewBox=null;render();}
 }
}
function sync() {
 scheduled=false;
 const series=document.querySelector("#seriesSelect")?.value||"";
 // FG3136 already uses the existing verified/shared graphical compositor.
 const active=(document.body.dataset.activeCatalog==="figaro"||(document.body.dataset.activeCatalog==="zolano"&&/^FG\s*(?:3052|3120|3135)\b/i.test(series)))&&groups.has(series)&&!/^FG\s*3136\b/i.test(series);
 if(document.body.classList.contains("fg-modular-active")!==active)document.body.classList.toggle("fg-modular-active",active);
 if(!root){const anchor=document.querySelector("#zolanoModulePicker");if(!anchor)return;root=document.createElement("section");root.id="figaroModularComposer";root.hidden=true;anchor.before(root);
 root.addEventListener("click",e=>{const b=e.target.closest("[data-fg-action]");if(b)mutate(b.dataset.fgAction,b.dataset.row,Number(b.dataset.index),b.dataset.material);});
 root.addEventListener("keydown",e=>{const piece=e.target.closest(".fg-piece,.fg-stage-piece");if(!piece||e.target.tagName==="BUTTON")return;const action={Delete:"delete",Backspace:"delete",ArrowLeft:"left",ArrowRight:"right"}[e.key];if(action){e.preventDefault();const mapped=current==="FG 3052"&&piece.matches(".fg-stage-piece")?{left:"move-left",right:"move-right"}[action]||action:action;mutate(mapped,"",Number(piece.dataset.index));}});
 let touchDrag=null;
 root.addEventListener("pointerdown",e=>{const p=e.target.closest(".fg-piece,.fg-stage-piece");if(!p||e.target.closest("button")||(e.pointerType==="mouse"&&!p.matches(".fg-stage-piece")))return;touchDrag={index:Number(p.dataset.index),x:e.clientX,y:e.clientY,moved:false,pointer:e.pointerId};
 if(current==="FG 3052"&&p.matches(".fg-stage-piece")){
 const svg=p.closest("svg.fg-plan-canvas"),m=svg.getScreenCTM()?.inverse();
 if(m){touchDrag.free=true;touchDrag.matrix=m;touchDrag.start={x:m.a*e.clientX+m.c*e.clientY+m.e,y:m.b*e.clientX+m.d*e.clientY+m.f};touchDrag.base={...placement(getState(current),touchDrag.index)};touchDrag.plan=(getState(current).renderedPlan||[]).map(p=>({...p}));touchDrag.elements=Array.from(svg.querySelectorAll('[data-index="'+touchDrag.index+'"]')).map(el=>({el,transform:el.getAttribute("transform")}));}
 }
 p.setPointerCapture(e.pointerId);if(p.matches(".fg-stage-piece"))e.preventDefault();});
 root.addEventListener("pointermove",e=>{if(touchDrag&&e.pointerId===touchDrag.pointer&&(touchDrag.moved||Math.hypot(e.clientX-touchDrag.x,e.clientY-touchDrag.y)>10)){touchDrag.moved=true;e.preventDefault();
 if(touchDrag.free){const m=touchDrag.matrix,dx=m.a*e.clientX+m.c*e.clientY+m.e-touchDrag.start.x,dy=m.b*e.clientX+m.d*e.clientY+m.f-touchDrag.start.y;let delta={dx,dy};
 const pieces=touchDrag.plan.map(p=>p.index===touchDrag.index?{...p,x:p.x+dx,y:p.y+dy}:p),snapped=window.FG3052_LAYOUT.snap(pieces,touchDrag.index,120),original=touchDrag.plan.find(p=>p.index===touchDrag.index);
 if(snapped&&original)delta={dx:snapped.x-original.x,dy:snapped.y-original.y};
 touchDrag.delta=delta;
 const livePlan={...getState(current).summaryPlan,pieces:touchDrag.plan.map(p=>p.index===touchDrag.index?{...p,x:p.x+delta.dx,y:p.y+delta.dy}:p)};
 root.querySelectorAll('.fg-combination-size').forEach(el=>el.textContent=dimensionText(livePlan));
 touchDrag.elements.forEach(({el,transform})=>el.setAttribute("transform","translate("+delta.dx+" "+delta.dy+") "+transform));}}});
 // Native scrolling cancels pointers on picker cards too. Only restore the
 // preview when the cancelled pointer actually owns a preview drag.
 root.addEventListener("pointercancel",e=>{if(!touchDrag||e.pointerId!==touchDrag.pointer)return;touchDrag=null;render();});
 root.addEventListener("pointerup",e=>{if(!touchDrag)return;const start=touchDrag;touchDrag=null;if(!start.moved){if(current==="FG 3052"){getState(current).selectedIndex=start.index;render();}return;}
 if(start.free){const frame=root.querySelector(".fg-plan-canvas").getBoundingClientRect();if(e.clientX<frame.left||e.clientX>frame.right||e.clientY<frame.top||e.clientY>frame.bottom){mutate("delete","",start.index);return;}getState(current).selectedIndex=start.index;const p=placement(getState(current),start.index),delta=start.delta||{dx:0,dy:0};p.dx=start.base.dx+delta.dx;p.dy=start.base.dy+delta.dy;render();return;}
 const area=(root.querySelector(".fg-plan-canvas")||root.querySelector(".fg-joined-preview")).getBoundingClientRect();if(e.clientX<area.left||e.clientX>area.right||e.clientY<area.top||e.clientY>area.bottom){mutate("delete","",start.index);return;}const target=document.elementFromPoint(e.clientX,e.clientY)?.closest(".fg-piece,.fg-stage-piece");if(target){const to=Number(target.dataset.index),s=getState(current);reorder(s,start.index,to);render();}});
 root.addEventListener("dragstart",e=>{const p=e.target.closest(".fg-piece,.fg-stage-piece");drag=p?Number(p.dataset.index):-1;if(drag>=0){e.dataTransfer.setData("text/plain",String(drag));e.dataTransfer.effectAllowed="move";}});
 root.addEventListener("dragover",e=>{if(drag>=0&&e.target.closest(".fg-selection"))e.preventDefault();});
 root.addEventListener("drop",e=>{if(drag<0)return;e.preventDefault();const target=e.target.closest(".fg-piece,.fg-stage-piece");if(target){const to=Number(target.dataset.index),s=getState(current);reorder(s,drag,to);}drag=-1;render();});
 root.addEventListener("dragend",e=>{if(drag<0)return;const bounds=root.querySelector(".fg-selection")?.getBoundingClientRect();if(bounds&&(e.clientX<bounds.left||e.clientX>bounds.right||e.clientY<bounds.top||e.clientY>bounds.bottom))mutate("delete","",drag);drag=-1;});
 }
 if(root.hidden===active)root.hidden=!active;
 if(active&&current!==series){current=series;render();}
 if(!active)current="";
}
function schedule(){if(!scheduled){scheduled=true;setTimeout(sync,0);}}
document.addEventListener("change",schedule);
document.addEventListener("click",e=>{if(!e.target.closest("#figaroModularComposer"))schedule();});
new MutationObserver(schedule).observe(document.body,{attributes:true,attributeFilter:["data-active-catalog"]});
document.querySelector("#seriesSelect") && new MutationObserver(schedule).observe(document.querySelector("#seriesSelect"),{childList:true,subtree:true});
function applyCustomerProposal(series,proposal){
 const rows=groups.get(series);if(!rows||!proposal||!Array.isArray(proposal.pieces)||proposal.pieces.length>40)throw Error('组合链接无效');
 if(proposal.pieces.some(id=>!rows.some(r=>r.id===id)))throw Error('组合模块与型号不符');
 const state=getState(series);if(proposal.material&&!state.materials.includes(proposal.material))throw Error('材质无效');
 const positions=proposal.pieces.map((_,i)=>{const p=proposal.placements?.[i]||{};if(![0,90,180,270].includes(p.rotation??0)||[p.dx??0,p.dy??0].some(n=>!Number.isFinite(n)||Math.abs(n)>20000))throw Error('摆放参数无效');return {dx:p.dx||0,dy:p.dy||0,rotation:p.rotation||0,mirror:p.mirror===true};});
 state.pieces=proposal.pieces.slice();state.placements=positions;state.material=proposal.material||state.material;state.selectedIndex=-1;state.layoutViewBox=null;render();
}
window.FIGARO_COMPOSITION = { getState:s=>JSON.parse(JSON.stringify(getState(s))), applyCustomerProposal, quote, quoteSelection:compositionQuote, source, groups, sync };
sync();
})();
