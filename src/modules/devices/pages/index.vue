<script setup lang="ts">
const titlePage = ref("Dispositivos");
useHead({
  titleTemplate: (t) => `${titlePage.value} | ${t}`,
});

const { can } = usePermissions();

const {
  devices,
  search,
  totalItems,
  serverOptions,
  onUpdateServerOptions,
  setSelectFields,
  loading,
  rowLoading,
  handleDelete,
  handleEnableRule,
  goNew,
  goView,
} = useDevices();

const headers = [
  { text: "Estado", value: "status", sortable: false, width: 80 },
  { text: "Nombre", value: "name", sortable: true, width: 120 },
  { text: "Serial", value: "serial", sortable: false, width: 170 },
  { text: "Contraseña", value: "password", sortable: false },
  { text: "Tablero", value: "template", sortable: true },
  { text: "Descripción", value: "description", sortable: false },
  { text: "Regla", value: "saveRule", sortable: false, width: 80 },
  { text: "Creado", value: "createdAt", sortable: true, width: 150 },
  { text: "Acciones", value: "actions" },
];

onMounted(() => {
  setSelectFields("user,name,serial,password,template,description,mqttStatus,createdAt");
});
</script>

<template>
  <div>
    <SharedBreadcrumb :title="titlePage" :items="[{ label: titlePage }]" />

    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-12">
          <div class="card">
            <div class="card-header card-no-border">
              <div class="row align-items-center justify-content-between gap-3">
                <div class="col-12 col-md-6">
                  <SharedButton
                    label="Nuevo dispositivo"
                    icon="fa6-solid:plus"
                    title="Agregar dispositivo"
                    :perms="['device:create']"
                    @click="goNew"
                  />
                </div>
                <div class="col-12 col-md-4">
                  <FormSearch v-model="search" placeholder="Buscar dispositivos..." aria-label="Buscar dispositivos" />
                </div>
              </div>
            </div>

            <div class="card-body pt-0 px-0">
              <EasyDataTable
                :items="devices"
                :headers="headers"
                :loading="loading"
                :server-items-length="totalItems"
                :server-options="serverOptions"
                @update:server-options="onUpdateServerOptions"
                table-class-name="customize-table"
                class="table-responsive"
                :sort-by="serverOptions.sortBy"
                :sort-type="serverOptions.sortType"
                :rows-per-page="serverOptions.rowsPerPage"
                hide-footer
              >
                <template #item-status="{ mqttStatus }">
                  <Icon class="h6" :class="mqttStatus ? 'txt-success' : 'txt-danger'" name="fa6-solid:power-off" />
                </template>

                <template #item-password="{ password }">
                  <div class="d-flex align-items-center gap-2">
                    <div class="text-muted">********</div>
                    <SharedBtnCopy :value="password" title="Copiar password" />
                  </div>
                </template>

                <template #item-template="{ template }">
                  {{ template.name }}
                </template>

                <template #item-saveRule="{ _id, saveRule }">
                  <div class="form-check form-switch">
                    <input
                      :id="`sw-${_id}`"
                      class="form-check-input switch-primary check-size"
                      type="checkbox"
                      role="switch"
                      :disabled="rowLoading[_id] || !can('emqx:save_enable')"
                      :title="saveRule.status ? 'Desactivar regla' : 'Activar regla'"
                      :checked="saveRule.status"
                      :aria-checked="saveRule.status"
                      :aria-label="saveRule.status ? 'Desactivar regla' : 'Activar regla'"
                      @change="(e) => handleEnableRule(_id, (e.target as HTMLInputElement).checked)"
                      @mouseup="(e)=> (e.currentTarget as HTMLInputElement).blur()"
                    />
                  </div>
                </template>

                <template #item-createdAt="{ createdAt }">
                  {{ fmtDate(createdAt) }}
                </template>

                <template #item-actions="{ _id }">
                  <div class="d-flex justify-content-start gap-2">
                    <SharedButton
                      variant="link"
                      icon="fa6-regular:eye"
                      iconOnly
                      title="Ver registro"
                      ariaLabel="Ver registro"
                      iconClass="txt-info"
                      :perms="['device:findbyid']"
                      @click="goView(_id)"
                    />

                    <!-- <SharedButton
                      variant="link"
                      icon="fa6-regular:pen-to-square"
                      iconOnly
                      title="Editar registro"
                      ariaLabel="Editar registro"
                      iconClass="txt-success"
                      :perms="['device:update']"
                      @click="goEdit(_id)"
                    /> -->

                    <SharedButton
                      variant="link"
                      icon="fa6-regular:trash-can"
                      iconOnly
                      title="Eliminar registro"
                      ariaLabel="Eliminar registro"
                      iconClass="txt-danger"
                      :perms="['device:delete']"
                      @click="handleDelete(_id)"
                    />
                  </div>
                </template>

                <template #empty-message>
                  <p class="mt-3">No se encontraron registros.</p>
                </template>
              </EasyDataTable>

              <div class="pagination-container p-4 pb-0">
                <SharedPagination
                  :page="serverOptions.page"
                  :per-page="serverOptions.rowsPerPage"
                  :total="totalItems"
                  :disabled="loading"
                  @update:page="(p) => onUpdateServerOptions({ page: p })"
                  @update:per-page="(n:number) => onUpdateServerOptions({ rowsPerPage: n, page: 1 })"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
