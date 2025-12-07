<script setup lang="ts">
const titlePage = ref("Dashboard");
useHead({
  titleTemplate: (t) => `${titlePage.value} | ${t}`,
});

const { loadDevices, loadingDevices, selecting, hasDevices, devices, selectedId, devSelectedOpts, widgetsForView } =
  useDashboard();

onMounted(async () => {
  await loadDevices();
});
</script>

<template>
  <div>
    <div class="container-fluid">
      <div class="page-title">
        <div class="row">
          <div class="col-sm-6">
            <h3>{{ devices.find((d) => d._id === selectedId)?.name ?? "Dashboard" }}</h3>
          </div>

          <div class="col-sm-6">
            <ol class="breadcrumb mb-0 justify-content-sm-end">
              <li class="breadcrumb-item">
                <span>
                  {{ devices.find((d) => d._id === selectedId)?.serial ?? "" }}
                </span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>

    <div class="container-fluid">
      <div class="row g-3">
        <!-- Estado vacío -->
        <div v-if="!loadingDevices && !hasDevices" class="col-12">
          <div class="card">
            <div class="card-body">
              <p class="m-0">No tienes dispositivos agregados todavía.</p>
            </div>
          </div>
        </div>

        <!-- Selector de dispositivo -->
        <div v-else class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="theme-form row g-3 align-items-end">
                <div class="col-12">
                  <FormSelect
                    id="selectedDevice"
                    v-model="selectedId"
                    :options="devSelectedOpts"
                    :disabled="loadingDevices || selecting"
                    label="Selecionar dispositivo"
                    placeholder="Selecciona dispositivo"
                  />
                </div>

                <!-- <div class="col-12 col-md-6">
                  <div class="d-flex align-items-center gap-3">
                    <span class="text-muted">
                      <template v-if="loadingDevices">Cargando…</template>
                      <template v-else-if="selecting">Cambiando…</template>
                      <template v-else> </template>
                    </span>
                  </div>
                </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Grid de widgets -->
      <template v-if="hasDevices && widgetsForView.length">
        <div class="row">
          <div v-for="w in widgetsForView" :key="`${w.selectedDevice?.id}-${w.widgetId}`" :class="w.column">
            <!-- <Json :value="w" /> -->
            <IotNumberChart v-if="w.type === 'number_chart'" :config="w" />
            <IotNumberIndicator v-if="w.type === 'number_indicator'" :config="w" />
            <IotStatusIndicator v-if="w.type === 'status_indicator'" :config="w" />
            <IotMap v-if="w.type === 'map'" :config="w" />
            <IotButton v-if="w.type === 'button'" :config="w" />
            <IotSwitch v-if="w.type === 'switch'" :config="w" />
            <IotDimmer v-if="w.type === 'dimmer'" :config="w" />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
