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
const patchSeenVersionStorageKey = "hp-sofa-patch-seen-version-code";
const viewerReturnStateStorageKey = "hp-sofa-viewer-return-state";
const photoViewerPath = "photo-viewer-v2.html";
const showroomNikatorQuickOrder = [
  "NK0003SF",
  "NK0042SF",
  "NK0024SF",
  "NK0001SF",
  "NK0011SF",
  "LE8817SF",
  "LE8803SF",
  "LE8807SF",
  "LE8815SF",
  "LE8821SF"
];
const missingNikatorQuickPhotoSeries = new Set([
  "LE8820SF"
]);
const showroomZolanoQuickOrder = [
  "ZL 2868 LAOREST",
  "ZL 2707 KANDER",
  "ZL 2807",
  "ZL 2802 TARZ",
  "ZL 3753 (4.2)",
  "MONTIERI ZL 2628",
  "ZL 2672 VICE",
  "ZL 2897",
  "ZL 2831",
  "ZL 3778",
  "ZL 3817 MELFE",
  "ZL 3792",
  "ZL 3776",
  "ZL 3727 FERRANTI",
  "ZL 2911",
  "ZL 3803 SASSA",
  "ZL 3751",
  "ZL 3737",
  "ZL 3719",
  "ZL 3819 ANCONA",
  "ZL 3818 BURANO",
  "ZL 3821 ROVIGO",
  "FG 3129 BISENZIO",
  "ZL 3805 POTENZA",
  "ZL 3838 DURAZZI",
  "ZL 3856 MALKAM",
  "ZL 3863 MARVELLO",
  "ZL-523",
  "ZL-556",
  "ZL-719",
  "ZL-632",
  "ZL-571",
  "ZL-583",
  "ZL-606",
  "ZL-725",
  "ZL-751",
  "ZL-771",
  "ZL-781",
  "ZL-803",
  "ZL-798",
  "ZL-609",
  "ZL-639"
];
const zolanoQuickLabelOverrides = new Map([
  ["MONTIERI ZL 2628", "26282"],
  ["ZL 3792", "3792"],
  ["ZL 3819 ANCONA", "3819"],
  ["ZL 3818 BURANO", "3818"],
  ["ZL 3821 ROVIGO", "3821"],
  ["FG 3129 BISENZIO", "3129"],
  ["ZL 3805 POTENZA", "3805"],
  ["ZL 3838 DURAZZI", "3838"],
  ["ZL 3856 MALKAM", "3856"],
  ["ZL 3863 MARVELLO", "3863"],
  ["ZL-523", "523"],
  ["ZL-556", "556"],
  ["ZL-719", "719"],
  ["ZL-632", "632"],
  ["ZL-571", "571"],
  ["ZL-583", "583"],
  ["ZL-606", "606"],
  ["ZL-725", "725"],
  ["ZL-751", "751"],
  ["ZL-771", "771"],
  ["ZL-781", "781"],
  ["ZL-803", "803"],
  ["ZL-798", "798"],
  ["ZL-609", "609"],
  ["ZL-639", "639"]
]);
const zolanoQuickPhotoOverrides = new Map([
  ["ZL 3778", "assets/zolano/zl-3778.jpg"],
  ["ZL 3727 FERRANTI", "assets/generated/zolano/ZL3727FERRANTI.jpg"],
  ["ZL 3821 ROVIGO", "assets/generated/zolano/ZL3821ROVIGO.jpg"],
  ["FG 3129 BISENZIO", "assets/generated/zolano/FG3129BISENZIO.jpg"],
  ["ZL 3805 POTENZA", "assets/generated/zolano/ZL3805POTENZA.jpg"],
  ["ZL 3838 DURAZZI", "assets/generated/zolano/ZL3838DURAZZI.jpg"],
  ["ZL 3856 MALKAM", "assets/generated/zolano/ZL3856MALKAM.jpg"],
  ["ZL 3863 MARVELLO", "assets/generated/zolano/ZL3863MARVELLO.jpg"],
  ["ZL-523", "assets/generated/zolano-3digit/ZL523.jpg"],
  ["ZL-556", "assets/generated/zolano-3digit/ZL556.jpg"],
  ["ZL-571", "assets/generated/zolano-3digit/ZL571.jpg"]
]);
const zolanoVisibleSeriesLimit = new Set([
  "ZL 2868 LAOREST",
  "ZL 2707 KANDER",
  "ZL 2807",
  "ZL 2802 TARZ",
  "ZL 3753 (4.2)",
  "MONTIERI ZL 2628",
  "ZL 2672 VICE",
  "ZL 2897",
  "ZL 2831",
  "ZL 3778",
  "ZL 3817 MELFE",
  "ZL 3792",
  "ZL 3776",
  "ZL 3727 FERRANTI",
  "ZL 2911",
  "ZL 3803 SASSA",
  "ZL 3751",
  "ZL 3737",
  "ZL 3719",
  "ZL 3819 ANCONA",
  "ZL 3818 BURANO",
  "ZL 3821 ROVIGO",
  "FG 3129 BISENZIO",
  "ZL 3805 POTENZA",
  "ZL 3838 DURAZZI",
  "ZL 3856 MALKAM",
  "ZL 3863 MARVELLO",
  "ZL-523",
  "ZL-556",
  "ZL-719",
  "ZL-632",
  "ZL-571",
  "ZL-583",
  "ZL-606",
  "ZL-725",
  "ZL-751",
  "ZL-771",
  "ZL-781",
  "ZL-803",
  "ZL-798",
  "ZL-609",
  "ZL-639"
]);

const zolanoPendingPhotoSeries = new Set([
  "ZL 3792",
  "FG 3129 BISENZIO",
  "ZL 3805 POTENZA",
  "ZL 3838 DURAZZI",
  "ZL 3856 MALKAM",
  "ZL 3863 MARVELLO"
]);
function isVisibleZolanoSeries(item) {
  const series = String(item?.series || "");
  return zolanoVisibleSeriesLimit.has(series) && !zolanoPendingPhotoSeries.has(series);
}
const zolanoThreeDigitCatalog = [
  {
    id: "ZOLANO-DETECTED-FG3129",
    brand: "Zolano",
    series: "FG 3129 BISENZIO",
    model: "FG 3129 BISENZIO",
    name: "FG 3129 BISENZIO",
    configuration: "Detected model",
    description: "Detected from showroom collage",
    details: "Zolano detected model",
    dimensions: "",
    price: 0,
    priceOptions: [0],
    materials: ["Zolano"],
    photo: "assets/generated/zolano/FG3129BISENZIO.jpg",
    source: "showroom-collage"
  },
  {
    id: "ZOLANO-DETECTED-ZL3805",
    brand: "Zolano",
    series: "ZL 3805 POTENZA",
    model: "ZL 3805 POTENZA",
    name: "ZL 3805 POTENZA",
    configuration: "Detected model",
    description: "Detected from showroom collage",
    details: "Zolano detected model",
    dimensions: "",
    price: 0,
    priceOptions: [0],
    materials: ["Zolano"],
    photo: "assets/generated/zolano/ZL3805POTENZA.jpg",
    source: "showroom-collage"
  },
  {
    id: "ZOLANO-DETECTED-ZL3838",
    brand: "Zolano",
    series: "ZL 3838 DURAZZI",
    model: "ZL 3838 DURAZZI",
    name: "ZL 3838 DURAZZI",
    configuration: "Detected model",
    description: "Detected from showroom collage",
    details: "Zolano detected model",
    dimensions: "",
    price: 0,
    priceOptions: [0],
    materials: ["Zolano"],
    photo: "assets/generated/zolano/ZL3838DURAZZI.jpg",
    source: "showroom-collage"
  },
  {
    id: "ZOLANO-DETECTED-ZL3856",
    brand: "Zolano",
    series: "ZL 3856 MALKAM",
    model: "ZL 3856 MALKAM",
    name: "ZL 3856 MALKAM",
    configuration: "Detected model",
    description: "Detected from showroom collage",
    details: "Zolano detected model",
    dimensions: "",
    price: 0,
    priceOptions: [0],
    materials: ["Zolano"],
    photo: "assets/generated/zolano/ZL3856MALKAM.jpg",
    source: "showroom-collage"
  },
  {
    id: "ZOLANO-DETECTED-ZL3863",
    brand: "Zolano",
    series: "ZL 3863 MARVELLO",
    model: "ZL 3863 MARVELLO",
    name: "ZL 3863 MARVELLO",
    configuration: "Detected model",
    description: "Detected from showroom collage",
    details: "Zolano detected model",
    dimensions: "",
    price: 0,
    priceOptions: [0],
    materials: ["Zolano"],
    photo: "assets/generated/zolano/ZL3863MARVELLO.jpg",
    source: "showroom-collage"
  },
  {
    id: "ZOLANO-ARMCHAIR-ZL523",
    brand: "Zolano",
    series: "ZL-523",
    model: "ZL-523",
    name: "ZL-523",
    configuration: "Arm Chair",
    description: "Arm Chair",
    details: "Zolano arm chair",
    dimensions: "",
    price: 7630,
    priceOptions: [7630, 10962, 12457],
    priceIsFinal: true,
    materials: ["M/F", "F/SA", "N.b/N.p"],
    photo: "assets/generated/zolano-3digit/ZL523.jpg",
    source: "EXPORT 2020 (ARC2).xls#EFE 2019 AC"
  },
  {
    id: "ZOLANO-ARMCHAIR-ZL556",
    brand: "Zolano",
    series: "ZL-556",
    model: "ZL-556",
    name: "ZL-556",
    configuration: "Arm Chair",
    description: "Arm Chair",
    details: "Zolano arm chair",
    dimensions: "",
    price: 4779,
    priceOptions: [4779, 7929, 9010],
    priceIsFinal: true,
    materials: ["M/F", "F/SA", "N.b/N.p"],
    photo: "assets/generated/zolano-3digit/ZL556.jpg",
    source: "EXPORT 2020 (ARC2).xls#EFE 2019 AC"
  },
  {
    id: "ZOLANO-CHAIR-ZL719",
    brand: "Zolano",
    series: "ZL-719",
    model: "ZL-719 PEDASO",
    name: "ZL-719 PEDASO",
    configuration: "Arm Chair",
    description: "Single Chairs",
    details: "Zolano arm chair",
    dimensions: "",
    price: 2390,
    priceOptions: [2390],
    materials: ["Zolano"],
    photo: "assets/generated/zolano-3digit/ZL719.jpg",
    source: "https://www.zolano.com/product/pedaso/"
  },
  {
    id: "ZOLANO-CHAIR-ZL632",
    brand: "Zolano",
    series: "ZL-632",
    model: "ZL-632 LUXON",
    name: "ZL-632 LUXON",
    configuration: "Arm Chair",
    description: "Single Chairs",
    details: "Zolano arm chair",
    dimensions: "",
    price: 4218,
    priceOptions: [4218, 6661, 7569],
    priceIsFinal: true,
    materials: ["M/F", "F/SA", "N.b/N.p"],
    photo: "assets/generated/zolano-3digit/ZL632.jpg",
    source: "EXPORT 2020 (ARC2).xls#EFE 2019 AC"
  },
  {
    id: "ZOLANO-CHAIR-ZL571",
    brand: "Zolano",
    series: "ZL-571",
    model: "ZL-571 NUEVA",
    name: "ZL-571 NUEVA",
    configuration: "Arm Chair",
    description: "Motion Italia Recliner",
    details: "Zolano recliner arm chair",
    dimensions: "",
    price: 8390,
    priceOptions: [8390],
    materials: ["Zolano"],
    photo: "assets/generated/zolano-3digit/ZL571.jpg",
    source: "https://www.zolano.com/product/nueva/"
  },
  {
    id: "ZOLANO-ARMCHAIR-ZL583",
    brand: "Zolano",
    series: "ZL-583",
    model: "ZL-583 ORTANA",
    name: "ZL-583 ORTANA",
    configuration: "Arm Chair",
    description: "Motion Italia Recliner",
    details: "Zolano recliner arm chair",
    dimensions: "",
    price: 8390,
    priceOptions: [8390],
    materials: ["Zolano"],
    photo: "assets/generated/zolano-3digit/ZL583.jpg",
    source: "https://www.zolano.com/product/ortana/"
  },
  {
    id: "ZOLANO-ARMCHAIR-ZL606",
    brand: "Zolano",
    series: "ZL-606",
    model: "ZL-606 KARM",
    name: "ZL-606 KARM",
    configuration: "Arm Chair",
    description: "Motion Italia Recliner",
    details: "Zolano recliner arm chair",
    dimensions: "",
    price: 8390,
    priceOptions: [8390],
    materials: ["Zolano"],
    photo: "assets/generated/zolano-3digit/ZL606.jpg",
    source: "https://www.zolano.com/product/karm/"
  },
  {
    id: "ZOLANO-ARMCHAIR-ZL725",
    brand: "Zolano",
    series: "ZL-725",
    model: "ZL-725",
    name: "ZL-725",
    configuration: "Arm Chair",
    description: "Arm Chair",
    details: "Zolano arm chair",
    dimensions: "",
    price: 0,
    priceOptions: [0],
    materials: ["Zolano"],
    photo: "assets/generated/zolano-3digit/ZL725.jpg",
    source: "manual-armchair-list"
  },
  {
    id: "ZOLANO-ARMCHAIR-ZL751",
    brand: "Zolano",
    series: "ZL-751",
    model: "ZL-751",
    name: "ZL-751",
    configuration: "Arm Chair",
    description: "Arm Chair",
    details: "Zolano arm chair",
    dimensions: "",
    price: 0,
    priceOptions: [0],
    materials: ["Zolano"],
    photo: "assets/generated/zolano-3digit/ZL751.jpg",
    source: "manual-armchair-list"
  },
  {
    id: "ZOLANO-ARMCHAIR-ZL771",
    brand: "Zolano",
    series: "ZL-771",
    model: "ZL-771",
    name: "ZL-771",
    configuration: "Arm Chair",
    description: "Arm Chair",
    details: "Zolano arm chair",
    dimensions: "",
    price: 0,
    priceOptions: [0],
    materials: ["Zolano"],
    photo: "assets/generated/zolano-3digit/ZL771.jpg",
    source: "manual-armchair-list"
  },
  {
    id: "ZOLANO-ARMCHAIR-ZL781",
    brand: "Zolano",
    series: "ZL-781",
    model: "ZL-781",
    name: "ZL-781",
    configuration: "Arm Chair",
    description: "Arm Chair",
    details: "Zolano arm chair",
    dimensions: "",
    price: 0,
    priceOptions: [0],
    materials: ["Zolano"],
    photo: "assets/generated/zolano-3digit/ZL781.jpg",
    source: "manual-armchair-list"
  },
  {
    id: "ZOLANO-ARMCHAIR-ZL787",
    brand: "Zolano",
    series: "ZL-787",
    model: "ZL-787",
    name: "ZL-787",
    configuration: "Arm Chair",
    description: "Arm Chair",
    details: "Zolano arm chair",
    dimensions: "",
    price: 5847,
    priceOptions: [5847, 8232, 9355],
    priceIsFinal: true,
    materials: ["M/F", "F/SA", "N.b/N.p"],
    photo: "assets/generated/zolano-3digit/ZL787.jpg",
    source: "EXPORT 2020 (ARC2).xls#EFE 2019 AC"
  },
  {
    id: "ZOLANO-ARMCHAIR-ZL803",
    brand: "Zolano",
    series: "ZL-803",
    model: "ZL-803",
    name: "ZL-803",
    configuration: "Arm Chair",
    description: "Arm Chair",
    details: "Zolano arm chair",
    dimensions: "",
    price: 5847,
    priceOptions: [5847, 8232, 9355],
    priceIsFinal: true,
    materials: ["M/F", "F/SA", "N.b/N.p"],
    photo: "assets/generated/zolano-3digit/ZL803.jpg",
    source: "EXPORT 2020 (ARC2).xls / user-confirmed 803 row"
  },
  {
    id: "ZOLANO-ARMCHAIR-ZL798",
    brand: "Zolano",
    series: "ZL-798",
    model: "ZL-798",
    name: "ZL-798",
    configuration: "Arm Chair",
    description: "Arm Chair",
    details: "Zolano arm chair",
    dimensions: "",
    price: 0,
    priceOptions: [0],
    materials: ["Zolano"],
    photo: "assets/generated/zolano-3digit/ZL798.jpg",
    source: "manual-armchair-list"
  },
  {
    id: "ZOLANO-DINING-CHAIR-ZL609",
    brand: "Zolano",
    series: "ZL-609",
    model: "ZL-609 LEATHER DINING CHAIR",
    name: "ZL-609 LEATHER DINING CHAIR",
    configuration: "Dining Chair",
    description: "Dining Chairs",
    details: "Zolano dining chair",
    dimensions: "",
    price: 990,
    priceOptions: [990],
    materials: ["Zolano"],
    photo: "assets/generated/zolano-3digit/ZL609.jpg",
    source: "https://www.zolano.com/product/zl-609-leather-dining-chair/"
  },
  {
    id: "ZOLANO-DINING-CHAIR-ZL639",
    brand: "Zolano",
    series: "ZL-639",
    model: "ZL-639 LEATHER DINING CHAIR",
    name: "ZL-639 LEATHER DINING CHAIR",
    configuration: "Dining Chair",
    description: "Dining Chairs",
    details: "Zolano dining chair",
    dimensions: "",
    price: 1090,
    priceOptions: [1090],
    materials: ["Zolano"],
    photo: "assets/generated/zolano-3digit/ZL639.jpg",
    source: "https://www.zolano.com/product/zl-639-leather-dining-chair/"
  }
];

maybeClearAppCache();
ensureLegacyShellControls();

function ensureLegacyShellControls() {
  if (!document.querySelector("#zolanoModulePicker")) {
    const slotGridElement = document.querySelector("#slotGrid");
    if (slotGridElement?.parentElement) {
      const picker = document.createElement("div");
      picker.id = "zolanoModulePicker";
      picker.className = "module-picker";
      picker.hidden = true;
      slotGridElement.parentElement.insertBefore(picker, slotGridElement);
    }
  }
}

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
const builderClearAllButton = document.querySelector("#builderClearAllButton");
const zolanoModulePicker = document.querySelector("#zolanoModulePicker");
const slotGrid = document.querySelector("#slotGrid");
const setPreview = document.querySelector("#setPreview");
const setTotal = document.querySelector("#setTotal");

const zolano2897Modules = [
  {
    id: "ZL28971ELEXPORT2020ZL28002700497",
    label: "1EL/1ER",
    meta: "1130mm - 36kg",
    photo: "assets/generated/zolano/parts/ZL2897-1EL-top.png"
  },
  {
    id: "ZL28971NAEXPORT2020ZL28002700499",
    label: "1NA",
    meta: "860mm - 25kg",
    photo: "assets/generated/zolano/parts/ZL2897-1NA-top.png"
  },
  {
    id: "ZL2897CORNEREXPORT2020ZL28002700498",
    label: "CNR",
    meta: "1220 x 1220mm - 47kg",
    photo: "assets/generated/zolano/parts/ZL2897-CNR-top.png"
  },
  {
    id: "ZL2897PILLOWEXPORT2020ZL28002700502",
    label: "PILLOW",
    meta: "ÃƒÂ¦Ã…Â Ã‚Â±ÃƒÂ¦Ã…Â¾Ã¢â‚¬Â¢",
    photo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 64'%3E%3Crect x='18' y='14' width='60' height='36' rx='10' fill='%23fff' stroke='%23111' stroke-width='4'/%3E%3Cpath d='M24 22c8 6 8 20 0 24M72 22c-8 6-8 20 0 24' fill='none' stroke='%23111' stroke-width='3'/%3E%3C/svg%3E"
  }
];
const zolano3776Modules = [
  {
    id: "ZL3776-ARM",
    label: "ARM",
    meta: "ÃƒÂ¦Ã¢â‚¬Â°Ã‚Â¶ÃƒÂ¦Ã¢â‚¬Â°Ã¢â‚¬Â¹",
    photo: "assets/generated/zolano/parts/ZL3776-line-ARM.png"
  },
  {
    id: "ZL3776-1NALONGDEPANTAMBAH6INCH",
    label: "1NA/LONG",
    meta: "+6 inch",
    photo: "assets/generated/zolano/parts/ZL3776-line-1NA-LONG.png"
  },
  {
    id: "ZL3776-1NA",
    label: "1NA",
    meta: "940mm - 38kg",
    photo: "assets/generated/zolano/parts/ZL3776-line-1NA.png"
  },
  {
    id: "ZL3776-CORNER",
    label: "CORNER",
    meta: "1100 x 1100mm",
    photo: "assets/generated/zolano/parts/ZL3776-line-CORNER.png"
  },
  {
    id: "ZL3776-1NAT",
    label: "1NA/T",
    meta: "1420mm - 43kg",
    photo: "assets/generated/zolano/parts/ZL3776-line-1NAT.png"
  },
  {
    id: "ZL3776-TABLE",
    label: "TABLE",
    meta: "ÃƒÂ¨Ã…â€™Ã‚Â¶ÃƒÂ¥Ã¢â‚¬Â¡Ã‚Â ",
    photo: "assets/generated/zolano/parts/ZL3776-line-TABLE.png"
  }
];
const zolano2628Modules = [
  {
    id: "MONTIERIZL26282ELEXPORT2020ZL26002661124",
    label: "2EL",
    meta: "1520mm",
    photo: "assets/generated/zolano/parts/MONTIERIZL2628-2EL-top.png"
  },
  {
    id: "MONTIERIZL2628CORNEREXPORT2020ZL26002661125",
    label: "CORNER",
    meta: "1320 x 1320mm",
    photo: "assets/generated/zolano/parts/MONTIERIZL2628-CORNER-top.png"
  },
  {
    id: "MONTIERIZL26282NAEXPORT2020ZL26002661126",
    label: "2NA",
    meta: "1320mm",
    photo: "assets/generated/zolano/parts/MONTIERIZL2628-2NA-top.png"
  },
  {
    id: "MONTIERIZL26281ERTEXPORT2020ZL26002661127",
    label: "1ER/T",
    meta: "910mm",
    photo: "assets/generated/zolano/parts/MONTIERIZL2628-1ERT-top.png"
  },
  {
    id: "MONTIERIZL26281NAEXPORT2020ZL26002661128",
    label: "1NA",
    meta: "620mm",
    photo: "assets/generated/zolano/parts/MONTIERIZL2628-1NA-top.png"
  }
];
const zolano3818Modules = [
  {
    id: "ZL3818BURANO2ELEXPORT2020ZL33002SHEET1550",
    label: "2EL",
    meta: "BURANO",
    photo: "assets/generated/zolano/ZL3818BURANO.jpg"
  },
  {
    id: "ZL3818BURANO2NAEXPORT2020ZL33002SHEET1551",
    label: "2NA",
    meta: "BURANO",
    photo: "assets/generated/zolano/ZL3818BURANO.jpg"
  },
  {
    id: "ZL3818BURANOSTOOLEXPORT2020ZL33002SHEET1548",
    label: "STOOL",
    meta: "BURANO",
    photo: "assets/generated/zolano/ZL3818BURANO.jpg"
  }
];
const zolanoModulePhotoMap = Object.fromEntries([...zolano2897Modules, ...zolano3776Modules, ...zolano2628Modules, ...zolano3818Modules].map((module) => [module.id, module.photo]));
const nikatorModuleSeriesSeedSet = new Set(["LE8801SF", "LE8810SF", "LE8806SF", "NK0051SF", "NK0054SF", "NK0001SF", "NK0003SF", "LE8803SF"]);

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
  return /ÃƒÂ©Ã‚Â¤Ã‚ÂÃƒÂ¦Ã‚Â¡Ã…â€™|ÃƒÂ©Ã‚Â¤Ã‚ÂÃƒÂ¥Ã‚ÂÃ‚Â°/.test(text) || /\bDT\b/i.test(`${item?.series || ""} ${item?.model || ""}`);
}

