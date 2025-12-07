<script setup lang="ts">
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
const { $listenOn, $listenOff } = useNuxtApp();
const value = ref<boolean>(false);

// Topics
const deviceId = computed(() => props.config.selectedDevice?.id || "");
const baseTopic = computed(() => {
  const user = (props.config as any).user || "";
  const widgetId = (props.config as any).widgetId || "";
  return user && deviceId.value && widgetId ? `${user}/${deviceId.value}/${widgetId}` : "";
});
const topicIn = computed(() => (baseTopic.value ? `${baseTopic.value}/sdata` : ""));

// Colors
const colorClass = computed(() => (value.value ? `widget-${props.config.class}` : "widget-dark"));

const onIncoming = (data: any) => {
  try {
    value.value = Boolean(data?.value ?? data);
    lastTs.value = Date.now();
  } catch {}
};

const sub = (t: string) => t && $listenOn(t, onIncoming);
const unsub = (t: string) => t && $listenOff(t, onIncoming);

watch(
  topicIn,
  (t, old) => {
    value.value = false;
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
          <Icon :class="colorClass" class="h1 m-0" :name="config.icon" />
        </div>
        <div class="col-8 text-end align-content-around">
          <div class="mb-1">
            <span class="d-inline-block h5">
              <b>{{ config.title }}</b>
            </span>
          </div>
          <div class="mb-3">
            <span class="d-inline-block h4 fw-normal">
              {{ value ? config.textOn ?? "Encendido" : config.textOff ?? "Apagado" }}
            </span>
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
