import { $fetch } from 'ofetch'

const SITE_URL = process.env.SITE_URL || 'http://localhost:3000'

async function checkUrl(path: string) {
  console.log(`Checking ${SITE_URL}${path}...`)
  try {
    const html = await $fetch<string>(path, { baseURL: SITE_URL })
    
    const checks = {
      title: html.includes('<title>'),
      metaDesc: html.includes('name="description"'),
      canonical: html.includes('rel="canonical"'),
      ogTitle: html.includes('property="og:title"'),
      twitterCard: html.includes('name="twitter:card"'),
      schema: html.includes('type="application/ld+json"')
    }
    
    const failed = Object.entries(checks).filter(([_, passed]) => !passed)
    if (failed.length > 0) {
      console.error(`❌ ${path} failed checks: ${failed.map(f => f[0]).join(', ')}`)
      return false
    }
    console.log(`✅ ${path} passed all SEO metadata checks.`)
    return true
  } catch (err: unknown) {
    console.error(`❌ Failed to fetch ${path}:`, (err as Error).message)
    return false
  }
}

async function verifyRobotsAndSitemap() {
  console.log('Checking /robots.txt and /sitemap.xml...')
  try {
    const robots = await $fetch<string>('/robots.txt', { baseURL: SITE_URL })
    if (!robots.includes('User-agent: *')) throw new Error('Invalid robots.txt')
    console.log('✅ robots.txt is valid.')

    const sitemap = await $fetch<string>('/sitemap.xml', { baseURL: SITE_URL })
    if (!sitemap.includes('<?xml')) throw new Error('Invalid sitemap.xml')
    console.log('✅ sitemap.xml is valid.')

    return true
  } catch (err: unknown) {
    console.error('❌ Crawl endpoint check failed:', (err as Error).message)
    return false
  }
}

async function main() {
  let allPassed = true
  
  const crawlEndpointsPassed = await verifyRobotsAndSitemap()
  if (!crawlEndpointsPassed) allPassed = false

  const urls = ['/', '/batch']
  for (const url of urls) {
    const passed = await checkUrl(url)
    if (!passed) allPassed = false
  }

  if (!allPassed) {
    console.error('\n🚨 SEO Verification Failed! Deployment blocked.')
    process.exit(1)
  }

  console.log('\n✨ All SEO checks passed successfully.')
}

main()
