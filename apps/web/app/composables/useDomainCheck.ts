import type { MaybeRefOrGetter } from 'vue'

interface DomainFaviconResult {
  domain: string
  url: string
  faviconCount: number
  auditScore: number
  auditGrade: string
  auditChecks: Array<{
    name: string
    passed: boolean
    weight: number
    detail: string
  }>
  checkedAt: string
  favicons: Array<{
    href: string
    type: string
    sizes: string
    source: string
    dataUrl: string
  }>
}

/** Reactive domain param so client navigations between /check/a and /check/b refetch. */
export function useDomainCheck(domain: MaybeRefOrGetter<string>) {
  const requestUrl = computed(() => `/api/domain/${toValue(domain)}`)

  return useFetch<DomainFaviconResult>(requestUrl, {
    key: computed(() => `domain-${toValue(domain)}`),
  })
}
