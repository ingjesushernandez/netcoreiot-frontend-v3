export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore();

  if (authStore.accessToken) {
    return navigateTo({ name: "home-index" }, { replace: true });
  }

  if (sessionStorage.getItem("auth-session")) {
    try {
      await authStore.refreshToken();
      if (authStore.accessToken) {
        return navigateTo({ name: "home-index" }, { replace: true });
      }
    } catch {}
  }
});
