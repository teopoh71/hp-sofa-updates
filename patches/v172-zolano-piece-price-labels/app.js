const storageKey = "hp-sofa-price-list";
const currentAppVersion = window.HP_SOFA_APP_VERSION || {
  versionCode: 0,
  versionName: "local",
  updateManifestUrl: "update.json",
  patchVersionCode: 0,
  patchManifestUrl: ""
};
const patchCacheName = "hp-sofa-patch-cache";
const patchVersionStorageKey = "hp-sofa-patch-version-code";
const patchNameStorageKey = "hp-sofa-patch-version-name";

const form = document.querySelector("#sofaForm");
const photoInput = document.querySelector("#photoInput");
const photoPreview = document.querySelector("#photoPreview");
const nameInput = document.querySelector("#nameInput");
const priceInput = document.querySelector("#priceInput");
const detailsInput = document.querySelector("#detailsInput");
const searchInput = document.querySelector("#searchInput");
const brandFilter = document.querySelector("#brandFilter");
const sofaList = document.querySelector("#sofaList");
const template = document.querySelector("#sofaCardTemplate");
const itemCount = document.querySelector("#itemCount");
const totalValue = document.querySelector("#totalValue");
const exportButton = document.querySelector("#exportButton");
const importInput = document.querySelector("#importInput");
const themeToggle = document.querySelector("#themeToggle");
const entryPanel = document.querySelector("#entryPanel");
const panelToggle = document.querySelector("#panelToggle");
const brandSwitchButtons = [...document.querySelectorAll("[data-brand-switch]")];
const seriesSelect = document.querySelector("#seriesSelect");
const modelJumpSelect = document.querySelector("#modelJumpSelect");
const recommendSelect = document.querySelector("#recommendSelect");
const materialSelect = document.querySelector("#materialSelect");
const widthFilterInput = document.querySelector("#widthFilterInput");
const widthFilterButtons = [...document.querySelectorAll("[data-width-filter]")];
const typeFilterButtons = [...document.querySelectorAll("[data-type-filter]")];
const comboButtonPanel = document.querySelector("#comboButtonPanel");
const builderSearchInput = document.querySelector("#builderSearchInput");
const slotGrid = document.querySelector("#slotGrid");
const setPreview = document.querySelector("#setPreview");
const setTotal = document.querySelector("#setTotal");

const excludedCatalogIds = new Set([
]);
const matchingCatalogData = Array.isArray(window.BAIDU_MATCHING_DATA) ? window.BAIDU_MATCHING_DATA : [];

function getCatalogText(item) {
  return [
    item?.series,
    item?.model,
    item?.name,
    item?.configuration,
    item?.description,
    item?.details
  ].join(" ");
}

function isDiningTableItem(item) {
  const text = getCatalogText(item);
  return /餐桌|餐台/.test(text) || /\bDT\b/i.test(`${item?.series || ""} ${item?.model || ""}`);
}

function isDiningChairItem(item) {
  const text = getCatalogText(item);
  return /餐椅/.test(text) || /\bCH\b/i.test(`${item?.series || ""} ${item?.model || ""}`);
}

function isDiningItem(item) {
  return isDiningTableItem(item) || isDiningChairItem(item);
}

function getDiningDisplayKey(item) {
  return getDiningCoreModelKey(item) || getDiningModelFamilyKey(item) || item?.photo || "";
}

function isDiningTurntableItem(item) {
  const text = getCatalogText(item);
  const dimensions = String(item?.dimensions || "");
  return /转盘/.test(text) || /^[φΦϕФ]\d{3,4}$/i.test(dimensions.trim());
}

function isBuyableDiningTableItem(item) {
  const text = getCatalogText(item);
  return /餐桌|餐台/.test(text) && !isDiningTurntableItem(item);
}

function getBuyableDiningTableKey(item) {
  return String(item?.series || item?.model || item?.id || "")
    .replace(/\s+/g, "")
    .toUpperCase();
}

function normalizeDiningTableSeries(item) {
  const root = getDiningFamilyRoot(item);
  if (root) return root;
  return String(item?.series || item?.model || "")
    .replace(/-\d{3,4}x\d{3,4}x\d{3,4}mm$/i, "")
    .replace(/-\d{3,4}x\d{3,4}mm$/i, "");
}

function normalizeDiningTableItem(item) {
  const normalizedSeries = normalizeDiningTableSeries(item);
  if (!normalizedSeries || normalizedSeries === item.series) return item;
  return {
    ...item,
    originalSeries: item.series,
    series: normalizedSeries
  };
}

function getDiningFamilyRoot(item) {
  return String(item?.series || item?.model || "").match(/NK\d{4}DT/i)?.[0]?.toUpperCase() || "";
}

function getDiningSizeValue(item) {
  const text = getCatalogText(item);
  const diameter = text.match(/[φΦϕФ](\d{3,5})/);
  if (diameter) return Number(diameter[1]);
  const meter = text.match(/(\d+(?:\.\d+)?)\s*(?:\u7c73|M\b)/i);
  if (meter) return Number(meter[1]) * 1000;
  const dims = String(item?.dimensions || "").match(/(\d{3,5})/);
  return dims ? Number(dims[1]) : Number(item?.width || 0);
}

function getRelatedDiningTurntables(item) {
  const turntables = getDiningFamilyTurntables(item);
  if (!turntables.length) return [];

  const itemSize = getDiningSizeValue(item);
  const sameSize = turntables.filter((candidate) => {
    const candidateSize = getDiningSizeValue(candidate);
    return itemSize && candidateSize && Math.abs(candidateSize - itemSize) < 40;
  });
  if (sameSize.length) return sameSize;

  const small = turntables.filter((candidate) => /小转盘/.test(getCatalogText(candidate)));
  const large = turntables.filter((candidate) => /大转盘/.test(getCatalogText(candidate)));
  if (itemSize && itemSize <= 1400 && small.length) return small;
  if (itemSize && itemSize >= 1450 && large.length) return large;
  const smallDiameter = turntables.filter((candidate) => getDiningSizeValue(candidate) <= 850);
  const largeDiameter = turntables.filter((candidate) => getDiningSizeValue(candidate) >= 880);
  if (itemSize && itemSize <= 1400 && smallDiameter.length) return smallDiameter;
  if (itemSize && itemSize >= 1450 && largeDiameter.length) return largeDiameter;
  return turntables;
}

function getDiningFamilyTurntables(item) {
  if (!item || activeCatalogKey !== "diningTable") return [];
  const root = getDiningFamilyRoot(item);
  if (!root) return [];
  const selectedMaterial = materialSelect?.options?.[materialSelect.selectedIndex]?.textContent || "";
  return matchingCatalogData.filter((candidate) =>
    isDiningTurntableItem(candidate)
    && getDiningFamilyRoot(candidate) === root
    && (!isDiningMaterialGradeLabel(selectedMaterial) || getDiningMaterialGradeKey(candidate) === getDiningMaterialGradeKey(selectedMaterial))
  );
}

function formatDiningTurntableNote(item) {
  if (getDiningFamilyTurntables(item).length) return "";
  const turntables = getRelatedDiningTurntables(item);
  if (!turntables.length) return "";
  return `配套转盘:${turntables.map((turntable) => {
    const name = turntable.configuration || turntable.model || turntable.name;
    const size = turntable.dimensions ? ` ${turntable.dimensions}` : "";
    return `${name}${size}`;
  }).join(" / ")}`;
}

function getDiningPackageItems(item) {
  if (!item || activeCatalogKey !== "diningTable") return item ? [item] : [];
  const turntable = getSelectedDiningTurntable(item);
  return [item, turntable].filter(Boolean);
}

function getSelectedDiningTurntable(item) {
  const turntables = getDiningFamilyTurntables(item);
  if (!turntables.length) return null;
  if (selectedDiningTurntableId === "none") return null;
  const selected = turntables.find((candidate) => candidate.id === selectedDiningTurntableId);
  if (selected) return selected;
  return getRelatedDiningTurntables(item)[0] || turntables[0] || null;
}

function getDiningCoreModelKey(item) {
  return String(item?.series || item?.model || "").match(/NK\d{4}DT(?:-S|-[123](?!\d))?/i)?.[0] || "";
}

function getDiningModelFamilyKey(item) {
  return String(item?.series || item?.model || "")
    .replace(/-\d{3,4}x\d{3,4}x\d{3,4}mm$/i, "")
    .replace(/-\d+(?:\.\d+)??(?:-\d{3,4}x\d{3,4}mm)?$/i, "")
    .replace(/-[φΦ]\d+$/i, "");
}

function hasCatalogPhoto(item) {
  return Boolean(item?.photo);
}

function uniqueDiningTables(items) {
  const seen = new Set();
  return items.filter(isBuyableDiningTableItem).filter((item) => {
    const key = getBuyableDiningTableKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).map(normalizeDiningTableItem);
}

const catalogDefinitions = {
  nikator: {
    label: "Nikator",
    catalog: (Array.isArray(window.BAIDU_SOFA_DATA) ? window.BAIDU_SOFA_DATA : [])
      .filter((sofa) => !excludedCatalogIds.has(sofa.id) && ["NK", "LE"].includes((sofa.brand || "").toUpperCase())),
    recommendations: Array.isArray(window.BAIDU_RECOMMENDED_COMBOS)
      ? window.BAIDU_RECOMMENDED_COMBOS.filter((combo) => ["NK", "LE"].includes((combo.brand || "").toUpperCase()) || !combo.brand)
      : []
  },
  zolano: {
    label: "Zolano",
    catalog: getCorrectedZolanoCatalog(Array.isArray(window.BAIDU_ZOLANO_SOFA_DATA) ? window.BAIDU_ZOLANO_SOFA_DATA : []),
    recommendations: Array.isArray(window.BAIDU_ZOLANO_RECOMMENDED_COMBOS) ? window.BAIDU_ZOLANO_RECOMMENDED_COMBOS : []
  },
  chair: {
    label: "休闲椅 Chair",
    catalog: Array.isArray(window.BAIDU_CHAIR_DATA) ? window.BAIDU_CHAIR_DATA : [],
    recommendations: []
  },
  bed: {
    label: "床 Bed",
    catalog: Array.isArray(window.BAIDU_BED_DATA) ? window.BAIDU_BED_DATA : [],
    recommendations: []
  },
  diningTable: {
    label: "餐桌 Dining Table",
    catalog: uniqueDiningTables(matchingCatalogData.filter(isDiningTableItem)),
    recommendations: []
  },
  diningChair: {
    label: "餐椅 Dining Chair",
    catalog: matchingCatalogData.filter(isDiningChairItem),
    recommendations: []
  },
  matching: {
    label: "配套 Matching",
    catalog: matchingCatalogData.filter((item) => !isDiningItem(item)),
    recommendations: []
  }
};

function getCorrectedZolanoCatalog(rows) {
  const hidden3817Configs = new Set(["1NA/LONG", "CORNER"]);
  return rows
    .filter((item) => {
      if (item.series !== "ZL 3817 MELFE") return true;
      return !hidden3817Configs.has(String(item.configuration || "").toUpperCase());
    })
    .map((item) => {
      if (item.series !== "ZL 3817 MELFE") return item;
      const config = String(item.configuration || "").toUpperCase();
      const correction = {
        "1EL": {
          configuration: "1EL/T",
          description: "1EL/T MELFE",
          dimensions: "L1630mm | H900 D1630 | seat 460mm",
          width: 1630,
          depth: 1630,
          height: 900
        },
        "1NA": {
          configuration: "2ER",
          description: "2ER MELFE",
          dimensions: "L1810mm | H900 D1070 | seat 460mm",
          width: 1810,
          depth: 1070,
          height: 900
        },
        "FULL SET": {
          configuration: "1EL/T + 2ER",
          description: "图片整套 MELFE",
          dimensions: "3440 x 1630 x 900 mm",
          width: 3440,
          depth: 1630,
          height: 900,
          partCodes: [
            "ZL3817MELFE1ELEXPORT2020ZL33002SHEET1544",
            "ZL3817MELFE1NAEXPORT2020ZL33002SHEET1545"
          ]
        },
        PILLOW: {
          description: "Pillow / 抱枕",
          dimensions: "抱枕"
        }
      }[config];
      return correction ? { ...item, ...correction } : item;
    });
}

let activeCatalogKey = localStorage.getItem("hp-sofa-active-catalog") || "nikator";
let catalogSofas = [];
let recommendedCombos = [];
const showIndividualItems = false;
let sofas = loadSofas();
let editingId = null;
let selectedPhoto = "";
const sellingPriceMultiplier = 2.8;
const individualItemPhotos = window.BAIDU_INDIVIDUAL_ITEM_PHOTOS || {};
const mixedMaterialPricing = window.HP_MIXED_MATERIAL_PRICING || {};
const getMixedMaterialTotal = mixedMaterialPricing.getMixedMaterialTotal
  || ((pieces, selections, defaultIndex, getPrice) => pieces.reduce((sum, item) => sum + getPrice(item, defaultIndex), 0));
const getPieceMaterialIndex = mixedMaterialPricing.getPieceMaterialIndex
  || ((selections, slotIndex, defaultIndex) => Number(selections?.[slotIndex] ?? defaultIndex));
const zolano3776Layout = window.HP_ZOLANO_3776_LAYOUT || {};
const extendZolano3776Layout = zolano3776Layout.extendZolano3776Layout
  || ((base, extension) => ({
    left: Number(base.left || 0) + Number(extension?.leftAdd || 0),
    right: Number(base.right || 0) + Number(extension?.rightAdd || 0),
    depth: base.depth,
    height: base.height
  }));
const formatZolano3776LayoutDimension = zolano3776Layout.formatZolano3776LayoutDimension
  || ((layout) => `L形组合:左边 ${layout.left}mm / 右边 ${layout.right}mm | 深 ${layout.depth}mm | 高 ${layout.height}mm`);
let selectedWidthFilter = 0;
const selectedTypeFilters = new Set();
let pieceMaterialSelections = {};
let selectedDiningTurntableId = "";

const money = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "CNY",
  maximumFractionDigits: 0
});

syncActiveCatalog();
render();
initBuilder();
if (typeof syncQuickJumpVisibility === "function") syncQuickJumpVisibility();
syncQuickJumpImages(document);

