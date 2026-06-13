<template>
  <NoHitChart title="Reset Frequency" :height="props.height">
    <template #header-controls>
      <ToggleButton
        class="chart-toggle-button"
        v-model="sortOrder"
        offLabel="Run Order"
        offIcon="pi pi-sort-numeric-down"
        onLabel="Resets"
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
  chartMainSeriesBackgroundColour,
  chartMainSeriesBorderColour,
  chartDisabledBackgroundColour,
  chartDisabledBorderColour,
} from '@/components/ChartHelper.ts';

const chartData = computed(() => {
  if (!summarySplits.value) return {}

  let splits = [...summarySplits.value];

  if (sortOrder.value) {
    splits.sort((a, b) => b.resets - a.resets)
  }

  return {
    labels: splits.map((s) => s.name),
    datasets: [{
      label: 'Resets',
      data: splits.map((s) => s.resets),
      backgroundColor: splits.map((s) => s.disabled ? chartDisabledBackgroundColour : chartMainSeriesBackgroundColour),
      borderColor: splits.map((s) => s.disabled ? chartDisabledBorderColour : chartMainSeriesBorderColour),
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