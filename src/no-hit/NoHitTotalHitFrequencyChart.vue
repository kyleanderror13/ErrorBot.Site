<template>
  <NoHitChart title="Total Hit Frequency" :height="props.height">
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
import NoHitChart from '@/no-hit/NoHitChart.vue'
import Chart from 'primevue/chart';
import { NoHitLogRun } from '@/no-hit/NoHitTypes';

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
const logRuns = ref<NoHitLogRun[]>([]);

async function load() {
  loading.value = true

  try {
    const logRes = await fetch(`/data/nohit/${props.runId}/log.json`)
    const logJson = await logRes.json()
    logRuns.value = logJson.runs ?? [];
    logRuns.value = logRuns.value.filter(r => r.resetSplitName == null);
  } finally {
    loading.value = false;
  }
}

import { plural } from '@/components/StringHelper.ts';

import {
  chartTooltipFont,
  chartTickColor,
  chartTickFont,
  chartGridLineColour,
  chartMainSeriesBackgroundColour,
  chartMainSeriesBorderColour
} from '@/components/ChartHelper.ts';

const chartData = computed(() => {
  if (!logRuns.value) return {}

  var hitGroups = Object.groupBy(logRuns.value, r => r.hits);

  return {
    labels: Object.entries(hitGroups).map(p => p[0] + " " + plural("hit", parseInt(p[0])).toUpperCase()), // the group key
    datasets: [{
      label: 'Run Count',
      data: Object.entries(hitGroups).map(p => p[1]?.length),
      backgroundColor: chartMainSeriesBackgroundColour,
      borderColor: chartMainSeriesBorderColour,
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