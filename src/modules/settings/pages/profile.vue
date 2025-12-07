<script setup lang="ts">
const titlePage = ref("Perfil de usuario");
useHead({
  titleTemplate: (t) => `${titlePage.value} | ${t}`,
});

const {
  public: { company },
} = useRuntimeConfig();

const { can } = usePermissions();

const { currentSrc, previewUrl, uploading, deleting, fileInput, openPicker, onFileChange, deleteAvatar } = useAvatar();

const { fetchProfile, loading, submitting, form, v$, handleUpdate, handleCancel } = useProfile();

onMounted(async () => {
  await fetchProfile();
});
</script>

<template>
  <div>
    <SharedBreadcrumb :title="titlePage" :items="[{ label: titlePage }]" />

    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-12">
          <div class="card mb-3">
            <div class="profile-avatar card-body d-flex flex-column align-items-center flex-wrap pb-0 pt-5">
              <div class="position-relative">
                <img
                  :src="previewUrl || currentSrc || '/assets/img/avatar.png'"
                  :alt="`Avatar ${company}`"
                  class="rounded-3"
                  style="width: 96px; height: 96px; object-fit: cover"
                />
                <span
                  v-if="uploading"
                  class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-25 rounded-3"
                >
                  <span class="spinner-border spinner-border-sm"></span>
                </span>
              </div>
              <div class="btn-upload position-relative">
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  class="d-none"
                  @change="onFileChange"
                />
                <button
                  v-if="can('file:upload_avatar') && !currentSrc"
                  class="badge badge-primary rounded-circle p-2 border-0"
                  title="Editar avatar"
                  :disabled="uploading || deleting"
                  @click="openPicker"
                >
                  <Icon class="m-0 p-0" name="fa6-solid:upload" />
                </button>
                <button
                  v-if="can('file:delete_avatar') && currentSrc"
                  class="badge badge-danger rounded-circle p-2 border-0"
                  title="Eliminar avatar"
                  :disabled="uploading || deleting"
                  @click="deleteAvatar"
                >
                  <Icon class="m-0 p-0" name="fa6-regular:trash-can" />
                </button>
              </div>
            </div>
            <div class="card-body">
              <form class="row g-3 theme-form" @submit.prevent="handleUpdate" novalidate>
                <!-- Nombre -->
                <div class="col-12 col-md-4">
                  <FormBaseInput
                    id="pf-first"
                    v-model="form.firstName"
                    :v-field="v$?.firstName"
                    autocomplete="given-name"
                    label="Nombre"
                    placeholder="Nombre"
                    requiredMark
                  />
                </div>

                <!-- Apellido -->
                <div class="col-12 col-md-4">
                  <FormBaseInput
                    id="pf-last"
                    v-model="form.lastName"
                    :v-field="v$?.lastName"
                    autocomplete="family-name"
                    label="Apellido"
                    placeholder="Apellido"
                    requiredMark
                  />
                </div>

                <!-- DNI -->
                <div class="col-12 col-md-4">
                  <FormBaseInput
                    id="pf-dni"
                    v-model="form.dni"
                    :v-field="v$?.dni"
                    autocomplete="off"
                    label="Documento"
                    placeholder="Documento de identidad"
                    inputmode="text"
                    :spellcheck="false"
                    autocapitalize="off"
                    requiredMark
                  />
                </div>

                <!-- Teléfono -->
                <div class="col-12 col-md-6">
                  <FormBaseInput
                    id="pf-phone"
                    v-model="form.phone"
                    :v-field="v$?.phone"
                    autocomplete="tel"
                    inputmode="tel"
                    label="Teléfono"
                    placeholder="+57XXXXXXXXX"
                    requiredMark
                  />
                </div>

                <!-- Email -->
                <div class="col-12 col-md-6">
                  <FormBaseInput
                    id="pf-email"
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

                <!-- Submit -->
                <div class="col-12">
                  <div class="common-flex justify-content-end mt-3">
                    <SharedButton type="submit" :loading="submitting" :disabled="loading" label="Guardar cambios" />
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
