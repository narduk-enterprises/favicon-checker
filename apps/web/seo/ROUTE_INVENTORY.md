# Route Inventory

| Route    | Template    | Type   | Indexable | Canonical Source | Notes                 |
| -------- | ----------- | ------ | --------- | ---------------- | --------------------- |
| `/`      | `index.vue` | static | true      | `/`              | Homepage, main tool   |
| `/batch` | `batch.vue` | static | true      | `/batch`         | Batch checker feature |

## Codebase Discovery Notes

- **Nuxt version**: 4 (compatibilityVersion: 4)
- **Rendering mode**: SSR (Cloudflare Workers via `cloudflare-module`)
- **routeRules configuration**: None found in `nuxt.config.ts`.
- **pages directory routes**: `index.vue`, `batch.vue`
- **dynamic routes**: None
- **API/CMS content sources**: None
- **existing sitemap**: Handled by `@nuxtjs/seo` via template layer.
- **existing robots.txt**: Likely handled by Nuxt SEO.
- **schema usage**: Configured in `nuxt.config.ts` (`Organization`, `WebSite`).
- **OG image generation**: Utilizing `nuxt-og-image`.
- **i18n usage**: Minimal (`defaultLocale: 'en'`).
- **canonical implementation**: To be standardized via `useAppSeo`.
- **trailing slash policy**: Default (off).
