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

export function useDomainCheck(domain: Ref<string> | string) {
  const domainValue = typeof domain === 'string' ? domain : domain.value

  return useFetch<DomainFaviconResult>(`/api/domain/${domainValue}`, {
    key: `domain-${domainValue}`,
  })
}
