<script setup lang="ts">
const { openSidebar, showOverlay, activeOverlay, showOpenSidebar } = useTheme();

const { startMqttClient } = useMqtt();
const auth = useAuthStore();

onMounted(async () => {
  if (window.innerWidth <= 991) {
    showOverlay.value = true;
    openSidebar();
  }

  if (auth.loggedUserId || auth.loggedUser?._id) {
    setTimeout(() => startMqttClient(), 500);
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
