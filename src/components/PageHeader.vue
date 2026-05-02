<template>
  <header class="page-header">
    <div class="header-left">
      <i v-if="icon" :class="`pi ${icon} header-icon`" />
      <div>
        <h1 class="header-title">{{ title }}</h1>
        <p v-if="subtitle" class="header-subtitle">{{ subtitle }}</p>
      </div>
    </div>
    <div class="header-right">
      <slot name="actions" />
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  icon?: string
}>()
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid var(--brand-border);
  background: var(--brand-surface);
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.header-icon {
  font-size: 24px;
  color: var(--brand-purple-light);
}

.header-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--brand-text);
  line-height: 1.1;
}

.header-subtitle {
  margin: 3px 0 0;
  font-size: 12px;
  color: var(--brand-text-muted);
  font-family: var(--font-mono);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
