<template>
  <div class="view-container">
    <PageHeader
      title="Loyalty"
      icon="pi-star"
    >
      <template #actions>
        <InputText
          v-model="globalFilter"
          placeholder="Search..."
          class="search-input"
          size="small"
        />
      </template>
    </PageHeader>

    <div class="period-bar">
      <Select
        v-model="selectedPeriodId"
        :options="periods"
        option-label="label"
        option-value="id"
        class="period-select"
        size="small"
      />
    </div>

    <div class="table-wrapper">
      <DataTable
        :value="sortedUsers"
        :virtual-scroller-options="{ itemSize: 46 }"
        scrollable
        scroll-height="flex"
        :global-filter-fields="['userName']"
        :filters="filters"
        sort-field="points"
        :sort-order="-1"
        class="loyalty-table"
        size="small"
        :loading="loading"
        striped-rows
        column-resize-mode="fit"
      >
        <template #empty>
          <div class="empty-state">
            <i class="pi pi-star-fill empty-icon" />
            <p>No loyalty data found.</p>
          </div>
        </template>

        <Column field="_period.rank" header="Rank" :sortable="true" style="width: 80px; text-align: center">
          <template #body="{ data }">
            <span class="rank-badge" :class="rankClass(data._period.rank)">
              #{{ data._period.rank ?? '–' }}
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

        <Column field="_period.points" header="Points" :sortable="true" style="width: 100px">
          <template #body="{ data }">
            <span class="points-value">
              <i class="pi pi-star-fill points-icon" />
              {{ data._period.points.toLocaleString() }}
            </span>
          </template>
        </Column>

      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { FilterMatchMode } from '@primevue/core/api'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Select from 'primevue/select'
import InputText from 'primevue/inputtext'
import PageHeader from '@/components/PageHeader.vue'
import type { LoyaltyUser, LoyaltyPeriod } from '@/types'

const users = ref<LoyaltyUser[]>([])
const periods = [
  { id: 'current', label: 'May 2026' },
  { id: 'total', label: 'All Time' },
]
const selectedPeriodId = ref<string>("total");
const loading = ref(true)
const globalFilter = ref('')

const filters = ref({
  global: { value: null as string | null, matchMode: FilterMatchMode.CONTAINS }
})

// Keep filter model in sync with search input
import { watch } from 'vue'
watch(globalFilter, (val) => {
  filters.value.global.value = val || null
})

onMounted(async () => {
  await loadData()
})

async function loadData() {
  loading.value = true
  try {
    const res = await fetch('/data/loyalty.json')
    if (!res.ok) throw new Error('Failed to load')
    const json = await res.json()
    // TODO: add extra periods here once archived data is available.
    users.value = json.users ?? []
  } catch {
    users.value = []
  } finally {
    loading.value = false
  }
}

function rankClass(rank: number): string {
  if (rank === 1) return 'gold'
  if (rank === 2) return 'silver'
  if (rank === 3) return 'bronze'
  return ''
}

// Computed to get points/watchTime for the selected period:
function getPeriodData(user: LoyaltyUser): LoyaltyPeriod {
  if (selectedPeriodId.value == 'total') {
    return user.totalPeriod;
  }
  else {
    return user.currentPeriod;
  }
}

const sortedUsers = computed(() =>
  [...users.value]
    .filter((c) => getPeriodData(c).points > 0)
    .map((c) => ({ ...c, _period: getPeriodData(c) }))
    .sort((a, b) => b._period.points - a._period.points)
)

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

.loyalty-table {
  height: 100%;
}

.search-input {
  width: 200px;
  background: var(--brand-surface-2) !important;
  border-color: var(--brand-border) !important;
  color: var(--brand-text) !important;
  font-size: 13px !important;
}

/* Rank badge */
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

.points-value {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-weight: 600;
  color: var(--brand-purple-light);
}

.points-icon {
  font-size: 10px;
  color: var(--brand-accent-gold);
}

/* Misc */
.mono-text {
  font-family: var(--font-mono);
  font-size: 12px;
}

.muted {
  color: var(--brand-text-muted);
}

/* Empty state */
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

.empty-state code {
  font-family: var(--font-mono);
  background: var(--brand-surface-2);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.period-bar {
  padding: 10px 16px;
  background: var(--brand-surface);
  border-bottom: 1px solid var(--brand-border);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.period-select {
  width: 200px;
}

</style>
