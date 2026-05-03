<template>
  <span class="platform-badge" :class="platformKey" v-tooltip.bottom="platform">
      <svg
        v-if="icon"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="white"
        role="img"
        aria-hidden="true"
      >
        <path :d="icon.path" />
      </svg>
    </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { siSteam, siEpicgames, siGogdotcom, siEa } from 'simple-icons'
import { mdiMicrosoftXbox, mdiMicrosoftWindows } from '@mdi/js'
import type { LibraryPlatform } from '@/types'

console.log(siEpicgames);
console.log(siEa);

const props = defineProps<{ platform: LibraryPlatform }>()

const platformKey = computed(() =>
  props.platform.toLowerCase().replace(/[\s:]/g, '-')
)

const iconMap: Record<string, { path: string }> = {
  'Steam': { path: siSteam.path },
  'Epic': { path: siEpicgames.path },
  'GOG': { path: siGogdotcom.path },
  'Xbox': { path: mdiMicrosoftXbox },
  'Microsoft': { path: mdiMicrosoftWindows },
  'Origin': { path: siEa.path },
}

const icon = computed(() => iconMap[props.platform])
  
</script>

<style scoped>
.platform-badge {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 8px;
  font-size: 11px;
  font-weight: 600;
  font-family: var(--font-mono);
  white-space: nowrap;
  color: var(--brand-text-muted);
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
