import { desc } from 'drizzle-orm'
import { faviconChecks } from '#server/database/schema'

export default defineEventHandler(async (event) => {
  const db = useAppDatabase(event)

  const recent = await db
    .select({
      id: faviconChecks.id,
      domain: faviconChecks.domain,
      url: faviconChecks.url,
      faviconCount: faviconChecks.faviconCount,
      checkedAt: faviconChecks.checkedAt,
    })
    .from(faviconChecks)
    .orderBy(desc(faviconChecks.id))
    .limit(20)

  return recent
})
