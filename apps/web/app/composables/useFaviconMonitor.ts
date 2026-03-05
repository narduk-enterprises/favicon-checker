interface WatchedDomain {
  domain: string
  addedAt: string
  lastCheck?: {
    faviconCount: number
    auditScore: number
    checkedAt: string
  }
  currentCheck?: {
    faviconCount: number
    auditScore: number
    checkedAt: string
  }
  hasChange: boolean
}

export function useFaviconMonitor() {
  const watchlist = useState<WatchedDomain[]>('favicon-watchlist', () => [])
  const isChecking = ref<string | null>(null)

  function loadFromStorage() {
    if (import.meta.client) {
      try {
        const stored = localStorage.getItem('favicon-watchlist')
        if (stored) watchlist.value = JSON.parse(stored)
      }
      catch {
        // ignore malformed data
      }
    }
  }

  function saveWatchlist() {
    if (import.meta.client) {
      localStorage.setItem('favicon-watchlist', JSON.stringify(watchlist.value))
    }
  }

  function addDomain(input: string) {
    let domain = input.trim().toLowerCase()
    if (!domain) return
    domain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '')
    if (watchlist.value.some(w => w.domain === domain)) return

    watchlist.value.push({
      domain,
      addedAt: new Date().toISOString(),
      hasChange: false,
    })
    saveWatchlist()
  }

  function removeDomain(domain: string) {
    watchlist.value = watchlist.value.filter(w => w.domain !== domain)
    saveWatchlist()
  }

  async function checkDomain(entry: WatchedDomain) {
    isChecking.value = entry.domain
    try {
      const result = await $fetch<{ faviconCount: number, auditScore: number, checkedAt: string }>(`/api/domain/${entry.domain}`)
      const previous = entry.currentCheck
      entry.currentCheck = {
        faviconCount: result.faviconCount,
        auditScore: result.auditScore ?? 0,
        checkedAt: result.checkedAt,
      }
      if (previous) {
        entry.lastCheck = previous
        entry.hasChange = previous.faviconCount !== result.faviconCount || previous.auditScore !== (result.auditScore ?? 0)
      }
      saveWatchlist()
    }
    catch {
      // Domain not yet checked
    }
    finally {
      isChecking.value = null
    }
  }

  return {
    watchlist,
    isChecking,
    loadFromStorage,
    addDomain,
    removeDomain,
    checkDomain,
  }
}
