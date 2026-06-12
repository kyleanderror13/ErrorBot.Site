<template>
  <div class="view-container">
    <PageHeader
      title="Streaks"
      icon="pi-gauge"
    />

    <div class="table-wrapper">
      <DataTable
        :value="sortedRecords"
        :virtual-scroller-options="{ itemSize: 46 }"
        scrollable
        scroll-height="flex"
        sort-field="streak"
        :sort-order="-1"
        class="streak-table"
        size="small"
        :loading="loading"
        striped-rows
        column-resize-mode="fit"
      >
        <template #empty>
          <div class="empty-state">
            <i class="pi pi-star-fill empty-icon" />
            <p>No streak data found.</p>
          </div>
        </template>

        <Column field="rank" header="Rank" :sortable="true" style="width: 80px; text-align: center">
          <template #body="{ data }">
            <span class="rank-badge" :class="rankClass(data.rank)">
              #{{ data.rank ?? '–' }}
            </span>
          </template>
        </Column>

        <Column field="userName" header="User" :sortable="true">
          <template #body="{ data }">
            <div class="user-cell">
              <div class="user-avatar">{{ data.userName[0].toUpperCase() }}</div>
              <span class="user-name">{{ data.userName }}</span>
            </div>
          </template>
        </Column>

        <Column field="streak" header="Streak" :sortable="true" style="width: 100px">
          <template #body="{ data }">
            <span class="streak-value">
              <i class="pi pi-star-fill streak-icon" />
              {{ data.streak.toLocaleString() }}
            </span>
          </template>
        </Column>

      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import PageHeader from '@/components/PageHeader.vue'
import type { StreakRecord } from '@/streaks/StreakTypes'

const records = ref<StreakRecord[]>([])
const loading = ref(true)

onMounted(async () => {
  await loadData()
})

async function loadData() {
  loading.value = true
  try {
    const res = await fetch('/data/streaks/streak-catalog.json')
    if (!res.ok) throw new Error()
    const json = await res.json()
    records.value = json.records ?? []
  } catch {
    records.value = []
  } finally {
    loading.value = false
  }
}

const sortedRecords = computed(() =>
  [...records.value]
    .filter((u) => u.streak > 0)
    .sort((a, b) => b.streak - a.streak)
)

function rankClass(rank: number): string {
  if (rank === 1) return 'gold'
  if (rank === 2) return 'silver'
  if (rank === 3) return 'bronze'
  return ''
}
</script>

<style scoped>
.view-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: var(--brand-bg);
}

.table-wrapper {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.streak-table {
  height: 100%;
  width: 100%;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 60px 0;
  color: var(--brand-text-muted);
}

.empty-icon {
  font-size: 40px;
  color: var(--brand-border);
}

.rank-badge {
  font-family: var(--font-mono);
  font-size: 15px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  color: var(--brand-text-muted);
}

.rank-badge.gold {
  background: color-mix(in srgb, #ffd700 20%, transparent);
  color: #ffd700;
  font-size: 20px;
}

.rank-badge.silver {
  background: color-mix(in srgb, #c0c0c0 20%, transparent);
  color: #c0c0c0;
  font-size: 20px;
}

.rank-badge.bronze {
  background: color-mix(in srgb, #cd7f32 20%, transparent);
  color: #cd7f32;
  font-size: 20px;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--brand-purple-dark);
  color: white;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-name {
  font-weight: 500;
  font-size: 15px;
}

.streak-value {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-weight: 600;
  color: var(--brand-purple-light);
}

.streak-icon {
  font-size: 10px;
  color: var(--brand-accent-gold);
}

</style>
