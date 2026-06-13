<template>
  <div class="chart-card">
    <div class="chart-title">
      <span>{{ props.title }}</span>

      <div class="chart-title-controls">
        <slot name="header-controls"></slot>
      </div>
    </div>

    <div :style="{ height: `${props.height}px` }">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps<{
  title: string,
  height: number
}>();

</script>

<style scoped>

.chart-card {
  background: var(--brand-surface);
  border: 1px solid var(--brand-border);
  border-radius: 10px;
  padding: 16px;
  min-width: 0;
}

.chart-title {
  font-family: var(--font-display);
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--brand-text-muted);
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chart-title-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

</style>