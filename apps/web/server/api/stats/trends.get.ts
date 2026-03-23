import { sql, isNotNull, desc } from 'drizzle-orm'
import { faviconChecks } from '#server/database/schema'

/**
 * Aggregate favicon usage trends from checked domains.
 * Uses raw SQL for aggregation since drizzle's aggregate support is limited.
 */
export default defineEventHandler(async (event) => {
  const db = useAppDatabase(event)

  // Get distinct domain count
  const [countRow] = await db
    .select({ count: sql<number>`COUNT(DISTINCT ${faviconChecks.domain})` })
    .from(faviconChecks)

  const totalDomains = countRow?.count || 0

  if (totalDomains === 0) {
    return {
      totalDomains: 0,
      avgFaviconCount: 0,
      avgAuditScore: 0,
      withIco: 0,
      withPng: 0,
      withSvg: 0,
      withApple: 0,
      withManifest: 0,
    }
  }

  // Get average favicon count and audit score from latest check per domain
  const [avgRow] = await db
    .select({
      avgCount: sql<number>`AVG(${faviconChecks.faviconCount})`,
      avgScore: sql<number>`AVG(${faviconChecks.auditScore})`,
    })
    .from(faviconChecks)

  // For format breakdown, we need to parse resultJson
  // Get the latest check for each domain (up to 500 domains)
  const latestChecks = await db
    .select({ resultJson: faviconChecks.resultJson })
    .from(faviconChecks)
    .where(isNotNull(faviconChecks.resultJson))
    .orderBy(desc(faviconChecks.id))
    .limit(500)

  let withIco = 0
  let withPng = 0
  let withSvg = 0
  let withApple = 0
  let withManifest = 0

  for (const check of latestChecks) {
    if (!check.resultJson) continue
    try {
      const favicons = JSON.parse(check.resultJson) as Array<{ type: string; source: string }>
      const hasIco = favicons.some(
        (f) =>
          f.type.includes('x-icon') ||
          f.type.includes('vnd.microsoft.icon') ||
          f.source === '/favicon.ico',
      )
      const hasPng = favicons.some((f) => f.type.includes('png'))
      const hasSvg = favicons.some((f) => f.type.includes('svg'))
      const hasApple = favicons.some((f) => f.source.includes('apple'))
      const hasManifest = favicons.some((f) => f.source === 'manifest')

      if (hasIco) withIco++
      if (hasPng) withPng++
      if (hasSvg) withSvg++
      if (hasApple) withApple++
      if (hasManifest) withManifest++
    } catch {
      // Skip malformed JSON
    }
  }

  return {
    totalDomains,
    avgFaviconCount: avgRow?.avgCount || 0,
    avgAuditScore: avgRow?.avgScore || 0,
    withIco,
    withPng,
    withSvg,
    withApple,
    withManifest,
  }
})
