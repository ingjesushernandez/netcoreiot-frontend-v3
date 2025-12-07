<script setup lang="ts">
const titlePage = ref("Nuevo dispositivo");
useHead({
  titleTemplate: (t) => `${titlePage.value} | ${t}`,
});

const {
  fetchUsers,
  form,
  v$,
  submitting,
  loadingUsers,
  userOptions,
  templateOptions,
  loadingTemplates,
  handleSubmit,
  handleCancel,
} = useDeviceNew();

onMounted(async () => {
  await fetchUsers();
});
</script>

<template>
  <div>
    <SharedBreadcrumb
      :title="titlePage"
      :items="[{ label: 'Dispositivos', toName: 'devices-index' }, { label: titlePage }]"
    />

    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <form class="theme-form row g-3" novalidate @submit.prevent="handleSubmit">
                <!-- User -->
                <div class="col-12 col-md-6">
                  <FormSelect
                    id="devUser"
                    v-model="form.user"
                    :v-field="v$?.user"
                    :options="userOptions"
                    label="Usuario"
                    placeholder="Selecciona usuario"
                    requiredMark
                  />
                </div>

                <!-- Template -->
                <div class="col-12 col-md-6">
                  <FormSelect
                    id="devTemplate"
                    v-model="form.template"
                    :v-field="v$?.template"
                    :options="templateOptions"
                    :disabled="submitting || loadingTemplates"
                    label="Template"
                    placeholder="Selecciona Template"
                    requiredMark
                  />
                </div>

                <!-- Serial -->
                <div class="col-12 col-md-6">
                  <FormBaseInput
                    id="devSerial"
                    v-model="form.serial"
                    :v-field="v$?.serial"
                    label="Serial ID"
                    placeholder="DEV32000000000000"
                    requiredMark
                  />
                </div>

                <!-- Name -->
                <div class="col-12 col-md-6">
                  <FormBaseInput
                    id="devName"
                    v-model="form.name"
                    :v-field="v$?.name"
                    label="Nombre del dispositivo"
                    placeholder="Dispositivo 1"
                    spellcheck
                    requiredMark
                  />
                </div>

                <!-- Description -->
                <div class="col-12">
                  <FormBaseInput
                    id="devDesc"
                    v-model="form.description"
                    :v-field="v$?.description"
                    label="Descripción"
                    placeholder="Dispositivo para la casa"
                    spellcheck
                    requiredMark
                  />
                </div>

                <!-- Submit -->
                <div class="col-12">
                  <div class="common-flex justify-content-end mt-3">
                    <SharedButton
                      type="submit"
                      :loading="submitting"
                      :disabled="loadingUsers || loadingTemplates"
                      label="Agregar"
                    />
                    <SharedButton :disabled="submitting" label="Cancelar" color="secondary" @click="handleCancel" />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
