<script setup lang="ts">
useSeo({
  title: 'Complete Favicon Guide — Sizes, Formats & Best Practices (2026)',
  description: 'The definitive guide to favicons: every size, format, and implementation detail you need. Covers ICO, PNG, SVG, Apple Touch Icons, dark mode, web manifests, and common pitfalls.',
})

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'Favicon Checker', item: '/' },
      { name: 'Guide', item: '/guide' },
    ],
  }),
  defineHowTo({
    name: 'How to Implement Favicons Correctly',
    step: [
      defineHowToStep({ text: 'Create your favicon in multiple sizes: 16×16, 32×32, 180×180, 192×192, and 512×512.' }),
      defineHowToStep({ text: 'Export as ICO for legacy support, PNG for modern browsers, and SVG for perfect scaling.' }),
      defineHowToStep({ text: 'Add <link> tags in your HTML <head> for each favicon format and size.' }),
      defineHowToStep({ text: 'Create a site.webmanifest with icon entries for Android/PWA support.' }),
      defineHowToStep({ text: 'Test with a favicon checker tool to verify all sizes render correctly.' }),
    ],
  }),
])

useFAQSchema([
  {
    question: 'What is a favicon and why does it matter?',
    answer: 'A favicon (favorites icon) is the small icon displayed in browser tabs, bookmarks, and search results. It\'s often the first visual brand element users notice. A missing favicon signals an unprofessional site and reduces trust.',
  },
  {
    question: 'What is the correct size for a favicon?',
    answer: 'There is no single correct size. Modern websites need: 16×16 (browser tabs), 32×32 (high DPI tabs), 180×180 (Apple Touch Icon), 192×192 and 512×512 (Android/PWA via web manifest). SVG favicons scale to any size.',
  },
  {
    question: 'What file format should a favicon be?',
    answer: 'Use ICO for maximum legacy compatibility, PNG for most modern browsers, and SVG for perfect scaling and dark mode support. Providing all three ensures every browser and device displays your favicon correctly.',
  },
  {
    question: 'How do I make a favicon for dark mode?',
    answer: 'Use an SVG favicon with a CSS media query inside it: <style>@media (prefers-color-scheme: dark) { /* dark styles */ }</style>. This allows the favicon to adapt its colors when the user switches to dark mode.',
  },
])

useScrollReveal()

