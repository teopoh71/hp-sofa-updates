(() => {
  const catalog = window.SILVER_STAR_CATALOG;
  const grid = document.querySelector("#productGrid");
  const chips = document.querySelector("#categoryChips");
  const search = document.querySelector("#searchInput");
  const count = document.querySelector("#resultCount");
  const empty = document.querySelector("#emptyState");
  const dialog = document.querySelector("#detailDialog");
  const detail = document.querySelector("#detailContent");
  let category = "all";
  const money = value => `RM ${Number(value).toLocaleString("en-MY", { maximumFractionDigits: 0 })}`;
  const escape = value => String(value ?? "").replace(/[&<>\"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

  [{name:"全部",slug:"all"}, ...catalog.categories].forEach(item => {
    const button = document.createElement("button");
    button.className = `chip${item.slug === "all" ? " active" : ""}`;
    button.textContent = item.name;
    button.dataset.category = item.slug;
    button.addEventListener("click", () => { category = item.slug; document.querySelectorAll(".chip").forEach(el => el.classList.toggle("active", el === button)); render(); });
    chips.append(button);
  });

  function searchable(product) { return [product.title, product.category, ...product.models, ...product.variants.flatMap(v => [v.label,v.size,v.material,v.notes])].join(" ").toLowerCase(); }
  function render() {
    const query = search.value.trim().toLowerCase();
    const products = catalog.products.filter(p => (category === "all" || p.categorySlug === category) && (!query || searchable(p).includes(query)));
    count.textContent = products.length.toLocaleString();
    empty.hidden = products.length > 0;
    grid.innerHTML = products.map(p => `<button class="card" data-id="${p.id}"><img src="${p.image}" alt="${escape(p.title)}" loading="lazy"><div class="card-body"><span class="category">${escape(p.category)}</span><span class="page">P.${p.page}</span><h2>${escape(p.title)}</h2>${p.sellingPrice ? `<div class="price">${money(p.sellingPrice)}${p.variants.length > 1 ? " 起" : ""}</div>` : '<div class="pending">报价待确认</div>'}</div></button>`).join("");
  }

  grid.addEventListener("click", event => {
    const card = event.target.closest(".card"); if (!card) return;
    const p = catalog.products.find(item => item.id === card.dataset.id); if (!p) return;
    const variants = p.variants.length ? p.variants.map(v => `<div class="variant"><strong>${escape(v.label)}</strong>${v.size ? `<p>尺寸：${escape(v.size)}</p>` : ""}${v.material ? `<p>材质 / 颜色：${escape(v.material)}</p>` : ""}<div class="variant-price">${v.sellingPrices.map(money).join(" / ")}</div>${v.notes ? `<p>备注：${escape(v.notes)}</p>` : ""}</div>`).join("") : '<div class="variant"><p>报价表内暂未找到完全相同型号，请人工确认售价。</p></div>';
    detail.innerHTML = `<img class="detail-image" src="${p.image}" alt="${escape(p.title)}"><div class="detail-body"><span class="detail-category">${escape(p.category)} · 图册第 ${p.page} 页</span><h2>${escape(p.title)}</h2><div class="detail-price">${p.sellingPrice ? money(p.sellingPrice) + (p.variants.length > 1 ? " 起" : "") : "报价待确认"}<span class="multiplier">原报价 × 3</span></div>${variants}</div>`;
    dialog.showModal();
  });
  dialog.querySelector(".close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
  search.addEventListener("input", render);
  render();
})();
