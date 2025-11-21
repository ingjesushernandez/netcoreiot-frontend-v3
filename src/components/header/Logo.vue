<script setup lang="ts">
const {
  public: { company },
} = useRuntimeConfig();

const { openSidebar } = useTheme();
</script>

<template>
  <div class="header-logo-wrapper col-auto p-0">
    <div class="logo-wrapper">
      <NuxtLink :to="{ name: 'home-index' }" title="Ir al Inicio">
        <img class="img-fluid" src="~/assets/img/logo/logo-netcoreiot.webp" :alt="`Logotipo ${company}`" />
      </NuxtLink>
    </div>
    <div @click="openSidebar" class="toggle-sidebar">
      <VueFeather class="status_toggle middle sidebar-toggle" type="align-center" id="sidebar-toggle" />
    </div>
  </div>
</template>