const codeExamples = {
  html: `<!-- Place in your <head> -->
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">`,
  manifest: `{
  "name": "Your App",
  "short_name": "App",
  "icons": [
    { "src": "/android-chrome-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/android-chrome-512x512.png", "sizes": "512x512", "type": "image/png" }
  ],
  "theme_color": "#ffffff",
  "background_color": "#ffffff",
  "display": "standalone"
}`,
  svgDarkMode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <style>
    rect { fill: #0e7490; }
    @media (prefers-color-scheme: dark) {
      rect { fill: #22d3ee; }
    }
  </style>
  <rect width="32" height="32" rx="6" />
</svg>`,
}

const sizeTable = [
  { size: '16×16', format: 'ICO / PNG', usage: 'Browser tabs', required: true },
  { size: '32×32', format: 'PNG', usage: 'High-DPI tabs, taskbar', required: true },
  { size: '48×48', format: 'PNG', usage: 'Windows site icons', required: false },
  { size: '180×180', format: 'PNG', usage: 'Apple Touch Icon (iOS)', required: true },
  { size: '192×192', format: 'PNG', usage: 'Android home screen', required: true },
  { size: '512×512', format: 'PNG', usage: 'Android splash, PWA install', required: true },
  { size: 'Scalable', format: 'SVG', usage: 'Modern browsers, dark mode', required: false },
]

const formatComparison = [
  { format: 'ICO', pros: 'Universal support, multiple sizes in one file', cons: 'Large file size, no transparency in old versions', bestFor: 'Legacy fallback at /favicon.ico' },
  { format: 'PNG', pros: 'Excellent quality, transparency, wide support', cons: 'Fixed resolution, larger than SVG', bestFor: 'Apple Touch Icon, manifest icons' },
  { format: 'SVG', pros: 'Infinite scaling, dark mode support, tiny file size', cons: 'Not supported in Safari 14 and older', bestFor: 'Primary favicon for modern browsers' },
  { format: 'WEBP', pros: 'Smaller file size than PNG', cons: 'Limited favicon support', bestFor: 'Experimental — not widely adopted for favicons' },
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
          The Complete
          <span class="bg-linear-to-r from-primary-500 to-primary-300 bg-clip-text text-transparent">Favicon Guide</span>
        </h1>
        <p class="stagger-2 mt-3 animate-slide-up text-lg text-muted">
          Everything you need to know about favicon sizes, formats, implementation, and testing — updated for 2026.
        </p>
        <div class="stagger-3 mt-4 flex animate-fade-in items-center justify-center gap-4">
          <UButton variant="link" to="/" icon="i-lucide-search" size="sm">
            Check your favicon
          </UButton>
          <UButton variant="link" to="/generator" icon="i-lucide-image" size="sm">
            Generate favicons
          </UButton>
        </div>
      </div>
    </section>

    <!-- Content -->
    <article class="prose-custom mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <!-- What is a favicon? -->
      <section class="reveal-on-scroll mb-12">
        <h2 class="mb-4 text-2xl font-bold text-default">
          What Is a Favicon?
        </h2>
        <div class="card-base rounded-2xl p-6 space-y-4">
          <p class="text-muted leading-relaxed">
            A <strong class="text-default">favicon</strong> (short for "favorites icon") is the small icon that represents your website. It appears in browser tabs, bookmark bars, search engine results, mobile home screens, and PWA install prompts. First introduced by Internet Explorer 5 in 1999 as a simple 16×16 ICO file at <code class="rounded bg-elevated px-1">/favicon.ico</code>, favicons have evolved into a complex ecosystem of sizes and formats.
          </p>
          <p class="text-muted leading-relaxed">
            Today's favicon is arguably your site's <strong class="text-default">most-seen brand asset</strong>. Users glance at it hundreds of times per day in their browser tabs. A missing or broken favicon immediately signals neglect — studies show users associate favicon quality with site trustworthiness.
          </p>
        </div>
      </section>

      <!-- Size Table -->
      <section class="reveal-on-scroll mb-12">
        <h2 class="mb-4 text-2xl font-bold text-default">
          Every Favicon Size You Need
        </h2>
        <div class="card-base overflow-hidden rounded-2xl">
          <div class="overflow-x-auto">
            <!-- eslint-disable-next-line narduk/no-native-table -- data table with complex colspan/structure not supported by UTable -->
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-default bg-elevated/50">
                  <th class="px-4 py-3 text-left font-semibold text-default">Size</th>
                  <th class="px-4 py-3 text-left font-semibold text-default">Format</th>
                  <th class="px-4 py-3 text-left font-semibold text-default">Usage</th>
                  <th class="px-4 py-3 text-center font-semibold text-default">Required?</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in sizeTable" :key="row.size" class="border-b border-default last:border-0">
                  <td class="px-4 py-3 font-mono font-medium text-primary-500">{{ row.size }}</td>
                  <td class="px-4 py-3 text-muted">{{ row.format }}</td>
                  <td class="px-4 py-3 text-muted">{{ row.usage }}</td>
                  <td class="px-4 py-3 text-center">
                    <UBadge :color="row.required ? 'primary' : 'neutral'" variant="subtle" size="sm">
                      {{ row.required ? 'Yes' : 'Nice to have' }}
                    </UBadge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- Format Comparison -->
      <section class="reveal-on-scroll mb-12">
        <h2 class="mb-4 text-2xl font-bold text-default">
          Favicon Format Comparison
        </h2>
        <div class="grid gap-4 sm:grid-cols-2">
          <div v-for="fmt in formatComparison" :key="fmt.format" class="card-base rounded-2xl p-5">
            <h3 class="mb-3 font-mono text-lg font-bold text-primary-500">{{ fmt.format }}</h3>
            <div class="space-y-2 text-sm">
              <p><strong class="text-success-500">✓ Pros:</strong> <span class="text-muted">{{ fmt.pros }}</span></p>
              <p><strong class="text-error-500">✗ Cons:</strong> <span class="text-muted">{{ fmt.cons }}</span></p>
              <p><strong class="text-default">Best for:</strong> <span class="text-muted">{{ fmt.bestFor }}</span></p>
            </div>
          </div>
        </div>
      </section>

      <!-- Implementation -->
      <section class="reveal-on-scroll mb-12">
        <h2 class="mb-4 text-2xl font-bold text-default">
          How to Implement Favicons
        </h2>

        <h3 class="mb-3 mt-6 text-lg font-semibold text-default">1. HTML Link Tags</h3>
        <div class="card-base rounded-2xl p-4">
          <pre class="overflow-x-auto text-sm text-muted"><code>{{ codeExamples.html }}</code></pre>
        </div>

        <h3 class="mb-3 mt-6 text-lg font-semibold text-default">2. Web Manifest</h3>
        <p class="mb-3 text-muted">
          Create a <code class="rounded bg-elevated px-1">site.webmanifest</code> file in your root directory:
        </p>
        <div class="card-base rounded-2xl p-4">
          <pre class="overflow-x-auto text-sm text-muted"><code>{{ codeExamples.manifest }}</code></pre>
        </div>

        <h3 class="mb-3 mt-6 text-lg font-semibold text-default">3. SVG Dark Mode Favicon</h3>
        <p class="mb-3 text-muted">
          SVG favicons can adapt to the user's color scheme using embedded CSS media queries:
        </p>
        <div class="card-base rounded-2xl p-4">
          <pre class="overflow-x-auto text-sm text-muted"><code>{{ codeExamples.svgDarkMode }}</code></pre>
        </div>
      </section>

      <!-- Common Mistakes -->
      <section class="reveal-on-scroll mb-12">
        <h2 class="mb-4 text-2xl font-bold text-default">
          7 Common Favicon Mistakes
        </h2>
        <div class="space-y-3">
          <div
            v-for="(mistake, i) in [
              { title: 'Only providing /favicon.ico', fix: 'Add PNG, SVG, and Apple Touch Icon for modern device coverage.' },
            { title: 'Forgetting the Apple Touch Icon', fix: 'iOS will screenshot your page if no 180×180 PNG is specified.' },
            { title: 'Skipping the web manifest', fix: 'Android uses manifest icons for home screen and PWA installs.' },
            { title: 'Wrong MIME type in server config', fix: 'Ensure .ico serves as image/x-icon and .svg as image/svg+xml.' },
            { title: 'Not testing after deployment', fix: 'Browser caches are aggressive — use a favicon checker tool to bypass them.' },
            { title: 'Using a photo or complex image', fix: 'Favicons are tiny — use simple, bold shapes with high contrast.' },
            { title: 'Ignoring dark mode', fix: 'Light favicons disappear on dark tabs — use SVG with color-scheme media query.' },
          ]" :key="i" class="card-base flex gap-4 rounded-xl p-4">
            <div class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-error-500/10 font-bold text-error-500">
              {{ i + 1 }}
            </div>
            <div>
              <p class="font-semibold text-default">{{ mistake.title }}</p>
              <p class="text-sm text-muted">{{ mistake.fix }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Testing Workflow -->
      <section class="reveal-on-scroll mb-12">
        <h2 class="mb-4 text-2xl font-bold text-default">
          Testing Your Favicons
        </h2>
        <div class="card-base rounded-2xl p-6 space-y-4">
          <p class="text-muted leading-relaxed">
            The biggest challenge with favicons is <strong class="text-default">cache invalidation</strong>. Browsers store favicons in a separate cache database that isn't cleared by a normal "Clear Cache" action. Here's a reliable testing workflow:
          </p>
          <ol class="list-decimal space-y-2 pl-6 text-muted">
            <li>Deploy your new favicon files to production.</li>
            <li>Use <NuxtLink to="/" class="font-medium text-primary-500 hover:underline">Favicon Checker</NuxtLink> to verify the server is serving the correct files.</li>
            <li>Force-refresh your browser with <UKbd>Cmd+Shift+R</UKbd> (Mac) or <UKbd>Ctrl+Shift+R</UKbd> (Windows).</li>
            <li>If the old favicon persists, open the favicon URL directly (e.g., <code class="rounded bg-elevated px-1">yourdomain.com/favicon.ico</code>) and hard-refresh that page.</li>
            <li>Test across devices — check Chrome, Safari, Firefox, plus iOS and Android.</li>
          </ol>
        </div>
      </section>

      <!-- CTA -->
      <section class="reveal-on-scroll text-center">
        <div class="card-base rounded-2xl p-8">
          <h2 class="mb-3 text-2xl font-bold text-default">
            Ready to Check Your Favicons?
          </h2>
          <p class="mb-6 text-muted">
            Use our free tool to see exactly what favicons your server is delivering — no browser cache interference.
          </p>
          <div class="flex flex-wrap items-center justify-center gap-3">
            <UButton to="/" icon="i-lucide-search" size="lg" class="press-effect">
              Check Your Favicon
            </UButton>
            <UButton to="/generator" variant="outline" icon="i-lucide-image" size="lg" class="press-effect">
              Generate Favicons
            </UButton>
            <UButton to="/batch" variant="outline" icon="i-lucide-layers" size="lg" class="press-effect">
              Batch Check
            </UButton>
          </div>
        </div>
      </section>
    </article>

    <!-- FAQ -->
    <section class="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
      <h2 class="reveal-on-scroll mb-8 text-center text-3xl font-bold text-default">
        FAQ
      </h2>
      <div class="reveal-on-scroll">
        <UAccordion
          :items="[
            { label: 'What is a favicon and why does it matter?', content: 'A favicon is the small icon in browser tabs and bookmarks. It\'s the most-seen brand element and affects user trust and recognition.' },
            { label: 'What is the correct size for a favicon?', content: '16×16 for tabs, 32×32 for high-DPI, 180×180 for Apple Touch, 192×192 and 512×512 for Android/PWA. SVG for scalable modern support.' },
            { label: 'What format should a favicon be?', content: 'Use ICO for legacy, PNG for Apple/Android, and SVG for modern browsers with dark mode support. All three together gives maximum compatibility.' },
            { label: 'How do I make a favicon for dark mode?', content: 'Use an SVG favicon with an embedded @media (prefers-color-scheme: dark) CSS rule to switch colors automatically.' },
            { label: 'Why doesn\'t my new favicon show up?', content: 'Browsers cache favicons aggressively in a separate database. Use our Favicon Checker to verify your server is serving the new file, then hard-refresh.' },
          ]"
        />
      </div>
    </section>

    <ScrollToTop />
  </div>
</template>
