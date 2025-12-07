<script setup lang="ts">
const { connecting, connected } = useMqtt();
</script>

<template>
  <li>
    <template v-if="connecting">
      <Icon name="line-md:loading-twotone-loop" title="Conectando a MQTT…" />
    </template>
    <template v-else-if="connected">
      <Icon name="fa6-solid:circle-check" class="icon-mqtt-success" title="MQTT conectado" />
    </template>
    <template v-else>
      <Icon name="fa6-solid:circle-xmark" class="icon-mqtt-error" title="MQTT desconectado" />
    </template>
  </li>
</template>
