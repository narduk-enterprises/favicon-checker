import type { FaviconResult } from './useFaviconChecker'

interface BatchResult {
  url: string
  result: FaviconResult | null
  error: string | null
  status: 'pending' | 'checking' | 'done' | 'error'
}

export function useBatchFaviconChecker() {
  const batchInput = ref('')
  const isProcessing = ref(false)
  const batchResults = ref<BatchResult[]>([])
  const progress = computed(() => {
    if (batchResults.value.length === 0) return 0
    const completed = batchResults.value.filter(
      (r) => r.status === 'done' || r.status === 'error',
    ).length
    return Math.round((completed / batchResults.value.length) * 100)
  })

  function normalizeUrl(input: string): string {
    let url = input.trim()
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`
    }
    return url
  }

  function parseUrls(input: string): string[] {
    const trimmed = input.trim()
    if (!trimmed) return []

    // Try JSON array first
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed) as unknown
        if (Array.isArray(parsed)) {
          return parsed
            .map((item: unknown) => (typeof item === 'string' ? item.trim() : ''))
            .filter((url: string) => url.length > 0)
        }
      } catch {
        // Not valid JSON, fall through
      }
    }

    // Try comma-separated (only if it contains commas but no newlines)
    if (trimmed.includes(',') && !trimmed.includes('\n')) {
      return trimmed
        .split(',')
        .map((url) => url.trim())
        .filter((url) => url.length > 0)
    }

    // Default: newline-delimited
    return trimmed
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => url.length > 0)
  }

  async function checkBatch() {
    const urls = parseUrls(batchInput.value)
    if (urls.length === 0) return

    // Cap at 20 URLs max
    const capped = urls.slice(0, 20)

    isProcessing.value = true
    batchResults.value = capped.map((url) => ({
      url: normalizeUrl(url),
      result: null,
      error: null,
      status: 'pending' as const,
    }))

    // Process 3 at a time to avoid overloading the server
    const concurrency = 3
    let index = 0

    async function processNext() {
      while (index < batchResults.value.length) {
        const i = index++
        const entry = batchResults.value[i]
        if (!entry) continue
        entry.status = 'checking'

        try {
          const data = await $fetch<FaviconResult>('/api/favicon', {
            params: { url: entry.url },
          })
          entry.result = data
          entry.status = 'done'
        } catch (err: unknown) {
          const fetchError = err as { data?: { message?: string }; message?: string }
          entry.error = fetchError.data?.message || fetchError.message || 'Failed to check'
          entry.status = 'error'
        }
      }
    }

    await Promise.all(
      Array.from({ length: Math.min(concurrency, capped.length) }, () => processNext()),
    )

    isProcessing.value = false
  }

  function clearBatch() {
    batchResults.value = []
    batchInput.value = ''
  }

  return {
    batchInput,
    isProcessing,
    batchResults,
    progress,
    parseUrls,
    checkBatch,
    clearBatch,
  }
}
