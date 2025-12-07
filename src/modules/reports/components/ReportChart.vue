<script setup lang="ts">
const props = defineProps<{
  viz: IReportViz;
  title?: string;
}>();

const COLOR = "var(--w-primary)";

const series = computed(() => {
  if (props.viz?.kind !== "num") return [];
  if (props.viz.bucket === "none") {
    const pts = (props.viz.points ?? []).map((p: any) => [p.time, Number(p.value || 0)]);
    return [{ name: props.title || "Serie", data: pts }];
  }
  const pts = (props.viz.points ?? []).map((p: any) => [p.t, Number(p.avg || 0)]);
  return [{ name: `${props.title || "Serie"} (avg)`, data: pts }];
});

const options = computed(() => ({
  chart: { id: "report-chart", type: "line", toolbar: { show: true }, zoom: { enabled: true } },
  dataLabels: { enabled: false },
  markers: { size: 0, hover: { size: 4 }, strokeWidth: 1 },
  stroke: { curve: "straight", width: 2 },
  tooltip: { enabled: true, x: { show: true, format: "dd/MM/yy HH:mm:ss" } },
  legend: {
    show: true,
    position: "bottom",
    horizontalAlign: "center",
    fontSize: "14px",
    offsetY: 8,
  },
  colors: [COLOR],
  xaxis: { type: "datetime", tooltip: { enabled: false }, crosshairs: { show: false } },
}));
</script>

<template>
  <div>
    <apexchart v-if="series.length" height="360" type="line" :options="options" :series="series" />
    <p v-else class="text-muted m-0">Sin datos para la gráfica.</p>
  </div>
</template>
