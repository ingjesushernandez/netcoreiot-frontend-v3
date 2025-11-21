<script setup lang="ts">
const {
  public: { company, companyWebsite },
} = useRuntimeConfig();
</script>

<template>
  <div>
    <a
      class="logo"
      :href="companyWebsite"
      target="_blank"
      :title="`Ir a la página de ${company}`"
      rel="noopener noreferrer"
    >
      <img class="img-fluid for-light" src="~/assets/img/logo/logo-netcoreiot.webp" :alt="`Logotipo ${company}`" />
      <img class="img-fluid for-dark" src="~/assets/img/logo/logo-netcoreiot-dark.webp" :alt="`Logotipo ${company}`" />
    </a>
  </div>
</template>
