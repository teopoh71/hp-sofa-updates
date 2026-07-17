(() => {
  // work/hp-sofa-updates-accounting-sparse/accounting/src/accounting-core.mjs?v=v18-contract-0000379-complete-20260717
  function parseMoney(value) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    const cleaned = String(value ?? "").replace(/[¥￥,\s]/g, "").match(/-?\d+(\.\d+)?/);
    return cleaned ? Number(cleaned[0]) : 0;
  }
  function roundMoney(value) {
    return Math.round((Number(value) || 0) * 100) / 100;
  }
  function profitStatus(value) {
    const amount = Number(value) || 0;
    if (amount > 0) return { label: "\u51C0\u8D5A", className: "earn" };
    if (amount < 0) return { label: "\u51C0\u4E8F", className: "lose" };
    return { label: "\u6301\u5E73", className: "even" };
  }
  function sumInvoiceBalances(invoices) {
    return roundMoney((invoices || []).reduce((total, row) => total + parseMoney(row.balance), 0));
  }
  function applyInvoice(company, invoice) {
    return {
      ...company,
      invoices: [
        ...company.invoices || [],
        {
          id: `inv-${Date.now()}-${Math.random().toString(16).slice(2)}`,
          date: invoice.date || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          vendor: invoice.vendor || "\u672A\u77E5",
          amount: parseMoney(invoice.amount),
          note: invoice.note || "",
          source: "invoice-upload"
        }
      ]
    };
  }
  function availableYears(companies) {
    return [...new Set((companies || []).map((company) => company.year).filter(Boolean))].sort((a, b) => String(b).localeCompare(String(a)));
  }
  function filterCompaniesByYear(companies, year) {
    if (!year) return companies || [];
    return (companies || []).filter((company) => company.year === year);
  }
  function toCsv(rows) {
    const headers = Object.keys(rows[0] || {});
    const escape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
    return [headers.join(","), ...rows.map((row) => headers.map((key) => escape(row[key])).join(","))].join("\n");
  }

  // work/hp-sofa-updates-accounting-sparse/accounting/src/app.js
  var defaultPatchUrl = "https://raw.githubusercontent.com/teopoh71/hp-sofa-updates/main/accounting/patch.json";
  var defaultDataUrl = "https://raw.githubusercontent.com/teopoh71/hp-sofa-updates/main/accounting/data/company-data.json";
  var patch = { versionCode: 18, versionName: "v18-\u5408\u540C0000379\u5B8C\u6574\u8D44\u6599-2026-07-17" };
  var patchCacheName = "accounting-ui-patch-v1";
  var state = { companies: [], activeId: "nikator-2026", activeYear: "2026", activeMonth: 6 };
  var $ = (id) => document.getElementById(id);
  var money = (value) => `\xA5${(Number(value || 0) / 1e4).toFixed(2)}\u4E07`;
  async function init() {
    await registerPatchWorker();
    if ($("invoiceDate")) $("invoiceDate").value = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    const res = await fetch("./data/company-data.json?v=v18-contract-0000379-complete-20260717", { cache: "no-store" });
    state = { ...await res.json(), activeId: "nikator-2026", activeYear: "2026", activeMonth: 6 };
    setPhoneFolds();
    bindEvents();
    render();
  }
  function setPhoneFolds() {
    const compact = window.matchMedia("(max-width: 620px)").matches;
    document.querySelectorAll(".mobile-fold").forEach((fold) => {
      fold.open = !compact;
    });
  }
  function selectedCompanies() {
    return filterCompaniesByYear(state.companies, state.activeYear);
  }
  function activeCompany() {
    const companies = selectedCompanies();
    return companies.find((company) => company.id === state.activeId) || companies[0];
  }
  function render() {
    const years = availableYears(state.companies);
    if (!state.activeYear || !years.includes(state.activeYear)) state.activeYear = years[0] || "";
    let companies = selectedCompanies();
    if (!companies.some((company2) => company2.id === state.activeId)) {
      state.activeId = companies[0]?.id || "";
    }
    $("versionLabel").textContent = patch.versionName;
    $("yearList").innerHTML = years.map((year) => `<button class="${year === state.activeYear ? "selected" : ""}" data-year="${year}">${year}</button>`).join("");
    $("monthList").innerHTML = renderMonthButtons({ includeAll: true });
    $("companyList").innerHTML = companies.map((company2) => {
      const summary = selectedCompanySummary(company2);
      return `<button class="${company2.id === state.activeId ? "selected" : ""}" data-company="${company2.id}">
      <strong>${company2.name}</strong><span>${money(summary.netProfit)}</span>
    </button>`;
    }).join("");
    $("invoiceCompanyTabs").innerHTML = companies.map((company2) => {
      const summary = selectedCompanySummary(company2);
      return `<button class="${company2.id === state.activeId ? "selected" : ""}" data-company="${company2.id}">
      <strong>${company2.name}</strong><span>${formatQuantity(summary.quantity)}</span>
    </button>`;
    }).join("");
    const totals = companies.map(selectedCompanySummary).reduce((acc, item) => {
      for (const key of Object.keys(item)) acc[key] = (acc[key] || 0) + item[key];
      return acc;
    }, {});
    $("totalRevenue").textContent = money(totals.revenue);
    $("totalCost").textContent = money(totals.cost);
    $("totalGross").textContent = money(totals.grossProfit);
    $("totalBalance").textContent = money(totals.outstandingBalance);
    const totalStatus = profitStatus(totals.netProfit || 0);
    $("totalNetLabel").textContent = `\u6263\u5F00\u9500\u540E${totalStatus.label}`;
    $("totalNet").textContent = money(totals.netProfit);
    $("totalNet").className = totalStatus.className;
    $("reportYear").textContent = state.activeMonth ? `${state.activeYear} / ${state.activeMonth}\u6708` : state.activeYear;
    $("reportGrid").innerHTML = companies.map((company2) => {
      const summary = selectedCompanySummary(company2);
      const status = profitStatus(summary.netProfit);
      return `<button class="report-row ${company2.id === state.activeId ? "selected" : ""}" data-company="${company2.id}">
      <strong>${company2.name}</strong>
      <span><b>\u9500\u552E</b>${money(summary.revenue)}</span>
      <span><b>\u6570\u91CF</b>${formatQuantity(summary.quantity)}</span>
      <span><b>\u6210\u672C</b>${money(summary.cost)}</span>
      <span><b>\u79DF\u91D1</b>${money(summary.rent)}</span>
      <span><b>\u5DE5\u8D44</b>${money(summary.salary)}</span>
      <span><b>\u5C3E\u6B3E</b>${money(summary.outstandingBalance)}</span>
      <span class="${status.className}"><b>\u6263\u5F00\u9500\u540E</b>${money(summary.netProfit)}</span>
    </button>`;
    }).join("");
    const company = activeCompany();
    if (!company) return;
    const activeSummary = selectedCompanySummary(company);
    const activeStatus = profitStatus(activeSummary.netProfit);
    $("activeTitle").textContent = company.name;
    $("activeSource").innerHTML = `<strong class="${activeStatus.className}">\u6263\u5F00\u9500\u540E${activeStatus.label}: ${money(activeSummary.netProfit)}</strong>`;
    renderProfitLoss(company);
    $("monthRows").innerHTML = visibleMonthlyRows(company).map((row) => `<tr>
    <td>${row.month}</td><td>${money(row.revenue)}</td><td>${money(row.cost)}</td>
    <td>${money(row.grossProfit)}</td><td>${money(row.expense)}</td><td>${money(row.netProfit)}</td>
  </tr>`).join("");
    const invoiceRows = visibleInvoiceRows(company);
    $("invoiceTitle").textContent = state.activeMonth ? `${company.name} / ${state.activeMonth}\u6708\u8BA2\u5355 (${invoiceRows.length}\u5355)` : `${company.name}\u8BA2\u5355 (${invoiceRows.length}\u5355)`;
    $("invoiceRows").innerHTML = invoiceRows.map((row) => `<tr>
    <td>${row.date}</td><td>${invoiceLabel(row)}</td><td>1\u5355</td><td>${money(row.amount)}</td><td>${money(row.cost || 0)}</td><td>${money(row.balance || 0)}</td>
  </tr>`).join("") || `<tr><td colspan="6">\u6682\u65E0\u8BA2\u5355\u3002</td></tr>`;
  }
  function bindEvents() {
    $("yearList").addEventListener("click", (event) => {
      const button = event.target.closest("[data-year]");
      if (!button) return;
      state.activeYear = button.dataset.year;
      state.activeId = "";
      render();
    });
    $("monthList").addEventListener("click", handleMonthClick);
    $("companyList").addEventListener("click", (event) => {
      const button = event.target.closest("[data-company]");
      if (!button) return;
      state.activeId = button.dataset.company;
      render();
    });
    $("invoiceCompanyTabs").addEventListener("click", (event) => {
      const button = event.target.closest("[data-company]");
      if (!button) return;
      state.activeId = button.dataset.company;
      render();
    });
    $("reportGrid").addEventListener("click", (event) => {
      const button = event.target.closest("[data-company]");
      if (!button) return;
      state.activeId = button.dataset.company;
      render();
    });
    if ($("scanInvoice")) $("scanInvoice").addEventListener("click", scanInvoice);
    if ($("applyInvoice")) $("applyInvoice").addEventListener("click", addInvoice);
    $("exportCsv")?.addEventListener("click", exportCsv);
    $("exportJson")?.addEventListener("click", () => download("accounting-update.json", JSON.stringify(state, null, 2), "application/json"));
    $("exportXlsx")?.addEventListener("click", exportXlsx);
    $("importWorkbook")?.addEventListener("click", () => $("workbookFile")?.click());
    $("workbookFile")?.addEventListener("change", importWorkbook);
    $("checkPatch")?.addEventListener("click", checkPatch);
    $("topPatchButton")?.addEventListener("click", checkPatch);
    $("downloadData")?.addEventListener("click", downloadOnlineData);
    $("uploadData")?.addEventListener("click", uploadOnlineData);
  }
  function visibleMonthlyRows(company) {
    const rows = company.monthly || [];
    const byMonth = new Map(rows.map((row) => [monthNumber(row.month), row]));
    if (state.activeMonth) return [byMonth.get(state.activeMonth) || blankMonthRow(state.activeMonth)];
    const existingMonths = rows.map((row) => monthNumber(row.month)).filter(Boolean);
    const startMonth = Math.min(...existingMonths, 1);
    const now = /* @__PURE__ */ new Date();
    const targetMonth = Number(company.year) === now.getFullYear() ? Math.max(1, now.getMonth()) : Math.max(...existingMonths, 12);
    const endMonth = Math.max(...existingMonths, Math.min(targetMonth, 12));
    const visible = [];
    for (let month = startMonth; month <= endMonth; month += 1) {
      visible.push(byMonth.get(month) || blankMonthRow(month));
    }
    return visible;
  }
  function blankMonthRow(month) {
    return {
      month: `${month}\u6708`,
      revenue: 0,
      cost: 0,
      grossProfit: 0,
      quantity: 0,
      expense: 0,
      netProfit: 0
    };
  }
  function renderMonthButtons({ includeAll }) {
    const buttons = includeAll ? [`<button class="${!state.activeMonth ? "selected" : ""}" data-month="">\u5168\u90E8</button>`] : [];
    return buttons.concat(Array.from({ length: 12 }, (_, index) => {
      const month = index + 1;
      return `<button class="${month === state.activeMonth ? "selected" : ""}" data-month="${month}">${month}\u6708</button>`;
    })).join("");
  }
  function handleMonthClick(event) {
    const button = event.target.closest("[data-month]");
    if (!button) return;
    state.activeMonth = button.dataset.month ? Number(button.dataset.month) : "";
    render();
  }
  function selectedCompanySummary(company) {
    return selectedProfitLoss(company);
  }
  function selectedProfitLoss(company) {
    const quantity = selectedInvoiceRows(company).length;
    const outstandingBalance = sumInvoiceBalances(selectedInvoiceRows(company));
    const summary = visibleMonthlyRows(company).reduce((acc, row) => {
      acc.revenue += Number(row?.revenue || 0);
      acc.cost += Number(row?.cost || 0);
      acc.grossProfit += Number(row?.grossProfit || 0);
      acc.rent += Number(row?.rent || 0);
      acc.salary += Number(row?.salary || 0);
      acc.expense += Number(row?.expense || 0);
      acc.netProfit += Number(row?.netProfit || 0);
      return acc;
    }, { revenue: 0, cost: 0, grossProfit: 0, rent: 0, salary: 0, expense: 0, netProfit: 0, quantity: 0, outstandingBalance: 0 });
    summary.quantity = quantity;
    summary.outstandingBalance = outstandingBalance;
    return summary;
  }
  function renderProfitLoss() {
    $("profitLossCard").innerHTML = "";
  }
  function visibleInvoiceRows(company) {
    return selectedInvoiceRows(company);
  }
  function selectedInvoiceRows(company) {
    const rows = company.invoices || [];
    if (!state.activeMonth) return rows;
    return rows.filter((row) => dateMonthNumber(row.date) === state.activeMonth);
  }
  function formatQuantity(value) {
    return `${Number(value || 0)}\u5355`;
  }
  function invoiceLabel(row) {
    const badges = [
      row.combinedInvoice ? "\u5408\u5355" : "",
      row.displayClearance ? "\u6E05\u6837" : ""
    ].filter(Boolean).map((label) => `<span class="invoice-badge">${label}</span>`).join("");
    return `${row.vendor || ""}${badges}`;
  }
  function monthNumber(value) {
    return Number(String(value || "").match(/\d{1,2}/)?.[0] || 0);
  }
  function dateMonthNumber(value) {
    const match = String(value || "").match(/^\d{4}[-/](\d{1,2})[-/]/);
    return match ? Number(match[1]) : monthNumber(value);
  }
  async function scanInvoice() {
    if (!$("invoiceFile") || !$("invoiceText") || !$("invoiceAmount")) return;
    const file = $("invoiceFile").files[0];
    if (!file) return log("\u8BF7\u5148\u9009\u62E9\u53D1\u7968\u56FE\u7247\u3002");
    log(`Scanning ${file.name}...`);
    let text = "";
    if (file.type.startsWith("image/") && window.Tesseract) {
      const result = await Tesseract.recognize(file, "eng+chi_sim");
      text = result.data.text;
    } else if (file.name.match(/\.(txt|csv)$/i)) {
      text = await file.text();
    } else if (file.name.match(/\.(xlsx|xls)$/i) && window.XLSX) {
      const workbook = XLSX.read(await file.arrayBuffer());
      text = workbook.SheetNames.map((name) => XLSX.utils.sheet_to_csv(workbook.Sheets[name])).join("\n");
    } else {
      text = await file.text().catch(() => "");
    }
    $("invoiceText").value = text.trim();
    const amount = detectAmount(text);
    if (amount) $("invoiceAmount").value = amount;
    log(amount ? `Detected amount ${money(amount)}.` : "Scan finished. Please confirm amount manually.");
  }
  function detectAmount(text) {
    const matches = String(text).match(/-?\d[\d,]*(\.\d{1,2})?/g) || [];
    return matches.map(parseMoney).filter((n) => Math.abs(n) > 0).sort((a, b) => Math.abs(b) - Math.abs(a))[0] || 0;
  }
  function addInvoice() {
    if (!$("invoiceDate") || !$("invoiceAmount") || !$("invoiceVendor") || !$("invoiceNote") || !$("invoiceFile")) return;
    const index = state.companies.findIndex((company) => company.id === state.activeId);
    state.companies[index] = applyInvoice(state.companies[index], {
      date: $("invoiceDate").value,
      amount: $("invoiceAmount").value,
      vendor: $("invoiceVendor").value,
      note: $("invoiceNote").value || $("invoiceFile").files[0]?.name || "\u624B\u52A8\u5F55\u5165"
    });
    log(`\u5DF2\u66F4\u65B0 ${state.companies[index].name}\u3002\u5BFC\u51FA JSON/CSV/XLSX \u53EF\u4EE5\u4FDD\u5B58\u65B0\u6587\u4EF6\u3002`);
    render();
  }
  async function importWorkbook(event) {
    const file = event.target.files[0];
    if (!file || !window.XLSX) return;
    const workbook = XLSX.read(await file.arrayBuffer());
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
    log(`\u5DF2\u5BFC\u5165 ${file.name}: ${rows.length} \u884C\u3002\u8BF7\u5BFC\u51FA\u4FDD\u5B58\u66F4\u65B0\u540E\u7684\u526F\u672C\u3002`);
  }
  function exportCsv() {
    const rows = selectedCompanies().flatMap((company) => [
      ...company.monthly.map((row) => ({ \u5E74\u4EFD: company.year, \u516C\u53F8: company.name, \u7C7B\u578B: "\u6708\u4EFD", ...row })),
      ...(company.invoices || []).map((row) => ({ \u5E74\u4EFD: company.year, \u516C\u53F8: company.name, \u7C7B\u578B: "\u8BA2\u5355", month: "", quantity: row.quantity || row.qty || 0, revenue: "", cost: "", grossProfit: "", expense: "", netProfit: row.amount, note: row.note }))
    ]);
    download("accounting-update.csv", toCsv(rows), "text/csv;charset=utf-8");
  }
  function exportXlsx() {
    if (!window.XLSX) return log("XLSX \u7EC4\u4EF6\u8FD8\u6CA1\u52A0\u8F7D\u5B8C\u6210\u3002");
    const workbook = XLSX.utils.book_new();
    for (const company of selectedCompanies()) {
      const rows = [
        ["\u6708\u4EFD", "\u9500\u552E", "\u6210\u672C", "\u6BDB\u5229", "\u8D39\u7528", "\u6263\u5F00\u9500\u540E"],
        ...company.monthly.map((row) => [row.month, row.revenue, row.cost, row.grossProfit, row.expense, row.netProfit]),
        [],
        ["\u8BA2\u5355\u65E5\u671F", "\u5355\u53F7", "\u6570\u91CF", "\u91D1\u989D", "\u5907\u6CE8"],
        ...(company.invoices || []).map((row) => [row.date, row.vendor, row.quantity || row.qty || 0, row.amount, row.note])
      ];
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(rows), `${company.year}-${company.name}`.slice(0, 28));
    }
    XLSX.writeFile(workbook, "accounting-update.xlsx");
  }
  async function checkPatch() {
    try {
      const patchUrl = $("patchUrl")?.value.trim() || defaultPatchUrl;
      setPatchStatus("\u6B63\u5728\u4E0B\u8F7D\u7EBF\u4E0A\u8865\u4E01...");
      const remote = await fetch(patchUrl, { cache: "no-store" }).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      });
      const currentVersion = Number(localStorage.getItem("accountingPatchVersionCode") || patch.versionCode);
      await applyUiPatch(remote, patchUrl);
      const dataUrl = remote.dataUrl ? new URL(remote.dataUrl, patchUrl).href : $("dataUrl")?.value || defaultDataUrl;
      if ($("dataUrl")) $("dataUrl").value = dataUrl;
      const action = Number(remote.versionCode || 0) > currentVersion ? "\u5DF2\u5B89\u88C5\u65B0\u8865\u4E01" : "\u5DF2\u91CD\u65B0\u5B89\u88C5\u8865\u4E01";
      setPatchStatus(`${action} ${remote.versionName}\uFF0C\u6B63\u5728\u5237\u65B0...`);
      setTimeout(() => location.reload(), 500);
    } catch (error) {
      setPatchStatus(`\u68C0\u67E5\u66F4\u65B0\u5931\u8D25: ${error.message}`);
    }
  }
  async function registerPatchWorker() {
    if (!("serviceWorker" in navigator)) return;
    try {
      const registration = await navigator.serviceWorker.register("./sw.js");
      if (registration.waiting) registration.waiting.postMessage({ type: "SKIP_WAITING" });
    } catch (error) {
      console.warn("Patch worker unavailable", error);
    }
  }
  async function applyUiPatch(remote, patchUrl) {
    if (!("caches" in window)) throw new Error("\u8FD9\u4E2A\u624B\u673A WebView \u4E0D\u652F\u6301 UI \u8865\u4E01\u7F13\u5B58");
    await registerPatchWorker();
    const files = Array.isArray(remote.files) ? remote.files : [];
    if (!files.length) throw new Error("\u8865\u4E01\u6CA1\u6709\u5217\u51FA UI \u6587\u4EF6");
    await caches.delete(patchCacheName);
    const cache = await caches.open(patchCacheName);
    for (const file of files) {
      const remoteFileUrl = new URL(file, patchUrl).href;
      const response = await fetch(remoteFileUrl, { cache: "no-store" });
      if (!response.ok) throw new Error(`${file} \u4E0B\u8F7D\u5931\u8D25 HTTP ${response.status}`);
      const localUrl = new URL(file, location.origin + location.pathname.replace(/[^/]*$/, "")).href;
      await cache.put(localUrl, response.clone());
    }
    localStorage.setItem("accountingPatchVersionCode", String(remote.versionCode || patch.versionCode));
    localStorage.setItem("accountingPatchVersionName", remote.versionName || "");
  }
  async function downloadOnlineData() {
    try {
      const remote = await fetch($("dataUrl")?.value.trim() || defaultDataUrl, { cache: "no-store" }).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      });
      if (!Array.isArray(remote.companies)) throw new Error("\u6570\u636E\u6587\u4EF6\u7F3A\u5C11\u516C\u53F8\u8D44\u6599");
      const years = availableYears(remote.companies);
      state = { ...remote, activeYear: years[0] || "", activeId: "" };
      render();
      log(`\u5DF2\u4E0B\u8F7D\u7EBF\u4E0A\u6570\u636E: ${remote.companies.length} \u5BB6\u516C\u53F8\u3002`);
    } catch (error) {
      log(`Download failed: ${error.message}`);
    }
  }
  async function uploadOnlineData() {
    const url = $("uploadUrl")?.value.trim() || "";
    if (!url) {
      log("Set Upload API first, or export JSON/XLSX for manual upload.");
      return;
    }
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...state, uploadedAt: (/* @__PURE__ */ new Date()).toISOString() })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      log("Uploaded accounting data online.");
    } catch (error) {
      log(`Upload failed: ${error.message}`);
    }
  }
  function download(name, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  }
  function log(message) {
    if ($("log")) $("log").textContent = `${(/* @__PURE__ */ new Date()).toLocaleTimeString()}  ${message}
${$("log").textContent}`;
    console.log(message);
  }
  function setPatchStatus(message) {
    if ($("patchStatus")) $("patchStatus").textContent = message;
    log(message);
  }
  init().catch((error) => {
    document.body.innerHTML = `<pre>App failed to load: ${error.message}</pre>`;
  });
})();
