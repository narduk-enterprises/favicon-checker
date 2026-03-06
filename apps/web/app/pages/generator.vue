<script setup lang="ts">
/* eslint-disable nuxt-guardrails/require-use-seo-on-pages */

useAppSeo({
  title: 'Favicon Generator — Create All Sizes from One Image (Free)',
  description: 'Upload one image and generate all required favicon sizes instantly. Download ICO, PNG (16×16 to 512×512), Apple Touch Icon, and web manifest — all free, all client-side.',
})

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'Favicon Checker', item: '/' },
      { name: 'Generator', item: '/generator' },
    ],
  }),
])

useFAQSchema([
  {
    question: 'How does the favicon generator work?',
    answer: 'Upload any image and our tool resizes it to all required favicon sizes (16×16, 32×32, 48×48, 180×180, 192×192, 512×512) entirely in your browser. Nothing is uploaded to any server.',
  },
  {
    question: 'What image should I upload?',
    answer: 'Use a square image at least 512×512 pixels for best results. PNG with transparency works great. SVG is ideal since it scales perfectly.',
  },
])

useScrollReveal()

interface GeneratedFavicon {
  size: number
  label: string
  canvas: HTMLCanvasElement | null
  dataUrl: string
}

const sourceImage = ref<HTMLImageElement | null>(null)
const sourceDataUrl = ref<string>('')
const isDragging = ref(false)
const isGenerated = ref(false)

const sizes = [
  { size: 16, label: 'Browser tab (16×16)' },
  { size: 32, label: 'High-DPI tab (32×32)' },
  { size: 48, label: 'Windows icon (48×48)' },
  { size: 180, label: 'Apple Touch Icon (180×180)' },
  { size: 192, label: 'Android manifest (192×192)' },
  { size: 512, label: 'PWA splash (512×512)' },
]

const generated = ref<GeneratedFavicon[]>([])

function handleFile(file: File) {
  if (!file.type.startsWith('image/')) return

  const reader = new FileReader()
  reader.onload = (e) => {
    sourceDataUrl.value = e.target?.result as string
    const img = new Image()
    img.onload = () => {
      sourceImage.value = img
      generateAll(img)
    }
    img.src = sourceDataUrl.value
  }
  reader.readAsDataURL(file)
}

function onFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) handleFile(file)
}

function onDrop(event: DragEvent) {
  isDragging.value = false
  const file = event.dataTransfer?.files[0]
  if (file) handleFile(file)
}

function generateAll(img: HTMLImageElement) {
  const results: GeneratedFavicon[] = []

  for (const { size, label } of sizes) {
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, size, size)
    }
    results.push({
      size,
      label,
      canvas,
      dataUrl: canvas.toDataURL('image/png'),
    })
  }

  generated.value = results
  isGenerated.value = true
}

function downloadSingle(fav: GeneratedFavicon) {
  const link = document.createElement('a')
  link.href = fav.dataUrl
  link.download = fav.size === 180 ? 'apple-touch-icon.png' : `favicon-${fav.size}x${fav.size}.png`
  link.click()
}

async function downloadAll() {
  // Dynamic import to keep it client-side only and tree-shake on SSR
  const { default: JsZip } = await import('jszip')
  const zip = new JsZip()

  for (const fav of generated.value) {
    const base64 = fav.dataUrl.split(',')[1] ?? ''
    const filename = fav.size === 180 ? 'apple-touch-icon.png' : `favicon-${fav.size}x${fav.size}.png`
    zip.file(filename, base64, { base64: true })
  }

  // Add manifest
  const manifest = {
    name: 'Your App',
    short_name: 'App',
    icons: generated.value
      .filter(f => f.size === 192 || f.size === 512)
      .map(f => ({
        src: `/${f.size === 192 ? 'android-chrome-192x192' : 'android-chrome-512x512'}.png`,
        sizes: `${f.size}x${f.size}`,
        type: 'image/png',
      })),
    theme_color: 'var(--color-white, #fff)',
    background_color: 'var(--color-white, #fff)',
    display: 'standalone',
  }
  zip.file('site.webmanifest', JSON.stringify(manifest, null, 2))

  // Add HTML snippet
  const htmlSnippet = `<!-- Favicon HTML — paste into your <head> -->
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
`
  zip.file('favicon-html.txt', htmlSnippet)

  const blob = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'favicons.zip'
  link.click()
  URL.revokeObjectURL(url)
}

function clampSize(size: number, max: number): string {
  return `${Math.min(size, max)}px`
}

function faviconStyle(size: number) {
  return { width: clampSize(size, 64), height: clampSize(size, 64) }
}

