<script setup lang="ts">
const titlePage = ref("Detalle de usuario");
useHead({
  titleTemplate: (t) => `${titlePage.value} | ${t}`,
});

const { load, loading, user, fullName, roleName, roleKey, permsCount, createdAtFmt, updatedAtFmt, goBack, goEdit } =
  useUserView();

onMounted(async () => {
  await load();
});
</script>

<template>
  <div>
    <SharedBreadcrumb
      :title="titlePage"
      :items="[{ label: 'Usuarios', toName: 'users-index' }, { label: titlePage }]"
    />

    <!-- Container-fluid -->
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-12">
          <div class="card">
            <div class="card-header d-flex align-items-center justify-content-between card-no-border">
              <h5 class="mb-0">{{ fullName || "—" }}</h5>
              <div class="d-flex gap-2">
                <SharedButton
                  size="sm"
                  color="danger"
                  variant="outline"
                  label="Volver"
                  icon="fa6-solid:arrow-left"
                  @click="goBack"
                />
                <SharedButton
                  title="Editar registro"
                  size="sm"
                  label="Editar"
                  icon="fa6-regular:pen-to-square"
                  :perms="['user:update']"
                  @click="goEdit"
                />
              </div>
            </div>

            <div class="card-body">
              <!-- Loading -->
              <div v-if="loading">
                <div class="row g-4">
                  <div class="col-12 col-md-4">
                    <div class="placeholder-glow">
                      <div class="placeholder rounded w-100" style="aspect-ratio: 1/1"></div>
                    </div>
                  </div>
                  <div class="col-12 col-md-8">
                    <div class="placeholder-glow">
                      <p class="placeholder col-6"></p>
                      <p class="placeholder col-8"></p>
                      <p class="placeholder col-4"></p>
                      <p class="placeholder col-7"></p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Content -->
              <div v-else-if="user" class="row g-4">
                <!-- Avatar + estado -->
                <div class="col-12 col-md-4">
                  <div class="d-flex flex-column align-items-center gap-3">
                    <img
                      :src="
                        user.avatar
                          ? `${useRuntimeConfig().public.apiUri}/files/avatar/${user.avatar}`
                          : '/assets/img/avatar.png'
                      "
                      alt="Avatar"
                      width="180"
                      height="180"
                      class="rounded mb-2"
                      loading="lazy"
                      decoding="async"
                      style="object-fit: cover"
                    />
                    <div class="d-flex flex-wrap gap-2">
                      <span class="badge" :class="user.isActive ? 'badge-success' : 'badge-danger'">
                        {{ user.isActive ? "Activo" : "Inactivo" }}
                      </span>
                      <span class="badge" :class="user.isVerified ? 'badge-info' : 'badge-warning text-dark'">
                        {{ user.isVerified ? "Verificado" : "No verificado" }}
                      </span>
                      <span class="badge" :class="user.mqttStatus ? 'badge-success' : 'badge-light txt-dark'">
                        MQTT {{ user.mqttStatus ? "On" : "Off" }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Info principal -->
                <div class="col-12 col-md-8">
                  <div class="row g-3">
                    <div class="col-12">
                      <small class="text-muted d-block">Correo electrónico</small>
                      <div class="d-flex align-items-center gap-2">
                        <div>{{ user.email }}</div>
                        <div v-if="user.email">
                          <a title="Copiar email" href="javascript:void(0)">
                            <small>
                              <Icon
                                @click="
                                  (async () =>
                                    (await copyToClipboard(user.email))
                                      ? notifyApiSuccess('Copiado en el portapapeles.')
                                      : notifyApiError('No se pudo copiar'))()
                                "
                                name="fa6-regular:copy"
                              />
                            </small>
                          </a>
                        </div>
                      </div>
                    </div>

                    <div class="col-12 col-md-6">
                      <small class="text-muted d-block">Documento</small>
                      <div class="d-flex align-items-center gap-2">
                        <div>{{ user.dni || "—" }}</div>
                        <div v-if="user.dni">
                          <a title="Copiar documento" href="javascript:void(0)">
                            <small>
                              <Icon
                                @click="
                                  (async () =>
                                    (await copyToClipboard(user.dni))
                                      ? notifyApiSuccess('Copiado en el portapapeles.')
                                      : notifyApiError('No se pudo copiar'))()
                                "
                                name="fa6-regular:copy"
                              />
                            </small>
                          </a>
                        </div>
                      </div>
                    </div>

                    <div class="col-12 col-md-6">
                      <small class="text-muted d-block">Teléfono</small>
                      <div class="d-flex align-items-center gap-2">
                        <div>{{ user.phone || "—" }}</div>
                        <div v-if="user.phone">
                          <a title="Copiar teléfono" href="javascript:void(0)">
                            <small>
                              <Icon
                                @click="
                                  (async () =>
                                    (await copyToClipboard(user.phone))
                                      ? notifyApiSuccess('Copiado en el portapapeles.')
                                      : notifyApiError('No se pudo copiar'))()
                                "
                                name="fa6-regular:copy"
                              />
                            </small>
                          </a>
                        </div>
                      </div>
                    </div>

                    <div class="col-12 col-md-6">
                      <small class="text-muted d-block">Creado</small>
                      <div>{{ createdAtFmt }}</div>
                    </div>

                    <div class="col-12 col-md-6">
                      <small class="text-muted d-block">Actualizado</small>
                      <div>{{ updatedAtFmt }}</div>
                    </div>

                    <div class="col-12 col-md-6">
                      <small class="text-muted d-block">Rol</small>
                      <div class="d-flex align-items-center flex-wrap gap-2">
                        <span class="badge badge-info">{{ roleName }}</span>
                        <span class="badge badge-light txt-dark">key: {{ roleKey }}</span>
                        <span class="badge badge-secondary">perms: {{ permsCount }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="text-muted">No se encontró información del usuario.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
