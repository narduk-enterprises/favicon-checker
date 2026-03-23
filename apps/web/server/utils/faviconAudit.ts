interface AuditCheck {
  name: string
  passed: boolean
  weight: number
  detail: string
}

interface AuditResult {
  score: number
  checks: AuditCheck[]
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F'
}

interface AuditableFavicon {
  type: string
  sizes: string
  source: string
  dataUrl: string | null
}

function gradeFromScore(score: number): AuditResult['grade'] {
  if (score >= 95) return 'A+'
  if (score >= 80) return 'A'
  if (score >= 65) return 'B'
  if (score >= 50) return 'C'
  if (score >= 30) return 'D'
  return 'F'
}

/**
 * Evaluate favicon completeness and return a 0–100 audit score.
 * Each check has a weight; the score is (earned / total) × 100.
 */
export function computeAuditScore(favicons: AuditableFavicon[]): AuditResult {
  const checks: AuditCheck[] = []

  // 1. Has at least one favicon (weight: 20)
  const hasAny = favicons.length > 0
  checks.push({
    name: 'Has Favicon',
    passed: hasAny,
    weight: 20,
    detail: hasAny
      ? `${favicons.length} favicon(s) detected`
      : 'No favicons found — add at least one',
  })

  // 2. Has ICO (weight: 10)
  const hasIco = favicons.some(
    (f) =>
      f.type.includes('x-icon') ||
      f.type.includes('vnd.microsoft.icon') ||
      f.source === '/favicon.ico',
  )
  checks.push({
    name: 'ICO Fallback',
    passed: hasIco,
    weight: 10,
    detail: hasIco
      ? '/favicon.ico present for legacy support'
      : 'Missing /favicon.ico — older browsers need this',
  })

  // 3. Has PNG (weight: 10)
  const hasPng = favicons.some((f) => f.type.includes('png'))
  checks.push({
    name: 'PNG Format',
    passed: hasPng,
    weight: 10,
    detail: hasPng
      ? 'PNG favicon found for modern browsers'
      : 'No PNG favicon — recommended for crisp rendering',
  })

  // 4. Has SVG (weight: 10)
  const hasSvg = favicons.some((f) => f.type.includes('svg'))
  checks.push({
    name: 'SVG Format',
    passed: hasSvg,
    weight: 10,
    detail: hasSvg
      ? 'SVG favicon for perfect scaling & dark mode'
      : 'No SVG — consider adding for sharp rendering at any size',
  })

  // 5. Has Apple Touch Icon (weight: 15)
  const hasApple = favicons.some((f) => f.source.includes('apple'))
  checks.push({
    name: 'Apple Touch Icon',
    passed: hasApple,
    weight: 15,
    detail: hasApple
      ? 'Apple Touch Icon present for iOS'
      : 'Missing Apple Touch Icon — iOS will screenshot your page instead',
  })

  // 6. Has manifest icons (weight: 10)
  const hasManifest = favicons.some((f) => f.source === 'manifest')
  checks.push({
    name: 'Web Manifest Icons',
    passed: hasManifest,
    weight: 10,
    detail: hasManifest
      ? 'Manifest icons for Android/PWA installs'
      : 'No manifest icons — Android home screen will use a generic icon',
  })

  // 7. Has 32×32 or larger (weight: 10)
  const hasLarge = favicons.some((f) => {
    if (!f.sizes) return false
    const size = Number.parseInt(f.sizes.split('x')[0] || '0')
    return size >= 32
  })
  checks.push({
    name: 'High-DPI Size (32×32+)',
    passed: hasLarge,
    weight: 10,
    detail: hasLarge
      ? 'High-DPI favicon size available'
      : 'Only small sizes found — add 32×32+ for Retina displays',
  })

  // 8. Multiple sizes (weight: 15)
  const uniqueSizes = new Set(favicons.map((f) => f.sizes).filter(Boolean))
  const hasMultiple = uniqueSizes.size >= 3
  checks.push({
    name: 'Multiple Sizes',
    passed: hasMultiple,
    weight: 15,
    detail: hasMultiple
      ? `${uniqueSizes.size} different sizes — good coverage`
      : `Only ${uniqueSizes.size} size(s) — provide at least 3 (16, 32, 180+)`,
  })

  const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0)
  const earnedWeight = checks.reduce((sum, c) => sum + (c.passed ? c.weight : 0), 0)
  const score = Math.round((earnedWeight / totalWeight) * 100)

  return {
    score,
    checks,
    grade: gradeFromScore(score),
  }
}
