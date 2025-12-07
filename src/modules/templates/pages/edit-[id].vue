<script setup lang="ts">
import { VueDraggableNext as draggable } from "vue-draggable-next";
import { widgetSelect, decimalSelect, columnSelect } from "~/utils/constants";

const titlePage = ref("Editar template");
useHead({
  titleTemplate: (t) => `${titlePage.value} | ${t}`,
});

const {
  form,
  v$,
  loading,
  submitting,
  widgetType,
  currentConfig,
  loadTemplate,
  handleUpdate,
  handleCancel,
  addWidget,
  deleteWidget,
} = useTemplateEdit();

onMounted(async () => {
  await loadTemplate();
});
</script>

<template>
  <div>
    <SharedBreadcrumb
      :title="titlePage"
      :items="[{ label: 'Templates', toName: 'templates-index' }, { label: titlePage }]"
    />

    <div class="container-fluid">
      <!-- Form Template -->
      <div class="row">
        <div class="col-12">
          <div class="card" :aria-busy="loading">
            <div class="card-body">
              <div class="theme-form row g-3">
                <!-- Name -->
                <div class="col-12">
                  <FormBaseInput
                    id="templateName"
                    v-model="form.name"
                    :v-field="v$?.name"
                    label="Nombre"
                    placeholder="Nombre"
                    spellcheck
                    requiredMark
                  />
                </div>

                <!-- Description -->
                <div class="col-12">
                  <FormBaseInput
                    id="templateDesc"
                    v-model="form.description"
                    :v-field="v$?.description"
                    label="Descripción"
                    placeholder="Descripción"
                    spellcheck
                    requiredMark
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Config Widgets -->
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="theme-form row g-3">
                <!-- Select Widget -->
                <div class="col-12 mb-4">
                  <FormSelect
                    id="widgetType"
                    v-model="widgetType"
                    :v-field="v$?.widgets"
                    :options="widgetSelect"
                    :disabled="submitting || loading"
                    label="Widgets"
                    placeholder="Seleccionar widget"
                    requiredMark
                  />
                  <p v-if="v$?.widgets?.$error" class="text-danger small">
                    {{ v$.widgets.$errors[0]?.$message }}
                  </p>
                </div>

                <template v-if="currentConfig">
                  <!-- Forms Widgets -->
                  <div class="col-sm-6">
                    <div class="row g-3">
                      <!-- COMMON -->
                      <FormColorPills id="wClass" v-model="currentConfig.class" label="Seleccionar color" />
                      <FormIconPicker
                        id="wIcon"
                        v-model="currentConfig.icon"
                        label="Icono"
                        :classIcon="currentConfig.class"
                      />
                      <FormSelect
                        id="wSize"
                        v-model="currentConfig.column"
                        :options="columnSelect"
                        label="Tamaño Widget"
                        placeholder="Seleccionar Tamaño"
                      />
                      <FormBaseInput
                        id="wTitle"
                        v-model="currentConfig.title"
                        label="Nombre de variable"
                        placeholder="ej: Temperatura"
                      />

                      <!-- NUMBER_CHART -->
                      <template v-if="widgetType === 'number_chart'">
                        <FormBaseInput
                          id="wUnit"
                          v-model="currentConfig.unit"
                          label="Unidad de medida"
                          placeholder="ej: ºC, %HR"
                        />
                        <FormSelect
                          id="wDecimals"
                          v-model.number="currentConfig.decimals"
                          :options="decimalSelect"
                          label="Número de decimales"
                          placeholder="Seleccionar Decimales"
                        />
                        <FormBaseInput
                          id="wChartTimeAgo"
                          v-model="currentConfig.chartTimeAgo"
                          type="number"
                          label="Tiempo gráfica (min)"
                        />
                        <FormBaseInput
                          id="wFreq"
                          v-model="currentConfig.sendFreq"
                          type="number"
                          label="Tiempo de envío (s)"
                          min="0"
                        />
                      </template>

                      <!-- NUMBER_INDICATOR -->
                      <template v-if="widgetType === 'number_indicator'">
                        <FormBaseInput
                          id="wUnit"
                          v-model="currentConfig.unit"
                          label="Unidad de medida"
                          placeholder="ej: ºC, %HR"
                        />
                        <FormSelect
                          id="wDecimals"
                          v-model.number="currentConfig.decimals"
                          :options="decimalSelect"
                          label="Número de decimales"
                          placeholder="Seleccionar Decimales"
                        />
                        <FormBaseInput
                          id="wFreq"
                          v-model="currentConfig.sendFreq"
                          type="number"
                          label="Tiempo de envío (s)"
                          min="0"
                        />
                      </template>

                      <!-- STATUS_INDICATOR -->
                      <template v-if="widgetType === 'status_indicator'">
                        <FormBaseInput
                          id="wTextOn"
                          v-model="currentConfig.textOn"
                          label="Texto ON"
                          placeholder="ej: ON"
                        />
                        <FormBaseInput
                          id="wTextOff"
                          v-model="currentConfig.textOff"
                          label="Texto OFF"
                          placeholder="ej: OFF"
                        />
                        <FormBaseInput
                          id="wFreq"
                          v-model="currentConfig.sendFreq"
                          type="number"
                          label="Tiempo de envío (s)"
                          min="0"
                        />
                      </template>

                      <!-- MAP -->
                      <template v-if="widgetType === 'map'">
                        <FormBaseInput
                          id="wZoomMap"
                          v-model="currentConfig.zoomMap"
                          type="number"
                          label="Zoom del mapa"
                          min="1"
                          max="18"
                        />
                        <FormBaseInput
                          id="wFreq"
                          v-model="currentConfig.sendFreq"
                          type="number"
                          label="Tiempo de envío (s)"
                          min="0"
                        />
                      </template>

                      <!-- BUTTON -->
                      <template v-if="widgetType === 'button'">
                        <FormBaseInput
                          id="wMessage"
                          v-model="currentConfig.message"
                          label="Mensaje para enviar"
                          placeholder="ej: true | false"
                        />
                        <FormBaseInput
                          id="wTxtBtn"
                          v-model="currentConfig.textButton"
                          label="Texto del botón"
                          placeholder="ej: ON | OFF"
                        />
                      </template>

                      <!-- SWITCH -->
                      <template v-if="widgetType === 'switch'">
                        <FormBaseInput
                          id="wFreq"
                          v-model="currentConfig.sendFreq"
                          type="number"
                          label="Tiempo de envío (s)"
                          min="0"
                        />
                      </template>

                      <!-- DIMMER -->
                      <template v-if="widgetType === 'dimmer'">
                        <FormBaseInput
                          id="wFreq"
                          v-model="currentConfig.sendFreq"
                          type="number"
                          label="Tiempo de envío (s)"
                          min="0"
                        />
                      </template>

                      <!-- Add Widget -->
                      <div class="common-flex justify-content-center mt-5">
                        <SharedButton
                          v-if="widgetType != ''"
                          :disabled="!widgetType"
                          label="Agregar Widget"
                          icon="fa6-solid:plus"
                          title="Agregar Widget"
                          @click="addWidget"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Preview Widget -->
                  <div class="col-sm-6">
                    <IotNumberChart
                      v-if="widgetType === 'number_chart'"
                      :config="currentConfig"
                      class="widget-preview"
                    />
                    <IotNumberIndicator
                      v-if="widgetType === 'number_indicator'"
                      :config="currentConfig"
                      class="widget-preview"
                    />
                    <IotStatusIndicator
                      v-if="widgetType === 'status_indicator'"
                      :config="currentConfig"
                      class="widget-preview"
                    />
                    <IotMap v-if="widgetType === 'map'" :config="currentConfig" class="widget-preview" />
                    <IotButton v-if="widgetType === 'button'" :config="currentConfig" class="widget-preview" />
                    <IotSwitch v-if="widgetType === 'switch'" :config="currentConfig" class="widget-preview" />
                    <IotDimmer v-if="widgetType === 'dimmer'" :config="currentConfig" class="widget-preview" />
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Preview Template -->
      <template v-if="form.widgets.length > 0">
        <draggable class="row mt-3 drag-area" :list="form.widgets">
          <div v-for="(w, idx) in form.widgets" :key="idx" :class="[w.column]" class="drag-item">
            <div class="text-end">
              <button
                type="button"
                title="Eliminar Widget"
                class="bg-transparent border-0 mb-1"
                @click="deleteWidget(idx)"
              >
                <Icon class="txt-danger" name="fa6-solid:trash-can" />
              </button>
            </div>

            <IotNumberChart v-if="w.type === 'number_chart'" :config="w" />
            <IotNumberIndicator v-if="w.type === 'number_indicator'" :config="w" />
            <IotStatusIndicator v-if="w.type === 'status_indicator'" :config="w" />
            <IotMap v-if="w.type === 'map'" :config="w" />
            <IotButton v-if="w.type === 'button'" :config="w" />
            <IotSwitch v-if="w.type === 'switch'" :config="w" />
            <IotDimmer v-if="w.type === 'dimmer'" :config="w" />
          </div>
        </draggable>

        <!-- Save -->
        <div class="row pt-3 pb-5">
          <div class="col-12">
            <div class="common-flex justify-content-center">
              <SharedButton :loading="submitting" label="Actualizar" @click="handleUpdate" />
              <SharedButton :disabled="submitting" label="Cancelar" color="secondary" @click="handleCancel" />
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
