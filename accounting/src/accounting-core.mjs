export function parseMoney(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const cleaned = String(value ?? "")
    .replace(/[¥￥,\s]/g, "")
    .match(/-?\d+(\.\d+)?/);
  return cleaned ? Number(cleaned[0]) : 0;
}

export function roundMoney(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

export function formatMoney(value) {
  const amount = Number(value) || 0;
  const formatter = new Intl.NumberFormat("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `¥${formatter.format(amount / 10000)}万`;
}

export function profitStatus(value) {
  const amount = Number(value) || 0;
  if (amount > 0) return { label: "净赚", className: "earn" };
  if (amount < 0) return { label: "净亏", className: "lose" };
  return { label: "持平", className: "even" };
}

export function calculateOverhead({ netProfit, monthCount, rent, rentByCompany, salary }) {
  const companyRent = rentByCompany
    ? Object.values(rentByCompany).reduce((total, value) => total + parseMoney(value), 0)
    : parseMoney(rent);
  const monthly = roundMoney(companyRent + parseMoney(salary));
  const total = roundMoney(monthly * (Number(monthCount) || 0));
  return {
    monthly,
    total,
    finalNet: roundMoney(parseMoney(netProfit) - total),
  };
}

export function buildCompanySummary(company) {
  const rows = company.monthly || [];
  const invoices = company.invoices || [];
  const sum = (field) => roundMoney(rows.reduce((total, row) => total + parseMoney(row[field]), 0));
  const invoiceAmount = roundMoney(invoices.reduce((total, row) => total + parseMoney(row.amount), 0));

  return {
    revenue: sum("revenue"),
    cost: sum("cost"),
    grossProfit: sum("grossProfit"),
    expense: sum("expense"),
    invoiceAmount,
    netProfit: roundMoney(sum("netProfit") + invoiceAmount),
  };
}

export function applyInvoice(company, invoice) {
  return {
    ...company,
    invoices: [
      ...(company.invoices || []),
      {
        id: `inv-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        date: invoice.date || new Date().toISOString().slice(0, 10),
        vendor: invoice.vendor || "未知",
        amount: parseMoney(invoice.amount),
        note: invoice.note || "",
        source: "invoice-upload",
      },
    ],
  };
}

export function shouldUpdate(currentPatch, remotePatch) {
  return Number(remotePatch?.versionCode || 0) > Number(currentPatch?.versionCode || 0);
}

export function availableYears(companies) {
  return [...new Set((companies || []).map((company) => company.year).filter(Boolean))]
    .sort((a, b) => String(b).localeCompare(String(a)));
}

export function filterCompaniesByYear(companies, year) {
  if (!year) return companies || [];
  return (companies || []).filter((company) => company.year === year);
}

export function toCsv(rows) {
  const headers = Object.keys(rows[0] || {});
  const escape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  return [headers.join(","), ...rows.map((row) => headers.map((key) => escape(row[key])).join(","))].join("\n");
}
