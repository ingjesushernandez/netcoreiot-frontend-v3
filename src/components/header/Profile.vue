<script setup lang="ts">
const {
  public: { apiUri },
} = useRuntimeConfig();

const authStore = useAuthStore();
const { handleLogout } = useAuth();

const defaultAvatar = "/assets/img/avatar.png";
const remoteAvatar = computed(() =>
  authStore.loggedUser?.avatar ? `${apiUri}/files/avatar/${authStore.loggedUser?.avatar}` : ""
);
const avatarSrc = ref<string>(remoteAvatar.value || defaultAvatar);
watch(remoteAvatar, (val) => {
  avatarSrc.value = val || defaultAvatar;
});
</script>

<template>
  <li class="profile-nav onhover-dropdown pe-0 py-0">
    <div class="d-flex profile-media">
      <img
        :src="avatarSrc"
        :alt="authStore.loggedUser ? `Avatar de ${authStore.loggedUser.firstName}` : 'Avatar'"
        class="b-r-10 object-fit-cover"
        width="35"
        loading="lazy"
        decoding="async"
        fetchpriority="low"
        referrerpolicy="no-referrer"
      />
      <div class="flex-grow-1">
        <span>
          {{ authStore.loggedUser?.firstName }}
          {{ authStore.loggedUser?.lastName }}
        </span>
        <p class="mb-0">{{ authStore.loggedUser?.role.name }}</p>
      </div>
    </div>
    <ul class="profile-dropdown onhover-show-div">
      <li>
        <NuxtLink :to="{ name: 'settings-profile' }" title="Ir a Mi Cuenta">
          <Icon name="ph:user-gear-light" />
          <span>Perfil</span>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink @click="handleLogout" title="Salir de la plataforma">
          <Icon name="ph:sign-in-light" />
          <span>Salir</span>
        </NuxtLink>
      </li>
    </ul>
  </li>
</template>
