<template>
  <div class="view-container">
    <PageHeader
      title="No Hit"
      icon="pi-shield"
      :subtitle="`${catalogRuns.length} runs`"
    >
      <template #actions>
        <button
          v-if="isMobile && showDetail"
          class="back-btn"
          @click="showDetail = false"
        >
          <i class="pi pi-arrow-left" />
          <span>Runs</span>
        </button>
      </template>
    </PageHeader>

    <div class="content-area" :class="{ 'mobile-mode': isMobile }">

      <Transition :name="isMobile ? 'panel-left' : 'none'">
        <aside
          v-show="!isMobile || !showDetail"
          class="run-list"
          :class="{ 'panel-full': isMobile }"
        >
          <div
            v-for="run in catalogRuns"
            :key="run.id"
            class="run-card"
            :class="{ active: selectedRun?.id === run.id }"
            @click="selectRun(run)"
          >
            <span class="run-game" v-tooltip.bottom="run.game">{{ run.game }}</span>

            <div class="run-card-sub" v-tooltip.bottom="run.category.toUpperCase()">{{ run.category.toUpperCase() }}</div>

            <StatusBadge :status="run.status" />

            <div v-if="isMobile" class="tap-hint">
              <i class="pi pi-chevron-right" />
            </div>
          </div>

          <div v-if="!catalogRuns.length" class="empty-list">
            <i class="pi pi-shield" />
            <p>No runs yet.</p>
          </div>
        </aside>
      </Transition>

      <Transition :name="isMobile ? 'panel-right' : 'none'">
        <section
          v-show="!isMobile || showDetail"
          class="run-detail"
          :class="{ 'panel-full': isMobile }"
        >
          <template v-if="selectedRun">
            <div class="detail-header">
              <div class="detail-header-text">
                <h2 class="detail-title" v-tooltip.bottom="selectedRun.game">{{ selectedRun.game }}</h2>
                <p class="detail-sub" v-tooltip.bottom="selectedRun.category.toUpperCase()">{{ selectedRun.category.toUpperCase() }}</p>
                <LinkBadge v-if="selectedRun.runLink != null" :link="selectedRun.runLink" :source="'youtube'" />
              </div>

              <StatusBadge :status="selectedRun.status" large />
            </div>

            <div class="stats-strip" v-if="summarySplits.length > 0">
              <div class="stat-box">
                <span class="stat-label">Hit PB</span>
                <span class="stat-value">{{ selectedRun.hitPB ?? 0 }}</span>
              </div>
              <div class="stat-box">
                <span class="stat-label">Distance PB</span>
                <span class="stat-value">{{ (selectedRun.distancePB != null ? (selectedRun.distancePB * 100).toFixed(0) + "%" : '-' )}}</span>
                <span class="stat-label" v-tooltip.bottom="selectedRun.distancePBSplitName?.toUpperCase() ?? '-'">{{ (selectedRun.distancePBSplitName != null ? selectedRun.distancePBSplitName : '-' )}}</span>
              </div>
              <div class="stat-box">
                <span class="stat-label">Attempts</span>
                <span class="stat-value">{{ selectedRun.attempts }}</span>
              </div>
            </div>

            <div class="charts-grid" v-if="summarySplits.length > 0">
              <div class="chart-card">
                <div class="chart-title">Success Rate</div>

                <div :style="{ height: `${Math.min(Math.max(summarySplits.length * 25, 200), 1200)}px`, position: 'relative' }">
                  <Chart
                    type="bar"
                    :data="successRateChartData"
                    :options="horizontalBarOptions"
                    class="chart-instance"
                    style="height: 100%"
                  />
                </div>
              </div>
              <div class="chart-card">
                <div class="chart-title">Average Hits</div>

                <div class="chart-height":style="{ height: `${Math.min(Math.max(summarySplits.length * 25, 200), 1200)}px`, position: 'relative' }">
                  <Chart
                    type="bar"
                    :data="averageHitsChartData"
                    :options="horizontalBarOptions"
                    class="chart-instance"
                    style="height: 100%"
                  />
                </div>
              </div>
            </div>

            <div class="log-section" v-if="visibleLogRuns.length > 0">
              <div class="log-title">Run Log</div>

              <DataTable
                :value="visibleLogRuns"
                size="small"
                class="log-table"
                striped-rows
                table-style="width: 100%"
              >
                <Column field="attempt" header="#" style="width: 45px; min-width: 45px; max-width: 45px">
                  <template #body="{ data }">
                    <span class="log-text">{{ data.attempt }}</span>
                  </template>
                </Column>
                <Column field="date" header="Date" style="width: 110px; min-width: 110px; max-width: 110px">
                  <template #body="{ data }">
                    <span class="log-text">{{ formatDate(data.date) }}</span>
                  </template>
                </Column>
                <Column field="hits" header="Result" style="min-width: 0">
                  <template #body="{ data }">
                    <div class="log-cell">
                      <span class="log-text">{{ data.resetSplitName == null ? (data.hits + plural(" hit", data.hits)) : ('reset at ' + data.resetSplitName) }}</span>
                      <i class="log-pb-star" :class="`pi pi-star-fill`" v-if="data.pb" />
                    </div>
                  </template>
                </Column>
                <Column field="progress" header="Progress" style="width:150px; min-width: 150px; max-width: 150px">
                  <template #body="{ data }">
                    <div class="progress-cell">
                      <div style="position: relative; display: flex; align-items: center;">
                        <ProgressBar 
                          class="progressbar-class" 
                          :value="Number((data.progress * 100).toFixed(0))"
                          style="flex: 1; margin-right: 1.5rem;"
                        />
                        <i 
                          v-if="data.distance"
                          class="log-pb-star pi pi-star-fill" 
                          style="position: absolute; right: 0;"
                        />
                      </div>
                      <div class="progress-split-name">{{ (data.distanceSplitName != null ? data.distanceSplitName.toUpperCase() : "COMPLETED") }}</div>
                    </div>
                  </template>
                </Column>
              </DataTable>

              <div v-if="logRuns.length > 10" style="text-align: center; margin-top: 0.5rem;">
                <Button
                  :label="isLogExpanded ? 'Show less' : `Show all ${logRuns.length} runs`"
                  :icon="isLogExpanded ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
                  severity="secondary"
                  text
                  @click="isLogExpanded = !isLogExpanded"
                />
              </div>
            </div>
          </template>

          <!-- Empty state (desktop only — mobile hides this panel) -->
          <div v-else-if="!isMobile" class="empty-detail">
            <i class="pi pi-arrow-left" />
            <p>Select a run to view details</p>
          </div>
        </section>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Chart from 'primevue/chart'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import PageHeader from '@/components/PageHeader.vue'
