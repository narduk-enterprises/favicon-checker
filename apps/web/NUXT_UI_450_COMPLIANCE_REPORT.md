# Nuxt UI v4.5.0 Compliance Report — favicon-checker

**Date**: 2026-03-05
**Status**: ✅ **PASS**
**Total files changed**: 0
**Highest-risk changes**: None

---

## 1. Version & Config Snapshot

| Package      | Version                       | Location                                |
| ------------ | ----------------------------- | --------------------------------------- |
| Nuxt         | ^4.3.1                        | `apps/web/package.json`                 |
| @nuxt/ui     | 4.5.0                         | `layers/narduk-nuxt-layer/package.json` |
| Tailwind CSS | ^4.2.1 (layer) / ^4.0.0 (app) | Both `package.json` files               |
| Vue          | (resolved via Nuxt 4.3.1)     | —                                       |
| TypeScript   | ^5.9.3                        | `apps/web/package.json`                 |

### Config files

- **`nuxt.config.ts`** — Extends `narduk-nuxt-layer`, adds `nitro-cloudflare-dev` module, sets `future.compatibilityVersion: 4`.
- **`app.config.ts`** — Correct `defineAppConfig({ ui: { colors: { primary: 'cyan', neutral: 'slate' } } })`.
- **Layer `nuxt.config.ts`** — `@nuxt/ui` properly listed in `modules`, alongside `@nuxt/fonts`, `@nuxt/image`, `@nuxtjs/seo`, `@nuxt/eslint`. Includes workaround for `nuxt/ui#6118`.

---

## 2. Structure

| Directory          | Contents                                                                                                                               |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `app/components/`  | 3 files: `FaviconAuditScore`, `FaviconCodeSnippet`, `ScrollToTop`                                                                      |
| `app/pages/`       | 15 files across `index`, `batch`, `generator`, `monitor`, `trends`, `gallery`, `guide`, `check/[domain]`, `tools/` (3), `compare/` (2) |
| `app/composables/` | 7 composables                                                                                                                          |
| `app/assets/css/`  | `main.css` (260 lines — design system extensions)                                                                                      |
| `server/`          | API routes and database logic                                                                                                          |
| Layer components   | `AppMapKit.vue` (shared)                                                                                                               |

---

## 3. Nuxt UI Surface Area

### Components used

| Component    | Files                                                                       | Count         |
| ------------ | --------------------------------------------------------------------------- | ------------- |
| `UButton`    | All 15 pages + 3 components                                                 | ~45 instances |
| `UIcon`      | All 15 pages + 3 components                                                 | ~35 instances |
| `UBadge`     | `index`, `batch`, `monitor`, `guide`, `check/[domain]`, `FaviconAuditScore` | ~10 instances |
| `UInput`     | `index`, `monitor`                                                          | 2 instances   |
| `UAccordion` | `index`, `batch`, `generator`, `guide`                                      | 4 instances   |
| `UTextarea`  | `batch`                                                                     | 1 instance    |
| `UApp`       | `app.vue`                                                                   | 1 instance    |
| `ULink`      | `app.vue`                                                                   | 1 instance    |
| `UKbd`       | `guide`                                                                     | 2 instances   |

### Custom components (NOT wrapping Nuxt UI)

- `FaviconAuditScore` — Domain-specific score display (uses `UBadge`, `UIcon` internally)
- `FaviconCodeSnippet` — HTML code display with clipboard (uses `UButton`, `UIcon` internally)
- `ScrollToTop` — Scroll-to-top FAB (uses `UButton` internally)

**All three are legitimate domain components, not UI primitive wrappers.**

---

## 4. Findings by Category

### Phase 1 — Module/Config ✅

- `@nuxt/ui` v4.5.0 is in the layer's `dependencies` (correct for a published layer).
- `@nuxt/ui` is in the layer's `modules` array.
- No conflicting UI frameworks found.
- Auto-imports functioning correctly (no manual `import` of U\* components anywhere).

### Phase 2 — Tokens/Theme ✅

- `app.config.ts` uses `defineAppConfig({ ui: { colors: { primary: 'cyan', neutral: 'slate' } } })` — correct v4.5.0 structure.
- No per-component arbitrary brand colors that fight the token system.
- `main.css` defines shape tokens (`--radius-card`, `--shadow-card`, etc.) that complement, not override, Nuxt UI's built-in tokens.
- Color usage throughout templates correctly leverages semantic classes: `text-primary-500`, `text-muted`, `text-dimmed`, `bg-elevated`, `text-default`, `text-success-500`, `text-error-500`, `text-warning-500`, `text-info-500`.

### Phase 3 — Component Syntax ✅

Every Nuxt UI component instance was validated against v4.5.0 API:

