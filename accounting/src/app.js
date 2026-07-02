import {
  applyInvoice,
  availableYears,
  buildCompanySummary,
  filterCompaniesByYear,
  formatMoney,
  profitStatus,
  parseMoney,
  shouldUpdate,
  toCsv,
} from "./accounting-core.mjs?v=v7-ui-patch-20260702";

const defaultPatchUrl = "https://raw.githubusercontent.com/teopoh71/hp-sofa-updates/main/accounting/patch.json";
const defaultDataUrl = "https://raw.githubusercontent.com/teopoh71/hp-sofa-updates/main/accounting/data/company-data.json";
const patch = { versionCode: 7, versionName: "v7-ui-patch-2026-07-02" };
const patchCacheName = "accounting-ui-patch-v1";
let state = { companies: [], activeId: "nikator-2026", activeYear: "2026", activeMonth: 6 };

const $ = (id) => document.getElementById(id);
const money = formatMoney;

async function init() {
  await registerPatchWorker();
  if ($("invoiceDate")) $("invoiceDate").value = new Date().toISOString().slice(0, 10);
  const res = await fetch("./data/company-data.json?v=v7-ui-patch-20260702", { cache: "no-store" });
  state = { ...(await res.json()), activeId: "nikator-2026", activeYear: "2026", activeMonth: 6 };
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
  if (!companies.some((company) => company.id === state.activeId)) {
    state.activeId = companies[0]?.id || "";
  }

  $("versionLabel").textContent = patch.versionName;
  $("yearList").innerHTML = years.map((year) => `<button class="${year === state.activeYear ? "selected" : ""}" data-year="${year}">${year}</button>`).join("");
  $("monthList").innerHTML = renderMonthButtons({ includeAll: true });
  $("companyList").innerHTML = companies.map((company) => {
    const summary = selectedCompanySummary(company);
    return `<button class="${company.id === state.activeId ? "selected" : ""}" data-company="${company.id}">
      <strong>${company.name}</strong><span>${money(summary.netProfit)}</span>
    </button>`;
  }).join("");
  $("invoiceCompanyTabs").innerHTML = companies.map((company) => {
    const summary = selectedCompanySummary(company);
    return `<button class="${company.id === state.activeId ? "selected" : ""}" data-company="${company.id}">
      <strong>${company.name}</strong><span>${formatQuantity(summary.quantity)}</span>
    </button>`;
  }).join("");

  const totals = companies.map(selectedCompanySummary).reduce((acc, item) => {
    for (const key of Object.keys(item)) acc[key] = (acc[key] || 0) + item[key];
    return acc;
  }, {});
  $("totalRevenue").textContent = money(totals.revenue);
  $("totalCost").textContent = money(totals.cost);
  $("totalGross").textContent = money(totals.grossProfit);
  const totalStatus = profitStatus(totals.netProfit || 0);
  $("totalNetLabel").textContent = `扣开销后${totalStatus.label}`;
  $("totalNet").textContent = money(totals.netProfit);
  $("totalNet").className = totalStatus.className;
  $("reportYear").textContent = state.activeMonth ? `${state.activeYear} / ${state.activeMonth}月` : state.activeYear;
  $("reportGrid").innerHTML = companies.map((company) => {
    const summary = selectedCompanySummary(company);
    const status = profitStatus(summary.netProfit);
    return `<button class="report-row ${company.id === state.activeId ? "selected" : ""}" data-company="${company.id}">
      <strong>${company.name}</strong>
      <span><b>销售</b>${money(summary.revenue)}</span>
      <span><b>数量</b>${formatQuantity(summary.quantity)}</span>
      <span><b>成本</b>${money(summary.cost)}</span>
      <span><b>租金</b>${money(summary.rent)}</span>
      <span><b>工资</b>${money(summary.salary)}</span>
      <span class="${status.className}"><b>扣开销后</b>${money(summary.netProfit)}</span>
    </button>`;
  }).join("");

  const company = activeCompany();
  if (!company) return;
  const activeSummary = selectedCompanySummary(company);
  const activeStatus = profitStatus(activeSummary.netProfit);
  $("activeTitle").textContent = company.name;
  $("activeSource").innerHTML = `<strong class="${activeStatus.className}">扣开销后${activeStatus.label}: ${money(activeSummary.netProfit)}</strong>`;
  renderProfitLoss(company);
  $("monthRows").innerHTML = visibleMonthlyRows(company).map((row) => `<tr>
    <td>${row.month}</td><td>${money(row.revenue)}</td><td>${money(row.cost)}</td>
    <td>${money(row.grossProfit)}</td><td>${money(row.expense)}</td><td>${money(row.netProfit)}</td>
  </tr>`).join("");
  const invoiceRows = visibleInvoiceRows(company);
  $("invoiceTitle").textContent = state.activeMonth ? `${company.name} / ${state.activeMonth}月订单 (${invoiceRows.length}单)` : `${company.name}订单 (${invoiceRows.length}单)`;
  $("invoiceRows").innerHTML = invoiceRows.map((row) => `<tr>
    <td>${row.date}</td><td>${invoiceLabel(row)}</td><td>1单</td><td>${money(row.amount)}</td><td>${money(row.cost || 0)}</td>
  </tr>`).join("") || `<tr><td colspan="5">暂无订单。</td></tr>`;
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
  const now = new Date();
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
    month: `${month}月`,
    revenue: 0,
    cost: 0,
    grossProfit: 0,
    quantity: 0,
    expense: 0,
    netProfit: 0,
  };
}

