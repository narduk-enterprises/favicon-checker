/**
 * App-specific database schema.
 *
 * Re-exports the layer's base tables (users, sessions, todos) so that
 * drizzle-kit can discover them from this workspace. Add app-specific
 * tables below the re-export.
 */
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export * from '#layer/server/database/schema'

// ─── App-Specific Tables ────────────────────────────────────

export const faviconChecks = sqliteTable('favicon_checks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  url: text('url').notNull(),
  domain: text('domain').notNull(),
  faviconCount: integer('favicon_count').notNull().default(0),
  checkedAt: text('checked_at').notNull().$defaultFn(() => new Date().toISOString()),
})

// ─── Type helpers ───────────────────────────────────────────
export type FaviconCheck = typeof faviconChecks.$inferSelect
export type NewFaviconCheck = typeof faviconChecks.$inferInsert