| Component    | Props used                                                                                      | Status       |
| ------------ | ----------------------------------------------------------------------------------------------- | ------------ |
| `UButton`    | `variant`, `size`, `icon`, `color`, `loading`, `disabled`, `to`, `type`, `aria-label`           | ✅ All valid |
| `UIcon`      | `name`, `class`                                                                                 | ✅ Valid     |
| `UBadge`     | `color`, `variant`, `size`                                                                      | ✅ Valid     |
| `UInput`     | `v-model`, `placeholder`, `size`, `icon`, `disabled`, `autocomplete`, `type`, `inputmode`, `id` | ✅ Valid     |
| `UAccordion` | `:items` (array of `{ label, content }`)                                                        | ✅ Valid     |
| `UTextarea`  | `v-model`, `placeholder`, `:rows`, `autoresize`, `disabled`, `class`                            | ✅ Valid     |
| `UApp`       | (wrapper, no props)                                                                             | ✅ Valid     |
| `ULink`      | `to`, `class`                                                                                   | ✅ Valid     |
| `UKbd`       | (default slot content)                                                                          | ✅ Valid     |

**No stale v2/v3 prop names found.** No `UFormGroup` (legacy). No `:ui` override objects with stale keys. No invalid slot usage.

### Phase 4 — Custom Primitives ✅

No custom primitives replicate Nuxt UI functionality:

- No `Button*`, `BaseButton*`, `Card*`, `Modal*`, `Input*`, `Select*`, `Badge*`, `Tabs*`, `Dropdown*`, `Table*` components.
- The 3 custom components all add domain-specific behavior.

### Phase 5 — Tailwind Discipline ✅

Tailwind usage is disciplined and Nuxt UI-compatible:

- Layout utilities: `flex`, `grid`, `gap-*`, `p-*`, `mx-auto`, `max-w-*` — ✅ Appropriate.
- Brand colors use semantic tokens (`text-primary-500`, `bg-primary-50`) rather than arbitrary hex values — ✅ Appropriate.
- Custom CSS classes (`card-base`, `card-interactive`, `glass-card`, `hero-glow`, `press-effect`) are defined in `main.css` and use CSS custom properties — ✅ These complement, not fight, Nuxt UI.

**Tailwind exceptions** (intentionally kept):

- `bg-linear-to-r from-primary-500 to-primary-300` — used for gradient text effects on headings. This is a visual flourish, not a UI component style.
- `bg-*-500/10` background tints — used for icon containers. These use the correct semantic palette colors.
- Hard-coded colors in `main.css` hero glow (`rgba(6, 182, 212, ...)`) — these are cyan-family values matching the `primary: cyan` token. Acceptable for ambient effects that CSS variables can't easily target.

### Phase 6 — Layout/Page Composition ✅

- No `layouts/` directory in the app — the layer provides the default layout. No business logic in layout.
- Pages compose properly using Nuxt UI building blocks.
- Consistent hero pattern across all pages (gradient header, animated background, breadcrumb navigation back to home).
- Consistent CTA sections using `UButton` with proper `to` routing.
- `ScrollToTop` component consistently used across all pages.

### Phase 7 — Forms & Validation ✅

- Two form interactions exist (favicon URL input on `index.vue`, domain input on `monitor.vue`). Both use native `<form>` with `@submit.prevent` — intentionally NOT using `UForm` because they perform single-input API calls, not validated multi-field forms. ESLint disable comments document this decision.
- `UTextarea` on `batch.vue` — used as a multi-line text input, not a form field. Correct usage.
- No validation library is needed or used.

---

## 5. Nuxt UI Component Fix Table

| File | Component | Issue           | Fix |
| ---- | --------- | --------------- | --- |
| —    | —         | No issues found | —   |

**All component usage is already v4.5.0 compliant.**

---

## 6. Changelog

### Added files

None.

### Modified files

None.

### Removed files

None.

---

## 7. Post-Merge Guardrails

1. **Always use semantic color classes** (`text-primary-*`, `bg-primary-*`, `text-muted`, `text-dimmed`, `bg-elevated`) — never hardcode hex colors in templates.
2. **Prefer Nuxt UI components** over HTML equivalents: `UButton` over `<button>`, `UInput` over `<input>`, `UBadge` for status indicators.
3. **Use `defineAppConfig({ ui: { ... } })`** for theme changes — don't override component styles with Tailwind utilities that fight Nuxt UI tokens.
4. **Keep `@nuxt/ui` in the layer** — don't add it to individual app `package.json` files to avoid version conflicts.
5. **Use `UFormField`** (not `UFormGroup`) if adding validated forms in the future.
6. **Use `v-model:open`** (with `:open` suffix) for modals/drawers if adding overlays.
7. **Use `value-key` / `label-key`** (not `value-attribute` / `option-attribute`) for `USelect` / `USelectMenu` if adding select components.
8. **Use `bg-linear-to-*`** (not `bg-gradient-to-*`) for Tailwind 4 gradient syntax.
9. **Wrap temporal data** (`new Date()`, "5m ago") in `<ClientOnly>` to prevent hydration mismatches.
10. **Run `pnpm lint`** before merging to catch any lint violations from new Nuxt UI component additions.
