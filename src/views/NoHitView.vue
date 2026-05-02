<template>
  <div class="view-container">
    <PageHeader
      title="No Hit"
      icon="pi-shield"
      :subtitle="`${runs.length} challenge runs`"
    >
    </PageHeader>

    <div class="content-area">
      <!-- Run list (left panel) -->
      <aside class="run-list">
        <div
          v-for="run in runs"
          :key="run.id"
          class="run-card"
          :class="{ active: selectedRun?.id === run.id }"
          @click="selectedRun = run"
        >
          <div class="run-card-header">
            <span class="run-game">{{ run.game }}</span>
            <StatusBadge :status="run.status" />
          </div>
          <div class="run-card-sub">{{ run.category }}</div>
          <div class="run-card-meta">
            <span><i class="pi pi-calendar" /> {{ formatDate(run.startDate) }}</span>
            <span><i class="pi pi-flag" /> {{ bossesDefeated(run) }}/{{ run.bosses.length }}</span>
          </div>
        </div>

        <div v-if="!runs.length" class="empty-list">
          <i class="pi pi-shield" />
          <p>No runs yet.</p>
        </div>
      </aside>

      <!-- Run detail (right panel) -->
      <section class="run-detail" v-if="selectedRun">
        <div class="detail-header">
          <div>
            <h2 class="detail-title">{{ selectedRun.game }}</h2>
            <p class="detail-sub">{{ selectedRun.category }}</p>
          </div>
          <StatusBadge :status="selectedRun.status" large />
        </div>

        <!-- Stats strip -->
        <div class="stats-strip">
          <div class="stat-box">
            <span class="stat-label">Start Date</span>
            <span class="stat-value">{{ formatDate(selectedRun.startDate) }}</span>
          </div>
          <div class="stat-box" v-if="selectedRun.endDate">
            <span class="stat-label">End Date</span>
            <span class="stat-value">{{ formatDate(selectedRun.endDate) }}</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Sessions</span>
            <span class="stat-value">{{ selectedRun.sessions.length }}</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Total Deaths</span>
            <span class="stat-value deaths">{{ totalDeaths(selectedRun) }}</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Total Hours</span>
            <span class="stat-value">{{ totalHours(selectedRun) }}</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Bosses</span>
            <span class="stat-value">{{ bossesDefeated(selectedRun) }}/{{ selectedRun.bosses.length }}</span>
          </div>
        </div>

        <div class="charts-grid">
          <!-- Deaths per session chart -->
          <div class="chart-card">
            <div class="chart-title">Deaths per Session</div>
            <Chart
              type="bar"
              :data="deathsChartData"
              :options="barChartOptions"
              class="chart-instance"
            />
          </div>

          <!-- Boss attempts chart -->
          <div class="chart-card">
            <div class="chart-title">Boss Attempts</div>
            <Chart
              type="bar"
              :data="bossAttemptsChartData"
              :options="horizontalBarOptions"
              class="chart-instance"
            />
          </div>
        </div>

        <!-- Bosses table -->
        <div class="bosses-section">
          <div class="section-title">Boss Progress</div>
          <DataTable
            :value="selectedRun.bosses"
            size="small"
            class="bosses-table"
            striped-rows
          >
            <Column field="name" header="Boss" />
            <Column field="defeated" header="Status" style="width: 100px">
              <template #body="{ data }">
                <span class="boss-status" :class="data.defeated ? 'defeated' : 'pending'">
                  <i :class="`pi ${data.defeated ? 'pi-check-circle' : 'pi-times-circle'}`" />
                  {{ data.defeated ? 'Defeated' : 'Pending' }}
                </span>
              </template>
            </Column>
            <Column field="attempts" header="Attempts" style="width: 100px">
              <template #body="{ data }">
                <span class="mono-text">{{ data.attempts }}</span>
              </template>
            </Column>
          </DataTable>
        </div>

        <!-- Sessions table -->
        <div class="bosses-section">
          <div class="section-title">Session Log</div>
          <DataTable
            :value="selectedRun.sessions"
            size="small"
            class="bosses-table"
            striped-rows
            resizable-columns
            column-resize-mode="fit"
          >
            <Column field="date" header="Date">
              <template #body="{ data }">
                <span class="mono-text">{{ formatDate(data.date) }}</span>
              </template>
            </Column>
            <Column field="duration" header="Duration">
              <template #body="{ data }">
                <span class="mono-text">{{ data.duration }}m</span>
              </template>
            </Column>
            <Column field="deaths" header="Deaths">
              <template #body="{ data }">
                <span class="mono-text deaths">{{ data.deaths }}</span>
              </template>
            </Column>
            <Column field="bossesDefeated" header="Bosses Killed">
              <template #body="{ data }">
                <span class="mono-text">{{ data.bossesDefeated }}</span>
              </template>
            </Column>
            <Column field="notes" header="Notes">
              <template #body="{ data }">
                <span class="notes-text">{{ data.notes ?? '–' }}</span>
              </template>
            </Column>
          </DataTable>
        </div>
      </section>

      <!-- Empty detail state -->
      <section class="run-detail empty-detail" v-else>
        <i class="pi pi-arrow-left" />
        <p>Select a run to view details</p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Chart from 'primevue/chart'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import PageHeader from '@/components/PageHeader.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import type { NoHitRun } from '@/types'

