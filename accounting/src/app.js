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
} from "./accounting-core.mjs?v=clean-account-2";

const patch = { versionCode: 3, versionName: "v3-online-patch-url-2026-07-01" };
let state = { companies: [], activeId: "nikator-2026", activeYear: "2026" };

const $ = (id) => document.getElementById(id);
const money = formatMoney;

async function init() {
  $("invoiceDate").value = new Date().toISOString().slice(0, 10);
  const res = await fetch("./data/company-data.json?v=stareep-rent-1", { cache: "no-store" });
  state = { ...(await res.json()), activeId: "nikator-2026", activeYear: "2026" };
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
  $("companyList").innerHTML = companies.map((company) => {
    const summary = buildCompanySummary(company);
    return `<button class="${company.id === state.activeId ? "selected" : ""}" data-company="${company.id}">
      <strong>${company.name}</strong><span>${money(summary.netProfit)}</span>
    </button>`;
  }).join("");

  const totals = companies.map(buildCompanySummary).reduce((acc, item) => {
    for (const key of Object.keys(item)) acc[key] = (acc[key] || 0) + item[key];
    return acc;
  }, {});
  $("totalRevenue").textContent = money(totals.revenue);
  $("totalCost").textContent = money(totals.cost);
  $("totalGross").textContent = money(totals.grossProfit);
  $("totalNet").textContent = money(totals.netProfit);
  $("reportYear").textContent = state.activeYear;
  $("reportGrid").innerHTML = companies.map((company) => {
    const summary = buildCompanySummary(company);
    const status = profitStatus(summary.netProfit);
    return `<button class="report-row ${company.id === state.activeId ? "selected" : ""}" data-company="${company.id}">
      <strong>${company.name}</strong>
      <span><b>Sales</b>${money(summary.revenue)}</span>
      <span><b>Cost</b>${money(summary.cost)}</span>
      <span><b>Gross</b>${money(summary.grossProfit)}</span>
      <span class="${status.className}"><b>${status.label}</b>${money(summary.netProfit)}</span>
    </button>`;
  }).join("");

  const company = activeCompany();
  if (!company) return;
  const activeSummary = buildCompanySummary(company);
  const activeStatus = profitStatus(activeSummary.netProfit);
  $("activeTitle").textContent = company.name;
  $("activeSource").innerHTML = `<strong class="${activeStatus.className}">${activeStatus.label}: ${money(activeSummary.netProfit)}</strong>`;
  $("monthRows").innerHTML = (company.monthly || []).map((row) => `<tr>
    <td>${row.month}</td><td>${money(row.revenue)}</td><td>${money(row.cost)}</td>
    <td>${money(row.grossProfit)}</td><td>${money(row.expense)}</td><td>${money(row.netProfit)}</td>
  </tr>`).join("");
  $("invoiceRows").innerHTML = (company.invoices || []).map((row) => `<tr>
    <td>${row.date}</td><td>${row.vendor}</td><td>${money(row.amount)}</td><td>${row.note || ""}</td>
  </tr>`).join("") || `<tr><td colspan="4">No invoice uploaded yet.</td></tr>`;
}