function renderMonthButtons({ includeAll }) {
  const buttons = includeAll ? [`<button class="${!state.activeMonth ? "selected" : ""}" data-month="">全部</button>`] : [];
  return buttons.concat(Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    return `<button class="${month === state.activeMonth ? "selected" : ""}" data-month="${month}">${month}月</button>`;
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
  const summary = visibleMonthlyRows(company).reduce((acc, row) => {
    acc.revenue += Number(row?.revenue || 0);
    acc.cost += Number(row?.cost || 0);
    acc.grossProfit += Number(row?.grossProfit || 0);
    acc.rent += Number(row?.rent || 0);
    acc.salary += Number(row?.salary || 0);
    acc.expense += Number(row?.expense || 0);
    acc.netProfit += Number(row?.netProfit || 0);
    return acc;
  }, { revenue: 0, cost: 0, grossProfit: 0, rent: 0, salary: 0, expense: 0, netProfit: 0, quantity: 0 });
  summary.quantity = quantity;
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
  return `${Number(value || 0)}单`;
}

function invoiceLabel(row) {
  const badges = [
    row.combinedInvoice ? "合单" : "",
    row.displayClearance ? "清样" : ""
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
  if (!file) return log("请先选择发票图片。");
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
    note: $("invoiceNote").value || $("invoiceFile").files[0]?.name || "手动录入",
  });
  log(`已更新 ${state.companies[index].name}。导出 JSON/CSV/XLSX 可以保存新文件。`);
  render();
}

async function importWorkbook(event) {
  const file = event.target.files[0];
  if (!file || !window.XLSX) return;
  const workbook = XLSX.read(await file.arrayBuffer());
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
  log(`已导入 ${file.name}: ${rows.length} 行。请导出保存更新后的副本。`);
}

function exportCsv() {
  const rows = selectedCompanies().flatMap((company) => [
    ...company.monthly.map((row) => ({ 年份: company.year, 公司: company.name, 类型: "月份", ...row })),
    ...(company.invoices || []).map((row) => ({ 年份: company.year, 公司: company.name, 类型: "订单", month: "", quantity: row.quantity || row.qty || 0, revenue: "", cost: "", grossProfit: "", expense: "", netProfit: row.amount, note: row.note })),
  ]);
  download("accounting-update.csv", toCsv(rows), "text/csv;charset=utf-8");
}

function exportXlsx() {
  if (!window.XLSX) return log("XLSX 组件还没加载完成。");
  const workbook = XLSX.utils.book_new();
  for (const company of selectedCompanies()) {
    const rows = [
      ["月份", "销售", "成本", "毛利", "费用", "扣开销后"],
      ...company.monthly.map((row) => [row.month, row.revenue, row.cost, row.grossProfit, row.expense, row.netProfit]),
      [],
      ["订单日期", "单号", "数量", "金额", "备注"],
      ...(company.invoices || []).map((row) => [row.date, row.vendor, row.quantity || row.qty || 0, row.amount, row.note]),
    ];
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(rows), `${company.year}-${company.name}`.slice(0, 28));
  }
  XLSX.writeFile(workbook, "accounting-update.xlsx");
}

async function checkPatch() {
  try {
    const patchUrl = $("patchUrl")?.value.trim() || defaultPatchUrl;
    const remote = await fetch(patchUrl, { cache: "no-store" }).then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    });
    const currentVersion = Number(localStorage.getItem("accountingPatchVersionCode") || patch.versionCode);
    if (Number(remote.versionCode || 0) > currentVersion) {
      await applyUiPatch(remote, patchUrl);
      setPatchStatus(`已安装补丁 ${remote.versionName}，正在刷新...`);
      setTimeout(() => location.reload(), 500);
    } else {
      const dataUrl = remote.dataUrl ? new URL(remote.dataUrl, patchUrl).href : ($("dataUrl")?.value || defaultDataUrl);
      if ($("dataUrl")) $("dataUrl").value = dataUrl;
      setPatchStatus(`已经是最新补丁: ${remote.versionName}。`);
    }
  } catch (error) {
    setPatchStatus(`检查更新失败: ${error.message}`);
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
  if (!("caches" in window)) throw new Error("这个手机 WebView 不支持 UI 补丁缓存");
  await registerPatchWorker();
  const files = Array.isArray(remote.files) ? remote.files : [];
  if (!files.length) throw new Error("补丁没有列出 UI 文件");
  const cache = await caches.open(patchCacheName);
  for (const file of files) {
    const remoteFileUrl = new URL(file, patchUrl).href;
    const response = await fetch(remoteFileUrl, { cache: "no-store" });
    if (!response.ok) throw new Error(`${file} 下载失败 HTTP ${response.status}`);
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
    if (!Array.isArray(remote.companies)) throw new Error("数据文件缺少公司资料");
    const years = availableYears(remote.companies);
    state = { ...remote, activeYear: years[0] || "", activeId: "" };
    render();
    log(`已下载线上数据: ${remote.companies.length} 家公司。`);
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
      body: JSON.stringify({ ...state, uploadedAt: new Date().toISOString() }),
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
  if ($("log")) $("log").textContent = `${new Date().toLocaleTimeString()}  ${message}\n${$("log").textContent}`;
  console.log(message);
}

function setPatchStatus(message) {
  if ($("patchStatus")) $("patchStatus").textContent = message;
  log(message);
}

init().catch((error) => {
  document.body.innerHTML = `<pre>App failed to load: ${error.message}</pre>`;
});
