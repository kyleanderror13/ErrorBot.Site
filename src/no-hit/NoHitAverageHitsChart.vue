<template>
  <NoHitChart title="Average Hits" :height="props.height">
    <template #header-controls>
      <ToggleButton
        class="chart-toggle-button"
        v-model="sortOrder"
        offLabel="Run Order"
        offIcon="pi pi-sort-numeric-down"
        onLabel="Hits"
        onIcon="pi pi-sort-amount-up"
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

const sortOrder = ref(false);

import {
  chartTooltipFont,
  chartTickColor,
  chartTickFont,
  chartGridLineColour,
  chartDisabledBackgroundColour,
  chartDisabledBorderColour,
  chartExcellentBackgroundColour,
  chartExcellentBorderColour,
  chartMediumBackgroundColour,
  chartMediumBorderColour,
  chartPoorBackgroundColour,
  chartPoorBorderColour,
  chartDangerBackgroundColour,
  chartDangerBorderColour
} from '@/components/ChartHelper.ts';

const chartData = computed(() => {
  if (!summarySplits.value) return {}

  let splits = [...summarySplits.value];

  if (sortOrder.value) {
    splits.sort((a, b) => b.averageHits - a.averageHits)
  }

  return {
    labels: splits.map((s) => s.name),
    datasets: [{
      label: 'Average Hits',
      data: splits.map((s) => s.averageHits),
      backgroundColor: splits.map((s) =>
        s.disabled ? chartDisabledBackgroundColour :
        s.averageHits < 0.50 ? chartExcellentBackgroundColour : 
        s.averageHits < 1 ? chartMediumBackgroundColour : 
        s.averageHits < 2 ? chartPoorBackgroundColour : 
          chartDangerBackgroundColour
      ),
      borderColor: splits.map((s) =>
        s.disabled ? chartDisabledBorderColour :
        s.averageHits < 0.50 ? chartExcellentBorderColour : 
        s.averageHits < 1 ? chartMediumBorderColour : 
        s.averageHits < 2 ? chartPoorBorderColour : 
          chartDangerBorderColour
      ),      
      borderWidth: 2,
      borderRadius: 4
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
      grid: { color: chartGridLineColour }
    },
    y: {
      ticks: { color: chartTickColor, font: chartTickFont },
      grid: { color: chartGridLineColour }
    }
  }
}

</script>

<style scoped>
@import '@/assets/chart-styles.css';
</style>