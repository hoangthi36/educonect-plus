# Educonect+ — Project instructions

## Current goal
Build milestone 1 only: responsive React UI + real Express/MongoDB authentication and RBAC + a deployable progress demo. Product interactions beyond auth/profile are explicitly simulated. Use one agent and bounded tasks; do not delegate by default.

## Read narrowly
At task start read docs/09_PROGRESS.md and the relevant spec, not every document every time. Scope: docs/01_SCOPE.md. UI: docs/03_UI_SPEC.md. Auth: docs/04_ARCHITECTURE_AUTH.md. Business states: docs/02_BUSINESS_RULES.md. Tests: docs/06_ACCEPTANCE.md.

## Preserve and inspect
Inspect actual package.json, index.html, app.js, styles.css before editing. Preserve old demo in a reference directory, with its relative dependencies, before migration. Never claim unavailable files were reviewed. Keep unrelated features/layout where compatible. Do not overwrite existing project instructions. Do not delete user edits or reset the repo.

## Brand and business
Exact name: Educonect+.
Exact slogan: Kết nối đúng người – Trao gửi niềm tin – Đồng hành cùng tri thức
Use supplied assets/educonect-logo.png unchanged; never substitute the Zalo like URL.
Tutor buys 300,000 VND / 2 service Tokens. Parent does not prepay. IN_CHAT holds one Token; parent acceptance of tutor's trial proposal consumes that hold and permits contact sharing. No tuition wallet, payout, sessions or escrow. Unresolved refund policies remain pending; do not invent them.

## Implementation defaults
Adapt to existing project if compatible; otherwise React/Vite + JavaScript, Express + Mongoose, npm workspaces client/server. CSS tokens and reusable components, no large UI framework required. Single-origin production: Express serves client/dist and /api; Vite proxies /api in dev. Use Mongo-backed server sessions and HttpOnly cookies. No JWT/password/role authorization in localStorage. Public registration only parent/tutor; admin provisioned by protected CLI. Server enforces role and ownership.

## Demo boundaries
Never grant real credit from a UI button or query parameter. Mock product state lives in a separate demo adapter; real auth is never mocked after P3. /demo uses only fictional data and can switch personas; real account routes cannot change role. Show 'Mô phỏng nghiệp vụ' beside simulated interactions. No bank QR, SMS, OCR claims, real payments, or fake verification badges. Hide unbuilt account actions with truthful status. Do not present demo URLs as purchase flows.

## Work and reporting
Finish only the requested task, run relevant checks, fix discovered regressions. At each milestone update docs/09_PROGRESS.md with actual files, commands/results, blockers and next task. Do not mark unrun checks PASS. Keep summaries short. No dependency upgrades or architectural rewrites unrelated to task. Store secrets only in ignored env files/provider settings; do not print them. Do not introduce new recurring paid services without user choice. Deployment needs target credentials/access; prepare everything else first.
