<script setup lang="ts">
import VueSlider from "vue-3-slider-component";

const props = defineProps<{ config: IWidgetSub }>();

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

// M Q T T
type MqttPayload = { topic: string; msg: { type: string; value: number; save: 0 | 1 } };
const { $emit, $listenOn, $listenOff } = useNuxtApp();
const lastOutboundAt = ref<number>(0);
const value = ref<number>(0);

// Topics
const deviceId = computed(() => props.config.selectedDevice?.id || "");
const baseTopic = computed(() => {
  const user = (props.config as any).user || "";
  const widgetId = (props.config as any).widgetId || "";
  return user && deviceId.value && widgetId ? `${user}/${deviceId.value}/${widgetId}` : "";
});
const topicIn = computed(() => (baseTopic.value ? `${baseTopic.value}/sdata` : ""));
const topicOut = computed(() => (baseTopic.value ? `${baseTopic.value}/relay` : ""));

// Colors
const colorClass = computed(() => `widget-${props.config.class}`);
const iconStyle = computed(() => ({
  opacity: Math.min(1, Math.max(0.08, value.value / 100)),
}));
const classToCssVar: Record<string, string> = {
  primary: "var(--w-primary)",
  secondary: "var(--w-secondary)",
  success: "var(--w-success)",
  warning: "var(--w-warning)",
  info: "var(--w-info)",
};
const sliderColor = computed(() => classToCssVar[props.config.class] || "var(--w-primary)");
const sliderProps = computed(() => ({
  tooltip: "focus",
  min: 0,
  max: 100,
  interval: 10,
  processStyle: { backgroundColor: sliderColor.value },
  tooltipStyle: { background: sliderColor.value, borderColor: sliderColor.value },
  tooltipFormatter: "{value}%",
}));

const onIncoming = (data: any) => {
  try {
    const incoming = Math.max(0, Math.min(100, Number(data?.value ?? data ?? 0)));
    if (Date.now() - lastOutboundAt.value < 150 && incoming === value.value) {
      lastTs.value = Date.now();
      return;
    }
    value.value = incoming;
    lastTs.value = Date.now();
  } catch {}
};

const sendValue = () => {
  if (!topicOut.value) return;
  lastOutboundAt.value = Date.now();
  const toSend: MqttPayload = {
    topic: topicOut.value,
    msg: { type: "dimmer", value: value.value, save: 0 },
  };
  $emit("mqtt-sender", toSend);
};

const sub = (t: string) => t && $listenOn(t, onIncoming);
const unsub = (t: string) => t && $listenOff(t, onIncoming);

watch(
  topicIn,
  (t, old) => {
    value.value = 0;
    if (old) unsub(old);
    if (t) sub(t);
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
  <div class="card widget-card">
    <div class="card-body p-4">
      <div class="row">
        <div class="col-4 d-flex align-items-center justify-content-start">
          <Icon :class="colorClass" class="h1 m-0" :name="config.icon" :style="iconStyle" />
        </div>
        <div class="col-8 text-end align-content-around">
          <div class="mb-3">
            <span class="d-inline-block h5">
              <b>{{ config.title }}</b>
            </span>
          </div>
          <div class="mb-3">
            <VueSlider v-model="value" v-bind="sliderProps" @dragEnd="sendValue" />
          </div>
          <div>
            <span class="d-inline-block fw-normal text-muted">
              <Icon name="ph:clock-counter-clockwise-fill" />
              {{ timeAgo(now - lastTs) }} ago
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
