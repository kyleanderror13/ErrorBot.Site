<template>
  <span class="completion-badge" :class="status">
    <i :class="`pi ${icon}`" />
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CompletionStatus } from '@/types'

const props = defineProps<{ status: CompletionStatus }>()

const icon = computed(() => {
  switch (props.status) {
    case 'completed': return 'pi-check-circle'
    case 'in-progress': return 'pi-spinner'
    case 'not-started': return 'pi-circle'
    case 'abandoned': return 'pi-ban'
  }
})

const label = computed(() => {
  switch (props.status) {
    case 'completed': return 'Completed'
    case 'in-progress': return 'In Progress'
    case 'not-started': return 'Not Started'
    case 'abandoned': return 'Abandoned'
  }
})
</script>

<style scoped>
.completion-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-family: var(--font-mono);
  white-space: nowrap;
}

.completed {
  background: color-mix(in srgb, #00fa9a 15%, transparent);
  color: #00fa9a;
  border: 1px solid color-mix(in srgb, #00fa9a 35%, transparent);
}

.in-progress {
  background: color-mix(in srgb, #9146ff 15%, transparent);
  color: #bf94ff;
  border: 1px solid color-mix(in srgb, #9146ff 35%, transparent);
}

.not-started {
  background: var(--brand-surface-2);
  color: var(--brand-text-muted);
  border: 1px solid var(--brand-border);
}

.abandoned {
  background: color-mix(in srgb, #ff4444 15%, transparent);
  color: #ff6b6b;
  border: 1px solid color-mix(in srgb, #ff4444 35%, transparent);
}
</style>
