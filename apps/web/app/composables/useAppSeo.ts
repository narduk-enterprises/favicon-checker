import { useSeoMeta, useRuntimeConfig, useRoute, useSchemaOrg, defineWebPage } from '#imports'

export interface AppSeoOptions {
  title?: string
  description?: string
  canonical?: string
  robots?: string
  ogImage?: string
  ogTitle?: string
  ogDescription?: string
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- schema accepts arbitrary SchemaOrg objects from nuxt-schema-org
  schema?: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- hreflang accepts arbitrary link objects for i18n
  hreflang?: any[]
}

export const useAppSeo = (options: AppSeoOptions = {}) => {
  const config = useRuntimeConfig()
  const route = useRoute()
  const siteUrl = config.public.siteUrl || config.public.appUrl || 'https://favicon-checker.nard.uk'

  // Ensure absolute canonical URL
  const path = route.path === '/' ? '' : route.path
  const absoluteCanonical = options.canonical || `${siteUrl}${path}`

  // Defaults
  const title = options.title || config.public.appName || 'Favicon Checker'
  const description = options.description || 'Free online tool to check any website\'s favicon. Bypass browser cache and see the real favicon instantly.'
  const ogImage = options.ogImage || `${siteUrl}/__og-image__/image/og.png`

  useSeoMeta({
    title,
    ogTitle: options.ogTitle || title,
    description,
    ogDescription: options.ogDescription || description,
    ogImage,
    twitterCard: options.twitterCard || 'summary_large_image',
    twitterTitle: options.ogTitle || title,
    twitterDescription: options.ogDescription || description,
    twitterImage: ogImage,
    robots: options.robots, // Defaults to global config (e.g. index, follow)
  })

  // Set explicit canonical tag
  // using head instead of useSeoMeta to ensure it is not duplicated or overwritten
  useHead({
    link: [
      {
        rel: 'canonical',
        href: absoluteCanonical,
      },
      ...(options.hreflang || []),
    ],
  })

  // Default schema logic
  const schemas = [
    defineWebPage({
      name: title,
      description: description,
      url: absoluteCanonical,
    }),
    ...(options.schema || []),
  ]

  useSchemaOrg(schemas)
}
