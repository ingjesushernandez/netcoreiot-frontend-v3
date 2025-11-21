export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();

  if (!to.meta?.auth) return;

  if (!sessionStorage.getItem("auth-session")) {
    return navigateTo({ name: "auth-login", query: { redirect: to.fullPath } });
  }

  if (!authStore.accessToken) {
    try {
      await authStore.refreshToken();
    } catch {
      authStore.resetLogout();
      return navigateTo({
        name: "auth-login",
        query: { redirect: to.fullPath },
      });
    }
  }

  try {
    await authStore.hydrateMe();
  } catch {
    authStore.resetLogout();
    return navigateTo({ name: "auth-login", query: { redirect: to.fullPath } });
  }

  const needed = (to.meta.perms as string[] | undefined) ?? [];
  const mode = (to.meta.mode as "any" | "all" | undefined) ?? "any";

  if (needed.length) {
    const have = authStore.userPermissions ?? [];
    const hasStar = have.includes("*");
    const ok = hasStar
      ? true
      : mode === "all"
      ? needed.every((k) => have.includes(k))
      : needed.some((k) => have.includes(k));

    if (!ok) {
      return navigateTo({ name: "home-index" });
    }
  }
});
