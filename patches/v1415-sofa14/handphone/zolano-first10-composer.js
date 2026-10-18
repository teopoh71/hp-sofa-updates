(function initZolanoFirst10Composer() {
  "use strict";

  const registry = window.ZOLANO_FIRST10_REGISTRY;
  const buildPlan = window.buildZolanoPlan;
  const buildGraphic = window.buildZolanoModuleGraphic;
  const stateTools = window.ZOLANO_FIRST10_STATE;
  let mediaScopeReady=false;
  const SUPPORTED = new Set(["3770", "3769", "3761", "3760", "3759", "3757", "3756", "3755", "3752", "3750", "3739", "3738", "3735", "3733", "3731", "3792", "2868", "2707", "2807", "2802", "3753", "2628", "2672", "3136", "2897", "2831", "3778", "3817", "3727", "2911", "3803", "3751", "3737", "3719", "3819", "3818", "3821", "3805", "3838", "3856", "2688", "3315", "3705", "3722", "3799", "3806", "3812"]);
  const MATERIALS = {
    "M/F": { fill: "#777976", dark: "#5f615e", soft: "#92948f" },
    "F/SA": { fill: "#d66028", dark: "#94431f", soft: "#e48658" },
    "NuBuck": { fill: "#aa815f", dark: "#795b43", soft: "#c5a386" }
  };

  if (!registry || typeof buildPlan !== "function" || typeof buildGraphic !== "function" || !stateTools) return;
  window.HP_EXCEL_PRICING_V1392?.applyRegistry(registry);
  SUPPORTED.add("3852");
  SUPPORTED.add("2827");
  registry["3852"] = {
    id:"3852", series:"ZL 3852", title:"ZL 3852 CUSTOZA", sourceImage:"assets/originals/zolano/ZL3852-CUSTOZA.jpg",
    defaultComposition:[], previewOnly:true, materials:["F/SA"],
    modules:[{label:"2EL",width:1750,arms:"left",seats:2},{label:"1ER",width:950,arms:"right",seats:1}].map(item=>({
      ...item,id:`ZL3852-${item.label}`,depth:1300,height:0,sideStatus:"verified",dimensionStatus:"pending",dimensionText:"原图标注宽度；其余尺寸待核实",
      image:`assets/generated/zolano/3852-v1308/${item.label}-preview.png`,imageStatus:"generated-topdown-preview",materialVisualMode:"fixed-preview",
      pricePending:true,pricing:{currency:"CNY",retailCny:{},source:"ZL3852 CUSTOZA 原图；价格待核实"},
      evidence:{modelId:"3852",assetType:"generated-preview",reviewStatus:"source-derived-preview-not-manufacturer-photo"}
    }))
  };

  const exportCompletion = window.applyZolanoExportCompletionV1309?.(registry);
  (exportCompletion?.supportedModelIds || []).forEach(id => SUPPORTED.add(id));
  window.install2850TopViewV1310?.(registry);
  window.installWholeSeatsV1311?.(registry);
  window.installModulePhotosV1317?.(registry);
  window.installZolano2827ComposerV1334?.(registry);
  const sharedElectric = window.HP_SHARED_ELECTRIC_ADAPTER?.apply(registry, { isReadyModule });
  (sharedElectric?.supportedModelIds || []).forEach(id => SUPPORTED.add(id));

  function install2707WholePackages() {
    const model = registry["2707"];
    if (!model || !Array.isArray(model.modules) || model.modules.some((item) => /^ZL2707-\d+-2EL1ER$/.test(String(item.id || "")))) return;
    const packages = [
      { width: 2450, label: "2EL+1ER (2450MM)", sourceRow: 122, prices: [15700, 23800, 27045.4545454545] },
      { width: 2800, label: "2EL+1ER (2.8M)", sourceRow: 125, prices: [18000, 27000, 30681.8181818182] },
      { width: 2900, label: "2EL+1ER (2900MM)", sourceRow: 124, prices: [17100, 28600, 32500] },
      { width:2700,label:"2EL+2ER (2700MM)",sourceRow:123,prices:[16700,25600,29090.91],four:true },
      { width:3210,label:"2EL+2ER (3210MM)",sourceRow:121,prices:[19800,30300,34431.82],four:true },
      { width:3540,label:"2EL+2ER (3540MM)",sourceRow:128,prices:[22200,34000,38636.36],four:true }
    ];
    model.modules = model.modules.filter((item) => !/^2EL\+1ER\b/i.test(String(item.label || item.configuration || "")));
    model.modules.push(...packages.map((entry) => ({
      id: `ZL2707-${entry.width}-${entry.four ? '2EL2ER' : '2EL1ER'}`,
      label: `${entry.label} · 2件整套`,
      configuration: entry.four ? "2EL+2ER" : "2EL+1ER",
      width: entry.width,
      depth: 0,
      height: 0,
      image: `assets/generated/zolano/2707-v1307/${entry.four ? '2el-2er' : '2el-1er'}-top-preview.png`,
      imageStatus: "generated-topdown-preview",
      dimensionStatus: "pending",
      wholePackage: true,
      packageParts: ["2EL", entry.four ? "2ER" : "1ER"],
      pieceCount: 2,
      arms: "both",
      source: `价格表 新 zolano .xlsx#Sheet1!${entry.sourceRow}`,
      pricing: {
        currency: "CNY",
        retailCny: { "M/F": entry.prices[0], "F/SA": entry.prices[1], NuBuck: entry.prices[2] },
        retailSource: `价格表 新 zolano .xlsx#Sheet1!${entry.sourceRow}`
      }
    })));
  }

  install2707WholePackages();
  window.installConfirmed2807Prices?.(registry);
  if (registry["2807"]) registry["2807"].materials = ["M/F", "F/SA", "Oil", "NuBuck"];

  const states = new Map();
  let activeModelId = "";
  mediaScopeReady=true;
  let requestedModelId = "";
  let root = null;
  let dragIndex = -1;
  let pointerStart = null;
  let syncTimer = 0;
  let suppressClickUntil = 0;

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function ensureRoot() {
    if (root && root.isConnected) return root;
    root = document.querySelector("#zolanoFirst10Composer");
    if (!root) {
      root = document.createElement("section");
      root.id = "zolanoFirst10Composer";
      root.className = "zl10-composer";
      root.hidden = true;
      root.setAttribute("aria-live", "polite");
      const anchor = document.querySelector("#zolanoModulePicker");
      if (anchor && anchor.parentElement) anchor.parentElement.insertBefore(root, anchor);
    }
    return root;
  }

  function defaultCompositionFor(modelId) {
    // Start empty; recommended combinations are added only by the user.
    return [];
  }

  function defaultMaterialFor(modelId) {
    const labels = registry[modelId]?.materials || ["M/F", "F/SA", "NuBuck"];
    return labels.find(label => String(label).toUpperCase().replace(/[^A-Z]/g, "") === "FSA") || labels[0] || "M/F";
  }

  function getState(modelId) {
    if (!states.has(modelId)) {
      states.set(modelId, stateTools.createState(defaultCompositionFor(modelId), defaultMaterialFor(modelId)));
    }
    return states.get(modelId);
  }

  function activeCatalogLooksLikeZolano() {
    const bodyKey = String(document.body && document.body.dataset.activeCatalog || "").toLowerCase();
    if (bodyKey === "zolanofull" || bodyKey === "zolano" || bodyKey === "reclinersofa") return true;
    const activeButton = document.querySelector(".catalog-switch-button.is-active,[data-brand-switch].is-active");
    const activeKey = String(activeButton && activeButton.dataset.brandSwitch || "").toLowerCase();
    if (activeKey === "zolanofull" || activeKey === "zolano" || activeKey === "reclinersofa") return true;
    const group = document.querySelector('[data-quick-jump-group="zolano"]');
    return !!(group && !group.hidden && getComputedStyle(group).display !== "none");
  }

  function modelIdFromText(value) {
    const text = String(value || "").toUpperCase();
    for (const modelId of SUPPORTED) {
      if (new RegExp("(?:^|[^0-9])" + modelId + "(?:[^0-9]|$)").test(text)) return modelId;
    }
    return "";
  }

  function detectModelId() {
    if (String(document.body.dataset.activeCatalog || "") === "figaro") {
      return /3136/.test(String(document.querySelector("#seriesSelect")?.value || "")) ? "3136" : "";
    }
    if (!activeCatalogLooksLikeZolano()) return "";
    if (SUPPORTED.has(requestedModelId)) return requestedModelId;
    const seriesSelect = document.querySelector("#seriesSelect");
    const recommendSelect = document.querySelector("#recommendSelect");
    const catalog = document.body.dataset.activeCatalog || "zolano";
    const selectedJump = document.querySelector('[data-quick-jump-group="'+catalog+'"] .is-active');
    return [
      seriesSelect && seriesSelect.value,
      seriesSelect && seriesSelect.selectedOptions && seriesSelect.selectedOptions[0] && seriesSelect.selectedOptions[0].textContent,
      recommendSelect && recommendSelect.selectedOptions && recommendSelect.selectedOptions[0] && recommendSelect.selectedOptions[0].textContent,
      selectedJump && selectedJump.dataset.quickJump,
      selectedJump && selectedJump.textContent
    ].filter(Boolean).map(modelIdFromText).find(Boolean) || "";
  }

  function paletteStyle(materialName) {
    const palette = MATERIALS[materialName] || MATERIALS["M/F"];
    return `--zl10-piece-fill:${palette.fill};--zl10-piece-dark:${palette.dark};--zl10-piece-soft:${palette.soft}`;
  }

  function electricMediaPolicy() {
    if(!mediaScopeReady)return null;
    const policy=window.DEALER_ELECTRIC_MEDIA_POLICY;
    return policy?.applies(activeModelId) ? policy : null;
  }
  function isReadyModule(moduleItem) {return !(moduleItem?.id==="ZL3705-1ERT" && moduleItem?.compositionDisabled) && nativeReadyModule(moduleItem) && (!electricMediaPolicy() || electricMediaPolicy().canCompose(moduleItem,activeModelId));}
  function mediaPlan(model,state) {
    if(!electricMediaPolicy())return buildPlan(model,state.composition);
    const selected=state.composition.map((id,index)=>({id,index,item:model.modules.find(m=>m.id===id)})).filter(x=>isReadyModule(x.item));
    const plan=buildPlan(model,selected.map(x=>x.id));
    for(const piece of plan.pieces)piece.instanceIndex=selected[piece.instanceIndex]?.index??piece.instanceIndex;
    return plan;
  }
  function nativeReadyModule(moduleItem) {
    const sharedReady = window.HP_SHARED_ELECTRIC_ADAPTER?.readinessFor(moduleItem);
    if (sharedReady !== undefined) return sharedReady;
    if (moduleItem?.modelId === "2827") {
      return Object.values(moduleItem.pricing?.materialUsd || {}).some((value) => Number(value) > 0);
    }
    if (moduleItem?.wholePackage) {
      const retail = moduleItem.pricing?.retailCny || {};
      const source = moduleItem.pricing?.materialUsd || {};
      const hasPrice = Object.values(retail).some((value) => Number(value) > 0)
        || Object.values(source).some((value) => Number(value) > 0);
      return Boolean(moduleItem.image && hasPrice);
    }
    if (moduleItem?.imageStatus === "factory-diagram-verified") return Boolean(moduleItem.image && moduleItem.factoryDiagram && moduleItem.width > 0 && moduleItem.depth > 0 && moduleItem.dimensionStatus !== "pending");
    return Boolean(
      moduleItem &&
      ["verified-topdown", "generated-topdown-reviewed", "generated-topdown-preview", "original-photo-crop"].includes(moduleItem.imageStatus) &&
      moduleItem.image
    );
  }

  function isGeneratedModule(moduleItem) {
    return Boolean(moduleItem && ["generated-topdown-reviewed", "generated-topdown-preview"].includes(moduleItem.imageStatus));
  }

  function roundSellingPrice(value) {
    const amount = Number(value);
    if (!Number.isFinite(amount) || amount <= 0) return 0;
    return Math.ceil((amount - 1e-9) / 100) * 100;
  }

  function registryPriceFor(moduleItem, material) {
    const pricing = moduleItem && moduleItem.pricing;
    if(!pricing) return 0;
    if (moduleItem?.evidence?.modelId === "3852" && /nubuck/i.test(String(material).replace(/[^a-z]/gi, ""))
        && pricing.nuBuckStatus === "derived-from-F/SA") {
      const fsaSellingPrice = registryPriceFor(moduleItem, "F/SA");
      return fsaSellingPrice > 0 ? roundSellingPrice(fsaSellingPrice / 0.88) : 0;
    }
    const authoritativeKey = ({"MF":"M/F","FSA":"F/SA","OIL":"Oil","NUBUCK":"NUBUCK"})[
      String(material || "").replace(/[^a-z]/gi, "").toUpperCase()
    ] || material;
    if (pricing.authoritative === true && pricing.retailCny &&
        typeof pricing.retailCny[authoritativeKey] === "number") {
      return Math.round(pricing.retailCny[authoritativeKey] * 100) / 100;
    }
    if (/nubuck/i.test(String(material).replace(/[^a-z]/gi,"")) && String(pricing.nuBuckStatus || "").startsWith("pending")) return 0;
    const values=pricing.retailCny || pricing.materialUsd || {};
    if (/^ZL3852-/.test(String(moduleItem.id)) && authoritativeKey === "NUBUCK"
        && pricing.nuBuckStatus === "derived-from-F/SA"
        && !Object.entries(values).some(([key,value]) => /^(NUBUCK|NEOBUCK)$/i.test(key) && Number(value)>0)) {
      return roundSellingPrice(registryPriceFor(moduleItem,"F/SA") / 0.88);
    }
    return window.SOFA_MATERIAL_PRICING.resolve({
      materials:Object.keys(values),priceOptions:Object.values(values),
      priceIsFinal:!!pricing.retailCny,priceFactor:7.3/0.66,
      source:pricing.retailSource || pricing.source
    },material).sellingPrice;
  }

  function normalizePriceKey(value) {
    return String(value == null ? "" : value)
      .replace(/[\s\u00a0]/g, "")
      .replace(/[（）()]/g, "")
      .toUpperCase();
  }

  function getCurrentSourceModules() {
    try {
      if (typeof getActiveManualModules === "function") {
        const items = getActiveManualModules();
        return Array.isArray(items) ? items : [];
      }
    } catch {}
    return [];
  }

  function sourceWidth(item) {
    const text=String(item.finalPriceLabel || item.dimensions || item.description || item.label || "");
    const mm=text.match(/(\d{3,5})\s*mm/i);
    if(mm) return Number(mm[1]);
    const meters=text.match(/(\d+(?:\.\d+)?)\s*m(?:\b|\))/i);
    return meters ? Math.round(Number(meters[1])*1000) : (Number(item.width)||0);
  }
  function findPriceSource(moduleItem) {
    const modelKey=String(moduleItem?.evidence?.modelId || "");
    const aliases3792={"1NA/T(L)":"1NAT","1NA/B(L)":"1NAB"};
    let label=modelKey==="3792" ? (aliases3792[moduleItem.label] || moduleItem.label) : moduleItem?.label;
    if(modelKey==="2802") label=({"1S":"1S WITH","2S":"2S WITH","2.5S":"2S WITH"})[label]||label;
    if(modelKey==="2707" && label==="3S(2.1M)") label="3S";
    const target=normalizePriceKey(label);
    if(!target || !modelKey) return null;
    const catalogSources=typeof catalogSofas!=="undefined" && Array.isArray(catalogSofas)?catalogSofas:[];
    const raw=Array.isArray(window.BAIDU_ZOLANO_SOFA_DATA)?window.BAIDU_ZOLANO_SOFA_DATA:[];
    const candidates=[...getCurrentSourceModules(),...catalogSources,...raw]
      .filter(item=>{
        const sameModel=new RegExp("(?:^|[^0-9])"+modelKey+"(?:[^0-9]|$)").test([item.series,item.model].join(" "));
        const sameLabel=[item.configuration,item.label].filter(Boolean).some(v=>normalizePriceKey(v)===target);
        return sameModel && sameLabel && !item.pricePending && (Number(item.price)>1 || item.priceOptions?.some(v=>Number(v)>1));
      }).sort((a,b)=>Number(b.priceIsFinal===true)-Number(a.priceIsFinal===true));
    const finalCandidates=candidates.filter(item=>item.priceIsFinal===true);
    const preferred=finalCandidates.length?finalCandidates:candidates;
    const width=Number(moduleItem.priceSourceWidth || moduleItem.width)||0;
    const exact=preferred.filter(item=>sourceWidth(item)===width);
    if(exact.length) return exact[0];
    const unmeasured=preferred.filter(item=>!sourceWidth(item));
    // Do not quote a different size just because its seat/module name is the same.
    if(unmeasured.length && !preferred.some(item=>sourceWidth(item)>0)) return unmeasured[0];
    return null;
  }

  function priceFor(moduleItem, material) {
    if (window.HP_SHARED_ELECTRIC_ADAPTER?.isUnpricedModule(moduleItem?.id)) return 0;
    const listed = window.HP_EXCEL_PRICING_V1392?.lookup(moduleItem, material);
    if (listed) return listed.value;
    if(moduleItem?.id === "ZL2628-1NA" && moduleItem.priceDerivedFrom === "ZL2628-2NA"){
      const parent=window.ZOLANO_FIRST10_REGISTRY["2628"].modules.find(m=>m.id==="ZL2628-2NA");
      return parent ? Math.ceil(priceFor(parent,material)/2/100)*100 : 0;
    }
    if (moduleItem?.priceStatus === "pending" || moduleItem?.pricePending === true) return 0;
    const registryPrice = registryPriceFor(moduleItem, material);
    if (moduleItem?.pricing) return registryPrice;
    const source = findPriceSource(moduleItem);
    if (!source || source.pricePending === true) return 0;
    return window.SOFA_MATERIAL_PRICING.resolve(source, material).sellingPrice;
  }

  function formatPrice(value) {
    if (!value) return "待核价";
    value = Math.round(Number(value) * 100) / 100;
    try {
      if (typeof money !== "undefined" && money && typeof money.format === "function") {
        return exactMoney.format(value);
      }
    } catch {}
    return "¥" + value.toLocaleString("zh-CN", {maximumFractionDigits:2});
  }

  function bundleQuoteFor(model, state) {
    if (model.id === "3778" && state.composition.length === 2 &&
        ["ZL3778-2EL", "ZL3778-1ER"].every(id => state.composition.includes(id)) &&
        stateTools.materialFor(state, 0) === stateTools.materialFor(state, 1) &&
        window.SOFA_MATERIAL_PRICING.normalize(stateTools.materialFor(state, 0)) === "FSA") {
      return { label: "2EL+1ER", material: stateTools.materialFor(state, 0),
        pricing: {retailCny: {...window.HP_EXCEL_PRICING_V1392.records.find(r=>r.row===41).values}},
        source: "价格表 新 zolano .xlsx#Sheet1!41" };
    }
    const audited2868Bundle = window.HP_2868_BUNDLES_V1295?.quote(model, state);
    if (audited2868Bundle) return audited2868Bundle;
    if (model.id !== "2807" || state.composition.length !== 2 ||
        !["ZL2807-2EL", "ZL2807-1ER"].every(id => state.composition.includes(id)) ||
        stateTools.materialFor(state, 0) !== stateTools.materialFor(state, 1)) return null;
    const row = (model.sourceComboQuotes || []).find(r => r.row === state.bundleRow && [48,49,50].includes(r.row));
    if (!row) return null;
    const tableRow = window.HP_EXCEL_PRICING_V1392?.records.find(r=>r.row===({48:66,49:67,50:68})[row.row]);
    return { ...row, ...(tableRow ? {pricing:{retailCny:tableRow.values},source:"价格表 新 zolano .xlsx#Sheet1!"+tableRow.row} : {}), material: stateTools.materialFor(state, 0) };
  }
  function bundlePrice(row) {
    const retail = row?.pricing?.retailCny;
    if (retail) {
      const key = ({"MF":"M/F","FSA":"F/SA","OIL":"Oil","NUBUCK":"NUBUCK"})[String(row.material||"").replace(/[^a-z]/gi,"").toUpperCase()] || row.material;
      return Number.isFinite(retail[key]) ? Math.round(retail[key]*100)/100 : 0;
    }
    if (row?.price != null) return /价格表|retail price list|new-zolano-price-list/.test(row.source || "") ? Math.round(Number(row.price)*100)/100 : Math.ceil(Number(row.price)/100)*100 || 0;
    const materialUsd = row?.materialUsd || row?.pricing?.materialUsd || {};
    if (!Object.keys(materialUsd).length) return 0;
    return window.SOFA_MATERIAL_PRICING.resolve({
      materials: Object.keys(materialUsd), priceOptions: Object.values(materialUsd),
      priceFactor: 7.3 / .66, source: row.source || row.pricing?.source
    }, row.material).sellingPrice;
  }
  function priceSummary(model, state) {
    let total = 0;
    let missing = false;
    state.composition.forEach((moduleId, index) => {
      const moduleItem = model.modules.find((item) => item.id === moduleId);
      const value = priceFor(moduleItem, stateTools.materialFor(state, index));
      if (value > 0) total += value;
      else missing = true;
    });
    const bundle = bundleQuoteFor(model, state);
    if (bundle) { total = bundlePrice(bundle); missing = !(total > 0); }
    total += window.HP_RECLINER_POWER_V1267?.addonTotal(model,state) || 0;
    const discountedTotal = Number(state.discountRate || 1) === 1 ? Math.round(total * 100) / 100 : roundSellingPrice(total * Number(state.discountRate || 1));
    const totalText = missing
      ? (total > 0 ? formatPrice(total) + " · 部分待核价" : "待核价")
      : (total > 0 ? formatPrice(discountedTotal) : "—");
    const note = bundle ? bundle.label + " · 整套售价。" :
      model.id === "2807" && missing ? "请选择下方整套尺寸核算 2EL+1ER；增减模块或混用材质时，整套报价不适用。" : missing
      ? "仅合计已核实价格；缺少价格的模块不会被虚构报价。"
      : (model.id === "3136" ? "MF 布艺" : "");
    return `<div class="zl10-price-summary" aria-label="组合价格">
      <span>组合件数</span><strong data-zl10-piece-count>${state.composition.reduce((count, id) => count + (model.modules.find(item => item.id === id)?.pieceCount || 1), 0)}</strong>
      <span>组合小计</span><strong data-zl10-price data-price-value="${discountedTotal}" data-price-before-discount="${total}" data-price-known="${missing ? "false" : "true"}">${escapeHtml(totalText)}</strong>
      <small>${escapeHtml(note)}</small>
    </div>${!missing && total>0 ? `<div class="discount-calculator">${[[1,"原价"],[.88,"88折"],[.85,"85折"],[.83,"83折"],[.8,"8折"],[.75,"75折"],[.73,"73折"],[.7,"7折"]].map(([rate,label])=>`<button type="button" class="discount-chip${Number(state.discountRate||1)===rate?" is-active":""}" data-zl10-discount="${rate}">${label}</button>`).join("")}</div>`:""}`;
  }

  function sourceComboQuotes(model, state) {
    if (model.id !== "2850" && model.quoteReferences?.length) {
      return `<div class="zl10-source-combos"><strong>原表整件报价</strong>${model.quoteReferences.map(row => `<div class="zl10-price-summary" data-reference-quote="${escapeHtml(row.label)}"><span>${escapeHtml(row.label)}</span><strong>${escapeHtml(formatPrice(bundlePrice({...row, material:state.material})))}</strong></div>`).join("")}<small>1S / 2S / 3S 与图中模块未确认对应，不拆分或套用为模块价格。</small></div>`;
    }
    if (model.id === "3778") {
      const price = bundlePrice({ material: state.material,
        materialUsd: { "F/SA": 1211, "N.b/N.p": 1295 },
        source: "EXPORT 2020 (ZL 3300 )(2).xls#Sheet1!366" });
      return `<div class="zl10-source-combos"><div class="zl10-price-summary"><span>2EL+1ER 整套售价</span><strong>${escapeHtml(formatPrice(price))}</strong></div><small>加入 2EL 和 1ER 并使用相同材质时，自动采用整套报价。1ER 没有独立报价；1ER/T 为不同配置。</small></div>`;
    }
    if (model.id === "2807" && model.sourceComboQuotes) {
      return '<details class="zl10-source-combos" open><summary>整套组合报价 · 不拆分单模块</summary>' + model.sourceComboQuotes.map(row => {
        const price = bundlePrice({...row, material:state.material});
        const label = row.row === 51 ? "2EL+2ER（尺寸待核实）" : row.label;
        const usable = [48,49,50].includes(row.row);
        const tag = usable ? "button" : "div";
        const selected = usable && state.bundleRow === row.row && bundleQuoteFor(model,state);
        return '<'+tag+' class="zl10-price-summary'+(selected ? ' is-active' : '')+'" data-source-combo="'+row.row+'" data-price="'+price+'"'+(usable ? ' type="button" data-zl10-action="use-bundle" data-bundle-row="'+row.row+'" aria-pressed="'+!!selected+'" style="width:100%;cursor:pointer;text-align:left;'+(selected ? 'background:#d8eee7;border:2px solid #168978;' : '')+'"' : '')+'><span>'+escapeHtml(label)+(usable ? ' · 加入组合' : ' · 仅报价')+'</span><strong>'+escapeHtml(formatPrice(price))+'</strong></'+tag+'>';

      }).join('') + '<small>点击尺寸加入 2EL+1ER 两件组合并核算整套价。组合深度及独立模块尺寸待核实。</small></details>';
    }
    const configuration = model.id === "2807" ? "2EL+1ER" : model.id === "3753" ? "1EL+2ER" : "";
    if (!configuration) return "";
    const rows=(window.BAIDU_ZOLANO_SOFA_DATA || []).filter(item=>item.series===model.series && item.configuration===configuration && item.priceIsFinal);
    if(!rows.length) return "";
    return `<details class="zl10-source-combos" open><summary>${escapeHtml(configuration)} 整组售价（单模块未拆价）</summary>${rows.map(item=>`<div class="zl10-price-summary"><span>${escapeHtml(item.description || item.dimensions)}</span><strong>${escapeHtml(formatPrice(window.SOFA_MATERIAL_PRICING.resolve(item,state.material).sellingPrice))}</strong></div>`).join("")}<small>整套售价；不计入上方已选模块合计。</small></details>`;
  }

  function graphicMarkup(item, rotationDeg, className, material) {
    const policy=electricMediaPolicy();
    if(policy && !policy.canDisplay(item,activeModelId))return '<span class="zl10-real-photo-pending" data-electric-module-photo-pending>模块照片补图中</span>';
    const verifiedPhoto=policy?.modulePhoto(item,activeModelId);
    if(verifiedPhoto)return '<img class="'+escapeHtml(className)+' zl10-module-image" data-zl10-real-image="1" src="'+escapeHtml(verifiedPhoto)+'" alt="'+escapeHtml(item.label)+'">';
    if (item?.evidence?.modelId === "3852") {
      const previews = window.ZL3852_MATERIAL_PREVIEWS_V1400?.materials?.[material]?.modules;
      const materialImage = previews?.[item.label];
      if (materialImage) return `<img class="${escapeHtml(className)} zl10-module-image" data-zl10-generated-image="1" data-zl10-material-preview="${escapeHtml(material)}" src="${escapeHtml(materialImage)}" alt="${escapeHtml(item.label)} ${escapeHtml(material)} 材质示意" style="width:100%;height:100%;object-fit:contain;filter:none!important;mix-blend-mode:normal!important">`;
      if (material === "F/SA" && item.image) return `<img class="${escapeHtml(className)} zl10-module-image" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.label)} 模块示意" style="width:100%;height:100%;object-fit:contain;filter:none!important;mix-blend-mode:normal!important">`;
      return `<span class="${escapeHtml(className)} zl10-real-photo-pending" data-zl10-material-pending="1">该材质示意图待确认</span>`;
    }
    return buildGraphic(item, { rotationDeg, className, material });
  }

  function miniStyle(moduleItem) {
    const maxWidth = 88;
    const maxHeight = 62;
    const crop=moduleItem.generatedPage2?.crop;
    const ratio = moduleItem.previewFootprint ? moduleItem.previewFootprint[0]/moduleItem.previewFootprint[1] : Math.max(.2, moduleItem.width>0 && moduleItem.depth>0 ? moduleItem.width/moduleItem.depth : crop ? crop[2]/crop[3] : 1);
    let width = maxWidth;
    let height = width / ratio;
    if (height > maxHeight) {
      height = maxHeight;
      width = height * ratio;
    }
    return `width:${Math.max(24, width).toFixed(1)}px;height:${Math.max(24, height).toFixed(1)}px`;
  }

  function moduleSizeText(moduleItem) {
    const closed = `${moduleItem.width} × ${moduleItem.depth}`;
    const openWidth = Number(moduleItem.openWidth || moduleItem.width);
    const openDepth = Number(moduleItem.openDepth || moduleItem.depth);
    if (openWidth === moduleItem.width && openDepth === moduleItem.depth) return closed + " mm";
    return `收 ${closed} / 展 ${openWidth} × ${openDepth} mm`;
  }

  function moduleSideLabel(moduleItem) {
    if (!moduleItem || moduleItem.sideStatus === "pending") return "";
    if (moduleItem.sideLabel) return String(moduleItem.sideLabel);
    return ({ left: "左扶手", right: "右扶手", both: "双扶手", none: "无扶手" })[moduleItem.arms] || "";
  }

  function moduleCard(moduleItem, state) {
    const count = state.composition.filter((id) => id === moduleItem.id).length;
    const ready = isReadyModule(moduleItem);
    const photoPending=!!electricMediaPolicy() && !electricMediaPolicy().canDisplay(moduleItem,activeModelId);
    const generated = isGeneratedModule(moduleItem);
    const sideLabel = moduleSideLabel(moduleItem);
    const stateClass = count ? " is-used is-active" : "";
    const pendingClass = ready ? "" : " is-resource-pending";
    const moduleId = escapeHtml(moduleItem.id);
    const moduleLabel = escapeHtml(moduleItem.label);
    const visiblePhotoNote = moduleItem.photoNote && !/(AI|示意|非实拍)/i.test(String(moduleItem.photoNote)) ? moduleItem.photoNote : "";
    const is2827PendingPhoto = moduleItem.modelId === "2827";
    const resourceNote = photoPending ? '<span class="module-picker-resource-note">模块照片补图中</span>' : visiblePhotoNote ? `<span class="module-picker-resource-note zl10-photo-provenance">${escapeHtml(visiblePhotoNote)}</span>` : is2827PendingPhoto ? `<span class="module-picker-resource-note">2827 模块原图待补</span>` : moduleItem.wholePackage ? `<span class="zl10-whole-reference-note" style="font-size:10px">俯视示意</span>` : moduleItem.imageStatus === "factory-diagram-verified"
      ? "<span class=\"module-picker-resource-note zl10-photo-provenance\">厂家尺寸图</span>"
      : generated
      ? ""
      : (ready ? "" : "<span class=\"module-picker-resource-note\">独立实拍待补</span>");
    return `<article class="module-picker-button zl10-module-card${stateClass}${pendingClass}" data-module-card-id="${moduleId}" data-zl10-module-card="${moduleId}" data-zl10-ready="${ready ? "true" : "false"}" tabindex="0">
      ${count ? `<span class="module-picker-added-badge">已加入组合</span>` : ""}
      <button class="module-picker-add-zone" type="button" data-zl10-action="add" data-zl10-module-id="${moduleId}" data-module-id="${moduleId}" aria-label="${moduleLabel} ${ready ? "+1" : "暂不可加入"}" ${ready ? "" : "disabled"}>
        <span class="module-picker-image">
          ${photoPending ? '<span class="zl10-real-photo-pending" data-electric-module-photo-pending>模块照片补图中</span>' : is2827PendingPhoto ? `<span class="zl10-real-photo-pending" data-model="2827">真实模块照片待补</span>` : moduleItem.wholePackage ? `<img src="${escapeHtml(moduleItem.image)}" alt="${escapeHtml(moduleItem.label)} 俯视示意" style="width:100%;height:100%;object-fit:contain">` : graphicMarkup(moduleItem, 0, "zl10-mini-svg", state.material)}
        </span>
        <strong class="zl10-module-label">${moduleLabel}</strong>
        <span class="module-picker-module-size module-picker-size" title="${escapeHtml(moduleItem.dimensionSource || moduleSizeText(moduleItem))}">${moduleItem.dimensionStatus === "pending" ? escapeHtml(moduleItem.dimensionText || "尺寸待确认") : escapeHtml(moduleSizeText(moduleItem))}</span>
        ${moduleItem.height > 0 ? `<span class="module-picker-size">高 ${moduleItem.height} mm</span>` : ""}
        ${sideLabel ? `<span class="module-picker-size">${escapeHtml(sideLabel)}</span>` : ""}
        ${moduleItem.sideStatus === "pending" ? '<span class="module-picker-resource-note">左右方向待核实</span>' : ""}
        ${resourceNote}
        <span class="module-picker-price zl10-unit-price" data-unit-price="${priceFor(moduleItem, state.material)}" style="font-size:11px;line-height:1.3">${escapeHtml(formatPrice(priceFor(moduleItem, state.material)))}</span>
      </button>
      <div class="module-picker-quantity-control zl10-card-bottom" aria-label="${moduleLabel} quantity">
        <button type="button" class="module-picker-step module-picker-minus zl10-step" data-zl10-action="remove" data-module-id="${moduleId}" aria-label="${moduleLabel} -1" ${count ? "" : "disabled"}>−</button>
        <output class="module-picker-quantity-value zl10-count" aria-live="polite">${count}</output>
        <button type="button" class="module-picker-step module-picker-plus zl10-step" data-zl10-action="add" data-module-id="${moduleId}" data-zolano-module-id="${moduleId}" aria-label="${moduleLabel} +1" ${ready ? "" : "disabled"}>+</button>
      </div>
    </article>`;
  }

  function pieceMarkup(piece, state, scale, leftOffset, topOffset) {
    const selected = piece.instanceIndex === state.selectedIndex;
    const left = leftOffset + piece.x * scale;
    const top = topOffset + piece.y * scale;
    const width = Math.max(20, piece.width * scale);
    const height = Math.max(20, piece.depth * scale);
    const moduleItem = registry[activeModelId].modules.find((item) => item.id === piece.moduleId) || piece;
    if (moduleItem.wholePackage) return "";
    const pieceMaterial = stateTools.materialFor(state, piece.instanceIndex);
    const freeRotation = piece.freeRotation === true;
    const shapeStyle = freeRotation
      ? `inset:auto;left:0;top:0;width:${(piece.physicalWidth * scale).toFixed(1)}px;height:${(piece.physicalDepth * scale).toFixed(1)}px;transform-origin:0 0;transform:translate(${(piece.shapeOffsetX * scale).toFixed(1)}px,${(piece.shapeOffsetY * scale).toFixed(1)}px) rotate(${piece.rotationDeg}deg);${paletteStyle(pieceMaterial)}`
      : paletteStyle(pieceMaterial);
    const graphicRotation = freeRotation ? 0 : piece.rotationDeg;
    return `<div role="button" tabindex="0"
      class="zl10-piece${selected ? " is-selected" : ""}"
      data-zl10-plan-piece
      data-index="${piece.instanceIndex}"
      draggable="false"
      style="left:${left.toFixed(1)}px;top:${top.toFixed(1)}px;width:${width.toFixed(1)}px;height:${height.toFixed(1)}px"
      aria-label="${escapeHtml(piece.label)} · ${escapeHtml(pieceMaterial)}，点击换材质；拖动排序，拖出删除" title="${escapeHtml(piece.label)} · ${escapeHtml(pieceMaterial)}">
      <span class="zl10-piece-shape" style="${shapeStyle}">
        ${graphicMarkup(moduleItem, graphicRotation, "zl10-piece-svg", pieceMaterial)}
      </span>
      <span class="zl10-piece-label">${escapeHtml(piece.label)} · ${escapeHtml(pieceMaterial)}</span>
      
    </div>`;
  }

  function setPalette(state) {
    const palette = MATERIALS[state.material] || MATERIALS["M/F"];
    root.style.setProperty("--zl10-fill", palette.fill);
    root.style.setProperty("--zl10-fill-dark", palette.dark);
    root.style.setProperty("--zl10-fill-soft", palette.soft);
  }

  function render() {
    if (!activeModelId || !SUPPORTED.has(activeModelId)) return;
    const model = registry[activeModelId];
    const allModules = Array.isArray(model.modules) ? model.modules : [];
    const readyModules = allModules.filter(isReadyModule);
    const generatedModules = readyModules.filter(isGeneratedModule);
    const diagramModules = readyModules.filter(item => item.imageStatus === "factory-diagram-verified");
    const mediaPolicy=electricMediaPolicy();
    const readyIds = new Set((mediaPolicy ? allModules : readyModules).map((item) => item.id));
    const state = getState(activeModelId);
    const filteredComposition = [];
    const filteredMaterials = [];
    const filteredPower = [];
    state.composition.forEach((moduleId, index) => {
      if (readyIds.has(moduleId)) {
        filteredComposition.push(moduleId);
        filteredPower.push(!!state.powerOptions?.[index]);
        filteredMaterials.push(stateTools.materialFor(state, index));
      }
    });
    if (filteredComposition.length !== state.composition.length) {
      state.composition = filteredComposition;
      state.powerOptions = filteredPower;
      state.materials = filteredMaterials;
      state.selectedIndex = -1;
    }
    stateTools.normalize(state);

    setPalette(state);
    // Unknown physical sizes stay zero in source data; these units only size the illustration.
    const visualModel = { ...model, modules: model.modules.map(item =>
      item.previewFootprint ? { ...item, width:item.previewFootprint[0], depth:item.previewFootprint[1] } : item) };
    const plan = mediaPlan(visualModel,state);
    const missingPhotoSelections=mediaPolicy ? state.composition.map((id,index)=>({item:allModules.find(m=>m.id===id),index})).filter(x=>!isReadyModule(x.item)) : [];
    const electricNoPlan=!!mediaPolicy && readyModules.length===0;
    const missingSelectionMarkup=missingPhotoSelections.map(({item,index})=>`<div class="zl10-removable-card" data-electric-selected-pending style="display:flex;justify-content:space-between;align-items:center;padding:8px"><span>${escapeHtml(item?.label||state.composition[index])} · ${mediaPolicy.canDisplay(item,activeModelId) ? "尺寸待核" : "模块图待补"}</span><button type="button" data-zl10-action="delete" data-index="${index}">移除</button></div>`).join("");
    const is2827UnknownLayout = activeModelId === "2827" && state.composition.length > 0;
    const hasProportionalPieces = state.composition.some(id => model.modules.find(m => m.id === id)?.previewFootprint);
    const chosenBundle = bundleQuoteFor(model, state);
    const rootWidth = Math.max(300, ensureRoot().getBoundingClientRect().width || 540);
    const canvasWidth = rootWidth - 22;
    const availableWidth = Math.max(260, canvasWidth - 24);
    const availableHeight = Math.max(300, Math.min(720, (window.innerHeight || 800) * 0.6));
    const scale = Math.min(
      availableWidth / Math.max(1, plan.widthMm),
      availableHeight / Math.max(1, plan.depthMm)
    );
    const drawnWidth = plan.widthMm * scale;
    const drawnHeight = plan.depthMm * scale;
    const canvasHeight = Math.max(300, Math.min(availableHeight + 36, drawnHeight + 36));
    const leftOffset = Math.max(12, (canvasWidth - drawnWidth) / 2);
    const topOffset = Math.max(12, (canvasHeight - drawnHeight) / 2);
    const activeMaterial = state.material;
    const materialButton = (name) => {
      const color = activeModelId === "2807" ? ({"M/F":"#BFBAB0","F/SA":"#20354D","Oil":"#B78B64","NuBuck":"#BE915D"})[name] : "";
      const label = activeModelId === "2807" ? ({"M/F":"M/F 布艺","F/SA":"CAT30 皮革","Oil":"油蜡皮","NuBuck":"NuBuck 绒感"})[name] : name;
      return '<button type="button" class="zl10-material'+(activeMaterial===name?' is-selected':'')+'" data-zl10-material="'+name+'"'+(color?' style="background:'+color+';color:'+(name==="F/SA"?"#fff":"#263432")+'"':'')+'>'+label+'</button>';
    };
    const openWidthMm = activeModelId === "2868"
      ? state.composition.reduce((total, moduleId) => {
          const moduleItem = model.modules.find((item) => item.id === moduleId);
          return total + Number((moduleItem && (moduleItem.openWidth || moduleItem.width)) || 0);
        }, 0)
      : 0;
    const openDepthMm = activeModelId === "2868"
      ? state.composition.reduce((maximum, moduleId) => {
          const moduleItem = model.modules.find((item) => item.id === moduleId);
          return Math.max(maximum, Number((moduleItem && (moduleItem.openDepth || moduleItem.depth)) || 0));
        }, 0)
      : 0;
    const planSizeText = electricNoPlan ? (allModules.some(item=>mediaPolicy.canDisplay(item,activeModelId)) ? "尺寸待核" : "模块照片补图中") : missingPhotoSelections.length ? "含待补项目 · 尺寸待核" : state.composition.some(id => model.modules.find(item => item.id === id)?.wholePackage)
      ? "整套报价 · 独立模块尺寸待核实"
      : chosenBundle?.id === "3460"
      ? chosenBundle.label
      : chosenBundle?.id === "3890"
      ? chosenBundle.label
      : hasProportionalPieces
      ? (chosenBundle ? chosenBundle.label + " · 独立模块尺寸待核实" : "独立模块尺寸待核实")
      : model.previewOnly ? "尺寸待核实" : activeModelId === "2868"
      ? `收合 ${plan.mainWidthMm} × ${plan.mainDepthMm} mm · 展开 ${openWidthMm} × ${openDepthMm} mm`
      : `约 ${Math.round(plan.mainWidthMm / 10) * 10} × ${Math.round(plan.mainDepthMm / 10) * 10} mm`;
    const availabilityNote = mediaPolicy && allModules.some(item=>!mediaPolicy.canDisplay(item,activeModelId)) ? "模块照片补图中；已有选品保留。" : diagramModules.length
      ? "按厂家尺寸图排列；图示不代表真实外观或材质。资料不足的项目保留待核实。材质切换仅更新已核实报价。"
      : readyModules.length < allModules.length
      ? (readyModules.length
        ? "未核实独立实拍的模块保留在列表中，暂不可加入组合。"
        : "此型号暂缺可核实的独立真实模块照片，组合入口保持禁用。")
      : "";

    root.dataset.model = activeModelId;
    root.innerHTML = `<div class="zl10-head">
        <h3 class="zl10-title">${escapeHtml(model.title)}</h3>
      </div>
      ${window.HP_RECLINER_POWER_V1267?.renderPanel(model,state.material,state)||""}
      ${mediaPolicy && allModules.some(item=>!mediaPolicy.canDisplay(item,activeModelId)) ? mediaPolicy.referenceMarkup(model) : ""}
      <div class="zl10-module-grid module-picker-grid">
        ${allModules.map((moduleItem) => moduleCard(moduleItem, state)).join("")}
      </div>
      <div class="zl10-preview-card"><div class="zl10-section-head">
        <strong>${electricNoPlan ? "原厂配置" : model.compositionMode === "whole-units" ? "整件摆放预览" : diagramModules.length ? "尺寸图组合" : "组合预览"}</strong>
        <span class="zl10-size">${planSizeText}</span>
      </div>
      <div class="zl10-plan" style="${electricNoPlan ? 'height:auto;min-height:0;padding:8px' : is2827UnknownLayout ? 'min-height:80px;padding:18px' : state.composition.some(id => model.modules.find(item => item.id === id)?.wholePackage) ? 'height:auto;min-height:180px;display:grid;gap:12px;padding:14px' : `height:${canvasHeight.toFixed(0)}px`}">
        ${electricNoPlan ? '<p style="margin:0;color:#64706c">模块图或尺寸资料待补，当前显示整款参考图。</p>' : is2827UnknownLayout ? '<div class="zl10-real-photo-pending" data-zl10-layout-pending="2827">2827 模块物理尺寸待核实，暂不绘制比例布局。</div>' + state.composition.map((id,index) => { const item=model.modules.find(m=>m.id===id); return `<div class="zl10-removable-card" role="button" tabindex="0" data-zl10-plan-piece data-index="${index}" draggable="true"><span>${escapeHtml(item?.label||id)}</span><button type="button" data-zl10-action="delete" data-index="${index}">移除</button></div>`; }).join('') : state.composition.some(id => model.modules.find(item => item.id === id)?.wholePackage)
          ? state.composition.map((id,index) => {
              const item = model.modules.find(module => module.id === id);
              const preview = item?.wholePackage
                ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.label)} AI俯视示意" style="width:100%;max-height:170px;object-fit:contain">`
                : `<div class="zl10-mixed-module-graphic">${graphicMarkup(item, 0, "zl10-piece-svg", stateTools.materialFor(state, index))}</div>`;
              const provenance = item?.wholePackage ? "俯视示意" : "模块示意";
              return `<div class="zl10-removable-card" role="button" tabindex="0" data-zl10-plan-piece data-index="${index}" draggable="true" data-zl10-set-preview="${escapeHtml(id)}">${preview}<div style="display:flex;align-items:center;justify-content:space-between"><span>${escapeHtml(item.label)} · ${provenance}</span><button type="button" data-zl10-action="delete" data-index="${index}">移除</button></div></div>`;
            }).join('')
          : plan.pieces.map((piece) => pieceMarkup(piece, state, scale, leftOffset, topOffset)).join("")}
      </div>
      ${missingSelectionMarkup}
      </div>
      <div class="zl10-materials">
        <div class="zl10-material-head">
          <strong>面料 · 全套统一</strong>
          <button type="button" class="zl10-material-all is-active" data-zl10-action="material-all">全套统一</button>
        </div>
        <div class="zl10-material-row">
          ${(model.materials || ["F/SA","M/F","NuBuck"]).map(materialButton).join("")}
        </div>
      </div>
      <div class="zl10-bottom-pricing">
        ${priceSummary(model, state)}
        ${window.HP_2868_BUNDLES_V1295?.render(model, state) || ""}
        ${sourceComboQuotes(model,state)}
      </div>`;
    if (window.HP_ORIGINAL_SERIES_GALLERY?.render) {
      root.insertAdjacentHTML("beforeend", window.HP_ORIGINAL_SERIES_GALLERY.render(model.series || model.title, model));
      window.HP_BIND_PHOTO_GALLERY?.(root);
    }
  }

  function addModule(moduleId) {
    const model = registry[activeModelId];
    const moduleItem = model && model.modules.find((item) => item.id === moduleId);
    if (!moduleItem || !isReadyModule(moduleItem)) return;
    const state = getState(activeModelId);
    window.HP_2868_BUNDLES_V1295?.clear(state);
    if (state.composition.length >= 10) return;
    stateTools.addPiece(state, moduleId);
    render();
  }

  function removeModule(moduleId) {
    const state = getState(activeModelId);
    window.HP_2868_BUNDLES_V1295?.clear(state);
    if (stateTools.removeLastPiece(state, moduleId)) render();
  }

  function movePiece(index, delta) {
    const state = getState(activeModelId);
    window.HP_2868_BUNDLES_V1295?.clear(state);
    if (stateTools.movePiece(state, index, delta)) render();
  }

  function deletePiece(index) {
    const state = getState(activeModelId);
    window.HP_2868_BUNDLES_V1295?.clear(state);
    if (stateTools.deletePiece(state, index)) render();
  }

  function handleAction(action, element) {
    const moduleId = element.dataset.moduleId || "";
    const index = Number(element.dataset.index);
    if (action === "use-2868-bundle" && activeModelId === "2868") {
      const state = getState(activeModelId);
      if (window.HP_2868_BUNDLES_V1295?.select(state, element.dataset["2868Bundle"])) render();
    }
    else if (action === "use-bundle" && activeModelId === "2807") {
      const row = Number(element.dataset.bundleRow);
      if (![48,49,50].includes(row)) return;
      const next = stateTools.createState(["ZL2807-2EL","ZL2807-1ER"], getState(activeModelId).material);
      next.bundleRow = row;
      states.set(activeModelId, next);
      render();
    }
    else if (action === "add") addModule(moduleId);
    else if (action === "remove") removeModule(moduleId);
    else if (action === "move-left") movePiece(index, -1);
    else if (action === "move-right") movePiece(index, 1);
    else if (action === "delete") deletePiece(index);
    else if (action === "material-all") {
      getState(activeModelId).selectedIndex = -1;
      render();
    }
  }

  function cyclePiece(index) {
    const state = getState(activeModelId);
    window.HP_2868_BUNDLES_V1295?.clear(state);
    const labels = registry[activeModelId].materials || Object.keys(MATERIALS);
    state.selectedIndex = index;
    stateTools.applyMaterial(state, labels[(labels.indexOf(stateTools.materialFor(state, index)) + 1) % labels.length]);
    render();
  }

  function finishMove(index, x, y) {
    const plan = root.querySelector(".zl10-plan");
    if (!plan) return;
    const box = plan.getBoundingClientRect();
    if (x < box.left || x > box.right || y < box.top || y > box.bottom) {
      deletePiece(index);
      return;
    }
    const target = document.elementFromPoint(x, y)?.closest("[data-zl10-plan-piece]");
    if (!target) return;
    const to = Number(target.dataset.index);
    const state = getState(activeModelId);
    let from = index;
    while (from !== to) {
      const step = to > from ? 1 : -1;
      if (!stateTools.movePiece(state, from, step)) break;
      from += step;
    }
    render();
  }

  function bindRootEvents() {
    const composer = ensureRoot();
    composer.addEventListener("click", (event) => {
      const material = event.target.closest("[data-zl10-material]");
      if (material) {
        const state = getState(activeModelId);
        stateTools.applyAllMaterial(state, material.dataset.zl10Material);
        render();
        return;
      }

      const action = event.target.closest("[data-zl10-action]");
      if (action) {
        event.preventDefault();
        event.stopPropagation();
        handleAction(action.dataset.zl10Action, action);
        return;
      }

      const piece = event.target.closest("[data-zl10-plan-piece]");
      if (piece) {
        if (Date.now() < suppressClickUntil) return;
        cyclePiece(Number(piece.dataset.index));
        return;
      }

      const card = event.target.closest("[data-zl10-module-card]");
      if (card && card.dataset.zl10Ready === "true") addModule(card.dataset.zl10ModuleCard);
    });

    composer.addEventListener("keydown", (event) => {
      const piece = event.target.closest("[data-zl10-plan-piece]");
      if (piece) {
        const index = Number(piece.dataset.index);
        if (["Enter", " ", "ArrowLeft", "ArrowRight", "Delete", "Backspace"].includes(event.key)) {
          event.preventDefault();
          if (event.key === "Enter" || event.key === " ") cyclePiece(index);
          else if (event.key === "Delete" || event.key === "Backspace") deletePiece(index);
          else movePiece(index, event.key === "ArrowLeft" ? -1 : 1);
          root.querySelector('[data-zl10-plan-piece][data-index="' + getState(activeModelId).selectedIndex + '"]')?.focus();
        }
        return;
      }
      const card = event.target.closest("[data-zl10-module-card]");
      if (!card || event.target.closest("[data-zl10-action]")) return;
      if (card.dataset.zl10Ready !== "true") return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        addModule(card.dataset.zl10ModuleCard);
      }
    });

    composer.addEventListener("dragstart", (event) => {
      const piece = event.target.closest("[data-zl10-plan-piece]");
      if (!piece) return;
      dragIndex = Number(piece.dataset.index);
      pointerStart = null;
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", String(dragIndex));
      }
    });
    document.addEventListener("dragover", (event) => {
      if (dragIndex >= 0) event.preventDefault();
    });
    document.addEventListener("drop", (event) => {
      if (dragIndex < 0) return;
      event.preventDefault();
      const index = dragIndex;
      dragIndex = -1;
      suppressClickUntil = Date.now() + 400;
      finishMove(index, event.clientX, event.clientY);
    });
    document.addEventListener("dragend", () => {
      dragIndex = -1;
      pointerStart = null;
      suppressClickUntil = Date.now() + 400;
    });
    function clearPointer() {
      const start = pointerStart; pointerStart = null;
      if (!start) return;
      start.piece.style.transform = "";
      start.piece.style.opacity = "";
      start.piece.style.pointerEvents = "";
      start.plan?.classList.remove("hp-remove-target");
      if (start.piece.hasPointerCapture(start.id)) start.piece.releasePointerCapture(start.id);
    }
    composer.addEventListener("pointerdown", (event) => {
      const piece = event.target.closest("[data-zl10-plan-piece]");
      if (!piece || event.button !== 0 || pointerStart || event.isPrimary === false || event.target.closest("button")) return;
      pointerStart = { id:event.pointerId,index:Number(piece.dataset.index),x:event.clientX,y:event.clientY,piece,plan:piece.closest(".zl10-plan"),moved:false };
      piece.setPointerCapture(event.pointerId);
    });
    document.addEventListener("pointermove", (event) => {
      if (!pointerStart || event.pointerId !== pointerStart.id) return;
      const start=pointerStart, dx=event.clientX-start.x,dy=event.clientY-start.y;
      if (!start.moved && Math.hypot(dx,dy)<12) return;
      start.moved=true;event.preventDefault();
      start.piece.style.transform="translate("+dx+"px,"+dy+"px)";
      start.piece.style.opacity=".6";
      const box=start.plan?.getBoundingClientRect();
      if(box) start.plan.classList.toggle("hp-remove-target",event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom);
    },{passive:false});
    document.addEventListener("pointercancel", event => {if(pointerStart?.id===event.pointerId) clearPointer();});
    document.addEventListener("pointerup", (event) => {
      if (!pointerStart || event.pointerId!==pointerStart.id) return;
      const start=pointerStart;
      clearPointer();
      if(!start.moved) return;
      suppressClickUntil=Date.now()+500;
      start.piece.style.pointerEvents="none";
      finishMove(start.index,event.clientX,event.clientY);
      start.piece.style.pointerEvents="";
    });
    window.addEventListener("blur",clearPointer);
  }

  function sync() {
    const modelId = detectModelId();
    const composer = ensureRoot();
    const isActive = SUPPORTED.has(modelId) && !!registry[modelId];
    document.body.classList.toggle("zl10-shared-active", isActive);
    composer.hidden = !isActive;
    if (!isActive) {
      activeModelId = "";
      return;
    }
    if (activeModelId !== modelId) {
      activeModelId = modelId;
      states.set(modelId, stateTools.createState(defaultCompositionFor(modelId), defaultMaterialFor(modelId)));
      render();
    } else if (!composer.querySelector(".zl10-module-grid")) {
      render();
    }
  }

  function scheduleSync() {
    clearTimeout(syncTimer);
    syncTimer = setTimeout(sync, 30);
  }

  window.SOFA_COMPOSER_PRICE_AUDIT = function() {
    return Object.values(registry).filter(model=>SUPPORTED.has(model.id)).flatMap(model=>
      model.modules.flatMap(item=>(model.materials || ["M/F","F/SA","NuBuck"]).map(material=>{
        const pricing=item.pricing;
        let source=findPriceSource(item);
        if(pricing) {
          const values=pricing.retailCny || pricing.materialUsd || {};
          source={materials:Object.keys(values),priceOptions:Object.values(values),priceIsFinal:!!pricing.retailCny,priceFactor:7.3/.66,source:pricing.retailSource || pricing.source};
        }
        const detail=window.SOFA_MATERIAL_PRICING.resolve(source || {},material);
        return {model:model.id,module:item.label,width:item.width,depth:item.depth,material,actualSellingPrice:priceFor(item,material),...detail,
          sourceVerification:pricing?.verification || (model.id==="3136"?"original-workbook-read":"original-or-transcribed-source-needs-cross-check"),sourceSha256:pricing?.sourceSha256 || null,openWidth:item.openWidth,openDepth:item.openDepth,modulePriceDerived:!!pricing?.derived};
      }))
    );
  };
  ensureRoot().addEventListener("click",event=>{
    const powerButton=event.target.closest("[data-zl10-power]");
    if(powerButton){
      if(window.HP_RECLINER_POWER_V1267?.toggle(registry[activeModelId],getState(activeModelId),Number(powerButton.dataset.zl10Power))) render();
      return;
    }
    const button=event.target.closest("[data-zl10-discount]");
    if(!button)return;
    getState(activeModelId).discountRate=Number(button.dataset.zl10Discount)||1;
    render();
  });

  bindRootEvents();
  document.querySelector('#builderClearAllButton')?.addEventListener('click', () => {
    if (!activeModelId) return;
    const material = getState(activeModelId).material;
    states.set(activeModelId, stateTools.createState([], material));
    render();
  });
  document.addEventListener("change", (event) => {
    if (event.target && event.target.id === "seriesSelect") requestedModelId = "";
    scheduleSync();
  }, true);
  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const quickJump = target && target.closest('[data-quick-jump^="zolanoFull|"],[data-quick-jump^="zolano|"],[data-quick-jump^="reclinerSofa|"],[data-quick-jump^="figaro|"]');
    if (quickJump) {
      const quickJumpText = (quickJump.dataset.quickJump || "") + " " + quickJump.textContent;
      requestedModelId = modelIdFromText(quickJumpText);
    }
    const brandSwitch = target && target.closest("[data-brand-switch]");
    if (brandSwitch && String(brandSwitch.dataset.brandSwitch || "").toLowerCase() !== "zolano") {
      requestedModelId = "";
    }
    scheduleSync();
    setTimeout(sync, 140);
    setTimeout(sync, 420);
  }, true);
  window.addEventListener("resize", () => {
    if (activeModelId) render();
  });
  window.HP_FIRST10_PRICE_PENDING = function (value) {
    try {
      const key=JSON.parse(value.key),model=registry[key[1]],ids=key[2];
      if(key[0]!=='zl10'||!model||!Array.isArray(ids)||!ids.length)return true;
      const materials=Array.isArray(key[3])?key[3]:ids.map(()=>key[3]||value.material);
      const state={composition:ids,materials,material:materials[0],powerOptions:Array.isArray(key[4])?key[4]:ids.map(()=>false),discountRate:1,bundleSelection:key[6],bundleRow:key[6]?.row};
      if(ids.some(id=>!model.modules.some(m=>m.id===id)))return true;
      const bundle=bundleQuoteFor(model,state);
      return bundle?!(bundlePrice(bundle)>0):ids.some((id,i)=>!(priceFor(model.modules.find(m=>m.id===id),stateTools.materialFor(state,i))>0));
    }catch{return true;}
  };
  window.HP_FIRST10_QUOTE = function () {
    if (!activeModelId || !root || root.hidden || !document.body.classList.contains('zl10-shared-active')) return null;
    const model=registry[activeModelId], state=getState(activeModelId), price=root.querySelector('[data-zl10-price]');
    if(!state.composition.length)throw Error('请先选择要报价的模块');
    const parts=state.composition.map((id,i)=>{const row=model.modules.find(r=>r.id===id);return (row?.label||row?.configuration||id)+' '+window.HP_QUOTE_BRIDGE.material(stateTools.materialFor(state,i))+(state.powerOptions?.[i]?' 电动':'');});
    const rate=[1,.88,.85,.83,.8,.75,.73,.7,.6].includes(Number(state.discountRate))?Number(state.discountRate):1;
    const known=price?.dataset.priceKnown==='true',basePrice=known?Math.round(Number(price.dataset.priceBeforeDiscount)*100)/100:null,currentPrice=known?Number(price.dataset.priceValue):null;
    const sharePlan=mediaPlan(model,state);
    const customerPieces=electricMediaPolicy() ? state.composition.map((id,index)=>{const p=sharePlan.pieces.find(p=>p.instanceIndex===index),material=stateTools.materialFor(state,index);return p?{id,material,rotation:p.rotationDeg,x:p.x+(p.width-p.physicalWidth)/2,y:p.y+(p.depth-p.physicalDepth)/2}:{id,material,missingModuleImage:!electricMediaPolicy().canDisplay(model.modules.find(m=>m.id===id),activeModelId),dimensionStatus:"pending"};}) : sharePlan.pieces.map(p=>({id:p.moduleId,material:stateTools.materialFor(state,p.instanceIndex),rotation:p.rotationDeg,x:p.x+(p.width-p.physicalWidth)/2,y:p.y+(p.depth-p.physicalDepth)/2}));
    const customerSelection={model:activeModelId,material:state.material,pieces:customerPieces};
    return {customerSelection,key:JSON.stringify(['zl10',activeModelId,state.composition,state.materials,state.powerOptions,rate,state.bundleSelection]),title:model.title||model.series,configuration:parts.join(' + '),parts,material:[...new Set(state.composition.map((id,i)=>window.HP_QUOTE_BRIDGE.material(stateTools.materialFor(state,i))))].join(' / '),dimensions:root.querySelector('.zl10-size')?.textContent||'待核实',price:currentPrice,basePrice,priceMode:rate<1?'discount':'original',discountRate:rate,visual:root.querySelector('.zl10-plan'),image:model.sourceImage||'',imageNote:'组合示意'};
  };
  setInterval(sync, 700);
  sync();
})();
