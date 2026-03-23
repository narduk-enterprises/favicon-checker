<script setup lang="ts">
useSeo({
  title: 'Favicon Checker vs RealFaviconGenerator — Comparison (2026)',
  description:
    'Honest comparison between Favicon Checker and RealFaviconGenerator. See which tool is best for checking, testing, and generating favicons.',
  ogImage: {
    title: 'Favicon Checker vs RealFaviconGenerator',
    description: 'An honest, side-by-side comparison of two popular favicon tools.',
    icon: 'i-lucide-scale',
  },
})

useWebPageSchema({
  name: 'Favicon Checker vs RealFaviconGenerator — Feature Comparison (2026)',
  description:
    'Honest comparison between Favicon Checker and RealFaviconGenerator. See which tool is best for checking, testing, and generating favicons.',
})

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'Favicon Checker', item: '/' },
      { name: 'vs RealFaviconGenerator', item: '/compare/realfavicongenerator' },
    ],
  }),
])

useFAQSchema([
  {
    question: 'Is Favicon Checker better than RealFaviconGenerator?',
    answer:
      'They serve different primary purposes. Favicon Checker excels at checking and auditing favicons — bypassing browser cache, batch checking multiple sites, and monitoring changes. RealFaviconGenerator excels at generating favicons with platform-specific previews. Use both for a complete workflow.',
  },
  {
    question: 'Can Favicon Checker generate favicons like RealFaviconGenerator?',
    answer:
      'Yes, Favicon Checker includes a favicon generator that creates all standard sizes from one image. However, RealFaviconGenerator offers more generation features like text/emoji favicons and platform-specific previews.',
  },
  {
    question: 'Which tool is free?',
    answer:
      'Both Favicon Checker and RealFaviconGenerator are free to use with no sign-up required.',
  },
])

useScrollReveal()

const features = [
  { feature: 'Check any URL', us: true, them: true },
  { feature: 'Bypass browser cache', us: true, them: false },
  { feature: 'Show all favicon sizes', us: true, them: true },
  { feature: 'Download individual favicons', us: true, them: false },
  { feature: 'Favicon audit score', us: true, them: true },
  { feature: 'Generate favicons from image', us: true, them: true },
  { feature: 'Batch check multiple sites', us: true, them: false },
  { feature: 'Per-domain SEO pages', us: true, them: false },
  { feature: 'Monitor favicon changes', us: true, them: false },
  { feature: 'Free (no sign-up)', us: true, them: true },
  { feature: 'Client-side (privacy)', us: true, them: false },
  { feature: 'API access', us: true, them: false },
  { feature: 'Platform compatibility check', us: false, them: true },
  { feature: 'Generate from text/emoji', us: false, them: true },
]
</script>

<template>
  <div class="min-h-screen">
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
          class="animate-slide-up font-display text-2xl font-extrabold tracking-tight text-default sm:text-3xl lg:text-4xl"
        >
          Favicon Checker vs
          <span class="bg-linear-to-r from-primary-500 to-primary-300 bg-clip-text text-transparent"
            >RealFaviconGenerator</span
          >
        </h1>
        <p class="stagger-2 mt-3 animate-slide-up text-lg text-muted">
          An honest, side-by-side comparison.
        </p>
      </div>
    </section>

    <section class="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <!-- Comparison Table -->
      <div class="reveal-on-scroll card-base overflow-hidden rounded-2xl">
        <div class="overflow-x-auto">
          <!-- eslint-disable-next-line narduk/no-native-table -- comparison table with custom colspan styling not supported by UTable -->
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-default bg-elevated/50">
                <th class="px-4 py-3 text-left font-semibold text-default">Feature</th>
                <th class="px-4 py-3 text-center font-semibold text-primary-500">
                  Favicon Checker
                </th>
                <th class="px-4 py-3 text-center font-semibold text-default">
                  RealFaviconGenerator
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in features"
                :key="row.feature"
                class="border-b border-default last:border-0"
              >
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

      <!-- Summary -->
      <div class="reveal-on-scroll mt-8 card-base rounded-2xl p-6 space-y-4">
        <h2 class="text-xl font-bold text-default">Summary</h2>
        <p class="text-muted leading-relaxed">
          <strong class="text-default">RealFaviconGenerator</strong> is a mature tool with excellent
          favicon generation and platform-specific compatibility testing. It's been the go-to for
          years.
        </p>
        <p class="text-muted leading-relaxed">
          <strong class="text-primary-500">Favicon Checker</strong> focuses on the
          <em>checking and auditing</em> workflow: bypassing browser cache, batch checking,
          per-domain reports, monitoring changes, and providing an audit score. It also includes a
          generator, but excels at helping you understand what your server is actually serving.
        </p>
        <p class="text-muted leading-relaxed">
          <strong class="text-default">When to use which?</strong> Use RealFaviconGenerator when
          creating favicons from scratch with platform-specific previews. Use Favicon Checker when
          you need to verify what's deployed, debug caching issues, or audit multiple sites.
        </p>
      </div>

      <!-- CTA -->
      <div class="mt-8 text-center">
        <UButton to="/" icon="i-lucide-search" size="lg" class="press-effect">
          Try Favicon Checker Free
        </UButton>
        <div class="mt-4 flex flex-wrap items-center justify-center gap-1">
          <UButton variant="link" to="/compare/favicon-io" icon="i-lucide-scale" size="sm">
            Compare vs favicon.io
          </UButton>
          <span class="text-dimmed">·</span>
          <UButton variant="link" to="/generator" icon="i-lucide-image" size="sm">
            Favicon Generator
          </UButton>
          <span class="text-dimmed">·</span>
          <UButton variant="link" to="/guide" icon="i-lucide-book-open" size="sm">
            Complete Guide
          </UButton>
        </div>
      </div>
    </section>

    <ScrollToTop />
  </div>
</template>
