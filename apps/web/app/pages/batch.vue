<script setup lang="ts">
import type { Favicon } from '~/composables/useFaviconChecker'

useSeo({
  title: 'Batch Favicon Checker — Check Multiple Sites at Once',
  description: 'Check favicons for multiple websites simultaneously. Paste a list of URLs, JSON array, or comma-separated domains to audit all their favicons in one go.',
  keywords: ['batch favicon checker', 'bulk favicon check', 'multiple website favicon', 'favicon audit tool', 'check favicons in bulk'],
  ogImage: {
    title: 'Batch Favicon Checker',
    description: 'Check favicons for multiple sites at once',
    icon: '📋',
  },
})

useWebPageSchema({
  name: 'Batch Favicon Checker — Check Multiple Websites at Once',
  description: 'Audit favicons for multiple websites simultaneously. Supports JSON arrays, comma-separated lists, and newline-delimited URLs.',
})

const {
  batchInput,
  isProcessing,
  batchResults,
  progress,
  parseUrls,
  checkBatch,
  clearBatch,
} = useBatchFaviconChecker()

const urlCount = computed(() => {
  if (!batchInput.value.trim()) return 0
  return Math.min(parseUrls(batchInput.value).length, 20)
})

function downloadFavicon(favicon: Favicon) {
  const link = document.createElement('a')
  link.href = favicon.dataUrl
  const ext = favicon.type.includes('svg') ? 'svg' : favicon.type.includes('png') ? 'png' : favicon.type.includes('gif') ? 'gif' : 'ico'
  link.download = `favicon-${favicon.sizes || 'default'}.${ext}`
  link.click()
}

const exampleInput = `github.com
google.com
nuxt.com
cloudflare.com
vercel.com`

function loadExample() {
  batchInput.value = exampleInput
}
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 bg-linear-to-b from-primary-100 via-transparent to-transparent dark:from-primary-950/30" />
      <div class="relative mx-auto max-w-4xl px-4 pt-20 pb-12 text-center sm:px-6 sm:pt-28 sm:pb-16">
        <div class="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-500/10 px-4 py-1.5 text-sm font-medium text-primary-500">
          <UIcon name="i-lucide-layers" class="size-4" />
          Batch Mode
        </div>

        <h1 class="font-display text-4xl font-bold tracking-tight text-default sm:text-5xl">
          Check
          <span class="bg-linear-to-r from-primary-500 to-primary-400 bg-clip-text text-transparent">Multiple Sites</span>
          at Once
        </h1>

        <p class="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted">
          Paste URLs as a newline-separated list, comma-separated, or a JSON array. We'll check up to 20 sites simultaneously.
        </p>

        <UButton
          variant="link"
          to="/"
          icon="i-lucide-arrow-left"
          class="mt-4"
        >
          Single URL mode
        </UButton>
      </div>
    </section>

    <!-- Input Section -->
    <section class="mx-auto max-w-4xl px-4 pb-8 sm:px-6">
      <div class="card-base rounded-2xl p-6">
        <div class="mb-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <h2 class="text-lg font-semibold text-default">
              URL List
            </h2>
            <UBadge v-if="urlCount > 0" variant="subtle" size="sm">
              {{ urlCount }} URL{{ urlCount === 1 ? '' : 's' }}
            </UBadge>
          </div>
          <UButton
            v-if="!batchInput.trim()"
            variant="ghost"
            size="sm"
            icon="i-lucide-sparkles"
            @click="loadExample"
          >
            Load example
          </UButton>
        </div>

        <!-- eslint-disable-next-line atx/no-native-input -->
        <textarea
          id="batch-input"
          v-model="batchInput"
          rows="8"
          placeholder="Enter URLs — one per line, comma-separated, or as a JSON array:

github.com, google.com, nuxt.com

or

