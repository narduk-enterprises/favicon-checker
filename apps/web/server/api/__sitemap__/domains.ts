import { faviconChecks } from '#server/database/schema'

/**
 * Dynamic sitemap source for per-domain pages.
 * Returns URLs like /check/github.com for all checked domains.
 */
export default defineSitemapEventHandler(async (event) => {
  const db = useAppDatabase(event)

  const domains = await db
    .selectDistinct({ domain: faviconChecks.domain })
    .from(faviconChecks)
    .limit(1000)

  return domains.map(row => ({
    loc: `/check/${row.domain}`,
    changefreq: 'monthly' as const,
    priority: 0.6,
  }))
})
