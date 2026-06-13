<template>
  <NoHitChart title="Distance Over Time" :height="props.height">
    <Chart
      type="line"
      :data="chartData"
      :options="chartOptions"
      style="height: 100%"
    />
  </NoHitChart>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { NoHitLogRun } from '@/no-hit/NoHitTypes';
import Chart from 'primevue/chart';
import NoHitChart from '@/no-hit/NoHitChart.vue'

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
    logRuns.value.sort((a, b) => a.attempt - b.attempt);
  } finally {
    loading.value = false;
  }
}

import { 
  chartMainLineSeries,
  chartPBStaircaseSeries,
  chartTooltipFont,
  chartTickColor,
  chartTickFont,
  chartGridLineColor
} from '@/components/ChartHelper.ts';

const chartData = computed(() => {
  if (!logRuns.value) return {}

  var logRunsValue = logRuns.value;

  let runningMax = 0
  const pbStaircase = logRunsValue.map((run, index) => {
    runningMax = Math.max(runningMax, run.progress)
    return { x: runningMax, y: index }
  })

  return {
    labels: logRunsValue.map((_r, index) => index),
    datasets: [
      {
        ...chartMainLineSeries,
        label: 'Distance',
        data: logRunsValue.map((r, index) => ({ x: r.progress, y: index}))
      },
      {
        ...chartPBStaircaseSeries,
        label: 'Distance PB',
        data: pbStaircase
      }
    ]
  }
});

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y',
  plugins: {
    legend: { display: true },
    tooltip: { bodyFont: chartTooltipFont }
  },
  scales: {
    x: {
      type: 'linear',
      min: 0,
      max: 1,
      ticks: {
        ticks: { color: chartTickColor, font: chartTickFont },
        grid: { color: chartGridLineColor },
        format: { style: 'percent' }
      }
    },
    y: {
      type: 'linear',
      reverse: true,
      ticks: {
        color: chartTickColor, 
        font: chartTickFont,
        stepSize: 1,
        callback: (value: number) => {
          const run = logRuns.value?.[value];
          return run ? new Date(run.date).toLocaleDateString('en-AU') : '';
        }
      },
      grid: { color: chartGridLineColor }
    }
  }
}));
</script>