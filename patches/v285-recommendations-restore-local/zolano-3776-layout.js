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
    return `L形组合：左边 ${layout.left}mm / 右边 ${layout.right}mm | 深 ${layout.depth}mm | 高 ${layout.height}mm`;
  }

  return {
    extendZolano3776Layout,
    formatZolano3776LayoutDimension
  };
});