const runs = ref<NoHitRun[]>([])
const selectedRun = ref<NoHitRun | null>(null)
const loading = ref(true)

onMounted(async () => {
  await loadData()
})

async function loadData() {
  loading.value = true
  try {
    const res = await fetch('/data/nohit.json')
    if (!res.ok) throw new Error('Failed to load')
    const json = await res.json()
    runs.value = json.runs ?? []
    if (runs.value.length) selectedRun.value = runs.value[0]
  } catch {
    runs.value = []
  } finally {
    loading.value = false
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-AU', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}

function bossesDefeated(run: NoHitRun): number {
  return run.bosses.filter((b) => b.defeated).length
}

function totalDeaths(run: NoHitRun): number {
  return run.sessions.reduce((acc, s) => acc + s.deaths, 0)
}

function totalHours(run: NoHitRun): string {
  const totalMin = run.sessions.reduce((acc, s) => acc + s.duration, 0)
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  return `${h}h ${m}m`
}

// ── Chart data ─────────────────────────────────────────────────────────────
const deathsChartData = computed(() => {
  if (!selectedRun.value) return {}
  const sessions = selectedRun.value.sessions
  return {
    labels: sessions.map((_s, i) => `S${i + 1}`),
    datasets: [
      {
        label: 'Deaths',
        data: sessions.map((s) => s.deaths),
        backgroundColor: 'rgba(145, 70, 255, 0.6)',
        borderColor: '#9146ff',
        borderWidth: 1,
        borderRadius: 4
      }
    ]
  }
})

const bossAttemptsChartData = computed(() => {
  if (!selectedRun.value) return {}
  const bosses = selectedRun.value.bosses
  return {
    labels: bosses.map((b) => b.name),
    datasets: [
      {
        label: 'Attempts',
        data: bosses.map((b) => b.attempts),
        backgroundColor: bosses.map((b) =>
          b.defeated ? 'rgba(0, 250, 154, 0.6)' : 'rgba(255, 68, 68, 0.5)'
        ),
        borderColor: bosses.map((b) => (b.defeated ? '#00fa9a' : '#ff4444')),
        borderWidth: 1,
        borderRadius: 4
      }
    ]
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

const barChartOptions = { ...baseChartOptions }

const horizontalBarOptions = {
  ...baseChartOptions,
  indexAxis: 'y' as const,
  scales: {
    x: baseChartOptions.scales.x,
    y: {
      ...baseChartOptions.scales.y,
      ticks: { ...baseChartOptions.scales.y.ticks, font: { family: 'JetBrains Mono', size: 10 } }
    }
  }
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

.content-area {
  flex: 1;
  display: flex;
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
}

.run-card {
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid var(--brand-border);
  cursor: pointer;
  transition: all 0.15s;
  background: var(--brand-surface-2);
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
  font-size: 14px;
  color: var(--brand-text);
  letter-spacing: 0.02em;
}

.run-card-sub {
  font-size: 12px;
  color: var(--brand-text-muted);
  margin-bottom: 8px;
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

/* ── Detail panel ──────────────────────────────────────────── */
.run-detail {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.empty-detail {
  align-items: center;
  justify-content: center;
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
}

.detail-title {
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin: 0 0 4px;
  color: var(--brand-text);
}

.detail-sub {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--brand-text-muted);
  margin: 0;
}

/* Stats strip */
.stats-strip {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.stat-box {
  background: var(--brand-surface);
  border: 1px solid var(--brand-border);
  border-radius: 8px;
  padding: 10px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 100px;
}

.stat-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--brand-text-muted);
  font-family: var(--font-mono);
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

/* Charts */
.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.chart-card {
  background: var(--brand-surface);
  border: 1px solid var(--brand-border);
  border-radius: 10px;
  padding: 16px;
}

.chart-title {
  font-family: var(--font-display);
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--brand-text-muted);
  margin-bottom: 12px;
}

.chart-instance {
  height: 200px;
}

/* Boss table */
.bosses-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section-title {
  font-family: var(--font-display);
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--brand-text-muted);
  border-left: 3px solid var(--brand-purple);
  padding-left: 10px;
}

.boss-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
}

.boss-status.defeated {
  color: var(--brand-accent-green);
}

.boss-status.pending {
  color: var(--brand-text-muted);
}

.boss-status .pi {
  font-size: 14px;
}

.mono-text {
  font-family: var(--font-mono);
  font-size: 12px;
}

.mono-text.deaths {
  color: var(--brand-accent-red);
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

</style>
