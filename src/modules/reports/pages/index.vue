<script setup lang="ts">
const titlePage = ref("Reportes");
useHead({ titleTemplate: (t) => `${titlePage.value} | ${t}` });

const {
  form,
  v$,
  BUCKETS,
  loadDevices,
  deviceOptions,
  widgetOptions,
  loadingDevices,
  loading,
  isGps,
  isNum,
  itemsTable,
  totalItems,
  serverOptions,
  onUpdateServerOptions,
  fetchReport,
  exportCsv,
  tableHeaders,
  resetResults,
  viz,
  titleMeta,
} = useReports();

const hasQueried = ref(false);
const doFetchReport = async () => {
  await fetchReport();
  hasQueried.value = true;
};

// Reset total
const doResetAll = () => {
  resetResults();
  hasQueried.value = false;
};

onMounted(async () => {
  await loadDevices();
});
</script>
<template>
  <div>
    <SharedBreadcrumb :title="titlePage" :items="[{ label: titlePage }]" />

    <div class="container-fluid">
      <div class="row">
        <!-- Filtros -->
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="theme-form row g-3">
                <div class="col-12 col-md-4">
                  <FormSelect
                    id="rep-device"
                    v-model="form.device"
                    :options="deviceOptions"
                    :disabled="loadingDevices || loading"
                    label="Dispositivo"
                    placeholder="Selecciona un dispositivo"
                    requiredMark
                    :v-field="v$.device"
                  />
                </div>

                <div class="col-12 col-md-4">
                  <FormSelect
                    id="rep-widget"
                    v-model="form.widgetId"
                    :options="widgetOptions"
                    :disabled="!form.device || loading"
                    label="Variable"
                    placeholder="Selecciona una variable"
                    requiredMark
                    :v-field="v$.widgetId"
                  />
                </div>

                <div class="col-12 col-md-4">
                  <FormSelect
                    id="rep-bucket"
                    v-model="form.bucket"
                    :options="BUCKETS"
                    :disabled="loading"
                    label="Agrupación (bucket)"
                    placeholder="Sin agrupación"
                  />
                </div>

                <div class="col-12 col-md-4">
                  <FormDate
                    id="rep-start"
                    v-model="form.startDate"
                    label="Fecha inicio"
                    placeholder="Desde..."
                    :disabled="loading"
                  />
                </div>

                <div class="col-12 col-md-4">
                  <FormDate
                    id="rep-end"
                    v-model="form.endDate"
                    label="Fecha fin"
                    placeholder="Hasta..."
                    :disabled="loading"
                  />
                </div>

                <div class="col-12">
                  <div class="common-flex justify-content-center mt-3">
                    <SharedButton
                      :loading="loading"
                      :disabled="loading"
                      label="Consultar"
                      icon="fa6-solid:magnifying-glass"
                      title="Consultar reporte"
                      @click="doFetchReport"
                    />
                    <SharedButton :disabled="loading" label="Limpiar" color="secondary" @click="doResetAll" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Visualización (Gráfica o Mapa) -->
        <div v-if="hasQueried && totalItems > 0" class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">{{ titleMeta }}</h5>
            </div>
            <div class="card-body">
              <ReportChart v-if="isNum && viz" :viz="viz" :title="titleMeta" :key="form.widgetId + '-' + form.bucket" />
              <ReportMap
                v-else-if="isGps && viz"
                :viz="viz"
                :title="titleMeta"
                :key="form.widgetId"
                style="height: 480px"
              />
              <p v-else class="text-muted m-0">No hay datos para visualizar.</p>
            </div>
          </div>
        </div>

        <!-- Tabla -->
        <div v-if="hasQueried" class="col-12">
          <div class="card">
            <div class="card-header card-no-border">
              <div class="row align-items-center justify-content-between gap-3">
                <div class="col-12 col-md-6">
                  <SharedButton
                    label="Exportar"
                    icon="file-icons:microsoft-excel"
                    title="Exportar"
                    :disabled="loading || totalItems === 0"
                    @click="exportCsv"
                  />
                </div>
              </div>
            </div>
            <div class="card-body pt-0 px-0">
              <EasyDataTable
                :items="itemsTable"
                :headers="tableHeaders"
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
