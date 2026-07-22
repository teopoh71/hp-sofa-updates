(() => {
  const source = "GAINBED verified selling-price catalog";
  const materialLabels = ["\u7eaf\u76ae", "\u534a\u76ae", "\u5e03\u6216\u73af\u4fdd\u76ae"];
  const verifiedRows = [
    ["GC2011", [15840, 9760, 7296]],
    ["GC2012", [16256, 12736, 8064]],
    ["GC2123", [18080, 12320, 10080]],
    ["GC2127", [20736, 13280, 10080]],
    ["GC2130", [26016, 16960, 15616]],
    ["GC2201", [19488, 12864, 8512]],
    ["GC2202", [24416, 13536, 12000]],
    ["GC2206", [15360, 9760, 6720]],
    ["GC2207", [null, 13088, 10624]],
    ["GC2215", [14656, 10080, 7904]],
    ["GC2216", [19040, 12320, 8672]],
    ["GC2218", [13056, null, 8896]],
    ["GC2219", [19200, 13696, 9536]],
    ["GC2220", [19232, 14656, 12672]],
    ["GC2221", [14560, 10464, 8064]],
    ["GC2222", [13280, 10176, 7872]]
  ];

  function makePhotoPath(model) {
    return `assets/generated/gainbed/${model}.png`;
  }

  function makeVerifiedItem([model, values]) {
    const supported = values
      .map((price, index) => ({ label: materialLabels[index], price }))
      .filter((variant) => Number.isFinite(variant.price));
    const price = Math.min(...supported.map((variant) => variant.price));
    const photo = makePhotoPath(model);
    return {
      id: `GAINBED-${model}`,
      brand: "GAINBED",
      catalogFamily: "bed",
      series: model,
      model,
      name: `GAINBED ${model}`,
      configuration: "\u5957\u5e8a",
      description: `GAINBED ${model} \u5957\u5e8a`,
      details: `${model} GAINBED \u5957\u5e8a`,
      dimensions: "",
      materials: supported.map((variant) => variant.label),
      priceOptions: supported.map((variant) => variant.price),
      price,
      priceLabel: `\u552e\u4ef7\u4ece \u00a5${price.toLocaleString("en-US")}`,
      priceIsFinal: true,
      priceFactor: 1,
      photo,
      gallery: [photo],
      source
    };
  }

  function makeInquiryItem(model) {
    const photo = makePhotoPath(model);
    return {
      id: `GAINBED-${model}`,
      brand: "GAINBED",
      catalogFamily: "bed",
      series: model,
      model,
      name: `GAINBED ${model}`,
      configuration: "\u5957\u5e8a",
      description: `GAINBED ${model} \u5957\u5e8a`,
      details: `${model} GAINBED \u5957\u5e8a`,
      dimensions: "",
      materials: [],
      priceOptions: [],
      price: null,
      priceLabel: "\u8be2\u4ef7 / Contact for price",
      priceIsFinal: true,
      priceFactor: 1,
      photo,
      gallery: [photo],
      source
    };
  }

  window.GAINBED_CATALOG_DATA = [
    ...verifiedRows.map(makeVerifiedItem),
    makeInquiryItem("GC2208"),
    makeInquiryItem("XWC012")
  ];
})();
