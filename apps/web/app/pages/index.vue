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

useScrollReveal()

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

const previewSizes = [16, 32, 48, 64]

function getSourceBadgeColor(source: string): 'primary' | 'neutral' {
  if (source.includes('apple')) return 'neutral'
  if (source.includes('manifest')) return 'neutral'
  if (source === '/favicon.ico') return 'neutral'
  return 'primary'
}
</script>

<template>
  <div class="min-h-screen">
    <!-- ═══════════════════════════════════════════════════════════════════
         HERO — URL Input is THE hero. No marketing fluff above it.
         ═══════════════════════════════════════════════════════════════════ -->
    <section class="hero-glow relative overflow-hidden bg-linear-to-b from-primary-50 to-transparent pb-12 pt-16 dark:from-primary-950/30 dark:to-transparent">
      <div class="animated-gradient-bg absolute inset-0 opacity-50" />

      <div class="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <!-- Logo + Title -->
        <div class="mb-8 animate-fade-in">
          <img
            src="/logo.png"
            alt="Favicon Checker"
            class="mx-auto mb-4 size-16 drop-shadow-lg"
          >
          <h1 class="font-display text-4xl font-extrabold tracking-tight text-default sm:text-5xl lg:text-6xl">
            Favicon
            <span class="bg-linear-to-r from-primary-500 to-primary-300 bg-clip-text text-transparent">Checker</span>
          </h1>
          <p class="mt-3 text-lg text-muted">
            Bypass the cache. See the real favicon.
          </p>
        </div>

        <!-- ─── Search Form ─── -->
        <!-- eslint-disable-next-line atx/no-native-form, nuxt-ui/prefer-uform -->
        <form
          id="favicon-search-form"
          class="stagger-2 animate-slide-up"
          @submit.prevent="checkFavicon"
        >
          <div class="glass-card mx-auto flex max-w-2xl flex-col gap-3 p-3 sm:flex-row sm:p-2">
            <UInput
              id="url-input"
              v-model="urlInput"
              placeholder="Enter any URL — e.g. github.com"
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
              class="press-effect sm:w-auto"
            >
              {{ isChecking ? 'Checking...' : 'Check' }}
            </UButton>
          </div>
        </form>

        <div class="stagger-3 mt-4 animate-fade-in">
          <UButton
            variant="link"
            to="/batch"
            icon="i-lucide-layers"
            size="sm"
          >
            Batch check multiple sites
          </UButton>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════
         RESULTS
         ═══════════════════════════════════════════════════════════════════ -->
    <section
      v-if="isChecking || result || error"
      class="mx-auto max-w-4xl px-4 py-12 sm:px-6"
    >
      <!-- Loading skeleton -->
      <div v-if="isChecking" class="space-y-4">
        <div class="flex items-center gap-3 text-dimmed">
          <UIcon name="i-lucide-loader-2" class="size-5 animate-spin" />
          <span>Scanning favicons...</span>
        </div>
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div v-for="i in 3" :key="i" class="card-base animate-pulse rounded-2xl p-6" :class="`stagger-${i}`">
            <div class="mx-auto mb-4 size-16 rounded-lg bg-muted" />
            <div class="mx-auto mb-2 h-4 w-24 rounded bg-muted" />
            <div class="mx-auto h-3 w-16 rounded bg-muted" />
          </div>
        </div>
      </div>

      <!-- Error -->
      <div
        v-else-if="error"
        class="card-base animate-scale-in rounded-2xl p-8 text-center"
      >
        <UIcon name="i-lucide-alert-circle" class="mx-auto mb-4 size-12 text-error-500" />
        <h2 class="mb-2 text-xl font-semibold text-default">
          Couldn't Check Favicon
        </h2>
        <p class="text-muted">
          {{ error }}
        </p>
        <UButton class="press-effect mt-4" variant="outline" icon="i-lucide-refresh-cw" @click="checkFavicon">
          Try Again
        </UButton>
      </div>

      <!-- Results -->
      <div v-else-if="result" class="space-y-6">
        <div class="flex animate-fade-in items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-default">
              {{ result.favicons.length > 0 ? `Found ${result.favicons.length} favicon${result.favicons.length === 1 ? '' : 's'}` : 'No favicons found' }}
            </h2>
            <p class="mt-1 text-sm text-dimmed">
              {{ result.url }}
            </p>
          </div>
          <UBadge variant="subtle" size="lg">
            {{ new Date(result.checkedAt).toLocaleTimeString() }}
          </UBadge>
        </div>

        <!-- Empty state -->
        <div v-if="result.favicons.length === 0" class="card-base animate-scale-in rounded-2xl p-10 text-center">
          <UIcon name="i-lucide-image-off" class="mx-auto mb-4 size-16 text-dimmed" />
          <h3 class="mb-2 text-lg font-semibold text-default">
            No Favicons Detected
          </h3>
          <p class="mx-auto max-w-md text-muted">
            This site doesn't have any favicons configured.
          </p>
        </div>

        <!-- Favicon grid -->
        <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="(favicon, index) in result.favicons"
            :key="index"
            class="card-interactive animate-slide-up-sm group rounded-2xl p-6"
            :style="{ animationDelay: `${index * 0.08}s` }"
          >
            <div class="mb-4 flex items-center justify-center rounded-xl bg-elevated p-6">
              <img
                :src="favicon.dataUrl"
                :alt="`Favicon from ${favicon.source}`"
                class="size-20 object-contain transition-transform duration-200 group-hover:scale-105"
                loading="lazy"
              >
            </div>

            <div class="mb-3">
              <UBadge :color="getSourceBadgeColor(favicon.source)" variant="subtle" size="sm">
                {{ favicon.source }}
              </UBadge>
            </div>

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

            <div class="mt-4 flex items-end gap-2">
              <div v-for="size in previewSizes" :key="size" class="flex flex-col items-center gap-1">
                <img :src="favicon.dataUrl" :alt="`${size}px`" :style="{ width: `${size}px`, height: `${size}px` }" class="object-contain" loading="lazy">
                <span class="text-[10px] text-dimmed">{{ size }}</span>
              </div>
            </div>

            <UButton class="press-effect mt-4 w-full" variant="soft" size="sm" icon="i-lucide-download" @click="downloadFavicon(favicon)">
              Download
            </UButton>
          </article>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════
         HOW IT WORKS (only when no result shown)
         ═══════════════════════════════════════════════════════════════════ -->
    <section
      v-if="!result && !isChecking && !error"
      class="mx-auto max-w-5xl px-4 pb-16 sm:px-6"
    >
      <h2 class="reveal-on-scroll mb-10 text-center text-3xl font-bold text-default">
        How It Works
      </h2>
      <div class="grid gap-6 sm:grid-cols-3">
        <div class="reveal-on-scroll card-interactive rounded-2xl p-6 text-center" data-delay="1">
          <div class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary-500/10">
            <UIcon name="i-lucide-link" class="size-7 text-primary-500" />
          </div>
          <h3 class="mb-2 font-semibold text-default">
            1. Enter a URL
          </h3>
          <p class="text-sm text-muted">
            Paste any website URL — we handle validation and normalization.
          </p>
        </div>
        <div class="reveal-on-scroll card-interactive rounded-2xl p-6 text-center" data-delay="2">
          <div class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary-500/10">
            <UIcon name="i-lucide-scan-search" class="size-7 text-primary-500" />
          </div>
          <h3 class="mb-2 font-semibold text-default">
            2. We Fetch &amp; Scan
          </h3>
          <p class="text-sm text-muted">
            HTML parsing, manifest reading, and cache-busting fetch — all server-side.
          </p>
        </div>
        <div class="reveal-on-scroll card-interactive rounded-2xl p-6 text-center" data-delay="3">
          <div class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary-500/10">
            <UIcon name="i-lucide-eye" class="size-7 text-primary-500" />
          </div>
          <h3 class="mb-2 font-semibold text-default">
            3. See the Truth
          </h3>
          <p class="text-sm text-muted">
            Every favicon displayed at multiple sizes with download links.
          </p>
        </div>
      </div>
    </section>

    <!-- Recent Checks -->
    <section
      v-if="recentChecks && recentChecks.length > 0 && !isChecking"
      class="mx-auto max-w-4xl px-4 pb-16 sm:px-6"
    >
      <h2 class="reveal-on-scroll mb-6 text-lg font-semibold text-default">
        Recent Checks
      </h2>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <UButton
          v-for="(check, i) in recentChecks"
          :key="check.id"
          variant="ghost"
          class="reveal-on-scroll card-interactive flex items-center gap-3 rounded-xl p-3 text-left"
          :data-delay="(i % 4) + 1"
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

    <!-- FAQ -->
    <section class="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
      <h2 class="reveal-on-scroll mb-8 text-center text-3xl font-bold text-default">
        FAQ
      </h2>
      <div class="reveal-on-scroll">
        <UAccordion
          :items="[
            { label: 'Why isn\'t my favicon updating?', content: 'Browsers cache favicons aggressively, sometimes for weeks. This tool fetches directly from your server, bypassing all browser caching.' },
            { label: 'What sizes should a favicon be?', content: '16×16 for tabs, 32×32 for high DPI, 180×180 Apple Touch Icon, and 192/512px in a web manifest.' },
            { label: 'How does it work?', content: 'We fetch HTML server-side, parse link tags and manifests, then download each favicon with cache-busting headers.' },
            { label: 'What formats are supported?', content: 'ICO, PNG, SVG, GIF, and WEBP — from HTML link tags, /favicon.ico, and web app manifests.' },
            { label: 'Is it free?', content: 'Yes, completely free. Rate limited to 10 checks/minute per IP.' },
          ]"
        />
      </div>
    </section>

    <ScrollToTop />
  </div>
</template>
