(function applyZolano2868SellingPriceOverride() {
  const series = "ZL 2868 LAOREST";
  const materials = ["M/F", "F/SA", "NuBuck"];
  const source = "ZOLANO retail price list.xlsx#Sheet1!73:80";
  const photo = "assets/generated/zolano/ZL2868LAOREST.jpg";
  const finalRows = [
    ["1EL+1ER", "1EL+1ER", "2.9m", "收扶手 2870mm / 开扶手 3500mm | 深 1435mm | 高 915mm", [20100, 28600, 32500], ["1EL", "1ER"]],
    ["2S", "2S", "2.05m", "收扶手 2055mm / 开扶手 2690mm | 深 1170mm | 高 915mm", [13800, 20500, 23295.4545454545], ["2S"]],
    ["1S", "1S", "1.45m", "收扶手 1450mm / 开扶手 2080mm | 深 1170mm | 高 915mm", [9800, 14400, 16363.6363636364], ["1S"]],
    ["1EL+1ER-2570", "1EL+1ER", "2.57m", "收扶手 2570mm | 深 1435mm | 高 915mm", [18800, 26800, 30454.5454545455], ["1EL", "1ER"]],
    ["1EL+1NA+1ER-3460", "1EL+1NA+1ER", "3460mm", "收扶手 3460mm | 深 1435mm | 高 915mm", [27000, 38000, 43181.8181818182], ["1EL", "1NA", "1ER"]],
    ["1EL+1NA+1ER-3890", "1EL+1NA+1ER", "3890mm", "收扶手 3890mm / 开扶手 4520mm | 深 1435mm | 高 915mm", [29000, 41200, 46818.1818181818], ["1EL", "1NA", "1ER"]],
    ["PILLOW", "PILLOW", "", "配件", [0, 1500, 1704.54545454545], ["PILLOW"]]
  ];

  function markFinal(row, priceOptions, extra = {}) {
    if (!row) return null;
    Object.assign(row, {
      materials,
      priceOptions,
      price: priceOptions[0] || 0,
      priceFactor: 1,
      priceIsFinal: true,
      source,
      photo
    }, extra);
    return row;
  }

  const catalog = window.BAIDU_ZOLANO_SOFA_DATA;
  if (Array.isArray(catalog)) {
    const byConfig = new Map(
      catalog.filter((row) => row.series === series).map((row) => [row.configuration, row])
    );
    for (const [, config, label, dimensions, priceOptions] of finalRows) {
      if (config.includes("+")) continue;
      markFinal(byConfig.get(config), priceOptions, { dimensions, finalPriceLabel: label });
    }
    for (const config of ["1EL", "1ER"]) {
      markFinal(byConfig.get(config), [10050, 14300, 16250], {
        dimensions: `${config} 单边参考价，整套以 1EL+1ER 为准`,
        finalPriceLabel: "half of 1EL+1ER"
      });
    }
  }

  const combos = window.BAIDU_ZOLANO_RECOMMENDED_COMBOS;
  if (!Array.isArray(combos)) return;
  for (let index = combos.length - 1; index >= 0; index -= 1) {
    if (combos[index]?.series === series) combos.splice(index, 1);
  }
  for (const [key, config, label, dimensions, priceOptions, parts] of finalRows) {
    combos.push({
      id: `ZL2868SELLING${key.replace(/[^A-Z0-9]/gi, "")}`,
      brand: "Zolano",
      series,
      name: config.includes("+") ? "推荐组合" : "单件",
      configuration: config,
      description: label,
      dimensions,
      partCodes: parts,
      materials,
      priceOptions,
      price: priceOptions[0] || 0,
      priceFactor: 1,
      priceIsFinal: true,
      source,
      photo
    });
  }
}());


