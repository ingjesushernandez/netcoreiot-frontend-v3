<script setup lang="ts">
const { openSidebar, showOverlay, activeOverlay, showOpenSidebar } = useTheme();

onBeforeMount(async () => {
  if (window.innerWidth <= 991) {
    showOverlay.value = true;
    openSidebar();
  }
});
</script>

<template>
  <div>
    <div class="page-wrapper compact-wrapper" id="pageWrapper">
      <div :class="{ close_icon: showOpenSidebar }" class="page-header">
        <Header />
      </div>

      <div class="page-body-wrapper">
        <Sidebar />

        <div class="page-body">
          <slot />
        </div>

        <Footer />
      </div>

      <Teleport to="body">
        <SharedTaptop />
      </Teleport>
    </div>
    <div @click="openSidebar" v-if="showOverlay" class="bg-overlay" :class="`${activeOverlay ? '' : 'active'}`"></div>
  </div>
</template>
