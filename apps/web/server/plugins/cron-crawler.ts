/**
 * Cloudflare Cron Trigger — Favicon Crawler
 *
 * Every hour (at :23 past), picks a random domain that either:
 *   1. Has never been checked, OR
 *   2. Was checked longest ago (stale refresh)
 * and runs a full favicon check via the /api/favicon endpoint
 * to build up the stats dataset.
 *
 * Wrangler cron: "23 * * * *"
 */
import { drizzle } from 'drizzle-orm/d1'
import { sql, asc } from 'drizzle-orm'
import { faviconChecks } from '#server/database/schema'
import * as schema from '#server/database/schema'

const POPULAR_DOMAINS = [
  // Tech
  'google.com', 'apple.com', 'microsoft.com', 'amazon.com', 'meta.com',
  'github.com', 'stackoverflow.com', 'npmjs.com', 'vercel.com', 'netlify.com',
  'cloudflare.com', 'digitalocean.com', 'heroku.com', 'gitlab.com', 'bitbucket.org',
  // Social
  'twitter.com', 'reddit.com', 'linkedin.com', 'discord.com', 'instagram.com',
  'facebook.com', 'tiktok.com', 'pinterest.com', 'tumblr.com', 'mastodon.social',
  // News
  'bbc.com', 'nytimes.com', 'theguardian.com', 'techcrunch.com', 'arstechnica.com',
  'wired.com', 'theverge.com', 'cnn.com', 'reuters.com', 'bloomberg.com',
  // E-commerce
  'shopify.com', 'stripe.com', 'ebay.com', 'etsy.com', 'walmart.com',
  'target.com', 'bestbuy.com', 'newegg.com', 'alibaba.com', 'wish.com',
  // Entertainment
  'spotify.com', 'netflix.com', 'youtube.com', 'twitch.tv', 'soundcloud.com',
  'hulu.com', 'disneyplus.com', 'hbomax.com', 'crunchyroll.com', 'imdb.com',
  // Dev Tools
  'docker.com', 'kubernetes.io', 'figma.com', 'notion.so', 'slack.com',
  'trello.com', 'jira.com', 'confluence.com', 'postman.com', 'insomnia.rest',
  // Education
  'wikipedia.org', 'medium.com', 'dev.to', 'hashnode.dev', 'freecodecamp.org',
  'coursera.org', 'udemy.com', 'khanacademy.org', 'edx.org', 'codecademy.com',
  // SaaS
  'salesforce.com', 'hubspot.com', 'zendesk.com', 'intercom.com', 'mailchimp.com',
  'dropbox.com', 'box.com', 'zoom.us', 'webex.com', 'teams.microsoft.com',
  // Other popular
  'wordpress.com', 'squarespace.com', 'wix.com', 'godaddy.com', 'namecheap.com',
  'archive.org', 'producthunt.com', 'dribbble.com', 'behance.net', 'unsplash.com',
  // Finance
  'paypal.com', 'wise.com', 'revolut.com', 'coinbase.com', 'binance.com',
  'robinhood.com', 'schwab.com', 'fidelity.com', 'vanguard.com', 'chase.com',
  // Gaming
  'steampowered.com', 'epicgames.com', 'roblox.com', 'minecraft.net', 'ea.com',
  'playstation.com', 'xbox.com', 'nintendo.com', 'itch.io', 'gog.com',
  // Health
  'webmd.com', 'mayoclinic.org', 'healthline.com', 'nih.gov', 'who.int',
  // Travel
  'booking.com', 'airbnb.com', 'expedia.com', 'tripadvisor.com', 'kayak.com',
  // Food
  'doordash.com', 'ubereats.com', 'grubhub.com', 'yelp.com', 'allrecipes.com',
  // Government & Org
  'whitehouse.gov', 'un.org', 'nasa.gov', 'weather.gov', 'si.edu',
]

export default defineNitroPlugin((nitro) => {
  // @ts-expect-error -- Cloudflare scheduled event hook is not typed in Nitro
  nitro.hooks.hook('cloudflare:scheduled', async (event: { scheduledTime: number, cron: string, env: Record<string, unknown> }) => {
    console.log(`[cron-crawler] Triggered at ${new Date(event.scheduledTime).toISOString()} by cron: ${event.cron}`)

    try {
      const d1 = event.env.DB as D1Database | undefined
      if (!d1) {
        console.error('[cron-crawler] No D1 binding found in env.DB')
        return
      }

      const db = drizzle(d1, { schema })

      // Find all domains we've already checked
      const checked = await db
        .select({ domain: faviconChecks.domain })
        .from(faviconChecks)
        .groupBy(faviconChecks.domain)

      const checkedDomains = new Set(checked.map(r => r.domain))

      // Priority 1: Pick a random domain we've NEVER checked
      const unchecked = POPULAR_DOMAINS.filter(d => !checkedDomains.has(d))

      let targetDomain: string

      if (unchecked.length > 0) {
        targetDomain = unchecked[Math.floor(Math.random() * unchecked.length)]!
        console.log(`[cron-crawler] Picked unchecked domain: ${targetDomain} (${unchecked.length} unchecked remaining)`)
      }
      else {
        // All domains checked — refresh the one with the oldest check
        const oldest = await db
          .select({ domain: faviconChecks.domain })
          .from(faviconChecks)
          .groupBy(faviconChecks.domain)
          .orderBy(asc(sql`MAX(${faviconChecks.checkedAt})`))
          .limit(10)

        if (oldest.length === 0) {
          targetDomain = POPULAR_DOMAINS[Math.floor(Math.random() * POPULAR_DOMAINS.length)]!
        }
        else {
          targetDomain = oldest[Math.floor(Math.random() * oldest.length)]!.domain
        }
        console.log(`[cron-crawler] All checked, refreshing stale: ${targetDomain}`)
      }

      // Call the favicon API internally — this handles the full pipeline
      // (fetch page, discover, download, audit, save to D1, IndexNow ping)
      const result = await $fetch('/api/favicon', {
        params: { url: `https://${targetDomain}` },
      })

      console.log(
        `[cron-crawler] ✅ ${targetDomain}: ${result.favicons?.length ?? 0} favicons, score ${result.auditScore ?? 'N/A'}`,
      )
    }
    catch (error) {
      console.error('[cron-crawler] ❌ Failed:', error)
    }
  })
})
