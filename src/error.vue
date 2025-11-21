<script setup lang="ts">
import type { NuxtError } from "#app";

const titlePage = ref("Error 404");
useHead({
  titleTemplate: (t) => `${titlePage.value} | ${t}`,
});

const router = useRouter();
const props = defineProps({
  error: Object as () => NuxtError,
});
const goHome = () => router.push({ name: "home-index" });
</script>

<template>
  <div>
    <div class="page-wrapper compact-wrapper" id="pageWrapper">
      <!-- error-404 start-->
      <div class="error-wrapper">
        <div class="container">
          <svg><use href="~/assets/svg/icon-sprite.svg#error-404"></use></svg>
          <div class="col-md-8 offset-md-2">
            <h3>{{ error?.statusCode === 404 ? "No pudimos encontrar esta página" : "Ups…" }}</h3>
            <p class="sub-content">
              {{
                error?.statusCode === 404
                  ? "Es posible que no encuentre la página que busca, o que haya sido reubicada o renombrada."
                  : ""
              }}
            </p>
          </div>
          <div>
            <SharedButton size="lg" label="IR AL INICIO" @click="goHome" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