function reset() {
  sourceImage.value = null
  sourceDataUrl.value = ''
  generated.value = []
  isGenerated.value = false
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
        <h1 class="animate-slide-up font-display text-3xl font-extrabold tracking-tight text-default sm:text-4xl lg:text-5xl">
          Favicon
          <span class="bg-linear-to-r from-primary-500 to-primary-300 bg-clip-text text-transparent">Generator</span>
        </h1>
        <p class="stagger-2 mt-3 animate-slide-up text-lg text-muted">
          Upload one image. Get every favicon size you need — instantly, in your browser.
        </p>
      </div>
    </section>

    <!-- Upload Area -->
    <section class="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <!-- Upload / Drop zone -->
      <div
        v-if="!isGenerated"
        class="card-interactive flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center transition-all"
        :class="isDragging ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/30' : 'border-default'"
        @dragover.prevent="isDragging = true"
        @dragleave="isDragging = false"
        @drop.prevent="onDrop"
        @click="($refs.fileInput as HTMLInputElement)?.click()"
      >
        <!-- eslint-disable-next-line atx/no-native-input -->
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileSelect">
        <UIcon name="i-lucide-upload" class="mb-4 size-12 text-primary-500" />
        <h2 class="mb-2 text-xl font-semibold text-default">
          Drop your image here
        </h2>
        <p class="text-muted">
          or click to browse. PNG, JPG, SVG — at least 512×512px recommended.
        </p>
      </div>

      <!-- Results -->
      <div v-if="isGenerated" class="space-y-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <img :src="sourceDataUrl" alt="Source image" class="size-16 rounded-xl border border-default object-contain p-1">
            <div>
              <h2 class="text-xl font-bold text-default">
                {{ generated.length }} Sizes Generated
              </h2>
              <p class="text-sm text-muted">
                Ready to download
              </p>
            </div>
          </div>
          <div class="flex gap-2">
            <UButton variant="outline" icon="i-lucide-refresh-cw" class="press-effect" @click="reset">
              New Image
            </UButton>
            <UButton icon="i-lucide-download" class="press-effect" @click="downloadAll">
              Download ZIP
            </UButton>
          </div>
        </div>

        <!-- Size grid -->
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="fav in generated"
            :key="fav.size"
            class="card-interactive rounded-2xl p-5"
          >
            <div class="mb-3 flex items-center justify-center rounded-xl bg-elevated p-4" style="min-height: 80px;">
              <img
                :src="fav.dataUrl"
                :alt="`${fav.size}×${fav.size} favicon`"
                :style="faviconStyle(fav.size)"
                class="object-contain"
              >
            </div>
            <div class="mb-3">
              <p class="font-mono text-lg font-bold text-primary-500">{{ fav.size }}×{{ fav.size }}</p>
              <p class="text-sm text-muted">{{ fav.label }}</p>
            </div>
            <UButton variant="soft" size="sm" icon="i-lucide-download" class="press-effect w-full" @click="downloadSingle(fav)">
              Download PNG
            </UButton>
          </div>
        </div>

        <!-- HTML Code -->
        <div class="card-base rounded-2xl p-6">
          <h3 class="mb-3 text-lg font-semibold text-default">
            <UIcon name="i-lucide-code" class="mr-2 inline-block size-5 align-middle text-primary-500" />
            HTML Code
          </h3>
          <p class="mb-3 text-sm text-muted">
            Add this to your <code class="rounded bg-elevated px-1">&lt;head&gt;</code> tag:
          </p>
          <pre class="overflow-x-auto rounded-xl bg-elevated p-4 text-sm text-muted"><code>&lt;link rel="icon" href="/favicon.ico" sizes="any"&gt;
&lt;link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"&gt;
&lt;link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"&gt;
&lt;link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"&gt;
&lt;link rel="manifest" href="/site.webmanifest"&gt;</code></pre>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
      <h2 class="reveal-on-scroll mb-8 text-center text-3xl font-bold text-default">
        FAQ
      </h2>
      <div class="reveal-on-scroll">
        <UAccordion
          :items="[
            { label: 'Is my image uploaded to a server?', content: 'No. Everything happens in your browser using the Canvas API. Your image never leaves your device.' },
            { label: 'What image should I use?', content: 'Use a square image at least 512×512 pixels. PNG with transparency works best. SVG is ideal for scaling.' },
            { label: 'What is included in the ZIP?', content: 'All PNG sizes (16, 32, 48, 180, 192, 512), a site.webmanifest file, and the HTML code to paste into your head tag.' },
          ]"
        />
      </div>
    </section>

    <ScrollToTop />
  </div>
</template>
