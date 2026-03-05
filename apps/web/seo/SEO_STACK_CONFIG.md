# SEO Stack Configuration

Verified the presence of the Nuxt SEO stack (via `@narduk-enterprises/narduk-nuxt-template-layer`):

- `@nuxtjs/seo`
- `nuxt-schema-org` (bundled in above)
- `nuxt-og-image` (bundled in above)
- `nuxt-robots` (bundled in above)
- `nuxt-sitemap` (bundled in above)

Configured in `nuxt.config.ts`:

- Defined `runtimeConfig.public.siteUrl: process.env.SITE_URL || 'https://favicon-checker.nard.uk'`
- `site.url`, `site.name`, `site.description`, and `site.defaultLocale` are properly configured.
- `schemaOrg.identity` is correctly set.

## Environment Rules

- **Production**: indexable (default Nuxt SEO behavior based on `process.env.SITE_URL` vs dev mode).
- **Staging/Dev**: handled by `nuxt-seo` default environmental toggles (`x-robots-tag: noindex` in dev).
