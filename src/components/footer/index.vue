<script setup lang="ts">
const {
  public: { company, companyWebsite },
} = useRuntimeConfig();
</script>

<template>
  <footer class="footer">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12 footer-copyright text-center">
          <p class="mb-0">
            Copyright © {{ new Date().getFullYear() }} | By
            <a :href="companyWebsite" target="_blank" :title="`Ir a la página de ${company}`" rel="noopener noreferrer">
              {{ company }}
            </a>
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>