[&quot;github.com&quot;, &quot;google.com&quot;, &quot;nuxt.com&quot;]"
          class="w-full resize-y rounded-xl border border-default bg-elevated p-4 font-mono text-sm text-default placeholder-dimmed focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          :disabled="isProcessing"
        />

        <div class="mt-4 flex items-center justify-between">
          <p class="text-xs text-dimmed">
            Max 20 URLs · Supports JSON arrays, comma-separated, or one-per-line
          </p>
          <div class="flex gap-2">
            <UButton
              v-if="batchResults.length > 0"
              variant="outline"
              size="sm"
              icon="i-lucide-trash-2"
              @click="clearBatch"
            >
              Clear
            </UButton>
            <UButton
              size="sm"
              icon="i-lucide-search"
              :loading="isProcessing"
              :disabled="urlCount === 0"
              @click="checkBatch"
            >
              {{ isProcessing ? `Checking... ${progress}%` : `Check ${urlCount} Favicon${urlCount === 1 ? '' : 's'}` }}
            </UButton>
          </div>
        </div>
      </div>
    </section>

    <!-- Progress Bar -->
    <section
      v-if="isProcessing"
      class="mx-auto max-w-4xl px-4 pb-6 sm:px-6"
    >
      <div class="h-2 overflow-hidden rounded-full bg-muted">
        <div
          class="h-full rounded-full bg-primary-500 transition-all duration-300"
          :style="{ width: `${progress}%` }"
        />
      </div>
    </section>

    <!-- Results Section -->
    <section
      v-if="batchResults.length > 0"
      class="mx-auto max-w-4xl space-y-4 px-4 pb-20 sm:px-6"
    >
      <div
        v-for="(entry, entryIndex) in batchResults"
        :key="entryIndex"
        class="card-base overflow-hidden rounded-2xl transition-all duration-200"
      >
        <!-- Domain Header -->
        <div class="flex items-center justify-between border-b border-default p-4">
          <div class="flex items-center gap-3">
            <!-- Status Icon -->
            <div class="flex size-8 items-center justify-center">
              <UIcon
                v-if="entry.status === 'pending'"
                name="i-lucide-clock"
                class="size-5 text-dimmed"
              />
              <UIcon
                v-else-if="entry.status === 'checking'"
                name="i-lucide-loader-2"
                class="size-5 animate-spin text-primary-500"
              />
              <UIcon
                v-else-if="entry.status === 'done'"
                name="i-lucide-check-circle"
                class="size-5 text-primary-500"
              />
              <!-- eslint-disable-next-line atx/no-raw-tailwind-colors -->
              <UIcon
                v-else
                name="i-lucide-alert-circle"
                class="size-5 text-error-500"
              />
            </div>

            <div>
              <p class="font-mono text-sm font-medium text-default">
                {{ entry.url }}
              </p>
              <p v-if="entry.status === 'done' && entry.result" class="text-xs text-dimmed">
                {{ entry.result.favicons.length }} favicon{{ entry.result.favicons.length === 1 ? '' : 's' }} found
              </p>
              <p v-else-if="entry.status === 'error'" class="text-xs text-error-500">
                {{ entry.error }}
              </p>
              <p v-else-if="entry.status === 'checking'" class="text-xs text-primary-500">
                Checking...
              </p>
              <p v-else class="text-xs text-dimmed">
                Waiting...
              </p>
            </div>
          </div>

          <UBadge
            v-if="entry.status === 'done' && entry.result"
            variant="subtle"
            size="sm"
          >
            {{ entry.result.favicons.length }}
          </UBadge>
        </div>

        <!-- Favicon Results (collapsed by default, expanded when done) -->
        <div
          v-if="entry.status === 'done' && entry.result && entry.result.favicons.length > 0"
          class="p-4"
        >
          <div class="flex flex-wrap gap-4">
            <div
              v-for="(favicon, idx) in entry.result.favicons"
              :key="idx"
              class="group flex cursor-pointer items-center gap-3 rounded-xl bg-elevated p-3 transition-all duration-200 hover:shadow-elevated"
            >
              <img
                :src="favicon.dataUrl"
                :alt="`Favicon from ${favicon.source}`"
                class="size-10 object-contain"
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
                class="ml-1 sm:opacity-0 transition-opacity sm:group-hover:opacity-100"
                @click="downloadFavicon(favicon)"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <div class="border-t border-default py-8">
      <div class="mx-auto max-w-4xl px-4 text-center text-sm text-dimmed sm:px-6">
        <!-- eslint-disable-next-line atx/prefer-ulink -->
        <p>Favicon Checker — A free developer tool by <a href="https://nard.uk" target="_blank" rel="noopener" class="text-primary-500 hover:underline">Narduk</a>.</p>
      </div>
    </div>
  </div>
</template>
