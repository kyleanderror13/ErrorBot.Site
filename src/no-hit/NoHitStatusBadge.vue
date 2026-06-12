<template>
  <span class="status-badge" :class="[status, { large }]">
    <i :class="`pi ${icon}`" />
    <span>{{ label }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { NoHitCatalogRun } from '@/no-hit/NoHitTypes'

const props = defineProps<{
  status: NoHitCatalogRun['status']
  large?: boolean
}>()

const icon = computed(() => {
  switch (props.status) {
    case 'Active': return 'pi-play-circle'
    case 'Completed': return 'pi-check-circle'
    case 'Paused': return 'pi-pause-circle'
    case 'NotStarted': return 'pi-circle'
  }
})

const label = computed(() => {
  switch (props.status) {
    case 'Active': return 'Active'
    case 'Completed': return 'Completed'
    case 'Paused': return 'Paused'
    case 'NotStarted': return 'Not Started'
  }
})
</script>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 6px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-family: var(--font-mono);
  white-space: nowrap;
}

.status-badge.large {
  font-size: 13px;
  padding: 5px 14px;
}

.status-badge.Active {
  background: color-mix(in srgb, #fff346 20%, transparent);
  color: #fff346;
  border: 1px solid color-mix(in srgb, #fff346 40%, transparent);
}

.status-badge.Completed {
  background: color-mix(in srgb, #00fa9a 15%, transparent);
  color: #00fa9a;
  border: 1px solid color-mix(in srgb, #00fa9a 35%, transparent);
}

.status-badge.Paused {
  background: color-mix(in srgb, #5fb7ff 15%, transparent);
  color: #5fb7ff;
  border: 1px solid color-mix(in srgb, #5fb7ff 35%, transparent);
}

.status-badge.NotStarted {
  background: color-mix(in srgb, #6d6969 15%, transparent);
  color: #6d6969;
  border: 1px solid color-mix(in srgb, #6d6969 35%, transparent);
}
</style>
