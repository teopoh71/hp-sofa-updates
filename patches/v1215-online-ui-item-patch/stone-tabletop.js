(function () {
  "use strict";

  const catalog = Array.isArray(window.STONE_TABLETOP_CATALOG)
    ? window.STONE_TABLETOP_CATALOG
    : [];
  if (!catalog.length) return;

  let selected = catalog[0];
  let panel;

  function createPanel() {
    const builder = document.querySelector(".builder-panel");
    if (!builder || document.getElementById("stoneTabletopPanel")) return;

    panel = document.createElement("section");
    panel.id = "stoneTabletopPanel";
    panel.className = "stone-tabletop-panel";
    panel.hidden = true;
    panel.innerHTML = `
      <div class="stone-heading-row">
        <div>
          <h2>奢石台面</h2>
          <p>选择石材后输入台面尺寸</p>
        </div>
        <label class="stone-search">
          <span>搜索</span>
          <input id="stoneSearchInput" type="search" placeholder="输入石材名称" autocomplete="off">
        </label>
      </div>
      <div class="stone-calculator" aria-label="台面价格计算">
        <div class="stone-selected-summary">
          <strong id="stoneSelectedName"></strong>
        </div>
        <div class="stone-input-grid">
          <label>长 (米)<input id="stoneLength" type="number" min="0.1" max="9" step="0.01" value="1.35" inputmode="decimal"></label>
          <label>宽 (米)<input id="stoneWidth" type="number" min="0.1" max="9" step="0.01" value="1.35" inputmode="decimal"></label>
          <label>数量<input id="stoneQuantity" type="number" min="1" max="99" step="1" value="1" inputmode="numeric"></label>
        </div>
        <div class="stone-size-presets" aria-label="常用尺寸">
          <button type="button" data-stone-size="1.35,1.35">1.35 × 1.35</button>
          <button type="button" data-stone-size="1.6,0.9">1.60 × 0.90</button>
          <button type="button" data-stone-size="1.8,0.9">1.80 × 0.90</button>
        </div>
        <div class="stone-result">
          <div><span>面积</span><strong id="stoneArea"></strong></div>
          <p id="stoneWarning" hidden>长度超过 2.2 米，需另行确认</p>
        </div>
      </div>
      <div class="stone-count-row"><strong>石材款式</strong><span>${catalog.length} 款</span></div>
      <div id="stoneCatalogGrid" class="stone-catalog-grid"></div>
    `;
    const versionBadge = builder.querySelector(".app-version-badge");
    if (versionBadge) versionBadge.after(panel);
    else builder.append(panel);

    panel.querySelector("#stoneSearchInput").addEventListener("input", renderCatalog);
    ["stoneLength", "stoneWidth", "stoneQuantity"].forEach((id) => {
      panel.querySelector(`#${id}`).addEventListener("input", updateResult);
    });
    panel.querySelectorAll("[data-stone-size]").forEach((button) => {
      button.addEventListener("click", () => {
        const [length, width] = button.dataset.stoneSize.split(",");
        panel.querySelector("#stoneLength").value = length;
        panel.querySelector("#stoneWidth").value = width;
        updateResult();
      });
    });
    renderCatalog();
    updateResult();
  }

  function renderCatalog() {
    if (!panel) return;
    const query = panel.querySelector("#stoneSearchInput").value.trim().toLowerCase();
    const grid = panel.querySelector("#stoneCatalogGrid");
    const items = catalog.filter((item) => item.name.toLowerCase().includes(query));
    grid.replaceChildren(...items.map(createCard));
  }

  function createCard(item) {
    const card = document.createElement("article");
    card.className = `stone-product-card${item.id === selected.id ? " is-selected" : ""}`;
    card.dataset.stoneId = item.id;
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", item.name);

    const image = document.createElement("img");
    image.src = item.image;
    image.alt = item.name;
    image.loading = "lazy";
    image.decoding = "async";
    card.append(image);

    const zoom = document.createElement("button");
    zoom.type = "button";
    zoom.className = "stone-zoom-button";
    zoom.textContent = "放大";
    zoom.setAttribute("aria-label", `放大 ${item.name}`);
    zoom.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openStonePhoto(item);
    });
    card.append(zoom);

    const name = document.createElement("strong");
    name.textContent = item.name;
    card.append(name);

    const selectCard = () => {
      selected = item;
      panel.querySelectorAll(".stone-product-card").forEach((card) => {
        card.classList.toggle("is-selected", card.dataset.stoneId === item.id);
      });
      updateResult();
      panel.querySelector(".stone-calculator").scrollIntoView({ behavior: "smooth", block: "nearest" });
    };
    card.addEventListener("click", selectCard);
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      selectCard();
    });
    return card;
  }

  function openStonePhoto(item) {
    const source = item.fullImage || item.image;
    const absolute = new URL(source, window.location.href).href;
    if (window.HPPhotoGallery?.open) {
      window.HPPhotoGallery.open({ photos: [absolute], startSrc: absolute });
    } else {
      window.open(absolute, "_blank", "noopener");
    }
  }

  function positiveNumber(id, fallback) {
    const value = Number(panel.querySelector(`#${id}`).value);
    return Number.isFinite(value) && value > 0 ? value : fallback;
  }

  function updateResult() {
    if (!panel || !selected) return;
    const length = positiveNumber("stoneLength", 0);
    const width = positiveNumber("stoneWidth", 0);
    const quantity = Math.max(1, Math.floor(positiveNumber("stoneQuantity", 1)));
    const area = length * width * quantity;
    const needsQuote = Math.max(length, width) > 2.2;

    panel.querySelector("#stoneSelectedName").textContent = selected.name;
    panel.querySelector("#stoneArea").textContent = `${area.toFixed(3)} ㎡`;
    panel.querySelector("#stoneWarning").hidden = !needsQuote;
  }

  function setStoneMode(enabled) {
    createPanel();
    if (!panel) return;
    const shell = document.querySelector(".app-shell");
    const builder = document.querySelector(".builder-panel");
    document.body.classList.toggle("stone-tabletop-mode", enabled);
    panel.hidden = !enabled;
    Array.from(shell.children).forEach((child) => {
      if (child === builder || child.classList.contains("top-panel")) return;
      if (enabled) {
        if (!child.hasAttribute("data-stone-previous-hidden")) {
          child.setAttribute("data-stone-previous-hidden", child.hidden ? "1" : "0");
        }
        child.hidden = true;
      } else if (child.hasAttribute("data-stone-previous-hidden")) {
        child.hidden = child.getAttribute("data-stone-previous-hidden") === "1";
        child.removeAttribute("data-stone-previous-hidden");
      }
    });
    if (builder) {
      if (enabled) {
        if (!builder.hasAttribute("data-stone-previous-hidden")) {
          builder.setAttribute("data-stone-previous-hidden", builder.hidden ? "1" : "0");
        }
        builder.hidden = false;
      } else if (builder.hasAttribute("data-stone-previous-hidden")) {
        builder.hidden = builder.getAttribute("data-stone-previous-hidden") === "1";
        builder.removeAttribute("data-stone-previous-hidden");
      }
      Array.from(builder.children).forEach((child) => {
        const keep = child === panel
          || child.classList.contains("section-title")
          || child.classList.contains("catalog-switch")
          || child.classList.contains("app-version-badge");
        if (keep) return;
        if (enabled) {
          if (!child.hasAttribute("data-stone-previous-hidden")) {
            child.setAttribute("data-stone-previous-hidden", child.hidden ? "1" : "0");
          }
          child.hidden = true;
        } else if (child.hasAttribute("data-stone-previous-hidden")) {
          child.hidden = child.getAttribute("data-stone-previous-hidden") === "1";
          child.removeAttribute("data-stone-previous-hidden");
        }
      });
    }
    if (enabled) window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function initialize() {
    createPanel();
    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-brand-switch]");
      if (!button) return;
      queueMicrotask(() => setStoneMode(button.dataset.brandSwitch === "stoneTabletop"));
    });
    const active = document.querySelector('[data-brand-switch="stoneTabletop"].is-active');
    setStoneMode(Boolean(active));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
