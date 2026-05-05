<template>
  <Button class="link-badge" :class="source" @click="openLink">
    <i :class="`pi ${icon}`" />
    <span>Watch</span>
  </Button>
</template>

<script setup lang="ts">

import { computed } from 'vue'
import Button from 'primevue/button'

const props = defineProps<{
  link: string
  source: string
}>()

const icon = computed(() => {
  switch (props.source) {
    case 'twitch': return 'pi-twitch'
    case 'youtube': return 'pi-youtube'
  }
})

const openLink = () => {
  window.open(props.link, '_blank', 'noopener,noreferrer');
}

</script>

<style scoped>
.link-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-family: var(--font-mono);
  white-space: nowrap;
  margin-top: 8px;
}

.link-badge.twitch {
  background: color-mix(in srgb, #fff346 20%, transparent);
  color: #fff346;
  border: 1px solid color-mix(in srgb, #fff346 40%, transparent);
}

.status-badge.youtube {
  background: color-mix(in srgb, #fa0800 15%, transparent);
  color: #fa1d00;
  border: 1px solid color-mix(in srgb, #00fa9a 35%, transparent);
}

</style>
