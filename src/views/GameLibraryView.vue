<template>
  <div class="view-container">
    <PageHeader
      title="Game Library"
      icon="pi-th-large"
    >
      <template #actions>
        <InputText
          v-model="globalFilter"
          placeholder="Search games..."
          class="search-input"
          size="small"
        />
      </template>
    </PageHeader>

    <!-- Summary bar -->
    <div class="summary-bar">
      <div
        v-for="stat in summaryStats"
        :key="stat.label"
        class="summary-stat"
      >
        <span class="summary-value" :style="{ color: stat.color }">{{ stat.value.toLocaleString() }}</span>
        <span class="summary-label">{{ stat.label }}</span>
      </div>
    </div>

    <div class="table-wrapper">
      <DataTable
        :value="filteredGames"
        :virtual-scroller-options="{ itemSize: 48 }"
        scrollable
        scroll-height="flex"
        sort-field="title"
        :sort-order="1"
        class="games-table"
        size="small"
        :loading="loading"
        striped-rows
        removable-sort
        column-resize-mode="fit"
        style="width: 100%"
      >
        <template #empty>
          <div class="empty-state">
            <i class="pi pi-gamepad empty-icon" />
            <p>No games found.</p>
          </div>
        </template>

        <Column field="platform" header="" style="width: 24px">
          <template #body="{ data }">
            <PlatformBadge :platform="data.platform" />
          </template>
        </Column>

        <Column field="title" header="Title" :sortable="true" class="col-title">
          <template #body="{ data }">
            <span class="game-title" v-tooltip.bottom="data.title">{{ data.title }}</span>
          </template>
        </Column>

        <Column 
          field="completionStatus" 
          header="" 
          style="width: 48px"
          header-style="text-align:right; justify-content: flex-end"
        >
          <template #body="{ data }">
            <div style="display:flex; justify-content: flex-end">
              <CompletionBadge :status="data.completed" />
            </div>
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
import InputText from 'primevue/inputtext'
import PageHeader from '@/components/PageHeader.vue'
import PlatformBadge from '@/components/PlatformBadge.vue'
import CompletionBadge from '@/components/CompletionBadge.vue'
import type { LibraryGame, LibraryCompletionStatus } from '@/types'

const games = ref<LibraryGame[]>([])
const loading = ref(true)
const globalFilter = ref('')
const selectedPlatform = ref<string | null>(null)
const selectedStatus = ref<LibraryCompletionStatus | null>(null)

onMounted(async () => {
  await loadData()
})

async function loadData() {
  loading.value = true
  try {
    const res = await fetch('/data/gamelibrary/gamelibrary.json')
    if (!res.ok) throw new Error()
    const json = await res.json()
    games.value = json.games ?? []
  } catch {
    games.value = []
  } finally {
    loading.value = false
  }
}

const filteredGames = computed(() => {
  return games.value.filter((g) => {
    const matchPlatform = !selectedPlatform.value || g.platform === selectedPlatform.value
    const matchStatus = !selectedStatus.value || g.completed === selectedStatus.value
    const matchSearch =
      !globalFilter.value ||
      g.title.toLowerCase().includes(globalFilter.value.toLowerCase())
    return matchPlatform && matchStatus && matchSearch
  })
})

const summaryStats = computed(() => [
  { label: 'Total', value: games.value.length, color: 'var(--brand-text)' },
  { label: '100%', value: games.value.filter((g) => g.completed === 'completed-100').length, color: '#e7ce42' },
  { label: 'Any%', value: games.value.filter((g) => g.completed === 'completed-any').length, color: '#00fa9a' },
  { label: 'In Progress', value: games.value.filter((g) => g.completed === 'in-progress').length, color: '#bf94ff' }
])
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

.games-table {
  height: 100%;
}

.summary-bar {
  display: flex;
  gap: 0;
  background: var(--brand-surface);
  border-bottom: 1px solid var(--brand-border);
  flex-shrink: 0;
}

.summary-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 20px;
  border-right: 1px solid var(--brand-border);
  gap: 2px;
}

.summary-value {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  line-height: 1;
}

.summary-label {
  text-align: center;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  color: var(--brand-text-muted);
  font-family: var(--font-mono);
}

.filter-select {
  width: 160px;
  font-size: 13px !important;
}

.search-input {
  width: 180px;
  background: var(--brand-surface-2) !important;
  border-color: var(--brand-border) !important;
  color: var(--brand-text) !important;
  font-size: 13px !important;
}

.game-title {
  font-weight: 600;
  font-size: 15px;
}

.muted {
  color: var(--brand-text-muted);
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

.empty-state code {
  font-family: var(--font-mono);
  background: var(--brand-surface-2);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

:deep(.p-datatable-tbody .game-title) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

:deep(.col-title.p-datatable-column-header),
:deep(.p-datatable-tbody > tr > td.col-title) {
  overflow: hidden;
  max-width: 0;
}

</style>
