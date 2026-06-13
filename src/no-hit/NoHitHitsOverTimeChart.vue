<template>
  <NoHitChart title="Hits Over Time (Completed Runs Only)" :height="props.height">
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
import NoHitChart from '@/no-hit/NoHitChart.vue'
import Chart from 'primevue/chart';

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
    logRuns.value = logRuns.value.filter(r => r.resetSplitName == null).sort((a, b) => a.attempt - b.attempt);
  } finally {
    loading.value = false;
  }
}

import { 
  chartMainLineSeries,
  chartTrendLineSeries,
  chartPBStaircaseSeries,
  chartTooltipFont,
  chartTickColor,
  chartTickFont,
  chartGridLineColor
} from '@/components/ChartHelper.ts';

import regression from 'regression';
import { DataPoint } from 'regression';

const chartData = computed(() => {
  if (!logRuns.value) return {}

  var completedRunValue = logRuns.value;

  const dataPointArray = completedRunValue.map((run, index) => [index, run.hits] as DataPoint)
  const regressionResult = regression.polynomial(dataPointArray, { order: 2 })

  // Generate smooth curve points
  const maxIndex = Math.max(...dataPointArray.map(d => d[0]))
  const curvePoints = Array.from({ length: 100 }, (_, i) => {
    const day = (i / 99) * maxIndex
    return { x: Math.max(0, regressionResult.predict(day)[1]), y: day }
  });

  let runningMin = Number.MAX_VALUE;
  const pbStaircase = completedRunValue.map((run, index) => {
    runningMin = Math.min(runningMin, run.hits)
    return { x: runningMin, y: index }
  })

  return {
    labels: completedRunValue.map((_r, index) => index),
    datasets: [
      {
        ...chartMainLineSeries,
        label: 'Hits',
        data: completedRunValue.map((r, index) => ({ x: r.hits, y: index}))
      },
      {
        ...chartTrendLineSeries,
        label: 'Trend',
        data: curvePoints
      },
      {
        label: 'PB',
        data: pbStaircase,
        ...chartPBStaircaseSeries
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
      beginAtZero: true,
      ticks: { color: chartTickColor, font: chartTickFont },
      grid: { color: chartGridLineColor }
    },
    y: {
      type: 'linear',
      reverse: true,
      ticks: { 
        color: chartTickColor, 
        font: chartTickFont,
        stepSize: 1,
        callback: (value: number) => {
          const run = logRuns.value.find((_r, index) => index === value)
          return run ? new Date(run.date).toLocaleDateString('en-AU') : '';
        }
      },
      grid: { color: chartGridLineColor }
    }
  }
}));

</script>