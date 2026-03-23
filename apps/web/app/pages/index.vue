<script setup lang="ts">
import type { Favicon } from '~/composables/useFaviconChecker'

useSeo({
  title: 'Favicon Checker — See Your Real Favicon Instantly (Free Tool)',
  description:
    'Free favicon checker, validator & audit tool. Bypass browser cache and see real favicons instantly. Test all sizes including Apple Touch Icon, ICO, PNG, and SVG. Also works as a favicon tester and size checker.',
  ogImage: {
    title: 'Favicon Checker',
    description: 'Bypass the cache. See your real favicon instantly.',
    icon: 'i-lucide-search',
  },
})

useWebPageSchema({
  name: 'Favicon Checker — Free Online Favicon Checker, Validator & Audit Tool',
  description:
    'Free favicon checker, validator & audit tool. Bypass browser cache and see real favicons instantly. Test all sizes including Apple Touch Icon, ICO, PNG, and SVG.',
  type: 'SearchResultsPage',
})

useFAQSchema([
  {
    question: "Why isn't my favicon updating in the browser?",
    answer:
      'Browsers cache favicons aggressively, sometimes for weeks or even months. Even clearing your browser cache may not help because favicons are cached separately. Use this tool to bypass the cache and see the actual current favicon your server is delivering.',
  },
  {
    question: 'What sizes should a favicon be?',
    answer:
      'Modern websites should include multiple favicon sizes: a 16×16 ICO or PNG for browser tabs, 32×32 for higher DPI displays, 180×180 Apple Touch Icon for iOS home screens, and optionally 192×192 and 512×512 PNG icons in a web manifest for Android devices.',
  },
  {
    question: 'How does this favicon checker work?',
    answer:
      'We fetch your website\'s HTML directly from the server, parse all <link rel="icon">, <link rel="apple-touch-icon">, and web manifest references, then download each favicon image with cache-busting headers. This completely bypasses your browser\'s favicon cache.',
  },
  {
    question: 'What favicon formats are supported?',
    answer:
      'This tool detects and displays all common favicon formats including ICO, PNG, SVG, GIF, and WEBP. It finds favicons declared in HTML link tags, the default /favicon.ico location, and web app manifest files.',
  },
  {
    question: 'Can I download the favicons I find?',
    answer:
      'Yes! Each detected favicon includes a download button so you can save any favicon image directly to your device.',
  },
])

useSchemaOrg([
  defineHowTo({
    name: "How to Check a Website's Favicon",
    step: [
      defineHowToStep({
        text: 'Enter a URL — paste any website URL and we handle validation and normalization.',
      }),
      defineHowToStep({
        text: 'We fetch and scan — HTML parsing, manifest reading, and cache-busting fetch, all server-side.',
      }),
      defineHowToStep({
        text: 'See the truth — every favicon displayed at multiple sizes with download links.',
      }),
    ],
  }),
])

useScrollReveal()

const { urlInput, isChecking, result, error, recentChecks, checkFavicon } = useFaviconChecker()

function downloadFavicon(favicon: Favicon) {
  const link = document.createElement('a')
  link.href = favicon.dataUrl
  const ext = favicon.type.includes('svg')
    ? 'svg'
    : favicon.type.includes('png')
      ? 'png'
      : favicon.type.includes('gif')
        ? 'gif'
        : 'ico'
  link.download = `favicon-${favicon.sizes || 'default'}.${ext}`
  link.click()
}

