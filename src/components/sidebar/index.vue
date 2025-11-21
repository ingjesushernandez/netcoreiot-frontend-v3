<script setup lang="ts">
const {
  public: { company },
} = useRuntimeConfig();
const { openSidebar, showOpenSidebar } = useTheme();
</script>

<template>
  <div :class="{ close_icon: showOpenSidebar }" class="sidebar-wrapper" sidebar-layout="stroke-svg">
    <div class="logo-wrapper">
      <SidebarLogo />
      <div @click="openSidebar" class="back-btn">
        <Icon style="font-size: 14px; vertical-align: super" name="fa6-solid:angle-left" aria-hidden="false" />
      </div>
      <div class="toggle-sidebar" @click="openSidebar" checked="checked">
        <VueFeather class="status_toggle middle sidebar-toggle" type="grid" />
      </div>
    </div>
    <div class="logo-icon-wrapper">
      <NuxtLink :to="{ name: 'home-index' }" title="Ir al Inicio">
        <img width="35" class="img-fluid" src="~/assets/img/logo/logo-icon.png" :alt="`Logotipo ${company}`" />
      </NuxtLink>
    </div>
    <SidebarNav />
  </div>
</template>
