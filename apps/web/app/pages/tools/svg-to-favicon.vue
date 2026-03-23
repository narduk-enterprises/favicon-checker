<script setup lang="ts">
useSeo({
  title: 'SVG to Favicon Converter — Generate All Sizes from SVG (Free)',
  description:
    'Convert any SVG to all required favicon sizes. Upload your SVG and get 16×16, 32×32, 180×180, and more — all in PNG. Free, client-side.',
  ogImage: {
    title: 'SVG to Favicon Converter',
    description: 'Upload an SVG, get every favicon size as PNG — instantly.',
    icon: 'i-lucide-file-code',
  },
})

useWebPageSchema({
  name: 'SVG to Favicon Converter — Generate All Sizes from SVG',
  description:
    'Convert any SVG to all required favicon sizes including 16×16, 32×32, 180×180, 192×192, and 512×512 — all in PNG format.',
})

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'Favicon Checker', item: '/' },
      { name: 'Favicon Generator', item: '/generator' },
      { name: 'SVG to Favicon', item: '/tools/svg-to-favicon' },
    ],
  }),
])

useFAQSchema([
  {
    question: 'Can I convert an SVG to a favicon?',
    answer:
      'Yes! Upload any SVG file and this tool generates all standard favicon sizes (16×16, 32×32, 48×48, 180×180, 192×192, 512×512) as PNG images — entirely in your browser.',
  },
  {
    question: 'Why use SVG for favicons?',
    answer:
      'SVG favicons scale perfectly at any size, support dark mode via CSS media queries, and have tiny file sizes. They are the recommended format for modern browsers (Chrome, Firefox, Edge).',
  },
  {
    question: 'Is my SVG uploaded to a server?',
    answer:
      'No. Everything happens in your browser using the Canvas API. Your file never leaves your device.',
  },
])

useScrollReveal()

const sizes = [16, 32, 48, 180, 192, 512]
const generated = ref<Array<{ size: number; dataUrl: string }>>([])
const svgSource = ref('')

function handleFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const data = e.target?.result as string
    svgSource.value = data
    renderAllSizes(data)
  }
  reader.readAsDataURL(file)
}

function renderAllSizes(svgDataUrl: string) {
  const results: Array<{ size: number; dataUrl: string }> = []
  let loaded = 0

  for (const size of sizes) {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, size, size)
        results.push({ size, dataUrl: canvas.toDataURL('image/png') })
      }
      loaded++
      if (loaded === sizes.length) {
        generated.value = results.sort((a, b) => a.size - b.size)
      }
    }
    img.src = svgDataUrl
  }
}

function download(fav: { size: number; dataUrl: string }) {
  const link = document.createElement('a')
  link.href = fav.dataUrl
  link.download = fav.size === 180 ? 'apple-touch-icon.png' : `favicon-${fav.size}x${fav.size}.png`
  link.click()
}
function clampSize(size: number, max: number): string {
  return `${Math.min(size, max)}px`
}

function faviconStyle(size: number) {
  return { width: clampSize(size, 48), height: clampSize(size, 48) }
}

function resetTool() {
  generated.value = []
  svgSource.value = ''
}
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero -->
    <section
      class="hero-glow relative overflow-hidden bg-linear-to-b from-primary-50 to-transparent pb-8 pt-16 dark:from-primary-950/30 dark:to-transparent"
    >
      <div class="animated-gradient-bg absolute inset-0 opacity-50" />
      <div class="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <NuxtLink to="/" class="group mb-4 inline-flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Favicon Checker"
            class="size-10 drop-shadow-lg transition-transform group-hover:scale-105"
          />
          <span class="font-display text-xl font-bold text-default">Favicon Checker</span>
        </NuxtLink>
        <h1
          class="animate-slide-up font-display text-3xl font-extrabold tracking-tight text-default sm:text-4xl"
        >
          SVG to
          <span class="bg-linear-to-r from-primary-500 to-primary-300 bg-clip-text text-transparent"
            >Favicon</span
          >
        </h1>
        <p class="stagger-2 mt-3 animate-slide-up text-lg text-muted">
          Upload an SVG and get every favicon size as PNG — instantly.
        </p>
      </div>
    </section>

    <!-- Tool -->
    <section class="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div v-if="generated.length === 0" class="card-base rounded-2xl p-8 text-center">
        <!-- eslint-disable-next-line narduk/no-native-form -- hidden file input wrapped in label for custom styling; no UFormField equivalent for file uploads -->
        <label
          class="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-default p-8 transition-colors hover:border-primary-500 hover:bg-primary-50/30 dark:hover:bg-primary-950/20"
        >
          <UIcon name="i-lucide-image" class="mb-3 size-10 text-primary-500" />
          <span class="font-semibold text-default">Choose an SVG file</span>
          <span class="mt-1 text-sm text-muted">We'll generate all standard favicon sizes</span>
          <!-- eslint-disable-next-line narduk/no-native-input -- hidden file input with @change handler; UInput does not support type="file" -->
          <input type="file" accept=".svg,image/svg+xml" class="hidden" @change="handleFile" />
        </label>
      </div>

      <div v-else class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-default">{{ generated.length }} Sizes Generated</h2>
          <UButton
            variant="outline"
            icon="i-lucide-refresh-cw"
            class="press-effect"
            @click="resetTool"
          >
            New SVG
          </UButton>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="fav in generated"
            :key="fav.size"
            class="card-interactive rounded-2xl p-5 text-center"
          >
            <div
              class="mb-3 flex items-center justify-center rounded-xl bg-elevated p-4"
              style="min-height: 64px"
            >
              <img
                :src="fav.dataUrl"
                :alt="`${fav.size}×${fav.size}`"
                :style="faviconStyle(fav.size)"
                class="object-contain"
              />
            </div>
            <p class="font-mono font-bold text-primary-500">{{ fav.size }}×{{ fav.size }}</p>
            <UButton
              variant="soft"
              size="sm"
              icon="i-lucide-download"
              class="press-effect mt-3 w-full"
              @click="download(fav)"
            >
              Download
            </UButton>
          </div>
        </div>
      </div>

      <div class="mt-8 text-center space-y-2">
        <div class="flex flex-wrap items-center justify-center gap-1">
          <UButton variant="link" to="/generator" icon="i-lucide-image" size="sm">
            Full favicon generator
          </UButton>
          <span class="text-dimmed">·</span>
          <UButton variant="link" to="/tools/ico-to-png" icon="i-lucide-refresh-cw" size="sm">
            ICO to PNG
          </UButton>
          <span class="text-dimmed">·</span>
          <UButton variant="link" to="/tools/favicon-size-checker" icon="i-lucide-ruler" size="sm">
            Size checker
          </UButton>
        </div>
        <div>
          <UButton variant="link" to="/" icon="i-lucide-search" size="sm">
            Check any website's favicon
          </UButton>
        </div>
      </div>
    </section>

    <ScrollToTop />
  </div>
</template>
