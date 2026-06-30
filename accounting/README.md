# Accounting Patch App

Static accounting app for Edwin's three company workflow.

- Companies seeded from `2026业绩表(1).et` and `希瑞销售业绩表（带每款产品详细）(4).xlsx`.
- Upload invoice image/text/workbook, scan or paste invoice text, confirm amount, then update the selected company.
- Export updated `accounting-update.csv`, `accounting-update.json`, or `accounting-update.xlsx`.
- `patch.json` is the online patch manifest. Upload this folder to a web host or GitHub Pages; future versions only need a higher `versionCode` and updated files.

Run locally:

```powershell
python -m http.server 4174 --directory outputs/accounting-app --bind 127.0.0.1
```

Open:

```text
http://127.0.0.1:4174/index.html
```