function isDiningChairItem(item) {
  const text = getCatalogText(item);
  return /ÃƒÂ©Ã‚Â¤Ã‚ÂÃƒÂ¦Ã‚Â¤Ã¢â‚¬Â¦/.test(text) || /\bCH\b/i.test(`${item?.series || ""} ${item?.model || ""}`);
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
  return /ÃƒÂ¨Ã‚Â½Ã‚Â¬ÃƒÂ§Ã¢â‚¬ÂºÃ‹Å“/.test(text) || /^[ÃƒÂÃ¢â‚¬Â ÃƒÅ½Ã‚Â¦ÃƒÂÃ¢â‚¬Â¢ÃƒÂÃ‚Â¤]\d{3,4}$/i.test(dimensions.trim());
}

function isBuyableDiningTableItem(item) {
  const text = getCatalogText(item);
  return /ÃƒÂ©Ã‚Â¤Ã‚ÂÃƒÂ¦Ã‚Â¡Ã…â€™|ÃƒÂ©Ã‚Â¤Ã‚ÂÃƒÂ¥Ã‚ÂÃ‚Â°/.test(text) && !isDiningTurntableItem(item);
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
  const diameter = text.match(/[ÃƒÂÃ¢â‚¬Â ÃƒÅ½Ã‚Â¦ÃƒÂÃ¢â‚¬Â¢ÃƒÂÃ‚Â¤](\d{3,5})/);
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

  const small = turntables.filter((candidate) => /ÃƒÂ¥Ã‚Â°Ã‚ÂÃƒÂ¨Ã‚Â½Ã‚Â¬ÃƒÂ§Ã¢â‚¬ÂºÃ‹Å“/.test(getCatalogText(candidate)));
  const large = turntables.filter((candidate) => /ÃƒÂ¥Ã‚Â¤Ã‚Â§ÃƒÂ¨Ã‚Â½Ã‚Â¬ÃƒÂ§Ã¢â‚¬ÂºÃ‹Å“/.test(getCatalogText(candidate)));
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
  return `ÃƒÂ©Ã¢â‚¬Â¦Ã‚ÂÃƒÂ¥Ã‚Â¥Ã¢â‚¬â€ÃƒÂ¨Ã‚Â½Ã‚Â¬ÃƒÂ§Ã¢â‚¬ÂºÃ‹Å“:${turntables.map((turntable) => {
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
    .replace(/-[ÃƒÂÃ¢â‚¬Â ÃƒÅ½Ã‚Â¦]\d+$/i, "");
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
    catalog: getCorrectedZolanoCatalog([
      ...(Array.isArray(window.BAIDU_ZOLANO_SOFA_DATA) ? window.BAIDU_ZOLANO_SOFA_DATA : []),
      ...zolanoThreeDigitCatalog
    ]).filter(isVisibleZolanoSeries),
    recommendations: Array.isArray(window.BAIDU_ZOLANO_RECOMMENDED_COMBOS)
      ? window.BAIDU_ZOLANO_RECOMMENDED_COMBOS.filter(isVisibleZolanoSeries)
      : []
  },
  chair: {
    label: "ÃƒÂ¤Ã‚Â¼Ã¢â‚¬ËœÃƒÂ©Ã¢â‚¬â€Ã‚Â²ÃƒÂ¦Ã‚Â¤Ã¢â‚¬Â¦ Chair",
    catalog: [
      ...(Array.isArray(window.BAIDU_CHAIR_DATA) ? window.BAIDU_CHAIR_DATA : []),
      ...zolanoThreeDigitCatalog.filter((item) =>
        String(item.id || "").startsWith("ZOLANO-ARMCHAIR-")
        || String(item.id || "").startsWith("ZOLANO-CHAIR-")
      )
    ],
    recommendations: []
  },
  bed: {
    label: "ÃƒÂ¥Ã‚ÂºÃ…Â  Bed",
    catalog: Array.isArray(window.BAIDU_BED_DATA) ? window.BAIDU_BED_DATA : [],
    recommendations: []
  },
  diningTable: {
    label: "ÃƒÂ©Ã‚Â¤Ã‚ÂÃƒÂ¦Ã‚Â¡Ã…â€™ Dining Table",
    catalog: uniqueDiningTables(matchingCatalogData.filter(isDiningTableItem)),
    recommendations: []
  },
  diningChair: {
    label: "ÃƒÂ©Ã‚Â¤Ã‚ÂÃƒÂ¦Ã‚Â¤Ã¢â‚¬Â¦ Dining Chair",
    catalog: [
      ...matchingCatalogData.filter(isDiningChairItem),
      ...zolanoThreeDigitCatalog.filter((item) => String(item.id || "").startsWith("ZOLANO-DINING-CHAIR-"))
    ],
    recommendations: []
  },
  matching: {
    label: "ÃƒÂ©Ã¢â‚¬Â¦Ã‚ÂÃƒÂ¥Ã‚Â¥Ã¢â‚¬â€ Matching",
    catalog: matchingCatalogData.filter((item) => !isDiningItem(item)),
    recommendations: []
  }
};

function getCorrectedZolanoCatalog(rows) {
  const hidden3817Configs = new Set(["1NA/LONG", "CORNER"]);
  const hidden2911Ids = new Set([
    "ZL291110EXPORT2020ZL28002700561",
    "ZL291120EXPORT2020ZL28002700560",
    "ZL291130EXPORT2020ZL28002700559"
  ]);
  const row3817OneEl = rows.find((item) => item.series === "ZL 3817 MELFE" && String(item.configuration || "").toUpperCase() === "1EL");
  const row3817TwoEr = rows.find((item) => item.series === "ZL 3817 MELFE" && String(item.configuration || "").toUpperCase() === "1NA");
  const sumPriceOptions = (leftOptions, rightOptions) => {
    const maxLength = Math.max(leftOptions.length, rightOptions.length);
    return Array.from({ length: maxLength }, (_, index) => Number(leftOptions[index] || 0) + Number(rightOptions[index] || 0));
  };
  const fullSet3817PriceOptions = row3817OneEl && row3817TwoEr
    ? sumPriceOptions(
      Array.isArray(row3817OneEl.priceOptions) ? row3817OneEl.priceOptions : [row3817OneEl.price || 0],
      Array.isArray(row3817TwoEr.priceOptions) ? row3817TwoEr.priceOptions : [row3817TwoEr.price || 0]
    )
    : [];
  return rows
    .filter((item) => !hidden2911Ids.has(String(item.id || "")))
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
          description: "ÃƒÂ¥Ã¢â‚¬ÂºÃ‚Â¾ÃƒÂ§Ã¢â‚¬Â°Ã¢â‚¬Â¡ÃƒÂ¦Ã¢â‚¬Â¢Ã‚Â´ÃƒÂ¥Ã‚Â¥Ã¢â‚¬â€ MELFE",
          dimensions: "3440 x 1630 x 900 mm",
          width: 3440,
          depth: 1630,
          height: 900,
          price: fullSet3817PriceOptions[0] || item.price,
          priceOptions: fullSet3817PriceOptions.length ? fullSet3817PriceOptions : item.priceOptions,
          partCodes: [
            "ZL3817MELFE1ELEXPORT2020ZL33002SHEET1544",
            "ZL3817MELFE1NAEXPORT2020ZL33002SHEET1545"
          ]
        },
        PILLOW: {
          description: "Pillow / ÃƒÂ¦Ã…Â Ã‚Â±ÃƒÂ¦Ã…Â¾Ã¢â‚¬Â¢",
          dimensions: "ÃƒÂ¦Ã…Â Ã‚Â±ÃƒÂ¦Ã…Â¾Ã¢â‚¬Â¢"
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
  || ((layout) => `LÃƒÂ¥Ã‚Â½Ã‚Â¢ÃƒÂ§Ã‚Â»Ã¢â‚¬Å¾ÃƒÂ¥Ã‚ÂÃ‹â€ :ÃƒÂ¥Ã‚Â·Ã‚Â¦ÃƒÂ¨Ã‚Â¾Ã‚Â¹ ${layout.left}mm / ÃƒÂ¥Ã‚ÂÃ‚Â³ÃƒÂ¨Ã‚Â¾Ã‚Â¹ ${layout.right}mm | ÃƒÂ¦Ã‚Â·Ã‚Â± ${layout.depth}mm | ÃƒÂ©Ã‚Â«Ã‹Å“ ${layout.height}mm`);
let selectedWidthFilter = 0;
const selectedTypeFilters = new Set();
let pieceMaterialSelections = {};
let selectedDiningTurntableId = "";
let quickJumpSearchQuery = "";
let suppressAutoSelectOnNextPopulate = false;
let suppressRetainedSelectionsOnNextPopulate = false;
let selectedRecommendationCounts = {};
let isSyncingRecommendationCounts = false;

function clearSelectedRecommendationCounts() {
  selectedRecommendationCounts = {};
}

function getRecommendationCount(comboId) {
  return Number(selectedRecommendationCounts[String(comboId)] || 0);
}

function getSelectedRecommendationPurchases() {
  return Object.entries(selectedRecommendationCounts)
    .flatMap(([comboId, count]) => Array.from({ length: Number(count || 0) }, () => comboId))
    .map((comboId) => getSeriesRecommendations().find((combo) => combo.id === comboId))
    .filter(Boolean);
}

function getStructuredRecommendationPurchases() {
  return getSelectedRecommendationPurchases().map((combo) => ({
    combo: resolvePricedZolanoRecommendation(combo),
    items: getRecommendationItems(combo)
  }));
}

const money = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "CNY",
  maximumFractionDigits: 0
});

const cp1252ReverseMap = new Map([
  [0x20ac, 0x80], [0x201a, 0x82], [0x0192, 0x83], [0x201e, 0x84],
  [0x2026, 0x85], [0x2020, 0x86], [0x2021, 0x87], [0x02c6, 0x88],
  [0x2030, 0x89], [0x0160, 0x8a], [0x2039, 0x8b], [0x0152, 0x8c],
  [0x017d, 0x8e], [0x2018, 0x91], [0x2019, 0x92], [0x201c, 0x93],
  [0x201d, 0x94], [0x2022, 0x95], [0x2013, 0x96], [0x2014, 0x97],
  [0x02dc, 0x98], [0x2122, 0x99], [0x0161, 0x9a], [0x203a, 0x9b],
  [0x0153, 0x9c], [0x017e, 0x9e], [0x0178, 0x9f]
]);
const mojibakePattern = /[\u00c0-\u00ff\u0192\u0152\u0153\u0160\u0161\u0178\u2018-\u201d\u2026\u2039\u203a]/;
let mojibakeRepairScheduled = false;
let mojibakeRepairObserver = null;

function repairMojibakeText(value) {
  let text = String(value || "");
  if (!text || !mojibakePattern.test(text) || typeof TextDecoder === "undefined") return text;
  const decoder = new TextDecoder("utf-8", { fatal: false });
  for (let pass = 0; pass < 5; pass += 1) {
    if (!mojibakePattern.test(text)) break;
    const bytes = getCp1252Bytes(text);
    if (!bytes) break;
    const next = decoder.decode(bytes);
    if (!next || next === text || /\uFFFD/.test(next)) break;
    text = next;
  }
  return text;
}

function getCp1252Bytes(value) {
  const bytes = [];
  for (const char of String(value || "")) {
    const code = char.codePointAt(0);
    if (code <= 0xff) {
      bytes.push(code);
    } else if (cp1252ReverseMap.has(code)) {
      bytes.push(cp1252ReverseMap.get(code));
    } else {
      return null;
    }
  }
  return new Uint8Array(bytes);
}

function repairMojibakeInDom(root = document.body) {
  if (!root) return;
  const skipTags = new Set(["SCRIPT", "STYLE", "TEXTAREA"]);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      return skipTags.has(node.parentElement?.tagName) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    }
  });
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  textNodes.forEach((node) => {
    const fixed = repairMojibakeText(node.nodeValue);
    if (fixed !== node.nodeValue) node.nodeValue = fixed;
  });
  root.querySelectorAll?.("[title],[aria-label],[alt],[placeholder]").forEach((element) => {
    ["title", "aria-label", "alt", "placeholder"].forEach((name) => {
      const value = element.getAttribute(name);
      const fixed = repairMojibakeText(value);
      if (value && fixed !== value) element.setAttribute(name, fixed);
    });
  });
  if (document.title) document.title = repairMojibakeText(document.title);
}

function requestRepairVisibleText() {
  if (mojibakeRepairScheduled) return;
  mojibakeRepairScheduled = true;
  const run = () => {
    mojibakeRepairScheduled = false;
    repairMojibakeInDom(document.body);
  };
  (window.requestAnimationFrame || window.setTimeout)(run, 0);
}

function setupMojibakeTextRepair() {
  if (mojibakeRepairObserver || typeof MutationObserver === "undefined") return;
  mojibakeRepairObserver = new MutationObserver(() => requestRepairVisibleText());
  mojibakeRepairObserver.observe(document.body, {
    childList: true,
    characterData: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["title", "aria-label", "alt", "placeholder"]
  });
}

syncQuickJumpLabels(document);
renderVersionBadge();
syncActiveCatalog();
render();
initBuilder();
restorePhotoViewerReturnState();
if (typeof syncQuickJumpVisibility === "function") syncQuickJumpVisibility();
rebuildQuickJumpGroup("nikator");
syncQuickJumpImages(document);
setupMojibakeTextRepair();
requestRepairVisibleText();

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
      clearSelectedRecommendationCounts();
      pieceMaterialSelections = {};
      selectedDiningTurntableId = "";
      populateBuilderPieces();
      syncBuilderControlsVisibility();
      if (!fillDefaultSingleCatalogSlot()) {
        renderSetPreview();
      }
      return;
    }

    if (select === recommendSelect) {
      const combo = getSelectedRecommendation();
      recommendSelect.value = combo ? combo.id : "";
      if (!isSyncingRecommendationCounts) {
        clearSelectedRecommendationCounts();
        if (combo) selectedRecommendationCounts[combo.id] = 1;
      }
      pieceMaterialSelections = {};
      const zolanoDirectPartCount = combo && activeCatalogKey === "zolano" && !isGeneratedZolanoCombo(combo)
        ? getComboPartCodes(combo).length
        : 0;
      const slotCount = combo
        ? Math.min(10, Math.max(zolanoDirectPartCount ? zolanoDirectPartCount + 1 : 0, combo.partCodes.length + 1))
        : undefined;
      if (!applyRecommendationPurchases()) {
        populateBuilderPieces(slotCount);
        if (combo) applyRecommendedCombo();
      }
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
    setQuickJumpSearch(builderSearchInput.value);
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
  syncQuickJumpActiveState(root);
}

function syncQuickJumpActiveState(root = document) {
  const activeSeries = seriesSelect?.value || "";
  root.querySelectorAll("[data-quick-jump]").forEach((button) => {
    const value = button.dataset.quickJump || "";
    const sep = value.indexOf("|");
    const brandKey = sep >= 0 ? value.slice(0, sep) : "";
    const seriesValue = sep >= 0 ? value.slice(sep + 1) : "";
    const isActive = Boolean(activeSeries) && brandKey === activeCatalogKey && seriesValue === activeSeries;
    button.classList.toggle("is-active", isActive);
  });
}

function syncQuickJumpLabels(root) {
  root.querySelectorAll('[data-quick-jump="zolano|MONTIERI ZL 2628"] span').forEach((label) => {
    label.textContent = "26282";
  });
}

function renderVersionBadge() {
  if (document.querySelector(".app-version-badge")) return;
  const anchor = document.querySelector(".catalog-switch") || document.querySelector(".builder-panel");
  if (!anchor) return;

  const savedPatchCode = Number(localStorage.getItem(patchVersionStorageKey) || 0);
  const currentPatchCode = Number(currentAppVersion.patchVersionCode || 0);
  const installedPatchCode = Math.max(savedPatchCode, currentPatchCode);
  const installedPatchName = savedPatchCode > currentPatchCode
    ? (localStorage.getItem(patchNameStorageKey) || "")
    : (currentAppVersion.patchVersionName || "");
  const versionCode = currentAppVersion.versionCode || 0;
  const versionName = currentAppVersion.versionName || "local";
  const patchText = installedPatchCode
    ? `\u8865\u4e01 ${installedPatchCode}${installedPatchName ? ` ${installedPatchName}` : ""}`
    : "\u8865\u4e01 0";

  const badge = document.createElement("div");
  badge.className = "app-version-badge";
  const text = document.createElement("span");
  const displayPatchCode = installedPatchCode || currentPatchCode || savedPatchCode || 0;
  text.textContent = `HP\u7248\u672c ${displayPatchCode || versionCode}`;
  badge.append(text);

  const checkButton = document.createElement("button");
  checkButton.type = "button";
  checkButton.className = "app-check-update-button";
  checkButton.textContent = "\u68c0\u67e5\u66f4\u65b0";
  checkButton.addEventListener("click", async () => {
    checkButton.disabled = true;
    checkButton.textContent = "\u68c0\u67e5\u4e2d";
    try {
      document.querySelector(".update-banner")?.remove();
      document.querySelector(".patch-banner")?.remove();
      await checkForOnlinePatch();
      if (!document.querySelector(".update-banner") && !document.querySelector(".patch-banner")) {
        alert("\u5df2\u68c0\u67e5\uff0c\u6682\u65f6\u6ca1\u6709\u65b0\u66f4\u65b0");
      }
    } catch {
      alert("\u68c0\u67e5\u66f4\u65b0\u5931\u8d25\uff0c\u8bf7\u68c0\u67e5\u7f51\u7edc");
    } finally {
      checkButton.disabled = false;
      checkButton.textContent = "\u68c0\u67e5\u66f4\u65b0";
    }
  });
  badge.append(checkButton);

  const quickSearch = document.createElement("input");
  quickSearch.type = "search";
  quickSearch.className = "app-version-search";
  quickSearch.placeholder = "\u641c\u7d22\u578b\u53f7";
  quickSearch.setAttribute("aria-label", "\u641c\u7d22\u578b\u53f7");
  quickSearch.addEventListener("input", () => {
    setQuickJumpSearch(quickSearch.value);
    [document.querySelector("#builderSearchInput"), document.querySelector("#searchInput")]
      .filter(Boolean)
      .forEach((target) => {
        target.value = quickSearch.value;
        target.dispatchEvent(new Event("input", { bubbles: true }));
      });
  });
  badge.append(quickSearch);

  anchor.after(badge);
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
  if (isManualModuleSeriesName(seriesValue)) {
    recommendSelect.value = "";
    populateBuilderPieces(1);
    syncBuilderControlsVisibility();
    syncZolanoModulePicker();
    renderSetPreview();
    return;
  }
  recommendSelect.value = "";
  clearSelectedRecommendationCounts();
  populateBuilderPieces(1);
  syncBuilderControlsVisibility();
  if (typeof renderSetPreview === "function") renderSetPreview();
}

function syncQuickJumpVisibility() {
  syncCatalogSwitchLayout();
  syncBuilderFilterVisibility();
  ensureDynamicQuickJumpGroup(activeCatalogKey);
  ensurePagedQuickJumpLayout(activeCatalogKey);
  applyQuickJumpSearch();
  syncQuickJumpActiveState(document);
  const groups = document.querySelectorAll("[data-quick-jump-group]");
  groups.forEach((group) => {
    const key = group.dataset.quickJumpGroup;
    group.hidden = key !== activeCatalogKey;
  });
}

function syncCatalogSwitchLayout() {
  const switchPanel = document.querySelector(".catalog-switch");
  if (!switchPanel) return;
  switchPanel.style.setProperty("display", "grid", "important");
  switchPanel.style.setProperty("grid-template-columns", "repeat(3, minmax(0, 1fr))", "important");
  switchPanel.style.setProperty("gap", "5px", "important");
  switchPanel.style.setProperty("margin-bottom", "6px", "important");
  switchPanel.querySelectorAll(".catalog-switch-button").forEach((button) => {
    button.style.setProperty("min-width", "0", "important");
    button.style.setProperty("width", "100%", "important");
    button.style.setProperty("min-height", "31px", "important");
    button.style.setProperty("padding", "0 6px", "important");
    button.style.setProperty("font-size", "0.82rem", "important");
    button.style.setProperty("line-height", "1.05", "important");
    button.style.setProperty("white-space", "normal", "important");
  });
}

function syncLegacyBuilderFilterOverrides() {
  const widthGroup = document.querySelector(".width-filter-group");
  if (widthGroup) {
    forceHideElement(widthGroup);
  }
  widthFilterButtons.forEach((button) => {
    const group = button.closest(".filter-group") || button.parentElement;
    if (group) forceHideElement(group);
    forceHideElement(button);
  });

  typeFilterButtons.forEach((button) => {
    const type = (button.dataset.typeFilter || "").toLowerCase();
    if (type === "showroom" || type === "chaise" || type === "recliner") {
      forceHideElement(button);
    }
  });

  const clearButton = document.querySelector("#builderClearAllButton");
  document.querySelectorAll(".filter-group span").forEach(forceHideElement);
  if (clearButton) {
    clearButton.hidden = false;
    clearButton.removeAttribute("aria-hidden");
    clearButton.style.setProperty("display", "inline-flex", "important");
    clearButton.style.setProperty("min-height", "30px", "important");
    clearButton.style.setProperty("padding", "0 10px", "important");
    clearButton.style.setProperty("font-size", "0.82rem", "important");
  }

  const typeGroup = clearButton?.closest(".filter-group");
  if (typeGroup) {
    typeGroup.style.setProperty("display", "flex", "important");
    typeGroup.style.setProperty("gap", "4px", "important");
    typeGroup.style.setProperty("align-items", "center", "important");
  }

  const filterPanel = document.querySelector(".builder-filter-buttons");
  if (filterPanel) {
    if (comboButtonPanel && filterPanel.previousElementSibling !== comboButtonPanel) {
      comboButtonPanel.after(filterPanel);
    }
    filterPanel.style.setProperty("display", "flex", "important");
    filterPanel.style.setProperty("padding", "0", "important");
    filterPanel.style.setProperty("margin", "6px 0 8px", "important");
    filterPanel.style.setProperty("border", "0", "important");
    filterPanel.style.setProperty("background", "transparent", "important");
    filterPanel.style.setProperty("min-height", "0", "important");
  }
}

function forceHideElement(element) {
  if (!element) return;
  element.hidden = true;
  element.setAttribute("aria-hidden", "true");
  element.style.setProperty("display", "none", "important");
}

function syncBuilderFilterVisibility() {
  const filterPanel = document.querySelector(".builder-filter-buttons");
  const isSofaCatalog = activeCatalogKey === "nikator" || activeCatalogKey === "zolano";
  syncLegacyBuilderFilterOverrides();
  if (filterPanel) filterPanel.hidden = !isSofaCatalog;
  if (comboButtonPanel) comboButtonPanel.hidden = !isSofaCatalog;
}

function syncBuilderControlsVisibility() {
  const controls = document.querySelector(".builder-controls");
  const builderSearch = document.querySelector(".builder-search");
  const isGridOnlyCatalog = activeCatalogKey === "bed";
  const hideTopControls = activeCatalogKey === "nikator"
    || activeCatalogKey === "zolano"
    || activeCatalogKey === "diningTable"
    || isGridOnlyCatalog;
  if (controls) controls.hidden = hideTopControls;
  if (builderSearch) builderSearch.hidden = isGridOnlyCatalog;
  if (slotGrid) slotGrid.hidden = isGridOnlyCatalog;
  if (zolanoModulePicker) zolanoModulePicker.hidden = isGridOnlyCatalog || !isManualModulePickerActive();
  if (setPreview) setPreview.hidden = false;
}

function ensureDynamicQuickJumpGroup(catalogKey) {
  const existingGroup = document.querySelector(`[data-quick-jump-group="${catalogKey}"]`);
  if (existingGroup) {
    if (isPagedQuickJumpCatalog(catalogKey) && !existingGroup.querySelector(".quick-jump-pages")) {
      rebuildQuickJumpGroup(catalogKey);
    }
    ensurePagedQuickJumpLayout(catalogKey);
    return;
  }
  const definition = catalogDefinitions[catalogKey];
  if (!definition || !definition.catalog?.length) return;
  const items = getFilteredQuickJumpItems(catalogKey, getCatalogQuickJumpItems(catalogKey, definition.catalog));
  if (!items.length) return;
  const group = document.createElement("div");
  group.className = "quick-jump";
  group.dataset.quickJumpGroup = catalogKey;
  group.setAttribute("aria-label", `${definition.label} ÃƒÂ¥Ã…Â¾Ã¢â‚¬Â¹ÃƒÂ¥Ã‚ÂÃ‚Â·ÃƒÂ¥Ã¢â‚¬ÂºÃ‚Â¾ÃƒÂ§Ã¢â‚¬Â°Ã¢â‚¬Â¡`);
  group.hidden = true;

  const label = document.createElement("span");
  label.className = "quick-jump-label";
  label.textContent = definition.label;
  group.append(label);

  appendQuickJumpButtons(group, catalogKey, items);

  const lastGroup = [...document.querySelectorAll("[data-quick-jump-group]")].pop();
  lastGroup?.after(group);
  bindQuickJumpButtons(group);
  syncQuickJumpImages(group);
}

function isPagedQuickJumpCatalog(catalogKey) {
  return catalogKey === "nikator" || catalogKey === "zolano" || catalogKey === "bed";
}

function ensurePagedQuickJumpLayout(catalogKey) {
  if (!isPagedQuickJumpCatalog(catalogKey)) return;
  const group = document.querySelector(`[data-quick-jump-group="${catalogKey}"]`);
  if (!group) return;

  const directButtons = Array.from(group.children).filter((child) =>
    child.classList?.contains("quick-jump-button")
  );
  const hasPages = Boolean(group.querySelector(".quick-jump-pages"));
  if (!directButtons.length && hasPages) return;

  if (catalogDefinitions[catalogKey]?.catalog?.length) {
    rebuildQuickJumpGroup(catalogKey);
    return;
  }

  if (!directButtons.length) return;
  const label = group.querySelector(".quick-jump-label") || document.createElement("span");
  label.className = "quick-jump-label";
  group.innerHTML = "";
  group.append(label);

  const pages = document.createElement("div");
  pages.className = "quick-jump-pages";
  directButtons.forEach((button, index) => {
    if (index % 9 === 0) {
      const page = document.createElement("div");
      page.className = "quick-jump-page";
      pages.append(page);
    }
    pages.lastElementChild.append(button);
  });
  group.append(pages);
  bindQuickJumpButtons(group);
  syncQuickJumpImages(group);
}

function rebuildQuickJumpGroup(catalogKey) {
  const group = document.querySelector(`[data-quick-jump-group="${catalogKey}"]`);
  const definition = catalogDefinitions[catalogKey];
  if (!group || !definition?.catalog?.length) return;

  const label = group.querySelector(".quick-jump-label") || document.createElement("span");
  label.className = "quick-jump-label";
  label.textContent = definition.label;
  group.innerHTML = "";
  group.append(label);

  const items = getFilteredQuickJumpItems(catalogKey, getCatalogQuickJumpItems(catalogKey, definition.catalog));
  appendQuickJumpButtons(group, catalogKey, items);

  bindQuickJumpButtons(group);
  syncQuickJumpImages(group);
}

function appendQuickJumpButtons(group, catalogKey, items) {
  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "quick-jump-empty";
    empty.textContent = "\u6ca1\u6709\u627e\u5230\u578b\u53f7";
    group.append(empty);
    return;
  }
  if (catalogKey === "nikator" || catalogKey === "zolano" || catalogKey === "bed") {
    const pages = document.createElement("div");
    pages.className = "quick-jump-pages";
    const builtButtons = items.map((item) => createQuickJumpButton(catalogKey, item)).filter(Boolean);
    builtButtons.forEach((button, index) => {
      if (index % 9 === 0) {
        const page = document.createElement("div");
        page.className = "quick-jump-page";
        pages.append(page);
      }
      const page = pages.lastElementChild;
      if (button) page.append(button);
    });
    group.append(pages);
    return;
  }

  items.forEach((item) => {
    const button = createQuickJumpButton(catalogKey, item);
    if (button) group.append(button);
  });
}

function setQuickJumpSearch(value) {
  const nextQuery = normalizeQuickJumpSearch(value);
  if (quickJumpSearchQuery === nextQuery) return;
  quickJumpSearchQuery = nextQuery;
  applyQuickJumpSearch();
}

function applyQuickJumpSearch() {
  if (!catalogDefinitions[activeCatalogKey]) return;
  rebuildQuickJumpGroup(activeCatalogKey);
}

function getFilteredQuickJumpItems(catalogKey, items) {
  if (!quickJumpSearchQuery) return items;
  return items.filter((item) =>
    normalizeQuickJumpSearch(getQuickJumpSearchText(catalogKey, item)).includes(quickJumpSearchQuery)
  );
}

function getQuickJumpSearchText(catalogKey, item) {
  return [
    item?.id,
    item?.name,
    item?.model,
    item?.series,
    item?.configuration,
    item?.description,
    getQuickJumpLabel(item?.series, catalogKey)
  ].join(" ");
}

function normalizeQuickJumpSearch(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "");
}

function createQuickJumpButton(catalogKey, item) {
    const quickPhoto = getQuickJumpPhoto(catalogKey, item.series, item);
    if (!quickPhoto && catalogKey !== "zolano") return null;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "quick-jump-button";
    button.dataset.quickJump = `${catalogKey}|${item.series}`;

    if (quickPhoto) {
      const image = document.createElement("img");
      image.src = quickPhoto;
      image.alt = "";
      image.loading = "lazy";
      button.append(image);
    }

    const text = document.createElement("span");
    text.textContent = getQuickJumpLabel(item.series, catalogKey);
    button.append(text);
  return button;
}

function syncQuickJumpImages(root) {
  syncQuickJumpLabels(root);
  root.querySelectorAll("[data-quick-jump]").forEach((button) => {
    const value = button.dataset.quickJump || "";
    const sep = value.indexOf("|");
    if (sep < 0) return;
    const catalogKey = value.slice(0, sep);
    const series = value.slice(sep + 1);
    const photo = getQuickJumpPhoto(catalogKey, series);
    if (!photo) {
      if (catalogKey === "zolano") {
        button.querySelector("img")?.remove();
        button.classList.add("quick-jump-button-text");
        return;
      }
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
    if (catalogKey === "bed") cropBedQuickJumpImage(image, photo);
  });
}

function getQuickJumpPhoto(catalogKey, series, item) {
  const photoItem = item || catalogDefinitions[catalogKey]?.catalog.find((candidate) => candidate.series === series);
  const gallery = getSeriesGalleryPhotos(series);
  const overrides = window.BAIDU_PHOTO_OVERRIDES || {};
  const diningFamilyPhoto = catalogKey === "diningTable" ? getDiningFamilyPhoto(photoItem) : "";
  if (catalogKey === "nikator") {
    const key = String(series || "").replace(/[^A-Za-z0-9-]/g, "");
    if (missingNikatorQuickPhotoSeries.has(key)) return "";
    if (key) return `assets/quick-thumbs/nikator/${key}.jpg`;
    const galleryPhoto = gallery.find(isWholeProductPhoto) || gallery[0] || "";
    if (galleryPhoto) return galleryPhoto;
    return overrides[series] || getNikatorGeneratedPhoto(series) || placeholderImage();
  }
  if (catalogKey === "zolano") {
    const override = zolanoQuickPhotoOverrides.get(String(series || ""));
    if (override) return override;
  }
  if (catalogKey === "bed") {
    const key = String(series || "").replace(/[^A-Za-z0-9-]/g, "");
    if (key) return `assets/quick-thumbs/bed/${key}.jpg`;
  }
  return overrides[series] || gallery[0] || photoItem?.originalPhoto || photoItem?.photo || diningFamilyPhoto || "";
}

function cropBedQuickJumpImage(image, originalSrc) {
  if (!image || !originalSrc || image.dataset.trimmedFor === originalSrc) return;
  image.dataset.trimSource = originalSrc;
  const run = () => {
    if (image.dataset.trimmedFor === originalSrc || image.dataset.trimSource !== originalSrc) return;
    try {
      const sourceWidth = image.naturalWidth || 0;
      const sourceHeight = image.naturalHeight || 0;
      if (!sourceWidth || !sourceHeight) return;
      const sourceCanvas = document.createElement("canvas");
      sourceCanvas.width = sourceWidth;
      sourceCanvas.height = sourceHeight;
      const sourceContext = sourceCanvas.getContext("2d", { willReadFrequently: true });
      sourceContext.drawImage(image, 0, 0);
      const { data } = sourceContext.getImageData(0, 0, sourceWidth, sourceHeight);
      let minX = sourceWidth;
      let minY = sourceHeight;
      let maxX = 0;
      let maxY = 0;
      for (let y = 0; y < sourceHeight; y += 1) {
        for (let x = 0; x < sourceWidth; x += 1) {
          const offset = (y * sourceWidth + x) * 4;
          const alpha = data[offset + 3];
          const diff = Math.max(Math.abs(255 - data[offset]), Math.abs(255 - data[offset + 1]), Math.abs(255 - data[offset + 2]));
          if (alpha > 20 && diff > 12) {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
        }
      }
      if (minX >= maxX || minY >= maxY) return;
      const cropWidth = maxX - minX + 1;
      const cropHeight = maxY - minY + 1;
      const padX = Math.max(8, Math.round(cropWidth * 0.04));
      const padY = Math.max(6, Math.round(cropHeight * 0.05));
      const sx = Math.max(0, minX - padX);
      const sy = Math.max(0, minY - padY);
      const sw = Math.min(sourceWidth - sx, cropWidth + padX * 2);
      const sh = Math.min(sourceHeight - sy, cropHeight + padY * 2);
      const targetCanvas = document.createElement("canvas");
      targetCanvas.width = 360;
      targetCanvas.height = 220;
      const targetContext = targetCanvas.getContext("2d");
      targetContext.fillStyle = "#fff";
      targetContext.fillRect(0, 0, targetCanvas.width, targetCanvas.height);
      const scale = Math.min(340 / sw, 190 / sh);
      const dw = Math.round(sw * scale);
      const dh = Math.round(sh * scale);
      const dx = Math.round((targetCanvas.width - dw) / 2);
      const dy = Math.round((targetCanvas.height - dh) / 2);
      targetContext.drawImage(sourceCanvas, sx, sy, sw, sh, dx, dy, dw, dh);
      image.dataset.trimmedFor = originalSrc;
      image.src = targetCanvas.toDataURL("image/jpeg", 0.88);
    } catch {
      // If canvas access fails, keep the original product image.
    }
  };
  if (image.complete) {
    window.requestAnimationFrame(run);
  } else {
    image.addEventListener("load", run, { once: true });
  }
}

function getNikatorGeneratedPhoto(series) {
  const key = String(series || "").replace(/[^A-Za-z0-9-]/g, "");
  return key ? `assets/generated/nikator/${key}.jpg` : "";
}

function isWholeProductPhoto(src) {
  return !/detail|close|material|leather|line|drawing|strip|stitch|corner|side|swatch/i.test(String(src || ""));
}

function getCatalogQuickJumpItems(catalogKey, catalog) {
  const seen = new Set();
  const limit = catalogKey === "nikator" ? 240 : catalogKey === "matching" ? 180 : 80;
  const items = catalog
    .filter((item) => item.series)
    .filter((item) => catalogKey !== "zolano" || isVisibleZolanoSeries(item))
    .filter((item) => {
      if (seen.has(item.series)) return false;
      seen.add(item.series);
      return true;
    });
  if (catalogKey === "zolano") {
    const bySeries = new Map(items.map((item) => [String(item.series || ""), item]));
    const pinned = showroomZolanoQuickOrder.map((series) => bySeries.get(series)).filter(Boolean);
    return pinned.length ? pinned : items.slice(0, limit);
  }
  const limitedItems = items.slice(0, limit);
  if (catalogKey !== "nikator") return limitedItems;

  const bySeries = new Map(limitedItems.map((item) => [String(item.series || ""), item]));
  const pinned = showroomNikatorQuickOrder.map((series) => bySeries.get(series)).filter(Boolean);
  const pinnedSet = new Set(pinned.map((item) => item.series));
  return [...pinned, ...limitedItems.filter((item) => !pinnedSet.has(item.series))];
}

function getQuickJumpLabel(series, catalogKey = "") {
  if (catalogKey === "zolano" && zolanoQuickLabelOverrides.has(String(series || ""))) {
    return zolanoQuickLabelOverrides.get(String(series || ""));
  }
  if (catalogKey === "zolano") {
    const zolanoNumber = String(series || "").match(/ZL\s*-?\s*(\d{3,5})/i)?.[1];
    if (zolanoNumber) return zolanoNumber;
  }
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
    if (value === "showroom") {
      selectedTypeFilters.clear();
      selectedTypeFilters.add("showroom");
      syncFilterButtons();
      selectFirstShowroomCombination();
      return;
    }
    selectedTypeFilters.delete("showroom");
    if (selectedTypeFilters.has(value)) selectedTypeFilters.delete(value);
    else selectedTypeFilters.add(value);
    syncFilterButtons();
    populateRecommendationSelect();
    renderSetPreview();
  });
});

if (builderClearAllButton) {
  builderClearAllButton.addEventListener("click", clearBuilderSelections);
}

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

const isLocalDevHost = ["127.0.0.1", "localhost"].includes(window.location.hostname);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    if (isLocalDevHost) {
      navigator.serviceWorker.getRegistrations()
        .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
        .catch(() => {});
      return;
    }
    navigator.serviceWorker.register("sw.js")
      .then((registration) => registration.update())
      .catch(() => {});
  });
}

window.addEventListener("load", () => {
  checkForOnlinePatch();
});

async function maybeClearAppCache() {
  const params = new URLSearchParams(window.location.search);
  const clearKey = "hp-sofa-cache-cleared-v944";
  const shouldClear = params.get("clearAppCache") === "1" || localStorage.getItem(clearKey) !== "1";
  if (!shouldClear || sessionStorage.getItem(clearKey) === "1") return;
  sessionStorage.setItem(clearKey, "1");
  localStorage.setItem(clearKey, "1");
  localStorage.removeItem(patchVersionStorageKey);
  localStorage.removeItem(patchNameStorageKey);
  try {
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
    }
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    }
  } catch {
    // Cache cleanup is best-effort; reload with cache-busting either way.
  }
  const cleanUrl = new URL(window.location.href);
  cleanUrl.searchParams.delete("clearAppCache");
  cleanUrl.searchParams.set("fresh", String(Date.now()));
  window.location.replace(cleanUrl.href);
}

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
  title.textContent = update.mandatory ? "ÃƒÂ¥Ã‚Â¿Ã¢â‚¬Â¦ÃƒÂ©Ã‚Â¡Ã‚Â»ÃƒÂ¦Ã¢â‚¬ÂºÃ‚Â´ÃƒÂ¦Ã¢â‚¬â€œÃ‚Â°" : "ÃƒÂ¦Ã…â€œÃ¢â‚¬Â°ÃƒÂ¦Ã¢â‚¬â€œÃ‚Â°ÃƒÂ§Ã¢â‚¬Â°Ã‹â€ ÃƒÂ¦Ã…â€œÃ‚Â¬";

  const message = document.createElement("span");
  const fullVersionLabel = Number(update.versionCode || 0) > 0
    ? `v${Number(update.versionCode || 0)}`
    : (update.versionName || "ÃƒÂ¦Ã¢â‚¬â€œÃ‚Â°ÃƒÂ§Ã¢â‚¬Â°Ã‹â€ ÃƒÂ¦Ã…â€œÃ‚Â¬");
  message.textContent = `\u5b8c\u6574\u5b89\u88c5\u5305 ${fullVersionLabel} \u53ef\u4ee5\u5b89\u88c5`;

  const actions = document.createElement("div");
  actions.className = "update-banner-actions";

  const laterButton = document.createElement("button");
  laterButton.type = "button";
  laterButton.textContent = "ÃƒÂ§Ã‚Â¨Ã‚ÂÃƒÂ¥Ã‚ÂÃ…Â½";
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
    alert("ÃƒÂ¦Ã¢â‚¬ÂºÃ‚Â´ÃƒÂ¦Ã¢â‚¬â€œÃ‚Â°ÃƒÂ©Ã¢â‚¬Å“Ã‚Â¾ÃƒÂ¦Ã…Â½Ã‚Â¥ÃƒÂ¨Ã‚Â¿Ã‹Å“ÃƒÂ¦Ã‚Â²Ã‚Â¡ÃƒÂ¨Ã‚Â®Ã‚Â¾ÃƒÂ§Ã‚Â½Ã‚Â®ÃƒÂ£Ã¢â€šÂ¬Ã¢â‚¬Å¡ÃƒÂ¨Ã‚Â¯Ã‚Â·ÃƒÂ¥Ã¢â‚¬Â¦Ã‹â€ ÃƒÂ¥Ã…â€œÃ‚Â¨ update.json ÃƒÂ¥Ã‚Â¡Ã‚Â«ÃƒÂ¥Ã¢â‚¬Â¦Ã‚Â¥ apkUrlÃƒÂ£Ã¢â€šÂ¬Ã¢â‚¬Å¡");
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
    const bundledPatchCode = Number(currentAppVersion.patchVersionCode || 0);
    const savedPatchCode = Number(localStorage.getItem(patchVersionStorageKey) || 0);
    const seenPatchCode = Math.max(
      Number(localStorage.getItem(patchSeenVersionStorageKey) || 0),
      Number(sessionStorage.getItem(patchSeenVersionStorageKey) || 0)
    );
    const remotePatchCode = Number(patch.patchVersionCode || 0);
    const highestLocalPatchCode = Math.max(savedPatchCode, seenPatchCode);
    if (remotePatchCode > bundledPatchCode && highestLocalPatchCode > remotePatchCode) {
      localStorage.removeItem(patchVersionStorageKey);
      localStorage.removeItem(patchNameStorageKey);
      localStorage.removeItem(patchSeenVersionStorageKey);
      sessionStorage.removeItem(patchSeenVersionStorageKey);
    }
    const installedPatchCode = Math.max(
      Number(localStorage.getItem(patchVersionStorageKey) || 0),
      bundledPatchCode,
      Number(localStorage.getItem(patchSeenVersionStorageKey) || 0),
      Number(sessionStorage.getItem(patchSeenVersionStorageKey) || 0)
    );
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
  laterButton.addEventListener("click", () => {
    localStorage.setItem(patchSeenVersionStorageKey, String(patch.patchVersionCode || 0));
    sessionStorage.setItem(patchSeenVersionStorageKey, String(patch.patchVersionCode || 0));
    banner.remove();
  });

  const updateButton = document.createElement("button");
  updateButton.type = "button";
  updateButton.className = "primary-button";
  updateButton.textContent = "小更新";
  updateButton.addEventListener("click", async () => {
    updateButton.disabled = true;
    updateButton.textContent = "下载 0/0";
    try {
      await applyOnlinePatch(patch, manifestUrl, ({ done, total, phase }) => {
        updateButton.textContent = `${phase} ${done}/${total}`;
      });
      updateButton.textContent = "完成，刷新中";
      window.setTimeout(() => {
        const reloadUrl = new URL(window.location.href);
        reloadUrl.searchParams.set("fresh", String(Date.now()));
        window.location.replace(reloadUrl.href);
      }, 250);
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

async function applyOnlinePatch(patch, manifestUrl, onProgress) {
  if (!("caches" in window)) throw new Error("这个设备不支持小更新缓存");
  const cache = await caches.open(patchCacheName);
  const manifestBaseUrl = new URL(manifestUrl, window.location.href);
  const files = Array.isArray(patch.files) ? patch.files : [];

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    const localPath = String(file.path || file.target || "").trim();
    const remotePath = String(file.url || file.source || file.path || "").trim();
    if (!localPath || !remotePath) throw new Error("补丁文件资料不完整");

    const remoteUrl = new URL(remotePath, manifestBaseUrl).href;
    onProgress?.({ phase: "下载", done: index + 1, total: files.length });
    const response = await fetchWithTimeout(`${remoteUrl}${remoteUrl.includes("?") ? "&" : "?"}t=${Date.now()}`, { cache: "no-store" }, 30000);
    if (!response.ok) throw new Error(`下载失败 ${localPath}`);

    const body = await response.blob();
    const contentType = file.contentType || response.headers.get("content-type") || guessPatchContentType(localPath);
    const headers = new Headers({ "content-type": contentType || "application/octet-stream" });
    onProgress?.({ phase: "安装", done: index + 1, total: files.length });
    await cacheOnePatchFile(cache, localPath, body, headers);
  }

  localStorage.setItem(patchVersionStorageKey, String(patch.patchVersionCode || 0));
  localStorage.setItem(patchNameStorageKey, patch.patchVersionName || "");
  localStorage.setItem(patchSeenVersionStorageKey, String(patch.patchVersionCode || 0));
  sessionStorage.setItem(patchSeenVersionStorageKey, String(patch.patchVersionCode || 0));
  currentAppVersion.patchVersionCode = Number(patch.patchVersionCode || 0);
  currentAppVersion.patchVersionName = patch.patchVersionName || currentAppVersion.patchVersionName || "";
}

async function cacheOnePatchFile(cache, localPath, body, headers) {
  for (const cacheUrl of getPatchCacheUrls(localPath)) {
    await cache.put(cacheUrl, new Response(body, { headers }));
  }
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 20000) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    if (error.name === "AbortError") throw new Error("下载超时，请检查网络");
    throw error;
  } finally {
    window.clearTimeout(timer);
  }
}

function getPatchCacheUrls(localPath) {
  const url = new URL(localPath, window.location.href);
  const urls = new Set([url.href]);
  if (url.search) {
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
  clearSelectedRecommendationCounts();
  if (builderSearchInput) builderSearchInput.value = "";
  setQuickJumpSearch("");
  if (widthFilterInput) widthFilterInput.value = "";
  selectedWidthFilter = 0;
  selectedDiningTurntableId = "";
  selectedTypeFilters.clear();
  syncFilterButtons();
  initBuilder();
  render();
  if (typeof syncQuickJumpVisibility === "function") syncQuickJumpVisibility();
}

function clearBuilderSelections() {
  if (recommendSelect) recommendSelect.value = "";
  if (widthFilterInput) widthFilterInput.value = "";
  if (builderSearchInput) builderSearchInput.value = "";
  selectedWidthFilter = 0;
  selectedDiningTurntableId = "";
  selectedTypeFilters.clear();
  clearSelectedRecommendationCounts();
  pieceMaterialSelections = {};
  suppressAutoSelectOnNextPopulate = true;
  suppressRetainedSelectionsOnNextPopulate = true;
  setQuickJumpSearch("");
  syncFilterButtons();
  populateBuilderPieces(1);
}

function render() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedBrand = brandFilter.value;
  const allSofas = [...catalogSofas, ...sofas].filter((sofa) =>
    activeCatalogKey !== "zolano" || isVisibleZolanoSeries(sofa)
  );
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
  totalValue.textContent = money.format(filtered.reduce((sum, sofa) => sum + getDisplayRetailPrice(sofa), 0));

  if (!showIndividualItems) return;

  if (!filtered.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = allSofas.length ? "ÃƒÂ¦Ã‚Â²Ã‚Â¡ÃƒÂ¦Ã…â€œÃ¢â‚¬Â°ÃƒÂ¦Ã¢â‚¬Â°Ã‚Â¾ÃƒÂ¥Ã‹â€ Ã‚Â°ÃƒÂ¥Ã…â€™Ã‚Â¹ÃƒÂ©Ã¢â‚¬Â¦Ã‚ÂÃƒÂ§Ã…Â¡Ã¢â‚¬Å¾ÃƒÂ¦Ã‚Â²Ã¢â€žÂ¢ÃƒÂ¥Ã‚ÂÃ¢â‚¬ËœÃƒÂ£Ã¢â€šÂ¬Ã¢â‚¬Å¡" : "ÃƒÂ¨Ã‚Â¯Ã‚Â·ÃƒÂ¥Ã¢â‚¬Â¦Ã‹â€ ÃƒÂ¦Ã¢â‚¬â€œÃ‚Â°ÃƒÂ¥Ã‚Â¢Ã…Â¾ÃƒÂ¦Ã‚Â²Ã¢â€žÂ¢ÃƒÂ¥Ã‚ÂÃ¢â‚¬ËœÃƒÂ¥Ã¢â‚¬ÂºÃ‚Â¾ÃƒÂ§Ã¢â‚¬Â°Ã¢â‚¬Â¡ÃƒÂ¥Ã¢â‚¬â„¢Ã…â€™ÃƒÂ¤Ã‚Â»Ã‚Â·ÃƒÂ¦Ã‚Â Ã‚Â¼ÃƒÂ£Ã¢â€šÂ¬Ã¢â‚¬Å¡";
    sofaList.append(empty);
    return;
  }

  filtered.forEach((sofa) => {
    const card = template.content.firstElementChild.cloneNode(true);
    const image = card.querySelector(".sofa-image");
    const title = card.querySelector("h2");
    const price = card.querySelector("strong");
    const details = card.querySelector("p");

    const titleText = sofa.name || sofa.model || "ÃƒÂ¦Ã‚Â²Ã¢â€žÂ¢ÃƒÂ¥Ã‚ÂÃ¢â‚¬Ëœ";
    image.src = resolveItemPhoto(sofa);
    image.alt = titleText;
    title.textContent = titleText;
    price.textContent = getCatalogCardPriceText(sofa);
    details.textContent = sofa.details || sofa.description || "No details added.";

    const meta = document.createElement("div");
    meta.className = "meta-line";
    [
      sofa.brand,
      sofa.series,
      sofa.configuration,
      sofa.dimensions,
      sofa.width && sofa.depth && sofa.height ? `${sofa.width} x ${sofa.depth} x ${sofa.height} mm` : "",
      getPositivePriceOptionCount(sofa) ? `${getPositivePriceOptionCount(sofa)} ÃƒÂ¤Ã‚Â¸Ã‚ÂªÃƒÂ¦Ã‚ÂÃ‚ÂÃƒÂ¨Ã‚Â´Ã‚Â¨ÃƒÂ¤Ã‚Â»Ã‚Â·ÃƒÂ¦Ã‚Â Ã‚Â¼` : ""
    ].filter(Boolean).forEach((value) => {
      const pill = document.createElement("span");
      pill.textContent = value;
      meta.append(pill);
    });
    details.after(meta);

    if (sofa.materials?.length && hasPositiveCatalogPrice(sofa)) {
      const materialBlock = document.createElement("div");
      materialBlock.className = "card-materials";
      sofa.materials.forEach((label, index) => {
        const materialPrice = getMaterialPrice(sofa, index);
        if (!materialPrice) return;
        const row = document.createElement("div");
        row.innerHTML = `<span>${label}</span><strong>${money.format(materialPrice)}</strong>`;
        materialBlock.append(row);
      });
      if (materialBlock.children.length) meta.after(materialBlock);
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

function hasPositiveCatalogPrice(item) {
  return Number(item?.price || 0) > 0
    || getPositivePriceOptionCount(item) > 0;
}

function getFirstPricedItem(items = []) {
  return items.find((item) => hasPositiveCatalogPrice(item)) || items[0] || null;
}

function getPositivePriceOptionCount(item) {
  if (!Array.isArray(item?.priceOptions)) return 0;
  return item.priceOptions.filter((value) => Number(value) > 0).length;
}

function getCatalogCardPriceText(item) {
  if (!hasPositiveCatalogPrice(item)) return "待定";
  return money.format(getDisplayRetailPrice(item));
}

function getDisplayRetailPrice(item, priceIndex = 0) {
  const price = Number(item?.priceOptions?.[priceIndex] || item?.price || 0);
  if (item?.priceIsFinal) return price;
  return getRetailPrice(price, 1, item?.priceFactor || 1);
}

function initBuilder() {
  syncActiveCatalog();
  const series = [...new Set(catalogSofas.map((sofa) => sofa.series))]
    .sort((a, b) => a.localeCompare(b));

  seriesSelect.innerHTML = "";
  if (!series.length) {
    const empty = document.createElement("option");
    empty.value = "";
    empty.textContent = `${catalogDefinitions[activeCatalogKey].label} ÃƒÂ§Ã¢â‚¬ÂºÃ‚Â®ÃƒÂ¥Ã‚Â½Ã¢â‚¬Â¢ÃƒÂ¨Ã‚Â¿Ã‹Å“ÃƒÂ¦Ã‚Â²Ã‚Â¡ÃƒÂ¦Ã…â€œÃ¢â‚¬Â°ÃƒÂ¨Ã‚ÂµÃ¢â‚¬Å¾ÃƒÂ¦Ã¢â‚¬â€œÃ¢â€žÂ¢`;
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
  const preferredSeries = getPreferredCatalogSeriesValue();
  if (preferredSeries && !hasPositiveSeriesPrice(seriesSelect.value)) {
    seriesSelect.value = preferredSeries;
  }

  populateModelJumpSelect(series);
  syncModelJumpVisibility();
  populateBuilderPieces();
  if (!fillDefaultSingleCatalogSlot()) {
    renderSetPreview();
  }
}

function populateModelJumpSelect(seriesList) {
  if (!modelJumpSelect) return;
  const selectedValue = seriesSelect?.value || "";
  modelJumpSelect.innerHTML = "";
  const empty = document.createElement("option");
  empty.value = "";
  empty.textContent = "ÃƒÂ©Ã¢â€šÂ¬Ã¢â‚¬Â°ÃƒÂ¦Ã¢â‚¬Â¹Ã‚Â©ÃƒÂ¥Ã¢â‚¬Â¦Ã‚Â¨ÃƒÂ©Ã†â€™Ã‚Â¨ÃƒÂ¥Ã…Â¾Ã¢â‚¬Â¹ÃƒÂ¥Ã‚ÂÃ‚Â·";
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
  syncQuickJumpActiveState(document);
}

function populateBuilderPieces(forceSlotCount) {
  const currentSelections = suppressRetainedSelectionsOnNextPopulate
    ? []
    : [...slotGrid.querySelectorAll(".slot-select")].map((select) => select.value);
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

  if (selectedRecommendation && typeof forceSlotCount !== "number") {
    const zolanoDirectPartCount = activeCatalogKey === "zolano" && !isGeneratedZolanoCombo(selectedRecommendation)
      ? getComboPartCodes(selectedRecommendation).length
      : 0;
    const recommendedSlotCount = Math.min(
      10,
      Math.max(zolanoDirectPartCount ? zolanoDirectPartCount + 1 : 0, getComboPartCodes(selectedRecommendation).length + 1)
    );
    visibleSlotCount = Math.max(visibleSlotCount, recommendedSlotCount);
  }

  visibleSlotCount = Math.min(10, Math.max(1, visibleSlotCount));

  populateRecommendationSelect();

  slotGrid.innerHTML = "";
  renderDiningMaterialSlot(materialLabels);
  renderDiningTurntableSlot(seriesItems, retainedSelections);
  for (let index = 0; index < visibleSlotCount; index += 1) {
    const label = document.createElement("label");
    label.textContent = `\u4f4d\u7f6e ${index + 1}`;

    const select = document.createElement("select");
    select.className = "slot-select";
    select.dataset.slot = String(index + 1);
    const allowedItems = getAllowedSlotItems(seriesItems, retainedSelections, index);
    const shouldSelectFirst = index === 0
      && !retainedSelections[index]
      && !suppressAutoSelectOnNextPopulate
      && allowedItems.length > 0
      && !isManualModuleSeriesName(seriesSelect?.value || "")
      && (activeCatalogKey === "zolano" || !recommendedCombos.length);
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
      clearSelectedRecommendationCounts();
      recommendSelect.value = "";
      pieceMaterialSelections = {};
      populateBuilderPieces();
    });

    label.append(select);
    const clearButton = document.createElement("button");
    clearButton.className = "slot-clear-button";
    clearButton.type = "button";
    clearButton.textContent = "\u53d6\u6d88";
    clearButton.hidden = !select.value;
    clearButton.addEventListener("click", () => {
      clearSelectedRecommendationCounts();
      recommendSelect.value = "";
      const remainingSelections = [...slotGrid.querySelectorAll(".slot-select")]
        .map((slotSelect, slotIndex) => slotIndex === index ? "" : slotSelect.value)
        .filter(Boolean);
      pieceMaterialSelections = {};
      setBuilderSelections(remainingSelections);
    });
    label.append(clearButton);
    const slotMaterialControl = renderSlotMaterialControl(index, materialLabels);
    if (slotMaterialControl) label.append(slotMaterialControl);
    slotGrid.append(label);
  }

  suppressAutoSelectOnNextPopulate = false;
  suppressRetainedSelectionsOnNextPopulate = false;
  syncZolanoModulePicker();
  renderSetPreview();
}

function renderSlotMaterialControl(slotIndex, labels) {
  if (activeCatalogKey !== "zolano" || isSinglePriceMaterialLabels(labels)) return null;
  const selectedIndex = getPieceMaterialIndex(
    pieceMaterialSelections,
    slotIndex,
    Number(materialSelect.value || 0)
  );
  const wrapper = document.createElement("span");
  wrapper.className = "slot-material-control";
  const caption = document.createElement("span");
  caption.textContent = "\u6750\u8d28";
  const select = document.createElement("select");
  select.className = "slot-material-select";
  select.dataset.pieceMaterialSlot = String(slotIndex);
  labels.forEach((label, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = formatMaterialDisplayLabel(label);
    select.append(option);
  });
  select.value = String(selectedIndex);
  select.addEventListener("change", () => {
    pieceMaterialSelections[slotIndex] = Number(select.value || 0);
    renderSetPreview();
  });
  wrapper.append(caption, select);
  return wrapper;
}

function renderDiningMaterialSlot(materialLabels) {
  if (activeCatalogKey !== "diningTable" || !materialLabels.some(isDiningMaterialGradeLabel)) return;
  const label = document.createElement("label");
  label.className = "dining-material-slot";
  label.textContent = "\u6750\u8d28";

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
  label.textContent = "ÃƒÂ¨Ã‚Â½Ã‚Â¬ÃƒÂ§Ã¢â‚¬ÂºÃ‹Å“";

  const select = document.createElement("select");
  const emptyOption = document.createElement("option");
  emptyOption.value = "none";
  emptyOption.textContent = "\u7a7a\u4f4d\u7f6e";
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
    "ÃƒÂ¨Ã‚Â½Ã‚Â¬ÃƒÂ§Ã¢â‚¬ÂºÃ‹Å“",
    turntable.dimensions,
    money.format(getRetailPrice(turntable.price, 1, turntable.priceFactor || 1))
  ].filter(Boolean).join(" - ");
}

function populateRecommendationSelect() {
  const selectedValue = recommendSelect.value;
  const combos = getSeriesRecommendations();
  const validComboIds = new Set(combos.map((combo) => combo.id));
  selectedRecommendationCounts = Object.fromEntries(
    Object.entries(selectedRecommendationCounts).filter(([comboId, count]) => validComboIds.has(comboId) && Number(count) > 0)
  );

  recommendSelect.innerHTML = "";
  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = "\u7a7a\u4f4d\u7f6e";
  recommendSelect.append(emptyOption);

  combos.forEach((combo) => {
    const option = document.createElement("option");
    option.value = combo.id;
    const count = getRecommendationCount(combo.id);
    option.textContent = appendZolanoRecommendationPrice(
      `${formatComboOption(combo)}${count > 0 ? ` x${count}` : ""}`,
      combo
    );
    recommendSelect.append(option);
  });

  if (combos.some((combo) => combo.id === selectedValue)) recommendSelect.value = selectedValue;
  renderComboButtons(combos);
}

function renderComboButtons(combos = getSeriesRecommendations()) {
  if (!comboButtonPanel) return;
  const shouldShow = (activeCatalogKey === "nikator" || activeCatalogKey === "zolano") && combos.length > 0;
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

  const list = document.createElement("div");
  list.className = "combo-choice-list";
  comboButtonPanel.append(list);

  combos.forEach((combo) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "combo-choice-button";
    const count = getRecommendationCount(combo.id);
    button.classList.toggle("is-active", count > 0);
    button.dataset.comboCount = String(count);
    button.innerHTML = `${formatComboButtonContent(combo)}${count > 0 ? `<span class="combo-choice-count">${count}</span>` : ""}`;
    button.addEventListener("click", () => {
      selectedRecommendationCounts[combo.id] = getRecommendationCount(combo.id) + 1;
      isSyncingRecommendationCounts = true;
      recommendSelect.value = combo.id;
      recommendSelect.dispatchEvent(new Event("change", { bubbles: true }));
      isSyncingRecommendationCounts = false;
    });
    list.append(button);
  });
  applyCompactComboButtonLayout();
}

function applyCompactComboButtonLayout() {
  const list = comboButtonPanel?.querySelector(".combo-choice-list");
  if (list) {
    list.style.setProperty("display", "grid", "important");
    list.style.setProperty("grid-template-columns", "repeat(2, minmax(0, 1fr))", "important");
    list.style.setProperty("gap", "5px", "important");
  }
  comboButtonPanel?.style.setProperty("padding", "5px", "important");
  comboButtonPanel?.querySelectorAll(".combo-choice-button").forEach((button) => {
    button.style.setProperty("min-height", "34px", "important");
    button.style.setProperty("padding", "5px 6px", "important");
    button.style.setProperty("font-size", "0.78rem", "important");
    button.style.setProperty("line-height", "1.08", "important");
    button.style.setProperty("text-align", "left", "important");
    button.style.setProperty("white-space", "normal", "important");
    button.style.setProperty("overflow-wrap", "anywhere", "important");
  });
}

function formatComboButtonLabel(combo) {
  const pieces = getComboPieceCount(combo);
  const sizeText = getComboButtonSizeText(combo);
  const name = getComboDisplayName(combo);
  const optionText = getZolanoComboOptionText(combo);
  const priceText = getZolanoRecommendationPriceText(combo);
  const electricText = getComboElectricSeatText(combo);
  return cleanComboDisplayText(
    [name, optionText, pieces ? `${pieces}\u4ef6` : "", electricText, sizeText, priceText].filter(Boolean).join(" "),
    pieces ? `组合 ${pieces}\u4ef6 ${sizeText}`.trim() : "\u7ec4\u5408"
  );
}

function formatComboButtonContent(combo) {
  const label = formatCompactComboButtonLabel(combo);
  const sizeText = getCompactComboSizeText(combo);
  if (combo?.showroomFullSet) {
    return escapeHtml(label).replace(
      "SHOWROOM FULL SET",
      '<span class="combo-choice-showroom-label">SHOWROOM FULL SET</span>'
    );
  }
  const note = combo?.showroomDisplayNote || "";
  if (!note && !sizeText) return escapeHtml(label);
  return `
    <span class="combo-choice-main">${escapeHtml(label)}</span>
    ${sizeText ? `<span class="combo-choice-size">${escapeHtml(sizeText)}</span>` : ""}
    ${note ? `<span class="combo-choice-note">${escapeHtml(note)}</span>` : ""}
  `;
}

function formatCompactComboButtonLabel(combo) {
  const pieces = getComboPieceCount(combo);
  const uShapePrefix = getNikatorUShapeComboPrefix(combo);
  const name = getComboDisplayName(combo)
    .replace(/^推荐组合\s*/i, "组合")
    .replace(/^常用/, "")
    .replace(/^单件/, "单")
    .replace(/两人位/g, "2人")
    .replace(/一人位/g, "1人")
    .replace(/三人位/g, "3人")
    .replace(/四人位/g, "4人")
    .replace(/组合/g, "组")
    .trim();
  const optionText = getZolanoComboOptionText(combo)
    .replace(/^推荐组合\s*/i, "组")
    .replace(/组合/g, "组")
    .trim();
  return cleanComboDisplayText(
    [uShapePrefix || name || optionText || "组", pieces ? `${pieces}件` : ""].filter(Boolean).join(" "),
    pieces ? `组 ${pieces}件` : "组"
  );
}

function getNikatorUShapeComboPrefix(combo) {
  if (activeCatalogKey !== "nikator" || !combo) return "";
  const slantCount = getNikatorSlantPartCount(combo);
  if (!slantCount) return "";
  return slantCount > 1 ? `U型${slantCount}斜` : "U型";
}

function getNikatorSlantPartCount(combo) {
  const partItems = getComboPartItems(combo);
  if (partItems.length) {
    return partItems.filter(isNikatorSlantPartItem).length;
  }
  const text = `${combo?.configuration || ""} ${combo?.description || ""} ${combo?.name || ""}`.toUpperCase();
  return (text.match(/\b\d{3}-B\b/g) || []).length;
}

function isNikatorSlantPartItem(item) {
  const text = `${item?.model || ""} ${item?.configuration || ""} ${item?.description || ""}`.toUpperCase();
  return /\b\d{3}-B\b|斜位/.test(text);
}

function getCompactComboSizeText(combo) {
  const sizeText = getComboButtonSizeText(combo);
  return sizeText
    .replace(/\s*x\s*/gi, "x")
    .replace(/\.0(?=\D|$)/g, "")
    .replace(/\b0\.5m\b/g, ".5m");
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function cleanComboDisplayText(value, fallback = "") {
  const repaired = repairMojibakeText(String(value || "").trim());
  return sanitizeGeneratedComboText(repaired, fallback);
}

function getComboElectricSeatText(combo) {
  if (activeCatalogKey !== "nikator" || !combo) return "";
  const count = getComboElectricSeatCount(combo);
  return count ? `${count}ÃƒÂ§Ã¢â‚¬ÂÃ‚ÂµÃƒÂ¥Ã…Â Ã‚Â¨ÃƒÂ¤Ã‚Â½Ã‚Â` : "";
}

function getComboElectricSeatCount(combo) {
  const partItems = getComboPartItems(combo);
  const partCount = partItems.filter(isElectricSeatItem).length;
  if (partCount) return partCount;
  return String(combo?.description || "")
    .split(/[+ÃƒÂ¯Ã‚Â¼Ã¢â‚¬Â¹,ÃƒÂ¯Ã‚Â¼Ã…â€™ÃƒÂ£Ã¢â€šÂ¬Ã‚Â]/)
    .filter((part) => /ÃƒÂ§Ã¢â‚¬ÂÃ‚ÂµÃƒÂ¥Ã…Â Ã‚Â¨/.test(part))
    .length;
}

function isElectricSeatItem(item) {
  return /ÃƒÂ§Ã¢â‚¬ÂÃ‚ÂµÃƒÂ¥Ã…Â Ã‚Â¨|\bRL\b/i.test(`${item?.configuration || ""} ${item?.description || ""} ${item?.model || ""}`);
}

function getComboDisplayName(combo) {
  if (activeCatalogKey === "zolano") {
    const name = cleanComboDisplayText(combo?.name, "");
    const series = String(combo?.series || seriesSelect?.value || "").trim();
    if (/\u5c55\u5385\u6574\u5957|SHOWROOM\s+FULL\s+SET/i.test(name)) return name;
    if (/^EXCEL\s+COMBO$/i.test(name)) return "";
    if (!name || name === series || /^ZL\s*\d+/i.test(name)) return "";
  }
  return cleanComboDisplayText(combo?.name, "\u7ec4\u5408").replace(/^\u5e38\u7528/, "");
}

function getZolanoComboOptionText(combo) {
  if (activeCatalogKey !== "zolano" || !combo) return "";
  return String(combo.configuration || "").trim();
}

function appendZolanoRecommendationPrice(label, combo) {
  const priceText = getZolanoRecommendationPriceText(combo);
  return priceText ? `${label} | ${priceText}` : label;
}

function getZolanoRecommendationPriceText(combo) {
  if (activeCatalogKey !== "zolano" || !combo) return "";
  if (combo.showroomNote) {
    const showroomValue = getShowroomDefaultMaterialTotal(combo);
    if (showroomValue) return money.format(showroomValue);
  }
  const pricedCombo = resolvePricedZolanoRecommendation(combo);
  const materialIndex = Number(materialSelect.value || 0);
  const value = getMaterialPrice(pricedCombo, materialIndex);
  return value ? money.format(value) : "";
}

function getShowroomDefaultMaterialTotal(combo) {
  const items = getComboPartItems(combo);
  if (!items.length) return 0;
  const labels = getMaterialLabels(items[0] || combo);
  const mfIndex = labels.findIndex((label) => String(label).toUpperCase() === "M/F");
  const fsaIndex = labels.findIndex((label) => String(label).toUpperCase() === "F/SA");
  if (mfIndex < 0 || fsaIndex < 0) return 0;
  return items.reduce((sum, item) => {
    const config = String(item?.configuration || "").toUpperCase();
    const materialIndex = /^(1NA|1NA\/T|CORNER)$/.test(config) ? mfIndex : fsaIndex;
    return sum + getMaterialPrice(item, materialIndex);
  }, 0);
}

function getComboButtonSizeText(combo) {
  if (activeCatalogKey === "zolano") {
    if (combo?.buttonSizeText) return combo.buttonSizeText;
    const widths = getComboWidthCandidates(combo);
    const widthText = formatZolanoButtonWidths(widths, getWidthFilter());
    const depth = getComboButtonDepthValue(combo);
    if (widthText && depth) return `${widthText} x ${formatMeters(depth)}`;
    if (widthText) return widthText;
  }
  const width = getComboWidthValue(combo);
  const depth = getComboButtonDepthValue(combo);
  if (width && depth) return `${formatMeters(width)} x ${formatMeters(depth)}`;
  if (width) return formatMeters(width);
  return "";
}

function formatZolanoButtonWidths(widths, filter = null) {
  const uniqueWidths = [...new Set(widths.filter((width) => Number(width) > 0))];
  if (!uniqueWidths.length) return "";
  const displayWidth = getZolanoButtonDisplayWidth(uniqueWidths, filter);
  if (displayWidth) return formatMeters(displayWidth);
  if (uniqueWidths.length === 1) return formatMeters(uniqueWidths[0]);
  return uniqueWidths.map(formatMeters).join("/");
}

function getZolanoButtonDisplayWidth(widths, filter) {
  if (!filter?.target) return 0;
  const matchingWidths = widths.filter((width) =>
    isWidthInFilter(width, filter)
    || isZolanoNearWidthMatch(width, filter)
  );
  if (!matchingWidths.length) return 0;
  return matchingWidths.sort((a, b) =>
    Math.abs(a - filter.target) - Math.abs(b - filter.target)
    || b - a
  )[0];
}

function getComboButtonDepthValue(combo) {
  const directDisplayDepth = Number(combo?.buttonDepth || combo?.displayDepth || combo?.seatDepth || 0);
  if (directDisplayDepth > 0) return directDisplayDepth;

  const text = `${combo?.configuration || ""} ${combo?.dimensions || ""}`;
  const explicitDepthMatch = text.match(/\bD\s*[:?]?\s*(\d{3,5})(?:\s*\/\s*(\d{3,5}))?/i);
  if (explicitDepthMatch) return Number(explicitDepthMatch[2] || explicitDepthMatch[1]);

  const seatDepthMatch = text.match(/(?:seat|ÃƒÂ¥Ã‚ÂºÃ‚Â§ÃƒÂ¦Ã‚Â·Ã‚Â±|ÃƒÂ¥Ã‚ÂÃ‚ÂÃƒÂ¦Ã‚Â·Ã‚Â±)\s*(?:D|depth)?\s*(\d{3,5})/i);
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
  const explicitDepthMatch = text.match(/D\s*[:?]?\s*(\d{3,5})(?:\s*\/\s*(\d{3,5}))?/i);
  if (explicitDepthMatch) return Number(explicitDepthMatch[2] || explicitDepthMatch[1]);

  const dimensionNumbers = (text.match(/\d{3,5}/g) || []).map(Number).filter((value) => value >= 700);
  if (dimensionNumbers.length >= 2) return dimensionNumbers[1];
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
  emptyOption.textContent = "\u7a7a\u4f4d\u7f6e";
  select.append(emptyOption);

  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = formatPieceOption(item);
    select.append(option);
  });

  if (selectFirst && items.length) {
    const preferredItem = getFirstPricedItem(items);
    if (preferredItem) select.value = preferredItem.id;
  }
}

function ensureOption(select, item) {
  if (!item || [...select.options].some((option) => option.value === item.id)) return;
  const option = document.createElement("option");
  option.value = item.id;
  option.textContent = formatPieceOption(item);
  select.append(option);
}

function getActiveManualModuleSeries() {
  if (activeCatalogKey === "zolano") return getActiveZolanoModuleSeries();
  if (activeCatalogKey === "nikator") {
    const currentSeries = String(seriesSelect?.value || "").toUpperCase();
    return isNikatorModuleSeries(currentSeries) ? currentSeries : "";
  }
  return "";
}

function getActiveZolanoModuleSeries() {
  const currentSeries = String(seriesSelect?.value || "").toUpperCase();
  const currentCombo = String(recommendSelect?.selectedOptions?.[0]?.textContent || "").toUpperCase();
  if (activeCatalogKey !== "zolano") return "";
  const text = `${currentSeries} ${currentCombo}`;
  if (/(?:^|[^0-9])2628(?:[^0-9]|$)/.test(text)) return "2628";
  if (/(?:^|[^0-9])2897(?:[^0-9]|$)/.test(text)) return "2897";
  if (/(?:^|[^0-9])3776(?:[^0-9]|$)/.test(text)) return "3776";
  if (/(?:^|[^0-9])3818(?:[^0-9]|$)/.test(text)) return "3818";
  return "";
}

function isZolanoModuleSeriesName(seriesValue) {
  const text = String(seriesValue || "").toUpperCase();
  return /(?:^|[^0-9])(?:2628|2897|3776|3818)(?:[^0-9]|$)/.test(text);
}

function isManualModuleSeriesName(seriesValue) {
  if (activeCatalogKey === "zolano") return isZolanoModuleSeriesName(seriesValue);
  if (activeCatalogKey === "nikator") return isNikatorModuleSeries(seriesValue);
  return false;
}

function getActiveManualModules() {
  const series = getActiveZolanoModuleSeries();
  if (series === "2628") return zolano2628Modules;
  if (series === "2897") return zolano2897Modules;
  if (series === "3776") return zolano3776Modules;
  if (series === "3818") return zolano3818Modules;
  if (activeCatalogKey === "nikator") return getNikatorModuleItems();
  return [];
}

function getNikatorModuleItems() {
  const series = getActiveManualModuleSeries();
  if (!isNikatorModuleSeries(series)) return [];
  return getDedupedNikatorModuleItems(getSeriesItems().filter((item) => hasNikatorActualModulePhoto(item)))
    .map((item) => ({
    id: item.id,
    label: getNikatorModuleLabel(item),
    meta: getModuleMetaText(item),
    photo: getNikatorModulePhoto(item)
  }));
}

function getDedupedNikatorModuleItems(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = getNikatorMirrorPairKey(item);
    if (!key) return true;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getNikatorMirrorPairKey(item) {
  const config = String(item?.configuration || "").toUpperCase();
  const model = String(item?.model || "");
  const code = getNikatorModuleCode(item);
  const sameSizePairCode = getNikatorSameSizePairCode(code);
  if (sameSizePairCode) {
    return [
      item?.series || "",
      sameSizePairCode,
      Number(item?.width || 0),
      Number(item?.depth || 0),
      Number(item?.height || 0)
    ].join("|");
  }
  const sideMatch = config.match(/\b(\d+(?:\.\d+)?)(?:P)?(L|R)\b/) || config.match(/\b(\d+(?:\.\d+)?)P(L|R)\b/);
  if (!sideMatch) return "";
  if (!/\bP?[LR]\b|PL|PR/.test(config)) return "";
  const family = model.replace(/-(?:\d+(?:\.\d+)?P?[LR]|[0-9A-Z-]+)$/i, "");
  const seat = sideMatch[1];
  return [
    family || item?.series || "",
    seat,
    Number(item?.width || 0),
    Number(item?.depth || 0),
    Number(item?.height || 0)
  ].join("|");
}

function getNikatorModuleCode(item) {
  const model = String(item?.model || item?.id || "");
  return model.replace(String(item?.series || ""), "").replace(/^-/, "").trim().toUpperCase();
}

function getNikatorSameSizePairCode(code) {
  const cleanCode = String(code || "").replace(/\s+/g, "");
  if (cleanCode === "405" || cleanCode === "406") return "405/406";
  if (cleanCode === "401" || cleanCode === "402") return "401/402";
  return "";
}

function hasNikatorActualModulePhoto(item) {
  if (!item) return false;
  const directPhoto = individualItemPhotos[item.id] || individualItemPhotos[item.model];
  return Boolean(directPhoto);
}

function isNikatorModuleSeries(seriesValue) {
  const series = String(seriesValue || "").toUpperCase();
  if (!/^(?:NK|LE)\d+SF$/.test(series)) return false;
  if (nikatorModuleSeriesSeedSet.has(series)) return true;
  return Object.keys(individualItemPhotos || {}).some((key) => String(key).toUpperCase().startsWith(`${series}-`));
}

function getNikatorModulePhoto(item) {
  if (!item) return placeholderImage();
  return individualItemPhotos[item.id]
    || individualItemPhotos[item.model]
    || item.photo
    || item.originalPhoto
    || (window.BAIDU_PHOTO_OVERRIDES || {})[item.series]
    || placeholderImage();
}

function getNikatorModuleLabel(item) {
  const model = getNikatorModuleCode(item);
  const config = String(item?.configuration || "").toUpperCase();
  const sameSizePairCode = getNikatorSameSizePairCode(model);
  if (sameSizePairCode) return sameSizePairCode;
  const pair = config.match(/\b(\d+(?:\.\d+)?)P[LR]\b/);
  if (pair) return `${pair[1]}P L/R`;
  return model || item?.configuration || item?.series || "ITEM";
}

function getModuleMetaText(item) {
  const width = Number(item?.width || 0);
  const depth = Number(item?.depth || 0);
  const height = Number(item?.height || 0);
  const size = [width ? `${width}mm` : "", depth ? `D${depth}` : "", height ? `H${height}` : ""].filter(Boolean).join(" ");
  const config = String(item?.configuration || "").replace(/\s+/g, " ").trim();
  return [config, size].filter(Boolean).join(" \u00b7 ");
}

function isManualModulePickerActive() {
  return Boolean(getActiveManualModuleSeries());
}

function syncZolanoModulePicker() {
  if (!zolanoModulePicker) return;
  const modules = getActiveManualModules();
  const activeSeries = getActiveManualModuleSeries();
  const shouldShow = modules.length > 0;
  zolanoModulePicker.hidden = !shouldShow;
  if (!shouldShow) return;

  zolanoModulePicker.innerHTML = `
    <div class="module-picker-heading" style="margin-bottom:4px;font-size:0.88rem;line-height:1.1;">
      <strong>${activeSeries} \u6a21\u5757</strong>
      <span>\u70b9\u51fb\u4e00\u6b21\u52a0 1 \u4ef6</span>
    </div>
    <div class="module-picker-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(72px,1fr));gap:5px;">
      ${modules.map((module) => {
        const selectedCount = getSelectedModuleCount(module.id);
        const selected = selectedCount > 0;
        return `
        <button class="module-picker-button${selected ? " is-active" : ""}" type="button" data-zolano-module-id="${module.id}" style="position:relative;display:grid;grid-template-rows:52px auto auto;gap:1px;min-height:88px;padding:4px 3px;border-radius:6px;${selected ? "border-color:#14706b;background:#e5f3f1;" : ""}">
          ${selected ? `<span class="module-picker-count">${selectedCount}</span>` : ""}
          <img src="${module.photo}" alt="${module.label}" style="width:100%;height:52px;object-fit:contain;">
          <strong style="font-size:0.86rem;line-height:1.05;">${module.label}</strong>
          <span style="font-size:0.68rem;line-height:1.05;">${module.meta}</span>
        </button>
      `;}).join("")}
    </div>
  `;

  zolanoModulePicker.querySelectorAll("[data-zolano-module-id]").forEach((button) => {
    button.addEventListener("click", () => toggleZolano2897Module(button.dataset.zolanoModuleId || ""));
  });
}

function toggleZolano2897Module(moduleId) {
  addZolano2897Module(moduleId);
}

function getSelectedModuleCount(moduleId) {
  if (!moduleId || !slotGrid) return 0;
  return [...slotGrid.querySelectorAll(".slot-select")].filter((select) => select.value === moduleId).length;
}

function removeZolano2897Module(moduleId) {
  if (!moduleId || !slotGrid) return;
  if (recommendSelect) recommendSelect.value = "";
  const slotSelects = [...slotGrid.querySelectorAll(".slot-select")];
  const selectedIds = slotSelects.map((select) => select.value).filter(Boolean);
  const removeIndex = selectedIds.indexOf(moduleId);
  if (removeIndex < 0) return;
  selectedIds.splice(removeIndex, 1);
  pieceMaterialSelections = {};
  setBuilderSelections(selectedIds);
  syncZolanoModulePicker();
}

function addZolano2897Module(moduleId) {
  if (!isManualModulePickerActive()) return;
  const item = catalogSofas.find((sofa) => sofa.id === moduleId);
  if (!item) return;

  if (recommendSelect) recommendSelect.value = "";
  const slotSelects = [...slotGrid.querySelectorAll(".slot-select")];
  const emptySlot = slotSelects.find((select) => !select.value);
  if (emptySlot) {
    ensureOption(emptySlot, item);
    emptySlot.value = item.id;
    emptySlot.parentElement?.querySelector(".slot-clear-button")?.removeAttribute("hidden");
    pieceMaterialSelections = {};
    renderSetPreview();
    syncZolanoModulePicker();
    return;
  }

  if (slotSelects.length >= 10) return;
  populateBuilderPieces(slotSelects.length + 1);
  const refreshedSlotSelects = [...slotGrid.querySelectorAll(".slot-select")];
  const targetSlot = refreshedSlotSelects[slotSelects.length] || refreshedSlotSelects[refreshedSlotSelects.length - 1];
  if (!targetSlot) return;
  ensureOption(targetSlot, item);
  targetSlot.value = item.id;
  targetSlot.parentElement?.querySelector(".slot-clear-button")?.removeAttribute("hidden");
  pieceMaterialSelections = {};
  renderSetPreview();
  syncZolanoModulePicker();
}

function setBuilderSelections(itemIds) {
  const ids = itemIds.filter(Boolean).slice(0, 10);
  populateBuilderPieces(Math.min(10, Math.max(1, ids.length + 1)));
  const slotSelects = [...slotGrid.querySelectorAll(".slot-select")];
  slotSelects.forEach((select) => {
    select.value = "";
    select.parentElement?.querySelector(".slot-clear-button")?.setAttribute("hidden", "");
  });
  ids.forEach((id, index) => {
    const item = catalogSofas.find((sofa) => sofa.id === id);
    const select = slotSelects[index];
    if (!item || !select) return;
    ensureOption(select, item);
    select.value = item.id;
    select.parentElement?.querySelector(".slot-clear-button")?.removeAttribute("hidden");
  });
  renderSetPreview();
}

function getRecommendationItems(combo, seriesItems = getSeriesItems()) {
  if (!combo) return [];

  if (activeCatalogKey === "zolano" && !isGeneratedZolanoCombo(combo)) {
    const comboConfigKey = normalizeComboText(combo.configuration || "");
    const comboDimensionKey = normalizeComboText(combo.dimensions || combo.description || "");
    const exactComboItem = seriesItems.find((item) => (
      normalizeComboText(item.configuration || "") === comboConfigKey
      && normalizeComboText(item.dimensions || item.description || "") === comboDimensionKey
    )) || seriesItems.find((item) => String(item.id || "") === String(combo.id || ""));
    if (exactComboItem) return [exactComboItem];

    const rawCodes = getComboPartCodes(combo);
    const normalizedCodes = rawCodes.filter((code) => {
      const value = String(code || "").trim();
      if (!value) return false;
      if (value === String(combo?.series || "").trim()) return false;
      if (value === String(combo?.name || "").trim()) return false;
      return true;
    });
    const directMatches = normalizedCodes
      .map((code) => findItemByPartCode(seriesItems, code))
      .filter(Boolean);
    if (directMatches.length) return directMatches;

    const fallbackMatch = findZolanoRecommendedItem(seriesItems, combo);
    return fallbackMatch ? [fallbackMatch] : [];
  }

  return getComboPartCodes(combo)
    .slice(0, 10)
    .map((code) => findItemByPartCode(seriesItems, code))
    .filter(Boolean);
}

function applyRecommendationPurchases() {
  const purchases = getSelectedRecommendationPurchases();
  if (!purchases.length) return false;

  const seriesItems = getSeriesItems();
  const flattenedItems = purchases.flatMap((combo) => getRecommendationItems(combo, seriesItems));
  if (!flattenedItems.length) return false;

  pieceMaterialSelections = {};
  populateBuilderPieces(Math.min(10, Math.max(1, flattenedItems.length)));
  const slotSelects = [...slotGrid.querySelectorAll(".slot-select")];
  slotSelects.forEach((select) => {
    select.value = "";
    select.parentElement?.querySelector(".slot-clear-button")?.setAttribute("hidden", "");
  });

  flattenedItems.slice(0, 10).forEach((item, index) => {
    const select = slotSelects[index];
    if (!item || !select) return;
    ensureOption(select, item);
    select.value = item.id;
    select.parentElement?.querySelector(".slot-clear-button")?.removeAttribute("hidden");
  });

  let offset = 0;
  purchases.forEach((combo) => {
    const comboItems = getRecommendationItems(combo, seriesItems);
    if (!comboItems.length) return;
    applyDefaultPieceMaterials(combo, comboItems, offset);
    offset += comboItems.length;
  });

  refreshSlotMaterialControls();
  return true;
}

function fillDefaultSingleCatalogSlot() {
  if (!isDefaultSingleItemCatalog()) return false;
  const item = getDefaultSingleCatalogItem();
  const select = slotGrid.querySelector(".slot-select");
  if (!item || !select) return false;
  const hasExistingSelection = [...slotGrid.querySelectorAll(".slot-select")].some((slotSelect) => slotSelect.value);
  if (hasExistingSelection) return false;
  ensureOption(select, item);
  select.value = item.id;
  select.parentElement?.querySelector(".slot-clear-button")?.removeAttribute("hidden");
  pieceMaterialSelections = {};
  renderSetPreview();
  return true;
}

function isDefaultSingleItemCatalog() {
  return ["chair", "diningChair"].includes(activeCatalogKey);
}

function getDefaultSingleCatalogItem() {
  if (!isDefaultSingleItemCatalog()) return null;
  const filteredItems = getFilteredSeriesItems();
  const seriesItems = getSeriesItems();
  const pricedFilteredItem = getFirstPricedItem(filteredItems);
  if (pricedFilteredItem) return pricedFilteredItem;
  const pricedSeriesItem = getFirstPricedItem(seriesItems);
  if (pricedSeriesItem) return pricedSeriesItem;
  return filteredItems[0] || seriesItems[0] || null;
}

function applyRecommendedCombo() {
  const combo = getSelectedRecommendation();
  if (!combo) return;
  if (getSelectedRecommendationPurchases().length > 1 && applyRecommendationPurchases()) return;

  const seriesItems = getSeriesItems();
  const slotSelects = [...slotGrid.querySelectorAll(".slot-select")];
  slotSelects.forEach((select) => {
    select.value = "";
  });

  if (activeCatalogKey === "zolano" && !isGeneratedZolanoCombo(combo)) {
    const rawCodes = getComboPartCodes(combo);
    const normalizedCodes = rawCodes.filter((code) => {
      const value = String(code || "").trim();
      if (!value) return false;
      if (value === String(combo?.series || "").trim()) return false;
      if (value === String(combo?.name || "").trim()) return false;
      return true;
    });
    const directMatches = normalizedCodes
      .map((code) => findItemByPartCode(seriesItems, code))
      .filter(Boolean);
    if (directMatches.length) {
      populateBuilderPieces(Math.max(2, Math.min(10, directMatches.length + 1)));
      const refreshedSlotSelects = [...slotGrid.querySelectorAll(".slot-select")];
      directMatches.slice(0, 10).forEach((item, index) => {
        const select = refreshedSlotSelects[index];
        if (!select) return;
        ensureOption(select, item);
        select.value = item.id;
      });
      applyDefaultPieceMaterials(combo, directMatches);
      refreshSlotMaterialControls();
      return;
    }

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
  const selectedItems = [...slotGrid.querySelectorAll(".slot-select")]
    .map((select) => catalogSofas.find((sofa) => sofa.id === select.value))
    .filter(Boolean);
  applyDefaultPieceMaterials(combo, selectedItems);
  refreshSlotMaterialControls();
}

function applyDefaultPieceMaterials(combo, items, startIndex = 0) {
  if (activeCatalogKey !== "zolano" || !combo?.showroomNote || !items?.length) return;
  const labels = getMaterialLabels(items[0] || combo);
  const mfIndex = labels.findIndex((label) => String(label).toUpperCase() === "M/F");
  const fsaIndex = labels.findIndex((label) => String(label).toUpperCase() === "F/SA");
  if (mfIndex < 0 || fsaIndex < 0) return;
  items.forEach((item, index) => {
    const config = String(item?.configuration || "").toUpperCase();
    pieceMaterialSelections[startIndex + index] = /^(1NA|1NA\/T|CORNER)$/.test(config) ? mfIndex : fsaIndex;
  });
}

function refreshSlotMaterialControls() {
  slotGrid.querySelectorAll(".slot-material-select").forEach((select) => {
    const slotIndex = Number(select.dataset.pieceMaterialSlot || 0);
    if (pieceMaterialSelections[slotIndex] === undefined) return;
    select.value = String(pieceMaterialSelections[slotIndex]);
  });
}

function getSeriesItems() {
  return catalogSofas.filter((sofa) => sofa.series === seriesSelect.value);
}

function hasPositiveSeriesPrice(seriesValue) {
  return catalogSofas.some((item) => item.series === seriesValue && hasPositiveCatalogPrice(item));
}

function getPreferredCatalogSeriesValue() {
  const preferred = catalogSofas.find((item) => hasPositiveCatalogPrice(item));
  return preferred?.series || seriesSelect?.value || "";
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
    ...getZolanoOriginalSaleRowRecommendations(),
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
      ? [
          normalizeComboText(combo.configuration),
          normalizeComboText(combo.dimensions || combo.description || "")
        ].join("|")
      : getComboPartCodes(combo).join("+") || combo.id;
    if (seen.has(key)) return false;
    seen.add(key);
    if (widthFilter) {
      const width = getComboWidthValue(combo);
      const widthMatches = isComboInWidthFilter(combo, widthFilter);
      if (!width && activeCatalogKey === "zolano" && isZolanoRecommendedCombo(combo, hasZolanoOriginalSaleRows)) {
        // Zolano price-list rows often omit numeric width; keep the real row visible.
      } else if (!widthMatches) return false;
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

function getZolanoOriginalSaleRowRecommendations() {
  if (activeCatalogKey !== "zolano") return [];
  return catalogSofas.filter((item) =>
    item.series === seriesSelect.value
    && item.priceIsFinal
    && isZolanoOriginalSaleConfig(item.configuration)
  );
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

function isComboInWidthFilter(combo, filter) {
  const widths = getComboWidthCandidates(combo);
  if (!widths.length) return false;
  return widths.some((width) =>
    isWidthInFilter(width, filter)
    || isZolanoNearWidthMatch(width, filter)
  );
}

function isZolanoNearWidthMatch(width, filter) {
  if (activeCatalogKey !== "zolano" || !filter?.target) return false;
  const value = Number(width || 0);
  return value > 0 && Math.abs(value - Number(filter.target)) <= 250;
}

function matchesTypeFilters(combo) {
  if (selectedTypeFilters.has("showroom")) {
    return isShowroomCombination(combo) || isGeneratedCatalogCombo(combo);
  }
  const text = [
    combo.name,
    combo.configuration,
    combo.description
  ].join(" ").toLowerCase();
  const hasChaise = /(ÃƒÂ¨Ã‚Â´Ã‚ÂµÃƒÂ¥Ã‚Â¦Ã†â€™|afl|afr|405|406|\ber\/t\b|\bel\/t\b|\bna\/t\b)/i.test(text);
  const hasRecliner = /(\u8eba\u4f4d|csa|csal|csar|401|402|recliner|r\/pu|r\/dp)/i.test(text);
  if (hasChaise && !selectedTypeFilters.has("chaise")) return false;
  if (hasRecliner && !selectedTypeFilters.has("recliner")) return false;
  return true;
}

function isShowroomCombination(combo) {
  const text = [
    combo?.name,
    combo?.configuration,
    combo?.description,
    combo?.showroomNote,
    combo?.showroomDisplayNote
  ].join(" ");
  return Boolean(combo?.showroomFullSet || combo?.showroomNote || /\u5c55\u5385|showroom/i.test(text));
}

function isGeneratedCatalogCombo(combo) {
  return String(combo?.id || "").startsWith("AUTO-");
}

function getComboWidthValue(combo) {
  const candidates = getComboWidthCandidates(combo);
  if (candidates.length) return candidates[0];
  return getComboPrimaryWidthValue(combo);
}

function getComboWidthCandidates(combo) {
  if (Number(combo?.buttonWidth || 0) > 0) return [Number(combo.buttonWidth)];
  const primary = getComboPrimaryWidthValue(combo);
  const text = `${combo?.configuration || ""} ${combo?.dimensions || ""}`;
  const explicitLengthMatch = text.match(/\bL\s*:?\s*([^|]+)/i);
  const lengths = explicitLengthMatch
    ? (explicitLengthMatch[1].match(/\d{3,5}/g) || []).map(Number).filter(Boolean)
    : [];
  const configWidth = activeCatalogKey === "zolano" ? getZolanoConfigWidthCandidate(combo) : 0;
  const knownWidth = activeCatalogKey === "zolano" ? getKnownZolanoButtonWidth(combo) : 0;
  const values = activeCatalogKey === "zolano"
    ? [...lengths, configWidth, knownWidth, primary]
    : [primary];
  return [...new Set(values.filter((width) => Number(width) > 0))];
}

function getKnownZolanoButtonWidth(combo) {
  const series = String(combo?.series || "").toUpperCase();
  const config = String(combo?.configuration || "").toUpperCase();
  if (series === "ZL 2807") {
    if (/^1S\b/.test(config)) return 1070;
    if (/^2S\b/.test(config)) return 1680;
    if (/^3S\b/.test(config)) return 2070;
  }
  return 0;
}

function getZolanoConfigWidthCandidate(combo) {
  const config = String(combo?.configuration || "").trim();
  const text = `${config} ${combo?.dimensions || ""}`;
  const millimeterMatch = text.match(/\b(\d{3,5})\s*MM\b/i);
  if (millimeterMatch) return Number(millimeterMatch[1]);
  const centimeterMatch = config.match(/\((\d+(?:\.\d+)?)\s*CM\)/i);
  if (centimeterMatch) return Math.round(Number(centimeterMatch[1]) * 10);
  const meterMatch = text.match(/\((\d+(?:\.\d+)?)\s*M\)/i) || config.match(/^(\d+(?:\.\d+)?)$/);
  if (meterMatch) return Math.round(Number(meterMatch[1]) * 1000);
  return 0;
}

function getComboPrimaryWidthValue(combo) {
  const directWidth = Number(combo?.width || 0);
  if (directWidth > 0) return directWidth;

  const text = `${combo?.configuration || ""} ${combo?.dimensions || ""}`;
  const meterMatch = text.match(/(\d+(?:\.\d+)?)\s*M\b/i);
  if (meterMatch) return Math.round(Number(meterMatch[1]) * 1000);

  const closeArmMatch = text.match(/ÃƒÂ¦Ã¢â‚¬ÂÃ‚Â¶ÃƒÂ¦Ã¢â‚¬Â°Ã‚Â¶ÃƒÂ¦Ã¢â‚¬Â°Ã¢â‚¬Â¹\s*(\d{3,5})/i);
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

function selectFirstShowroomCombination() {
  populateRecommendationSelect();
  const combo = getSeriesRecommendations().find(isShowroomCombination);
  if (!combo) {
    recommendSelect.value = "";
    clearSelectedRecommendationCounts();
    renderSetPreview();
    return;
  }
  clearSelectedRecommendationCounts();
  selectedRecommendationCounts[combo.id] = 1;
  recommendSelect.value = combo.id;
  const zolanoDirectPartCount = activeCatalogKey === "zolano" && !isGeneratedZolanoCombo(combo)
    ? getComboPartCodes(combo).length
    : 0;
  const slotCount = Math.min(10, Math.max(zolanoDirectPartCount ? zolanoDirectPartCount + 1 : 0, getComboPartCodes(combo).length + 1));
  pieceMaterialSelections = {};
  populateBuilderPieces(slotCount);
  applyRecommendedCombo();
  renderSetPreview();
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
  if (combo?.series === "ZL 3817 MELFE") {
    const config = String(combo?.configuration || "").toUpperCase();
    if (config === "FULL SET" || config === "1EL/T + 2ER") {
      return [
        "ZL3817MELFE1ELEXPORT2020ZL33002SHEET1544",
        "ZL3817MELFE1NAEXPORT2020ZL33002SHEET1545"
      ];
    }
  }
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
    const config = String(item.configuration || "").toUpperCase();
    const seat = config.match(/\b\d+(?:\.\d+)?/)?.[0] || "";
    if (!seat) return;
    bySeat[seat] ||= {};
    if (config.includes("PL")) bySeat[seat].left = item;
    if (config.includes("PR")) bySeat[seat].right = item;
    if (config.includes("CB-B")) {
      bySeat[seat].slantCenter = item;
    } else if (config.includes("CB")) {
      bySeat[seat].center = item;
    }
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
    if (group.slantCenter) {
      baseCombos.push(
        [`常用${seat}三人位`, [group.left, group.slantCenter, group.right]],
        [`常用${seat}四人位`, [group.left, group.slantCenter, group.slantCenter, group.right]]
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
      generated.push(buildZolanoGeneratedCombo("ÃƒÂ¥Ã‚Â·Ã‚Â¦ÃƒÂ¥Ã‚ÂÃ‚Â³ÃƒÂ¦Ã¢â‚¬Â°Ã‚Â¶ÃƒÂ¦Ã¢â‚¬Â°Ã¢â‚¬Â¹ÃƒÂ§Ã‚Â»Ã¢â‚¬Å¾ÃƒÂ¥Ã‚ÂÃ‹â€ ", [left, right]));
      centers.forEach((center) => {
        generated.push(buildZolanoGeneratedCombo("ÃƒÂ¥Ã‚Â·Ã‚Â¦ÃƒÂ¥Ã‚ÂÃ‚Â³ÃƒÂ¦Ã¢â‚¬Â°Ã‚Â¶ÃƒÂ¦Ã¢â‚¬Â°Ã¢â‚¬Â¹ÃƒÂ¥Ã…Â Ã‚Â ÃƒÂ¤Ã‚Â¸Ã‚Â­ÃƒÂ¤Ã‚Â½Ã‚Â", [left, center, right]));
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
  const longSeat = byConfig.get("1NA LONG");
  const chaiseSeat = byConfig.get("1NA/T");
  const corner = byConfig.get("CORNER");
  const arm = byConfig.get("ARM");
  const table = byConfig.get("TABLE");
  const longAddOn = byConfig.get("1NA/LONG DEPAN TAMBAH 6 INCH") || longSeat;
  const stool = byConfig.get("STOOL");
  const photoSetParts = [arm, longAddOn, oneSeat, oneSeat, corner, oneSeat, table, chaiseSeat];
  const showroomNote = "showroom-full-set";
  const photoSetLayout = {
    left: 4300,
    right: 3970,
    depth: "1530/1700",
    height: 890
  };
  const oneSeatWidth = 940;
  const presets = [
    {
      label: "ZL3776 SHOWROOM FULL SET",
      parts: photoSetParts,
      dimensions: formatZolano3776LayoutDimension(photoSetLayout),
      buttonWidth: 4600,
      buttonSizeText: "4.30m x 3.97m x 1.53m",
      layoutType: "l-shape",
      photo: "assets/generated/zolano/ZL3776-showroom-set.jpg",
      showroomNote,
      showroomFullSet: true
    },
    {
      label: "ZL3776 ÃƒÂ¥Ã‚Â±Ã¢â‚¬Â¢ÃƒÂ¥Ã…Â½Ã¢â‚¬Â¦ÃƒÂ¦Ã¢â‚¬Â¢Ã‚Â´ÃƒÂ¥Ã‚Â¥Ã¢â‚¬â€ + 1NA ÃƒÂ¥Ã‚Â·Ã‚Â¦ÃƒÂ¨Ã‚Â¾Ã‚Â¹ÃƒÂ¥Ã…Â Ã‚Â ÃƒÂ©Ã¢â‚¬Â¢Ã‚Â¿",
      parts: [arm, longAddOn, oneSeat, oneSeat, oneSeat, corner, oneSeat, table, chaiseSeat],
      dimensions: formatZolano3776LayoutDimension(extendZolano3776Layout(photoSetLayout, { leftAdd: oneSeatWidth })),
      buttonWidth: 5200,
      buttonSizeText: "5.24m x 3.97m x 1.53m",
      layoutType: "l-shape",
      photo: "assets/generated/zolano/ZL3776-showroom-set.jpg",
      showroomNote,
      showroomFullSet: true
    },
    {
      label: "ZL3776 ÃƒÂ¥Ã‚Â±Ã¢â‚¬Â¢ÃƒÂ¥Ã…Â½Ã¢â‚¬Â¦ÃƒÂ¦Ã¢â‚¬Â¢Ã‚Â´ÃƒÂ¥Ã‚Â¥Ã¢â‚¬â€ + 1NA ÃƒÂ¥Ã‚ÂÃ‚Â³ÃƒÂ¨Ã‚Â¾Ã‚Â¹ÃƒÂ¥Ã…Â Ã‚Â ÃƒÂ©Ã¢â‚¬Â¢Ã‚Â¿",
      parts: [arm, longAddOn, oneSeat, oneSeat, corner, oneSeat, oneSeat, table, chaiseSeat],
      dimensions: formatZolano3776LayoutDimension(extendZolano3776Layout(photoSetLayout, { rightAdd: oneSeatWidth })),
      buttonWidth: 4900,
      buttonSizeText: "4.30m x 4.91m x 1.53m",
      layoutType: "l-shape",
      photo: "assets/generated/zolano/ZL3776-showroom-set.jpg",
      showroomNote,
      showroomFullSet: true
    },
    {
      label: "ZL3776 ÃƒÂ¥Ã‚Â±Ã¢â‚¬Â¢ÃƒÂ¥Ã…Â½Ã¢â‚¬Â¦ÃƒÂ¦Ã¢â‚¬Â¢Ã‚Â´ÃƒÂ¥Ã‚Â¥Ã¢â‚¬â€ + ÃƒÂ¥Ã‚Â·Ã‚Â¦ÃƒÂ¥Ã‚ÂÃ‚Â³ÃƒÂ¥Ã‚ÂÃ¢â‚¬Å¾ 1NA",
      parts: [arm, longAddOn, oneSeat, oneSeat, oneSeat, corner, oneSeat, oneSeat, table, chaiseSeat],
      dimensions: formatZolano3776LayoutDimension(extendZolano3776Layout(photoSetLayout, { leftAdd: oneSeatWidth, rightAdd: oneSeatWidth })),
      buttonWidth: 5200,
      buttonSizeText: "5.24m x 4.91m x 1.53m",
      layoutType: "l-shape",
      photo: "assets/generated/zolano/ZL3776-showroom-set.jpg",
      showroomNote,
      showroomFullSet: true
    },
    { label: "ZL3776 ÃƒÂ§Ã‚ÂºÃ‚Â¦ 1m", parts: [oneSeat] },
    { label: "ZL3776 ÃƒÂ§Ã‚ÂºÃ‚Â¦ 1.5m", parts: [chaiseSeat] },
    { label: "ZL3776 ÃƒÂ§Ã‚ÂºÃ‚Â¦ 2.5m", parts: [chaiseSeat, oneSeat] },
    { label: "ZL3776 ÃƒÂ§Ã‚ÂºÃ‚Â¦ 2.6m", parts: [chaiseSeat, stool] },
    { label: "ZL3776 ÃƒÂ§Ã‚ÂºÃ‚Â¦ 2.9m", parts: [oneSeat, oneSeat, oneSeat] }
  ];

  return presets
    .map((preset) => ({
      label: preset.label,
      parts: preset.parts.filter(Boolean),
      expectedCount: preset.parts.length,
      dimensions: preset.dimensions,
      buttonWidth: preset.buttonWidth,
      buttonSizeText: preset.buttonSizeText,
      layoutType: preset.layoutType,
      photo: preset.photo,
      showroomNote: preset.showroomNote,
      showroomFullSet: preset.showroomFullSet
    }))
    .filter((preset) => preset.parts.length === preset.expectedCount)
    .map((preset) => buildZolanoGeneratedCombo(preset.label, preset.parts, {
      dimensions: preset.dimensions,
      buttonWidth: preset.buttonWidth,
      buttonSizeText: preset.buttonSizeText,
      layoutType: preset.layoutType,
      photo: preset.photo,
      showroomNote: preset.showroomNote,
      showroomFullSet: preset.showroomFullSet
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
  combo.description = "ÃƒÂ¦Ã…â€™Ã¢â‚¬Â°ÃƒÂ¦Ã¢â‚¬Â°Ã‚Â¶ÃƒÂ¦Ã¢â‚¬Â°Ã¢â‚¬Â¹ÃƒÂ§Ã‚Â»Ã¢â‚¬Å¾ÃƒÂ¤Ã‚Â»Ã‚Â¶ÃƒÂ§Ã¢â‚¬ÂÃ…Â¸ÃƒÂ¦Ã‹â€ Ã‚ÂÃƒÂ§Ã‚Â»Ã¢â‚¬Å¾ÃƒÂ¥Ã‚ÂÃ‹â€ ";
  const widths = parts.map((item) => getZolanoItemWidthPair(item));
  combo.width = widths.reduce((sum, pair) => sum + (pair.close || pair.open || 0), 0);
  combo.depth = Math.max(...parts.map((item) => getDimensionNumber(item, "D")), 0);
  combo.height = Math.max(...parts.map((item) => getDimensionNumber(item, "H")), 0);
  combo.dimensions = options.dimensions || getZolanoPartsDimensionText(parts);
  if (options.buttonWidth) combo.buttonWidth = options.buttonWidth;
  if (options.buttonSizeText) combo.buttonSizeText = options.buttonSizeText;
  if (options.layoutType) combo.layoutType = options.layoutType;
  if (options.photo) combo.photo = options.photo;
  if (options.showroomNote) combo.showroomNote = options.showroomNote;
  if (options.showroomFullSet) combo.showroomFullSet = true;
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
    sizeParts.push(`ÃƒÂ¦Ã¢â‚¬ÂÃ‚Â¶ÃƒÂ¦Ã¢â‚¬Â°Ã‚Â¶ÃƒÂ¦Ã¢â‚¬Â°Ã¢â‚¬Â¹ ${closeWidth}mm / ÃƒÂ¥Ã‚Â¼Ã¢â€šÂ¬ÃƒÂ¦Ã¢â‚¬Â°Ã‚Â¶ÃƒÂ¦Ã¢â‚¬Â°Ã¢â‚¬Â¹ ${openWidth}mm`);
  } else if (hasAnyWidth && closeWidth) {
    sizeParts.push(`ÃƒÂ¥Ã‚Â®Ã‚Â½ ${closeWidth}mm`);
  }
  if (depth) sizeParts.push(`\u6df1 ${depth}mm`);
  if (height) sizeParts.push(`ÃƒÂ©Ã‚Â«Ã‹Å“ ${height}mm`);
  if (seatHeight) sizeParts.push(`ÃƒÂ¥Ã‚ÂÃ‚ÂÃƒÂ©Ã‚Â«Ã‹Å“ ${seatHeight}mm`);
  return sizeParts.join(" | ");
}

function getZolanoItemWidthPair(item) {
  const text = String(item?.dimensions || "");
  const armMatch = text.match(/ÃƒÂ¦Ã¢â‚¬ÂÃ‚Â¶ÃƒÂ¦Ã¢â‚¬Â°Ã‚Â¶ÃƒÂ¦Ã¢â‚¬Â°Ã¢â‚¬Â¹\s*(\d{3,5})\s*\/\s*ÃƒÂ¥Ã‚Â¼Ã¢â€šÂ¬ÃƒÂ¦Ã¢â‚¬Â°Ã‚Â¶ÃƒÂ¦Ã¢â‚¬Â°Ã¢â‚¬Â¹\s*(\d{3,5})/);
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
  const match = text.match(/seat\s*H\s*(\d{3,5})|ÃƒÂ¥Ã‚ÂÃ‚ÂÃƒÂ©Ã‚Â«Ã‹Å“\s*(\d{3,5})/i);
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

  if (byCode.has("311") && byCode.has("312")) {
    comboSpecs.push({ label: "SHOWROOM 311 + 312", codes: ["311", "312"], showroom: true });
    if (centerCode) comboSpecs.push({ label: `SHOWROOM 311 + ${centerCode} + 312`, codes: ["311", centerCode, "312"], showroom: true });
  }

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
      const combo = buildGeneratedCombo(spec.label, parts);
      if (spec.showroom) combo.showroomNote = "showroom-generated";
      return combo;
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
  const safeName = sanitizeGeneratedComboText(name, "\u5e38\u7528\u7ec4\u5408");
  const priceOptionCount = Math.max(...parts.map((item) => item.priceOptions?.length || 0), 0);
  const priceOptions = Array.from({ length: priceOptionCount }, (_, index) =>
    parts.reduce((sum, item) => sum + Number(item.priceOptions?.[index] || item.price || 0), 0)
  );
  const partCodes = parts.map((item) => getItemCodeCandidates(item)[0]).filter(Boolean);

  return {
    id: `AUTO-${first.series}-${safeName}-${partCodes.join("-")}`,
    brand: first.brand,
    series: first.series,
    name: safeName,
    configuration: parts.map((item) => item.configuration).join(" + "),
    description: "\u5e38\u7528\u76f4\u6392\u7ec4\u5408",
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

function sanitizeGeneratedComboText(value, fallback) {
  const text = String(value || "").trim();
  if (!text) return fallback;
  return /[\u00c0-\u00ff]|\uFFFD|Ã|Â|Ä|Å/.test(text) ? fallback : text;
}

function isAccessoryItem(item) {
  return item?.itemType === "accessory" || item?.addOn === true;
}

function isZolanoAddOnItem(item) {
  if (!item) return false;
  const text = `${item.configuration || ""} ${item.description || ""} ${item.model || ""}`.toUpperCase();
  return /\b(TABLE|PILLOW|HEADREST|USB|CUSHION)\b/.test(text) || /ÃƒÂ¨Ã…â€™Ã‚Â¶ÃƒÂ¥Ã¢â‚¬Â¡Ã‚Â |ÃƒÂ¦Ã…Â Ã‚Â±ÃƒÂ¦Ã…Â¾Ã¢â‚¬Â¢|ÃƒÂ¥Ã‚Â¤Ã‚Â´ÃƒÂ¦Ã…Â¾Ã¢â‚¬Â¢|ÃƒÂ©Ã‚ÂÃ‚Â ÃƒÂ¦Ã…Â¾Ã¢â‚¬Â¢|ÃƒÂ©Ã¢â‚¬Â¦Ã‚ÂÃƒÂ¤Ã‚Â»Ã‚Â¶|ÃƒÂ¥Ã…Â Ã‚Â ÃƒÂ¨Ã‚Â´Ã‚Â­/.test(text);
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
  const prefix = isAccessoryItem(item) ? "\u914d\u4ef6/\u52a0\u8d2d: " : "";
  const configLabel = formatZolanoUnitConfig(item.configuration || item.model);
  if (activeCatalogKey === "zolano") {
    const suffix = String(item.description || item.model || "").trim();
    const isRepeatedModel = !suffix || /^AURONZO(?:\s+add-on)?$/i.test(suffix) || suffix === String(item.model || "").trim();
    return isRepeatedModel ? `${prefix}${configLabel}` : `${prefix}${configLabel} - ${suffix}`;
  }
  return `${prefix}${configLabel} - ${item.description || item.model}`;
}

function formatZolanoUnitConfig(config) {
  const text = String(config || "");
  if (activeCatalogKey !== "zolano") return text;
  const remarks = {
    "1NA": "\u5355\u4f4d\u6ca1\u6276\u624b",
    "1NA/T": "\u5355\u4f4d\u6ca1\u6276\u624b\u4f38\u5c55\u4f4d",
    ARM: "\u6276\u624b",
    CORNER: "\u8f6c\u89d2"
  };
  return text.replace(/\b(1NA\/T|1NA|ARM|CORNER)\b/g, (match) => `${match}(${remarks[match]})`);
}

function renderSetPreview() {
  const selectedRecommendation = resolvePricedZolanoRecommendation(getSelectedRecommendation());
  const comboPurchases = getStructuredRecommendationPurchases();
  const selectedFromSlots = [...slotGrid.querySelectorAll(".slot-select")]
    .map((select) => select.value)
    .map((id) => catalogSofas.find((sofa) => sofa.id === id))
    .filter(Boolean);
  const selected = comboPurchases.length
    ? comboPurchases.flatMap((purchase) => purchase.items)
    : selectedFromSlots;
  if (!selected.length) {
    const defaultItem = getDefaultSingleCatalogItem();
    if (defaultItem) selected.push(defaultItem);
  }
  const effectiveRecommendation = comboPurchases.length > 1
    ? null
    : (comboPurchases[0]?.combo || selectedRecommendation || resolvePricedZolanoRecommendation(findMatchingRecommendedCombo(selected)));
  const materialIndex = Number(materialSelect.value || 0);
  const mixedMaterialLabels = getMaterialLabels(selected[0] || effectiveRecommendation);
  const usesSinglePriceMaterial = isSinglePriceMaterialLabels(mixedMaterialLabels);
  const materialName = usesSinglePriceMaterial
    ? ""
    : formatMaterialDisplayLabel(materialSelect.options[materialSelect.selectedIndex]?.textContent || "\u6750\u8d28");
  const mixedMaterialEnabled = isMixedMaterialSet(selected);
  const mixedMaterialSummary = mixedMaterialEnabled
    ? getMixedMaterialSummary(selected, materialIndex, mixedMaterialLabels)
    : materialName;
  if (!catalogSofas.length) {
    if (setTotal) setTotal.textContent = money.format(0);
    setPreview.innerHTML = `
      <div class="catalog-empty">
        <strong>${catalogDefinitions[activeCatalogKey].label}</strong>
        <p>\u8fd9\u4e2a\u76ee\u5f55\u8fd8\u6ca1\u6709\u8f7d\u5165\u578b\u53f7\u3002</p>
      </div>
    `;
    return;
  }
  const total = comboPurchases.length
    ? comboPurchases.reduce((sum, purchase) => sum + getSetMaterialPrice(purchase.items, purchase.combo, materialIndex, { useMixed: true }), 0)
    : getSetMaterialPrice(selected, effectiveRecommendation, materialIndex, { useMixed: true });
  const hasCombination = Boolean(effectiveRecommendation) || selected.length > 0;
  const displayedPieceCount = comboPurchases.length
    ? comboPurchases.reduce((sum, purchase) => sum + getDisplayedPieceCount(purchase.combo, purchase.items), 0)
    : getDisplayedPieceCount(effectiveRecommendation, selected);

  if (setTotal) setTotal.textContent = money.format(total);
  setPreview.innerHTML = "";

  const materialList = document.createElement("div");
  materialList.className = "material-list material-list-after-photo";
  materialList.innerHTML = `<h3>\u6574\u5957\u552e\u4ef7</h3>${mixedMaterialSummary ? `<p>\u5df2\u9009:${mixedMaterialSummary} \u00b7 ${money.format(total)}</p>` : ""}`;
  const labels = getMaterialLabels(effectiveRecommendation || selected[0]);
  if (!usesSinglePriceMaterial) {
    labels.forEach((label, index) => {
      const row = document.createElement("div");
      const isSelectedMaterial = index === materialIndex;
      const displayLabel = formatMaterialDisplayLabel(label);
      row.className = `material-row${isSelectedMaterial ? " is-selected" : ""}`;
      const value = getSetMaterialRowPrice(selected, effectiveRecommendation, index);
      row.innerHTML = `<span>${displayLabel}${isSelectedMaterial ? "(\u5df2\u9009)" : ""}</span><strong>\u6574\u5957 ${money.format(value)}</strong>`;
      materialList.append(row);
    });
  }

  const photoItem = comboPurchases[0]?.combo || effectiveRecommendation || selected[0] || { series: seriesSelect.value, model: seriesSelect.value };
  const setPhoto = document.createElement("article");
  setPhoto.className = "set-photo-card";
  const recommendationDimensions = effectiveRecommendation?.dimensions || "";
  const selectedDimensions = selected[0]?.dimensions || "";
  const selectedSizeText = selected[0]?.width && selected[0]?.depth && selected[0]?.height
    ? `${selected[0].width} x ${selected[0].depth} x ${selected[0].height} mm`
    : "";
  const dimensionText = comboPurchases.length > 1
    ? ""
    : (getCombinedDimensionText(selected, effectiveRecommendation)
    || recommendationDimensions
    || selectedDimensions
    || selectedSizeText);
  const showroomNote = effectiveRecommendation?.showroomNote || "";
  const bedSizeOptions = activeCatalogKey === "bed" ? renderBedSizeOptions(selected[0]) : "";
  setPhoto.innerHTML = `
    <div class="set-photo-heading">
      <h3>${effectiveRecommendation?.name || seriesSelect.value || "\u6c99\u53d1\u7ec4\u5408"}</h3>
      <p>${[formatComboSummary(effectiveRecommendation, selected, comboPurchases), mixedMaterialSummary].filter(Boolean).join(" - ")}</p>
    </div>
    <button class="photo-open-button" type="button" data-full-photo="${resolveItemPhoto(photoItem)}" aria-label="\u653e\u5927\u56fe\u7247">
      <img class="set-main-photo" src="${resolveItemPhoto(photoItem)}" alt="${photoItem?.series || "\u6c99\u53d1\u7ec4\u5408"}">
    </button>
    ${renderPhotoGallery(photoItem)}
    <div class="photo-actions">
      <button class="photo-action-button" type="button" data-open-photo-viewer>\u6253\u5f00\u56fe\u7247</button>
    </div>
    <div class="set-photo-copy">
      ${bedSizeOptions}
      ${dimensionText ? `<p class="combo-dimension"><span>\u6574\u5957\u5c3a\u5bf8</span><strong>${dimensionText}</strong></p>` : ""}
      ${hasCombination ? `<p class="combo-pieces"><span>\u7ec4\u5408\u4ef6\u6570</span><strong>${displayedPieceCount} \u4ef6</strong></p>` : ""}
      ${hasCombination ? `<p class="combo-total"><span>\u6574\u5957\u552e\u4ef7</span><strong>${money.format(total)}</strong></p>` : ""}
    </div>
  `;
  if (!usesSinglePriceMaterial) setPhoto.append(materialList);
  setPreview.append(setPhoto);
  bindPhotoGallery(setPhoto);
  bindPhotoOpen(setPhoto);
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
          <h3>\u4f4d\u7f6e ${index + 1}</h3>
        <p>${formatPieceTitle(item)}</p>
        ${formatPieceDimensionLine(item) ? `<p>${formatPieceDimensionLine(item)}</p>` : ""}
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

function getSetMaterialRowPrice(selected, effectiveRecommendation, index) {
  if (activeCatalogKey === "zolano" && selected.length > 1) {
    return selected.reduce((sum, item) => sum + getMaterialPrice(item, index), 0);
  }
  return getSetMaterialPrice(selected, effectiveRecommendation, index, { useMixed: false });
}

function renderBedSizeOptions(selectedItem) {
  if (!selectedItem?.series) return "";
  const options = catalogSofas.filter((item) => item.series === selectedItem.series);
  if (activeCatalogKey !== "bed" || options.length <= 1) return "";
  return `
    <div class="bed-size-options" aria-label="\u653e\u5927\u56fe\u7247">
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
  return findMatchingZolanoFinalPriceCombo(combo)
    || (combo.price || combo.priceOptions?.length ? combo : null)
    || catalogSofas.find((item) => item.id === combo.id)
    || findZolanoRecommendedItem(getSeriesItems(), combo)
    || combo;
}

