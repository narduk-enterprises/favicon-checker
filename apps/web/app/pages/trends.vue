<script setup lang="ts">
/* eslint-disable nuxt-guardrails/require-use-seo-on-pages */

useAppSeo({
  title: 'Favicon Trends — What Favicons Do Top Websites Use?',
  description: 'Data-driven analysis of favicon usage across the web. See which formats, sizes, and configurations are most popular among top websites.',
})

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'Favicon Checker', item: '/' },
      { name: 'Trends', item: '/trends' },
    ],
  }),
])

useScrollReveal()

const { data: trends } = await useTrends()

function pct(value: number): string {
  const total = trends.value?.totalDomains ?? 0
  if (total === 0) return '0'
  return Math.round((value / total) * 100).toString()
}

const domainCount = computed(() => trends.value?.totalDomains ?? 0)
const avgCount = computed(() => trends.value?.avgFaviconCount?.toFixed(1) ?? '0')
const avgScore = computed(() => trends.value?.avgAuditScore?.toFixed(0) ?? '0')

const formatBars = computed(() => {
  const total = trends.value?.totalDomains ?? 0
  if (total === 0) return []
  return [
    { label: 'ICO', count: trends.value!.withIco, pct: Math.round((trends.value!.withIco / total) * 100), width: Math.max(Math.round((trends.value!.withIco / total) * 100), 5), color: 'bg-primary-500' },
    { label: 'PNG', count: trends.value!.withPng, pct: Math.round((trends.value!.withPng / total) * 100), width: Math.max(Math.round((trends.value!.withPng / total) * 100), 5), color: 'bg-cyan-400' },
    { label: 'SVG', count: trends.value!.withSvg, pct: Math.round((trends.value!.withSvg / total) * 100), width: Math.max(Math.round((trends.value!.withSvg / total) * 100), 5), color: 'bg-teal-400' },
    { label: 'Apple Touch', count: trends.value!.withApple, pct: Math.round((trends.value!.withApple / total) * 100), width: Math.max(Math.round((trends.value!.withApple / total) * 100), 5), color: 'bg-sky-500' },
    { label: 'Manifest', count: trends.value!.withManifest, pct: Math.round((trends.value!.withManifest / total) * 100), width: Math.max(Math.round((trends.value!.withManifest / total) * 100), 5), color: 'bg-indigo-400' },
  ]
})

const icoPct = computed(() => pct(trends.value?.withIco ?? 0))
const svgPct = computed(() => pct(trends.value?.withSvg ?? 0))
const applePct = computed(() => pct(trends.value?.withApple ?? 0))
const manifestPct = computed(() => pct(trends.value?.withManifest ?? 0))
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
          <span class="bg-linear-to-r from-primary-500 to-primary-300 bg-clip-text text-transparent">Trends</span>
        </h1>
        <p class="stagger-2 mt-3 animate-slide-up text-lg text-muted">
          Live data from {{ domainCount }} websites we've checked.
        </p>
      </div>
    </section>

    <!-- Stats -->
    <section class="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <!-- Overview Cards -->
      <div class="mb-10 grid gap-4 sm:grid-cols-3">
        <div class="reveal-on-scroll card-base rounded-2xl p-6 text-center">
          <p class="text-3xl font-extrabold text-primary-500">{{ domainCount }}</p>
          <p class="mt-1 text-sm text-muted">Domains Checked</p>
        </div>
        <div class="reveal-on-scroll card-base rounded-2xl p-6 text-center" data-delay="1">
          <p class="text-3xl font-extrabold text-primary-500">{{ avgCount }}</p>
          <p class="mt-1 text-sm text-muted">Avg Favicons per Site</p>
        </div>
        <div class="reveal-on-scroll card-base rounded-2xl p-6 text-center" data-delay="2">
          <p class="text-3xl font-extrabold text-primary-500">{{ avgScore }}/100</p>
          <p class="mt-1 text-sm text-muted">Avg Audit Score</p>
        </div>
      </div>

      <!-- Format Breakdown -->
      <h2 class="reveal-on-scroll mb-6 text-2xl font-bold text-default">Format Adoption</h2>
      <div class="reveal-on-scroll card-base space-y-4 rounded-2xl p-6">
        <div v-for="bar in formatBars" :key="bar.label" class="flex items-center gap-4">
          <span class="w-24 shrink-0 text-sm font-medium text-default">{{ bar.label }}</span>
          <div class="h-6 flex-1 overflow-hidden rounded-full bg-elevated">
            <div
              class="flex h-full items-center rounded-full pl-3 text-xs font-bold text-white transition-all duration-700"
              :class="bar.color"
              :style="{ width: `${bar.width}%` }"
            >
              {{ bar.pct }}%
            </div>
          </div>
          <span class="w-12 shrink-0 text-right text-sm text-dimmed">{{ bar.count }}</span>
        </div>
      </div>

      <!-- Insights -->
      <h2 class="reveal-on-scroll mb-6 mt-10 text-2xl font-bold text-default">Key Insights</h2>
      <div class="reveal-on-scroll grid gap-4 sm:grid-cols-2">
        <div class="card-base rounded-2xl p-6">
          <div class="mb-3 flex size-10 items-center justify-center rounded-xl bg-success-500/10">
            <UIcon name="i-lucide-check-circle" class="size-5 text-success-500" />
          </div>
          <h3 class="mb-2 font-semibold text-default">ICO Remains Universal</h3>
          <p class="text-sm text-muted">
            {{ icoPct }}% of sites serve /favicon.ico — still the most reliable fallback for maximum browser compatibility.
          </p>
        </div>
        <div class="card-base rounded-2xl p-6">
          <div class="mb-3 flex size-10 items-center justify-center rounded-xl bg-warning-500/10">
            <UIcon name="i-lucide-alert-triangle" class="size-5 text-warning-500" />
          </div>
          <h3 class="mb-2 font-semibold text-default">SVG Adoption Growing</h3>
          <p class="text-sm text-muted">
            Only {{ svgPct }}% use SVG favicons, but this format enables dark mode support and perfect scaling at any resolution.
          </p>
        </div>
        <div class="card-base rounded-2xl p-6">
          <div class="mb-3 flex size-10 items-center justify-center rounded-xl bg-error-500/10">
            <UIcon name="i-lucide-smartphone" class="size-5 text-error-500" />
          </div>
          <h3 class="mb-2 font-semibold text-default">Apple Touch Icon Gap</h3>
          <p class="text-sm text-muted">
            {{ applePct }}% include an Apple Touch Icon — the rest show a page screenshot on iOS home screens.
          </p>
        </div>
        <div class="card-base rounded-2xl p-6">
          <div class="mb-3 flex size-10 items-center justify-center rounded-xl bg-info-500/10">
            <UIcon name="i-lucide-file-json" class="size-5 text-info-500" />
          </div>
          <h3 class="mb-2 font-semibold text-default">Manifest Adoption</h3>
          <p class="text-sm text-muted">
            {{ manifestPct }}% provide web manifest icons, essential for Android PWA installs and home screen quality.
          </p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="mx-auto max-w-3xl px-4 pb-20 text-center sm:px-6">
      <div class="card-base rounded-2xl p-8">
        <h2 class="mb-3 text-2xl font-bold text-default">
          Contribute to the Data
        </h2>
        <p class="mb-6 text-muted">
          Every favicon check adds to our dataset. Help us build the most comprehensive picture of favicon adoption.
        </p>
        <UButton to="/" icon="i-lucide-search" size="lg" class="press-effect">
          Check a Favicon
        </UButton>
      </div>
    </section>

    <ScrollToTop />
  </div>
</template>
