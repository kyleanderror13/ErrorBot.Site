<template>
  <div class="dark-mode app-shell">

    <Transition name="backdrop">
      <div
        v-if="sidebarOpen && isMobile"
        class="sidebar-backdrop"
        @click="sidebarOpen = false"
      />
    </Transition>

    <Transition name="sidebar-slide">
      <aside
        v-show="sidebarOpen || !isMobile"
        class="sidebar"
        :class="{ 'sidebar--mobile': isMobile }"
      >
        <div class="sidebar-header">
          <div class="logo-mark">
            <i class="pi pi-twitch" />
          </div>
          <div class="logo-text">
            <span class="logo-title">kyleanderror13</span>
            <span class="logo-sub">Dashboard</span>
          </div>
          <button v-if="isMobile" class="sidebar-close" @click="sidebarOpen = false">
            <i class="pi pi-times" />
          </button>
        </div>

        <nav class="sidebar-nav">
          <RouterLink
            v-for="route in navRoutes"
            :key="route.path"
            :to="route.path"
            class="nav-item"
            :class="{ active: currentRoute === route.path }"
            @click="onNavClick"
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
    </Transition>

    <main class="main-content">
      <!-- Mobile top bar -->
      <div v-if="isMobile" class="mobile-topbar">
        <button class="hamburger" @click="sidebarOpen = true">
          <i class="pi pi-bars" />
        </button>
        <div class="topbar-logo">
          <div class="logo-mark-sm">
            <i class="pi pi-twitch" />
          </div>
          <span class="topbar-title">kyleanderror13</span>
        </div>
        <div class="topbar-page">{{ currentPageTitle }}</div>
      </div>

      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const sidebarOpen = ref(false)
const isMobile = ref(false)

const MOBILE_BREAKPOINT = 768

function checkMobile() {
  isMobile.value = window.innerWidth < MOBILE_BREAKPOINT
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

const currentRoute = computed(() => route.path)

const navRoutes = computed(() =>
  router.getRoutes().filter((r) => r.meta?.title)
)

const currentPageTitle = computed(() => {
  const r = navRoutes.value.find((r) => r.path === route.path)
  return r?.meta?.title as string ?? ''
})

function onNavClick() {
  if (isMobile.value) {
    sidebarOpen.value = false
  }
}
</script>

<style scoped>
.app-shell {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: var(--brand-bg);
}

/* ── Backdrop ──────────────────────────────────────────────── */
.sidebar-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 40;
  backdrop-filter: blur(2px);
}

.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.25s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

/* ── Sidebar ───────────────────────────────────────────────── */
.sidebar {
  width: 240px;
  min-width: 240px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--brand-surface);
  border-right: 1px solid var(--brand-border);
  position: relative;
  z-index: 50;
  flex-shrink: 0;
}

.sidebar--mobile {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  box-shadow: 4px 0 32px rgba(0, 0, 0, 0.6);
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

.logo-text {
  flex: 1;
  min-width: 0;
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

.sidebar-close {
  background: none;
  border: none;
  color: var(--brand-text-muted);
  cursor: pointer;
  font-size: 16px;
  padding: 6px;
  border-radius: 4px;
  transition: color 0.15s;
  flex-shrink: 0;
  line-height: 1;
}

.sidebar-close:hover {
  color: var(--brand-text);
}

/* ── Nav ───────────────────────────────────────────────────── */
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

/* ── Footer ────────────────────────────────────────────────── */
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

/* ── Sidebar slide animation ───────────────────────────────── */
.sidebar-slide-enter-active,
.sidebar-slide-leave-active {
  transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-slide-enter-from,
.sidebar-slide-leave-to {
  transform: translateX(-100%);
}

/* ── Mobile top bar ────────────────────────────────────────── */
.mobile-topbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  height: 52px;
  background: var(--brand-surface);
  border-bottom: 1px solid var(--brand-border);
  flex-shrink: 0;
  position: relative;
  z-index: 10;
}

.hamburger {
  background: none;
  border: 1px solid var(--brand-border);
  color: var(--brand-text);
  width: 34px;
  height: 34px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 15px;
  flex-shrink: 0;
  transition: all 0.15s;
}

.hamburger:hover {
  background: var(--brand-surface-2);
  border-color: var(--brand-purple);
  color: var(--brand-purple-light);
}

.topbar-logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-mark-sm {
  width: 28px;
  height: 28px;
  background: var(--brand-purple);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.topbar-title {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--brand-text);
}

.topbar-page {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--brand-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

/* ── Main content ──────────────────────────────────────────── */
.main-content {
  flex: 1;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-width: 0;
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
