import { defineAdminMutation } from '#layer/server/utils/mutation'

const SEED_POPULAR_RATE = {
  namespace: 'seed-popular',
  maxRequests: 1,
  windowMs: 300_000,
} as const

/**
 * Seed popular domains into the database for programmatic SEO.
 * This is a protected admin endpoint — rate limited heavily.
 */
export default defineAdminMutation(
  {
    rateLimit: SEED_POPULAR_RATE,
  },
  async () => {
    const popularDomains = [
      // Tech
      'google.com',
      'apple.com',
      'microsoft.com',
      'amazon.com',
      'meta.com',
      'github.com',
      'stackoverflow.com',
      'npmjs.com',
      'vercel.com',
      'netlify.com',
      'cloudflare.com',
      'digitalocean.com',
      'heroku.com',
      'gitlab.com',
      'bitbucket.org',
      // Social
      'twitter.com',
      'reddit.com',
      'linkedin.com',
      'discord.com',
      'instagram.com',
      'facebook.com',
      'tiktok.com',
      'pinterest.com',
      'tumblr.com',
      'mastodon.social',
      // News
      'bbc.com',
      'nytimes.com',
      'theguardian.com',
      'techcrunch.com',
      'arstechnica.com',
      'wired.com',
      'theverge.com',
      'cnn.com',
      'reuters.com',
      'bloomberg.com',
      // E-commerce
      'shopify.com',
      'stripe.com',
      'ebay.com',
      'etsy.com',
      'walmart.com',
      'target.com',
      'bestbuy.com',
      'newegg.com',
      'alibaba.com',
      'wish.com',
      // Entertainment
      'spotify.com',
      'netflix.com',
      'youtube.com',
      'twitch.tv',
      'soundcloud.com',
      'hulu.com',
      'disneyplus.com',
      'hbomax.com',
      'crunchyroll.com',
      'imdb.com',
      // Dev Tools
      'docker.com',
      'kubernetes.io',
      'figma.com',
      'notion.so',
      'slack.com',
      'trello.com',
      'jira.com',
      'confluence.com',
      'postman.com',
      'insomnia.rest',
      // Education
      'wikipedia.org',
      'medium.com',
      'dev.to',
      'hashnode.dev',
      'freecodecamp.org',
      'coursera.org',
      'udemy.com',
      'khanacademy.org',
      'edx.org',
      'codecademy.com',
      // SaaS
      'salesforce.com',
      'hubspot.com',
      'zendesk.com',
      'intercom.com',
      'mailchimp.com',
      'dropbox.com',
      'box.com',
      'zoom.us',
      'webex.com',
      'teams.microsoft.com',
      // Other popular
      'wordpress.com',
      'squarespace.com',
      'wix.com',
      'godaddy.com',
      'namecheap.com',
      'archive.org',
      'producthunt.com',
      'dribbble.com',
      'behance.net',
      'unsplash.com',
      // Finance
      'paypal.com',
      'wise.com',
      'revolut.com',
      'coinbase.com',
      'binance.com',
      'robinhood.com',
      'schwab.com',
      'fidelity.com',
      'vanguard.com',
      'chase.com',
      // Gaming
      'steampowered.com',
      'epicgames.com',
      'roblox.com',
      'minecraft.net',
      'ea.com',
      'playstation.com',
      'xbox.com',
      'nintendo.com',
      'itch.io',
      'gog.com',
      // Health
      'webmd.com',
      'mayoclinic.org',
      'healthline.com',
      'nih.gov',
      'who.int',
      // Travel
      'booking.com',
      'airbnb.com',
      'expedia.com',
      'tripadvisor.com',
      'kayak.com',
      // Food
      'doordash.com',
      'ubereats.com',
      'grubhub.com',
      'yelp.com',
      'allrecipes.com',
      // Government & Org
      'whitehouse.gov',
      'un.org',
      'nasa.gov',
      'weather.gov',
      'si.edu',
    ]

    let checked = 0
    let errors = 0
    const results: Array<{ domain: string; status: string }> = []

    for (const domain of popularDomains) {
      try {
        await $fetch('/api/favicon', {
          params: { url: `https://${domain}` },
        })
        checked++
        results.push({ domain, status: 'ok' })
      } catch {
        errors++
        results.push({ domain, status: 'error' })
      }

      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    return {
      total: popularDomains.length,
      checked,
      errors,
      results,
    }
  },
)