function formatDomain(domain?: string | null): string {
  if (!domain) return 'Unknown domain'

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
    <section
      class="hero-glow relative overflow-hidden bg-linear-to-b from-primary-50 to-transparent pb-12 pt-16 dark:from-primary-950/30 dark:to-transparent"
    >
      <div class="animated-gradient-bg absolute inset-0 opacity-50" />

      <div class="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <!-- Logo + Title -->
        <div class="mb-8 animate-fade-in">
          <img src="/logo.png" alt="Favicon Checker" class="mx-auto mb-4 size-16 drop-shadow-lg" />
          <h1
            class="font-display text-4xl font-extrabold tracking-tight text-default sm:text-5xl lg:text-6xl"
          >
            Favicon
            <span
              class="bg-linear-to-r from-primary-500 to-primary-300 bg-clip-text text-transparent"
              >Checker</span
            >
          </h1>
          <p class="mt-3 text-lg text-muted">Bypass the cache. See the real favicon.</p>
          <p class="mt-1 text-sm text-dimmed">
            Favicon validator · Favicon tester · Favicon audit · Favicon size checker
          </p>
        </div>

        <!-- ─── Search Form ─── -->
        <!-- eslint-disable-next-line narduk/no-native-form, narduk/prefer-uform -- native form for accessibility and progressive enhancement with @submit.prevent; UForm not used for this search UX -->
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
          <UButton variant="link" to="/batch" icon="i-lucide-layers" size="sm">
            Batch check multiple sites
          </UButton>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════
         RESULTS
         ═══════════════════════════════════════════════════════════════════ -->
    <section v-if="isChecking || result || error" class="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <!-- Loading skeleton -->
      <div v-if="isChecking" class="space-y-4">
        <div class="flex items-center gap-3 text-dimmed">
          <UIcon name="i-lucide-loader-2" class="size-5 animate-spin" />
          <span>Scanning favicons...</span>
        </div>
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div
            v-for="i in 3"
            :key="i"
            class="card-base animate-pulse rounded-2xl p-6"
            :class="`stagger-${i}`"
          >
            <div class="mx-auto mb-4 size-16 rounded-lg bg-muted" />
            <div class="mx-auto mb-2 h-4 w-24 rounded bg-muted" />
            <div class="mx-auto h-3 w-16 rounded bg-muted" />
          </div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="card-base animate-scale-in rounded-2xl p-8 text-center">
        <UIcon name="i-lucide-alert-circle" class="mx-auto mb-4 size-12 text-error-500" />
        <h2 class="mb-2 text-xl font-semibold text-default">Couldn't Check Favicon</h2>
        <p class="text-muted">
          {{ error }}
        </p>
        <UButton
          class="press-effect mt-4"
          variant="outline"
          icon="i-lucide-refresh-cw"
          @click="checkFavicon"
        >
          Try Again
        </UButton>
      </div>

      <!-- Results -->
      <div v-else-if="result" class="space-y-6">
        <div class="flex animate-fade-in items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-default">
              {{
                result.favicons.length > 0
                  ? `Found ${result.favicons.length} favicon${result.favicons.length === 1 ? '' : 's'}`
                  : 'No favicons found'
              }}
            </h2>
            <p class="mt-1 text-sm text-dimmed">
              {{ result.url }}
            </p>
          </div>
          <UBadge variant="subtle" size="lg">
            <ClientOnly fallback="...">
              {{ new Date(result.checkedAt).toLocaleTimeString() }}
            </ClientOnly>
          </UBadge>
        </div>

        <!-- Empty state -->
        <div
          v-if="result.favicons.length === 0"
          class="card-base animate-scale-in rounded-2xl p-10 text-center"
        >
          <UIcon name="i-lucide-image-off" class="mx-auto mb-4 size-16 text-dimmed" />
          <h3 class="mb-2 text-lg font-semibold text-default">No Favicons Detected</h3>
          <p class="mx-auto max-w-md text-muted">This site doesn't have any favicons configured.</p>
        </div>

        <!-- Favicon grid -->
        <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="(favicon, index) in result.favicons"
            :key="index"
            class="card-base animate-slide-up-sm group rounded-2xl p-6"
            :style="{ animationDelay: `${index * 0.08}s` }"
          >
            <div class="mb-4 flex items-center justify-center rounded-xl bg-elevated p-6">
              <img
                :src="favicon.dataUrl"
                :alt="`Favicon from ${favicon.source}`"
                class="size-20 object-contain transition-transform duration-200 group-hover:scale-105"
                loading="lazy"
              />
            </div>

            <div class="mb-3">
              <UBadge :color="getSourceBadgeColor(favicon.source)" variant="subtle" size="sm">
                {{ favicon.source }}
              </UBadge>
            </div>

            <div class="space-y-1 text-sm">
              <div class="flex items-center justify-between">
                <span class="text-dimmed">Type</span>
                <span class="font-mono text-xs text-default">{{
                  favicon.type.split('/')[1] || favicon.type
                }}</span>
              </div>
              <div v-if="favicon.sizes" class="flex items-center justify-between">
                <span class="text-dimmed">Sizes</span>
                <span class="font-mono text-xs text-default">{{ favicon.sizes }}</span>
              </div>
            </div>

            <div class="mt-4 flex items-end gap-2">
              <div
                v-for="size in previewSizes"
                :key="size"
                class="flex flex-col items-center gap-1"
              >
                <img
                  :src="favicon.dataUrl"
                  :alt="`${size}px`"
                  :style="{ width: `${size}px`, height: `${size}px` }"
                  class="object-contain"
                  loading="lazy"
                />
                <span class="text-[10px] text-dimmed">{{ size }}</span>
              </div>
            </div>

            <UButton
              class="press-effect mt-4 w-full"
              variant="soft"
              size="sm"
              icon="i-lucide-download"
              @click="downloadFavicon(favicon)"
            >
              Download
            </UButton>
          </article>
        </div>

        <!-- Audit Score -->
        <FaviconAuditScore
          v-if="result.auditScore !== undefined"
          :score="result.auditScore"
          :grade="result.auditGrade"
          :checks="result.auditChecks"
          class="animate-slide-up-sm stagger-4"
        />

        <!-- Code Snippets -->
        <FaviconCodeSnippet
          v-if="result.favicons.length > 0"
          :favicons="result.favicons"
          class="animate-slide-up-sm stagger-5"
        />
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════
         HOW IT WORKS (only when no result shown)
         ═══════════════════════════════════════════════════════════════════ -->
    <section v-if="!result && !isChecking && !error" class="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
      <h2 class="reveal-on-scroll mb-10 text-center text-3xl font-bold text-default">
        How It Works
      </h2>
      <div class="grid gap-6 sm:grid-cols-3">
        <div
          class="reveal-on-scroll card-base select-none rounded-2xl p-6 text-center"
          data-delay="1"
        >
          <div
            class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary-500/10"
          >
            <UIcon name="i-lucide-link" class="size-7 text-primary-500" />
          </div>
          <h3 class="mb-2 font-semibold text-default">1. Enter a URL</h3>
          <p class="text-sm text-muted">
            Paste any website URL — we handle validation and normalization.
          </p>
        </div>
        <div
          class="reveal-on-scroll card-base select-none rounded-2xl p-6 text-center"
          data-delay="2"
        >
          <div
            class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary-500/10"
          >
            <UIcon name="i-lucide-scan-search" class="size-7 text-primary-500" />
          </div>
          <h3 class="mb-2 font-semibold text-default">2. We Fetch &amp; Scan</h3>
          <p class="text-sm text-muted">
            HTML parsing, manifest reading, and cache-busting fetch — all server-side.
          </p>
        </div>
        <div
          class="reveal-on-scroll card-base select-none rounded-2xl p-6 text-center"
          data-delay="3"
        >
          <div
            class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary-500/10"
          >
            <UIcon name="i-lucide-eye" class="size-7 text-primary-500" />
          </div>
          <h3 class="mb-2 font-semibold text-default">3. See the Truth</h3>
          <p class="text-sm text-muted">
            Every favicon displayed at multiple sizes with download links.
          </p>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════
         WHY FAVICONS MATTER
         ═══════════════════════════════════════════════════════════════════ -->
    <section v-if="!result && !isChecking && !error" class="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
      <h2 class="reveal-on-scroll mb-6 text-center text-3xl font-bold text-default">
        Why Favicons Matter
      </h2>
      <div class="reveal-on-scroll card-base mx-auto max-w-3xl space-y-4 rounded-2xl p-8">
        <p class="text-muted leading-relaxed">
          A favicon is often the <strong class="text-default">first visual element</strong> users
          associate with your brand. It appears in browser tabs, bookmarks, search results, and
          mobile home screens. A missing or broken favicon signals neglect and erodes trust —
          studies show users are more likely to leave sites that feel unprofessional.
        </p>
        <p class="text-muted leading-relaxed">
          Modern favicons go far beyond the classic 16×16 ICO file. Today's web demands
          <strong class="text-default">multiple sizes and formats</strong>: SVG for sharp rendering
          at any scale, Apple Touch Icons for iOS home screens, and web manifest icons for Android
          PWA installs. Getting this right means your brand looks polished everywhere.
        </p>
        <p class="text-muted leading-relaxed">
          The biggest problem? <strong class="text-default">Browser caching</strong>. Browsers cache
          favicons separately from regular assets, sometimes for months. You can deploy a new
          favicon and never see it update — this tool solves that by fetching directly from your
          server, completely bypassing the cache.
        </p>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════
         SUPPORTED FORMATS
         ═══════════════════════════════════════════════════════════════════ -->
    <section v-if="!result && !isChecking && !error" class="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
      <h2 class="reveal-on-scroll mb-6 text-center text-3xl font-bold text-default">
        Supported Favicon Formats
      </h2>
      <div class="reveal-on-scroll grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="fmt in [
            {
              name: 'ICO',
              bestFor: 'Legacy tabs, /favicon.ico',
              transparency: '✅ Yes',
              support: 'Universal',
            },
            {
              name: 'PNG',
              bestFor: 'Modern browsers, Apple Touch',
              transparency: '✅ Yes',
              support: 'Universal',
            },
            {
              name: 'SVG',
              bestFor: 'Scalable, dark mode',
              transparency: '✅ Yes',
              support: 'Chrome, Firefox, Edge',
            },
            {
              name: 'WEBP',
              bestFor: 'Smaller file sizes',
              transparency: '✅ Yes',
              support: 'Chrome, Firefox, Edge',
            },
            {
              name: 'GIF',
              bestFor: 'Animated favicons (rare)',
              transparency: '⚠️ Limited',
              support: 'Most browsers',
            },
          ]"
          :key="fmt.name"
          class="card-base rounded-2xl p-5"
        >
          <p class="mb-2 text-lg font-mono font-bold text-primary-500">
            {{ fmt.name }}
          </p>
          <p class="text-sm text-muted">
            <span class="font-medium text-default">Best for:</span> {{ fmt.bestFor }}
          </p>
          <p class="text-sm text-muted">
            <span class="font-medium text-default">Transparency:</span> {{ fmt.transparency }}
          </p>
          <p class="text-sm text-muted">
            <span class="font-medium text-default">Support:</span> {{ fmt.support }}
          </p>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════
         COMMON FAVICON PROBLEMS
         ═══════════════════════════════════════════════════════════════════ -->
    <section v-if="!result && !isChecking && !error" class="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
      <h2 class="reveal-on-scroll mb-6 text-center text-3xl font-bold text-default">
        Common Favicon Problems
      </h2>
      <div class="reveal-on-scroll grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div class="card-base select-none rounded-2xl p-6">
          <div class="mb-3 flex size-10 items-center justify-center rounded-xl bg-error-500/10">
            <UIcon name="i-lucide-refresh-cw-off" class="size-5 text-error-500" />
          </div>
          <h3 class="mb-2 font-semibold text-default">Favicon Not Updating</h3>
          <p class="text-sm text-muted">
            Browsers cache favicons in a separate database from normal web cache. Clearing your
            browser cache won't help — you need to access the favicon URL directly and hard-refresh,
            or use this tool.
          </p>
        </div>
        <div class="card-interactive rounded-2xl p-6">
          <div class="mb-3 flex size-10 items-center justify-center rounded-xl bg-warning-500/10">
            <UIcon name="i-lucide-file-warning" class="size-5 text-warning-500" />
          </div>
          <h3 class="mb-2 font-semibold text-default">Wrong Path or Missing File</h3>
          <p class="text-sm text-muted">
            The most common issue is a broken path in the HTML. Check that your
            <code class="rounded bg-elevated px-1">&lt;link rel="icon"&gt;</code> href actually
            resolves to a real file on your server.
          </p>
        </div>
        <div class="card-interactive rounded-2xl p-6">
          <div class="mb-3 flex size-10 items-center justify-center rounded-xl bg-info-500/10">
            <UIcon name="i-lucide-file-json" class="size-5 text-info-500" />
          </div>
          <h3 class="mb-2 font-semibold text-default">Missing Web Manifest</h3>
          <p class="text-sm text-muted">
            Android devices and PWA installs rely on
            <code class="rounded bg-elevated px-1">site.webmanifest</code> for their icons. Without
            it, your app will show a generic icon on home screens.
          </p>
        </div>
        <div class="card-interactive rounded-2xl p-6">
          <div class="mb-3 flex size-10 items-center justify-center rounded-xl bg-warning-500/10">
            <UIcon name="i-lucide-image-off" class="size-5 text-warning-500" />
          </div>
          <h3 class="mb-2 font-semibold text-default">Wrong MIME Type</h3>
          <p class="text-sm text-muted">
            Serving a PNG as <code class="rounded bg-elevated px-1">image/x-icon</code> or an ICO as
            <code class="rounded bg-elevated px-1">image/png</code> can cause some browsers to
            silently ignore the favicon.
          </p>
        </div>
        <div class="card-interactive rounded-2xl p-6">
          <div class="mb-3 flex size-10 items-center justify-center rounded-xl bg-error-500/10">
            <UIcon name="i-lucide-smartphone" class="size-5 text-error-500" />
          </div>
          <h3 class="mb-2 font-semibold text-default">Missing Apple Touch Icon</h3>
          <p class="text-sm text-muted">
            iOS requires a 180×180 PNG as an Apple Touch Icon. Without it, Safari will take a
            screenshot of your page instead — which usually looks terrible.
          </p>
        </div>
        <div class="card-interactive rounded-2xl p-6">
          <div class="mb-3 flex size-10 items-center justify-center rounded-xl bg-info-500/10">
            <UIcon name="i-lucide-minimize-2" class="size-5 text-info-500" />
          </div>
          <h3 class="mb-2 font-semibold text-default">Only One Size Provided</h3>
          <p class="text-sm text-muted">
            A single 16×16 favicon isn't enough. Provide at least 16×16, 32×32, 180×180 (Apple), and
            512×512 (manifest) for crisp rendering across all devices.
          </p>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════
         MORE TOOLS & RESOURCES
         ═══════════════════════════════════════════════════════════════════ -->
    <section v-if="!result && !isChecking && !error" class="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
      <h2 class="reveal-on-scroll mb-6 text-center text-3xl font-bold text-default">
        More Favicon Tools
      </h2>
      <div class="reveal-on-scroll grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink to="/generator" class="card-interactive flex items-center gap-4 rounded-2xl p-5">
          <div
            class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-500/10"
          >
            <UIcon name="i-lucide-image" class="size-6 text-primary-500" />
          </div>
          <div>
            <p class="font-semibold text-default">Favicon Generator</p>
            <p class="text-sm text-muted">Upload one image, get every size</p>
          </div>
        </NuxtLink>
        <NuxtLink to="/batch" class="card-interactive flex items-center gap-4 rounded-2xl p-5">
          <div
            class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-500/10"
          >
            <UIcon name="i-lucide-layers" class="size-6 text-primary-500" />
          </div>
          <div>
            <p class="font-semibold text-default">Batch Check</p>
            <p class="text-sm text-muted">Check multiple sites at once</p>
          </div>
        </NuxtLink>
        <NuxtLink to="/monitor" class="card-interactive flex items-center gap-4 rounded-2xl p-5">
          <div
            class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-500/10"
          >
            <UIcon name="i-lucide-eye" class="size-6 text-primary-500" />
          </div>
          <div>
            <p class="font-semibold text-default">Favicon Monitor</p>
            <p class="text-sm text-muted">Track favicon changes over time</p>
          </div>
        </NuxtLink>
        <NuxtLink to="/trends" class="card-interactive flex items-center gap-4 rounded-2xl p-5">
          <div
            class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-500/10"
          >
            <UIcon name="i-lucide-trending-up" class="size-6 text-primary-500" />
          </div>
          <div>
            <p class="font-semibold text-default">Favicon Trends</p>
            <p class="text-sm text-muted">Data on favicon adoption across the web</p>
          </div>
        </NuxtLink>
        <NuxtLink to="/gallery" class="card-interactive flex items-center gap-4 rounded-2xl p-5">
          <div
            class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-500/10"
          >
            <UIcon name="i-lucide-layout-grid" class="size-6 text-primary-500" />
          </div>
          <div>
            <p class="font-semibold text-default">Favicon Gallery</p>
            <p class="text-sm text-muted">Best designs by industry</p>
          </div>
        </NuxtLink>
        <NuxtLink to="/guide" class="card-interactive flex items-center gap-4 rounded-2xl p-5">
          <div
            class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-500/10"
          >
            <UIcon name="i-lucide-book-open" class="size-6 text-primary-500" />
          </div>
          <div>
            <p class="font-semibold text-default">Complete Guide</p>
            <p class="text-sm text-muted">Sizes, formats & best practices</p>
          </div>
        </NuxtLink>
        <NuxtLink
          to="/tools/svg-to-favicon"
          class="card-interactive flex items-center gap-4 rounded-2xl p-5"
        >
          <div
            class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-500/10"
          >
            <UIcon name="i-lucide-file-code" class="size-6 text-primary-500" />
          </div>
          <div>
            <p class="font-semibold text-default">SVG to Favicon</p>
            <p class="text-sm text-muted">Convert SVG to all PNG sizes</p>
          </div>
        </NuxtLink>
        <NuxtLink
          to="/tools/ico-to-png"
          class="card-interactive flex items-center gap-4 rounded-2xl p-5"
        >
          <div
            class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-500/10"
          >
            <UIcon name="i-lucide-refresh-cw" class="size-6 text-primary-500" />
          </div>
          <div>
            <p class="font-semibold text-default">ICO to PNG</p>
            <p class="text-sm text-muted">Convert .ico files to .png</p>
          </div>
        </NuxtLink>
        <NuxtLink
          to="/tools/favicon-size-checker"
          class="card-interactive flex items-center gap-4 rounded-2xl p-5"
        >
          <div
            class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-500/10"
          >
            <UIcon name="i-lucide-ruler" class="size-6 text-primary-500" />
          </div>
          <div>
            <p class="font-semibold text-default">Size Checker</p>
            <p class="text-sm text-muted">Verify dimensions & transparency</p>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Recent Checks -->
    <section
      v-if="recentChecks && recentChecks.length > 0 && !isChecking"
      class="mx-auto max-w-4xl px-4 pb-16 sm:px-6"
    >
      <h2 class="reveal-on-scroll mb-6 text-lg font-semibold text-default">Recent Checks</h2>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <NuxtLink
          v-for="(check, i) in recentChecks"
          :key="check.id"
          :to="`/check/${check.domain}`"
          class="reveal-on-scroll card-interactive flex items-center gap-3 rounded-xl p-3 text-left"
          :data-delay="(i % 4) + 1"
        >
          <div
            class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-500/10"
          >
            <UIcon name="i-lucide-globe" class="size-5 text-primary-500" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-default">
              {{ formatDomain(check.domain) }}
            </p>
            <p class="text-xs text-dimmed">
              {{ check.faviconCount }} favicon{{ check.faviconCount === 1 ? '' : 's' }} ·
              <ClientOnly fallback="recently">{{ timeAgo(check.checkedAt) }}</ClientOnly>
            </p>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- FAQ -->
    <section class="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
      <h2 class="reveal-on-scroll mb-8 text-center text-3xl font-bold text-default">FAQ</h2>
      <div class="reveal-on-scroll">
        <UAccordion
          :items="[
            {
              label: 'Why isn\'t my favicon updating?',
              content:
                'Browsers cache favicons aggressively, sometimes for weeks. This tool fetches directly from your server, bypassing all browser caching.',
            },
            {
              label: 'What sizes should a favicon be?',
              content:
                '16×16 for tabs, 32×32 for high DPI, 180×180 Apple Touch Icon, and 192/512px in a web manifest.',
            },
            {
              label: 'How does it work?',
              content:
                'We fetch HTML server-side, parse link tags and manifests, then download each favicon with cache-busting headers.',
            },
            {
              label: 'What formats are supported?',
              content:
                'ICO, PNG, SVG, GIF, and WEBP — from HTML link tags, /favicon.ico, and web app manifests.',
            },
            {
              label: 'Is it free?',
              content: 'Yes, completely free. Rate limited to 10 checks/minute per IP.',
            },
          ]"
        />
      </div>
    </section>

    <ScrollToTop />
  </div>
</template>
