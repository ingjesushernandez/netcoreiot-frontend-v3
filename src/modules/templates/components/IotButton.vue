<script setup lang="ts">
const props = defineProps<{ config: IWidgetSub }>();

// M Q T T
type MqttPayload = { topic: string; msg: { type: string; value: string; save: 0 | 1 } };
const { $emit } = useNuxtApp();
const active = ref<boolean>(false);

// Topics
const deviceId = computed(() => props.config.selectedDevice?.id || "");
const baseTopic = computed(() => {
  const user = (props.config as any).user || "";
  const widgetId = (props.config as any).widgetId || "";
  return user && deviceId.value && widgetId ? `${user}/${deviceId.value}/${widgetId}` : "";
});
const topicOut = computed(() => (baseTopic.value ? `${baseTopic.value}/relay` : ""));

// Colors
const colorClass = computed(() => (active.value ? `widget-${props.config.class}` : "widget-dark"));

const sendValue = () => {
  active.value = true;

  if (!topicOut.value) return;
  const payload = props.config.message ?? "true";
  const toSend: MqttPayload = {
    topic: topicOut.value,
    msg: { type: "button", value: payload, save: 0 },
  };
  $emit("mqtt-sender", toSend);
  setTimeout(() => (active.value = false), 400);
};
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
          <div class="mt-3">
            <button
              :class="`btn btn-${config.class}`"
              @click="sendValue"
              @mouseup="(e)=> (e.currentTarget as HTMLButtonElement).blur()"
            >
              {{ config.textButton ?? "ENVIAR" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
