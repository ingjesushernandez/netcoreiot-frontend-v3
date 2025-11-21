<script setup lang="ts">
const {
  public: { company },
} = useRuntimeConfig();
</script>

<template>
  <NuxtLink :to="{ name: 'home-index' }" title="Ir al Inicio">
    <img
      class="img-fluid for-light"
      src="~/assets/img/logo/logo-netcoreiot.webp"
      :alt="`Logotipo ${company}`"
      width="160"
    />
    <img
      class="img-fluid for-dark"
      src="~/assets/img/logo/logo-netcoreiot-dark.webp"
      :alt="`Logotipo ${company}`"
      width="160"
    />
  </NuxtLink>
</template>
