<script setup lang="ts">
import type { Favicon } from '~/composables/useFaviconChecker'

useSeo({
  title: 'Favicon Checker — See Your Real Favicon Instantly',
  description: 'Free online tool to check any website\'s favicon. Bypass browser cache and see the real favicon instantly. Test all favicon sizes including Apple Touch Icon, ICO, and PNG favicons.',
  keywords: ['favicon checker', 'check website favicon', 'favicon checker tool', 'test favicon', 'preview favicon online', 'favicon not updating', 'website favicon tester', 'favicon preview'],
  ogImage: {
    title: 'Favicon Checker',
    description: 'See your real favicon, bypass the cache',
    icon: '🔍',
  },
})

useWebPageSchema({
  name: 'Favicon Checker — Free Online Favicon Testing Tool',
  description: 'Check any website\'s favicon by URL. Bypass aggressive browser caching and see the actual current favicon. Supports ICO, PNG, SVG, and Apple Touch Icon formats.',
})

useFAQSchema([
  {
    question: 'Why isn\'t my favicon updating in the browser?',
    answer: 'Browsers cache favicons aggressively, sometimes for weeks or even months. Even clearing your browser cache may not help because favicons are cached separately. Use this tool to bypass the cache and see the actual current favicon your server is delivering.',
  },
  {
    question: 'What sizes should a favicon be?',
    answer: 'Modern websites should include multiple favicon sizes: a 16×16 ICO or PNG for browser tabs, 32×32 for higher DPI displays, 180×180 Apple Touch Icon for iOS home screens, and optionally 192×192 and 512×512 PNG icons in a web manifest for Android devices.',
  },
  {
    question: 'How does this favicon checker work?',
    answer: 'We fetch your website\'s HTML directly from the server, parse all <link rel="icon">, <link rel="apple-touch-icon">, and web manifest references, then download each favicon image with cache-busting headers. This completely bypasses your browser\'s favicon cache.',
  },
  {
    question: 'What favicon formats are supported?',
    answer: 'This tool detects and displays all common favicon formats including ICO, PNG, SVG, GIF, and WEBP. It finds favicons declared in HTML link tags, the default /favicon.ico location, and web app manifest files.',
  },
  {
    question: 'Can I download the favicons I find?',
    answer: 'Yes! Each detected favicon includes a download button so you can save any favicon image directly to your device.',
  },
])

const {
  urlInput,
  isChecking,
  result,
  error,
  recentChecks,
  checkFavicon,
  recheckUrl,
} = useFaviconChecker()

function downloadFavicon(favicon: Favicon) {
  const link = document.createElement('a')
  link.href = favicon.dataUrl
  const ext = favicon.type.includes('svg') ? 'svg' : favicon.type.includes('png') ? 'png' : favicon.type.includes('gif') ? 'gif' : 'ico'
  link.download = `favicon-${favicon.sizes || 'default'}.${ext}`
  link.click()
}

function formatDomain(domain: string): string {
  return domain.replace(/^www\./, '')
}

function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

const previewSizes = [16, 32, 48, 64, 128, 180]

