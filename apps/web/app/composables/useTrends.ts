interface TrendsData {
  totalDomains: number
  avgFaviconCount: number
  avgAuditScore: number
  withIco: number
  withPng: number
  withSvg: number
  withApple: number
  withManifest: number
}

const defaultTrends: TrendsData = {
  totalDomains: 0,
  avgFaviconCount: 0,
  avgAuditScore: 0,
  withIco: 0,
  withPng: 0,
  withSvg: 0,
  withApple: 0,
  withManifest: 0,
}

export function useTrends() {
  return useFetch<TrendsData>('/api/stats/trends', {
    key: 'favicon-trends',
    default: () => ({ ...defaultTrends }),
  })
}
