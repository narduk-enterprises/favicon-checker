<script setup lang="ts">
/* eslint-disable nuxt-guardrails/require-use-seo-on-pages, nuxt-guardrails/require-schema-on-pages */

useAppSeo({
  title: 'ICO to PNG Converter — Free Online ICO Converter',
  description: 'Convert ICO favicon files to PNG format instantly in your browser. Free, no upload needed — your files stay on your device.',
})

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'Favicon Checker', item: '/' },
      { name: 'Tools', item: '/tools/ico-to-png' },
      { name: 'ICO to PNG', item: '/tools/ico-to-png' },
    ],
  }),
])

useScrollReveal()

const convertedImages = ref<Array<{ dataUrl: string, width: number, height: number }>>([])
const fileName = ref('')

function handleFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  fileName.value = file.name
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      // Render as PNG via canvas
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(img, 0, 0)
        convertedImages.value = [{
          dataUrl: canvas.toDataURL('image/png'),
          width: img.naturalWidth,
          height: img.naturalHeight,
        }]
      }
    }
    img.src = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

function download(img: { dataUrl: string }) {
  const link = document.createElement('a')
  link.href = img.dataUrl
  link.download = fileName.value.replace(/\.ico$/i, '.png') || 'converted.png'
  link.click()
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
          ICO to
          <span class="bg-linear-to-r from-primary-500 to-primary-300 bg-clip-text text-transparent">PNG</span>
          Converter
        </h1>
        <p class="stagger-2 mt-3 animate-slide-up text-lg text-muted">
          Convert .ico files to .png — free, instant, no upload.
        </p>
      </div>
    </section>

    <!-- Tool -->
    <section class="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div class="card-base rounded-2xl p-8 text-center">
        <!-- eslint-disable-next-line atx/no-native-form -->
        <label class="mb-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-default p-8 transition-colors hover:border-primary-500 hover:bg-primary-50/30 dark:hover:bg-primary-950/20">
          <UIcon name="i-lucide-upload" class="mb-3 size-10 text-primary-500" />
          <span class="font-semibold text-default">Choose an ICO file</span>
          <span class="mt-1 text-sm text-muted">or any image file to convert</span>
          <!-- eslint-disable-next-line atx/no-native-input -->
          <input type="file" accept=".ico,image/*" class="hidden" @change="handleFile">
        </label>

        <div v-if="convertedImages.length > 0" class="mt-6 space-y-4">
          <div v-for="(img, i) in convertedImages" :key="i" class="flex items-center gap-4 rounded-xl bg-elevated p-4">
            <img :src="img.dataUrl" :alt="`Converted ${img.width}x${img.height}`" class="size-16 rounded-lg border border-default object-contain p-1">
            <div class="flex-1 text-left">
              <p class="font-semibold text-default">{{ img.width }}×{{ img.height }}</p>
              <p class="text-sm text-muted">PNG format</p>
            </div>
            <UButton icon="i-lucide-download" class="press-effect" @click="download(img)">
              Download
            </UButton>
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
