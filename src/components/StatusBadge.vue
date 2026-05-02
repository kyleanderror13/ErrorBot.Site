<template>
  <span class="status-badge" :class="[status, { large }]">
    <i :class="`pi ${icon}`" />
    <span>{{ label }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { NoHitRun } from '@/types'

const props = defineProps<{
  status: NoHitRun['status']
  large?: boolean
}>()

const icon = computed(() => {
  switch (props.status) {
    case 'active': return 'pi-play-circle'
    case 'completed': return 'pi-check-circle'
    case 'failed': return 'pi-times-circle'
  }
})

const label = computed(() => {
  switch (props.status) {
    case 'active': return 'Active'
    case 'completed': return 'Completed'
    case 'failed': return 'Failed'
  }
})
</script>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
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

.status-badge.active {
  background: color-mix(in srgb, #9146ff 20%, transparent);
  color: #bf94ff;
  border: 1px solid color-mix(in srgb, #9146ff 40%, transparent);
}

.status-badge.completed {
  background: color-mix(in srgb, #00fa9a 15%, transparent);
  color: #00fa9a;
  border: 1px solid color-mix(in srgb, #00fa9a 35%, transparent);
}

.status-badge.failed {
  background: color-mix(in srgb, #ff4444 15%, transparent);
  color: #ff6b6b;
  border: 1px solid color-mix(in srgb, #ff4444 35%, transparent);
}
</style>
