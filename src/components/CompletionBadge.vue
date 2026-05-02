<template>
  <span class="completion-badge" :class="status">
    <i :class="`pi ${icon}`" />
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { LibraryCompletionStatus } from '@/types'

const props = defineProps<{ status: LibraryCompletionStatus }>()

const icon = computed(() => {
  switch (props.status) {
    case 'Completed100': return 'pi-trophy'
    case 'CompletedAny': return 'pi-check-circle'
    case 'InProgress': return 'pi-spinner-dotted'
    case 'NotStarted': return 'pi-circle'
  }
})

const label = computed(() => {
  switch (props.status) {
    case 'Completed100': return '100%'
    case 'CompletedAny': return 'Any%'
    case 'InProgress': return 'In Progress'
    case 'NotStarted': return 'Not Started'
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

.Completed100 {
  background: color-mix(in srgb, #7830ec, transparent);
  color: #ccc6d3;
  border: 1px solid color-mix(in srgb, #7830ec 35%, transparent);
}

.CompletedAny {
  background: color-mix(in srgb, #248a29 15%, transparent);
  color: #00fa9a;
  border: 1px solid color-mix(in srgb, #248a29 35%, transparent);
}

.InProgress {
  background: color-mix(in srgb, #9146ff 15%, transparent);
  color: #bf94ff;
  border: 1px solid color-mix(in srgb, #9146ff 35%, transparent);
}

.NotStarted {
  background: var(--brand-surface-2);
  color: var(--brand-text-muted);
  border: 1px solid var(--brand-border);
}

</style>
