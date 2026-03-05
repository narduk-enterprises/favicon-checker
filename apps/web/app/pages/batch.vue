<script setup lang="ts">
import type { Favicon } from '~/composables/useFaviconChecker'

useSeo({
  title: 'Batch Favicon Checker — Check Multiple Sites at Once',
  description: 'Check favicons for multiple websites simultaneously. Paste a list of URLs and instantly see all their favicons side by side.',
  keywords: ['batch favicon checker', 'check multiple favicons', 'bulk favicon test'],
  ogImage: {
    title: 'Batch Favicon Checker',
    description: 'Check multiple sites at once',
    icon: '📋',
  },
})

useWebPageSchema({
  name: 'Batch Favicon Checker — Check Multiple Sites at Once',
  description: 'Check favicons for multiple websites simultaneously.',
})

useScrollReveal()

const {
  batchInput,
  batchResults,
  progress,
  isProcessing,
  checkBatch,
} = useBatchFaviconChecker()

function downloadFavicon(favicon: Favicon) {
  const link = document.createElement('a')
  link.href = favicon.dataUrl
  const ext = favicon.type.includes('svg') ? 'svg' : favicon.type.includes('png') ? 'png' : favicon.type.includes('gif') ? 'gif' : 'ico'
  link.download = `favicon-${favicon.sizes || 'default'}.${ext}`
  link.click()
}

function loadExample() {
  batchInput.value = 'github.com\ngoogle.com\nstackoverflow.com\nreddit.com\nnpmjs.com'
}

const totalUrls = computed(() => batchResults.value.length)
const completedUrls = computed(() => batchResults.value.filter(r => r.status === 'done' || r.status === 'error').length)

function getEntryIcon(entry: { error?: string | null, status: string }) {
  if (entry.error) return 'i-lucide-alert-circle'
  if (entry.status === 'done') return 'i-lucide-check-circle'
  return 'i-lucide-loader-2'
}

