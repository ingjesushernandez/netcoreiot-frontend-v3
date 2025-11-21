<script setup lang="ts">
import { useWindowScroll } from "@vueuse/core";

const THRESHOLD = 200;
const DURATION = 500;

const { y } = useWindowScroll();
const visible = computed(() => y.value > THRESHOLD);

const easeOutCubic = (t: number) => {
  return 1 - Math.pow(1 - t, 3);
};

const toTop = () => {
  const start = window.scrollY || document.documentElement.scrollTop;
  const startTime = performance.now();
  const step = (now: number) => {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / DURATION);
    const eased = easeOutCubic(progress);
    const current = Math.round(start * (1 - eased));
    window.scrollTo(0, current);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
</script>

<template>
  <div class="tap-top" v-show="visible" @click="toTop">
    <Icon name="fa-solid:angle-double-up" />
  </div>
</template>

<style scoped>
.tap-top {
  display: block;
  transition: opacity 0.2s;
}
</style>
