import { z } from 'zod'
import { faviconChecks } from '#server/database/schema'

interface DiscoveredFavicon {
  href: string
  type: string
  sizes: string
  source: string
  dataUrl: string | null
}

const querySchema = z.object({
  url: z.string().url('Must be a valid URL').refine(
    (u) => u.startsWith('http://') || u.startsWith('https://'),
    'URL must start with http:// or https://',
  ),
})

/**
 * Resolve a potentially relative favicon href to an absolute URL.
 */
function resolveUrl(href: string, baseUrl: string): string {
  try {
    return new URL(href, baseUrl).href
  }
  catch {
    return href
  }
}

/**
 * Fetch a favicon image and convert to a base64 data URL.
 * Returns null if the fetch fails.
 */
async function fetchAsDataUrl(url: string): Promise<{ dataUrl: string | null, type: string }> {
  try {
    const cacheBuster = `_fc=${Date.now()}`
    const separator = url.includes('?') ? '&' : '?'
    const response = await fetch(`${url}${separator}${cacheBuster}`, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'FaviconChecker/1.0 (+https://favicon-checker.narduk.workers.dev)',
      },
    })

    if (!response.ok) return { dataUrl: null, type: '' }

    const contentType = response.headers.get('content-type') || 'image/x-icon'
    const buffer = await response.arrayBuffer()

    if (buffer.byteLength === 0) return { dataUrl: null, type: contentType }

    // Convert to base64 data URL
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]!)
    }
    const base64 = btoa(binary)
    return {
      dataUrl: `data:${contentType};base64,${base64}`,
      type: contentType,
    }
  }
  catch {
    return { dataUrl: null, type: '' }
  }
}

/**
 * Parse HTML to find favicon references in <link> tags and <link rel="manifest">.
 */
function parseFaviconLinks(html: string, baseUrl: string): Array<{ href: string, source: string, sizes: string }> {
  const results: Array<{ href: string, source: string, sizes: string }> = []
  const seen = new Set<string>()

  // Match <link> tags with rel containing 'icon'
  const linkRegex = /<link\s[^>]*>/gi
  let match: RegExpExecArray | null

  match = linkRegex.exec(html)
  while (match !== null) {
    const tag = match[0]

    const relMatch = /rel=["']([^"']*)["']/i.exec(tag)
    const rel = relMatch?.[1]?.toLowerCase() || ''

    if (rel.includes('icon') || rel === 'apple-touch-icon') {
      const hrefMatch = /href=["']([^"']*)["']/i.exec(tag)
      const sizesMatch = /sizes=["']([^"']*)["']/i.exec(tag)

      if (hrefMatch?.[1]) {
        const absoluteHref = resolveUrl(hrefMatch[1], baseUrl)
        if (!seen.has(absoluteHref)) {
          seen.add(absoluteHref)

          let source = 'link[rel=icon]'
          if (rel.includes('apple-touch-icon')) source = 'link[rel=apple-touch-icon]'
          else if (rel.includes('shortcut')) source = 'link[rel=shortcut icon]'

          results.push({
            href: absoluteHref,
            source,
            sizes: sizesMatch?.[1] || '',
          })
        }
      }
    }

    match = linkRegex.exec(html)
  }

  return results
}

/**
 * Try finding a manifest.json and extracting icon entries.
 */
async function parseManifestIcons(html: string, baseUrl: string): Promise<Array<{ href: string, source: string, sizes: string }>> {
  const results: Array<{ href: string, source: string, sizes: string }> = []

  const manifestMatch = /<link\s[^>]*rel=["']manifest["'][^>]*href=["']([^"']*)["'][^>]*>/i.exec(html)
    || /<link\s[^>]*href=["']([^"']*)["'][^>]*rel=["']manifest["'][^>]*>/i.exec(html)

  if (!manifestMatch?.[1]) return results

  try {
    const manifestUrl = resolveUrl(manifestMatch[1], baseUrl)
    const response = await fetch(manifestUrl, { cache: 'no-store' })
    if (!response.ok) return results

    const manifest = await response.json() as { icons?: Array<{ src: string, sizes?: string, type?: string }> }
    if (!manifest.icons || !Array.isArray(manifest.icons)) return results

    for (const icon of manifest.icons) {
      if (icon.src) {
        results.push({
          href: resolveUrl(icon.src, manifestUrl),
          source: 'manifest',
          sizes: icon.sizes || '',
        })
      }
    }
  }
  catch {
    // Manifest fetch failed, skip
  }

  return results
}

export default defineEventHandler(async (event) => {
  // Rate limit: 10 checks per minute
  await enforceRateLimit(event, 'favicon-check', 10, 60_000)

  const query = getQuery(event)
  const parsed = querySchema.safeParse(query)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: parsed.error.issues[0]?.message || 'Invalid URL parameter',
    })
  }

  const targetUrl = parsed.data.url
  const urlObj = new URL(targetUrl)
  const baseUrl = `${urlObj.protocol}//${urlObj.host}`

  // Fetch the target page HTML
  let html = ''
  try {
    const response = await fetch(targetUrl, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'FaviconChecker/1.0 (+https://favicon-checker.narduk.workers.dev)',
        'Accept': 'text/html',
      },
    })
    html = await response.text()
  }
  catch {
    throw createError({
      statusCode: 502,
      message: `Could not reach ${urlObj.hostname}. The site may be down or blocking requests.`,
    })
  }

  // Discover favicons
  const discovered: Array<{ href: string, source: string, sizes: string }> = []

  // 1. Parse <link> tags
  const linkFavicons = parseFaviconLinks(html, baseUrl)
  discovered.push(...linkFavicons)

  // 2. Check /favicon.ico at root
  const faviconIcoUrl = `${baseUrl}/favicon.ico`
  if (!discovered.some(f => f.href === faviconIcoUrl)) {
    discovered.push({
      href: faviconIcoUrl,
      source: '/favicon.ico',
      sizes: '',
    })
  }

  // 3. Check manifest icons
  const manifestIcons = await parseManifestIcons(html, baseUrl)
  discovered.push(...manifestIcons)

  // Fetch each favicon and convert to data URL (batched via Promise.all)
  /* eslint-disable nuxt-guardrails/no-map-async-in-server -- concurrent HTTP fetches, not N+1 DB queries */
  const favicons: DiscoveredFavicon[] = await Promise.all(
    discovered.map(async (item) => {
      const { dataUrl, type } = await fetchAsDataUrl(item.href)
      return {
        href: item.href,
        type: type || 'image/x-icon',
        sizes: item.sizes,
        source: item.source,
        dataUrl,
      }
    }),
  )
  /* eslint-enable nuxt-guardrails/no-map-async-in-server */

  // Filter out favicons that couldn't be fetched
  const validFavicons = favicons.filter(f => f.dataUrl !== null)

  const checkedAt = new Date().toISOString()

  // Save to database
  try {
    const db = useAppDatabase(event)
    await db.insert(faviconChecks).values({
      url: targetUrl,
      domain: urlObj.hostname,
      faviconCount: validFavicons.length,
      checkedAt,
    })
  }
  catch {
    // Database save is best-effort, don't block the response
  }

  return {
    url: targetUrl,
    favicons: validFavicons,
    checkedAt,
  }
})