function bindEvents() {
  $("yearList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-year]");
    if (!button) return;
    state.activeYear = button.dataset.year;
    state.activeId = "";
    render();
  });
  $("companyList").addEventListener("click", (event) => {
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
  $("scanInvoice").addEventListener("click", scanInvoice);
  $("applyInvoice").addEventListener("click", addInvoice);
  $("exportCsv").addEventListener("click", exportCsv);
  $("exportJson").addEventListener("click", () => download("accounting-update.json", JSON.stringify(state, null, 2), "application/json"));
  $("exportXlsx").addEventListener("click", exportXlsx);
  $("importWorkbook").addEventListener("click", () => $("workbookFile").click());
  $("workbookFile").addEventListener("change", importWorkbook);
  $("checkPatch").addEventListener("click", checkPatch);
  $("downloadData").addEventListener("click", downloadOnlineData);
  $("uploadData").addEventListener("click", uploadOnlineData);
}

async function scanInvoice() {
  const file = $("invoiceFile").files[0];
  if (!file) return log("Choose an invoice file first.");
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
  const index = state.companies.findIndex((company) => company.id === state.activeId);
  state.companies[index] = applyInvoice(state.companies[index], {
    date: $("invoiceDate").value,
    amount: $("invoiceAmount").value,
    vendor: $("invoiceVendor").value,
    note: $("invoiceNote").value || $("invoiceFile").files[0]?.name || "manual",
  });
  log(`Updated ${state.companies[index].name}. Export JSON/CSV/XLSX to save the new file.`);
  render();
}

async function importWorkbook(event) {
  const file = event.target.files[0];
  if (!file || !window.XLSX) return;
  const workbook = XLSX.read(await file.arrayBuffer());
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
  log(`Imported ${file.name}: ${rows.length} rows. Use export to keep a patched copy.`);
}

function exportCsv() {
  const rows = selectedCompanies().flatMap((company) => [
    ...company.monthly.map((row) => ({ year: company.year, company: company.name, type: "month", ...row })),
    ...(company.invoices || []).map((row) => ({ year: company.year, company: company.name, type: "invoice", month: "", revenue: "", cost: "", grossProfit: "", expense: "", netProfit: row.amount, note: row.note })),
  ]);
  download("accounting-update.csv", toCsv(rows), "text/csv;charset=utf-8");
}

function exportXlsx() {
  if (!window.XLSX) return log("XLSX library is not loaded.");
  const workbook = XLSX.utils.book_new();
  for (const company of selectedCompanies()) {
    const rows = [
      ["Month", "Sales", "Supplier Cost", "Gross Profit", "Expense", "Net Profit"],
      ...company.monthly.map((row) => [row.month, row.revenue, row.cost, row.grossProfit, row.expense, row.netProfit]),
      [],
      ["Invoice Date", "Vendor", "Amount", "Note"],
      ...(company.invoices || []).map((row) => [row.date, row.vendor, row.amount, row.note]),
    ];
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(rows), `${company.year}-${company.name}`.slice(0, 28));
  }
  XLSX.writeFile(workbook, "accounting-update.xlsx");
}

async function checkPatch() {
  try {
    const patchUrl = $("patchUrl").value.trim();
    const remote = await fetch(patchUrl, { cache: "no-store" }).then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    });
    if (shouldUpdate(patch, remote)) {
      const url = new URL(remote.apkUrl || remote.appUrl || "./", patchUrl).href;
      $("patchStatus").innerHTML = `New patch ${remote.versionName} available. <a href="${url}">Download APK / Update</a>`;
    } else {
      const dataUrl = remote.dataUrl ? new URL(remote.dataUrl, patchUrl).href : $("dataUrl").value;
      $("dataUrl").value = dataUrl;
      $("patchStatus").textContent = `Online patch OK: ${remote.versionName}. Use Download to refresh online data.`;
    }
  } catch (error) {
    $("patchStatus").textContent = `Patch check failed: ${error.message}`;
  }
}

async function downloadOnlineData() {
  try {
    const remote = await fetch($("dataUrl").value.trim(), { cache: "no-store" }).then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    });
    if (!Array.isArray(remote.companies)) throw new Error("data file missing companies");
    const years = availableYears(remote.companies);
    state = { ...remote, activeYear: years[0] || "", activeId: "" };
    render();
    log(`Downloaded online data: ${remote.companies.length} companies.`);
  } catch (error) {
    log(`Download failed: ${error.message}`);
  }
}

async function uploadOnlineData() {
  const url = $("uploadUrl").value.trim();
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
  $("log").textContent = `${new Date().toLocaleTimeString()}  ${message}\n${$("log").textContent}`;
}

init().catch((error) => {
  document.body.innerHTML = `<pre>App failed to load: ${error.message}</pre>`;
});
