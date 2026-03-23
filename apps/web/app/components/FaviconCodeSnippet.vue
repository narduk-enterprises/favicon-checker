<script setup lang="ts">
import type { Favicon } from '~/composables/useFaviconChecker'
import { useClipboard } from '@vueuse/core'

const props = defineProps<{
  favicons: Favicon[]
  domain?: string
}>()

const showManifest = ref(false)

const htmlCode = computed(() => {
  const lines: string[] = []
  for (const f of props.favicons) {
    if (f.source.includes('apple')) {
      lines.push(`<link rel="apple-touch-icon" sizes="${f.sizes || '180x180'}" href="${f.href}">`)
    } else if (f.source === 'manifest') {
      // Skip manifest entries from HTML — they go in manifest section
    } else if (f.source === '/favicon.ico') {
      lines.push(`<link rel="icon" href="/favicon.ico" sizes="any">`)
    } else {
      const type = f.type || 'image/png'
      const sizes = f.sizes ? ` sizes="${f.sizes}"` : ''
      lines.push(`<link rel="icon" type="${type}"${sizes} href="${f.href}">`)
    }
  }
  return lines.join('\n')
})

const manifestCode = computed(() => {
  const icons = props.favicons
    .filter((f) => f.source === 'manifest')
    .map((f) => ({
      src: f.href,
      sizes: f.sizes || '192x192',
      type: f.type || 'image/png',
    }))

  if (icons.length === 0) return ''

  return JSON.stringify({ icons }, null, 2)
})

const { copy: copyHtml, copied: htmlCopied } = useClipboard({ source: htmlCode })
const { copy: copyManifest, copied: manifestCopied } = useClipboard({ source: manifestCode })
</script>

<template>
  <div class="card-base rounded-2xl p-6">
    <h3 class="mb-4 text-lg font-semibold text-default">
      <UIcon name="i-lucide-code" class="mr-2 inline-block size-5 align-middle text-primary-500" />
      Favicon HTML Code
    </h3>

    <p class="mb-3 text-sm text-muted">
      Copy this into your <code class="rounded bg-elevated px-1">&lt;head&gt;</code> tag{{
        domain ? ` to match ${domain}'s favicon setup` : ''
      }}:
    </p>

    <div class="relative">
      <pre
        class="overflow-x-auto rounded-xl bg-elevated p-4 text-sm text-muted"
      ><code>{{ htmlCode }}</code></pre>
      <UButton
        variant="soft"
        size="xs"
        :icon="htmlCopied ? 'i-lucide-check' : 'i-lucide-copy'"
        class="absolute right-2 top-2"
        @click="copyHtml(htmlCode)"
      >
        {{ htmlCopied ? 'Copied!' : 'Copy' }}
      </UButton>
    </div>

    <!-- Manifest section -->
    <div v-if="manifestCode" class="mt-4">
      <UButton
        variant="link"
        size="sm"
        :icon="showManifest ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
        @click="showManifest = !showManifest"
      >
        {{ showManifest ? 'Hide' : 'Show' }} Manifest JSON
      </UButton>

      <div v-if="showManifest" class="relative mt-2">
        <pre
          class="overflow-x-auto rounded-xl bg-elevated p-4 text-sm text-muted"
        ><code>{{ manifestCode }}</code></pre>
        <UButton
          variant="soft"
          size="xs"
          :icon="manifestCopied ? 'i-lucide-check' : 'i-lucide-copy'"
          class="absolute right-2 top-2"
          @click="copyManifest(manifestCode)"
        >
          {{ manifestCopied ? 'Copied!' : 'Copy' }}
        </UButton>
      </div>
    </div>
  </div>
</template>
