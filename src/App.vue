<template>
  <div class="dark-mode app-shell">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo-mark">
          <i class="pi pi-twitch" />
        </div>
        <div class="logo-text">
          <span class="logo-title">kyleanderror13</span>
          <span class="logo-sub">Channel Dashboard</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <RouterLink
          v-for="route in navRoutes"
          :key="route.path"
          :to="route.path"
          class="nav-item"
          :class="{ active: currentRoute === route.path }"
        >
          <i :class="`pi ${route.meta?.icon}`" />
          <span>{{ route.meta?.title }}</span>
          <span class="nav-active-bar" />
        </RouterLink>
      </nav>

      <div class="sidebar-footer">
        <span class="footer-text">v1.0.0</span>
      </div>
    </aside>

    <!-- Main content area -->
    <main class="main-content">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const currentRoute = computed(() => route.path)

const navRoutes = computed(() =>
  router.getRoutes().filter((r) => r.meta?.title)
)
</script>

<style scoped>
.app-shell {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: var(--brand-bg);
}

/* ── Sidebar ───────────────────────────────────────────────── */
.sidebar {
  width: 220px;
  min-width: 220px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--brand-surface);
  border-right: 1px solid var(--brand-border);
  position: relative;
  z-index: 10;
}

.sidebar::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 1px;
  height: 100%;
  background: linear-gradient(
    to bottom,
    transparent,
    var(--brand-purple) 30%,
    var(--brand-purple) 70%,
    transparent
  );
  opacity: 0.4;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 16px 18px;
  border-bottom: 1px solid var(--brand-border);
}

.logo-mark {
  width: 36px;
  height: 36px;
  background: var(--brand-purple);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.logo-title {
  display: block;
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--brand-text);
  line-height: 1.1;
  text-transform: uppercase;
}

.logo-sub {
  display: block;
  font-size: 10px;
  color: var(--brand-text-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-top: 2px;
}

/* ── Nav items ─────────────────────────────────────────────── */
.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 12px 8px;
  gap: 2px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  text-decoration: none;
  color: var(--brand-text-muted);
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.18s ease;
  position: relative;
  cursor: pointer;
  border: 1px solid transparent;
}

.nav-item:hover {
  background: var(--brand-surface-2);
  color: var(--brand-text);
  border-color: var(--brand-border);
}

.nav-item.active {
  background: color-mix(in srgb, var(--brand-purple) 15%, transparent);
  color: var(--brand-purple-light);
  border-color: color-mix(in srgb, var(--brand-purple) 30%, transparent);
}

.nav-item .pi {
  font-size: 16px;
  width: 18px;
  text-align: center;
}

.nav-active-bar {
  display: none;
}

.nav-item.active .nav-active-bar {
  display: block;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  background: var(--brand-purple);
  border-radius: 0 2px 2px 0;
}

/* ── Sidebar footer ────────────────────────────────────────── */
.sidebar-footer {
  padding: 12px 16px;
  border-top: 1px solid var(--brand-border);
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-text {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--brand-text-muted);
  opacity: 0.5;
}

/* ── Main content ──────────────────────────────────────────── */
.main-content {
  flex: 1;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* ── Page transition ───────────────────────────────────────── */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(8px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}
</style>
