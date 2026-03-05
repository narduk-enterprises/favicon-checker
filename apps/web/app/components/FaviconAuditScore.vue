<script setup lang="ts">
const props = defineProps<{
  score: number
  grade: string
  checks: Array<{
    name: string
    passed: boolean
    weight: number
    detail: string
  }>
}>()

const scoreColor = computed(() => {
  if (props.score >= 80) return 'text-success-500'
  if (props.score >= 50) return 'text-warning-500'
  return 'text-error-500'
})

const gradeColor = computed(() => {
  if (props.score >= 80) return 'success'
  if (props.score >= 50) return 'warning'
  return 'error'
})
</script>

<template>
  <div class="card-base rounded-2xl p-6">
    <div class="mb-4 flex items-center justify-between">
      <h3 class="text-lg font-semibold text-default">
        Favicon Audit Score
      </h3>
      <div class="flex items-center gap-3">
        <span class="text-3xl font-extrabold" :class="scoreColor">{{ score }}</span>
        <UBadge :color="(gradeColor as 'success' | 'warning' | 'error')" variant="subtle" size="lg">
          {{ grade }}
        </UBadge>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="mb-6 h-2.5 overflow-hidden rounded-full bg-elevated">
      <div
        class="h-full rounded-full transition-all duration-700 ease-out"
        :class="{
          'bg-success-500': score >= 80,
          'bg-warning-500': score >= 50 && score < 80,
          'bg-error-500': score < 50,
        }"
        :style="{ width: `${score}%` }"
      />
    </div>

    <!-- Checklist -->
    <div class="space-y-2">
      <div
        v-for="check in checks"
        :key="check.name"
        class="flex items-start gap-3 rounded-lg px-3 py-2 text-sm transition-colors"
        :class="check.passed ? 'bg-success-50 dark:bg-success-950/20' : 'bg-error-50 dark:bg-error-950/20'"
      >
        <UIcon
          :name="check.passed ? 'i-lucide-check-circle' : 'i-lucide-x-circle'"
          class="mt-0.5 size-4 shrink-0"
          :class="check.passed ? 'text-success-500' : 'text-error-500'"
        />
        <div class="min-w-0 flex-1">
          <span class="font-medium text-default">{{ check.name }}</span>
          <p class="text-xs text-muted">
            {{ check.detail }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
