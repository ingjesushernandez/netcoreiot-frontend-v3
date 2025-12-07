<script setup lang="ts">
const titlePage = ref("Detalle template");
useHead({
  titleTemplate: (t) => `${titlePage.value} | ${t}`,
});

const { load, loading, hasWidgets, template, goBack, goEdit } = useTemplateId();

onMounted(async () => {
  await load();
});
</script>

<template>
  <div>
    <SharedBreadcrumb
      :title="titlePage"
      :items="[{ label: 'Templates', toName: 'templates-index' }, { label: titlePage }]"
    />

    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-12">
          <div class="card">
            <div class="card-body">
              <div class="row align-items-center justify-content-between gap-3">
                <div class="col-12 col-md-6">
                  <h5 class="m-0">
                    <Icon name="fa6-solid:layer-group" class="me-2" />
                    {{ template?.name || "Template" }}
                  </h5>
                  <p class="f-m-light mt-2">{{ template?.description }}</p>
                </div>

                <div class="col-12 col-md-5">
                  <div class="d-flex align-items-center justify-content-center justify-content-md-end gap-2">
                    <SharedButton
                      size="sm"
                      color="secondary"
                      variant="outline"
                      label="Volver"
                      title="Volver al listado"
                      icon="fa6-solid:arrow-left"
                      @click="goBack"
                    />
                    <SharedButton
                      size="sm"
                      label="Editar"
                      title="Editar registro"
                      icon="fa6-regular:pen-to-square"
                      :perms="['template:update']"
                      @click="goEdit"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!loading && hasWidgets" class="row">
        <div v-for="(widget, idx) in template?.widgets" :key="idx" :class="widget.column">
          <IotNumberChart v-if="widget.type === 'number_chart'" :config="widget" />
          <IotNumberIndicator v-if="widget.type === 'number_indicator'" :config="widget" />
          <IotStatusIndicator v-if="widget.type === 'status_indicator'" :config="widget" />
          <IotMap v-if="widget.type === 'map'" :config="widget" />
          <IotButton v-if="widget.type === 'button'" :config="widget" />
          <IotSwitch v-if="widget.type === 'switch'" :config="widget" />
          <IotDimmer v-if="widget.type === 'dimmer'" :config="widget" />
        </div>
      </div>

      <div v-else-if="loading" class="text-center py-5">
        <span class="spinner-border" role="status" />
      </div>

      <div v-else class="text-center py-5 text-muted">No hay widgets para este template.</div>
    </div>
  </div>
</template>
