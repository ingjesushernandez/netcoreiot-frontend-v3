<script setup lang="ts">
const { darkMode, toggleMode } = useTheme();
</script>

<template>
  <div @click="toggleMode" class="mode" :class="{ active: darkMode }">
    <svg>
      <use href="@/assets/svg/icon-sprite.svg#moon"></use>
    </svg>
  </div>
</template>
