<script setup lang="ts">
import { datasAxios } from "~/api/datas.api";

const props = defineProps<{ config: IWidgetSub }>();
const apiDatas = datasAxios();

const lastTs = ref(Date.now());
const now = ref(Date.now());
let timer: any = null;
const timeAgo = (ms: number) => {
  let s = Math.max(0, Math.floor(ms / 1000));
  if (s < 60) return `${s} s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} h`;
  const d = Math.floor(h / 24);
  return `${d} d`;
};

const COLOR_MAP: Record<string, string> = {
  primary: "var(--w-primary)",
  secondary: "var(--w-secondary)",
  success: "var(--w-success)",
  warning: "var(--w-warning)",
  info: "var(--w-info)",
};

const chartOptions = ref<any>({
  chart: {
    id: "numberChart-IoT",
    type: "line",
    toolbar: { show: false },
    zoom: { enabled: true },
  },
  dataLabels: {
    enabled: false,
    style: {
      fontSize: "10px",
      fontFamily: "Rubik, sans-serif",
      fontWeight: "bold",
    },
  },
  markers: { size: 0, shape: "circle", hover: { size: 4 }, strokeWidth: 1 },
  stroke: { curve: "straight", width: 2 },
  tooltip: {
    enabled: true,
    x: { show: true, format: "dd/MM/yy HH:mm:ss" },
  },
  legend: {
    show: true,
    showForSingleSeries: true,
    position: "bottom",
    horizontalAlign: "center",
    fontSize: "15px",
    fontFamily: "Rubik, sans-serif",
    fontWeight: 500,
    offsetY: 10,
  },
  colors: [COLOR_MAP[props.config.class] ?? COLOR_MAP.primary],
  xaxis: { type: "datetime", tooltip: { enabled: false }, crosshairs: { show: false } },
});

const series = ref<{ name: string; data: [number, number][] }[]>([{ name: "", data: [[Date.now(), 0]] }]);

const updatePalette = () => {
  const unit = props.config.unit ? ` ${props.config.unit}` : "";
  series.value[0].name = `${props.config.title}${unit}`;
  chartOptions.value = {
    ...chartOptions.value,
    colors: [COLOR_MAP[props.config.class] ?? COLOR_MAP.primary],
  };
};

const fetchHistory = async () => {
  if (props.config.demo) {
    const base = Date.now() - 1000 * 60 * (props.config.chartTimeAgo ?? 60);
    const pts: [number, number][] = [];
    for (let i = 0; i < 60; i++) {
      const t = base + i * 60 * 1000;
      const y = 30 + 10 * Math.sin(i / 6) + (Math.random() - 0.5) * 3;
      pts.push([t, Number(y.toFixed(props.config.decimals ?? 1))]);
    }
    series.value = [{ name: series.value[0].name, data: pts }];
    return;
  }

  try {
    const chartTimeAgo = props.config.chartTimeAgo ?? 60;
    const qParams = {
      device: deviceId.value,
      widgetId: (props.config as any).widgetId,
      chartTimeAgo,
    };

    const { data } = await apiDatas.getChartData(qParams);

    if (data.message === "DATAS_FOUND") {
      const items: any[] = data?.data ?? [];
      const pts: [number, number][] = items.map((it) => [Number(it.time), Number(it.value)]);
      series.value = [{ name: series.value[0].name, data: pts.length ? pts : [[Date.now(), 0]] }];
    }
  } catch (err) {
    series.value = [{ name: series.value[0].name, data: [[Date.now(), 0]] }];
  }
};

const forceResize = () => window.dispatchEvent(new Event("resize"));

watch(
  () => [props.config.class, props.config.unit, props.config.title],
  () => {
    updatePalette();
  },
  { immediate: true }
);

watch(
  () => props.config.chartTimeAgo,
  () => {
    fetchHistory();
  }
);

// M Q T T
const { $listenOn, $listenOff } = useNuxtApp();
const valueNow = ref<number>(0);

// Topics
const deviceId = computed(() => props.config.selectedDevice?.id || "");
const baseTopic = computed(() => {
  const user = (props.config as any).user || "";
  const widgetId = (props.config as any).widgetId || "";
  return user && deviceId.value && widgetId ? `${user}/${deviceId.value}/${widgetId}` : "";
});
const topicIn = computed(() => (baseTopic.value ? `${baseTopic.value}/sdata` : ""));

const onIncoming = (data: any) => {
  try {
    const v = Number(data?.value ?? data);
    if (Number.isFinite(v)) {
      valueNow.value = v;
      lastTs.value = Date.now();
    }
    if (data?.save === 1) fetchHistory();
  } catch {}
};

const sub = (t: string) => t && $listenOn(t, onIncoming);
const unsub = (t: string) => t && $listenOff(t, onIncoming);

watch(
  topicIn,
  async (t: any, old: any) => {
    if (old) unsub(old);
    valueNow.value = 0;
    if (t) sub(t);

    await fetchHistory();
    forceResize();
  },
  { immediate: true }
);

onMounted(() => {
  timer = setInterval(() => (now.value = Date.now()), 1000);
});

onUnmounted(() => {
  clearInterval(timer);
  if (topicIn.value) unsub(topicIn.value);
});
</script>

<template>
  <div class="card widget-card-h">
    <div class="card-header card-no-border pb-0">
      <div class="header-top">
        <div class="d-flex align-items-center gap-2">
          <h4 class="m-0">
            {{ config.title }}
          </h4>
        </div>
        <div class="card-header-right-icon">
          <span class="d-inline-block fw-normal text-muted">
            <Icon name="ph:clock-counter-clockwise-fill" />
            {{ timeAgo(now - lastTs) }} ago
          </span>
        </div>
      </div>
      <div class="mt-3">
        <Icon class="h4 me-2" :class="`widget-${config.class}`" :name="config.icon" />
        <span class="h4 fw-normal">
          {{ valueNow.toFixed(config.decimals ?? 1) }}
          <span v-if="config.unit">{{ config.unit }}</span>
        </span>
      </div>
    </div>

    <div class="card-body pt-0">
      <apexchart type="line" height="360" :options="chartOptions" :series="series" />
    </div>
  </div>
</template>
