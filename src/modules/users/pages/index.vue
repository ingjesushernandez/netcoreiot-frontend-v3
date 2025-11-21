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
  { text: "Usuario", value: "user", sortable: true },
  { text: "Teléfono", value: "phone", sortable: true },
  { text: "Rol", value: "role", sortable: false },
  { text: "Estado", value: "isActive", sortable: true },
  { text: "Creado", value: "createdAt", sortable: true },
  { text: "Acciones", value: "actions" },
];

onMounted(async () => {
  setSelectFields(["firstName", "lastName", "email", "phone", "isActive", "avatar", "createdAt"]);
});
</script>

<template>
  <div>
    <SharedBreadcrumb :title="titlePage" :items="[{ label: titlePage }]" />

    <!-- Container-fluid -->
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-12">
          <div class="card">
            <div class="card-header card-no-border">
              <div class="row align-items-center justify-content-between gap-3">
                <div class="col-12 col-md-6">
                  <SharedButton
                    label="Nuevo usuario"
                    icon="fa6-solid:user-plus"
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

                <template #item-phone="row">
                  {{ row.phone || "—" }}
                </template>

                <template #item-role="row">
                  {{ row.role?.name || "—" }}
                </template>

                <template #item-isActive="row">
                  <div class="form-check form-switch">
                    <input
                      :id="`sw-${row._id}`"
                      class="form-check-input switch-primary check-size"
                      type="checkbox"
                      role="switch"
                      :checked="row.isActive"
                      :disabled="rowLoading[row._id] || !can('user:enable') || isProtectedUser(row)"
                      :aria-checked="row.isActive"
                      :aria-label="row.isActive ? 'Desactivar usuario' : 'Activar usuario'"
                      @change="(e) => handleEnable(row._id, (e.target as HTMLInputElement).checked)"
                      @mouseup="(e)=> (e.currentTarget as HTMLInputElement).blur()"
                    />
                  </div>
                </template>

                <template #item-createdAt="row">
                  {{ fmtDate(row.createdAt) }}
                </template>

                <template #item-actions="row">
                  <div class="d-flex justify-content-start gap-2">
                    <SharedButton
                      variant="link"
                      icon="fa6-regular:eye"
                      iconOnly
                      title="Ver registro"
                      ariaLabel="Ver registro"
                      iconClass="txt-info"
                      :perms="['user:findbyid']"
                      @click="goView(row._id)"
                    />

                    <SharedButton
                      variant="link"
                      icon="fa6-regular:pen-to-square"
                      iconOnly
                      title="Editar registro"
                      ariaLabel="Editar registro"
                      iconClass="txt-success"
                      :perms="['user:update']"
                      @click="goEdit(row._id)"
                    />

                    <SharedButton
                      variant="link"
                      icon="fa6-regular:trash-can"
                      iconOnly
                      title="Eliminar registro"
                      ariaLabel="Eliminar registro"
                      iconClass="txt-danger"
                      :disabled="isProtectedUser(row)"
                      :perms="['user:delete']"
                      @click="handleDelete(row._id)"
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
                  @update:per-page="(n) => onUpdateServerOptions({ rowsPerPage: n, page: 1 })"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
