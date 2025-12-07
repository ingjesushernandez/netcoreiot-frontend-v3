<script setup lang="ts">
const store = useNotificationsStore();

const { fetchUnread, markRead } = useNotifications();

const closeOne = (id: string) => markRead(id);

onMounted(async () => {
  await fetchUnread();
});
</script>

<template>
  <li class="onhover-dropdown">
    <div class="notification-box">
      <svg><use href="~/assets/svg/icon-sprite.svg#notification"></use></svg>
      <span class="badge rounded-pill badge-danger"> {{ store.total }}</span>
    </div>
    <div class="onhover-show-div notification-dropdown">
      <h6 class="f-18 mb-0 dropdown-title">Alarmas</h6>

      <ul v-if="store.items.length">
        <li
          v-for="n in store.items"
          :key="n._id"
          class="b-l-primary border-4 toast default-show-toast align-items-center text-light border-0 fade show"
          aria-live="assertive"
          aria-atomic="true"
          data-bs-autohide="false"
        >
          <div class="d-flex justify-content-between w-100">
            <div class="toast-body">
              <p class="mb-1 fw-semibold">{{ n.deviceName }} • {{ n.widgetTitle }}</p>
              <p class="mb-0 small">
                {{ n.measure }}{{ n.unit || "" }} {{ n.condition }} {{ n.setPoint }}{{ n.unit || "" }} •
                {{ fmtDate(n.time) }}
              </p>
            </div>
            <button
              class="btn-close btn-close-white me-2 m-auto"
              type="button"
              data-bs-dismiss="toast"
              :aria-label="`Leer notificación ${n._id}`"
              title="Leer notificación"
              @click="closeOne(n._id)"
            ></button>
          </div>
        </li>
      </ul>

      <ul v-else>
        <li class="b-l-primary border-4 toast default-show-toast align-items-center text-light border-0 fade show">
          <div class="toast-body">
            <p>No hay alarmas para mostrar.</p>
          </div>
        </li>
      </ul>
    </div>
  </li>
</template>

<style scoped>
.notification-dropdown {
  min-width: 360px;
  max-width: 420px;
}
.toast {
  background: var(--theme-default);
}
</style>