function getEntryIconClass(entry: { error?: string | null, status: string }) {
  const isSpin = entry.status !== 'done' && entry.status !== 'error' && !entry.error
  const colorClass = entry.error ? 'text-error-500' : entry.status === 'done' ? 'text-success-500' : 'text-muted'
  return [colorClass, 'size-5 shrink-0', isSpin ? 'animate-spin' : '']
}
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero — Input first -->
    <section class="hero-glow relative overflow-hidden bg-linear-to-b from-primary-50 to-transparent pb-12 pt-16 dark:from-primary-950/30 dark:to-transparent">
      <div class="animated-gradient-bg absolute inset-0 opacity-50" />

      <div class="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <div class="mb-6 animate-fade-in">
          <NuxtLink to="/" class="group inline-flex items-center gap-3">
            <img src="/logo.png" alt="Favicon Checker" class="size-12 drop-shadow-lg transition-transform group-hover:scale-105">
            <span class="font-display text-2xl font-bold text-default">Favicon Checker</span>
          </NuxtLink>
        </div>

        <h1 class="animate-slide-up font-display text-3xl font-extrabold tracking-tight text-default sm:text-4xl lg:text-5xl">
          Batch
          <span class="bg-linear-to-r from-primary-500 to-primary-300 bg-clip-text text-transparent">Check</span>
        </h1>

        <p class="stagger-2 mx-auto mt-3 max-w-xl animate-slide-up text-lg text-muted">
          Paste URLs — one per line, comma-separated, or JSON array.
        </p>
      </div>
    </section>

    <!-- Input Section -->
    <section class="mx-auto max-w-3xl px-4 pb-12 sm:px-6">
      <div class="card-base animate-slide-up-sm rounded-2xl p-6">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-default">
            URLs to Check
          </h2>
          <UButton
            variant="ghost"
            size="sm"
            icon="i-lucide-file-text"
            class="press-effect"
            @click="loadExample"
          >
            Load Example
          </UButton>
        </div>

        <UTextarea
          v-model="batchInput"
          placeholder="github.com&#10;google.com&#10;stackoverflow.com"
          :rows="5"
          autoresize
          :disabled="isProcessing"
          class="font-mono text-sm"
        />

        <div class="mt-4 flex items-center justify-between">
          <p class="text-sm text-dimmed">
            Newline, comma, or JSON array
          </p>
          <UButton
            :loading="isProcessing"
            :disabled="!batchInput.trim()"
            icon="i-lucide-search"
            class="press-effect"
            @click="checkBatch"
          >
            {{ isProcessing ? 'Checking...' : 'Check All' }}
          </UButton>
        </div>
      </div>

      <!-- Progress Bar -->
      <div v-if="isProcessing" class="mt-6 animate-fade-in">
        <div class="mb-2 flex items-center justify-between text-sm">
          <span class="text-muted">
            Checking {{ completedUrls }} of {{ totalUrls }} sites...
          </span>
          <span class="font-mono font-medium text-primary-500">
            {{ progress }}%
          </span>
        </div>
        <div class="h-2.5 overflow-hidden rounded-full bg-elevated">
          <div
            class="h-full rounded-full bg-linear-to-r from-primary-500 to-primary-300 transition-all duration-500 ease-out"
            :style="{ width: `${progress}%` }"
          />
        </div>
      </div>
    </section>

    <!-- Results -->
    <section
      v-if="batchResults.length > 0"
      class="mx-auto max-w-4xl px-4 pb-20 sm:px-6"
    >
      <h2 class="mb-6 text-xl font-bold text-default">
        Results ({{ batchResults.length }})
      </h2>

      <div class="space-y-4">
        <div
          v-for="(entry, entryIdx) in batchResults"
          :key="entry.url"
          class="card-interactive animate-slide-up-sm overflow-hidden rounded-2xl"
          :style="{ animationDelay: `${entryIdx * 0.06}s` }"
        >
          <!-- URL Header -->
          <div class="flex items-center gap-3 border-b border-default px-5 py-3">
            <UIcon
              :name="getEntryIcon(entry)"
              :class="getEntryIconClass(entry)"
            />
            <span class="min-w-0 flex-1 truncate font-mono text-sm text-default">
              {{ entry.url }}
            </span>
            <UBadge
              v-if="entry.result"
              color="primary"
              variant="subtle"
              size="sm"
            >
              {{ entry.result.favicons.length }} favicon{{ entry.result.favicons.length === 1 ? '' : 's' }}
            </UBadge>
          </div>

          <!-- Error -->
          <div v-if="entry.error" class="px-5 py-4">
            <p class="text-sm text-error-500">
              {{ entry.error }}
            </p>
          </div>

          <!-- Favicons Row -->
          <div v-else-if="entry.result && entry.result.favicons.length > 0" class="px-5 py-4">
            <div class="flex flex-wrap gap-3">
              <div
                v-for="(favicon, idx) in entry.result.favicons"
                :key="idx"
                class="group flex cursor-pointer items-center gap-3 rounded-xl bg-elevated p-3 transition-all duration-200 hover:shadow-card-hover"
              >
                <img
                  :src="favicon.dataUrl"
                  :alt="`Favicon from ${favicon.source}`"
                  class="size-8 object-contain"
                  loading="lazy"
                >
                <div class="text-xs">
                  <p class="font-medium text-default">
                    {{ favicon.source }}
                  </p>
                  <p class="text-dimmed">
                    {{ favicon.sizes || favicon.type.split('/')[1] || 'unknown' }}
                  </p>
                </div>
                <UButton
                  variant="ghost"
                  size="xs"
                  icon="i-lucide-download"
                  class="press-effect ml-1 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
                  @click="downloadFavicon(favicon)"
                />
              </div>
            </div>
          </div>

          <!-- No favicons -->
          <div v-else-if="entry.result" class="px-5 py-4">
            <p class="text-sm text-dimmed">
              No favicons found.
            </p>
          </div>
        </div>
      </div>
    </section>

    <ScrollToTop />
  </div>
</template>