function getSourceBadgeColor(source: string): 'primary' | 'neutral' {
  if (source.includes('apple')) return 'neutral'
  if (source.includes('manifest')) return 'neutral'
  if (source === '/favicon.ico') return 'neutral'
  return 'primary'
}
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 bg-linear-to-b from-primary-100 via-transparent to-transparent dark:from-primary-950/30" />
      <div class="relative mx-auto max-w-4xl px-4 pt-20 pb-16 text-center sm:px-6 sm:pt-28 sm:pb-20">
        <div class="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-500/10 px-4 py-1.5 text-sm font-medium text-primary-500">
          <UIcon name="i-lucide-shield-check" class="size-4" />
          Bypass browser cache
        </div>

        <h1 class="font-display text-4xl font-bold tracking-tight text-default sm:text-5xl lg:text-6xl">
          What's Your
          <span class="bg-linear-to-r from-primary-500 to-primary-400 bg-clip-text text-transparent">Real Favicon</span>?
        </h1>

        <p class="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          Browsers cache favicons aggressively — sometimes for weeks. Enter any URL and we'll fetch the actual current favicon directly, bypassing all caching. See exactly what your visitors see.
        </p>

        <!-- Search Form -->
        <!-- eslint-disable-next-line atx/no-native-form, nuxt-ui/prefer-uform -->
        <form
          id="favicon-search-form"
          class="mx-auto mt-10 max-w-2xl"
          @submit.prevent="checkFavicon"
        >
          <div class="flex flex-col gap-3 sm:flex-row">
            <UInput
              id="url-input"
              v-model="urlInput"
              placeholder="Enter a URL — e.g. github.com"
              size="xl"
              icon="i-lucide-globe"
              class="flex-1"
              :disabled="isChecking"
              autocomplete="url"
              type="url"
              inputmode="url"
              @keydown.enter.prevent="checkFavicon"
            />
            <UButton
              id="check-button"
              type="submit"
              size="xl"
              :loading="isChecking"
              :disabled="!urlInput.trim()"
              icon="i-lucide-search"
              class="sm:w-auto"
            >
              {{ isChecking ? 'Checking...' : 'Check Favicon' }}
            </UButton>
          </div>
        </form>

        <div class="mt-4">
          <UButton
            variant="link"
            to="/batch"
            icon="i-lucide-layers"
            size="sm"
          >
            Check multiple sites at once
          </UButton>
        </div>
      </div>
    </section>

    <!-- Results Section -->
    <section
      v-if="isChecking || result || error"
      class="mx-auto max-w-4xl px-4 pb-16 sm:px-6"
    >
      <!-- Loading State -->
      <div
        v-if="isChecking"
        id="loading-state"
        class="space-y-4"
      >
        <div class="flex items-center gap-3 text-dimmed">
          <UIcon name="i-lucide-loader-2" class="size-5 animate-spin" />
          <span>Fetching favicons...</span>
        </div>
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div v-for="i in 3" :key="i" class="card-base animate-pulse rounded-2xl p-6">
            <div class="mx-auto mb-4 size-16 rounded-lg bg-muted" />
            <div class="mx-auto mb-2 h-4 w-24 rounded bg-muted" />
            <div class="mx-auto h-3 w-16 rounded bg-muted" />
          </div>
        </div>
      </div>

      <!-- Error State -->
      <!-- eslint-disable-next-line atx/no-raw-tailwind-colors -->
      <div
        v-else-if="error"
        id="error-state"
        class="card-base rounded-2xl border border-error-500/20 bg-error-500/5 p-8 text-center"
      >
        <!-- eslint-disable-next-line atx/no-raw-tailwind-colors -->
        <UIcon name="i-lucide-alert-circle" class="mx-auto mb-4 size-12 text-error-500" />
        <h2 class="mb-2 text-xl font-semibold text-default">
          Couldn't Check Favicon
        </h2>
        <p class="text-muted">
          {{ error }}
        </p>
        <UButton
          class="mt-4"
          variant="outline"
          icon="i-lucide-refresh-cw"
          @click="checkFavicon"
        >
          Try Again
        </UButton>
      </div>

      <!-- Results -->
      <div
        v-else-if="result"
        id="results-container"
        class="space-y-6"
      >
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-default">
              <span v-if="result.favicons.length > 0">
                Found {{ result.favicons.length }} favicon{{ result.favicons.length === 1 ? '' : 's' }}
              </span>
              <span v-else>No favicons found</span>
            </h2>
            <p class="mt-1 text-sm text-dimmed">
              {{ result.url }}
            </p>
          </div>
          <UBadge variant="subtle" size="lg">
            {{ new Date(result.checkedAt).toLocaleTimeString() }}
          </UBadge>
        </div>

        <!-- No favicon found -->
        <div
          v-if="result.favicons.length === 0"
          class="card-base rounded-2xl p-10 text-center"
        >
          <UIcon name="i-lucide-image-off" class="mx-auto mb-4 size-16 text-dimmed" />
          <h3 class="mb-2 text-lg font-semibold text-default">
            No Favicons Detected
          </h3>
          <p class="mx-auto max-w-md text-muted">
            This site doesn't appear to have any favicons configured.
          </p>
          <div class="mx-auto mt-6 max-w-md text-left">
            <h4 class="mb-3 text-sm font-semibold text-default">
              To add a favicon to your site:
            </h4>
            <ol class="space-y-2 text-sm text-muted">
              <li>1. Place a <code class="rounded bg-muted px-1">favicon.ico</code> in your site root</li>
              <li>2. Add <code class="rounded bg-muted px-1">&lt;link rel="icon" href="/favicon.ico"&gt;</code> to your HTML</li>
              <li>3. Add an Apple Touch Icon: <code class="rounded bg-muted px-1">&lt;link rel="apple-touch-icon" href="/apple-touch-icon.png"&gt;</code></li>
            </ol>
          </div>
        </div>

        <!-- Favicon Grid -->
        <div
          v-else
          class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <article
            v-for="(favicon, index) in result.favicons"
            :key="index"
            class="card-base group cursor-pointer rounded-2xl p-6 transition-all duration-200 hover:shadow-elevated"
          >
            <!-- Large Preview -->
            <div class="mb-4 flex items-center justify-center rounded-xl bg-elevated p-6">
              <img
                :src="favicon.dataUrl"
                :alt="`Favicon from ${favicon.source}`"
                class="size-20 object-contain transition-transform duration-200 group-hover:scale-105"
                loading="lazy"
              >
            </div>

            <!-- Source Badge -->
            <div class="mb-3">
              <UBadge
                :color="getSourceBadgeColor(favicon.source)"
                variant="subtle"
                size="sm"
              >
                {{ favicon.source }}
              </UBadge>
            </div>

            <!-- Info -->
            <div class="space-y-1 text-sm">
              <div class="flex items-center justify-between">
                <span class="text-dimmed">Type</span>
                <span class="font-mono text-xs text-default">{{ favicon.type.split('/')[1] || favicon.type }}</span>
              </div>
              <div v-if="favicon.sizes" class="flex items-center justify-between">
                <span class="text-dimmed">Sizes</span>
                <span class="font-mono text-xs text-default">{{ favicon.sizes }}</span>
              </div>
            </div>

            <!-- Multi-size Preview -->
            <div class="mt-4 flex items-end gap-2">
              <div
                v-for="size in previewSizes.filter(s => s <= 64)"
                :key="size"
                class="flex flex-col items-center gap-1"
              >
                <img
                  :src="favicon.dataUrl"
                  :alt="`${size}×${size} preview`"
                  :style="{ width: `${size}px`, height: `${size}px` }"
                  class="object-contain"
                  loading="lazy"
                >
                <span class="text-[10px] text-dimmed">{{ size }}</span>
              </div>
            </div>

            <!-- Download Button -->
            <UButton
              class="mt-4 w-full"
              variant="soft"
              size="sm"
              icon="i-lucide-download"
              @click="downloadFavicon(favicon)"
            >
              Download
            </UButton>
          </article>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section
      v-if="!result && !isChecking && !error"
      class="mx-auto max-w-5xl px-4 pb-20 sm:px-6"
    >
      <h2 class="mb-12 text-center text-3xl font-bold text-default">
        How It Works
      </h2>
      <div class="grid gap-8 sm:grid-cols-3">
        <div class="text-center rounded-2xl p-6 transition-all duration-200 hover:shadow-elevated hover:-translate-y-0.5">
          <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary-500/10">
            <UIcon name="i-lucide-link" class="size-8 text-primary-500" />
          </div>
          <h3 class="mb-2 text-lg font-semibold text-default">
            1. Enter a URL
          </h3>
          <p class="text-sm text-muted">
            Paste any website URL — we'll handle the rest, including URL validation and normalization.
          </p>
        </div>
        <div class="text-center rounded-2xl p-6 transition-all duration-200 hover:shadow-elevated hover:-translate-y-0.5">
          <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary-500/10">
            <UIcon name="i-lucide-scan-search" class="size-8 text-primary-500" />
          </div>
          <h3 class="mb-2 text-lg font-semibold text-default">
            2. We Fetch & Scan
          </h3>
          <p class="text-sm text-muted">
            Our server fetches the page HTML, parses link tags, checks /favicon.ico, and reads web manifests — all with cache-busting headers.
          </p>
        </div>
        <div class="text-center rounded-2xl p-6 transition-all duration-200 hover:shadow-elevated hover:-translate-y-0.5">
          <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary-500/10">
            <UIcon name="i-lucide-eye" class="size-8 text-primary-500" />
          </div>
          <h3 class="mb-2 text-lg font-semibold text-default">
            3. You See the Truth
          </h3>
          <p class="text-sm text-muted">
            Every discovered favicon is displayed at multiple sizes with download links. No more guessing whether your favicon updated.
          </p>
        </div>
      </div>
    </section>

    <!-- Recent Checks -->
    <section
      v-if="recentChecks && recentChecks.length > 0 && !isChecking"
      class="mx-auto max-w-4xl px-4 pb-20 sm:px-6"
    >
      <h2 class="mb-6 text-lg font-semibold text-default">
        Recent Favicon Checks
      </h2>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <UButton
          v-for="check in recentChecks"
          :key="check.id"
          variant="ghost"
          class="card-base flex items-center gap-3 rounded-xl p-3 text-left transition-all duration-200 hover:shadow-elevated"
          @click="recheckUrl(check.url)"
        >
          <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-500/10">
            <UIcon name="i-lucide-globe" class="size-5 text-primary-500" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-default">
              {{ formatDomain(check.domain) }}
            </p>
            <p class="text-xs text-dimmed">
              {{ check.faviconCount }} favicon{{ check.faviconCount === 1 ? '' : 's' }} · {{ timeAgo(check.checkedAt) }}
            </p>
          </div>
        </UButton>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
      <h2 class="mb-8 text-center text-3xl font-bold text-default">
        Frequently Asked Questions
      </h2>
      <UAccordion
        :items="[
          {
            label: 'Why isn\'t my favicon updating in the browser?',
            content: 'Browsers cache favicons aggressively, sometimes for weeks or even months. Even clearing your browser cache may not help because favicons are often cached in a separate database. This tool fetches the favicon directly from your server, bypassing all browser caching mechanisms so you can verify the actual current state.',
          },
          {
            label: 'What sizes should a favicon be?',
            content: 'Modern websites should include: a 16×16 ICO or PNG for browser tabs, 32×32 for higher DPI displays, 180×180 Apple Touch Icon for iOS home screens, and 192×192 plus 512×512 PNG icons in a web manifest for Android. SVG favicons are increasingly supported and scale perfectly to any size.',
          },
          {
            label: 'How does this favicon checker work?',
            content: 'We fetch your website\'s HTML directly from the server side, parse all link tags for icons and apple-touch-icons, plus web manifest references. Then we download each favicon image with cache-busting query parameters and no-store cache headers. This completely bypasses your browser\'s favicon cache.',
          },
          {
            label: 'What favicon formats are supported?',
            content: 'This tool detects and displays all common favicon formats including ICO, PNG, SVG, GIF, and WEBP. It finds favicons declared in HTML link tags, the default /favicon.ico location, and web app manifest files (site.webmanifest or manifest.json).',
          },
          {
            label: 'Is this tool free to use?',
            content: 'Yes, Favicon Checker is completely free. We limit checks to 10 per minute per IP address to prevent abuse, but there are no other restrictions. No sign-up required.',
          },
        ]"
      />
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
