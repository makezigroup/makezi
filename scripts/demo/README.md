# MAKEZI demo dataset

Records use `is_demo` and stable `demo-salon-*`/deterministic UUID identifiers.
Auth provisioning: run `bun scripts/demo/provision-users.ts` with Cloud administrative environment bindings. It creates only `makezi-demo-*@example.invalid` accounts and never prints passwords. Existing accounts are reused; no passwords are reset. Users sign in through real Cloud Auth; there is no demo bypass.

Population was applied through the managed data tool with deterministic SQL in the project conversation. Apply through the managed database data-change tool, not a schema migration. Re-running uses stable identifiers and preserves non-demo records. Services/prices/portfolios use the application's existing salon JSON relationship model, not new duplicate tables.

Removal: first hide demo salons using `is_demo`; remove dependent reports/evidence/favorites/comparisons, notifications and requests, then demo reviews and salons. Delete only flagged demo records after checking counts. Remove demo roles/profiles and the 12 `example.invalid` auth accounts last through Cloud's authorized user management. Never delete unflagged records, real users, or all analytics. Images are shared project assets and must remain.