import LinkBadge from '@/components/LinkBadge.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import ProgressBar from 'primevue/progressbar'
import Button from 'primevue/button'
import type {  NoHitCatalogRun,  NoHitSummarySplit,  NoHitLogRun } from '@/types'

const catalogRuns = ref<NoHitCatalogRun[]>([]);
const catalogLoading = ref(true);
const selectedRun = ref<NoHitCatalogRun | null>(null);
const summarySplits = ref<NoHitSummarySplit[]>([]);
const summaryLoading = ref(false);
const logRuns = ref<NoHitLogRun[]>([]);
const logLoading = ref(false);
const loadedLogRunId = ref<string | null>(null);

const isLogExpanded = ref(false);
const visibleLogRuns = computed(() =>
  isLogExpanded.value ? logRuns.value : logRuns.value.slice(0, 10)
)

// Mobile panel state
const isMobile = ref(false)
const showDetail = ref(false)

const MOBILE_BREAKPOINT = 768

function checkMobile() {
  isMobile.value = window.innerWidth < MOBILE_BREAKPOINT
}

function plural(text: string, count: number): string {
  return count === 1 ? text : text + 's'
}

onMounted(async () => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  await loadData()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

async function loadData() {
  catalogLoading.value = true
  try {
    const res = await fetch('/data/nohit/nohitcatalog.json')
    if (!res.ok) throw new Error('Failed to load')
    const json = await res.json()
    catalogRuns.value = json.runs ?? []
    catalogRuns.value = catalogRuns.value.sort((a, b) => {
      let sortValue = a.status.localeCompare(b.status);

      if (sortValue == 0)
        sortValue = a.game.localeCompare(b.game);

      if (sortValue == 0)
        sortValue = a.category.localeCompare(b.category);

      return sortValue;
    });

    // On desktop, pre-select first run; on mobile, stay on list
    if (catalogRuns.value.length && !isMobile.value) {
      selectRun(catalogRuns.value[0]);
    }
  } catch {
    catalogRuns.value = []
  } finally {
    catalogLoading.value = false
  }
}

async function selectRun(run: NoHitCatalogRun) {
  selectedRun.value = run
  summaryLoading.value = true
  loadedLogRunId.value = null  // reset log cache so it reloads when switching between runs

  if (isMobile.value) showDetail.value = true

  try {
    const res = await fetch(`/data/nohit/${run.id}/summary.json`);
    const json = await res.json()
    summarySplits.value = json.splits ?? []
  } finally {
    summaryLoading.value = false;
  }

  await loadLog(run);
}

async function loadLog(run: NoHitCatalogRun) {
  if (loadedLogRunId.value === run.id) return  // already loaded, skip
  logLoading.value = true
  try {
    const res = await fetch(`/data/nohit/${run.id}/log.json`)
    const json = await res.json()
    logRuns.value = json.runs ?? [];
    logRuns.value = logRuns.value.sort((a, b) => b.attempt - a.attempt);
    loadedLogRunId.value = run.id
  } finally {
    logLoading.value = false
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-AU', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}

const successRateChartData = computed(() => {
  if (!summarySplits.value) return {}
  return {
    labels: summarySplits.value.map((s, _i) => `${s.name}`),
    datasets: [{
      label: 'Success Rate',
      data: summarySplits.value.map((s) => s.successRate * 100),
      backgroundColor: summarySplits.value.map((s) =>
        s.disabled ? 'rgba(128, 128, 128, 0.8)' :
        s.successRate > 0.80 ? 'rgba(178, 255, 102, 0.8)' : 
        s.successRate > 0.50 ? 'rgba(255, 255, 102, 0.8)' : 
        s.successRate > 0.25 ? 'rgba(255, 178, 102, 0.8)' : 
          'rgba(255, 102, 102, 0.8)'
      ),
      borderColor: summarySplits.value.map((s) =>
        s.disabled ? 'rgba(128, 128, 128, 0.6)' :
        s.successRate > 0.80 ? 'rgba(128, 128, 128, 0.6)' : 
        s.successRate > 0.50 ? 'rgba(255, 255, 102, 0.6)' : 
        s.successAttempts > 0.25 ? 'rgba(255, 178, 102, 0.6)' : 
          'rgba(255, 102, 102, 0.6)'
      ),      
      borderWidth: 1,
      borderRadius: 2
    }]
  }
})

const averageHitsChartData = computed(() => {
  if (!summarySplits.value) return {}
  return {
    labels: summarySplits.value.map((s) => s.name),
    datasets: [{
      label: 'Average Hits',
      data: summarySplits.value.map((s) => s.averageHits),
      backgroundColor: summarySplits.value.map((s) =>
        s.disabled ? 'rgba(128, 128, 128, 0.8)' :
        s.averageHits < 0.50 ? 'rgba(178, 255, 102, 0.8)' : 
        s.averageHits < 1 ? 'rgba(255, 255, 102, 0.8)' : 
        s.averageHits < 2 ? 'rgba(255, 178, 102, 0.8)' : 
          'rgba(255, 102, 102, 0.8)'
      ),
      borderColor: summarySplits.value.map((s) =>
        s.disabled ? 'rgba(128, 128, 128, 0.6)' :
        s.averageHits < 0.50 ? 'rgba(178, 255, 102, 0.6)' : 
        s.averageHits < 1 ? 'rgba(255, 255, 102, 0.6)' : 
        s.averageHits < 2 ? 'rgba(255, 178, 102, 0.6)' : 
          'rgba(255, 102, 102, 0.6)'
      ),      
      borderWidth: 1,
      borderRadius: 4
    }]
  }
})

const baseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { bodyFont: { family: 'JetBrains Mono' } }
  },
  scales: {
    x: {
      ticks: { color: '#adadb8', font: { family: 'JetBrains Mono', size: 11 } },
      grid: { color: 'rgba(255,255,255,0.05)' }
    },
    y: {
      ticks: { color: '#adadb8', font: { family: 'JetBrains Mono', size: 11 } },
      grid: { color: 'rgba(255,255,255,0.05)' }
    }
  }
}

const horizontalBarOptions = {
  ...baseChartOptions,
  indexAxis: 'y' as const,
  scales: {
    x: baseChartOptions.scales.x,
    y: {
      ...baseChartOptions.scales.y,
      ticks: {
        ...baseChartOptions.scales.y.ticks,
        font: { family: 'JetBrains Mono', size: 11 }
      }
    }
  }
}
</script>

<style scoped>
.view-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: var(--brand-bg);
}

