<template>
  <span class="completion-badge" :class="status" v-tooltip.bottom="label">
    <i :class="`pi ${icon}`" style="font-size: 18px;" />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { LibraryCompletionStatus } from '@/game-library/GameLibraryTypes'

const props = defineProps<{ status: LibraryCompletionStatus }>()

const icon = computed(() => {
  switch (props.status) {
    case 'completed-100': return 'pi-trophy'
    case 'completed-any': return 'pi-check-circle'
    case 'in-progress': return 'pi-spinner-dotted'
    case 'not-started': return 'pi-circle'
  }
})

const label = computed(() => {
  switch (props.status) {
    case 'completed-100': return '100%'
    case 'completed-any': return 'Any%'
    case 'in-progress': return 'In Progress'
    case 'not-started': return 'Not Started'
  }
})

</script>

<style scoped>
.completion-badge {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 4px;
}

.completed-100 {
  color: #e7ce42;
}

.completed-any {
  color: #00fa9a;
}

.in-progress {
  background: color-mix(in srgb, #9146ff 15%, transparent);
  color: #bf94ff;
}

.not-started {
  color: var(--brand-text-muted);
}

</style>
