<template>
  <span class="platform-badge" :class="platformKey">
    <i :class="`pi ${icon}`" />
    {{ platform }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { siSteam, siEpicgames, siGogdotcom, siEa } from 'simple-icons'
import { mdiMicrosoftXbox, mdiMicrosoftWindows } from '@mdi/js'
import type { LibraryPlatform } from '@/types'

const props = defineProps<{ platform: LibraryPlatform }>()

const platformKey = computed(() =>
  props.platform.toLowerCase().replace(/[\s:]/g, '-')
)

const iconMap: Record<string, { path: string; color: string, viewBox?: string }> = {
  'Steam': { path: siSteam.path, color: '#1b2838', viewBox: '0 0 24 24' },
  'Epic Games': { path: siEpicgames.path, color: '#313131', viewBox: '0 0 24 24' },
  'GOG': { path: siGogdotcom.path, color: '#86328A', viewBox: '0 0 24 24' },
  'Xbox': { path: mdiMicrosoftXbox, color: '#00ADEF', viewBox: '0 0 24 24' },
  'Microsoft': { path: mdiMicrosoftWindows, color: '#107C10', viewBox: '0 0 24 24' },
  'EA': { path: siEa.path, color: '#0078D4', viewBox: '0 0 24 24' },
}

const icon = computed(() => iconMap[props.platform])
  
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