function findMatchingZolanoFinalPriceCombo(combo) {
  if (activeCatalogKey !== "zolano" || !combo) return null;
  const comboCodeKey = getComboPartCodes(combo).map((part) => normalizeComboText(part)).filter(Boolean).join("+");
  const comboConfigKey = normalizeComboText(combo.configuration);
  const comboNameKey = normalizeComboText(combo.name);
  const comboDimensionKey = normalizeComboText(combo.dimensions || combo.description || "");
  return recommendedCombos.find((candidate) => {
    if (candidate?.series !== combo.series) return false;
    if (!candidate?.priceIsFinal) return false;
    if (candidate?.showroomFullSet) return false;
    const candidateCodeKey = getComboPartCodes(candidate).map((part) => normalizeComboText(part)).filter(Boolean).join("+");
    const candidateDimensionKey = normalizeComboText(candidate.dimensions || candidate.description || "");
    if (comboDimensionKey && candidateDimensionKey && candidateDimensionKey === comboDimensionKey) return true;
    if (!comboDimensionKey && comboCodeKey && candidateCodeKey && candidateCodeKey === comboCodeKey) return true;
    if (!comboDimensionKey && comboConfigKey && normalizeComboText(candidate.configuration) === comboConfigKey) return true;
    if (!comboDimensionKey && comboNameKey && comboNameKey !== normalizeComboText("Excel combo") && normalizeComboText(candidate.name) === comboNameKey) return true;
    return false;
  }) || null;
}

