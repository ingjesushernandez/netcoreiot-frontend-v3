<script setup lang="ts">
const { darkMode } = useTheme();

useHead({
  bodyAttrs: {
    class: computed(() => {
      if (darkMode.value) return "dark-only";
      return "light-only";
    }),
  },
});

onBeforeMount(async () => {
  if (localStorage.getItem("mode-template") === "dark-only") {
    darkMode.value = true;
  }
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