document.addEventListener("error", (event) => {
  if (event.target instanceof HTMLImageElement) {
    applyImageFallback(event.target);
  }
}, true);
window.addEventListener("load", repairBrokenImages);
setTimeout(repairBrokenImages, 1000);

photoInput.addEventListener("change", async () => {
  const file = photoInput.files[0];
  if (!file) return;
  selectedPhoto = await readFileAsDataUrl(file);
  showPhotoPreview(selectedPhoto);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const sofa = {
    id: editingId || crypto.randomUUID(),
    name: nameInput.value.trim(),
    price: Number(priceInput.value || 0),
    details: detailsInput.value.trim(),
    photo: selectedPhoto,
    updatedAt: new Date().toISOString()
  };

  if (editingId) {
    sofas = sofas.map((item) => item.id === editingId ? sofa : item);
  } else {
    sofas.unshift(sofa);
  }

  saveSofas();
  resetForm();
  render();
});

searchInput.addEventListener("input", render);
brandFilter.addEventListener("change", render);

panelToggle.addEventListener("click", () => {
  entryPanel.classList.toggle("is-collapsed");
});

[...brandSwitchButtons].forEach((button) => {
  button.addEventListener("click", () => {
    setActiveCatalog(button.dataset.brandSwitch);
  });
});

[seriesSelect, recommendSelect, materialSelect].forEach((select) => {
  select.addEventListener("change", () => {
    if (select === seriesSelect) {
      syncModelJumpSelect();
      recommendSelect.value = "";
      pieceMaterialSelections = {};
      selectedDiningTurntableId = "";
      populateBuilderPieces();
      return;
    }

    if (select === recommendSelect) {
      const combo = getSelectedRecommendation();
      recommendSelect.value = combo ? combo.id : "";
      pieceMaterialSelections = {};
      const slotCount = combo && activeCatalogKey === "zolano" && !isGeneratedZolanoCombo(combo)
        ? 2
        : combo
          ? Math.min(10, combo.partCodes.length + 1)
          : undefined;
      populateBuilderPieces(slotCount);
      if (combo) applyRecommendedCombo();
      renderSetPreview();
      return;
    }

    if (select === materialSelect) {
      pieceMaterialSelections = {};
      selectedDiningTurntableId = "";
      if (activeCatalogKey === "diningTable" && isDiningMaterialGradeLabel(materialSelect.options[materialSelect.selectedIndex]?.textContent || "")) {
        populateBuilderPieces();
        return;
      }
    }
    renderSetPreview();
  });
});

if (modelJumpSelect) {
  modelJumpSelect.addEventListener("change", () => {
    if (!modelJumpSelect.value) return;
    jumpToSeries(activeCatalogKey, modelJumpSelect.value);
  });
}

if (builderSearchInput) {
  builderSearchInput.addEventListener("input", () => {
    populateBuilderPieces();
    renderSetPreview();
  });
}

bindQuickJumpButtons(document);

function bindQuickJumpButtons(root) {
  root.querySelectorAll("[data-quick-jump]").forEach((button) => {
    if (button.dataset.quickJumpBound) return;
    button.dataset.quickJumpBound = "true";
    button.addEventListener("click", () => {
    const value = button.dataset.quickJump || "";
    const sep = value.indexOf("|");
    if (sep < 0) return;
    const brandKey = value.slice(0, sep);
    const seriesValue = value.slice(sep + 1);
    if (!brandKey || !seriesValue) return;
    jumpToSeries(brandKey, seriesValue);
    });
  });
}

function jumpToSeries(brandKey, seriesValue) {
  if (catalogDefinitions[brandKey]) {
    if (activeCatalogKey !== brandKey) {
      setActiveCatalog(brandKey);
    } else {
      syncActiveCatalog();
      initBuilder();
    }
  }
  if (!seriesSelect) return;
  const seriesOptions = Array.from(seriesSelect.options).map((o) => o.value);
  if (!seriesOptions.includes(seriesValue)) return;
  seriesSelect.value = seriesValue;
  seriesSelect.dispatchEvent(new Event("change", { bubbles: true }));

  if (!recommendSelect) return;
  const firstCombo = (typeof getSeriesRecommendations === "function"
    ? getSeriesRecommendations()
    : []
  ).find((c) => c.series === seriesValue);
  if (firstCombo) {
    recommendSelect.value = firstCombo.id;
    recommendSelect.dispatchEvent(new Event("change", { bubbles: true }));
  }
  if (typeof renderSetPreview === "function") renderSetPreview();
}

function syncQuickJumpVisibility() {
  syncBuilderFilterVisibility();
  ensureDynamicQuickJumpGroup(activeCatalogKey);
  const groups = document.querySelectorAll("[data-quick-jump-group]");
  groups.forEach((group) => {
    const key = group.dataset.quickJumpGroup;
    group.hidden = key !== activeCatalogKey;
  });
}

function syncBuilderFilterVisibility() {
  const filterPanel = document.querySelector(".builder-filter-buttons");
  const isSofaCatalog = activeCatalogKey === "nikator" || activeCatalogKey === "zolano";
  if (filterPanel) filterPanel.hidden = !isSofaCatalog;
  if (comboButtonPanel) comboButtonPanel.hidden = !isSofaCatalog || !selectedWidthFilter;
}

function syncBuilderControlsVisibility() {
  const controls = document.querySelector(".builder-controls");
  const builderSearch = document.querySelector(".builder-search");
  const isGridOnlyCatalog = activeCatalogKey === "diningChair" || activeCatalogKey === "bed";
  const hideTopControls = activeCatalogKey === "nikator"
    || activeCatalogKey === "zolano"
    || activeCatalogKey === "diningTable"
    || isGridOnlyCatalog;
  if (controls) controls.hidden = hideTopControls;
  if (builderSearch) builderSearch.hidden = isGridOnlyCatalog;
  if (slotGrid) slotGrid.hidden = isGridOnlyCatalog;
  if (setPreview) setPreview.hidden = false;
}

function ensureDynamicQuickJumpGroup(catalogKey) {
  if (document.querySelector(`[data-quick-jump-group="${catalogKey}"]`)) return;
  const definition = catalogDefinitions[catalogKey];
  if (!definition || !definition.catalog?.length) return;
  const items = getCatalogQuickJumpItems(catalogKey, definition.catalog);
  if (!items.length) return;
  const group = document.createElement("div");
  group.className = "quick-jump";
  group.dataset.quickJumpGroup = catalogKey;
  group.setAttribute("aria-label", `${definition.label} 型号图片`);
  group.hidden = true;

  const label = document.createElement("span");
  label.className = "quick-jump-label";
  label.textContent = definition.label;
  group.append(label);

  items.forEach((item) => {
    const quickPhoto = getQuickJumpPhoto(catalogKey, item.series, item);
    if (!quickPhoto) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "quick-jump-button";
    button.dataset.quickJump = `${catalogKey}|${item.series}`;

    const image = document.createElement("img");
    image.src = quickPhoto;
    image.alt = "";
    image.loading = "lazy";
    button.append(image);

    const text = document.createElement("span");
    text.textContent = getQuickJumpLabel(item.series);
    button.append(text);
    group.append(button);
  });

  const lastGroup = [...document.querySelectorAll("[data-quick-jump-group]")].pop();
  lastGroup?.after(group);
  bindQuickJumpButtons(group);
  syncQuickJumpImages(group);
}

function syncQuickJumpImages(root) {
  root.querySelectorAll("[data-quick-jump]").forEach((button) => {
    const value = button.dataset.quickJump || "";
    const sep = value.indexOf("|");
    if (sep < 0) return;
    const catalogKey = value.slice(0, sep);
    const series = value.slice(sep + 1);
    const photo = getQuickJumpPhoto(catalogKey, series);
    if (!photo) {
      button.remove();
      return;
    }
    let image = button.querySelector("img");
    if (!image) {
      image = document.createElement("img");
      image.alt = "";
      image.loading = "lazy";
      button.prepend(image);
      button.classList.remove("quick-jump-button-text");
    }
    image.src = photo;
  });
}

function getQuickJumpPhoto(catalogKey, series, item) {
  const photoItem = item || catalogDefinitions[catalogKey]?.catalog.find((candidate) => candidate.series === series);
  const gallery = getSeriesGalleryPhotos(series);
  const overrides = window.BAIDU_PHOTO_OVERRIDES || {};
  const diningFamilyPhoto = catalogKey === "diningTable" ? getDiningFamilyPhoto(photoItem) : "";
  return overrides[series] || gallery[0] || photoItem?.originalPhoto || photoItem?.photo || diningFamilyPhoto || "";
}

function getCatalogQuickJumpItems(catalogKey, catalog) {
  const seen = new Set();
  return catalog
    .filter((item) => item.series)
    .filter((item) => {
      if (seen.has(item.series)) return false;
      seen.add(item.series);
      return true;
    })
    .slice(0, catalogKey === "matching" ? 180 : 80);
}

function getQuickJumpLabel(series) {
  const text = String(series || "");
  return text.length > 10 ? text.slice(0, 10) : text;
}

if (widthFilterInput) {
  widthFilterInput.addEventListener("input", () => {
    selectedWidthFilter = 0;
    syncFilterButtons();
    populateRecommendationSelect();
    renderSetPreview();
  });
}

widthFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = Number(button.dataset.widthFilter || 0);
    selectedWidthFilter = selectedWidthFilter === value ? 0 : value;
    if (widthFilterInput) widthFilterInput.value = selectedWidthFilter || "";
    syncFilterButtons();
    populateRecommendationSelect();
    renderSetPreview();
  });
});

typeFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.dataset.typeFilter;
    if (!value) return;
    if (selectedTypeFilters.has(value)) selectedTypeFilters.delete(value);
    else selectedTypeFilters.add(value);
    syncFilterButtons();
    populateRecommendationSelect();
    renderSetPreview();
  });
});

exportButton.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(sofas, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "sofa-price-list.json";
  link.click();
  URL.revokeObjectURL(link.href);
});

importInput.addEventListener("change", async () => {
  const file = importInput.files[0];
  if (!file) return;

  try {
    const text = await file.text();
    const imported = JSON.parse(text);
    if (!Array.isArray(imported)) throw new Error("Invalid price list");
    sofas = imported.filter((item) => item.name && Number.isFinite(Number(item.price)));
    saveSofas();
    render();
  } catch {
    alert("This file cannot be imported.");
  } finally {
    importInput.value = "";
  }
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("hp-sofa-theme", document.body.classList.contains("dark") ? "dark" : "light");
});

if (localStorage.getItem("hp-sofa-theme") === "dark") {
  document.body.classList.add("dark");
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js")
      .then((registration) => registration.update())
      .catch(() => {});
  });
}

window.addEventListener("load", () => {
  checkForOnlineUpdate();
  checkForOnlinePatch();
});

async function checkForOnlineUpdate() {
  const manifestUrl = currentAppVersion.updateManifestUrl || "update.json";
  try {
    const response = await fetch(`${manifestUrl}?t=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) return;
    const update = await response.json();
    if (Number(update.versionCode || 0) <= Number(currentAppVersion.versionCode || 0)) return;
    showUpdateBanner(update);
  } catch {
    // Offline use is normal for the MatePad catalog, so update failures stay quiet.
  }
}

function showUpdateBanner(update) {
  if (document.querySelector(".update-banner")) return;
  const banner = document.createElement("aside");
  banner.className = "update-banner";

  const title = document.createElement("strong");
  title.textContent = update.mandatory ? "必须更新" : "有新版本";

  const message = document.createElement("span");
  message.textContent = `${update.versionName || "新版本"} 可以安装`;

  const actions = document.createElement("div");
  actions.className = "update-banner-actions";

  const laterButton = document.createElement("button");
  laterButton.type = "button";
  laterButton.textContent = "稍后";
  laterButton.addEventListener("click", () => banner.remove());

  const updateButton = document.createElement("button");
  updateButton.type = "button";
  updateButton.className = "primary-button";
  updateButton.textContent = "\u66f4\u65b0";
  updateButton.addEventListener("click", () => {
    const targetUrl = update.apkUrl || update.webUrl || "";
    if (targetUrl) {
      window.location.href = targetUrl;
      return;
    }
    alert("更新链接还没设置。请先在 update.json 填入 apkUrl。");
  });

  actions.append(laterButton, updateButton);
  banner.append(title, message, actions);
  document.body.append(banner);
}

async function checkForOnlinePatch() {
  const manifestUrl = getPatchManifestUrl();
  if (!manifestUrl || !("caches" in window)) return;
  try {
    const response = await fetch(`${manifestUrl}${manifestUrl.includes("?") ? "&" : "?"}t=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) return;
    const patch = await response.json();
    if (!Array.isArray(patch.files) || patch.files.length === 0) return;
    const installedPatchCode = Number(localStorage.getItem(patchVersionStorageKey) || currentAppVersion.patchVersionCode || 0);
    if (Number(patch.patchVersionCode || 0) <= installedPatchCode) return;
    showPatchBanner(patch, manifestUrl);
  } catch {
    // Patch checks should never block the catalog.
  }
}

function getPatchManifestUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("patchManifest") || currentAppVersion.patchManifestUrl || "";
}

function showPatchBanner(patch, manifestUrl) {
  if (document.querySelector(".patch-banner")) return;
  const banner = document.createElement("aside");
  banner.className = "update-banner patch-banner";

  const title = document.createElement("strong");
  title.textContent = "有小更新";

  const message = document.createElement("span");
  message.textContent = `${patch.patchVersionName || "补丁"} 可以下载`;

  const actions = document.createElement("div");
  actions.className = "update-banner-actions";

  const laterButton = document.createElement("button");
  laterButton.type = "button";
  laterButton.textContent = "稍后";
  laterButton.addEventListener("click", () => banner.remove());

  const updateButton = document.createElement("button");
  updateButton.type = "button";
  updateButton.className = "primary-button";
  updateButton.textContent = "小更新";
  updateButton.addEventListener("click", async () => {
    updateButton.disabled = true;
    updateButton.textContent = "下载中";
    try {
      await applyOnlinePatch(patch, manifestUrl);
      updateButton.textContent = "完成";
      window.location.reload();
    } catch (error) {
      updateButton.disabled = false;
      updateButton.textContent = "重试";
      alert(`小更新失败：${error.message || "请检查网络"}`);
    }
  });

  actions.append(laterButton, updateButton);
  banner.append(title, message, actions);
  document.body.append(banner);
}

