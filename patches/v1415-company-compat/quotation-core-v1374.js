(function(root){
  'use strict';
  const cash=n=>n==null?'待核价':'¥'+Number(n).toLocaleString('zh-CN',{maximumFractionDigits:2});
  const discountRates=[.88,.85,.83,.8,.75,.73,.7,.6];
  const discountLabel=rate=>rate===1?'恢复基准价':Number((rate*10).toFixed(2))+'折';
  function money(value){
    if(value==null||String(value).trim()==='')throw Error('请输入有效单价');
    const n=Number(value);
    if(!Number.isFinite(n)||n<0||n>1000000000)throw Error('单价请输入 0–10亿元之间的金额');
    return Math.round((n+Number.EPSILON)*100)/100;
  }
  function legacyPricePending(value){
    if(typeof value.pricePending==='boolean')return false;
    let key;try{key=JSON.parse(value.key);}catch{return false;}
    if(!Array.isArray(key))return false;
    if(key[0]==='zl10')return root.HP_FIRST10_PRICE_PENDING?.(value)!==false;
    if(key[0]==='3861'){
      const ids=key[1],materials=key[2],kinds={'ZL3861-1EL':'1EL','ZL3861-1NA':'1NA','ZL3861-1ERC':'1ER','ZL3861-TABLE':'TABLE'};
      if(!Array.isArray(ids)||!ids.length||ids.length>10||!Array.isArray(materials)||materials.length!==ids.length)return true;
      const pieces=ids.map((id,i)=>({kind:kinds[id],material:materials[i]}));
      const tables=key[6]??0;if(!Number.isSafeInteger(tables)||tables<0||tables>10)return true;
      for(let i=0;i<tables;i++)pieces.push({kind:'TABLE_STANDARD',material:key[7]||materials[0]});
      const quote=root.HP_ZOLANO_3861_PRICING?.quote(pieces,1,key[4]??0);
      return !quote||quote.total==null;
    }
    return false;
  }
  function snapshot(value){
    const quantity=value.quantity??1;
    if(!Number.isInteger(quantity)||quantity<1||quantity>999)throw Error('数量请输入 1–999 的整数');
    const price=value.price==null?null:money(value.price);
    if(!String(value.title||'').trim())throw Error('缺少产品型号');
    const basePrice=value.basePrice===undefined?price:value.basePrice==null?null:money(value.basePrice);
    const priceMode=['manual','discount'].includes(value.priceMode)?value.priceMode:'original';
    const discountRate=priceMode==='discount'&&discountRates.includes(Number(value.discountRate))?Number(value.discountRate):1;
    const pricePending=value.pricePending===true||price==null||basePrice==null||legacyPricePending(value);
    const row={quantity,price:pricePending?null:price,basePrice:pricePending?null:basePrice,priceMode,discountRate,selected:value.selected!==false,parts:Array.from(value.parts||[],String)};
    row.pricePending=pricePending;
    for(const k of ['id','key','title','configuration','material','dimensions','image','imageNote','version'])row[k]=String(value[k]||'');
    try{const u=new URL(value.customerUrl);if(u.origin==='https://design.myzolano.vip'&&u.pathname==='/'&&u.hash.startsWith('#plan='))row.customerUrl=u.toString();}catch{}
    row.origin=value.origin===undefined?legacyOrigin(row):String(value.origin||'');
    return row;
  }
  function legacyOrigin(value){const key=String(value.key||'')+' '+String(value.title||'');return /(?:^|\b)(?:fg|3861|zl10|first10|zolano|zolanoFull|figaro|ferranti|recliner)\b|ZL\s*\d|FG\s*\d|CAMPANO|FIRENZE|AURONZO/i.test(key)?'原装进口':'';}
  function manualPrice(value,amount){
    const row=snapshot(value);
    if(row.pricePending)throw Error('待核价项目须先核实价格依据，不能以手填价替代');
    const price=money(amount);
    return snapshot({...row,price,basePrice:row.basePrice??price,priceMode:'manual',discountRate:1});
  }
  function discountPrice(value,rate){
    rate=Number(rate);
    if(rate!==1&&!discountRates.includes(rate))throw Error('请选择有效折扣');
    const row=snapshot(value);
    if(row.basePrice==null)return row;
    // Match the app's upward 100-yuan rounding without increasing a small price.
    const price=rate===1?row.basePrice:Math.min(row.basePrice,Math.ceil(row.basePrice*rate/100-1e-10)*100);
    return snapshot({...row,price,discountRate:rate,priceMode:rate===1?'original':'discount'});
  }
  const pricingNote=r=>r.priceMode==='discount'&&r.discountRate<1?'折扣：'+discountLabel(r.discountRate)+'（基准单价 '+cash(r.basePrice)+'）':'';
  // Customer output is deliberately derived from the row snapshot. These options never
  // alter staff-facing prices or the arithmetic used by the cart.
  function normalizeOutputOptions(value){
    value=value||{};
    return {hidePrice:Boolean(value.hidePrice||value.noPrice||value.hidePrices),hideDiscount:Boolean(value.hideDiscount||value.noDiscount),hideDetails:Boolean(value.hideDetails||value.noDetails)};
  }
  function customerDisplay(row,value){
    const options=normalizeOutputOptions(value),r=snapshot(row),details=[];
    if(!options.hideDetails){
      if(r.configuration)details.push(r.configuration);
      if(r.material)details.push('材质：'+r.material);
      if(r.dimensions)details.push('尺寸：'+r.dimensions);
    }
    // Keep provenance visible even when configuration details are hidden.
    if(r.origin)details.push(r.origin);
    const pricing=[];
    if(!options.hidePrice){
      if(r.basePrice!=null&&r.priceMode==='discount'&&r.discountRate<1)pricing.push('原价：'+cash(r.basePrice));
      if(r.price!=null)pricing.push((!options.hideDiscount&&r.priceMode==='discount'&&r.discountRate<1?'折后单价：':'报价单价：')+cash(r.price)+(options.hideDiscount?'':(r.priceMode==='discount'&&r.discountRate<1?'（'+discountLabel(r.discountRate)+'）':'')));
      else pricing.push('报价单价：待核价');
    }
    return {title:r.title,details,pricing,quantity:r.quantity,image:r.image,imageNote:r.imageNote||'',price:r.price,subtotal:r.price==null?null:Math.round(r.price*100)*r.quantity/100,subtotals:priceLines([r],options,'line')};
  }
  function summary(rows){
    const chosen=rows.filter(r=>r.selected!==false).map(snapshot);let cents=0,pending=0,quantity=0;
    chosen.forEach(r=>{quantity+=r.quantity;if(r.pricePending||r.price==null||r.basePrice===null)pending+=r.quantity;else cents+=Math.round(r.price*100)*r.quantity;});
    return {amount:pending?null:cents/100,pending,quantity,count:chosen.length};
  }
  // A separate breakdown keeps summary's public enumerable shape compatible.
  function priceBreakdown(rows){
    const chosen=rows.filter(r=>r.selected!==false).map(snapshot),s=summary(chosen);
    let originalCents=0,currentCents=0,missingBase=0;
    for(const r of chosen){if(r.basePrice==null)missingBase+=r.quantity;else originalCents+=Math.round(r.basePrice*100)*r.quantity;if(r.price!=null)currentCents+=Math.round(r.price*100)*r.quantity;}
    const comparable=!s.pending&&!missingBase;
    const rate=chosen.length&&comparable&&chosen.every(r=>r.priceMode==='discount'&&r.discountRate===chosen[0].discountRate&&r.discountRate<1)?chosen[0].discountRate:null;
    return {original:missingBase?null:originalCents/100,amount:s.amount,savings:comparable?(originalCents-currentCents)/100:null,pending:s.pending,missingBase,quantity:s.quantity,count:s.count,rate,adjusted:chosen.some(r=>r.priceMode!=='original'),manual:chosen.some(r=>r.priceMode==='manual')};
  }
  // Both copy and canvas output render these exact labels and values.
  function priceLines(rows,value={},scope='total'){
    const options=normalizeOutputOptions(value);if(options.hidePrice)return [];
    const b=priceBreakdown(rows),lines=[],page=scope==='page'?'本页':'',total=scope==='total',suffix=total?'合计':'小计';
    if(b.pending)return [{label:page+'原价'+suffix,value:'待核价',kind:'original'},{label:page+suffix,value:'待核价',kind:'final'},{label:'待核价',value:'含 '+b.pending+' 件待核价，核实前不能出具正式报价。',kind:'pending'}];
    lines.push({label:page+'原价'+suffix,value:b.original==null?'待核价':cash(b.original),kind:'original'});
    if(!options.hideDiscount){
      if(b.rate!=null)lines.push({label:'折扣',value:discountLabel(b.rate),kind:'rate'});
      if(b.savings!=null&&b.adjusted)lines.push({label:b.savings<0?'调整加价':b.manual?'实际优惠':'优惠金额',value:cash(Math.abs(b.savings)),kind:'adjustment'});
    }
    const discounted=!options.hideDiscount&&b.adjusted&&b.savings!=null&&b.savings>=0;
    lines.push({label:b.pending?page+'已知小计':page+(discounted?'折后':'')+suffix,value:cash(b.amount),kind:'final'});
    if(b.pending)lines.push({label:'待核价',value:'另有 '+b.pending+' 件待核价，未计入小计。',kind:'pending'});
    return lines;
  }
  function add(rows,value){
    const next=snapshot({...value,quantity:1,selected:true});
    const identity=r=>JSON.stringify([r.key,r.title,r.configuration,r.material,r.dimensions,r.price,r.basePrice,r.priceMode,r.discountRate,r.parts]);
    const match=rows.find(r=>r.selected!==false&&r.quantity<999&&identity(r)===identity(next));
    if(match){match.quantity++;return match;}
    next.id=next.id||(typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2));
    rows.push(next);return next;
  }
  function text(rows,date='',value={}){
    if(date&&typeof date==='object'){value=date;date='';}
    const options=normalizeOutputOptions(value),chosen=rows.filter(r=>r.selected!==false),s=summary(chosen);
    if(s.pending&&!options.hidePrice)throw Error('含待核价项目，核实前不能出具正式报价');
    const body=chosen.map((r,i)=>{const d=customerDisplay(r,options);return [`${i+1}. ${d.title}`,...d.details,d.imageNote,...d.pricing,...(r.customerUrl?['顾客修改此组合：'+r.customerUrl]:[]),`数量：${d.quantity}`,...d.subtotals.map(l=>l.label+'：'+l.value)].filter(Boolean).join('\n');});
    const footer=priceLines(chosen,options).map(l=>l.label+'：'+l.value).join('\n');
    return ['ZOLANO '+(options.hidePrice?'产品选款单':'产品报价单'),date,...body,footer].filter(Boolean).join('\n\n');
  }
  async function copy(value,io){
    try{if(io.writeText){await io.writeText(value);return true;}}catch{}
    try{if(io.legacyCopy?.(value)===true)return true;}catch{}
    io.manual(value);return false;
  }
  const api={snapshot,summary,add,text,copy,cash,manualPrice,discountPrice,discountRates,discountLabel,pricingNote,normalizeOutputOptions,customerDisplay,priceBreakdown,priceLines};
  if(root)root.HP_QUOTATION_CORE=api;
  if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
