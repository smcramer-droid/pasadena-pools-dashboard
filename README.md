# Pasadena Pools — Dashboard & Catch-all

Contents rescued from `~/Documents/Claude/Projects/Pasadena Pools/` that aren't part of a dedicated tool repo.

**Contains:**
- `tools-deploy/` — build output directory referenced by wrangler.toml
- `pp-deploy/` — an older ad-hoc deploy bundle
- `functions/api/configs.js` — Cloudflare Functions endpoint for dig-sheet configs
- `logo.png` — brand asset
- `wrangler.toml` — deploys `tools-deploy/` to Pages project `pasadena-pools`

**Deployed to:** https://pasadena-pools.pages.dev

**Caveat:** this was a snapshot of what was on disk on 2026-04-23. The authoritative source for the main ops dashboard (fetch_cf_data.py, build_report.py, generate_html.py) may live elsewhere (likely the `cramer` repo or a Claude Desktop Scheduled task folder) — to be consolidated in a later phase.
