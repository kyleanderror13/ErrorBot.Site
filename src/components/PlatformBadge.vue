<template>
  <span class="platform-badge" :class="platformKey">
    <i :class="`pi ${icon}`" />
    {{ platform }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Platform } from '@/types'

const props = defineProps<{ platform: Platform }>()

const platformKey = computed(() =>
  props.platform.toLowerCase().replace(/[\s:]/g, '-')
)

const icon = computed(() => {
  const p = props.platform
  if (p === 'PC') return 'pi-desktop'
  if (p.startsWith('PlayStation')) return 'pi-playstation'
  if (p.startsWith('Xbox')) return 'pi-xbox'
  if (p === 'Nintendo Switch') return 'pi-gamepad'
  return 'pi-box'
})
</script>

<style scoped>
.platform-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  font-family: var(--font-mono);
  white-space: nowrap;
  background: var(--brand-surface-2);
  color: var(--brand-text-muted);
  border: 1px solid var(--brand-border);
}

.pc {
  color: #61afef;
  border-color: color-mix(in srgb, #61afef 30%, transparent);
  background: color-mix(in srgb, #61afef 10%, transparent);
}

.playstation-5,
.playstation-4 {
  color: #0070cc;
  border-color: color-mix(in srgb, #0070cc 35%, transparent);
  background: color-mix(in srgb, #0070cc 12%, transparent);
}

.xbox-series-x,
.xbox-one {
  color: #52b043;
  border-color: color-mix(in srgb, #52b043 35%, transparent);
  background: color-mix(in srgb, #52b043 12%, transparent);
}

.nintendo-switch {
  color: #e4000f;
  border-color: color-mix(in srgb, #e4000f 35%, transparent);
  background: color-mix(in srgb, #e4000f 12%, transparent);
}
</style>
