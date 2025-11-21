<script setup lang="ts">
const titlePage = ref("Gestión de roles");
useHead({
  titleTemplate: (t) => `${titlePage.value} | ${t}`,
});

const {
  modalOpen,
  isEdit,
  title,
  submitting,
  readOnly,
  permissions,
  loadingPerms,
  permissionAllChecked,
  togglePermissionAll,
  form,
  v$,
  hasPerm,
  togglePerm,
  roles,
  totalItems,
  loading,
  search,
  serverOptions,
  setSelectFields,
  onUpdateServerOptions,
  openNew,
  openEdit,
  closeModal,
  handleSubmit,
  handleDelete,
} = useRoles();

const headers = [
  { text: "Nombre", value: "name", sortable: true },
  { text: "Key", value: "key", sortable: true },
  { text: "Permisos", value: "count", sortable: false },
  { text: "System", value: "isSystem", sortable: false },
  { text: "Creado", value: "createdAt", sortable: true },
  { text: "Acciones", value: "actions" },
];

onMounted(async () => {
  setSelectFields(["key", "name", "description", "permissions", "isSystem", "createdAt"]);
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
                  <SharedButton label="Nuevo rol" icon="fa6-solid:plus" :perms="['role:create']" @click="openNew" />
                </div>
                <div class="col-12 col-md-4">
                  <FormSearch v-model="search" placeholder="Buscar roles…" aria-label="Buscar roles" />
                </div>
              </div>
            </div>

            <div class="card-body pt-0 px-0">
              <EasyDataTable
                :items="roles"
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
                <template #item-name="row">
                  <span class="fw-semibold">{{ row.name }}</span>
                </template>

                <template #item-count="row">
                  {{ row.permissions?.length ?? 0 }}
                </template>

                <template #item-isSystem="row">
                  <span :class="row.isSystem ? 'badge bg-secondary' : 'badge bg-light text-muted'">
                    {{ row.isSystem ? "Sí" : "No" }}
                  </span>
                </template>

                <template #item-createdAt="row">
                  {{ fmtDate(row.createdAt) }}
                </template>

                <template #item-actions="row">
                  <div class="d-flex justify-content-start gap-2">
                    <SharedButton
                      variant="link"
                      icon="fa6-regular:pen-to-square"
                      iconOnly
                      title="Editar registro"
                      ariaLabel="Editar registro"
                      iconClass="txt-success"
                      :perms="['role:update']"
                      @click="openEdit(row._id)"
                    />

                    <SharedButton
                      variant="link"
                      icon="fa6-regular:trash-can"
                      iconOnly
                      title="Eliminar registro"
                      ariaLabel="Eliminar registro"
                      iconClass="txt-danger"
                      :disabled="row.isSystem"
                      :perms="['role:delete']"
                      @click="handleDelete(row)"
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

  <!-- Modal -->
  <Teleport to="body">
    <div v-if="modalOpen" class="modal fade show d-block" aria-modal="true" role="dialog" style="background: #0008">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
            <button class="btn-close" type="button" @click="closeModal" />
          </div>

          <div class="modal-body">
            <!-- Nombre & key -->
            <div class="row g-3">
              <div class="col-md-6">
                <FormBaseInput
                  id="roleName"
                  v-model="form.name"
                  :v-field="v$?.name"
                  label="Nombre"
                  placeholder="ej. Soporte Técnico"
                  :disabled="readOnly"
                  requiredMark
                />
              </div>
              <div class="col-md-6">
                <FormBaseInput
                  id="roleKey"
                  v-model="form.key"
                  :v-field="v$?.key"
                  label="Clave"
                  placeholder="ej. support"
                  hint="Minúsculas, guiones y números"
                  :disabled="readOnly || isEdit"
                  requiredMark
                />
              </div>
              <div class="col-12">
                <FormBaseInput id="roleDesc" v-model="form.description" label="Descripción" placeholder="Opcional" />
              </div>
            </div>

            <!-- Permisos -->
            <div class="mt-4">
              <label class="form-label">Permisos <span class="txt-danger" aria-hidden="true">*</span></label>
              <p v-if="v$?.permissions?.$error" class="text-danger small">
                {{ v$.permissions.$errors[0]?.$message || "Selecciona al menos un permiso." }}
              </p>

              <div v-if="loadingPerms" class="text-muted">Cargando permisos…</div>

              <div v-else class="table-responsive border rounded">
                <table class="table align-middle mb-0">
                  <tbody>
                    <tr v-for="(dom, idx) in permissions" :key="dom.domain">
                      <th class="py-4 ps-3 w-25">{{ dom.title }}</th>
                      <td class="py-4">
                        <div class="d-flex align-items-center flex-wrap gap-3">
                          <!-- "Todos" -->
                          <div class="form-check">
                            <input
                              :id="`${idx}-${dom.domain}`"
                              type="checkbox"
                              class="form-check-input"
                              :checked="permissionAllChecked(dom)"
                              :disabled="readOnly"
                              @change="togglePermissionAll(dom, ($event.target as HTMLInputElement).checked)"
                            />
                            <label class="form-check-label m-0" :for="`${idx}-${dom.domain}`">Todos</label>
                          </div>

                          <!-- items -->
                          <div v-for="it in dom.items" :key="it.key" class="form-check">
                            <input
                              :id="it.key"
                              type="checkbox"
                              class="form-check-input"
                              :checked="hasPerm(it.key)"
                              :disabled="readOnly"
                              @change="togglePerm(it.key, ($event.target as HTMLInputElement).checked)"
                            />
                            <label class="form-check-label m-0" :for="it.key">{{ it.label }}</label>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="modal-footer py-4">
            <SharedButton
              :loading="submitting"
              :disabled="loadingPerms"
              :label="isEdit ? 'Guardar cambios' : 'Agregar'"
              @click="handleSubmit"
            />
            <SharedButton :disabled="submitting" label="Cancelar" color="secondary" @click="closeModal" />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