/* ── Content area ──────────────────────────────────────────── */
.content-area {
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
}

/* Mobile: clip so sliding panels don't overflow */
.content-area.mobile-mode {
  overflow: hidden;
}

/* ── Run list ──────────────────────────────────────────────── */
.run-list {
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

/* Mobile: full width panel */
.run-list.panel-full {
  width: 100%;
  min-width: 0;
  border-right: none;
  position: absolute;
  inset: 0;
}

.run-card {
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid var(--brand-border);
  cursor: pointer;
  transition: all 0.15s;
  background: var(--brand-surface-2);
  position: relative;
}

.run-card:hover {
  border-color: var(--brand-purple);
  background: var(--brand-surface-3);
}

.run-card.active {
  border-color: var(--brand-purple);
  background: color-mix(in srgb, var(--brand-purple) 12%, var(--brand-surface-2));
}

.run-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
}

.run-game {
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

.run-card-sub {
  font-size: 12px;
  color: var(--brand-text-muted);
  margin-top: 2px;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;  
}

.run-card-meta {
  display: flex;
  gap: 12px;
  font-size: 11px;
  color: var(--brand-text-muted);
  font-family: var(--font-mono);
}

.run-card-meta .pi {
  font-size: 10px;
  margin-right: 3px;
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

/* ── Detail panel ──────────────────────────────────────────── */
.run-detail {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}

.run-detail.panel-full {
  position: absolute;
  inset: 0;
  width: 100%;
  padding: 16px;
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

.detail-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.detail-header-text {
  min-width: 0;
  flex: 1;  
 }

.detail-title {
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin: 0 0 4px;
  color: var(--brand-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.detail-sub {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--brand-text-muted);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

/* ── Stats strip ───────────────────────────────────────────── */
.stats-strip {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.stat-box {
  background: var(--brand-surface);
  border: 1px solid var(--brand-border);
  border-radius: 8px;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 90px;
  flex: 1;
}

.stat-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--brand-text-muted);
  font-family: var(--font-mono);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stat-value {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  color: var(--brand-text);
}

.stat-value.deaths {
  color: var(--brand-accent-red);
}

/* ── Charts: 2-col on wide, stack on narrow ────────────────── */
.charts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (max-width: 640px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }

  .detail-title {
    font-size: 20px;
  }

  .run-detail.panel-full {
    padding: 12px;
  }
}

.chart-card {
  background: var(--brand-surface);
  border: 1px solid var(--brand-border);
  border-radius: 10px;
  padding: 16px;
  min-width: 0;
}

.chart-title {
  font-family: var(--font-display);
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--brand-text-muted);
  margin-bottom: 12px;
}

.log-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.log-title {
  font-family: var(--font-display);
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--brand-text-muted);
  border-left: 3px solid var(--brand-purple);
  padding-left: 10px;
}

.log-cell {
  min-width: 0;  /* allows flex child to shrink below content size */
  flex: 1;
}

.log-text {
  font-family: var(--font-mono);
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

:deep(.log-table .p-datatable-tbody > tr > td:nth-child(3)),
:deep(.log-table .p-datatable-thead > tr > th:nth-child(3)) {
  width: auto;
  flex: 1;
  overflow: hidden;
  max-width: 0;
}

.notes-text {
  font-size: 12px;
  color: var(--brand-text-muted);
  font-style: italic;
}

.empty-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 40px 16px;
  color: var(--brand-text-muted);
  font-size: 13px;
  text-align: center;
}

.empty-list .pi {
  font-size: 28px;
  color: var(--brand-border);
}

.empty-list code {
  font-family: var(--font-mono);
  background: var(--brand-surface-2);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
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

.back-btn:hover {
  border-color: var(--brand-purple);
  color: var(--brand-purple-light);
}

/* ── Panel slide transitions ───────────────────────────────── */
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

/* no-op transition for desktop */
.none-enter-active,
.none-leave-active {
  transition: none;
}

.log-pb-star {
  margin-left: 8px;
  font-size: 10px;
  color: goldenrod;
}

.progress-cell {
  min-width: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.progress-split-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 10px;
  color: var(--brand-text-muted);
  font-family: var(--font-mono);
}

.progressbar-class :deep(.p-progressbar-label) {
  color: transparent;
}

</style>