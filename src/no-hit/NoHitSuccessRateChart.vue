<template>
  <NoHitChart title="Success Rate" :height="props.height">
    <template #header-controls>
      <ToggleButton
        class="chart-toggle-button"
        v-model="recent"
        offLabel="All Time"
        offIcon="pi pi-history"
        onLabel="Recent"
        onIcon="pi pi-clock"
      />
      <ToggleButton
        class="chart-toggle-button"
        v-model="sortOrder"
        offLabel="Run Order"
        offIcon="pi pi-sort-numeric-down"
        onLabel="Rate"
        onIcon="pi pi-sort-amount-up-alt"
      />
    </template>

    <Chart
      type="bar"
      :data="chartData"
      :options="chartOptions"
      style="height: 100%"
    />
  </NoHitChart>
</template>

<script setup lang="ts">

import { computed, onMounted, ref, watch } from 'vue';
import ToggleButton from 'primevue/togglebutton';
import NoHitChart from '@/no-hit/NoHitChart.vue'
import Chart from 'primevue/chart';
import { NoHitSummarySplit } from '@/no-hit/NoHitTypes';

const props = defineProps<{
  height: number,
  runId: string
}>();

onMounted(async () => {
  await load()
})

watch(() => props.runId, async () => {
  await load()
})

const loading = ref(false);
const summarySplits = ref<NoHitSummarySplit[]>([]);
async function load() {
  loading.value = true

  try {
    const summaryResource = await fetch(`/data/nohit/${props.runId}/summary.json`);
    const summaryJson = await summaryResource.json();
    summarySplits.value = summaryJson.splits ?? [];
  } finally {
    loading.value = false;
  }
}

import {
  chartTooltipFont,
  chartTickColor,
  chartTickFont,
  chartGridLineColor,
  chartDisabledBackgroundColor,
  chartDisabledBorderColor,
  chartExcellentBackgroundColor,
  chartExcellentBorderColor,
  chartMediumBackgroundColor,
  chartMediumBorderColor,
  chartPoorBackgroundColor,
  chartPoorBorderColor,
  chartDangerBackgroundColor,
  chartDangerBorderColor
} from '@/components/ChartHelper.ts';

const recent = ref(false);
const sortOrder = ref(false);
const chartData = computed(() => {
  if (!summarySplits.value) return {};

  let splits = [...summarySplits.value];

  if (sortOrder.value) {
    splits.sort((a, b) => (recent.value ? a.recentSuccessRate - b.recentSuccessRate : a.successRate - b.successRate))
  }

  return {
    labels: splits.map(s => s.name),
    datasets: [{
      label: recent.value ? 'Recent' :'All-Time',
      data: splits.map(s => (recent.value ? s.recentSuccessRate : s.successRate) * 100),
      backgroundColor: splits.map(s =>
        s.disabled ? chartDisabledBackgroundColor :
        (recent.value ? s.recentSuccessRate : s.successRate) > 0.80 ? chartExcellentBackgroundColor : 
        (recent.value ? s.recentSuccessRate : s.successRate) > 0.50 ? chartMediumBackgroundColor : 
        (recent.value ? s.recentSuccessRate : s.successRate) > 0.25 ? chartPoorBackgroundColor : 
          chartDangerBackgroundColor
      ),
      borderColor: splits.map(s =>
        s.disabled ? chartDisabledBorderColor :
        (recent.value ? s.recentSuccessRate : s.successRate) > 0.80 ? chartExcellentBorderColor : 
        (recent.value ? s.recentSuccessRate : s.successRate) > 0.50 ? chartMediumBorderColor : 
        (recent.value ? s.recentSuccessRate : s.successRate) > 0.25 ? chartPoorBorderColor : 
          chartDangerBorderColor
      ),      
      borderWidth: 2,
      borderRadius: 2
    }]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y',
  plugins: {
    legend: { display: false },
    tooltip: { bodyFont: chartTooltipFont }
  },
  scales: {
    x: {
      ticks: { color: chartTickColor, font: chartTickFont },
      grid: { color: chartGridLineColor }
    },
    y: {
      ticks: { color: chartTickColor, font: chartTickFont },
      grid: { color: chartGridLineColor }
    }
  }
}

</script>

<style scoped>
@import '@/assets/chart-styles.css';
</style>