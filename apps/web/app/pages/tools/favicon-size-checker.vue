<script setup lang="ts">
/* eslint-disable nuxt-guardrails/require-use-seo-on-pages, nuxt-guardrails/require-schema-on-pages */

useAppSeo({
  title: 'Favicon Size Checker — Verify Favicon Dimensions & Format (Free)',
  description: 'Upload a favicon and instantly check its dimensions, file format, file size, and transparency support. Free online favicon dimension checker.',
})

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'Favicon Checker', item: '/' },
      { name: 'Tools', item: '/tools/favicon-size-checker' },
      { name: 'Size Checker', item: '/tools/favicon-size-checker' },
    ],
  }),
])

useScrollReveal()

interface FileInfo {
  name: string
  width: number
  height: number
  fileSize: string
  format: string
  isSquare: boolean
  hasTransparency: boolean
  dataUrl: string
  recommendations: string[]
}

const result = ref<FileInfo | null>(null)

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

function detectFormat(file: File): string {
  const ext = file.name.split('.').pop()?.toLowerCase() || ''
  const typeMap: Record<string, string> = {
    ico: 'ICO', png: 'PNG', svg: 'SVG', gif: 'GIF', webp: 'WEBP', jpg: 'JPEG', jpeg: 'JPEG',
  }
  return typeMap[ext] || file.type.split('/')[1]?.toUpperCase() || 'Unknown'
}

function checkTransparency(canvas: HTMLCanvasElement): boolean {
  const ctx = canvas.getContext('2d')
  if (!ctx) return false
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
  for (let i = 3; i < data.length; i += 4) {
    if (data[i]! < 255) return true
  }
  return false
}

function handleFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.drawImage(img, 0, 0)

      const format = detectFormat(file)
      const isSquare = img.naturalWidth === img.naturalHeight
      const hasTransparency = checkTransparency(canvas)
      const recommendations: string[] = []

      if (!isSquare) recommendations.push('Favicons should be square. Consider cropping to a 1:1 ratio.')
      if (img.naturalWidth < 16) recommendations.push('Image is smaller than 16×16 — too small for a favicon.')
      if (img.naturalWidth < 512 && img.naturalWidth >= 16) recommendations.push('Consider providing a 512×512 version for PWA splash screens.')
      if (format === 'JPEG') recommendations.push('JPEG doesn\'t support transparency — convert to PNG or SVG.')
      if (file.size > 100000) recommendations.push('File is over 100KB — consider optimizing for faster page loads.')
      if (recommendations.length === 0) recommendations.push('This image looks great for use as a favicon! ✓')

      result.value = {
        name: file.name,
        width: img.naturalWidth,
        height: img.naturalHeight,
        fileSize: formatBytes(file.size),
        format,
        isSquare,
        hasTransparency,
        dataUrl: e.target?.result as string,
        recommendations,
      }
    }
    img.src = e.target?.result as string
  }
  reader.readAsDataURL(file)
}
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero -->
    <section class="hero-glow relative overflow-hidden bg-linear-to-b from-primary-50 to-transparent pb-8 pt-16 dark:from-primary-950/30 dark:to-transparent">
      <div class="animated-gradient-bg absolute inset-0 opacity-50" />
      <div class="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <NuxtLink to="/" class="group mb-4 inline-flex items-center gap-3">
          <img src="/logo.png" alt="Favicon Checker" class="size-10 drop-shadow-lg transition-transform group-hover:scale-105">
          <span class="font-display text-xl font-bold text-default">Favicon Checker</span>
        </NuxtLink>
        <h1 class="animate-slide-up font-display text-3xl font-extrabold tracking-tight text-default sm:text-4xl">
          Favicon
          <span class="bg-linear-to-r from-primary-500 to-primary-300 bg-clip-text text-transparent">Size Checker</span>
        </h1>
        <p class="stagger-2 mt-3 animate-slide-up text-lg text-muted">
          Check dimensions, format, file size, and transparency of any favicon image.
        </p>
      </div>
    </section>

    <!-- Tool -->
    <section class="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div class="card-base rounded-2xl p-8">
        <!-- eslint-disable-next-line atx/no-native-form -->
        <label class="mb-6 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-default p-8 transition-colors hover:border-primary-500 hover:bg-primary-50/30 dark:hover:bg-primary-950/20">
          <UIcon name="i-lucide-ruler" class="mb-3 size-10 text-primary-500" />
          <span class="font-semibold text-default">Upload a favicon to analyze</span>
          <span class="mt-1 text-sm text-muted">ICO, PNG, SVG, GIF, WEBP</span>
          <!-- eslint-disable-next-line atx/no-native-input -->
          <input type="file" accept="image/*,.ico" class="hidden" @change="handleFile">
        </label>

        <div v-if="result" class="space-y-4 animate-slide-up-sm">
          <!-- Preview -->
          <div class="flex items-center gap-4 rounded-xl bg-elevated p-4">
            <img :src="result.dataUrl" :alt="result.name" class="size-16 rounded-lg border border-default object-contain p-1">
            <div>
              <p class="font-semibold text-default">{{ result.name }}</p>
              <p class="text-sm text-muted">{{ result.format }} · {{ result.fileSize }}</p>
            </div>
          </div>

          <!-- Details -->
          <div class="grid grid-cols-2 gap-3">
            <div class="rounded-xl bg-elevated p-4 text-center">
              <p class="text-2xl font-bold text-primary-500">{{ result.width }}×{{ result.height }}</p>
              <p class="text-xs text-dimmed">Dimensions</p>
            </div>
            <div class="rounded-xl bg-elevated p-4 text-center">
              <p class="text-2xl font-bold text-primary-500">{{ result.format }}</p>
              <p class="text-xs text-dimmed">Format</p>
            </div>
            <div class="rounded-xl bg-elevated p-4 text-center">
              <UIcon
                :name="result.isSquare ? 'i-lucide-check-circle' : 'i-lucide-alert-triangle'"
                :class="result.isSquare ? 'text-success-500' : 'text-warning-500'"
                class="mx-auto size-6"
              />
              <p class="text-xs text-dimmed mt-1">{{ result.isSquare ? 'Square ✓' : 'Not Square ✗' }}</p>
            </div>
            <div class="rounded-xl bg-elevated p-4 text-center">
              <UIcon
                :name="result.hasTransparency ? 'i-lucide-check-circle' : 'i-lucide-x-circle'"
                :class="result.hasTransparency ? 'text-success-500' : 'text-dimmed'"
                class="mx-auto size-6"
              />
              <p class="text-xs text-dimmed mt-1">{{ result.hasTransparency ? 'Transparent ✓' : 'No Transparency' }}</p>
            </div>
          </div>

          <!-- Recommendations -->
          <div class="rounded-xl border border-default p-4">
            <h3 class="mb-2 font-semibold text-default">Recommendations</h3>
            <ul class="space-y-1">
              <li v-for="(rec, i) in result.recommendations" :key="i" class="flex items-start gap-2 text-sm text-muted">
                <UIcon name="i-lucide-lightbulb" class="mt-0.5 size-4 shrink-0 text-primary-500" />
                {{ rec }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="mt-8 text-center">
        <UButton variant="link" to="/" icon="i-lucide-search" size="sm">
          Check any website's favicon
        </UButton>
        <span class="mx-2 text-dimmed">·</span>
        <UButton variant="link" to="/generator" icon="i-lucide-image" size="sm">
          Generate favicons
        </UButton>
      </div>
    </section>

    <ScrollToTop />
  </div>
</template>