function resolveIndividualItemPhoto(item) {
  if (!item) return "";
  if (zolanoModulePhotoMap[item.id]) return zolanoModulePhotoMap[item.id];
  const overrides = window.BAIDU_PHOTO_OVERRIDES || {};
  const galleryPhoto = getSeriesGalleryPhotos(item.series)[0] || "";
  return individualItemPhotos[item.id]
    || individualItemPhotos[item.model]
    || individualItemPhotos[item.series]
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
    <div class="photo-gallery" aria-label="\u653e\u5927\u56fe\u7247">
      ${photos.map((src, index) => `
        <button class="photo-thumb${index === 0 ? " is-active" : ""}" type="button" data-photo-src="${src}" aria-label="\u653e\u5927\u56fe\u7247">
          <img src="${src}" alt="">
          <span class="photo-select-mark" aria-hidden="true"></span>
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
    button.addEventListener("click", (event) => {
      if (event.target.closest(".photo-select-mark")) {
        event.preventDefault();
        button.classList.toggle("is-selected");
        return;
      }
      mainPhoto.src = button.dataset.photoSrc;
      if (openButton) openButton.dataset.fullPhoto = button.dataset.photoSrc;
      thumbs.forEach((thumb) => thumb.classList.toggle("is-active", thumb === button));
    });
    button.addEventListener("dblclick", (event) => {
      event.preventDefault();
      button.classList.toggle("is-selected");
    });
    button.addEventListener("contextmenu", (event) => {
      if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) {
        return;
      }
      event.preventDefault();
      button.classList.toggle("is-selected");
    });
  });
}

function formatPieceTitle(item) {
  const config = String(item?.configuration || "").trim();
  const configLabel = formatZolanoUnitConfig(config);
  let description = String(item?.description || "").trim();
  if (config && description.toUpperCase().startsWith(config.toUpperCase())) {
    description = description.slice(config.length).trim();
  }
  const title = [configLabel, description].filter(Boolean).join(" ").trim();
  return `${isZolanoAddOnItem(item) ? "ÃƒÂ©Ã¢â‚¬Â¦Ã‚ÂÃƒÂ¤Ã‚Â»Ã‚Â¶/ÃƒÂ¥Ã…Â Ã‚Â ÃƒÂ¨Ã‚Â´Ã‚Â­ - " : ""}${title || item?.model || item?.series || ""}`;
}

function formatPieceDimensionLine(item) {
  if (Number(item?.width || 0) > 0 && Number(item?.depth || 0) > 0 && Number(item?.height || 0) > 0) {
    return `${item.width} x ${item.depth} x ${item.height} mm`;
  }
  const zolano3776Line = formatZolano3776PieceDimensionLine(item);
  if (zolano3776Line) return zolano3776Line;
  const dimensions = String(item?.dimensions || "").trim();
  return dimensions && dimensions !== "ÃƒÂ©Ã¢â‚¬Â¦Ã‚ÂÃƒÂ¤Ã‚Â»Ã‚Â¶" ? dimensions : "";
}

function formatZolano3776PieceDimensionLine(item) {
  if (String(item?.series || "") !== "ZL 3776") return "";
  const config = String(item?.configuration || "").toUpperCase();
  if (/1NA\/LONG DEPAN/.test(config)) return "1NA/LONG +6 inch";
  const dimensions = String(item?.dimensions || "");
  const length = dimensions.match(/\bL\s*(\d{3,5})/i)?.[1];
  const depthMatch = dimensions.match(/\bD\s*(\d{3,5})(?:\/(\d{3,5}))?/i);
  const height = dimensions.match(/\bH\s*(\d{3,5})/i)?.[1];
  const depth = depthMatch ? (depthMatch[2] || depthMatch[1]) : "";
  if (length && depth && height) return `${length} x ${depth} x ${height} mm`;
  if (length && depth) return `${length} x ${depth} mm`;
  return "";
}

function bindPhotoOpen(container) {
  const openButton = container.querySelector("[data-open-photo-viewer]");
  if (!openButton) return;
  openButton.addEventListener("click", () => {
    const selectedUrls = getSelectedPhotoUrls(container);
    const urls = selectedUrls.length ? selectedUrls : [getCurrentPhotoUrl(container)].filter(Boolean);
    openPhotoSelectionForLongPress(urls);
  });
}

function getSelectedPhotoUrls(container) {
  return [...container.querySelectorAll(".photo-thumb.is-selected")]
    .map((button) => button.dataset.photoSrc)
    .filter(Boolean)
    .map(toAbsoluteUrl);
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

function showCopyFallback(text, title = "ÃƒÂ¥Ã‚Â¤Ã‚ÂÃƒÂ¥Ã‹â€ Ã‚Â¶") {
  const existing = document.querySelector(".copy-fallback");
  if (existing) existing.remove();
  const overlay = document.createElement("div");
  overlay.className = "copy-fallback";
  overlay.innerHTML = `
    <div class="copy-fallback-panel">
      <div class="copy-fallback-heading">
        <strong>${title}</strong>
        <button type="button" data-close-copy-fallback>ÃƒÂ¥Ã¢â‚¬Â¦Ã‚Â³ÃƒÂ©Ã¢â‚¬â€Ã‚Â­</button>
      </div>
      <p>ÃƒÂ¨Ã¢â‚¬Â¡Ã‚ÂªÃƒÂ¥Ã…Â Ã‚Â¨ÃƒÂ¥Ã‚Â¤Ã‚ÂÃƒÂ¥Ã‹â€ Ã‚Â¶ÃƒÂ¨Ã‚Â¢Ã‚Â«ÃƒÂ§Ã‚Â³Ã‚Â»ÃƒÂ§Ã‚Â»Ã…Â¸ÃƒÂ¦Ã¢â‚¬Â¹Ã‚Â¦ÃƒÂ¦Ã‹â€ Ã‚ÂªÃƒÂ¯Ã‚Â¼Ã…â€™ÃƒÂ¨Ã‚Â¯Ã‚Â·ÃƒÂ©Ã¢â‚¬Â¢Ã‚Â¿ÃƒÂ¦Ã…â€™Ã¢â‚¬Â°ÃƒÂ¤Ã‚Â¸Ã¢â‚¬Â¹ÃƒÂ©Ã‚ÂÃ‚Â¢ÃƒÂ¥Ã¢â‚¬Â Ã¢â‚¬Â¦ÃƒÂ¥Ã‚Â®Ã‚Â¹ÃƒÂ¥Ã‚Â¤Ã‚ÂÃƒÂ¥Ã‹â€ Ã‚Â¶ÃƒÂ£Ã¢â€šÂ¬Ã¢â‚¬Å¡</p>
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
  openRawPhotoForLongPress(src);
}

function openRawPhotoForLongPress(src) {
  if (!src) return;
  savePhotoViewerReturnState();
  const returnUrl = encodeURIComponent(window.location.href);
  window.location.href = `${photoViewerPath}?src=${encodeURIComponent(toAbsoluteUrl(src))}&return=${returnUrl}`;
}

function openPhotoSelectionForLongPress(urls) {
  const absoluteUrls = urls.map(toAbsoluteUrl).filter(Boolean);
  if (!absoluteUrls.length) return;
  savePhotoViewerReturnState();
  const returnUrl = encodeURIComponent(window.location.href);
  const url = absoluteUrls.length === 1
    ? `${photoViewerPath}?src=${encodeURIComponent(absoluteUrls[0])}&return=${returnUrl}`
    : `${photoViewerPath}?srcs=${encodeURIComponent(JSON.stringify(absoluteUrls))}&return=${returnUrl}`;
  window.location.href = url;
}

function savePhotoViewerReturnState() {
  try {
    const state = {
      activeCatalogKey,
      searchQuery: searchInput?.value || "",
      builderSearch: builderSearchInput?.value || "",
      seriesValue: seriesSelect?.value || "",
      recommendationValue: recommendSelect?.value || "",
      selectedRecommendationCounts,
      selectedWidthFilter,
      selectedTypeFilters: [...selectedTypeFilters],
      selectedDiningTurntableId,
      pieceMaterialSelections,
      materialValue: materialSelect?.value || "",
      slotSelections: [...document.querySelectorAll(".slot-select")].map((select) => select.value || "")
    };
    sessionStorage.setItem(viewerReturnStateStorageKey, JSON.stringify(state));
  } catch {}
}

function restorePhotoViewerReturnState() {
  let state = null;
  try {
    state = JSON.parse(sessionStorage.getItem(viewerReturnStateStorageKey) || "null");
    sessionStorage.removeItem(viewerReturnStateStorageKey);
  } catch {
    sessionStorage.removeItem(viewerReturnStateStorageKey);
    return;
  }
  if (!state || typeof state !== "object") return;

  const catalogChanged = state.activeCatalogKey && catalogDefinitions[state.activeCatalogKey] && state.activeCatalogKey !== activeCatalogKey;
  if (catalogChanged) {
    activeCatalogKey = state.activeCatalogKey;
  }
  syncActiveCatalog();
  if (catalogChanged) {
    render();
    initBuilder();
  }

  if (searchInput) searchInput.value = state.searchQuery || "";
  if (builderSearchInput) builderSearchInput.value = state.builderSearch || "";
  selectedWidthFilter = Number(state.selectedWidthFilter || 0);
  selectedTypeFilters.clear();
  (Array.isArray(state.selectedTypeFilters) ? state.selectedTypeFilters : []).forEach((value) => {
    if (value) selectedTypeFilters.add(value);
  });
  selectedDiningTurntableId = state.selectedDiningTurntableId || "";
  pieceMaterialSelections = state.pieceMaterialSelections && typeof state.pieceMaterialSelections === "object"
    ? state.pieceMaterialSelections
    : {};
  syncFilterButtons();

  const seriesValue = String(state.seriesValue || "");
  const hasSeriesOption = seriesValue && Array.from(seriesSelect?.options || []).some((option) => option.value === seriesValue);
  if (hasSeriesOption) {
    seriesSelect.value = seriesValue;
    seriesSelect.dispatchEvent(new Event("change", { bubbles: true }));
  } else {
    populateBuilderPieces(1);
  }

  clearSelectedRecommendationCounts();
  const savedCounts = state.selectedRecommendationCounts && typeof state.selectedRecommendationCounts === "object"
    ? Object.entries(state.selectedRecommendationCounts).filter(([, count]) => Number(count) > 0)
    : [];
  savedCounts.forEach(([comboId, count]) => {
    selectedRecommendationCounts[String(comboId)] = Number(count);
  });
  if (recommendSelect) {
    recommendSelect.value = String(state.recommendationValue || savedCounts[0]?.[0] || "");
  }
  if (materialSelect && state.materialValue != null) {
    materialSelect.value = String(state.materialValue);
  }

  const slotSelections = Array.isArray(state.slotSelections) ? state.slotSelections.filter(Boolean) : [];
  if (slotSelections.length) {
    setBuilderSelections(slotSelections);
  } else {
    populateBuilderPieces(1);
  }
  syncBuilderControlsVisibility();
  renderSetPreview();
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
  const isSlant = /-B\b|ÃƒÂ¦Ã¢â‚¬â€œÃ…â€œÃƒÂ¤Ã‚Â½Ã‚Â|ÃƒÂ¦Ã¢â‚¬â€œÃ…â€œÃƒÂ¥Ã‚Â½Ã‚Â¢/i.test(combo.configuration || "");
  const nameLabel = isSlant ? `${combo.name} (ÃƒÂ¦Ã¢â‚¬â€œÃ…â€œÃƒÂ¥Ã‚Â½Ã‚Â¢)` : combo.name;
  return `${nameLabel} \u00b7 ${pieceCount}\u4ef6 - ${formatZolanoUnitConfig(combo.configuration)}${sizeText ? ` | \u5c3a\u5bf8 ${sizeText}` : ""}`;
}

function getRecommendationDimensionText(combo) {
  if (!combo?.dimensions || combo.dimensions === combo.configuration) {
    const width = getComboWidthValue(combo);
    return width ? `${width}mm` : "";
  }
  return combo.dimensions;
}

function formatComboSummary(combo, selected, purchases = []) {
  if (purchases.length > 1) return `已选 ${purchases.length} 组组合`;
  if (purchases.length === 1 && purchases[0]?.combo) {
    const purchaseCombo = purchases[0].combo;
    return `${getComboPieceCount(purchaseCombo)}件:${formatZolanoUnitConfig(purchaseCombo.configuration)}`;
  }
  if (combo) return `${getComboPieceCount(combo)}\u4ef6:${formatZolanoUnitConfig(combo.configuration)}`;
  if (activeCatalogKey === "diningTable") return `\u5df2\u9009 ${selected.length} \u5957`;
  return `\u5df2\u9009 ${selected.length} \u4ef6`;
}

function getComboPieceCount(combo) {
  if (activeCatalogKey === "zolano" && combo && !isGeneratedZolanoCombo(combo)) {
    return getZolanoRecommendationPieceCount(combo);
  }
  return Number(combo?.pieceCount || 0) || getComboPartCodes(combo).length || 1;
}

function getZolanoRecommendationPieceCount(combo) {
  if (combo?.partCodes?.length) return combo.partCodes.length;
  if (combo?.series === "ZL 3817 MELFE") {
    const config = String(combo?.configuration || "").toUpperCase();
    if (config === "FULL SET" || config === "1EL/T + 2ER") return 2;
  }
  const config = String(combo?.configuration || "");
  if (!config.includes("+")) return 1;
  return config.split("+").map((part) => part.trim()).filter(Boolean).length || 1;
}

function getDisplayedPieceCount(selectedRecommendation, selected) {
  if (activeCatalogKey === "diningTable" && !selectedRecommendation) {
    return selected.reduce((sum, item) => sum + getDiningPackageItems(item).length, 0) || selected.length;
  }
  if (!selectedRecommendation) return selected.length;
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

  const zolano2897Dimension = getZolano2897LShapeDimension(selected);
  if (zolano2897Dimension) return zolano2897Dimension;
  const zolano2628Dimension = getZolano2628LShapeDimension(selected);
  if (zolano2628Dimension) return zolano2628Dimension;
  const zolano3776Dimension = getZolano3776LShapeDimension(selected);
  if (zolano3776Dimension) return zolano3776Dimension;

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

function getZolano2897LShapeDimension(selected) {
  const layoutItems = selected.filter((item) =>
    String(item?.series || "").replace(/\s+/g, "").toUpperCase() === "ZL2897"
    && Number(item?.width || 0) > 0
    && Number(item?.depth || 0) > 0
    && Number(item?.height || 0) > 0
  );
  if (layoutItems.length < 2) return "";

  const cornerIndex = layoutItems.findIndex((item) =>
    /CNR|CORNER|ÃƒÂ¨Ã‚Â½Ã‚Â¬ÃƒÂ¨Ã‚Â§Ã¢â‚¬â„¢/i.test(`${item.configuration || ""} ${item.description || ""}`)
  );
  if (cornerIndex < 0) return "";

  const corner = layoutItems[cornerIndex];
  const sideA = layoutItems
    .slice(0, cornerIndex + 1)
    .reduce((sum, item) => sum + Number(item.width || 0), 0);
  const sideB = Number(corner.depth || corner.width || 0) + layoutItems
    .slice(cornerIndex + 1)
    .reduce((sum, item) => sum + Number(item.width || 0), 0);
  const height = Math.max(...layoutItems.map((item) => Number(item.height || 0)));
  return sideA && sideB && height ? `${sideA} x ${sideB} x ${height} mm` : "";
}

function getZolano2628LShapeDimension(selected) {
  const layoutItems = selected.filter((item) => {
    const series = String(item?.series || "").toUpperCase();
    const config = String(item?.configuration || "").toUpperCase();
    return /2628/.test(series)
      && !/STOOL|PILLOW/.test(config)
      && getZolano2628ModuleWidth(item) > 0;
  });
  if (layoutItems.length < 2) return "";

  const cornerIndex = layoutItems.findIndex((item) =>
    /CNR|CORNER|\u8f6c\u89d2/i.test(`${item.configuration || ""} ${item.description || ""}`)
  );
  if (cornerIndex < 0) return "";

  const corner = layoutItems[cornerIndex];
  const sideA = layoutItems
    .slice(0, cornerIndex + 1)
    .reduce((sum, item) => sum + getZolano2628ModuleWidth(item), 0);
  const sideB = getZolano2628ModuleDepth(corner) + layoutItems
    .slice(cornerIndex + 1)
    .reduce((sum, item) => sum + getZolano2628ModuleWidth(item), 0);
  const depth = Math.max(...layoutItems.map(getZolano2628ModuleDepth).filter(Boolean));
  const suffix = depth ? ` | \u6df1 ${depth}mm` : "";
  return sideA && sideB ? `L\u5f62\u7ec4\u5408\uff1a\u5de6\u8fb9 ${sideA}mm / \u53f3\u8fb9 ${sideB}mm${suffix}` : "";
}

function getZolano3776LShapeDimension(selected) {
  const layoutItems = selected.filter((item) => {
    const series = String(item?.series || "").replace(/\s+/g, "").toUpperCase();
    const config = String(item?.configuration || "").toUpperCase();
    return series === "ZL3776"
      && !/TABLE|STOOL|PILLOW/.test(config)
      && !isZolanoAddOnItem(item);
  });
  if (layoutItems.length < 2) return "";

  const cornerIndex = layoutItems.findIndex((item) =>
    /CORNER|\u8f6c\u89d2/i.test(`${item.configuration || ""} ${item.description || ""}`)
  );
  if (cornerIndex < 0) return "";

  const corner = layoutItems[cornerIndex];
  const sideA = layoutItems
    .slice(0, cornerIndex + 1)
    .reduce((sum, item) => sum + getZolano3776ModuleWidth(item), 0);
  const sideB = getZolano3776ModuleDepth(corner) + layoutItems
    .slice(cornerIndex + 1)
    .reduce((sum, item) => sum + getZolano3776ModuleWidth(item), 0);
  const depth = Math.max(...layoutItems.map(getZolano3776ModuleDepth).filter(Boolean));
  const height = Math.max(...layoutItems.map((item) => getDimensionNumber(item, "H") || Number(item.height || 0) || 890));
  const suffix = depth ? ` | \u6df1 ${depth}mm` : "";
  return sideA && sideB && height ? `L\u5f62\u7ec4\u5408\uff1a\u5de6\u8fb9 ${sideA}mm / \u53f3\u8fb9 ${sideB}mm${suffix} | \u9ad8 ${height}mm` : "";
}

function getZolano2628ModuleWidth(item) {
  const config = String(item?.configuration || "").toUpperCase();
  if (/2EL/.test(config)) return 1520;
  if (/CORNER|CNR/.test(config)) return 1320;
  if (/2NA/.test(config)) return 1220;
  if (/1ER\/?T/.test(config)) return 910;
  if (/1NA/.test(config)) return 610;
  const match = String(item?.dimensions || "").match(/\bL\s*(\d{3,5})/i);
  return match ? Number(match[1]) : Number(item?.width || 0);
}

function getZolano2628ModuleDepth(item) {
  const config = String(item?.configuration || "").toUpperCase();
  if (/CORNER|CNR/.test(config)) return 1320;
  const match = String(item?.dimensions || "").match(/\bD\s*(\d{3,5})/i);
  return match ? Number(match[1]) : Number(item?.depth || 0) || 0;
}

function getZolano3776ModuleWidth(item) {
  const pair = getZolanoItemWidthPair(item);
  if (pair.close || pair.open) return pair.close || pair.open;
  const match = String(item?.dimensions || "").match(/\bL\s*(\d{3,5})/i);
  return match ? Number(match[1]) : Number(item?.width || 0);
}

function getZolano3776ModuleDepth(item) {
  const depth = getDimensionNumber(item, "D");
  if (depth) return depth;
  const match = String(item?.dimensions || "").match(/\bD\s*(\d{3,5})(?:\/(\d{3,5}))?/i);
  return match ? Number(match[2] || match[1]) : Number(item?.depth || 0);
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
  if (item?.priceIsFinal) {
    const matchingIndex = Array.isArray(item.materials)
      ? item.materials.findIndex((label) => String(label).toUpperCase() === selectedMaterial.toUpperCase())
      : -1;
    const priceIndex = matchingIndex >= 0 ? matchingIndex : index;
    return Number(item.priceOptions?.[priceIndex] || item.price || 0);
  }
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
  if (/ÃƒÂ¤Ã‚Â¸Ã¢â€šÂ¬ÃƒÂ§Ã‚Â­Ã¢â‚¬Â°ÃƒÂ§Ã‚ÂºÃ‚Â§/.test(text)) return "ÃƒÂ¤Ã‚Â¸Ã¢â€šÂ¬ÃƒÂ§Ã‚Â­Ã¢â‚¬Â°ÃƒÂ§Ã‚ÂºÃ‚Â§";
  if (/ÃƒÂ¤Ã‚ÂºÃ…â€™ÃƒÂ§Ã‚Â­Ã¢â‚¬Â°ÃƒÂ§Ã‚ÂºÃ‚Â§/.test(text)) return "ÃƒÂ¤Ã‚ÂºÃ…â€™ÃƒÂ§Ã‚Â­Ã¢â‚¬Â°ÃƒÂ§Ã‚ÂºÃ‚Â§";
  if (/ÃƒÂ¤Ã‚Â¸Ã¢â‚¬Â°ÃƒÂ§Ã‚Â­Ã¢â‚¬Â°ÃƒÂ§Ã‚ÂºÃ‚Â§/.test(text)) return "ÃƒÂ¤Ã‚Â¸Ã¢â‚¬Â°ÃƒÂ§Ã‚Â­Ã¢â‚¬Â°ÃƒÂ§Ã‚ÂºÃ‚Â§";
  return "";
}

function extractDiningStoneNames(text) {
  const normalized = String(text || "").replace(/\s+/g, " ");
  const match = normalized.match(/[ÃƒÂ¤Ã‚Â¸Ã¢â€šÂ¬ÃƒÂ¤Ã‚ÂºÃ…â€™ÃƒÂ¤Ã‚Â¸Ã¢â‚¬Â°]ÃƒÂ§Ã‚Â­Ã¢â‚¬Â°ÃƒÂ§Ã‚ÂºÃ‚Â§[::]\s*([^ÃƒÂ¦Ã‚Â¡Ã¢â‚¬Â ÃƒÂ¥Ã‚ÂºÃ¢â‚¬Â¢ÃƒÂ¨Ã¢â‚¬Å¾Ã…Â¡]+)/);
  if (!match) return "";
  return match[1].replace(/[ÃƒÂ£Ã¢â€šÂ¬Ã¢â‚¬Å¡;;]+$/g, "").trim();
}

function isDiningMaterialGradeLabel(label) {
  return Boolean(getDiningMaterialGradeKey(label));
}

/*
function getDiningMaterialGradeLabelOld(item) {
  const text = getCatalogText(item);
  if (/ÃƒÂ¤Ã‚Â¸Ã¢â€šÂ¬ÃƒÂ§Ã‚Â­Ã¢â‚¬Â°ÃƒÂ§Ã‚ÂºÃ‚Â§/.test(text)) return "ÃƒÂ¤Ã‚Â¸Ã¢â€šÂ¬ÃƒÂ§Ã‚Â­Ã¢â‚¬Â°ÃƒÂ§Ã‚ÂºÃ‚Â§";
  if (/ÃƒÂ¤Ã‚ÂºÃ…â€™ÃƒÂ§Ã‚Â­Ã¢â‚¬Â°ÃƒÂ§Ã‚ÂºÃ‚Â§/.test(text)) return "ÃƒÂ¤Ã‚ÂºÃ…â€™ÃƒÂ§Ã‚Â­Ã¢â‚¬Â°ÃƒÂ§Ã‚ÂºÃ‚Â§";
  if (/ÃƒÂ¤Ã‚Â¸Ã¢â‚¬Â°ÃƒÂ§Ã‚Â­Ã¢â‚¬Â°ÃƒÂ§Ã‚ÂºÃ‚Â§/.test(text)) return "ÃƒÂ¤Ã‚Â¸Ã¢â‚¬Â°ÃƒÂ§Ã‚Â­Ã¢â‚¬Â°ÃƒÂ§Ã‚ÂºÃ‚Â§";
  return "";
}

*/

function formatMaterialDisplayLabel(label) {
  const text = String(label || "").trim();
  if (isSinglePriceMaterialLabel(text)) return "\u4ef7\u683c";
  return text;
}

function isSinglePriceMaterialLabels(labels = []) {
  return labels.length <= 1 || (labels.length === 1 && isSinglePriceMaterialLabel(labels[0]));
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
  return text.includes("CB") || text.includes("ÃƒÂ¦Ã¢â‚¬â€Ã‚Â ÃƒÂ¦Ã¢â‚¬Â°Ã‚Â¶ÃƒÂ¦Ã¢â‚¬Â°Ã¢â‚¬Â¹") || text.includes("CENTER");
}

function isRightPiece(item) {
  const text = `${item.configuration} ${item.description}`.toUpperCase();
  return text.includes("PR") || text.includes("AFR") || text.includes("CSAR") || text.includes("ÃƒÂ¥Ã‚ÂÃ‚Â³");
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
  if (!confirm("ÃƒÂ§Ã‚Â¡Ã‚Â®ÃƒÂ¥Ã‚Â®Ã…Â¡ÃƒÂ¨Ã‚Â¦Ã‚ÂÃƒÂ¥Ã‹â€ Ã‚Â ÃƒÂ©Ã¢â€žÂ¢Ã‚Â¤ÃƒÂ¨Ã‚Â¿Ã¢â€žÂ¢ÃƒÂ¤Ã‚Â¸Ã‚ÂªÃƒÂ¦Ã‚Â²Ã¢â€žÂ¢ÃƒÂ¥Ã‚ÂÃ¢â‚¬ËœÃƒÂ¥Ã‚ÂÃ¢â‚¬â€?")) return;
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
  image.alt = "ÃƒÂ¥Ã‚Â·Ã‚Â²ÃƒÂ©Ã¢â€šÂ¬Ã¢â‚¬Â°ÃƒÂ¦Ã‚Â²Ã¢â€žÂ¢ÃƒÂ¥Ã‚ÂÃ¢â‚¬ËœÃƒÂ¥Ã¢â‚¬ÂºÃ‚Â¾ÃƒÂ§Ã¢â‚¬Â°Ã¢â‚¬Â¡";
  photoPreview.innerHTML = "";
  photoPreview.append(image);
}

function loadSofas() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey)) || [];
    const cleaned = saved.filter((sofa) => (sofa.brand || "").toLowerCase() !== "zolano" || isVisibleZolanoSeries(sofa));
    if (cleaned.length !== saved.length) {
      localStorage.setItem(storageKey, JSON.stringify(cleaned));
    }
    return cleaned;
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
    if (zolanoQuickPhotoOverrides.has(candidate)) return zolanoQuickPhotoOverrides.get(candidate);
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
  const nikatorSeriesPhoto = getNikatorSeriesPrimaryPhoto(item);
  if (isCombinationItem(item)) {
    return overrides[item.series] || getCombinationPhoto(item) || item.originalPhoto || item.photo || getDiningFamilyPhoto(item) || placeholderImage();
  }
  return overrides[item.series] || nikatorSeriesPhoto || item.originalPhoto || item.photo || getDiningFamilyPhoto(item) || placeholderImage();
}

function getNikatorSeriesPrimaryPhoto(item) {
  if (activeCatalogKey !== "nikator" || !item?.series) return "";
  if (!isNikatorModuleSeries(item.series)) return "";
  const id = String(item.id || "");
  const model = String(item.model || "");
  const isSeriesCard = !id.includes("-") || id === item.series || model === item.series;
  if (!isSeriesCard) return "";
  return getSeriesGalleryPhotos(item.series)[0] || "";
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
  const gallery = window.BAIDU_PHOTO_GALLERY || {};
  const photos = gallery[combo.series] || [];
  if (!photos.length) return combo.photo || "";
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




















