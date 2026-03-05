import { eq, desc } from 'drizzle-orm'
import { faviconChecks } from '#server/database/schema'

export default defineEventHandler(async (event) => {
  const domain = getRouterParam(event, 'domain')

  if (!domain) {
    throw createError({ statusCode: 400, message: 'Domain parameter is required' })
  }

  const db = useAppDatabase(event)

  // Get the most recent check for this domain that has result data
  const [check] = await db
    .select()
    .from(faviconChecks)
    .where(eq(faviconChecks.domain, domain))
    .orderBy(desc(faviconChecks.id))
    .limit(1)

  if (!check || !check.resultJson) {
    throw createError({ statusCode: 404, message: `No cached results for ${domain}` })
  }

  const favicons = JSON.parse(check.resultJson)
  const audit = computeAuditScore(favicons)

  return {
    domain: check.domain,
    url: check.url,
    faviconCount: check.faviconCount,
    auditScore: audit.score,
    auditGrade: audit.grade,
    auditChecks: audit.checks,
    checkedAt: check.checkedAt,
    favicons,
  }
})
