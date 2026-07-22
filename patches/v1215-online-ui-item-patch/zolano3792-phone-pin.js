(function pinZolano3792OnPhone() {
  const series = "ZL 3792";
  const jump = "zolano|ZL 3792";
  const photo = "assets/generated/zolano/ZL3792.jpg";
  const modules = [
    ["ZL3792-1ER", "1ER", "1ER 1260mm", [9100, 14043, 14477.32, 15100]],
    ["ZL3792-1ERT", "1ER/T", "1ER/T 1260mm", [11300, 17391, 17928.87, 18700]],
    ["ZL3792-1NA", "1NA", "1NA 980mm", [7800, 11997, 12368.04, 12900]],
    ["ZL3792-1NAB", "1NAB", "1NAB 1450mm", [11400, 15624, 16107.22, 16800]],
    ["ZL3792-1NAT", "1NAT", "1NAT 1310mm", [8200, 13485, 13902.06, 14500]],
    ["ZL3792-TABLE", "TABLE", "TABLE 570mm", [2800, 4371, 4506.19, 4700]]
  ];

  function itemFromModule(module) {
    return {
      id: module[0],
      brand: "Zolano",
      series,
      model: series,
      name: series,
      configuration: module[1],
      description: module[2],
      dimensions: module[2],
      materials: ["M/F", "F/SA", "Oil", "N.b/N.p"],
      priceOptions: module[3],
      price: module[3][0],
      priceFactor: 1,
      priceIsFinal: true,
      source: "v1105-zolano3792-persistent-pin",
      photo
    };
  }

  function upsertData() {
    window.BAIDU_ZOLANO_SOFA_DATA = Array.isArray(window.BAIDU_ZOLANO_SOFA_DATA) ? window.BAIDU_ZOLANO_SOFA_DATA : [];
    modules.slice().reverse().forEach((module) => {
      const existing = window.BAIDU_ZOLANO_SOFA_DATA.find((item) =>
        String(item?.series || "") === series &&
        String(item?.configuration || "").toUpperCase() === module[1].toUpperCase()
      );
      if (existing) Object.assign(existing, itemFromModule(module));
      else window.BAIDU_ZOLANO_SOFA_DATA.unshift(itemFromModule(module));
    });
  }

  function ensureOption(select, value, text) {
    if (!select || [...select.options].some((option) => option.value === value)) return;
    const option = document.createElement("option");
    option.value = value;
    option.textContent = text;
    const empty = select.options[0]?.value === "" ? select.options[0].nextSibling : select.firstChild;
    select.insertBefore(option, empty || select.firstChild);
  }

  function ensureDropdowns() {
    ensureOption(document.querySelector("#seriesSelect"), series, series);
    ensureOption(document.querySelector("#modelJumpSelect"), series, series);
    document.querySelectorAll("#slotGrid .slot-select").forEach((select) => {
      modules.forEach((module) => ensureOption(select, module[0], `${module[1]} - ${module[2]}`));
    });
  }

  function isZolanoActive() {
    const active = String(document.body?.dataset?.activeCatalog || "").toLowerCase();
    const selected = document.querySelector('[data-brand-switch="zolano"]')?.classList.contains("is-active");
    return active === "zolano" || selected;
  }

  function makeButton() {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quick-jump-button";
    button.dataset.quickJump = jump;
    const image = document.createElement("img");
    image.src = photo;
    image.alt = "";
    image.loading = "eager";
    image.decoding = "async";
    const label = document.createElement("span");
    label.textContent = "3792";
    button.append(image, label);
    return button;
  }

  function open3792() {
    upsertData();
    ensureDropdowns();
    if (typeof window.jumpToSeries === "function") {
      window.jumpToSeries("zolano", series);
      setTimeout(ensureDropdowns, 80);
      return;
    }
    const seriesSelect = document.querySelector("#seriesSelect");
    if (seriesSelect) {
      seriesSelect.value = series;
      seriesSelect.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  function ensureButton() {
    if (!isZolanoActive()) return;
    const group = document.querySelector('[data-quick-jump-group="zolano"]');
    if (!group) return;
    const page = group.querySelector(".quick-jump-page") || group;
    let button = group.querySelector(`[data-quick-jump="${jump}"]`);
    if (!button) {
      button = makeButton();
      page.prepend(button);
    } else if (button.parentElement !== page || page.firstElementChild !== button) {
      page.prepend(button);
    }
    button.hidden = false;
    button.style.display = "";
    let label = button.querySelector("span");
    if (!label) {
      label = document.createElement("span");
      button.append(label);
    }
    label.textContent = "3792";
    let image = button.querySelector("img");
    if (!image) {
      image = document.createElement("img");
      button.prepend(image);
    }
    if (image.getAttribute("src") !== photo) image.src = photo;
    if (!button.dataset.zl3792HardPin) {
      button.dataset.zl3792HardPin = "1";
      button.addEventListener("click", open3792);
    }
  }

  function repair() {
    if (!isZolanoActive()) return;
    document.body?.setAttribute("data-zl3792-pin", "v1105");
    upsertData();
    ensureButton();
    ensureDropdowns();
  }

  window.HP_FORCE_ZOLANO_3792 = repair;
  window.addEventListener("DOMContentLoaded", repair);
  window.addEventListener("load", repair);
  document.addEventListener("click", (event) => {
    if (event.target?.closest?.('[data-brand-switch="zolano"]')) {
      setTimeout(repair, 50);
      setTimeout(repair, 300);
    }
  });
  [100, 500, 1200, 2500, 5000].forEach((delay) => setTimeout(repair, delay));
  const timer = setInterval(repair, 1000);
  setTimeout(() => clearInterval(timer), 30000);
}());
