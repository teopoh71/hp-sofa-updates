(function applyZolanoVisualOverrides() {
  const catalog = window.BAIDU_ZOLANO_SOFA_DATA;
  const combos = window.BAIDU_ZOLANO_RECOMMENDED_COMBOS;
  if (!Array.isArray(catalog) || !Array.isArray(combos)) return;

  const priceFactor = 11.06060606060606;
  const materials = ["PVC", "M/F", "A/C", "C/S", "F/L", "F/SA"];
  const sourcePrefix2800 = "EXPORT 2020 (ZL2800).xls#2700!";
  const itemPhotoMap = window.BAIDU_INDIVIDUAL_ITEM_PHOTOS || (window.BAIDU_INDIVIDUAL_ITEM_PHOTOS = {});

  const seriesStripPhotos = {
    "ZL 2868 LAOREST": "assets/generated/zolano/line-strips/ZL2868LAOREST-strip.png",
    "ZL 2707 KANDER": "assets/generated/zolano/line-strips/ZL2707KANDER-strip.png",
    "ZL 2807": "assets/generated/zolano/line-strips/ZL2807-strip.png",
    "ZL 2802 TARZ": "assets/generated/zolano/line-strips/ZL2802TARZ-strip.png",
    "ZL 3753 (4.2)": "assets/generated/zolano/line-strips/ZL375342-strip.png",
    "ZL 2672 VICE": "assets/generated/zolano/line-strips/ZL2672VICE-strip.png",
    "ZL 2897": "assets/generated/zolano/line-strips/ZL2897-strip.png",
    "ZL 2831": "assets/generated/zolano/line-strips/ZL2831-strip.png",
    "ZL 3778": "assets/generated/zolano/line-strips/ZL3778-strip.png",
    "ZL 3817 MELFE": "assets/generated/zolano/line-strips/ZL3817MELFE-strip.png",
    "ZL 3776": "assets/generated/zolano/line-strips/ZL3776-strip.png",
    "ZL 2911": "assets/generated/zolano/line-strips/ZL2911-strip.png",
    "MONTIERI ZL 2628": "assets/generated/zolano/line-strips/MONTIERIZL2628-strip.png"
  };

  Object.entries(seriesStripPhotos).forEach(([seriesKey, src]) => {
    itemPhotoMap[seriesKey] = src;
  });

  itemPhotoMap["ZL3817MELFE1ELEXPORT2020ZL33002SHEET1544"] = "assets/generated/zolano/parts/ZL3817MELFE-1ELT-top.png";
  itemPhotoMap["ZL3817MELFE1NAEXPORT2020ZL33002SHEET1545"] = "assets/generated/zolano/parts/ZL3817MELFE-2ER-top.png";
  itemPhotoMap["ZL28971ELEXPORT2020ZL28002700497"] = "assets/generated/zolano/parts/ZL2897-1EL-top.png";
  itemPhotoMap["ZL28971NAEXPORT2020ZL28002700499"] = "assets/generated/zolano/parts/ZL2897-1NA-top.png";
  itemPhotoMap["ZL2897CORNEREXPORT2020ZL28002700498"] = "assets/generated/zolano/parts/ZL2897-CNR-top.png";
  itemPhotoMap["ZL3776-1NA"] = "assets/generated/zolano/parts/ZL3776-line-1NA.png";
  itemPhotoMap["ZL3776-1NALONG"] = "assets/generated/zolano/parts/ZL3776-line-1NA-LONG.png";
  itemPhotoMap["ZL3776-1NALONGDEPANTAMBAH6INCH"] = "assets/generated/zolano/parts/ZL3776-line-1NA-LONG.png";
  itemPhotoMap["ZL3776-1NAT"] = "assets/generated/zolano/parts/ZL3776-line-1NAT.png";
  itemPhotoMap["ZL3776-CORNER"] = "assets/generated/zolano/parts/ZL3776-line-CORNER.png";
  itemPhotoMap["ZL3776-STOOL"] = "assets/generated/zolano/parts/ZL3776-line-STOOL.png";
  itemPhotoMap["ZL3776-STOOLMODIFIED94X70CM"] = "assets/generated/zolano/parts/ZL3776-line-STOOL.png";
  itemPhotoMap["ZL3776-TABLE"] = "assets/generated/zolano/parts/ZL3776-line-TABLE.png";
  itemPhotoMap["ZL3776-ARM"] = "assets/generated/zolano/parts/ZL3776-line-ARM.png";

  function replaceSeries({ series, model, photo, sourcePrefix, rows, comboRows, materialsOverride, priceFactorOverride, priceIsFinal }) {
    for (let index = catalog.length - 1; index >= 0; index -= 1) {
      if (catalog[index]?.series === series) catalog.splice(index, 1);
    }
    for (let index = combos.length - 1; index >= 0; index -= 1) {
      if (combos[index]?.series === series) combos.splice(index, 1);
    }

    const effectiveMaterials = Array.isArray(materialsOverride) && materialsOverride.length ? materialsOverride : materials;
    const effectivePriceFactor = Number.isFinite(priceFactorOverride) ? priceFactorOverride : priceFactor;
    rows.forEach((row) => {
      const id = row.id;
      const dimensions = row.dimensions || `L: ${row.width}mm | H: ${row.height}mm | D: ${row.depth}mm`;
      catalog.push({
        id,
        brand: "Zolano",
        series,
        model,
        configuration: row.key,
        description: row.description || "",
        dimensions,
        width: row.width,
        depth: row.depth,
        height: row.height,
        price: row.priceOptions[0],
        priceFactor: row.priceIsFinal ?? priceIsFinal ? 1 : effectivePriceFactor,
        priceOptions: row.priceOptions,
        materials: row.materials || effectiveMaterials,
        priceIsFinal: Boolean(row.priceIsFinal ?? priceIsFinal),
        photo: row.photo || photo,
        source: `${sourcePrefix}${row.sourceRow}`
      });
      itemPhotoMap[id] = row.piecePhoto || itemPhotoMap[series] || photo;
    });

    comboRows.forEach((row) => {
      const dimensions = row.dimensions || `L: ${row.width}mm | H: ${row.height}mm | D: ${row.depth}mm`;
      combos.push({
        id: row.id,
        brand: "Zolano",
        series,
        name: model,
        configuration: row.key,
        description: row.description || "",
        dimensions,
        width: row.width,
        depth: row.depth,
        height: row.height,
        partCodes: row.partCodes,
        pieceCount: row.pieceCount,
        price: row.priceOptions[0],
        priceFactor: row.priceIsFinal ?? priceIsFinal ? 1 : effectivePriceFactor,
        priceOptions: row.priceOptions,
        materials: row.materials || effectiveMaterials,
        priceIsFinal: Boolean(row.priceIsFinal ?? priceIsFinal),
        photo: row.photo || photo,
        source: `${sourcePrefix}${row.sourceRow}`
      });
    });
  }

  replaceSeries({
    series: "MONTIERI ZL 2628",
    model: "MONTIERI ZL 2628",
    photo: "assets/generated/zolano/MONTIERIZL2628.jpg",
    sourcePrefix: "EXPORT 2020 (ZL2600).xls#2661-!",
    materialsOverride: ["M/F", "F/SA", "NuBuck"],
    priceFactorOverride: 1,
    priceIsFinal: true,
    rows: [
      {
        id: "MONTIERIZL26282ELEXPORT2020ZL26002661124",
        key: "2EL",
        sourceRow: 124,
        width: 1520,
        depth: 0,
        height: 0,
        priceOptions: [11800, 17300, 19659],
        piecePhoto: "assets/generated/zolano/parts/MONTIERIZL2628-1ELT-top.png"
      },
      {
        id: "MONTIERIZL2628CORNEREXPORT2020ZL26002661125",
        key: "Corner",
        sourceRow: 125,
        width: 1320,
        depth: 1320,
        height: 0,
        priceOptions: [8300, 13300, 15114],
        piecePhoto: "assets/generated/zolano/parts/MONTIERIZL2628-CORNER-top.png"
      },
      {
        id: "MONTIERIZL26282NAEXPORT2020ZL26002661126",
        key: "2NA",
        sourceRow: 126,
        width: 1220,
        depth: 0,
        height: 0,
        priceOptions: [8600, 13200, 15000],
        piecePhoto: "assets/generated/zolano/parts/MONTIERIZL2628-2NA-top.png"
      },
      {
        id: "MONTIERIZL26281ERTEXPORT2020ZL26002661127",
        key: "1ER/T",
        sourceRow: 127,
        width: 910,
        depth: 0,
        height: 0,
        priceOptions: [9600, 14000, 15909],
        piecePhoto: "assets/generated/zolano/parts/MONTIERIZL2628-2ER-top.png"
      },
      {
        id: "MONTIERIZL26281NAEXPORT2020ZL26002661128",
        key: "1NA",
        sourceRow: 128,
        width: 610,
        depth: 0,
        height: 0,
        priceOptions: [4800, 7300, 8295],
        piecePhoto: "assets/generated/zolano/parts/MONTIERIZL2628-1NA-top.png"
      },
      {
        id: "MONTIERIZL26281ELEXPORT2020ZL26002661129",
        key: "1EL",
        sourceRow: 129,
        width: 0,
        depth: 0,
        height: 0,
        priceOptions: [7700, 11300, 12841]
      },
      {
        id: "MONTIERIZL26281ELTD2400MMEXPORT2020ZL26002661130",
        key: "1EL/T (D:2400MM)",
        sourceRow: 130,
        width: 0,
        depth: 2400,
        height: 0,
        priceOptions: [16000, 22000, 25000]
      },
      {
        id: "MONTIERIZL2628STOOL25X43CMOEXPORT2020ZL26002661131",
        key: "STOOL 25X43CM (O)",
        sourceRow: 131,
        width: 250,
        depth: 430,
        height: 0,
        priceOptions: [1300, 1477]
      }
    ],
    comboRows: [
      {
        id: "MONTIERIZL26282ELEXPORT2020ZL26002661124",
        key: "2EL",
        sourceRow: 124,
        width: 1520,
        depth: 0,
        height: 0,
        priceOptions: [11800, 17300, 19659],
        partCodes: ["MONTIERIZL26282ELEXPORT2020ZL26002661124"],
        pieceCount: 1
      },
      {
        id: "MONTIERIZL2628CORNEREXPORT2020ZL26002661125",
        key: "Corner",
        sourceRow: 125,
        width: 1320,
        depth: 1320,
        height: 0,
        priceOptions: [8300, 13300, 15114],
        partCodes: ["MONTIERIZL2628CORNEREXPORT2020ZL26002661125"],
        pieceCount: 1
      },
      {
        id: "MONTIERIZL26282NAEXPORT2020ZL26002661126",
        key: "2NA",
        sourceRow: 126,
        width: 1220,
        depth: 0,
        height: 0,
        priceOptions: [8600, 13200, 15000],
        partCodes: ["MONTIERIZL26282NAEXPORT2020ZL26002661126"],
        pieceCount: 1
      },
      {
        id: "MONTIERIZL26281ERTEXPORT2020ZL26002661127",
        key: "1ER/T",
        sourceRow: 127,
        width: 910,
        depth: 0,
        height: 0,
        priceOptions: [9600, 14000, 15909],
        partCodes: ["MONTIERIZL26281ERTEXPORT2020ZL26002661127"],
        pieceCount: 1
      },
      {
        id: "MONTIERIZL26281NAEXPORT2020ZL26002661128",
        key: "1NA",
        sourceRow: 128,
        width: 610,
        depth: 0,
        height: 0,
        priceOptions: [4800, 7300, 8295],
        partCodes: ["MONTIERIZL26281NAEXPORT2020ZL26002661128"],
        pieceCount: 1
      },
      {
        id: "MONTIERIZL26281ELEXPORT2020ZL26002661129",
        key: "1EL",
        sourceRow: 129,
        width: 0,
        depth: 0,
        height: 0,
        priceOptions: [7700, 11300, 12841],
        partCodes: ["MONTIERIZL26281ELEXPORT2020ZL26002661129"],
        pieceCount: 1
      },
      {
        id: "MONTIERIZL26281ELTD2400MMEXPORT2020ZL26002661130",
        key: "1EL/T (D:2400MM)",
        sourceRow: 130,
        width: 0,
        depth: 2400,
        height: 0,
        priceOptions: [16000, 22000, 25000],
        partCodes: ["MONTIERIZL26281ELTD2400MMEXPORT2020ZL26002661130"],
        pieceCount: 1
      },
      {
        id: "MONTIERIZL26282ELC2NA1ERTEXPORT2020ZL26002661123",
        key: "2EL+C+2NA+1NA+1ER/T",
        sourceRow: 123,
        width: 3450,
        depth: 1320,
        height: 0,
        dimensions: "L型: 左 3450mm / 右 2840mm | 深 1320mm",
        layoutType: "l-shape",
        priceOptions: [43100, 65100, 73977],
        partCodes: [
          "MONTIERIZL26282ELEXPORT2020ZL26002661124",
          "MONTIERIZL2628CORNEREXPORT2020ZL26002661125",
          "MONTIERIZL26282NAEXPORT2020ZL26002661126",
          "MONTIERIZL26281NAEXPORT2020ZL26002661128",
          "MONTIERIZL26281ERTEXPORT2020ZL26002661127"
        ],
        pieceCount: 5
      },
      {
        id: "MONTIERIZL2628STOOL25X43CMOEXPORT2020ZL26002661131",
        key: "STOOL 25X43CM (O)",
        sourceRow: 131,
        width: 250,
        depth: 430,
        height: 0,
        priceOptions: [1300, 1477],
        partCodes: ["MONTIERIZL2628STOOL25X43CMOEXPORT2020ZL26002661131"],
        pieceCount: 1
      }
    ]
  });

  replaceSeries({
    series: "ZL 2831",
    model: "ZL 2831",
    photo: "assets/generated/zolano/ZL2831.jpg",
    sourcePrefix: sourcePrefix2800,
    rows: [
      {
        id: "ZL2831VISUAL1S",
        key: "1S",
        description: "LECCIO",
        sourceRow: 217,
        width: 1250,
        depth: 890,
        height: 730,
        priceOptions: [246, 279, 320, 373, 396, 449],
        piecePhoto: "assets/generated/zolano/parts/ZL2831-1S.png"
      },
      {
        id: "ZL2831VISUAL2S",
        key: "2S",
        description: "LECCIO",
        sourceRow: 216,
        width: 1820,
        depth: 890,
        height: 730,
        priceOptions: [357, 406, 466, 543, 577, 655],
        piecePhoto: "assets/generated/zolano/parts/ZL2831-2S.png"
      },
      {
        id: "ZL2831VISUAL3S",
        key: "3S",
        description: "LECCIO",
        sourceRow: 215,
        width: 2320,
        depth: 890,
        height: 730,
        priceOptions: [464, 526, 604, 704, 748, 849],
        piecePhoto: "assets/generated/zolano/parts/ZL2831-3S.png"
      },
      {
        id: "ZL2831VISUAL4S",
        key: "4S",
        description: "LECCIO",
        sourceRow: 218,
        width: 2740,
        depth: 890,
        height: 730,
        priceOptions: [490, 561, 649, 803, 875, 1002],
        piecePhoto: "assets/generated/zolano/parts/ZL2831-4S.png"
      }
    ],
    comboRows: [
      {
        id: "AUTO-ZOLANO-2831-1S",
        key: "1S",
        description: "LECCIO",
        sourceRow: 217,
        width: 1250,
        depth: 890,
        height: 730,
        priceOptions: [246, 279, 320, 373, 396, 449],
        partCodes: ["ZL2831VISUAL1S"],
        pieceCount: 1
      },
      {
        id: "AUTO-ZOLANO-2831-2S",
        key: "2S",
        description: "LECCIO",
        sourceRow: 216,
        width: 1820,
        depth: 890,
        height: 730,
        priceOptions: [357, 406, 466, 543, 577, 655],
        partCodes: ["ZL2831VISUAL2S"],
        pieceCount: 1
      },
      {
        id: "AUTO-ZOLANO-2831-3S",
        key: "3S",
        description: "LECCIO",
        sourceRow: 215,
        width: 2320,
        depth: 890,
        height: 730,
        priceOptions: [464, 526, 604, 704, 748, 849],
        partCodes: ["ZL2831VISUAL3S"],
        pieceCount: 1
      },
      {
        id: "AUTO-ZOLANO-2831-4S",
        key: "4S",
        description: "LECCIO",
        sourceRow: 218,
        width: 2740,
        depth: 890,
        height: 730,
        priceOptions: [490, 561, 649, 803, 875, 1002],
        partCodes: ["ZL2831VISUAL4S"],
        pieceCount: 1
      }
    ]
  });

  replaceSeries({
    series: "ZL 2897",
    model: "ZL 2897",
    photo: "assets/generated/zolano/ZL2897.jpg",
    sourcePrefix: sourcePrefix2800,
    rows: [
      {
        id: "ZL28971ELEXPORT2020ZL28002700497",
        key: "1EL/1ER",
        sourceRow: 497,
        width: 1130,
        depth: 1000,
        height: 875,
        description: "1EL/1ER FLEUR",
        dimensions: "L1130mm | D1000mm | H875mm | seat 390mm",
        priceOptions: [191, 213, 241, 332, 332, 341]
      },
      {
        id: "ZL28971NAEXPORT2020ZL28002700499",
        key: "1NA",
        sourceRow: 499,
        width: 860,
        depth: 1000,
        height: 875,
        description: "1NA FLEUR",
        dimensions: "L860mm | D1000mm | H875mm | seat 390mm",
        priceOptions: [158, 173, 191, 261, 270, 276]
      },
      {
        id: "ZL2897CORNEREXPORT2020ZL28002700498",
        key: "CNR",
        sourceRow: 498,
        width: 1220,
        depth: 1220,
        height: 875,
        description: "CNR FLEUR",
        dimensions: "1220 x 1220mm | H875mm | seat 390mm",
        priceOptions: [230, 260, 297, 388, 427, 440]
      },
      {
        id: "ZL2897PILLOWEXPORT2020ZL28002700502",
        key: "PILLOW",
        sourceRow: 502,
        width: 0,
        depth: 0,
        height: 0,
        description: "Pillow / 抱枕",
        dimensions: "配件",
        priceOptions: [24, 31]
      }
    ],
    comboRows: [
      {
        id: "ZL28971ELEXPORT2020ZL28002700497",
        key: "1EL/1ER",
        sourceRow: 497,
        width: 1130,
        depth: 1000,
        height: 875,
        description: "1EL/1ER",
        dimensions: "L1130mm | D1000mm | H875mm | seat 390mm",
        priceOptions: [191, 213, 241, 332, 332, 341],
        piecePhoto: "assets/generated/zolano/parts/ZL2897-1EL-top.png",
        partCodes: ["ZL28971ELEXPORT2020ZL28002700497"],
        pieceCount: 1
      },
      {
        id: "ZL28971NAEXPORT2020ZL28002700499",
        key: "1NA",
        sourceRow: 499,
        width: 860,
        depth: 1000,
        height: 875,
        description: "1NA",
        dimensions: "L860mm | D1000mm | H875mm | seat 390mm",
        priceOptions: [158, 173, 191, 261, 270, 276],
        piecePhoto: "assets/generated/zolano/parts/ZL2897-1NA-top.png",
        partCodes: ["ZL28971NAEXPORT2020ZL28002700499"],
        pieceCount: 1
      },
      {
        id: "ZL2897CORNEREXPORT2020ZL28002700498",
        key: "CNR",
        sourceRow: 498,
        width: 1220,
        depth: 1220,
        height: 875,
        description: "CNR",
        dimensions: "1220 x 1220mm | H875mm | seat 390mm",
        priceOptions: [230, 260, 297, 388, 427, 440],
        piecePhoto: "assets/generated/zolano/parts/ZL2897-CNR-top.png",
        partCodes: ["ZL2897CORNEREXPORT2020ZL28002700498"],
        pieceCount: 1
      },
      {
        id: "ZL2897FULLSETVISUAL",
        key: "1EL + 1NA + 1NA + CNR + 1NA + 1ER + PILLOW + PILLOW",
        sourceRow: 497,
        width: 4070,
        depth: 3210,
        height: 875,
        description: "图片整套 FLEUR - 展厅组合，含2抱枕",
        dimensions: "4070 x 3210 x 875 mm",
        priceOptions: [1134, 1267, 1352, 1835, 1901, 1950],
        photo: "assets/generated/zolano/ZL2897-showroom-set.jpg",
        partCodes: [
          "ZL28971ELEXPORT2020ZL28002700497",
          "ZL28971NAEXPORT2020ZL28002700499",
          "ZL28971NAEXPORT2020ZL28002700499",
          "ZL2897CORNEREXPORT2020ZL28002700498",
          "ZL28971NAEXPORT2020ZL28002700499",
          "ZL28971ELEXPORT2020ZL28002700497",
          "ZL2897PILLOWEXPORT2020ZL28002700502",
          "ZL2897PILLOWEXPORT2020ZL28002700502"
        ],
        pieceCount: 8
      },
      {
        id: "ZL2897PILLOWEXPORT2020ZL28002700502",
        key: "PILLOW",
        sourceRow: 502,
        width: 0,
        depth: 0,
        height: 0,
        description: "Pillow / 抱枕",
        dimensions: "配件",
        priceOptions: [24, 31],
        partCodes: ["ZL2897PILLOWEXPORT2020ZL28002700502"],
        pieceCount: 1
      }
    ]
  });

  replaceSeries({
    series: "ZL 2807",
    model: "ZL 2807",
    photo: "assets/generated/zolano/ZL2807.jpg",
    sourcePrefix: sourcePrefix2800,
    rows: [
      {
        id: "ZL28071SEXPORT2020ZL2800270047",
        key: "1S",
        sourceRow: 47,
        width: 1070,
        depth: 690,
        height: 0,
        priceOptions: [162, 182, 207, 285, 300, 327]
      },
      {
        id: "ZL28072SEXPORT2020ZL2800270046",
        key: "2S",
        sourceRow: 46,
        width: 1680,
        depth: 690,
        height: 0,
        priceOptions: [254, 285, 325, 448, 471, 512]
      },
      {
        id: "ZL28073SEXPORT2020ZL2800270045",
        key: "3S",
        sourceRow: 45,
        width: 2070,
        depth: 690,
        height: 0,
        priceOptions: [312, 351, 400, 552, 580, 632]
      }
    ],
    comboRows: [
      {
        id: "ZL28071SEXPORT2020ZL2800270047",
        key: "1S",
        sourceRow: 47,
        width: 1070,
        depth: 690,
        height: 0,
        priceOptions: [162, 182, 207, 285, 300, 327],
        partCodes: ["ZL28071SEXPORT2020ZL2800270047"],
        pieceCount: 1
      },
      {
        id: "ZL28072SEXPORT2020ZL2800270046",
        key: "2S",
        sourceRow: 46,
        width: 1680,
        depth: 690,
        height: 0,
        priceOptions: [254, 285, 325, 448, 471, 512],
        partCodes: ["ZL28072SEXPORT2020ZL2800270046"],
        pieceCount: 1
      },
      {
        id: "ZL28073SEXPORT2020ZL2800270045",
        key: "3S",
        sourceRow: 45,
        width: 2070,
        depth: 690,
        height: 0,
        priceOptions: [312, 351, 400, 552, 580, 632],
        partCodes: ["ZL28073SEXPORT2020ZL2800270045"],
        pieceCount: 1
      },
      {
        id: "ZL28072EL1ER23MEXPORT2020ZL2800270050",
        key: "2EL+1ER (2.3M)",
        sourceRow: 50,
        width: 2300,
        depth: 690,
        height: 0,
        priceOptions: [350, 390, 445, 612, 643, 702],
        partCodes: ["ZL28072EL1ER23MEXPORT2020ZL2800270050"],
        pieceCount: 2
      },
      {
        id: "ZL28072EL1ER29MEXPORT2020ZL2800270049",
        key: "2EL+1ER (2.9M)",
        sourceRow: 49,
        width: 2900,
        depth: 690,
        height: 0,
        priceOptions: [470, 528, 602, 828, 869, 948],
        partCodes: ["ZL28072EL1ER29MEXPORT2020ZL2800270049"],
        pieceCount: 2
      },
      {
        id: "ZL28072EL1ER32MEXPORT2020ZL2800270048",
        key: "2EL+1ER (3.2M)",
        sourceRow: 48,
        width: 3200,
        depth: 690,
        height: 0,
        priceOptions: [515, 580, 660, 915, 958, 1040],
        partCodes: ["ZL28072EL1ER32MEXPORT2020ZL2800270048"],
        pieceCount: 2
      },
      {
        id: "ZL28072EL1NA2ER35MSEATSIZE61CMEXPORT2020ZL2800270052",
        key: "2EL+1NA+2ER (3.5M)",
        sourceRow: 52,
        width: 3500,
        depth: 690,
        height: 0,
        priceOptions: [597, 670, 770, 1056, 1109, 1210],
        partCodes: ["ZL28072EL1NA2ER35MSEATSIZE61CMEXPORT2020ZL2800270052"],
        pieceCount: 3
      },
      {
        id: "ZL28072EL2ER37CMFOLLOW3SSEATSIZEEXPORT2020ZL2800270051",
        key: "2EL+2ER (3.7M)",
        sourceRow: 51,
        width: 3700,
        depth: 690,
        height: 0,
        priceOptions: [597, 670, 770, 1056, 1109, 1210],
        partCodes: ["ZL28072EL2ER37CMFOLLOW3SSEATSIZEEXPORT2020ZL2800270051"],
        pieceCount: 2
      }
    ]
  });
}());


