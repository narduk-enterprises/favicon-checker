<script setup lang="ts">
useSeo({
  title: 'Favicon Monitor — Track Favicon Changes for Any Website',
  description:
    'Monitor your favorite websites for favicon changes. Add domains to your watchlist and detect when favicons are added, removed, or updated.',
  ogImage: {
    title: 'Favicon Monitor',
    description: 'Track favicon changes across your favourite domains.',
    icon: 'i-lucide-eye',
  },
})

useWebPageSchema({
  name: 'Favicon Monitor — Track Favicon Changes for Any Website',
  description:
    'Monitor your favorite websites for favicon changes. Add domains to your watchlist and detect when favicons are added, removed, or updated.',
})

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'Favicon Checker', item: '/' },
      { name: 'Monitor', item: '/monitor' },
    ],
  }),
])

useFAQSchema([
  {
    question: 'How does favicon monitoring work?',
    answer:
      "Add any domain to your watchlist. The tool stores your list in your browser's local storage. Click the refresh button to re-check a domain and detect if its favicons have changed since your last check.",
  },
  {
    question: 'Is my watchlist stored on your servers?',
    answer:
      "No. Your watchlist is stored entirely in your browser's local storage. We never see or store your monitored domains.",
  },
  {
    question: 'Why would I want to monitor favicon changes?',
    answer:
      'Favicon monitoring is useful for brand managers tracking competitors, developers verifying deployment changes, SEO professionals auditing client sites, and designers watching for industry trends.',
  },
])

useScrollReveal()

const { watchlist, isChecking, loadFromStorage, addDomain, removeDomain, checkDomain } =
  useFaviconMonitor()

const newDomain = ref('')

onMounted(() => {
  loadFromStorage()
})

function handleAddDomain() {
  addDomain(newDomain.value)
  newDomain.value = ''
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
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero -->
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
          class="animate-slide-up font-display text-3xl font-extrabold tracking-tight text-default sm:text-4xl lg:text-5xl"
        >
          Favicon
          <span class="bg-linear-to-r from-primary-500 to-primary-300 bg-clip-text text-transparent"
            >Monitor</span
          >
        </h1>
        <p class="stagger-2 mt-3 animate-slide-up text-lg text-muted">
          Track favicon changes across your favourite domains.
        </p>
      </div>
    </section>

    <!-- Add Domain -->
    <section class="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div class="card-base rounded-2xl p-6">
        <h2 class="mb-4 text-lg font-semibold text-default">Add to Watchlist</h2>
        <!-- eslint-disable-next-line narduk/no-native-form, narduk/prefer-uform -- native form for accessibility and @submit.prevent; UForm not used for this add-domain UX -->
        <form class="flex gap-3" @submit.prevent="handleAddDomain">
          <UInput
            v-model="newDomain"
            placeholder="github.com"
            icon="i-lucide-globe"
            class="flex-1"
            size="lg"
          />
          <UButton
            type="submit"
            icon="i-lucide-plus"
            size="lg"
            :disabled="!newDomain.trim()"
            class="press-effect"
          >
            Add
          </UButton>
        </form>
        <p class="mt-2 text-xs text-dimmed">Your watchlist is stored locally in your browser.</p>
      </div>
    </section>

    <!-- Watchlist -->
    <section v-if="watchlist.length > 0" class="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
      <h2 class="mb-6 text-xl font-bold text-default">Watchlist ({{ watchlist.length }})</h2>

      <div class="space-y-3">
        <div
          v-for="entry in watchlist"
          :key="entry.domain"
          class="card-interactive rounded-2xl p-5"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="flex size-10 items-center justify-center rounded-xl bg-elevated">
                <img
                  :src="`https://www.google.com/s2/favicons?domain=${entry.domain}&sz=64`"
                  :alt="entry.domain"
                  class="size-6 object-contain"
                  loading="lazy"
                />
              </div>
              <div>
                <NuxtLink
                  :to="`/check/${entry.domain}`"
                  class="font-semibold text-default hover:text-primary-500"
                >
                  {{ entry.domain }}
                </NuxtLink>
                <p class="text-xs text-dimmed">
                  Added <ClientOnly fallback="recently">{{ timeAgo(entry.addedAt) }}</ClientOnly>
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <UBadge v-if="entry.hasChange" color="warning" variant="subtle" size="sm">
                Changed
              </UBadge>
              <UButton
                variant="ghost"
                size="sm"
                icon="i-lucide-refresh-cw"
                :loading="isChecking === entry.domain"
                class="press-effect"
                @click="checkDomain(entry)"
              />
              <UButton
                variant="ghost"
                size="sm"
                icon="i-lucide-x"
                color="error"
                @click="removeDomain(entry.domain)"
              />
            </div>
          </div>

          <!-- Last check info -->
          <div
            v-if="entry.currentCheck"
            class="mt-3 grid grid-cols-3 gap-3 rounded-xl bg-elevated p-3 text-center text-sm"
          >
            <div>
              <p class="font-bold text-default">{{ entry.currentCheck.faviconCount }}</p>
              <p class="text-xs text-dimmed">Favicons</p>
            </div>
            <div>
              <p class="font-bold text-default">{{ entry.currentCheck.auditScore }}/100</p>
              <p class="text-xs text-dimmed">Score</p>
            </div>
            <div>
              <p class="font-bold text-default">
                <ClientOnly fallback="...">{{ timeAgo(entry.currentCheck.checkedAt) }}</ClientOnly>
              </p>
              <p class="text-xs text-dimmed">Last Check</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Empty state -->
    <section v-else class="mx-auto max-w-3xl px-4 pb-20 text-center sm:px-6">
      <div class="card-base rounded-2xl p-10">
        <UIcon name="i-lucide-eye" class="mx-auto mb-4 size-12 text-dimmed" />
        <h3 class="mb-2 text-lg font-semibold text-default">No domains watched yet</h3>
        <p class="text-muted">Add a domain above to start tracking favicon changes.</p>
      </div>
    </section>

    <ScrollToTop />
  </div>
</template>
