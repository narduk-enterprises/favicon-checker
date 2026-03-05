export default defineEventHandler(async (event) => {
  const requestUrl = getRequestURL(event)
  try {
    type CFContext = { cloudflare?: { env?: { ASSETS?: { fetch: (req: Request | string) => Promise<Response> } } } }
    const cf = (event.context as unknown as CFContext).cloudflare
    


    // Try a few variations to see which one works
    const results = []
    
    // Variant 1: new Request with requestUrl.origin
    try {
      const res1 = await cf.env.ASSETS.fetch(new Request(`${requestUrl.origin}/favicon.ico`))
      results.push({ variant: 'new Request(origin)', status: res1.status, ok: res1.ok })
    } catch(e: unknown) {
      const err = e as { message?: string }
      results.push({ variant: 'new Request(origin)', error: err.message || String(e) })
    }

    // Variant 2: String with localhost
    try {
      const res2 = await cf.env.ASSETS.fetch('http://localhost/favicon.ico')
      results.push({ variant: 'string(localhost)', status: res2.status, ok: res2.ok })
    } catch(e: unknown) {
      const err = e as { message?: string }
      results.push({ variant: 'string(localhost)', error: err.message || String(e) })
    }

    // Variant 3: Nitro $fetch for HTML
    try {
      const html = await $fetch<string>('/')
      results.push({ variant: '$fetch(/)', success: typeof html === 'string', length: html.length })
    } catch(e: unknown) {
      const err = e as { message?: string }
      results.push({ variant: '$fetch(/)', error: err.message || String(e) })
    }

    // Variant 4: Nitro $fetch for Asset
    try {
      const svg = await $fetch<Blob>('/favicon.ico', { responseType: 'blob' })
      results.push({ variant: '$fetch(/favicon.ico)', success: !!svg, size: svg?.size })
    } catch(e: unknown) {
      const err = e as { message?: string }
      results.push({ variant: '$fetch(/favicon.ico)', error: err.message || String(e) })
    }

    return { success: true, results }
  } catch (e: unknown) {
    const err = e as { message?: string }
    return { success: false, error: err.message || String(e) }
  }
})
