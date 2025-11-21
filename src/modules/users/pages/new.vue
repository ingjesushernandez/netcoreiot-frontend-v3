<script setup lang="ts">
const titlePage = ref("Nuevo usuario");
useHead({
  titleTemplate: (t) => `${titlePage.value} | ${t}`,
});

const { fetchRoles, form, v$, loadingRoles, submitting, roleOptions, handleSubmit, handleCancel } = useUserNew();

onMounted(async () => {
  await fetchRoles();
});
</script>

<template>
  <div>
    <SharedBreadcrumb
      :title="titlePage"
      :items="[{ label: 'Usuarios', toName: 'users-index' }, { label: titlePage }]"
    />

    <!-- Container-fluid -->
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <form class="theme-form row g-3" novalidate @submit.prevent="handleSubmit">
                <!-- Role -->
                <div class="col-12 col-md-6">
                  <FormSelect
                    id="userRole"
                    v-model="form.role"
                    :v-field="v$?.role"
                    :options="roleOptions"
                    :disabled="submitting || loadingRoles"
                    label="Rol"
                    requiredMark
                    placeholder="Selecciona un rol"
                  />
                </div>

                <!-- DNI -->
                <div class="col-12 col-md-6">
                  <FormBaseInput
                    id="dni"
                    v-model="form.dni"
                    :v-field="v$?.dni"
                    autocomplete="off"
                    label="Documento"
                    placeholder="Documento"
                    inputmode="numeric"
                    :spellcheck="false"
                    autocapitalize="off"
                    requiredMark
                  />
                </div>

                <!-- Nombre / Apellido -->
                <div class="col-12 col-md-6">
                  <FormBaseInput
                    id="firstName"
                    v-model="form.firstName"
                    :v-field="v$?.firstName"
                    autocomplete="given-name"
                    label="Nombre"
                    placeholder="Nombre"
                    requiredMark
                  />
                </div>

                <div class="col-12 col-md-6">
                  <FormBaseInput
                    id="lastName"
                    v-model="form.lastName"
                    :v-field="v$?.lastName"
                    autocomplete="family-name"
                    label="Apellido"
                    placeholder="Apellido"
                    requiredMark
                  />
                </div>

                <!-- Email -->
                <div class="col-12 col-md-6">
                  <FormBaseInput
                    id="email"
                    v-model="form.email"
                    :v-field="v$?.email"
                    type="email"
                    autocomplete="email"
                    inputmode="email"
                    label="Correo electrónico"
                    placeholder="tu@correo.com"
                    requiredMark
                  />
                </div>

                <!-- Teléfono -->
                <div class="col-12 col-md-6">
                  <FormBaseInput
                    id="phone"
                    v-model="form.phone"
                    :v-field="v$?.phone"
                    autocomplete="tel"
                    label="Teléfono"
                    placeholder="+57XXXXXXXXX"
                    inputmode="tel"
                    requiredMark
                  />
                </div>

                <!-- Submit -->
                <div class="col-12">
                  <div class="common-flex justify-content-end mt-3">
                    <SharedButton type="submit" :loading="submitting" :disabled="loadingRoles" label="Agregar" />
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
