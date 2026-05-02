<template>
  <div class="view-container">
    <PageHeader
      title="Game Library"
      icon="pi-th-large"
      :subtitle="`${games.length} games · ${completedCount} completed`"
    >
      <template #actions>
        <Select
          v-model="selectedPlatform"
          :options="platformOptions"
          placeholder="All Platforms"
          class="filter-select"
          size="small"
          show-clear
        />
        <Select
          v-model="selectedStatus"
          :options="statusOptions"
          option-label="label"
          option-value="value"
          placeholder="All Statuses"
          class="filter-select"
          size="small"
          show-clear
        />
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
        <span class="summary-value" :style="{ color: stat.color }">{{ stat.value }}</span>
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
      >
        <template #empty>
          <div class="empty-state">
            <i class="pi pi-gamepad empty-icon" />
            <p>No games found.</p>
          </div>
        </template>

        <Column field="title" header="Title" :sortable="true">
          <template #body="{ data }">
            <span class="game-title">{{ data.title }}</span>
          </template>
        </Column>

        <Column field="platform" header="Platform" :sortable="true" style="width: 180px">
          <template #body="{ data }">
            <PlatformBadge :platform="data.platform" />
          </template>
        </Column>

        <Column field="genre" header="Genre" :sortable="true" style="width: 160px">
          <template #body="{ data }">
            <span class="genre-text">{{ data.genre ?? '–' }}</span>
          </template>
        </Column>

        <Column field="completionStatus" header="Status" :sortable="true" style="width: 150px">
          <template #body="{ data }">
            <CompletionBadge :status="data.completionStatus" />
          </template>
        </Column>

        <Column field="hoursPlayed" header="Hours" :sortable="true" style="width: 90px">
          <template #body="{ data }">
            <span class="mono-text">{{ data.hoursPlayed != null ? `${data.hoursPlayed}h` : '–' }}</span>
          </template>
        </Column>

        <Column field="rating" header="Rating" :sortable="true" style="width: 90px">
          <template #body="{ data }">
            <span v-if="data.rating" class="rating">
              <i class="pi pi-star-fill" style="font-size:10px; color: var(--brand-accent-gold)" />
              {{ data.rating }}/10
            </span>
            <span v-else class="mono-text muted">–</span>
          </template>
        </Column>

        <Column field="releaseYear" header="Year" :sortable="true" style="width: 80px">
          <template #body="{ data }">
            <span class="mono-text muted">{{ data.releaseYear ?? '–' }}</span>
          </template>
        </Column>

        <Column field="notes" header="Notes" style="width: 220px">
          <template #body="{ data }">
            <span class="notes-text" :title="data.notes">{{ data.notes ?? '' }}</span>
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
import Select from 'primevue/select'
import PageHeader from '@/components/PageHeader.vue'
import PlatformBadge from '@/components/PlatformBadge.vue'
import CompletionBadge from '@/components/CompletionBadge.vue'
import type { Game, CompletionStatus } from '@/types'

const games = ref<Game[]>([])
const loading = ref(true)
const globalFilter = ref('')
const selectedPlatform = ref<string | null>(null)
const selectedStatus = ref<CompletionStatus | null>(null)

onMounted(async () => {
  await loadData()
})

async function loadData() {
  loading.value = true
  try {
    const res = await fetch('/data/gamelibrary.json')
    if (!res.ok) throw new Error()
    const json = await res.json()
    games.value = json.games ?? []
  } catch {
    games.value = []
  } finally {
    loading.value = false
  }
}

const platformOptions = computed(() => {
  const set = new Set(games.value.map((g) => g.platform))
  return Array.from(set).sort()
})

const statusOptions = [
  { label: 'Completed', value: 'completed' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Not Started', value: 'not-started' },
  { label: 'Abandoned', value: 'abandoned' }
]

const filteredGames = computed(() => {
  return games.value.filter((g) => {
    const matchPlatform = !selectedPlatform.value || g.platform === selectedPlatform.value
    const matchStatus = !selectedStatus.value || g.completionStatus === selectedStatus.value
    const matchSearch =
      !globalFilter.value ||
      g.title.toLowerCase().includes(globalFilter.value.toLowerCase()) ||
      (g.genre?.toLowerCase().includes(globalFilter.value.toLowerCase()) ?? false)
    return matchPlatform && matchStatus && matchSearch
  })
})

const completedCount = computed(() =>
  games.value.filter((g) => g.completionStatus === 'completed').length
)

const summaryStats = computed(() => [
  { label: 'Total', value: games.value.length, color: 'var(--brand-text)' },
  { label: 'Completed', value: games.value.filter((g) => g.completionStatus === 'completed').length, color: 'var(--brand-accent-green)' },
  { label: 'In Progress', value: games.value.filter((g) => g.completionStatus === 'in-progress').length, color: 'var(--brand-purple-light)' },
  { label: 'Not Started', value: games.value.filter((g) => g.completionStatus === 'not-started').length, color: 'var(--brand-text-muted)' },
  { label: 'Abandoned', value: games.value.filter((g) => g.completionStatus === 'abandoned').length, color: 'var(--brand-accent-red)' },
  { label: 'Total Hours', value: `${games.value.reduce((a, g) => a + (g.hoursPlayed ?? 0), 0)}h`, color: 'var(--brand-accent-gold)' }
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

/* Summary bar */
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
  font-size: 18px;
  font-weight: 700;
  line-height: 1;
}

.summary-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--brand-text-muted);
  font-family: var(--font-mono);
}

/* Search / filters */
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

/* Table cells */
.game-title {
  font-weight: 600;
  font-size: 13px;
}

.genre-text {
  font-size: 12px;
  color: var(--brand-text-muted);
}

.mono-text {
  font-family: var(--font-mono);
  font-size: 12px;
}

.muted {
  color: var(--brand-text-muted);
}

.rating {
  font-family: var(--font-mono);
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.notes-text {
  font-size: 12px;
  color: var(--brand-text-muted);
  font-style: italic;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  max-width: 220px;
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
