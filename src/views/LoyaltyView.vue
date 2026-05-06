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

        <button
          v-if="isMobile && showDetail"
          class="back-btn"
          @click="showDetail = false"
        >
          <i class="pi pi-arrow-left" />
          <span>Periods</span>
        </button>
      </template>
    </PageHeader>

    <div class="content-area" :class="{ 'mobile-mode': isMobile }">

      <Transition :name="isMobile ? 'panel-left' : 'none'">
        <aside
          v-show="!isMobile || !showDetail"
          class="period-list"
          :class="{ 'panel-full': isMobile }"
        >
          <div
            v-for="period in periods"
            :key="period.id"
            class="period-card"
            :class="{ active: selectedPeriod?.id === period.id }"
            @click="selectPeriod(period)"
          >
            <span class="period-name" v-tooltip.bottom="period.name">{{ period.name }}</span>

            <div v-if="isMobile" class="tap-hint">
              <i class="pi pi-chevron-right" />
            </div>
          </div>

          <div v-if="!periods.length" class="empty-list">
            <i class="pi pi-shield" />
            <p>No loyalty periods yet.</p>
          </div>
        </aside>
      </Transition>

      <Transition :name="isMobile ? 'panel-right' : 'none'">
        <section
          v-show="!isMobile || showDetail"
          class="period-detail"
          :class="{ 'panel-full': isMobile }"
        >
          <template v-if="sortedUsers">
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
              :loading="periodLoading"
              striped-rows
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

              <Column field="userName" header="User" :sortable="true">
                <template #body="{ data }">
                  <div class="user-cell">
                    <div class="user-avatar">{{ data.userName[0].toUpperCase() }}</div>
                    <span class="user-name">{{ data.userName }}</span>
                  </div>
                </template>
              </Column>

              <Column field="points" header="Points" :sortable="true" style="width: 100px">
                <template #body="{ data }">
                  <span class="points-value">
                    <i class="pi pi-star-fill points-icon" />
                    {{ data.points.toLocaleString() }}
                  </span>
                </template>
              </Column>

            </DataTable>
          </div>
          </template>

          <div v-else-if="!isMobile" class="empty-detail">
            <i class="pi pi-arrow-left" />
            <p>Select a period to view details</p>
          </div>
        </section>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { FilterMatchMode } from '@primevue/core/api'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import PageHeader from '@/components/PageHeader.vue'
import type { LoyaltyCatalogPeriod, LoyaltyPeriodUser } from '@/types'

const periods = ref<LoyaltyCatalogPeriod[]>([]);
const catalogLoading = ref(true);
const selectedPeriod = ref<LoyaltyCatalogPeriod | null>(null);
const periodLoading = ref(true);
const periodUsers = ref<LoyaltyPeriodUser[]>([]);

const globalFilter = ref('');

const isMobile = ref(false)
const showDetail = ref(false)

const filters = ref({
  global: { value: null as string | null, matchMode: FilterMatchMode.CONTAINS }
})

// Keep filter model in sync with search input
import { watch } from 'vue'
watch(globalFilter, (val) => {
  filters.value.global.value = val || null
})

const MOBILE_BREAKPOINT = 768

function checkMobile() {
  isMobile.value = window.innerWidth < MOBILE_BREAKPOINT
}

onMounted(async () => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
  await loadCatalog();
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
})

async function loadCatalog() {
  catalogLoading.value = true
  try {
    const res = await fetch('/data/loyalty/loyalty-catalog.json')
    if (!res.ok) throw new Error('Failed to load')
    const json = await res.json()
    periods.value = [{ id: 'total', name: 'All Time' }, ...json.periods];
  } catch {
    periods.value = []
  } finally {
    catalogLoading.value = false
  }
}

async function selectPeriod(period: LoyaltyCatalogPeriod) {
  selectedPeriod.value = period;
  periodLoading.value = true;

  if (isMobile.value) showDetail.value = true;

  try {
    const res = await fetch(`/data/loyalty/periods/${period.id}.json`);
    if (!res.ok) throw new Error('Failed to load')
    const json = await res.json()
    periodUsers.value = json.users ?? []
  } finally {
    periodLoading.value = false;
  }
}

function rankClass(rank: number): string {
  if (rank === 1) return 'gold'
  if (rank === 2) return 'silver'
  if (rank === 3) return 'bronze'
  return ''
}

// Computed to get points/watchTime for the selected period:
/*
function getPeriodData(user: LoyaltyUser): LoyaltyPeriod {
  if (selectedPeriodId.value == 'total') {
    return user.totalPeriod;
  }
  else {
    return user.currentPeriod;
  }
}
*/
const sortedUsers = computed(() =>
  [...periodUsers.value]
    .filter((u) => u.points > 0)
    .sort((a, b) => b.points - a.points)
)

</script>

<style scoped>
.view-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: var(--brand-bg);
}

.content-area {
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
}

.content-area.mobile-mode {
  overflow: hidden;
}

.period-list {
  width: 260px;
  min-width: 260px;
  border-right: 1px solid var(--brand-border);
  overflow-y: auto;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: var(--brand-surface);
  flex-shrink: 0;
}

.period-list.panel-full {
  width: 100%;
  min-width: 0;
  border-right: none;
  position: absolute;
  inset: 0;
}

.period-card {
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid var(--brand-border);
  cursor: pointer;
  transition: all 0.15s;
  background: var(--brand-surface-2);
  position: relative;
}

.period-card:hover {
  border-color: var(--brand-purple);
  background: var(--brand-surface-3);
}

.period-card.active {
  border-color: var(--brand-purple);
  background: color-mix(in srgb, var(--brand-purple) 12%, var(--brand-surface-2));
}

.period-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
}

.period-name {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 16px;
  color: var(--brand-text);
  letter-spacing: 0.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.table-wrapper {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.loyalty-table {
  height: 100%;
  width: 100%;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  background: var(--brand-surface-2);
  border: 1px solid var(--brand-border);
  border-radius: 6px;
  color: var(--brand-text-muted);
  font-size: 13px;
  font-family: var(--font-body);
  cursor: pointer;
  transition: all 0.15s;
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

.panel-left-enter-active,
.panel-left-leave-active,
.panel-right-enter-active,
.panel-right-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
  position: absolute;
  inset: 0;
}

.panel-left-enter-from { transform: translateX(-100%); opacity: 0; }
.panel-left-leave-to   { transform: translateX(-100%); opacity: 0; }

.panel-right-enter-from { transform: translateX(100%); opacity: 0; }
.panel-right-leave-to   { transform: translateX(100%); opacity: 0; }

.none-enter-active,
.none-leave-active {
  transition: none;
}

.tap-hint {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--brand-text-muted);
  font-size: 12px;
  opacity: 0.5;
}

.period-detail {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}

.period-detail.panel-full {
  position: absolute;
  inset: 0;
  width: 100%;
}


.empty-detail {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: var(--brand-text-muted);
  gap: 12px;
  font-size: 14px;
}

.empty-detail .pi {
  font-size: 28px;
  color: var(--brand-border);
}

</style>
