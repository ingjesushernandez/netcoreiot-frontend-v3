<script setup lang="ts">
const titlePage = ref("Lista de usuarios");
useHead({
  titleTemplate: (t) => `${titlePage.value} | ${t}`,
});

const { can } = usePermissions();

const {
  users,
  search,
  totalItems,
  serverOptions,
  onUpdateServerOptions,
  setSelectFields,
  loading,
  rowLoading,
  handleDelete,
  handleEnable,
  goNew,
  goView,
  goEdit,
} = useUsers();

const headers = [
  { text: "Usuario", value: "user", sortable: true, width: 400 },
  { text: "Teléfono", value: "phone", sortable: false, width: 150 },
  { text: "Rol", value: "role", sortable: false },
  { text: "Estado", value: "isActive", sortable: false, width: 80 },
  { text: "Creado", value: "createdAt", sortable: true, width: 150 },
  { text: "Acciones", value: "actions" },
];

onMounted(async () => {
  setSelectFields("firstName,lastName,email,phone,isActive,avatar,createdAt");
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
                    label="Nuevo usuario"
                    icon="fa6-solid:plus"
                    title="Agregar usuario"
                    :perms="['user:create']"
                    @click="goNew"
                  />
                </div>
                <div class="col-12 col-md-4">
                  <FormSearch v-model="search" placeholder="Buscar usuarios..." aria-label="Buscar usuarios" />
                </div>
              </div>
            </div>

            <div class="card-body pt-0 px-0">
              <EasyDataTable
                :items="users"
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
                <template #item-user="row">
                  <div class="d-flex align-items-center gap-3">
                    <img
                      :src="
                        row.avatar
                          ? `${useRuntimeConfig().public.apiUri}/files/avatar/${row.avatar}`
                          : '/assets/img/avatar.png'
                      "
                      alt="Avatar"
                      width="36"
                      height="36"
                      class="rounded-circle object-fit-cover img-fluid"
                      loading="lazy"
                      decoding="async"
                    />
                    <div class="d-flex flex-column lh-sm">
                      <strong>{{ row.firstName }} {{ row.lastName }}</strong>
                      <small class="text-muted">{{ row.email }}</small>
                    </div>
                  </div>
                </template>

                <template #item-phone="{ phone }">
                  {{ phone || "—" }}
                </template>

                <template #item-role="{ role }">
                  {{ role?.name || "—" }}
                </template>

                <template #item-isActive="{ _id, isActive, role }">
                  <div class="form-check form-switch">
                    <input
                      :id="`sw-${_id}`"
                      class="form-check-input switch-primary check-size"
                      type="checkbox"
                      role="switch"
                      :disabled="rowLoading[_id] || !can('user:enable') || isProtectedUser(role)"
                      :title="isActive ? 'Desactivar usuario' : 'Activar usuario'"
                      :checked="isActive"
                      :aria-checked="isActive"
                      :aria-label="isActive ? 'Desactivar usuario' : 'Activar usuario'"
                      @change="(e) => handleEnable(_id, (e.target as HTMLInputElement).checked)"
                      @mouseup="(e)=> (e.currentTarget as HTMLInputElement).blur()"
                    />
                  </div>
                </template>

                <template #item-createdAt="{ createdAt }">
                  {{ fmtDate(createdAt) }}
                </template>

                <template #item-actions="{ _id, role }">
                  <div class="d-flex justify-content-start gap-2">
                    <SharedButton
                      variant="link"
                      icon="fa6-regular:eye"
                      iconOnly
                      title="Ver registro"
                      ariaLabel="Ver registro"
                      iconClass="txt-info"
                      :perms="['user:findbyid']"
                      @click="goView(_id)"
                    />

                    <SharedButton
                      variant="link"
                      icon="fa6-regular:pen-to-square"
                      iconOnly
                      title="Editar registro"
                      ariaLabel="Editar registro"
                      iconClass="txt-success"
                      :perms="['user:update']"
                      @click="goEdit(_id)"
                    />

                    <SharedButton
                      variant="link"
                      icon="fa6-regular:trash-can"
                      iconOnly
                      title="Eliminar registro"
                      ariaLabel="Eliminar registro"
                      iconClass="txt-danger"
                      :disabled="isProtectedUser(role)"
                      :perms="['user:delete']"
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
