(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.HP_ZOLANO_3776_LAYOUT = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function () {
  function extendZolano3776Layout(base, extension) {
    return {
      left: Number(base.left || 0) + Number(extension?.leftAdd || 0),
      right: Number(base.right || 0) + Number(extension?.rightAdd || 0),
      depth: base.depth,
      height: base.height
    };
  }

  function formatZolano3776LayoutDimension(layout) {
    return `Lå½¢ç»„åˆï¼šå·¦è¾¹ ${layout.left}mm / å³è¾¹ ${layout.right}mm | æ·± ${layout.depth}mm | é«˜ ${layout.height}mm`;
  }

  return {
    extendZolano3776Layout,
    formatZolano3776LayoutDimension
  };
});



