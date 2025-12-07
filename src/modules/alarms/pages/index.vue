<script setup lang="ts">
const titlePage = ref("Alarmas");
useHead({
  titleTemplate: (t) => `${titlePage.value} | ${t}`,
});

const { can } = usePermissions();

const {
  form,
  v$,
  alarms,
  search,
  totalItems,
  serverOptions,
  onUpdateServerOptions,
  setSelectFields,
  loading,
  rowLoading,
  handleDelete,
  handleEnableRule,
  openModal,
  closeModal,
  modalOpen,
  submitting,
  loadingDevices,
  handleSubmit,
  devicesOptions,
  widgetOptions,
} = useAlarms();

const headers = [
  { text: "Dispositvio", value: "deviceName", sortable: false, width: 150 },
  { text: "Variable", value: "widgetTitle", sortable: true },
  { text: "Condición", value: "condition", sortable: false },
  { text: "Set Point", value: "setPoint", sortable: false },
  { text: "Trigger Time (min)", value: "triggerTime", sortable: false },
  { text: "Matched", value: "counter", sortable: false },
  { text: "Regla", value: "status", sortable: false, width: 80 },
  { text: "Creado", value: "createdAt", sortable: true, width: 150 },
  { text: "Acciones", value: "actions" },
];

const conditionSelect = [
  { value: "=", label: "=" },
  { value: ">", label: ">" },
  { value: ">=", label: ">=" },
  { value: "<", label: "<" },
  { value: "<=", label: "<=" },
  { value: "!=", label: "!=" },
];

onMounted(() => {
  setSelectFields("widgetTitle,deviceName,condition,setPoint,triggerTime,counter,status,emqxRuleId,createdAt");
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
                    label="Nueva alarma"
                    icon="fa6-solid:plus"
                    title="Agregar alarma"
                    :perms="['emqx:alarm_create']"
                    @click="openModal"
                  />
                </div>
                <div class="col-12 col-md-4">
                  <FormSearch v-model="search" placeholder="Buscar alarmas..." aria-label="Buscar alarmas" />
                </div>
              </div>
            </div>

            <div class="card-body pt-0 px-0">
              <EasyDataTable
                :items="alarms"
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
                <template #item-status="{ _id, status }">
                  <div class="form-check form-switch">
                    <input
                      :id="`sw-${_id}`"
                      class="form-check-input switch-primary check-size"
                      type="checkbox"
                      role="switch"
                      :disabled="rowLoading[_id] || !can('emqx:alarm_enable')"
                      :title="status ? 'Desactivar regla' : 'Activar regla'"
                      :checked="status"
                      :aria-checked="status"
                      :aria-label="status ? 'Desactivar regla' : 'Activar regla'"
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
                      icon="fa6-regular:trash-can"
                      iconOnly
                      title="Eliminar registro"
                      ariaLabel="Eliminar registro"
                      iconClass="txt-danger"
                      :perms="['emqx:alarm_delete']"
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

  <!-- Modal -->
  <Teleport to="body">
    <div v-if="modalOpen" class="modal fade show d-block" aria-modal="true" role="dialog" style="background: #0008">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Nueva alarma</h5>
            <button class="btn-close" type="button" @click="closeModal" />
          </div>

          <div class="modal-body">
            <div class="theme-form row g-3">
              <!-- Device -->
              <div class="col-12 col-md-6">
                <FormSelect
                  id="aDevice"
                  v-model="form.device"
                  :v-field="v$?.device"
                  :options="devicesOptions"
                  :disabled="submitting || loadingDevices"
                  label="Dispositivo"
                  placeholder="Selecciona dispositivo"
                  requiredMark
                />
              </div>

              <!-- Variable -->
              <div class="col-12 col-md-6">
                <FormSelect
                  id="aVariable"
                  v-model="form.widgetId"
                  :v-field="v$?.widgetId"
                  :options="widgetOptions"
                  :disabled="submitting"
                  label="Variable"
                  placeholder="Selecciona variable"
                  requiredMark
                />
              </div>

              <!-- condition -->
              <div class="col-12 col-md-4">
                <FormSelect
                  id="aCondition"
                  v-model="form.condition"
                  :v-field="v$?.condition"
                  :options="conditionSelect"
                  label="Condición"
                  placeholder="Selecciona condición"
                  requiredMark
                />
              </div>

              <!-- setPoint -->
              <div class="col-12 col-md-4">
                <FormBaseInput
                  id="aSetPoint"
                  v-model.number="form.setPoint"
                  :v-field="v$?.setPoint"
                  type="number"
                  label="Set Point"
                  placeholder="ej: 30"
                  requiredMark
                />
              </div>

              <!-- triggerTime -->
              <div class="col-12 col-md-4">
                <FormBaseInput
                  id="aTriggerTime"
                  v-model.number="form.triggerTime"
                  :v-field="v$?.triggerTime"
                  type="number"
                  label="Tiempo de activación (min)"
                  placeholder="ej: 1"
                  requiredMark
                />
              </div>
            </div>
          </div>

          <div class="modal-footer py-4">
            <SharedButton :loading="submitting" :disabled="loadingDevices" label="Agregar" @click="handleSubmit" />
            <SharedButton :disabled="submitting" label="Cancelar" color="secondary" @click="closeModal" />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
