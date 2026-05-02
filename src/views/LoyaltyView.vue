<template>
  <div class="view-container">
    <PageHeader
      title="Loyalty"
      icon="pi-star"
      :subtitle="`${chatters.length} chatters tracked`"
    >
      <template #actions>
        <InputText
          v-model="globalFilter"
          placeholder="Search chatters..."
          class="search-input"
          size="small"
        />
      </template>
    </PageHeader>

    <div class="table-wrapper">
      <DataTable
        :value="chatters"
        :virtual-scroller-options="{ itemSize: 46 }"
        scrollable
        scroll-height="flex"
        :global-filter-fields="['username']"
        :filters="filters"
        sort-field="points"
        :sort-order="-1"
        class="loyalty-table"
        size="small"
        :loading="loading"
        striped-rows
        resizable-columns
        column-resize-mode="fit"
      >
        <template #empty>
          <div class="empty-state">
            <i class="pi pi-star-fill empty-icon" />
            <p>No loyalty data found.</p>
          </div>
        </template>

        <Column field="rank" header="Rank" :sortable="true" style="width: 80px; text-align: center">
          <template #body="{ data }">
            <span class="rank-badge" :class="rankClass(data.rank)">
              #{{ data.rank ?? '–' }}
            </span>
          </template>
        </Column>

        <Column field="username" header="Chatter" :sortable="true">
          <template #body="{ data }">
            <div class="chatter-cell">
              <div class="chatter-avatar">{{ data.username[0].toUpperCase() }}</div>
              <span class="chatter-name">{{ data.username }}</span>
            </div>
          </template>
        </Column>

        <Column field="points" header="Points" :sortable="true" style="width: 140px">
          <template #body="{ data }">
            <span class="points-value">
              <i class="pi pi-star-fill points-icon" />
              {{ data.points.toLocaleString() }}
            </span>
          </template>
        </Column>

        <Column field="watchTime" header="Watch Time" :sortable="true" style="width: 150px">
          <template #body="{ data }">
            <span class="mono-text">{{ formatWatchTime(data.watchTime) }}</span>
          </template>
        </Column>

        <Column field="lastSeen" header="Last Seen" :sortable="true" style="width: 160px">
          <template #body="{ data }">
            <span class="mono-text muted">{{ formatDate(data.lastSeen) }}</span>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { FilterMatchMode } from '@primevue/core/api'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import PageHeader from '@/components/PageHeader.vue'
import type { LoyaltyChatter } from '@/types'

const chatters = ref<LoyaltyChatter[]>([])
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
    chatters.value = json.chatters ?? []
  } catch {
    chatters.value = []
  } finally {
    loading.value = false
  }
}

function formatWatchTime(minutes?: number): string {
  if (minutes == null) return '–'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h ${m}m`
}

function formatDate(iso?: string): string {
  if (!iso) return '–'
  return new Date(iso).toLocaleDateString('en-AU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

function rankClass(rank?: number): string {
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
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--brand-surface-2);
  color: var(--brand-text-muted);
}

.rank-badge.gold {
  background: color-mix(in srgb, #ffd700 20%, transparent);
  color: #ffd700;
}

.rank-badge.silver {
  background: color-mix(in srgb, #c0c0c0 20%, transparent);
  color: #c0c0c0;
}

.rank-badge.bronze {
  background: color-mix(in srgb, #cd7f32 20%, transparent);
  color: #cd7f32;
}

/* Chatter cell */
.chatter-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.chatter-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--brand-purple-dark);
  color: white;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.chatter-name {
  font-weight: 500;
  font-size: 13px;
}

/* Points */
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
</style>
