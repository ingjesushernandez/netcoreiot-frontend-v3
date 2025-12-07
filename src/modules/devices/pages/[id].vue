<script setup lang="ts">
const titlePage = ref("Detalle dispositivo");
useHead({
  titleTemplate: (t) => `${titlePage.value} | ${t}`,
});

const { load, loading, device, topicInPattern, topicOutPattern, topicInFor, topicOutFor, hasAlarms, goBack, goEdit } =
  useDeviceId();

onMounted(async () => {
  await load();
});

const badge = (ok: boolean) => (ok ? "badge rounded-pill bg-success" : "badge rounded-pill bg-danger");
</script>

<template>
  <div>
    <SharedBreadcrumb
      :title="titlePage"
      :items="[{ label: 'Dispositivos', toName: 'devices-index' }, { label: titlePage }]"
    />

    <div class="container-fluid" :aria-busy="loading">
      <!-- DETALLES / SAVE RULE EMQX -->
      <div class="row g-3" style="margin-bottom: 20px">
        <div class="col-12 col-md-6">
          <div class="card h-100">
            <div class="card-header">
              <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div class="d-flex align-items-center gap-2">
                  <Icon name="fa6-solid:microchip" />
                  <h6>{{ device?.name || "—" }}</h6>
                </div>
                <span :class="badge(!!device?.mqttStatus)">
                  MQTT: {{ device?.mqttStatus ? "Conectado" : "Desconectado" }}
                </span>
              </div>
            </div>

            <div class="card-body">
              <div class="row g-3">
                <div class="col-12 col-md-6">
                  <small class="text-muted d-block">ID</small>
                  <div class="d-flex align-items-center gap-2">
                    <div class="text-break">{{ device?._id || "—" }}</div>
                    <SharedBtnCopy :value="device?._id" title="Copiar ID" />
                  </div>
                </div>

                <div class="col-12 col-md-6">
                  <small class="text-muted d-block">Serial</small>
                  <div class="d-flex align-items-center gap-2">
                    <div class="text-break">{{ device?.serial || "—" }}</div>
                    <SharedBtnCopy :value="device?.serial" title="Copiar Serial" />
                  </div>
                </div>

                <div class="col-12">
                  <small class="text-muted d-block">Descripción</small>
                  <div>{{ device?.description || "—" }}</div>
                </div>

                <div class="col-12 col-md-6">
                  <small class="text-muted d-block">Creado</small>
                  <div>{{ fmtDate(device?.createdAt) }}</div>
                </div>
                <div class="col-12 col-md-6">
                  <small class="text-muted d-block">Actualizado</small>
                  <div>{{ fmtDate(device?.updatedAt) }}</div>
                </div>

                <div class="col-12">
                  <small class="text-muted d-block">Seleccionado</small>
                  <span :class="badge(!!device?.selected)">
                    {{ device?.selected ? "Sí" : "No" }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="card h-100">
            <div class="card-header">
              <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div class="d-flex align-items-center gap-2">
                  <Icon name="fa6-solid:database" />
                  <h6>Regla de guardado (EMQX)</h6>
                </div>
                <span :class="badge(!!device?.saveRule?.status)">
                  {{ device?.saveRule?.status ? "Activa" : "Inactiva" }}
                </span>
              </div>
            </div>

            <div class="card-body">
              <div class="row g-3">
                <div class="col-12" v-if="device?.saveRule?.emqxRuleId">
                  <small class="text-muted d-block">Rule ID</small>
                  <div class="d-flex align-items-center gap-2">
                    <div class="text-break">{{ device?.saveRule?.emqxRuleId }}</div>
                    <SharedBtnCopy :value="device?.saveRule?.emqxRuleId" title="Copiar Rule ID" />
                  </div>
                </div>

                <div class="col-12" v-if="device?.saveRule?.emqxSinkId">
                  <small class="text-muted d-block">Sink ID</small>
                  <div class="d-flex align-items-center gap-2">
                    <div class="text-break">{{ device?.saveRule?.emqxSinkId }}</div>
                    <SharedBtnCopy :value="device?.saveRule?.emqxSinkId" title="Copiar Sink ID" />
                  </div>
                </div>

                <!-- PATRONES GLOBALES DE TÓPICOS (útiles para reglas EMQX) -->
                <div class="col-12">
                  <small class="text-muted d-block">Patrones de tópicos (reglas)</small>
                  <div class="d-flex flex-column gap-2">
                    <div class="d-flex align-items-center gap-2">
                      <code class="text-break">{{ topicInPattern || "—" }}</code>
                      <SharedBtnCopy :value="topicInPattern" title="Copiar topicIn" />
                    </div>
                    <div class="d-flex align-items-center gap-2">
                      <code class="text-break">{{ topicOutPattern || "—" }}</code>
                      <SharedBtnCopy :value="topicOutPattern" title="Copiar topicOut" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ALARM RULE EMQX  -->
      <div class="row" v-if="hasAlarms">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div class="d-flex align-items-center gap-2">
                  <Icon name="fa6-solid:triangle-exclamation" />
                  <h6>Reglas de alarma (EMQX)</h6>
                </div>
                <span class="badge rounded-pill bg-light text-muted">
                  {{ device?.alarmRules?.length || 0 }} REGLAS
                </span>
              </div>
            </div>

            <div class="card-body">
              <div class="row g-3">
                <div v-for="a in device?.alarmRules || []" :key="a._id" class="col-12 col-md-6 col-lg-4">
                  <div class="border rounded p-3 h-100">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                      <div class="d-flex align-items-center gap-2">
                        <Icon name="fa6-solid:bell" />
                        <strong>{{ a.widgetTitle || "—" }}</strong>
                      </div>
                      <span :class="badge(!!a.status)">{{ a.status ? "Activa" : "Inactiva" }}</span>
                    </div>

                    <div class="mb-2">
                      <small class="text-muted d-block">Dispositivo</small>
                      <div>{{ a.deviceName || "—" }}</div>
                    </div>

                    <div class="mb-2">
                      <small class="text-muted d-block">Condición</small>
                      <div>
                        <code>{{ a.widgetTitle || "—" }}</code>
                        <code>{{ a.condition || "—" }}</code>
                        <code>{{ a.setPoint ?? "—" }}</code>
                      </div>
                    </div>

                    <div class="mb-2" v-if="a.emqxRuleId">
                      <small class="text-muted d-block">Rule ID</small>
                      <div class="d-flex align-items-center gap-2">
                        <div class="text-break">
                          <code>{{ a.emqxRuleId }}</code>
                        </div>
                        <SharedBtnCopy :value="a.emqxRuleId" title="Copiar Rule ID" />
                      </div>
                    </div>

                    <div class="mb-2" v-if="a.emqxSinkId">
                      <small class="text-muted d-block">Sink ID</small>
                      <div class="d-flex align-items-center gap-2">
                        <div class="text-break">
                          <code>{{ a.emqxSinkId }}</code>
                        </div>
                        <SharedBtnCopy :value="a.emqxSinkId" title="Copiar Sink ID" />
                      </div>
                    </div>

                    <div class="mt-2">
                      <small class="text-muted">ID regla</small>
                      <div class="d-flex align-items-center gap-2">
                        <div class="text-break">
                          <code>{{ a._id }}</code>
                        </div>
                        <SharedBtnCopy :value="a._id" title="Copiar ID de la alarma" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- vacío -->
              <div v-if="(device?.alarmRules || []).length === 0" class="text-center text-muted py-4">
                No hay reglas de alarma configuradas.
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TEMPLATE ASOCIADO -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div class="d-flex align-items-center gap-2">
                  <Icon name="fa6-solid:chart-column" />
                  <h6>{{ device?.template?.name || "—" }}</h6>
                </div>
                <span class="badge rounded-pill bg-light text-muted">
                  {{ device?.template?.widgets?.length || 0 }} WIDGETS
                </span>
              </div>
              <p class="m-0 pt-2">{{ device?.template?.description || "—" }}</p>
            </div>

            <div class="card-body">
              <div class="row g-3">
                <div v-for="w in device?.template?.widgets || []" :key="w.widgetId" class="col-12 col-md-6 col-lg-4">
                  <div class="border rounded p-3 h-100">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                      <div class="d-flex align-items-center gap-2">
                        <Icon :class="`widget-${w.class}`" :name="w.icon" />
                        <strong>{{ w.title || w.type }}</strong>
                      </div>
                      <span class="badge rounded-pill bg-light text-muted text-uppercase">{{ w.direction }}</span>
                    </div>

                    <div class="mb-2">
                      <small class="text-muted d-block">Widget ID</small>
                      <div class="d-flex align-items-center gap-2">
                        <code class="text-break">{{ w.widgetId }}</code>
                        <SharedBtnCopy :value="w.widgetId" title="Copiar widgetId" />
                      </div>
                    </div>

                    <!-- topicIn (si aplica) -->
                    <div v-if="w.direction === 'input' || w.direction === 'inout'" class="mb-2">
                      <small class="text-muted d-block">topicIn</small>
                      <div class="d-flex align-items-center gap-2">
                        <code class="text-break">{{ topicInFor(w.widgetId) }}</code>
                        <SharedBtnCopy :value="topicInFor(w.widgetId)" title="Copiar topicIn" />
                      </div>
                    </div>

                    <!-- topicOut (si aplica) -->
                    <div v-if="w.direction === 'output' || w.direction === 'inout'" class="mb-2">
                      <small class="text-muted d-block">topicOut</small>
                      <div class="d-flex align-items-center gap-2">
                        <code class="text-break">{{ topicOutFor(w.widgetId) }}</code>
                        <SharedBtnCopy :value="topicOutFor(w.widgetId)" title="Copiar topicOut" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Vacío -->
              <div v-if="(device?.template?.widgets || []).length === 0" class="text-center text-muted py-4">
                No hay widgets configurados en el template asociado.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-break {
  word-break: break-all;
}
</style>
