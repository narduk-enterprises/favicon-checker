<script setup lang="ts">
/* eslint-disable nuxt-guardrails/require-use-seo-on-pages, nuxt-guardrails/require-schema-on-pages */

useAppSeo({
  title: 'Favicon Gallery — Best Favicon Designs by Industry',
  description: 'Explore the best-designed favicons on the web, organized by industry. Get inspiration for your own favicon from tech, social, e-commerce, and more.',
})

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'Favicon Checker', item: '/' },
      { name: 'Gallery', item: '/gallery' },
    ],
  }),
])

useScrollReveal()

const categories = [
  {
    name: 'Tech Giants',
    icon: 'i-lucide-cpu',
    sites: [
      { domain: 'google.com', description: 'Clean, multi-color G — instantly recognizable at any size' },
      { domain: 'apple.com', description: 'Monochrome apple — works perfectly in both light and dark mode' },
      { domain: 'microsoft.com', description: 'Four-color window — maintains clarity at 16×16' },
      { domain: 'amazon.com', description: 'Arrow smile — simple and memorable' },
    ],
  },
  {
    name: 'Developer Tools',
    icon: 'i-lucide-code',
    sites: [
      { domain: 'github.com', description: 'Octocat silhouette — bold shape, high contrast' },
      { domain: 'stackoverflow.com', description: 'Stacked overflow bars — unique geometric shape' },
      { domain: 'npmjs.com', description: 'Red npm cube — minimal and effective' },
      { domain: 'vercel.com', description: 'Black triangle — extreme minimalism' },
    ],
  },
  {
    name: 'Social Media',
    icon: 'i-lucide-share-2',
    sites: [
      { domain: 'twitter.com', description: 'X mark — bold rebrand, works at any size' },
      { domain: 'reddit.com', description: 'Snoo face — distinctive character illustration' },
      { domain: 'linkedin.com', description: 'Blue "in" — clean text-based favicon' },
      { domain: 'discord.com', description: 'Game controller face — playful personality' },
    ],
  },
  {
    name: 'News & Media',
    icon: 'i-lucide-newspaper',
    sites: [
      { domain: 'bbc.com', description: 'BBC blocks — clean typographic approach' },
      { domain: 'nytimes.com', description: 'Gothic T — classic, authoritative' },
      { domain: 'theguardian.com', description: 'Roundel G — modern editorial feel' },
      { domain: 'techcrunch.com', description: 'Green TC — brand color dominance' },
    ],
  },
  {
    name: 'E-Commerce',
    icon: 'i-lucide-shopping-cart',
    sites: [
      { domain: 'shopify.com', description: 'Green shopping bag — clear e-commerce signal' },
      { domain: 'stripe.com', description: 'Purple gradient S — premium feel' },
      { domain: 'ebay.com', description: 'Multi-color "e" — playful marketplace energy' },
      { domain: 'etsy.com', description: 'Orange Etsy — handcraft warmth' },
    ],
  },
  {
    name: 'Entertainment',
    icon: 'i-lucide-play-circle',
    sites: [
      { domain: 'spotify.com', description: 'Green sound waves — kinetic energy' },
      { domain: 'netflix.com', description: 'Red N ribbon — cinematic feel' },
      { domain: 'youtube.com', description: 'Red play button — universal media symbol' },
      { domain: 'twitch.tv', description: 'Purple speech bubble — community focus' },
    ],
  },
]
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
          <span class="bg-linear-to-r from-primary-500 to-primary-300 bg-clip-text text-transparent">Gallery</span>
        </h1>
        <p class="stagger-2 mt-3 animate-slide-up text-lg text-muted">
          The best favicon designs on the web — get inspired for your own.
        </p>
      </div>
    </section>

    <!-- Categories -->
    <section class="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div v-for="category in categories" :key="category.name" class="mb-12 last:mb-0">
        <h2 class="reveal-on-scroll mb-6 flex items-center gap-3 text-2xl font-bold text-default">
          <div class="flex size-10 items-center justify-center rounded-xl bg-primary-500/10">
            <UIcon :name="category.icon" class="size-5 text-primary-500" />
          </div>
          {{ category.name }}
        </h2>

        <div class="grid gap-4 sm:grid-cols-2">
          <NuxtLink
            v-for="(site, siteIdx) in category.sites"
            :key="site.domain"
            :to="`/check/${site.domain}`"
            class="reveal-on-scroll card-interactive flex items-center gap-4 rounded-2xl p-5"
            :data-delay="(siteIdx % 4) + 1"
          >
            <div class="flex size-14 shrink-0 items-center justify-center rounded-xl bg-elevated">
              <img
                :src="`https://www.google.com/s2/favicons?domain=${site.domain}&sz=64`"
                :alt="`${site.domain} favicon`"
                class="size-8 object-contain"
                loading="lazy"
              >
            </div>
            <div class="min-w-0 flex-1">
              <p class="font-semibold text-default">{{ site.domain }}</p>
              <p class="text-sm text-muted">{{ site.description }}</p>
            </div>
            <UIcon name="i-lucide-arrow-right" class="size-4 shrink-0 text-dimmed" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="mx-auto max-w-3xl px-4 pb-12 text-center sm:px-6">
      <div class="card-base rounded-2xl p-8">
        <h2 class="mb-3 text-2xl font-bold text-default">
          Check Any Favicon
        </h2>
        <p class="mb-6 text-muted">
          Want to see the full favicon setup for any of these sites? Run a detailed check.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-3">
          <UButton to="/" icon="i-lucide-search" size="lg" class="press-effect">
            Check a Favicon
          </UButton>
          <UButton to="/generator" variant="outline" icon="i-lucide-image" size="lg" class="press-effect">
            Generate Your Own
          </UButton>
        </div>
      </div>
    </section>

    <ScrollToTop />
  </div>
</template>
