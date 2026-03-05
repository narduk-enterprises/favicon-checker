interface Favicon {
  href: string
  type: string
  sizes: string
  source: string
  dataUrl: string
}

interface AuditCheck {
  name: string
  passed: boolean
  weight: number
  detail: string
}

interface FaviconResult {
  url: string
  favicons: Favicon[]
  auditScore: number
  auditGrade: string
  auditChecks: AuditCheck[]
  checkedAt: string
}

interface RecentCheck {
  id: number
  domain: string
  url: string
  faviconCount: number
  checkedAt: string
}

export function useFaviconChecker() {
  const urlInput = ref('')
  const isChecking = ref(false)
  const result = ref<FaviconResult | null>(null)
  const error = ref<string | null>(null)

  const { data: recentChecks, refresh: refreshRecent } = useAsyncData('recent-checks', () => $fetch<RecentCheck[]>('/api/recent'), {
    default: () => [],
  })

  function normalizeUrl(input: string): string {
    let url = input.trim()
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`
    }
    return url
  }

  async function checkFavicon() {
    if (!urlInput.value.trim()) return

    isChecking.value = true
    error.value = null
    result.value = null

    try {
      const url = normalizeUrl(urlInput.value)
      const data = await $fetch<FaviconResult>('/api/favicon', {
        params: { url },
      })
      result.value = data
      await refreshRecent()
    }
    catch (err: unknown) {
      const fetchError = err as { data?: { message?: string }, message?: string }
      error.value = fetchError.data?.message || fetchError.message || 'Something went wrong. Please try again.'
    }
    finally {
      isChecking.value = false
    }
  }

  function recheckUrl(url: string) {
    urlInput.value = url
    checkFavicon()
  }

  return {
    urlInput,
    isChecking,
    result,
    error,
    recentChecks,
    checkFavicon,
    recheckUrl,
  }
}

export type { Favicon, FaviconResult, RecentCheck }
