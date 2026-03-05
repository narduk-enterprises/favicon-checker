import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Extend the published Narduk Nuxt Layer
  extends: ['@narduk-enterprises/narduk-nuxt-template-layer'],

  // nitro-cloudflare-dev proxies D1 bindings to the local dev server
  modules: ['nitro-cloudflare-dev'],

  // App-level design system extensions (animations, hero glow, card system, scroll-reveal)
  css: ['~/assets/css/main.css'],

  nitro: {
    preset: 'cloudflare-module',
    serverAssets: [
      {
        baseName: 'public',
        dir: resolve(__dirname, 'public'),
      },
    ],
    cloudflareDev: {
      configPath: resolve(__dirname, 'wrangler.json'),
    },
  },

  future: {
    compatibilityVersion: 4,
  },

  colorMode: {
    preference: 'light',
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },

  runtimeConfig: {
    // Server-only (admin API routes)
    googleServiceAccountKey: process.env.GSC_SERVICE_ACCOUNT_JSON || '',
    posthogApiKey: process.env.POSTHOG_PERSONAL_API_KEY || '',
    gaPropertyId: process.env.GA_PROPERTY_ID || '',
    posthogProjectId: process.env.POSTHOG_PROJECT_ID || '',
    public: {
      siteUrl: process.env.SITE_URL || 'https://favicon-checker.nard.uk',
      appUrl: process.env.SITE_URL || 'https://favicon-checker.nard.uk',
      appName: process.env.APP_NAME || 'Favicon Checker',
      // Analytics
      posthogPublicKey: process.env.POSTHOG_PUBLIC_KEY || '',
      posthogHost: process.env.POSTHOG_HOST || 'https://us.i.posthog.com',
      gaMeasurementId: process.env.GA_MEASUREMENT_ID || '',
      posthogProjectId: process.env.POSTHOG_PROJECT_ID || '',
      // IndexNow
      indexNowKey: process.env.INDEXNOW_KEY || '',
    },
  },

  site: {
    url: process.env.SITE_URL || 'https://favicon-checker.nard.uk',
    name: 'Favicon Checker',
    description: 'Free online tool to check any website\'s favicon. Bypass browser cache and see the real favicon instantly. Test all favicon sizes including Apple Touch Icon.',
    defaultLocale: 'en',
  },

  sitemap: {
    sources: ['/api/__sitemap__/domains'],
    defaults: {
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.8,
    },
  },

  schemaOrg: {
    identity: {
      type: 'WebApplication',
      name: 'Favicon Checker',
      url: process.env.SITE_URL || 'https://favicon-checker.nard.uk',
      logo: '/favicon.svg',
      applicationCategory: 'DeveloperApplication',
    },
  },

  image: {
    cloudflare: {
      baseURL: process.env.SITE_URL || 'https://favicon-checker.nard.uk',
    },
  },
})
