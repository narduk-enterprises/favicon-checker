import { desc } from 'drizzle-orm'
import { faviconChecks } from '#server/database/schema'

interface RecentCheckRow {
  id: number
  domain: string | null
  url: string | null
  faviconCount: number | null
  checkedAt: string | null
}

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

  return (recent as RecentCheckRow[]).filter(check =>
    typeof check.domain === 'string'
    && check.domain.trim().length > 0
    && typeof check.url === 'string'
    && typeof check.faviconCount === 'number'
    && typeof check.checkedAt === 'string',
  )
})
