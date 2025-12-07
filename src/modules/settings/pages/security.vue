<script setup lang="ts">
const titlePage = ref("Seguridad");
useHead({
  titleTemplate: (t) => `${titlePage.value} | ${t}`,
});

const { form, v$, submitting, handleSubmit, resetForm } = useSecurity();

type Tabs = "password" | "2fa";
const activeTab = ref<Tabs>("password");
const toPassword = () => (activeTab.value = "password");
const to2FA = () => (activeTab.value = "2fa");
</script>

<template>
  <div>
    <SharedBreadcrumb :title="titlePage" :items="[{ label: titlePage }]" />

    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-12">
          <div class="card">
            <div class="card-body">
              <ul class="simple-wrapper nav nav-tabs">
                <li class="nav-item">
                  <button
                    class="nav-link txt-primary w-100"
                    :class="{ active: activeTab === 'password' }"
                    @click="toPassword"
                  >
                    Contraseña
                  </button>
                </li>
                <li class="nav-item">
                  <button class="nav-link txt-primary w-100" :class="{ active: activeTab === '2fa' }" @click="to2FA">
                    Habilitar 2FA
                  </button>
                </li>
              </ul>

              <div class="tab-content">
                <!-- Tab: Password -->
                <div class="tab-pane fade pt-3 mb-0" :class="{ 'show active': activeTab === 'password' }">
                  <form class="theme-form row g-3" novalidate @submit.prevent="handleSubmit">
                    <div class="col-12 col-md-6">
                      <FormBaseInput
                        id="cur-pass"
                        v-model="form.oldPassword"
                        :v-field="v$?.oldPassword"
                        autocomplete="current-password"
                        label="Contraseña actual"
                        placeholder="*********"
                        requiredMark
                      />
                    </div>
                    <div class="col-12 col-md-6">
                      <FormBaseInput
                        id="new-pass"
                        v-model="form.newPassword"
                        :v-field="v$?.newPassword"
                        autocomplete="new-password"
                        label="Nueva contraseña"
                        placeholder="*********"
                        requiredMark
                      />
                    </div>
                    <div class="col-12 col-md-6">
                      <FormBaseInput
                        id="confirm-pass"
                        v-model="form.confirmPassword"
                        :v-field="v$?.confirmPassword"
                        autocomplete="new-password"
                        label="Confirmar contraseña"
                        placeholder="*********"
                        requiredMark
                      />
                    </div>
                    <div class="col-12">
                      <div class="common-flex justify-content-end mt-3">
                        <SharedButton type="submit" :loading="submitting" :disabled="submitting" label="Actualizar" />
                        <SharedButton :disabled="submitting" label="Cancelar" color="secondary" @click="resetForm" />
                      </div>
                    </div>
                  </form>
                </div>

                <!-- Tab: 2FA -->
                <div class="tab-pane fade pt-3 mb-0" :class="{ 'show active': activeTab === '2fa' }">
                  <div class="alert alert-info mb-0">
                    <strong>Próximamente:</strong> Autenticación en dos pasos (2FA) con app TOTP y respaldo por códigos.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
