import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/no-hit'
  },
  {
    path: '/no-hit',
    name: 'NoHit',
    component: () => import('@/no-hit/NoHitPage.vue'),
    meta: { title: 'No Hit', icon: 'pi-shield' }
  },
  {
    path: '/loyalty',
    name: 'Loyalty',
    component: () => import('@/loyalty/LoyaltyPage.vue'),
    meta: { title: 'Loyalty', icon: 'pi-star' }
  },
  {
    path: '/streaks',
    name: 'Streaks',
    component: () => import('@/streaks/StreakPage.vue'),
    meta: { title: 'Streaks', icon: 'pi-gauge' }
  },
  {
    path: '/game-library',
    name: 'GameLibrary',
    component: () => import('@/game-library/GameLibraryPage.vue'),
    meta: { title: 'Game Library', icon: 'pi-th-large' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
