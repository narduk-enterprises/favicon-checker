<script setup lang="ts">
/* eslint-disable nuxt-guardrails/require-use-seo-on-pages, nuxt-guardrails/require-schema-on-pages */

useAppSeo({
  title: 'Favicon Checker vs favicon.io — Comparison (2026)',
  description: 'Side-by-side comparison of Favicon Checker and favicon.io. See which free favicon tool is best for your needs.',
})

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'Favicon Checker', item: '/' },
      { name: 'Compare', item: '/compare/favicon-io' },
      { name: 'vs favicon.io', item: '/compare/favicon-io' },
    ],
  }),
])

useScrollReveal()

const features = [
  { feature: 'Check any URL\'s favicon', us: true, them: false },
  { feature: 'Bypass browser cache', us: true, them: false },
  { feature: 'Batch check multiple sites', us: true, them: false },
  { feature: 'Favicon audit score', us: true, them: false },
  { feature: 'Generate from image', us: true, them: true },
  { feature: 'Generate from text/emoji', us: false, them: true },
  { feature: 'Download as ZIP', us: true, them: true },
  { feature: 'HTML code snippet', us: true, them: true },
  { feature: 'SVG to favicon', us: true, them: false },
  { feature: 'ICO to PNG converter', us: true, them: false },
  { feature: 'Monitor changes', us: true, them: false },
  { feature: 'API access', us: true, them: false },
  { feature: 'Free (no sign-up)', us: true, them: true },
]
</script>

<template>
  <div class="min-h-screen">
    <section class="hero-glow relative overflow-hidden bg-linear-to-b from-primary-50 to-transparent pb-8 pt-16 dark:from-primary-950/30 dark:to-transparent">
      <div class="animated-gradient-bg absolute inset-0 opacity-50" />
      <div class="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <NuxtLink to="/" class="group mb-4 inline-flex items-center gap-3">
          <img src="/logo.png" alt="Favicon Checker" class="size-10 drop-shadow-lg transition-transform group-hover:scale-105">
          <span class="font-display text-xl font-bold text-default">Favicon Checker</span>
        </NuxtLink>
        <h1 class="animate-slide-up font-display text-3xl font-extrabold tracking-tight text-default sm:text-4xl">
          Favicon Checker vs
          <span class="bg-linear-to-r from-primary-500 to-primary-300 bg-clip-text text-transparent">favicon.io</span>
        </h1>
        <p class="stagger-2 mt-3 animate-slide-up text-lg text-muted">
          Two popular favicon tools — here's how they compare.
        </p>
      </div>
    </section>

    <section class="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div class="reveal-on-scroll card-base overflow-hidden rounded-2xl">
        <div class="overflow-x-auto">
          <!-- eslint-disable-next-line atx/no-native-table -->
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-default bg-elevated/50">
                <th class="px-4 py-3 text-left font-semibold text-default">Feature</th>
                <th class="px-4 py-3 text-center font-semibold text-primary-500">Favicon Checker</th>
                <th class="px-4 py-3 text-center font-semibold text-default">favicon.io</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in features" :key="row.feature" class="border-b border-default last:border-0">
                <td class="px-4 py-3 text-muted">{{ row.feature }}</td>
                <td class="px-4 py-3 text-center">
                  <UIcon
                    :name="row.us ? 'i-lucide-check-circle' : 'i-lucide-x-circle'"
                    :class="row.us ? 'text-success-500' : 'text-dimmed'"
                    class="size-5"
                  />
                </td>
                <td class="px-4 py-3 text-center">
                  <UIcon
                    :name="row.them ? 'i-lucide-check-circle' : 'i-lucide-x-circle'"
                    :class="row.them ? 'text-success-500' : 'text-dimmed'"
                    class="size-5"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="reveal-on-scroll mt-8 card-base rounded-2xl p-6 space-y-4">
        <h2 class="text-xl font-bold text-default">Summary</h2>
        <p class="text-muted leading-relaxed">
          <strong class="text-default">favicon.io</strong> is a simple, focused tool for generating favicons from text, emoji, or images. Great for quickly creating a favicon when you don't have a logo yet.
        </p>
        <p class="text-muted leading-relaxed">
          <strong class="text-primary-500">Favicon Checker</strong> is a comprehensive favicon toolkit: check what any website is serving, audit favicon completeness, batch check multiple sites, convert formats, and generate all sizes. It's the full Swiss Army knife for favicons.
        </p>
      </div>

      <div class="mt-8 text-center">
        <UButton to="/" icon="i-lucide-search" size="lg" class="press-effect">
          Try Favicon Checker Free
        </UButton>
      </div>
    </section>

    <ScrollToTop />
  </div>
</template>
