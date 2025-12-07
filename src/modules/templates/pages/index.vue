<script setup lang="ts">
const titlePage = ref("Templates");
useHead({
  titleTemplate: (t) => `${titlePage.value} | ${t}`,
});

const {
  templates,
  search,
  totalItems,
  serverOptions,
  onUpdateServerOptions,
  setSelectFields,
  loading,
  handleDelete,
  goNew,
  goView,
  goEdit,
} = useTemplates();

const headers = [
  { text: "Nombre", value: "name", sortable: true },
  { text: "Descripción", value: "description", sortable: false },
  { text: "Widgets", value: "widgetsCount", sortable: false },
  { text: "Creado", value: "createdAt", sortable: true, width: 150 },
  { text: "Acciones", value: "actions" },
];

onMounted(() => {
  setSelectFields("name,description,widgets,createdAt");
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
                    label="Nuevo template"
                    icon="fa6-solid:plus"
                    title="Agregar tamplate"
                    :perms="['template:create']"
                    @click="goNew"
                  />
                </div>
                <div class="col-12 col-md-4">
                  <FormSearch v-model="search" placeholder="Buscar templates..." aria-label="Buscar templates" />
                </div>
              </div>
            </div>

            <div class="card-body pt-0 px-0">
              <EasyDataTable
                :items="templates"
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
                <template #item-name="{ name }">
                  <strong>{{ name }}</strong>
                </template>

                <template #item-widgetsCount="{ widgets }">
                  <span class="badge bg-light text-dark">{{ widgets.length }}</span>
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
                      :perms="['template:findbyid']"
                      @click="goView(_id)"
                    />

                    <SharedButton
                      variant="link"
                      icon="fa6-regular:pen-to-square"
                      iconOnly
                      title="Editar registro"
                      ariaLabel="Editar registro"
                      iconClass="txt-success"
                      :perms="['template:update']"
                      @click="goEdit(_id)"
                    />

                    <SharedButton
                      variant="link"
                      icon="fa6-regular:trash-can"
                      iconOnly
                      title="Eliminar registro"
                      ariaLabel="Eliminar registro"
                      iconClass="txt-danger"
                      :perms="['template:delete']"
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