async function applyOnlinePatch(patch, manifestUrl) {
  if (!("caches" in window)) throw new Error("这个设备不支持小更新缓存");
  const cache = await caches.open(patchCacheName);
  const manifestBaseUrl = new URL(manifestUrl, window.location.href);
  const fetchedFiles = [];

  for (const file of patch.files) {
    const localPath = String(file.path || file.target || "").trim();
    const remotePath = String(file.url || file.source || file.path || "").trim();
    if (!localPath || !remotePath) throw new Error("补丁文件资料不完整");

    const remoteUrl = new URL(remotePath, manifestBaseUrl).href;
    const response = await fetch(`${remoteUrl}${remoteUrl.includes("?") ? "&" : "?"}t=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`下载失败 ${localPath}`);

    const body = await response.blob();
    const contentType = file.contentType || response.headers.get("content-type") || guessPatchContentType(localPath);
    fetchedFiles.push({ localPath, body, contentType });
  }

  for (const file of fetchedFiles) {
    const headers = new Headers({ "content-type": file.contentType || "application/octet-stream" });
    for (const cacheUrl of getPatchCacheUrls(file.localPath)) {
      await cache.put(cacheUrl, new Response(file.body, { headers }));
    }
  }

  localStorage.setItem(patchVersionStorageKey, String(patch.patchVersionCode || 0));
  localStorage.setItem(patchNameStorageKey, patch.patchVersionName || "");
}

function getPatchCacheUrls(localPath) {
  const url = new URL(localPath, window.location.href);
  const urls = new Set([url.href]);
  if (url.search && !url.pathname.endsWith("/app.js")) {
    const withoutSearch = new URL(url.href);
    withoutSearch.search = "";
    urls.add(withoutSearch.href);
  }
  return [...urls];
}

function guessPatchContentType(path) {
  const cleanPath = String(path).split("?")[0].toLowerCase();
  if (cleanPath.endsWith(".js")) return "text/javascript; charset=utf-8";
  if (cleanPath.endsWith(".css")) return "text/css; charset=utf-8";
  if (cleanPath.endsWith(".json")) return "application/json; charset=utf-8";
  if (cleanPath.endsWith(".svg")) return "image/svg+xml";
  if (cleanPath.endsWith(".png")) return "image/png";
  if (cleanPath.endsWith(".jpg") || cleanPath.endsWith(".jpeg")) return "image/jpeg";
  if (cleanPath.endsWith(".webp")) return "image/webp";
  return "application/octet-stream";
}

function syncActiveCatalog() {
  const fallbackKey = catalogDefinitions[activeCatalogKey] ? activeCatalogKey : "nikator";
  activeCatalogKey = fallbackKey;
  catalogSofas = catalogDefinitions[activeCatalogKey].catalog;
  recommendedCombos = catalogDefinitions[activeCatalogKey].recommendations;
  localStorage.setItem("hp-sofa-active-catalog", activeCatalogKey);
  brandSwitchButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.brandSwitch === activeCatalogKey);
  });
  syncBuilderFilterVisibility();
  syncBuilderControlsVisibility();
}

function setActiveCatalog(key) {
  if (!catalogDefinitions[key] || key === activeCatalogKey) return;
  activeCatalogKey = key;
  syncActiveCatalog();
  recommendSelect.value = "";
  if (builderSearchInput) builderSearchInput.value = "";
  if (widthFilterInput) widthFilterInput.value = "";
  selectedWidthFilter = 0;
  selectedDiningTurntableId = "";
  selectedTypeFilters.clear();
  syncFilterButtons();
  initBuilder();
  render();
  if (typeof syncQuickJumpVisibility === "function") syncQuickJumpVisibility();
}

function render() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedBrand = brandFilter.value;
  const allSofas = [...catalogSofas, ...sofas];
  const filtered = allSofas.filter((sofa) => {
    const brand = sofa.brand || "Manual";
    const haystack = [
      sofa.name,
      sofa.model,
      sofa.series,
      sofa.configuration,
      sofa.description,
      sofa.details,
      brand
    ].join(" ").toLowerCase();

    return haystack.includes(query) && (selectedBrand === "all" || brand === selectedBrand);
  });

  sofaList.innerHTML = "";
  itemCount.textContent = filtered.length;
  totalValue.textContent = money.format(filtered.reduce((sum, sofa) => sum + getRetailPrice(sofa.price || 0, 1, sofa.priceFactor || 1), 0));

  if (!showIndividualItems) return;

  if (!filtered.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = allSofas.length ? "没有找到匹配的沙发。" : "请先新增沙发图片和价格。";
    sofaList.append(empty);
    return;
  }

  filtered.forEach((sofa) => {
    const card = template.content.firstElementChild.cloneNode(true);
    const image = card.querySelector(".sofa-image");
    const title = card.querySelector("h2");
    const price = card.querySelector("strong");
    const details = card.querySelector("p");

    const titleText = sofa.name || sofa.model || "沙发";
    image.src = resolveItemPhoto(sofa);
    image.alt = titleText;
    title.textContent = titleText;
    price.textContent = money.format(getRetailPrice(sofa.price || 0, 1, sofa.priceFactor || 1));
    details.textContent = sofa.details || sofa.description || "No details added.";

    const meta = document.createElement("div");
    meta.className = "meta-line";
    [
      sofa.brand,
      sofa.series,
      sofa.configuration,
      sofa.dimensions,
      sofa.width && sofa.depth && sofa.height ? `${sofa.width} x ${sofa.depth} x ${sofa.height} mm` : "",
      sofa.priceOptions?.length ? `${sofa.priceOptions.length} 个材质价格` : ""
    ].filter(Boolean).forEach((value) => {
      const pill = document.createElement("span");
      pill.textContent = value;
      meta.append(pill);
    });
    details.after(meta);

    if (sofa.materials?.length && sofa.priceOptions?.length) {
      const materialBlock = document.createElement("div");
      materialBlock.className = "card-materials";
      sofa.materials.forEach((label, index) => {
        const row = document.createElement("div");
        row.innerHTML = `<span>${label}</span><strong>${money.format(getMaterialPrice(sofa, index))}</strong>`;
        materialBlock.append(row);
      });
      meta.after(materialBlock);
    }

    const editButton = card.querySelector(".edit-button");
    const deleteButton = card.querySelector(".delete-button");
    if (sofa.source) {
      editButton.hidden = true;
      deleteButton.hidden = true;
    } else {
      editButton.addEventListener("click", () => editSofa(sofa.id));
      deleteButton.addEventListener("click", () => deleteSofa(sofa.id));
    }

    sofaList.append(card);
  });
}

function initBuilder() {
  syncActiveCatalog();
  const series = [...new Set(catalogSofas.map((sofa) => sofa.series))]
    .sort((a, b) => a.localeCompare(b));

  seriesSelect.innerHTML = "";
  if (!series.length) {
    const empty = document.createElement("option");
    empty.value = "";
    empty.textContent = `${catalogDefinitions[activeCatalogKey].label} 目录还没有资料`;
    seriesSelect.append(empty);
  }
  series.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    seriesSelect.append(option);
  });

  if (series.length && !series.includes(seriesSelect.value)) {
    seriesSelect.value = series[0];
  }

  populateModelJumpSelect(series);
  syncModelJumpVisibility();
  populateBuilderPieces();
  renderSetPreview();
}

function populateModelJumpSelect(seriesList) {
  if (!modelJumpSelect) return;
  const selectedValue = seriesSelect?.value || "";
  modelJumpSelect.innerHTML = "";
  const empty = document.createElement("option");
  empty.value = "";
  empty.textContent = "选择全部型号";
  modelJumpSelect.append(empty);

  (seriesList || []).forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    modelJumpSelect.append(option);
  });
  if (selectedValue && (seriesList || []).includes(selectedValue)) {
    modelJumpSelect.value = selectedValue;
  }
}

function shouldShowModelJumpSelect() {
  return activeCatalogKey === "nikator" || activeCatalogKey === "zolano";
}

function syncModelJumpVisibility() {
  const label = modelJumpSelect?.closest("label");
  if (!label) return;
  label.hidden = !shouldShowModelJumpSelect();
}

function syncMaterialSelectVisibility(labels = []) {
  const label = materialSelect?.closest("label");
  if (!label) return;
  label.hidden = isSinglePriceMaterialLabels(labels) || (activeCatalogKey === "diningTable" && labels.some(isDiningMaterialGradeLabel));
}

function syncModelJumpSelect() {
  if (!modelJumpSelect || !seriesSelect) return;
  syncModelJumpVisibility();
  const hasOption = Array.from(modelJumpSelect.options).some((option) => option.value === seriesSelect.value);
  modelJumpSelect.value = hasOption ? seriesSelect.value : "";
}

function populateBuilderPieces(forceSlotCount) {
  const currentSelections = [...slotGrid.querySelectorAll(".slot-select")].map((select) => select.value);
  const allSeriesItems = getSeriesItems();
  const materialLabels = getMaterialLabels(allSeriesItems[0]);
  const previousMaterialLabel = materialSelect.options[materialSelect.selectedIndex]?.textContent || "";

  materialSelect.innerHTML = "";
  materialLabels.forEach((label, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = formatMaterialDisplayLabel(label);
    materialSelect.append(option);
  });
  syncMaterialSelectVisibility(materialLabels);

  const preferredMaterialIndex = activeCatalogKey === "zolano"
    ? materialLabels.findIndex((label) => label.toUpperCase() === "F/SA")
    : -1;
  const previousMaterialIndex = materialLabels.findIndex((label) => formatMaterialDisplayLabel(label) === previousMaterialLabel || label === previousMaterialLabel);
  if (previousMaterialIndex >= 0) {
    materialSelect.value = String(previousMaterialIndex);
  } else if (preferredMaterialIndex >= 0) {
    materialSelect.value = String(preferredMaterialIndex);
  } else if (materialLabels.length) {
    materialSelect.value = "0";
  }

  const seriesItems = getFilteredSeriesItems();
  const seriesItemIds = new Set(allSeriesItems.map((item) => item.id));
  const filteredSeriesItemIds = new Set(seriesItems.map((item) => item.id));
  const retainedSelections = currentSelections.map((id) =>
    seriesItemIds.has(id) && (activeCatalogKey !== "diningTable" || filteredSeriesItemIds.has(id)) ? id : ""
  );
  const selectedRecommendation = getSelectedRecommendation();
  let visibleSlotCount = 1;

  for (let index = 0; index < Math.min(retainedSelections.length, 10); index += 1) {
    if (retainedSelections[index]) {
      visibleSlotCount = index + 2;
    } else {
      break;
    }
  }

  if (typeof forceSlotCount === "number") {
    visibleSlotCount = forceSlotCount;
  }

  if (selectedRecommendation) {
    const recommendedSlotCount = activeCatalogKey === "zolano" && !isGeneratedZolanoCombo(selectedRecommendation)
      ? 2
      : Math.min(10, getComboPartCodes(selectedRecommendation).length + 1);
    visibleSlotCount = Math.max(visibleSlotCount, recommendedSlotCount);
  }

  visibleSlotCount = Math.min(10, Math.max(1, visibleSlotCount));

  populateRecommendationSelect();

  slotGrid.innerHTML = "";
  renderDiningMaterialSlot(materialLabels);
  renderDiningTurntableSlot(seriesItems, retainedSelections);
  for (let index = 0; index < visibleSlotCount; index += 1) {
    const label = document.createElement("label");
    label.textContent = `位置 ${index + 1}`;

    const select = document.createElement("select");
    select.className = "slot-select";
    select.dataset.slot = String(index + 1);
    const allowedItems = getAllowedSlotItems(seriesItems, retainedSelections, index);
    const shouldSelectFirst = index === 0
      && !retainedSelections[index]
      && !recommendedCombos.length
      && allowedItems.length;
    populatePieceSelect(select, allowedItems, shouldSelectFirst);
    const currentItem = catalogSofas.find((item) => item.id === retainedSelections[index]);
    if (retainedSelections[index] && currentItem) {
      if (activeCatalogKey === "zolano" && !allowedItems.some((item) => item.id === currentItem.id)) {
        select.value = "";
      } else {
        ensureOption(select, currentItem);
        select.value = retainedSelections[index];
      }
    }
    select.addEventListener("change", () => {
      recommendSelect.value = "";
      pieceMaterialSelections = {};
      populateBuilderPieces();
    });

    label.append(select);
    slotGrid.append(label);
  }

  renderSetPreview();
}

function renderDiningMaterialSlot(materialLabels) {
  if (activeCatalogKey !== "diningTable" || !materialLabels.some(isDiningMaterialGradeLabel)) return;
  const label = document.createElement("label");
  label.className = "dining-material-slot";
  label.textContent = "材质";

  const select = document.createElement("select");
  materialLabels.forEach((material, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = formatMaterialDisplayLabel(material);
    select.append(option);
  });
  select.value = materialSelect.value || "0";
  select.addEventListener("change", () => {
    materialSelect.value = select.value;
    materialSelect.dispatchEvent(new Event("change", { bubbles: true }));
  });

  label.append(select);
  slotGrid.append(label);
}

function renderDiningTurntableSlot(seriesItems, retainedSelections = []) {
  if (activeCatalogKey !== "diningTable" || !seriesItems.length) return;
  const turntables = getDiningFamilyTurntables(seriesItems[0]);
  if (!turntables.length) {
    selectedDiningTurntableId = "";
    return;
  }

  const selectedItem = seriesItems.find((item) => retainedSelections.includes(item.id)) || seriesItems[0];
  const recommended = getRelatedDiningTurntables(selectedItem)[0] || turntables[0];
  if (!selectedDiningTurntableId) {
    selectedDiningTurntableId = "none";
  } else if (selectedDiningTurntableId !== "none" && !turntables.some((item) => item.id === selectedDiningTurntableId)) {
    selectedDiningTurntableId = "none";
  }

  const label = document.createElement("label");
  label.className = "dining-turntable-slot";
  label.textContent = "转盘";

  const select = document.createElement("select");
  const emptyOption = document.createElement("option");
  emptyOption.value = "none";
  emptyOption.textContent = "不加转盘";
  select.append(emptyOption);
  turntables.forEach((turntable) => {
    const option = document.createElement("option");
    option.value = turntable.id;
    option.textContent = formatDiningTurntableOption(turntable);
    select.append(option);
  });
  select.value = selectedDiningTurntableId;
  select.addEventListener("change", () => {
    selectedDiningTurntableId = select.value;
    renderSetPreview();
  });

  label.append(select);
  slotGrid.append(label);
}

function formatDiningTurntableOption(turntable) {
  return [
    "转盘",
    turntable.dimensions,
    money.format(getRetailPrice(turntable.price, 1, turntable.priceFactor || 1))
  ].filter(Boolean).join(" - ");
}

function populateRecommendationSelect() {
  const selectedValue = recommendSelect.value;
  const combos = getSeriesRecommendations();

  recommendSelect.innerHTML = "";
  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = "自选组合";
  recommendSelect.append(emptyOption);

  combos.forEach((combo) => {
    const option = document.createElement("option");
    option.value = combo.id;
    option.textContent = appendZolanoRecommendationPrice(formatComboOption(combo), combo);
    recommendSelect.append(option);
  });

  if (combos.some((combo) => combo.id === selectedValue)) recommendSelect.value = selectedValue;
  renderComboButtons(combos);
}

function renderComboButtons(combos = getSeriesRecommendations()) {
  if (!comboButtonPanel) return;
  const shouldShow = (activeCatalogKey === "nikator" || activeCatalogKey === "zolano") && Boolean(selectedWidthFilter);
  comboButtonPanel.hidden = !shouldShow;
  comboButtonPanel.innerHTML = "";
  if (!shouldShow) return;

  const label = document.createElement("span");
  label.className = "combo-button-label";
  label.textContent = "\u53ef\u7528\u7ec4\u5408";
  comboButtonPanel.append(label);

  if (!combos.length) {
    const empty = document.createElement("span");
    empty.className = "combo-button-empty";
    empty.textContent = "\u6682\u65e0\u7ec4\u5408";
    comboButtonPanel.append(empty);
    return;
  }

  combos.forEach((combo) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "combo-choice-button";
    button.classList.toggle("is-active", combo.id === recommendSelect.value);
    button.textContent = formatComboButtonLabel(combo);
    button.addEventListener("click", () => {
      recommendSelect.value = combo.id;
      recommendSelect.dispatchEvent(new Event("change", { bubbles: true }));
    });
    comboButtonPanel.append(button);
  });
}

function formatComboButtonLabel(combo) {
  const pieces = getComboPieceCount(combo);
  const sizeText = getComboButtonSizeText(combo);
  const name = getComboDisplayName(combo);
  const priceText = getZolanoRecommendationPriceText(combo);
  return [name, pieces ? `${pieces}\u4ef6` : "", sizeText, priceText].filter(Boolean).join(" ");
}

function getComboDisplayName(combo) {
  return String(combo?.name || "\u7ec4\u5408").replace(/^\u5e38\u7528/, "");
}

function appendZolanoRecommendationPrice(label, combo) {
  const priceText = getZolanoRecommendationPriceText(combo);
  return priceText ? `${label} | ${priceText}` : label;
}

function getZolanoRecommendationPriceText(combo) {
  if (activeCatalogKey !== "zolano" || !combo) return "";
  const pricedCombo = resolvePricedZolanoRecommendation(combo);
  const materialIndex = Number(materialSelect.value || 0);
  const value = getMaterialPrice(pricedCombo, materialIndex);
  return value ? money.format(value) : "";
}

function getComboButtonSizeText(combo) {
  const width = getComboWidthValue(combo);
  const depth = getComboButtonDepthValue(combo);
  if (width && depth) return `${formatMeters(width)} x ${formatMeters(depth)}`;
  if (width) return formatMeters(width);
  return "";
}

function getComboButtonDepthValue(combo) {
  const directDisplayDepth = Number(combo?.buttonDepth || combo?.displayDepth || combo?.seatDepth || 0);
  if (directDisplayDepth > 0) return directDisplayDepth;

  const text = `${combo?.configuration || ""} ${combo?.dimensions || ""}`;
  const seatDepthMatch = text.match(/(?:seat|座深|坐深)\s*(?:D|depth)?\s*(\d{3,5})/i);
  if (seatDepthMatch) return Number(seatDepthMatch[1]);

  return getComboDepthValue(combo);
}

function getComboDepthValue(combo) {
  const directDepth = Number(combo?.depth || 0);
  if (directDepth >= 700) return directDepth;

  const partDepth = getComboPartItems(combo)
    .map((item) => Number(item.depth || 0))
    .filter((depth) => depth >= 700);
  if (partDepth.length) return Math.max(...partDepth);

  const seriesDepth = getComboSeriesDefaultDepth(combo);
  if (seriesDepth > 0) return seriesDepth;

  const text = String(combo?.dimensions || "");
  const dimensionNumbers = (text.match(/\d{3,5}/g) || []).map(Number).filter((value) => value >= 700);
  if (dimensionNumbers.length >= 2) return dimensionNumbers[1];

  const depthMatch = text.match(/\bD\s*[:：]\s*(\d{3,5})/i);
  if (depthMatch) return Number(depthMatch[1]);
  return 0;
}

function getComboSeriesDefaultDepth(combo) {
  const recommendationDepths = recommendedCombos
    .filter((candidate) => candidate.series === combo?.series)
    .map((candidate) => Number(candidate.depth || 0))
    .filter((depth) => depth >= 700 && depth <= 3000);
  if (recommendationDepths.length) return Math.min(...recommendationDepths);

  const itemDepths = catalogSofas
    .filter((item) => item.series === combo?.series)
    .map((item) => Number(item.depth || 0))
    .filter((depth) => depth >= 700 && depth <= 3000);
  return itemDepths.length ? Math.min(...itemDepths) : 0;
}

function getComboPartItems(combo) {
  const codes = getComboPartCodes(combo);
  if (!codes.length) return [];
  const seriesItems = catalogSofas.filter((item) => item.series === combo?.series);
  return codes
    .map((code) => findItemByPartCode(seriesItems, code))
    .filter(Boolean);
}

function formatMeters(value) {
  const meters = Number(value || 0) / 1000;
  if (!meters) return "";
  const precision = Number.isInteger(meters) ? 0 : (Number.isInteger(meters * 10) ? 1 : 2);
  return `${meters.toFixed(precision)}m`;
}

function populatePieceSelect(select, items, selectFirst = false) {
  select.innerHTML = "";
  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = "空位置";
  select.append(emptyOption);

  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = formatPieceOption(item);
    select.append(option);
  });

  if (selectFirst && items.length) select.value = items[0].id;
}

function ensureOption(select, item) {
  if (!item || [...select.options].some((option) => option.value === item.id)) return;
  const option = document.createElement("option");
  option.value = item.id;
  option.textContent = formatPieceOption(item);
  select.append(option);
}

function applyRecommendedCombo() {
  const combo = getSelectedRecommendation();
  if (!combo) return;

  const seriesItems = getSeriesItems();
  const slotSelects = [...slotGrid.querySelectorAll(".slot-select")];
  slotSelects.forEach((select) => {
    select.value = "";
  });

  if (activeCatalogKey === "zolano" && !isGeneratedZolanoCombo(combo)) {
    const match = findZolanoRecommendedItem(seriesItems, combo);
    if (match && slotSelects[0]) {
      ensureOption(slotSelects[0], match);
      slotSelects[0].value = match.id;
      populateBuilderPieces(2);
    }
    return;
  }

  getComboPartCodes(combo).slice(0, 10).forEach((code, index) => {
    const match = findItemByPartCode(seriesItems, code);
    if (!match || !slotSelects[index]) return;
    ensureOption(slotSelects[index], match);
    slotSelects[index].value = match.id;
  });
}

function getSeriesItems() {
  return catalogSofas.filter((sofa) => sofa.series === seriesSelect.value);
}

function getFilteredSeriesItems() {
  const query = builderSearchInput.value.trim().toLowerCase();
  const items = getSeriesItems();
  const materialFilteredItems = filterDiningItemsBySelectedMaterial(items);
  if (!query) return materialFilteredItems;

  const currentSeriesMatches = materialFilteredItems.filter((item) => matchesBuilderQuery(item, query));
  if (currentSeriesMatches.length) return currentSeriesMatches;

  return catalogSofas.filter((item) => matchesBuilderQuery(item, query));
}

function filterDiningItemsBySelectedMaterial(items) {
  if (activeCatalogKey !== "diningTable") return items;
  const selectedLabel = materialSelect.options[materialSelect.selectedIndex]?.textContent || "";
  const selectedGrade = getDiningMaterialGradeKey(selectedLabel);
  if (!selectedGrade) return items;
  return items.filter((item) => getDiningMaterialGradeKey(item) === selectedGrade);
}

function getAllowedSlotItems(items, currentSelections, slotIndex) {
  if (activeCatalogKey !== "zolano") return items;
  const earlierItems = currentSelections
    .slice(0, slotIndex)
    .map((id) => catalogSofas.find((item) => item.id === id))
    .filter(Boolean);
  const hasEarlierFullUnit = earlierItems.some((item) => isZolanoFullUnit(item));
  if (hasEarlierFullUnit) return items.filter((item) => isZolanoAddOnItem(item));
  if (earlierItems.length) return items.filter((item) => !isZolanoFullUnit(item) || isZolanoAddOnItem(item));
  return items;
}

function matchesBuilderQuery(item, query) {
  const haystack = [
    item.id,
    item.brand,
    item.name,
    item.model,
    item.series,
    item.configuration,
    item.description,
    item.dimensions,
    item.width,
    item.depth,
    item.height,
    ...(item.materials || [])
  ].join(" ").toLowerCase();
  return haystack.includes(query);
}

function getSeriesRecommendations() {
  const query = builderSearchInput?.value.trim().toLowerCase() || "";
  const widthFilter = getWidthFilter();
  const combos = [
    ...recommendedCombos.filter((combo) => combo.series === seriesSelect.value),
    ...getGeneratedSeriesRecommendations()
  ];
  const displayCombos = activeCatalogKey === "zolano" ? removeDuplicateZolanoGeneratedCombos(combos) : combos;
  const hasZolanoOriginalSaleRows = activeCatalogKey === "zolano"
    && displayCombos.some((combo) => combo.series === seriesSelect.value && isZolanoOriginalSaleConfig(combo.configuration));
  const seen = new Set();
  return displayCombos.filter((combo) => {
    if (combo.series !== seriesSelect.value) return false;
    if (activeCatalogKey === "zolano" && !isZolanoRecommendedCombo(combo, hasZolanoOriginalSaleRows)) return false;
    const key = activeCatalogKey === "zolano"
      ? combo.id
      : getComboPartCodes(combo).join("+") || combo.id;
    if (seen.has(key)) return false;
    seen.add(key);
    if (widthFilter) {
      const width = getComboWidthValue(combo);
      if (!width && activeCatalogKey === "zolano" && isZolanoRecommendedCombo(combo, hasZolanoOriginalSaleRows)) {
        // Zolano price-list rows often omit numeric width; keep the real row visible.
      } else if (!isWidthInFilter(width, widthFilter)) return false;
    }
    if (!matchesTypeFilters(combo)) return false;
    if (!query) return true;
    return [
      combo.name,
      combo.series,
      combo.configuration,
      combo.description,
      combo.width,
      combo.depth,
      combo.height
    ].join(" ").toLowerCase().includes(query);
  }).sort(compareCombosBySeat);
}

function getWidthFilter() {
  const target = selectedWidthFilter || Number(widthFilterInput?.value || 0);
  if (!Number.isFinite(target) || target <= 0) return null;
  const buckets = {
    1000: { min: 800, max: 1200 },
    1500: { min: 1201, max: 1899 },
    2300: { min: 1900, max: 2399 },
    2500: { min: 2400, max: 2599 },
    2600: { min: 2600, max: 2799 },
    2900: { min: 2800, max: 3199 },
    3500: { min: 3200, max: 3799 },
    4000: { min: 3800, max: 4299 }
  };
  return { target, ...(buckets[target] || { min: target - 250, max: target + 250 }) };
}

function isWidthInFilter(width, filter) {
  const value = Number(width || 0);
  if (!value || !filter) return false;
  return value >= filter.min && value <= filter.max;
}

function matchesTypeFilters(combo) {
  const text = [
    combo.name,
    combo.configuration,
    combo.description
  ].join(" ").toLowerCase();
  const hasChaise = /(贵妃|afl|afr|405|406|\ber\/t\b|\bel\/t\b|\bna\/t\b)/i.test(text);
  const hasRecliner = /(躺位|csa|csal|csar|401|402|recliner|r\/pu|r\/dp)/i.test(text);
  if (hasChaise && !selectedTypeFilters.has("chaise")) return false;
  if (hasRecliner && !selectedTypeFilters.has("recliner")) return false;
  return true;
}

function getComboWidthValue(combo) {
  const directWidth = Number(combo?.width || 0);
  if (directWidth > 0) return directWidth;

  const text = `${combo?.configuration || ""} ${combo?.dimensions || ""}`;
  const meterMatch = text.match(/(\d+(?:\.\d+)?)\s*M\b/i);
  if (meterMatch) return Math.round(Number(meterMatch[1]) * 1000);

  const closeArmMatch = text.match(/收扶手\s*(\d{3,5})/i);
  if (closeArmMatch) return Number(closeArmMatch[1]);

  const explicitLengthMatch = text.match(/\bL\s*[::]\s*([^|]+)/i);
  if (!explicitLengthMatch) return 0;
  const lengths = (explicitLengthMatch[1].match(/\d{3,5}/g) || []).map(Number);
  if (!lengths.length) return 0;

  const config = String(combo?.configuration || "").toUpperCase();
  if (/^3|3S|3NA|3EL/.test(config) && lengths[2]) return lengths[2];
  if (/^2|2S|2NA|2EL/.test(config) && lengths[1]) return lengths[1];
  if (/^1|1S|1NA|1EL|AC|CORNER/.test(config)) return lengths[0];
  return lengths[0];
}

function syncFilterButtons() {
  widthFilterButtons.forEach((button) => {
    button.classList.toggle("is-active", Number(button.dataset.widthFilter || 0) === selectedWidthFilter);
  });
  typeFilterButtons.forEach((button) => {
    button.classList.toggle("is-active", selectedTypeFilters.has(button.dataset.typeFilter));
  });
}

function getSelectedRecommendation() {
  return getSeriesRecommendations().find((combo) => combo.id === recommendSelect.value);
}

function compareCombosBySeat(a, b) {
  const piecesA = getComboPieceCount(a);
  const piecesB = getComboPieceCount(b);
  if (piecesA !== piecesB) return piecesA - piecesB;

  const widthA = Number(a.width || 0);
  const widthB = Number(b.width || 0);
  if (widthA !== widthB) return widthA - widthB;

  return String(a.name || "").localeCompare(String(b.name || ""), "zh-CN");
}

function findItemByPartCode(items, code) {
  const normalizedCode = String(code || "").toUpperCase();
  const idMatch = items.find((item) => String(item.id || "").toUpperCase() === normalizedCode);
  if (idMatch) return idMatch;
  const exactMatch = items.find((item) => getItemCodeCandidates(item).includes(normalizedCode));
  if (exactMatch) return exactMatch;

  return items.find((item) => {
    const text = `${item.model} ${item.configuration}`.toUpperCase();
    return text.includes(normalizedCode);
  });
}

function getComboPartCodes(combo) {
  const parsedCodes = String(combo?.configuration || "").match(/\b\d{3}(?:-[A-Z])?\b/g) || [];
  const partCodes = Array.isArray(combo?.partCodes) ? combo.partCodes : [];
  return parsedCodes.length >= partCodes.length ? parsedCodes : partCodes;
}

function getItemCodeCandidates(item) {
  const candidates = [];
  const model = String(item?.model || "").toUpperCase();
  const series = String(item?.series || "").toUpperCase();
  if (series && model.startsWith(`${series}-`)) {
    candidates.push(model.slice(series.length + 1));
  }
  const configCodes = String(item?.configuration || "").toUpperCase().match(/\b\d{3}(?:-[A-Z])?\b/g) || [];
  candidates.push(...configCodes);
  return [...new Set(candidates)];
}

function getGeneratedSeriesRecommendations() {
  const items = getSeriesItems();
  if (!items.length) return [];
  if (activeCatalogKey === "zolano") return getZolanoGeneratedRecommendations(items);
  if (!["nikator", "le"].includes(activeCatalogKey)) return [];

  const bySeat = {};
  items.forEach((item) => {
    const config = String(item.configuration || "");
    const seat = config.match(/\b\d+(?:\.\d+)?/)?.[0] || "";
    if (!seat) return;
    bySeat[seat] ||= {};
    if (config.includes("PL")) bySeat[seat].left = item;
    if (config.includes("PR")) bySeat[seat].right = item;
    if (config.includes("CB")) bySeat[seat].center = item;
  });

  const generated = [];
  generated.push(...getSingleWholeItemRecommendations(items));

  Object.entries(bySeat).forEach(([seat, group]) => {
    if (!group.left || !group.right) return;
    const baseCombos = [
      [`常用${seat}两人位`, [group.left, group.right]]
    ];
    if (group.center) {
      baseCombos.push(
        [`常用${seat}三人位`, [group.left, group.center, group.right]],
        [`常用${seat}四人位`, [group.left, group.center, group.center, group.right]]
      );
    }

    baseCombos.forEach(([label, parts]) => {
      generated.push(buildGeneratedCombo(label, parts));
    });
  });

  generated.push(...getLoungeGeneratedRecommendations(items));

  return generated.filter(Boolean);
}

function getSingleWholeItemRecommendations(items) {
  return items
    .filter(isSingleWholeSofaItem)
    .sort((a, b) => Number(a.width || 0) - Number(b.width || 0))
    .map((item) => buildGeneratedCombo(getSingleWholeItemLabel(item), [item]));
}

function isSingleWholeSofaItem(item) {
  const config = String(item?.configuration || "").toUpperCase();
  if (!/^\s*\d+(?:\.\d+)?P\b/.test(config)) return false;
  return !/\b(?:PL|PR|CB|AFL|AFR|CS|CSA|ST|CNR)\b/.test(config);
}

function getSingleWholeItemLabel(item) {
  const seat = String(item?.configuration || "").match(/\d+(?:\.\d+)?P\b/i)?.[0] || "";
  return `单件${seat}`;
}

function isGeneratedZolanoCombo(combo) {
  return String(combo?.id || "").startsWith("AUTO-ZOLANO-");
}

function getZolanoGeneratedRecommendations(items) {
  const specialCombos = getZolano3776GeneratedRecommendations(items);
  if (hasZolanoOriginalSaleRecommendations(items)) return specialCombos;

  const components = items.filter((item) => !isZolanoAddOnItem(item) && !isZolanoFullUnit(item));
  const lefts = components.filter((item) => /\b\d+(?:\.\d+)?EL\b/i.test(item.configuration || ""));
  const rights = components.filter((item) => /\b\d+(?:\.\d+)?ER(?:\/T)?\b/i.test(item.configuration || ""));
  const centers = components.filter((item) => /\b\d+(?:\.\d+)?NA\b/i.test(item.configuration || ""));
  const generated = [...specialCombos];

  if (lefts.length !== 1 || rights.length !== 1 || centers.length > 1) return generated;

  const [left] = lefts;
  const [right] = rights;
  const [center] = centers;
  if (!isSafeZolanoGeneratedPart(left) || !isSafeZolanoGeneratedPart(right)) return generated;
  if (center && !isSafeZolanoGeneratedPart(center)) return generated;

  generated.push(buildZolanoGeneratedCombo("Zolano left/right", [left, right]));
  if (center) generated.push(buildZolanoGeneratedCombo("Zolano left/center/right", [left, center, right]));
  return generated.filter(Boolean);

  lefts.forEach((left) => {
    rights.forEach((right) => {
      generated.push(buildZolanoGeneratedCombo("左右扶手组合", [left, right]));
      centers.forEach((center) => {
        generated.push(buildZolanoGeneratedCombo("左右扶手加中位", [left, center, right]));
      });
    });
  });

  return generated.filter(Boolean);
}

function getZolano3776GeneratedRecommendations(items) {
  const series = items[0]?.series || "";
  if (series !== "ZL 3776") return [];

  const byConfig = new Map(items.map((item) => [String(item.configuration || "").toUpperCase(), item]));
  const oneSeat = byConfig.get("1NA");
  const chaiseSeat = byConfig.get("1NA/T");
  const corner = byConfig.get("CORNER");
  const arm = byConfig.get("ARM");
  const stool = byConfig.get("STOOL");
  const photoSetParts = [chaiseSeat, oneSeat, corner, oneSeat, chaiseSeat, arm];
  const photoSetLayout = {
    left: 3460,
    right: 3840,
    depth: "1530/1700",
    height: 890
  };
  const oneSeatWidth = 940;
  const presets = [
    {
      label: "ZL37762 图片整套",
      parts: photoSetParts,
      dimensions: formatZolano3776LayoutDimension(photoSetLayout),
      layoutType: "l-shape",
      photo: "assets/generated/zolano/ZL37762.jpg"
    },
    {
      label: "ZL37762 图片整套 + 1NA 左边加长",
      parts: [chaiseSeat, oneSeat, oneSeat, corner, oneSeat, chaiseSeat, arm],
      dimensions: formatZolano3776LayoutDimension(extendZolano3776Layout(photoSetLayout, { leftAdd: oneSeatWidth })),
      layoutType: "l-shape",
      photo: "assets/generated/zolano/ZL37762.jpg"
    },
    {
      label: "ZL37762 图片整套 + 1NA 右边加长",
      parts: [chaiseSeat, oneSeat, corner, oneSeat, oneSeat, chaiseSeat, arm],
      dimensions: formatZolano3776LayoutDimension(extendZolano3776Layout(photoSetLayout, { rightAdd: oneSeatWidth })),
      layoutType: "l-shape",
      photo: "assets/generated/zolano/ZL37762.jpg"
    },
    {
      label: "ZL37762 图片整套 + 左右各 1NA",
      parts: [chaiseSeat, oneSeat, oneSeat, corner, oneSeat, oneSeat, chaiseSeat, arm],
      dimensions: formatZolano3776LayoutDimension(extendZolano3776Layout(photoSetLayout, { leftAdd: oneSeatWidth, rightAdd: oneSeatWidth })),
      layoutType: "l-shape",
      photo: "assets/generated/zolano/ZL37762.jpg"
    },
    { label: "ZL3776 约 1m", parts: [oneSeat] },
    { label: "ZL3776 约 1.5m", parts: [chaiseSeat] },
    { label: "ZL3776 约 2.5m", parts: [chaiseSeat, oneSeat] },
    { label: "ZL3776 约 2.6m", parts: [chaiseSeat, stool] },
    { label: "ZL3776 约 2.9m", parts: [oneSeat, oneSeat, oneSeat] }
  ];

  return presets
    .map((preset) => ({
      label: preset.label,
      parts: preset.parts.filter(Boolean),
      expectedCount: preset.parts.length,
      dimensions: preset.dimensions,
      layoutType: preset.layoutType,
      photo: preset.photo
    }))
    .filter((preset) => preset.parts.length === preset.expectedCount)
    .map((preset) => buildZolanoGeneratedCombo(preset.label, preset.parts, {
      dimensions: preset.dimensions,
      layoutType: preset.layoutType,
      photo: preset.photo
    }));
}

function hasZolanoOriginalSaleRecommendations(items) {
  const series = items[0]?.series || "";
  return recommendedCombos.some((combo) =>
    combo.series === series
    && isZolanoOriginalSaleConfig(combo.configuration)
  );
}

function isZolanoOriginalSaleConfig(config) {
  const value = String(config || "").toUpperCase().trim();
  if (value.includes("+")) return true;
  if (/\bFULL\s*SET\b|\bSET\b/.test(value)) return true;
  if (/^\d+(?:\.\d+)?(?:\s*\([^)]*(?:MM|CM|M)[^)]*\))?$/.test(value)) return true;
  return /\b\d+(?:\.\d+)?S\b/.test(value);
}

function isSafeZolanoGeneratedPart(item) {
  if (!item) return false;
  const config = String(item.configuration || "").toUpperCase();
  if (/CORNER|STOOL|TABLE|PILLOW|HEADREST|USB|ARM/.test(config)) return false;
  const width = getZolanoItemWidthPair(item);
  return Boolean(width.close || width.open);
}

function buildZolanoGeneratedCombo(name, parts, options = {}) {
  const combo = buildGeneratedCombo(name, parts);
  combo.id = `AUTO-ZOLANO-${parts.map((item) => item.id).join("-")}`;
  combo.partCodes = parts.map((item) => item.id);
  combo.description = "按扶手组件生成组合";
  const widths = parts.map((item) => getZolanoItemWidthPair(item));
  combo.width = widths.reduce((sum, pair) => sum + (pair.close || pair.open || 0), 0);
  combo.depth = Math.max(...parts.map((item) => getDimensionNumber(item, "D")), 0);
  combo.height = Math.max(...parts.map((item) => getDimensionNumber(item, "H")), 0);
  combo.dimensions = options.dimensions || getZolanoPartsDimensionText(parts);
  if (options.layoutType) combo.layoutType = options.layoutType;
  if (options.photo) combo.photo = options.photo;
  return combo;
}

function getZolanoPartsDimensionText(parts) {
  const widths = parts.map((item) => getZolanoItemWidthPair(item));
  const hasAnyWidth = widths.some((pair) => pair.close || pair.open);
  const closeWidth = widths.reduce((sum, pair) => sum + (pair.close || pair.open || 0), 0);
  const openWidth = widths.reduce((sum, pair) => sum + (pair.open || pair.close || 0), 0);
  const depth = Math.max(...parts.map((item) => getDimensionNumber(item, "D")), 0);
  const height = Math.max(...parts.map((item) => getDimensionNumber(item, "H")), 0);
  const seatHeight = Math.max(...parts.map((item) => getSeatHeightNumber(item)), 0);

  const sizeParts = [];
  if (hasAnyWidth && closeWidth && openWidth && closeWidth !== openWidth) {
    sizeParts.push(`收扶手 ${closeWidth}mm / 开扶手 ${openWidth}mm`);
  } else if (hasAnyWidth && closeWidth) {
    sizeParts.push(`宽 ${closeWidth}mm`);
  }
  if (depth) sizeParts.push(`\u6df1 ${depth}mm`);
  if (height) sizeParts.push(`高 ${height}mm`);
  if (seatHeight) sizeParts.push(`坐高 ${seatHeight}mm`);
  return sizeParts.join(" | ");
}

function getZolanoItemWidthPair(item) {
  const text = String(item?.dimensions || "");
  const armMatch = text.match(/收扶手\s*(\d{3,5})\s*\/\s*开扶手\s*(\d{3,5})/);
  if (armMatch) return { close: Number(armMatch[1]), open: Number(armMatch[2]) };
  const lMatch = text.match(/\bL\s*(\d{3,5})/i);
  if (lMatch) return { close: Number(lMatch[1]), open: Number(lMatch[1]) };
  const numericWidth = Number(item?.width || 0);
  return numericWidth ? { close: numericWidth, open: numericWidth } : { close: 0, open: 0 };
}

function getDimensionNumber(item, label) {
  const text = String(item?.dimensions || "");
  const match = text.match(new RegExp(`\\b${label}\\s*(\\d{3,5})`, "i"));
  return match ? Number(match[1]) : Number(item?.[label === "D" ? "depth" : "height"] || 0);
}

function getSeatHeightNumber(item) {
  const text = String(item?.dimensions || "");
  const match = text.match(/seat\s*H\s*(\d{3,5})|坐高\s*(\d{3,5})/i);
  return match ? Number(match[1] || match[2]) : 0;
}

function getLoungeGeneratedRecommendations(items) {
  const byCode = new Map();
  items.forEach((item) => {
    getItemCodeCandidates(item).forEach((code) => byCode.set(code, item));
  });
  const centerCode = ["502", "501", "506", "507"].find((code) => byCode.has(code));

  const comboSpecs = [
    { label: "常用左躺位两件", codes: ["401", "122"] },
    { label: "常用右躺位两件", codes: ["121", "402"] },
    { label: "常用左躺位三件", codes: ["401", "502", "122"] },
    { label: "常用右躺位三件", codes: ["121", "502", "402"] },
    { label: "常用左贵妃两件", codes: ["405", "122"] },
    { label: "常用右贵妃两件", codes: ["121", "406"] },
    { label: "常用左贵妃三件", codes: ["405", "502", "122"] },
    { label: "常用右贵妃三件", codes: ["121", "502", "406"] },
    { label: "常用双贵妃三件", codes: ["405", centerCode, "406"] },
    { label: "常用双躺位三件", codes: ["401", centerCode, "402"] }
  ];

  const sideSeats = items.filter((item) => {
    const config = String(item.configuration || "").toUpperCase();
    return /\b\d+(?:\.\d+)?P[LR]\b/.test(config);
  });

  sideSeats.forEach((item) => {
    const codes = getItemCodeCandidates(item);
    const code = codes[0];
    const config = String(item.configuration || "").toUpperCase();
    if (!code) return;
    if (config.includes("PL")) {
      comboSpecs.push({ label: "常用左扶手配右贵妃两件", codes: [code, "406"] });
      comboSpecs.push({ label: "常用左扶手配右躺位两件", codes: [code, "402"] });
    }
    if (config.includes("PR")) {
      comboSpecs.push({ label: "常用左贵妃配右扶手两件", codes: ["405", code] });
      comboSpecs.push({ label: "常用左躺位配右扶手两件", codes: ["401", code] });
    }
  });

  return comboSpecs
    .map((spec) => {
      const parts = spec.codes.map((code) => byCode.get(code));
      if (parts.some((part) => !part)) return null;
      return buildGeneratedCombo(spec.label, parts);
    })
    .filter(Boolean);
}

function getLeAddOnSets(items) {
  const byCode = new Map();
  items.forEach((item) => {
    getItemCodeCandidates(item).forEach((code) => byCode.set(code, item));
  });

  return [
    { label: "603-A + 400-A", codes: ["603-A", "400-A"] },
    { label: "603 + 400", codes: ["603", "400"] },
    { label: "604 + 400-A", codes: ["604", "400-A"] }
  ].map((set) => ({
    label: set.label,
    items: set.codes.map((code) => byCode.get(code)).filter(Boolean)
  })).filter((set) => set.items.length === 2);
}

function buildGeneratedCombo(name, parts) {
  const first = parts[0];
  const priceOptionCount = Math.max(...parts.map((item) => item.priceOptions?.length || 0), 0);
  const priceOptions = Array.from({ length: priceOptionCount }, (_, index) =>
    parts.reduce((sum, item) => sum + Number(item.priceOptions?.[index] || item.price || 0), 0)
  );
  const partCodes = parts.map((item) => getItemCodeCandidates(item)[0]).filter(Boolean);

  return {
    id: `AUTO-${first.series}-${name}-${partCodes.join("-")}`,
    brand: first.brand,
    series: first.series,
    name,
    configuration: parts.map((item) => item.configuration).join(" + "),
    description: "常用直排组合",
    partCodes,
    pieceCount: partCodes.length,
    width: parts.reduce((sum, item) => sum + Number(item.width || 0), 0),
    depth: Math.max(...parts.map((item) => Number(item.depth || 0))),
    height: Math.max(...parts.map((item) => Number(item.height || 0))),
    price: priceOptions[0] || 0,
    priceOptions,
    priceFactor: first.priceFactor || 1,
    materials: first.materials || [],
    photo: first.originalPhoto || first.photo
  };
}

function isAccessoryItem(item) {
  return item?.itemType === "accessory" || item?.addOn === true;
}

function isZolanoAddOnItem(item) {
  if (!item) return false;
  const text = `${item.configuration || ""} ${item.description || ""} ${item.model || ""}`.toUpperCase();
  return /\b(TABLE|PILLOW|HEADREST|USB|CUSHION)\b/.test(text) || /茶几|抱枕|头枕|靠枕|配件|加购/.test(text);
}

function isZolanoFullUnit(item) {
  if (!item || activeCatalogKey !== "zolano") return false;
  const config = String(item.configuration || "").toUpperCase();
  return isZolanoOriginalSaleConfig(config);
}

function isZolanoRecommendedCombo(combo, hasOriginalSaleRows = true) {
  if (!combo) return false;
  if (isGeneratedZolanoCombo(combo)) return true;
  const config = String(combo.configuration || "").toUpperCase();
  if (isZolanoOriginalSaleConfig(config)) return true;
  if (hasOriginalSaleRows) return false;
  return isZolanoFallbackModuleRecommendation(combo);
}

function isZolanoFallbackModuleRecommendation(combo) {
  if (isZolanoAddOnItem(combo)) return false;
  const config = String(combo?.configuration || "").toUpperCase();
  return /\b\d+(?:\.\d+)?(?:EL|ER|NA|S)(?:\/[A-Z])?\b/.test(config)
    || /\b(?:CORNER|STOOL|OTTOMAN|AC)\b/.test(config);
}

function removeDuplicateZolanoGeneratedCombos(combos) {
  const explicitPlusDimensions = new Set(
    combos
      .filter((combo) => !isGeneratedZolanoCombo(combo) && String(combo.configuration || "").includes("+"))
      .map((combo) => getZolanoWidthPairKey(getRecommendationDimensionText(combo)))
      .filter(Boolean)
  );
  const keptGeneratedDimensions = new Set();
  return combos.filter((combo) => {
    if (!isGeneratedZolanoCombo(combo)) return true;
    const dimensionKey = getZolanoWidthPairKey(getRecommendationDimensionText(combo));
    if (!dimensionKey) return true;
    if (explicitPlusDimensions.has(dimensionKey)) return false;
    if (keptGeneratedDimensions.has(dimensionKey)) return false;
    keptGeneratedDimensions.add(dimensionKey);
    return true;
  });
}

function findZolanoRecommendedItem(seriesItems, combo) {
  if (!combo) return null;
  return seriesItems.find((item) => item.id === combo.id)
    || seriesItems.find((item) =>
      item.series === combo.series
      && normalizeComboText(item.configuration) === normalizeComboText(combo.configuration)
    )
    || seriesItems.find((item) =>
      item.series === combo.series
      && normalizeComboText(item.name) === normalizeComboText(combo.name)
    )
    || null;
}

function normalizeComboText(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/[()()]/g, "");
}

function normalizeDimensionText(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/[,,]/g, "|");
}

function getZolanoWidthPairKey(value) {
  const numbers = String(value || "").match(/\d{3,5}/g) || [];
  if (!numbers.length) return "";
  return `${numbers[0]}-${numbers[1] || numbers[0]}`;
}

function formatPieceOption(item) {
  if (activeCatalogKey === "diningTable") {
    const selectedMaterial = materialSelect.options[materialSelect.selectedIndex]?.textContent || "";
    if (isDiningMaterialGradeLabel(selectedMaterial)) {
      return item.dimensions || item.model || item.series;
    }
    const model = item.model || item.originalSeries || item.series;
    return [model, item.dimensions || item.configuration].filter(Boolean).join(" - ");
  }
  const prefix = isAccessoryItem(item) ? "配件/加购: " : "";
  return `${prefix}${formatZolanoUnitConfig(item.configuration || item.model)} - ${item.description || item.model}`;
}

function formatZolanoUnitConfig(config) {
  const text = String(config || "");
  if (activeCatalogKey !== "zolano") return text;
  const remarks = {
    "1NA": "单位没扶手",
    "1NA/T": "单位没扶手伸展位",
    ARM: "扶手",
    CORNER: "转角"
  };
  return text.replace(/\b(1NA\/T|1NA|ARM|CORNER)\b/g, (match) => `${match}(${remarks[match]})`);
}

function renderSetPreview() {
  const selectedRecommendation = resolvePricedZolanoRecommendation(getSelectedRecommendation());
  const selected = [...slotGrid.querySelectorAll(".slot-select")]
    .map((select) => select.value)
    .map((id) => catalogSofas.find((sofa) => sofa.id === id))
    .filter(Boolean);
  const effectiveRecommendation = selectedRecommendation || resolvePricedZolanoRecommendation(findMatchingRecommendedCombo(selected));
  const materialIndex = Number(materialSelect.value || 0);
  const mixedMaterialLabels = getMaterialLabels(selected[0] || effectiveRecommendation);
  const usesSinglePriceMaterial = isSinglePriceMaterialLabels(mixedMaterialLabels);
  const materialName = usesSinglePriceMaterial
    ? ""
    : formatMaterialDisplayLabel(materialSelect.options[materialSelect.selectedIndex]?.textContent || "材质");
  const mixedMaterialEnabled = isMixedMaterialSet(selected);
  const mixedMaterialSummary = mixedMaterialEnabled
    ? getMixedMaterialSummary(selected, materialIndex, mixedMaterialLabels)
    : materialName;
  if (!catalogSofas.length) {
    if (setTotal) setTotal.textContent = money.format(0);
    setPreview.innerHTML = `
      <div class="catalog-empty">
        <strong>${catalogDefinitions[activeCatalogKey].label}</strong>
        <p>这个目录还没有载入型号。</p>
      </div>
    `;
    return;
  }
  const total = getSetMaterialPrice(selected, effectiveRecommendation, materialIndex, { useMixed: true });
  const hasCombination = Boolean(effectiveRecommendation) || selected.length > 0;
  const displayedPieceCount = getDisplayedPieceCount(effectiveRecommendation, selected);

  if (setTotal) setTotal.textContent = money.format(total);
  setPreview.innerHTML = "";

  const materialList = document.createElement("div");
  materialList.className = "material-list material-list-after-photo";
  materialList.innerHTML = `<h3>整套售价</h3>${mixedMaterialSummary ? `<p>已选:${mixedMaterialSummary} · ${money.format(total)}</p>` : ""}`;
  const labels = getMaterialLabels(effectiveRecommendation || selected[0]);
  if (!usesSinglePriceMaterial) {
    labels.forEach((label, index) => {
      const row = document.createElement("div");
      const isSelectedMaterial = index === materialIndex;
      const displayLabel = formatMaterialDisplayLabel(label);
      row.className = `material-row${isSelectedMaterial ? " is-selected" : ""}`;
      const value = getSetMaterialPrice(selected, effectiveRecommendation, index, { useMixed: false });
      row.innerHTML = `<span>${displayLabel}${isSelectedMaterial ? "(已选)" : ""}</span><strong>整套 ${money.format(value)}</strong>`;
      materialList.append(row);
    });
  }

  const photoItem = effectiveRecommendation || selected[0] || { series: seriesSelect.value, model: seriesSelect.value };
  const setPhoto = document.createElement("article");
  setPhoto.className = "set-photo-card";
  const recommendationDimensions = effectiveRecommendation?.dimensions || "";
  const selectedDimensions = selected[0]?.dimensions || "";
  const selectedSizeText = selected[0]?.width && selected[0]?.depth && selected[0]?.height
    ? `${selected[0].width} x ${selected[0].depth} x ${selected[0].height} mm`
    : "";
  const dimensionText = getCombinedDimensionText(selected, effectiveRecommendation)
    || recommendationDimensions
    || selectedDimensions
    || selectedSizeText;
  const bedSizeOptions = activeCatalogKey === "bed" ? renderBedSizeOptions(selected[0]) : "";
  setPhoto.innerHTML = `
    <div class="set-photo-heading">
      <h3>${effectiveRecommendation?.name || seriesSelect.value || "沙发组合"}</h3>
      <p>${[formatComboSummary(effectiveRecommendation, selected), mixedMaterialSummary].filter(Boolean).join(" - ")}</p>
    </div>
    <button class="photo-open-button" type="button" data-full-photo="${resolveItemPhoto(photoItem)}" aria-label="放大图片">
      <img class="set-main-photo" src="${resolveItemPhoto(photoItem)}" alt="${photoItem?.series || "沙发组合"}">
    </button>
    ${renderPhotoGallery(photoItem)}
    <div class="set-photo-copy">
      ${bedSizeOptions}
      ${dimensionText ? `<p class="combo-dimension"><span>整套尺寸</span><strong>${dimensionText}</strong></p>` : ""}
      ${hasCombination ? `<p class="combo-pieces"><span>组合件数</span><strong>${displayedPieceCount} 件</strong></p>` : ""}
      ${hasCombination ? `<p class="combo-total"><span>整套售价</span><strong>${money.format(total)}</strong></p>` : ""}
    </div>
  `;
  if (!usesSinglePriceMaterial) setPhoto.append(materialList);
  setPreview.append(setPhoto);
  bindPhotoGallery(setPhoto);
  bindPhotoFullscreen(setPhoto);
  bindBedSizeOptions(setPhoto);

  const pieceList = document.createElement("div");
  pieceList.className = "piece-list";
  selected.forEach((item, index) => {
    const row = document.createElement("article");
    const piecePhoto = resolveIndividualItemPhoto(item);
    row.className = `set-piece${piecePhoto ? "" : " set-piece-no-photo"}`;
    const pieceMaterialIndex = mixedMaterialEnabled
      ? getPieceMaterialIndex(pieceMaterialSelections, index, materialIndex)
      : materialIndex;
    const pieceMaterialName = usesSinglePriceMaterial
      ? ""
      : formatMaterialDisplayLabel(mixedMaterialLabels[pieceMaterialIndex] || materialName);
    const pieceMaterialControl = mixedMaterialEnabled
      ? renderPieceMaterialSelect(index, pieceMaterialIndex, mixedMaterialLabels)
      : "";
    const diningTurntableNote = formatDiningTurntableNote(item);
    const piecePrice = getDiningPackageItems(item).reduce((sum, packageItem) => sum + getMaterialPrice(packageItem, pieceMaterialIndex), 0);
    row.innerHTML = `
        ${piecePhoto ? `<img class="set-piece-photo" src="${piecePhoto}" alt="${item.model}">` : ""}
        <div>
          <h3>位置 ${index + 1}: ${item.model}</h3>
        <p>${isAccessoryItem(item) ? "配件/加购 - " : ""}${formatZolanoUnitConfig(item.configuration || "")} ${item.description || ""}</p>
        ${!effectiveRecommendation && item.dimensions ? `<p>${item.dimensions}</p>` : ""}
        ${item.width ? `<p>${item.width} x ${item.depth} x ${item.height} mm</p>` : ""}
        ${diningTurntableNote ? `<p class="included-accessory-note">${diningTurntableNote}</p>` : ""}
        ${pieceMaterialControl}
      </div>
      <strong>${[pieceMaterialName, money.format(piecePrice)].filter(Boolean).join(" ")}</strong>
    `;
    pieceList.append(row);
  });
  setPreview.append(pieceList);
  bindPieceMaterialSelectors(pieceList);
}

function renderBedSizeOptions(selectedItem) {
  if (!selectedItem?.series) return "";
  const options = catalogSofas.filter((item) => item.series === selectedItem.series);
  if (activeCatalogKey !== "bed" || options.length <= 1) return "";
  return `
    <div class="bed-size-options" aria-label="\u5e8a\u5c3a\u5bf8">
      <span>\u5c3a\u5bf8</span>
      <div>
        ${options.map((item) => `
          <button class="bed-size-option${item.id === selectedItem.id ? " is-active" : ""}" type="button" data-bed-size-id="${item.id}">
            ${formatBedSizeLabel(item)}
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

function formatBedSizeLabel(item) {
  const config = String(item?.configuration || item?.model || "")
    .replace(/\u76ae\u5e8a/g, "")
    .trim();
  const mattress = String(item?.description || item?.details || "").match(/(\d{3,4})\s*[*xX]\s*(\d{3,4})/);
  const mattressText = mattress ? `${mattress[1]}x${mattress[2]}` : "";
  return [config, mattressText].filter(Boolean).join(" ");
}

function bindBedSizeOptions(container) {
  container.querySelectorAll("[data-bed-size-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.bedSizeId || "";
      const firstSlot = slotGrid.querySelector(".slot-select");
      if (!id || !firstSlot) return;
      firstSlot.value = id;
      renderSetPreview();
    });
  });
}

function resolvePricedZolanoRecommendation(combo) {
  if (activeCatalogKey !== "zolano" || !combo) return combo;
  if (combo.price || combo.priceOptions?.length) return combo;
  return catalogSofas.find((item) => item.id === combo.id)
    || findZolanoRecommendedItem(getSeriesItems(), combo)
    || combo;
}

function resolveIndividualItemPhoto(item) {
  if (!item) return "";
  const overrides = window.BAIDU_PHOTO_OVERRIDES || {};
  const galleryPhoto = getSeriesGalleryPhotos(item.series)[0] || "";
  return individualItemPhotos[item.id]
    || individualItemPhotos[item.model]
    || individualItemPhotos[item.configuration]
    || overrides[item.series]
    || galleryPhoto
    || resolveZolanoUnitFallbackPhoto(item)
    || "";
}

function resolveZolanoUnitFallbackPhoto(item) {
  if (activeCatalogKey !== "zolano") return "";
  if (isAccessoryItem(item)) return "";
  return item.originalPhoto || item.photo || (window.BAIDU_PHOTO_OVERRIDES || {})[item.series] || "";
}

function renderPhotoGallery(item) {
  const photos = getItemGallery(item);
  if (photos.length <= 1) return "";
  return `
    <div class="photo-gallery" aria-label="同型号更多图片">
      ${photos.map((src, index) => `
        <button class="photo-thumb${index === 0 ? " is-active" : ""}" type="button" data-photo-src="${src}" aria-label="图片 ${index + 1}">
          <img src="${src}" alt="">
        </button>
      `).join("")}
    </div>
  `;
}

function bindPhotoGallery(container) {
  const mainPhoto = container.querySelector(".set-main-photo");
  const openButton = container.querySelector(".photo-open-button");
  const thumbs = [...container.querySelectorAll(".photo-thumb")];
  if (!mainPhoto || !thumbs.length) return;
  thumbs.forEach((button) => {
    button.addEventListener("click", () => {
      mainPhoto.src = button.dataset.photoSrc;
      if (openButton) openButton.dataset.fullPhoto = button.dataset.photoSrc;
      thumbs.forEach((thumb) => thumb.classList.toggle("is-active", thumb === button));
    });
  });
}

function getDisplayedPhotoUrls(container) {
  const thumbPhotos = [...container.querySelectorAll(".photo-thumb")]
    .map((button) => button.dataset.photoSrc)
    .filter(Boolean);
  const photos = thumbPhotos.length ? thumbPhotos : [getCurrentPhotoUrl(container)].filter(Boolean);
  return [...new Set(photos.map(toAbsoluteUrl))];
}

function getCurrentPhotoUrl(container) {
  const openButton = container.querySelector(".photo-open-button");
  const mainPhoto = container.querySelector(".set-main-photo");
  return openButton?.dataset.fullPhoto || mainPhoto?.getAttribute("src") || "";
}

function toAbsoluteUrl(src) {
  try {
    return new URL(src, window.location.href).href;
  } catch {
    return src;
  }
}

async function copyCurrentPhotoToClipboard(src, imageElement = null) {
  if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined" || !window.isSecureContext) {
    return false;
  }
  try {
    const imageBlob = imageElement ? await getClipboardImageBlobFromElement(imageElement) : await getClipboardImageBlob(src);
    await navigator.clipboard.write([
      new ClipboardItem({ [imageBlob.type || "image/png"]: imageBlob })
    ]);
    return true;
  } catch {
    return false;
  }
}

async function getClipboardImageBlobFromElement(imageElement) {
  if (!imageElement?.complete || !imageElement.naturalWidth || !imageElement.naturalHeight) {
    throw new Error("Photo is not ready");
  }
  const canvas = document.createElement("canvas");
  canvas.width = imageElement.naturalWidth;
  canvas.height = imageElement.naturalHeight;
  const context = canvas.getContext("2d");
  context.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) => {
    canvas.toBlob((pngBlob) => {
      if (pngBlob) resolve(pngBlob);
      else reject(new Error("Image copy failed"));
    }, "image/png");
  });
}

async function getClipboardImageBlob(src) {
  const response = await fetch(toAbsoluteUrl(src), { cache: "no-store" });
  if (!response.ok) throw new Error("Photo download failed");
  const sourceBlob = await response.blob();
  const sourceType = sourceBlob.type || guessPatchContentType(src);
  if (sourceType === "image/png" || ClipboardItem.supports?.(sourceType)) {
    return new Blob([sourceBlob], { type: sourceType });
  }
  return convertImageBlobToPng(sourceBlob);
}

async function convertImageBlobToPng(blob) {
  if (typeof createImageBitmap !== "function") throw new Error("Image conversion is not supported");
  const bitmap = await createImageBitmap(blob);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const context = canvas.getContext("2d");
  context.drawImage(bitmap, 0, 0);
  bitmap.close?.();
  return new Promise((resolve, reject) => {
    canvas.toBlob((pngBlob) => {
      if (pngBlob) resolve(pngBlob);
      else reject(new Error("Image conversion failed"));
    }, "image/png");
  });
}

async function copyTextToClipboard(text) {
  try {
    if (navigator.clipboard?.writeText && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the older selection-based copy path.
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-1000px";
  textarea.style.top = "0";
  textarea.style.opacity = "0.01";
  document.body.append(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }
  textarea.remove();
  return copied;
}

function showCopyFallback(text, title = "复制") {
  const existing = document.querySelector(".copy-fallback");
  if (existing) existing.remove();
  const overlay = document.createElement("div");
  overlay.className = "copy-fallback";
  overlay.innerHTML = `
    <div class="copy-fallback-panel">
      <div class="copy-fallback-heading">
        <strong>${title}</strong>
        <button type="button" data-close-copy-fallback>关闭</button>
      </div>
      <p>自动复制被系统拦截，请长按下面内容复制。</p>
      <textarea readonly></textarea>
    </div>
  `;
  const textarea = overlay.querySelector("textarea");
  textarea.value = text;
  overlay.querySelector("[data-close-copy-fallback]").addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) overlay.remove();
  });
  document.body.append(overlay);
  textarea.focus();
  textarea.select();
}

async function sharePhoto(src, imageElement = null) {
  const url = toAbsoluteUrl(src);
  if (!navigator.share) return false;
  try {
    const blob = imageElement ? await getClipboardImageBlobFromElement(imageElement) : await getClipboardImageBlob(src);
    const extension = blob.type.includes("png") ? "png" : blob.type.includes("webp") ? "webp" : "jpg";
    const file = new File([blob], `sofa-photo.${extension}`, { type: blob.type || "image/jpeg" });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: "沙发图片" });
      return true;
    }
  } catch {
    // Some browsers block file sharing from local cached assets. URL sharing is the fallback.
  }
  try {
    await navigator.share({ title: "沙发图片", url });
    return true;
  } catch {
    return false;
  }
}

function flashButtonText(button, text) {
  const original = button.textContent;
  button.textContent = text;
  window.setTimeout(() => {
    button.textContent = original;
  }, 1400);
}

function bindPhotoFullscreen(container) {
  const openButton = container.querySelector(".photo-open-button");
  if (!openButton) return;
  openButton.addEventListener("click", () => {
    openFullscreenPhoto(openButton.dataset.fullPhoto);
  });
}

function openFullscreenPhoto(src) {
  if (!src) return;
  const overlay = document.createElement("div");
  overlay.className = "photo-fullscreen";
  overlay.innerHTML = `
    <button class="photo-fullscreen-close" type="button" aria-label="关闭">×</button>
    <button class="photo-fullscreen-raw" type="button" data-open-raw-photo>打开图片</button>
    <img src="${src}" alt="沙发图片" data-open-raw-photo>
  `;
  overlay.addEventListener("click", (event) => {
    if (event.target.closest("[data-open-raw-photo]")) {
      openRawPhotoForLongPress(src);
      return;
    }
    if (event.target === overlay || event.target.closest(".photo-fullscreen-close")) {
      overlay.remove();
    }
  });
  document.body.append(overlay);
}

function openRawPhotoForLongPress(src) {
  const url = `photo-viewer.html?src=${encodeURIComponent(toAbsoluteUrl(src))}`;
  const opened = window.open(url, "_blank");
  if (!opened) window.location.href = url;
}

function getItemGallery(item) {
  if (!item) return [];
  if (isPhotoBlockedSeries(item.series)) return [placeholderImage()];
  const seriesPhotos = getSeriesGalleryPhotos(item.series);
  const primary = resolveItemPhoto(item);
  return [primary, ...seriesPhotos].filter(Boolean).filter((src, index, list) => list.indexOf(src) === index);
}

function getSeriesGalleryPhotos(series) {
  const gallery = window.BAIDU_PHOTO_GALLERY || {};
  const entryGallery = window.BAIDU_ENTRY_PHOTO_GALLERY || {};
  return [
    ...(entryGallery[series] || []),
    ...(gallery[series] || [])
  ].filter(Boolean).filter((src, index, list) => list.indexOf(src) === index);
}

function formatComboOption(combo) {
  const sizeText = getCombinedDimensionText([], combo) || getRecommendationDimensionText(combo);
  const pieceCount = getComboPieceCount(combo);
  const isSlant = /-B\b|斜位|斜形/i.test(combo.configuration || "");
  const nameLabel = isSlant ? `${combo.name} (斜形)` : combo.name;
  return `${nameLabel} · ${pieceCount}件 - ${formatZolanoUnitConfig(combo.configuration)}${sizeText ? ` | 尺寸 ${sizeText}` : ""}`;
}

function getRecommendationDimensionText(combo) {
  if (!combo?.dimensions || combo.dimensions === combo.configuration) {
    const width = getComboWidthValue(combo);
    return width ? `${width}mm` : "";
  }
  return combo.dimensions;
}

function formatComboSummary(combo, selected) {
  if (combo) return `${getComboPieceCount(combo)}件:${formatZolanoUnitConfig(combo.configuration)}`;
  if (activeCatalogKey === "diningTable") return `已选 ${selected.length} 套`;
  return `已选 ${selected.length} 件`;
}

function getComboPieceCount(combo) {
  if (activeCatalogKey === "zolano" && combo && !isGeneratedZolanoCombo(combo)) {
    return getZolanoRecommendationPieceCount(combo);
  }
  return Number(combo?.pieceCount || 0) || getComboPartCodes(combo).length || 1;
}

function getZolanoRecommendationPieceCount(combo) {
  const config = String(combo?.configuration || "");
  if (!config.includes("+")) return 1;
  return config.split("+").map((part) => part.trim()).filter(Boolean).length || 1;
}

function getDisplayedPieceCount(selectedRecommendation, selected) {
  if (activeCatalogKey === "diningTable" && !selectedRecommendation) {
    return selected.reduce((sum, item) => sum + getDiningPackageItems(item).length, 0) || selected.length;
  }
  return getComboPieceCount(selectedRecommendation) || selected.length;
}

function findMatchingRecommendedCombo(selected) {
  if (!selected.length) return null;
  if (activeCatalogKey === "zolano" && selected.length > 1) return null;
  if (activeCatalogKey === "zolano" && selected.length === 1 && !isZolanoFullUnit(selected[0])) return null;
  const selectedKey = selected.map((item) => getItemCodeCandidates(item)[0]).filter(Boolean).join("+");
  if (!selectedKey) return null;
  return [...recommendedCombos, ...getGeneratedSeriesRecommendations()].find((combo) => {
    if (combo.series !== seriesSelect.value) return false;
    return getComboPartCodes(combo).join("+") === selectedKey;
  }) || null;
}

function getCombinedDimensionText(selected, selectedRecommendation) {
  if (selectedRecommendation?.layoutType === "l-shape" && selectedRecommendation?.dimensions) {
    return selectedRecommendation.dimensions;
  }

  if (selectedRecommendation?.dimensions && /[|/]/.test(selectedRecommendation.dimensions)) {
    return selectedRecommendation.dimensions;
  }

  if (selectedRecommendation?.width && selectedRecommendation?.depth && selectedRecommendation?.height) {
    return `${selectedRecommendation.width} x ${selectedRecommendation.depth} x ${selectedRecommendation.height} mm`;
  }

  const numericItems = selected
    .map((item) => ({
      width: Number(item.width || 0),
      depth: Number(item.depth || 0),
      height: Number(item.height || 0)
    }))
    .filter((item) => item.width > 0 && item.depth > 0 && item.height > 0);

  if (!numericItems.length) return "";

  if (numericItems.length === 1) {
    const item = numericItems[0];
    return `${item.width} x ${item.depth} x ${item.height} mm`;
  }

  const width = numericItems.reduce((sum, item) => sum + item.width, 0);
  const depth = Math.max(...numericItems.map((item) => item.depth));
  const height = Math.max(...numericItems.map((item) => item.height));
  return `${width} x ${depth} x ${height} mm`;
}

function isMixedMaterialSet(selected) {
  return activeCatalogKey === "zolano" && selected.length > 1;
}

function getMixedMaterialSummary(selected, defaultIndex, labels) {
  const counts = {};
  selected.forEach((_, index) => {
    const materialIndex = getPieceMaterialIndex(pieceMaterialSelections, index, defaultIndex);
    const label = formatMaterialDisplayLabel(labels[materialIndex] || labels[defaultIndex] || "\u6750\u8d28");
    counts[label] = (counts[label] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([label, count]) => `${label} x${count}`)
    .join(" + ");
}

function renderPieceMaterialSelect(slotIndex, selectedIndex, labels) {
  return `
    <label class="piece-material-control">
      <span>\u6750\u8d28</span>
      <select class="piece-material-select" data-piece-material-slot="${slotIndex}">
        ${labels.map((label, index) => `
          <option value="${index}"${index === selectedIndex ? " selected" : ""}>${formatMaterialDisplayLabel(label)}</option>
        `).join("")}
      </select>
    </label>
  `;
}

function bindPieceMaterialSelectors(container) {
  container.querySelectorAll(".piece-material-select").forEach((select) => {
    select.addEventListener("change", () => {
      pieceMaterialSelections[select.dataset.pieceMaterialSlot] = Number(select.value || 0);
      renderSetPreview();
    });
  });
}

function getSetMaterialPrice(selected, selectedRecommendation, index, options = {}) {
  if (options.useMixed && isMixedMaterialSet(selected)) {
    return getMixedMaterialTotal(selected, pieceMaterialSelections, index, getMaterialPrice);
  }
  if (selectedRecommendation?.priceOptions?.length || selectedRecommendation?.price) {
    return getMaterialPrice(selectedRecommendation, index);
  }
  return selected.reduce((sum, item) => sum + getDiningPackageItems(item).reduce((itemSum, packageItem) =>
    itemSum + getMaterialPrice(packageItem, index), 0), 0);
}

function getMaterialPrice(item, index) {
  const selectedMaterial = materialSelect.options[index]?.textContent || "";
  if (activeCatalogKey === "diningTable" && isDiningMaterialGradeLabel(selectedMaterial)) {
    const equivalentItem = findDiningEquivalentMaterialItem(item, selectedMaterial);
    const basePrice = Number(equivalentItem?.priceOptions?.[0] || equivalentItem?.price || item?.price || 0);
    return getRetailPrice(basePrice, 1, equivalentItem?.priceFactor || item?.priceFactor || 1);
  }
  if (activeCatalogKey === "zolano" && selectedMaterial.toUpperCase() === "NUBUCK") {
    const nubuckBasePrice = getZolanoNubuckBasePrice(item);
    return getRetailPrice(nubuckBasePrice, 1, item.priceFactor || 1);
  }
  const matchingIndex = Array.isArray(item.materials)
    ? item.materials.findIndex((label) => String(label).toUpperCase() === selectedMaterial.toUpperCase())
    : -1;
  const priceIndex = matchingIndex >= 0 ? matchingIndex : index;
  const basePrice = Number(item.priceOptions?.[priceIndex] || item.price || 0);
  return getRetailPrice(basePrice, 1, item.priceFactor || 1);
}

function findDiningEquivalentMaterialItem(item, materialLabel) {
  if (!item || activeCatalogKey !== "diningTable") return item;
  const size = getDiningSizeValue(item);
  return getSeriesItems().find((candidate) =>
    getDiningMaterialGradeKey(candidate) === getDiningMaterialGradeKey(materialLabel)
    && (!size || Math.abs(getDiningSizeValue(candidate) - size) < 40)
  ) || item;
}

function getMaterialLabels(item) {
  const labels = Array.isArray(item?.materials) ? [...item.materials] : [];
  if (activeCatalogKey === "zolano") {
    return ["M/F", "F/SA", "NuBuck"];
  }
  if (activeCatalogKey === "diningTable") {
    const gradeLabels = getDiningSeriesMaterialGradeLabels();
    if (gradeLabels.length > 1) return gradeLabels;
  }
  if (activeCatalogKey === "zolano" && labels.length && !labels.some((label) => String(label).toUpperCase() === "NUBUCK")) {
    labels.push("NuBuck");
  }
  return labels;
}

function getDiningSeriesMaterialGradeLabels() {
  if (activeCatalogKey !== "diningTable") return [];
  const byGrade = new Map();
  getSeriesItems().forEach((item) => {
    const key = getDiningMaterialGradeKey(item);
    if (!key || byGrade.has(key)) return;
    byGrade.set(key, getDiningMaterialGradeLabel(item));
  });
  return [...byGrade.values()];
}

function getDiningMaterialGradeLabel(item) {
  const key = getDiningMaterialGradeKey(item);
  if (!key) return "";
  const text = typeof item === "string" ? item : getCatalogText(item);
  const stoneNames = extractDiningStoneNames(text);
  return stoneNames ? `${key} - ${stoneNames}` : key;
}

function getDiningMaterialGradeKey(item) {
  const text = typeof item === "string" ? item : getCatalogText(item);
  if (/一等级/.test(text)) return "一等级";
  if (/二等级/.test(text)) return "二等级";
  if (/三等级/.test(text)) return "三等级";
  return "";
}

function extractDiningStoneNames(text) {
  const normalized = String(text || "").replace(/\s+/g, " ");
  const match = normalized.match(/[一二三]等级[::]\s*([^框底脚]+)/);
  if (!match) return "";
  return match[1].replace(/[。;;]+$/g, "").trim();
}

function isDiningMaterialGradeLabel(label) {
  return Boolean(getDiningMaterialGradeKey(label));
}

/*
function getDiningMaterialGradeLabelOld(item) {
  const text = getCatalogText(item);
  if (/一等级/.test(text)) return "一等级";
  if (/二等级/.test(text)) return "二等级";
  if (/三等级/.test(text)) return "三等级";
  return "";
}

*/

function formatMaterialDisplayLabel(label) {
  const text = String(label || "").trim();
  if (isSinglePriceMaterialLabel(text)) return "\u4ef7\u683c";
  return text;
}

function isSinglePriceMaterialLabels(labels = []) {
  return labels.length === 1 && isSinglePriceMaterialLabel(labels[0]);
}

function isSinglePriceMaterialLabel(label) {
  return String(label || "").trim() === "\u4ef7\u683c";
}

function getZolanoNubuckBasePrice(item) {
  const materials = Array.isArray(item?.materials) ? item.materials : [];
  const fsaIndex = materials.findIndex((label) => String(label).toUpperCase() === "F/SA");
  const fallbackIndex = Math.max(0, Math.min((item?.priceOptions?.length || 1) - 1, fsaIndex >= 0 ? fsaIndex : materials.length - 1));
  const fsaBasePrice = Number(item?.priceOptions?.[fallbackIndex] || item?.price || 0);
  return fsaBasePrice / 0.88;
}

/*
function isLeftPiece(item) {
  const text = `${item.configuration} ${item.description}`.toUpperCase();
  return text.includes("PL") || text.includes("AFL") || text.includes("CSAL") || text.includes("\u5de6");
}

function isCenterPiece(item) {
  const text = `${item.configuration} ${item.description}`.toUpperCase();
  return text.includes("CB") || text.includes("无扶手") || text.includes("CENTER");
}

function isRightPiece(item) {
  const text = `${item.configuration} ${item.description}`.toUpperCase();
  return text.includes("PR") || text.includes("AFR") || text.includes("CSAR") || text.includes("右");
}

*/
function editSofa(id) {
  const sofa = sofas.find((item) => item.id === id);
  if (!sofa) return;

  editingId = sofa.id;
  selectedPhoto = sofa.photo || "";
  nameInput.value = sofa.name;
  priceInput.value = sofa.price;
  detailsInput.value = sofa.details || "";
  showPhotoPreview(selectedPhoto);
  nameInput.focus();
}

function deleteSofa(id) {
  if (!confirm("确定要删除这个沙发吗?")) return;
  sofas = sofas.filter((sofa) => sofa.id !== id);
  saveSofas();
  render();
}

function resetForm() {
  editingId = null;
  selectedPhoto = "";
  form.reset();
  photoPreview.innerHTML = '<span class="photo-placeholder">+</span>';
}

function showPhotoPreview(src) {
  if (!src) {
    photoPreview.innerHTML = '<span class="photo-placeholder">+</span>';
    return;
  }

  const image = document.createElement("img");
  image.src = src;
  image.alt = "已选沙发图片";
  photoPreview.innerHTML = "";
  photoPreview.append(image);
}

function loadSofas() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch {
    return [];
  }
}

function saveSofas() {
  localStorage.setItem(storageKey, JSON.stringify(sofas));
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function placeholderImage() {
  return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'%3E%3Crect width='800' height='500' fill='%23e7ded3'/%3E%3Cpath d='M162 279c0-40 29-72 65-72h346c36 0 65 32 65 72v68H162v-68Z' fill='%23146c68'/%3E%3Cpath d='M208 190c0-29 23-52 52-52h280c29 0 52 23 52 52v76H208v-76Z' fill='%23c5482f'/%3E%3Ccircle cx='248' cy='374' r='22' fill='%23202124'/%3E%3Ccircle cx='552' cy='374' r='22' fill='%23202124'/%3E%3C/svg%3E";
}

function applyImageFallback(image) {
  const fallback = getImageFallback(image);
  const current = image.getAttribute("src") || "";
  if (fallback && fallback !== current && image.dataset.fallbackSrc !== fallback) {
    image.dataset.fallbackSrc = fallback;
    image.src = fallback;
    const openButton = image.closest(".photo-open-button");
    if (openButton) openButton.dataset.fullPhoto = fallback;
    return;
  }
  if (!current.startsWith("data:image/svg+xml")) {
    image.src = placeholderImage();
  }
}

function repairBrokenImages() {
  [...document.images].forEach((image) => {
    if (image.complete && image.naturalWidth === 0) applyImageFallback(image);
  });
}

function getImageFallback(image) {
  const series = inferSeriesFromImage(image);
  if (!series) return placeholderImage();
  const overrides = window.BAIDU_PHOTO_OVERRIDES || {};
  const candidates = [
    series,
    series.replace(/^ZL(\d+)/, "ZL $1"),
    series === "ZL2868" ? "ZL 2868 LAOREST" : "",
    series === "ZL2707" ? "ZL 2707 KANDER" : "",
    series === "ZL2807" ? "ZL 2807" : ""
  ].filter(Boolean);
  for (const candidate of candidates) {
    if (overrides[candidate]) return overrides[candidate];
  }
  return placeholderImage();
}

function inferSeriesFromImage(image) {
  const quickJump = image.closest("[data-quick-jump]")?.dataset.quickJump || "";
  if (quickJump.includes("|")) return quickJump.split("|").pop();
  const altSeries = String(image.alt || "").match(/(?:NK|LE|ZL)[\w\s-]+/i)?.[0];
  if (altSeries) return altSeries.split("-")[0].trim();
  const src = image.getAttribute("src") || "";
  const galleryMatch = src.match(/assets\/gallery\/([^/]+)\//i);
  if (galleryMatch) return galleryMatch[1];
  const sofaMatch = src.match(/assets\/sofas\/(?:NK|LE)_([^_]+)_/i);
  if (sofaMatch) return sofaMatch[1];
  const filename = src.split("/").pop()?.split(".")[0] || "";
  return filename.replace(/^(NK|LE)_/, "").replace(/_row.*$/, "");
}

function resolveItemPhoto(item) {
  if (!item) return placeholderImage();
  const overrides = window.BAIDU_PHOTO_OVERRIDES || {};
  if (isPhotoBlockedSeries(item.series)) return placeholderImage();
  const lockedPhoto = getLockedSeriesPhoto(item.series, "");
  if (lockedPhoto) return lockedPhoto;
  if (isCombinationItem(item)) {
    return overrides[item.series] || item.photo || item.originalPhoto || getDiningFamilyPhoto(item) || getCombinationPhoto(item) || placeholderImage();
  }
  return overrides[item.series] || item.originalPhoto || item.photo || getDiningFamilyPhoto(item) || placeholderImage();
}

function getDiningFamilyPhoto(item) {
  if (!item || activeCatalogKey !== "diningTable") return "";
  const root = getDiningFamilyRoot(item);
  if (!root) return "";
  const familyItems = matchingCatalogData.filter((candidate) =>
    getDiningFamilyRoot(candidate) === root && candidate.photo
  );
  const tablePhoto = familyItems.find((candidate) => isBuyableDiningTableItem(candidate))?.photo;
  return tablePhoto || familyItems[0]?.photo || "";
}

function isCombinationItem(item) {
  return Array.isArray(item?.partCodes) || String(item?.id || "").startsWith("AUTO-");
}

function getCombinationPhoto(combo) {
  if (isPhotoBlockedSeries(combo.series)) return placeholderImage();
  const lockedPhoto = getLockedSeriesPhoto(combo.series, "");
  if (lockedPhoto) return lockedPhoto;
  if (combo.photo) return combo.photo;
  const gallery = window.BAIDU_PHOTO_GALLERY || {};
  const photos = gallery[combo.series] || [];
  if (!photos.length) return "";
  const key = getComboPartCodes(combo).join("+") || combo.configuration || combo.name || combo.id || "";
  const hash = [...String(key)].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return photos[hash % photos.length];
}

function getLockedSeriesPhoto(series, fallback = "") {
  const lockedPhotos = {
  };
  return lockedPhotos[series] || fallback;
}

function isPhotoBlockedSeries(series) {
  return false;
}

function getRetailPrice(basePrice, materialFactor = 1, priceFactor = 1) {
  const retailPrice = Number(basePrice || 0) * materialFactor * priceFactor * sellingPriceMultiplier;
  return Math.round(retailPrice / 100) * 100;
}

