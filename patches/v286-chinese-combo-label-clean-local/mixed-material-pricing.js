(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.HP_MIXED_MATERIAL_PRICING = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function () {
  function getPieceMaterialIndex(selections, slotIndex, defaultIndex) {
    const value = Number(selections?.[slotIndex]);
    return Number.isFinite(value) && value >= 0 ? value : defaultIndex;
  }

  function normalizePieceMaterialSelections(selections, pieceCount, defaultIndex) {
    const normalized = {};
    for (let index = 0; index < pieceCount; index += 1) {
      normalized[index] = getPieceMaterialIndex(selections, index, defaultIndex);
    }
    return normalized;
  }

  function getMixedMaterialTotal(pieces, selections, defaultIndex, getPrice) {
    return pieces.reduce((sum, item, index) => {
      const materialIndex = getPieceMaterialIndex(selections, index, defaultIndex);
      return sum + Number(getPrice(item, materialIndex) || 0);
    }, 0);
  }

  return {
    getPieceMaterialIndex,
    getMixedMaterialTotal,
    normalizePieceMaterialSelections
  };
});


