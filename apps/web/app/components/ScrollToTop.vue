<script setup lang="ts">
const showButton = ref(false)

if (import.meta.client) {
  onMounted(() => {
    window.addEventListener('scroll', () => {
      showButton.value = window.scrollY > 400
    })
  })
}

function scrollToTop() {
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<template>
  <Transition name="scroll-top">
    <UButton
      v-show="showButton"
      icon="i-lucide-arrow-up"
      color="primary"
      variant="solid"
      size="lg"
      class="press-effect fixed bottom-6 right-6 z-50 rounded-full shadow-elevated"
      aria-label="Scroll to top"
      @click="scrollToTop"
    />
  </Transition>
</template>

<style scoped>
.scroll-top-enter-active,
.scroll-top-leave-active {
  transition: all 0.3s ease;
}
.scroll-top-enter-from,
.scroll-top-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.8);
}
</style>
