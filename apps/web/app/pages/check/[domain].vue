<script setup lang="ts">
/* eslint-disable nuxt-guardrails/require-use-seo-on-pages, nuxt-guardrails/require-schema-on-pages */

const route = useRoute()
const domain = computed(() => String(route.params.domain))

const { data: result, error } = await useDomainCheck(domain.value)

useAppSeo({
  title: `${domain.value} Favicon — Check & Download`,
  description: `See all favicons for ${domain.value}. View ICO, PNG, SVG, and Apple Touch Icon at multiple sizes. Download any favicon instantly.`,
})

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'Favicon Checker', item: '/' },
      { name: domain.value, item: `/check/${domain.value}` },
    ],
  }),
])

defineOgImageComponent('Default', {
  title: `${domain.value} Favicon Report`,
  description: `${result.value?.faviconCount ?? 0} favicon(s) found`,
  siteName: 'Favicon Checker',
})

useFAQSchema([
  {
    question: `What favicon does ${domain.value} use?`,
    answer: `${domain.value} was last checked and found to have ${result.value?.faviconCount ?? 0} favicon(s). Use this page to see the latest results or re-check the site.`,
  },
  {
    question: `How do I get ${domain.value}'s favicon?`,
    answer: `Each favicon detected for ${domain.value} is shown below with a download button. Click it to save the favicon image directly to your device.`,
  },
])

const previewSizes = [16, 32, 48, 64]

function downloadFavicon(favicon: { dataUrl: string, type: string, sizes?: string }) {
  const link = document.createElement('a')
  link.href = favicon.dataUrl
  const ext = favicon.type.includes('svg') ? 'svg' : favicon.type.includes('png') ? 'png' : favicon.type.includes('gif') ? 'gif' : 'ico'
  link.download = `${domain.value}-favicon-${favicon.sizes || 'default'}.${ext}`
  link.click()
}

const router = useRouter()
function recheckDomain() {
  router.push({ path: '/', query: { url: result.value?.url || `https://${domain.value}` } })
}
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

        <h1 class="animate-slide-up font-display text-3xl font-extrabold tracking-tight text-default sm:text-4xl">
          Favicons for
          <span class="bg-linear-to-r from-primary-500 to-primary-300 bg-clip-text text-transparent">{{ domain }}</span>
        </h1>

        <p v-if="result" class="mt-3 text-muted">
          {{ result.faviconCount }} favicon{{ result.faviconCount === 1 ? '' : 's' }} found · Last checked <ClientOnly fallback="recently">{{ new Date(result.checkedAt).toLocaleDateString() }}</ClientOnly>
        </p>

        <div class="mt-4 flex items-center justify-center gap-4">
          <UButton variant="link" to="/" icon="i-lucide-search" size="sm">
            Check another site
          </UButton>
          <UButton variant="link" to="/batch" icon="i-lucide-layers" size="sm">
            Batch check
          </UButton>
        </div>
      </div>
    </section>

    <!-- Results -->
    <section class="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <!-- Error / Not Found -->
      <div v-if="error" class="card-base rounded-2xl p-10 text-center">
        <UIcon name="i-lucide-search-x" class="mx-auto mb-4 size-12 text-dimmed" />
        <h2 class="mb-2 text-xl font-semibold text-default">
          No Cached Results
        </h2>
        <p class="mb-6 text-muted">
          We haven't checked <strong>{{ domain }}</strong> yet. Run a check to see its favicons.
        </p>
        <UButton icon="i-lucide-search" class="press-effect" @click="recheckDomain">
          Check {{ domain }} Now
        </UButton>
      </div>

      <!-- Favicons -->
      <div v-else-if="result" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-default">
            {{ result.faviconCount }} Favicon{{ result.faviconCount === 1 ? '' : 's' }}
          </h2>
          <UButton variant="outline" icon="i-lucide-refresh-cw" size="sm" class="press-effect" @click="recheckDomain">
            Re-check
          </UButton>
        </div>

        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="(favicon, index) in result.favicons"
            :key="index"
            class="card-base animate-slide-up-sm group rounded-2xl p-6"
            :style="{ animationDelay: `${index * 0.08}s` }"
          >
            <div class="mb-4 flex items-center justify-center rounded-xl bg-elevated p-6">
              <img
                :src="favicon.dataUrl"
                :alt="`${domain} favicon from ${favicon.source}`"
                class="size-20 object-contain transition-transform duration-200 group-hover:scale-105"
                loading="lazy"
              >
            </div>

            <div class="mb-3">
              <UBadge color="primary" variant="subtle" size="sm">
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

        <!-- Audit Score -->
        <FaviconAuditScore
          v-if="result.auditScore !== undefined"
          :score="result.auditScore"
          :grade="result.auditGrade"
          :checks="result.auditChecks"
          class="animate-slide-up-sm"
        />

        <!-- Code Snippets -->
        <FaviconCodeSnippet
          v-if="result.favicons.length > 0"
          :favicons="result.favicons"
          :domain="domain"
          class="animate-slide-up-sm"
        />
      </div>
    </section>

    <!-- Batch CTA -->
    <section class="mx-auto max-w-3xl px-4 pb-12 text-center sm:px-6">
      <p class="text-muted">
        Need to check multiple sites?
      </p>
      <UButton
        variant="link"
        to="/batch"
        icon="i-lucide-layers"
        size="sm"
      >
        Batch check multiple sites at once
      </UButton>
    </section>

    <ScrollToTop />
  </div>
</template>
