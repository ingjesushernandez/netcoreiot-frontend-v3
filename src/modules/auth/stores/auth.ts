import { authAxios } from "~/api/auth.api";

const SESSION_KEY = "auth-session";

export const useAuthStore = defineStore("auth", () => {
  const { stopMqttClient } = useMqtt();
  const authApi = authAxios();
  const loggedUser = ref<ILoggedUser | null>(null);
  const loggedUserId = ref<string>("");
  const userPermissions = ref<string[]>([]);
  const accessToken = ref("");
  const expiresIn = ref(0);
  const hydrated = ref(false);

  let refreshTimer: ReturnType<typeof setTimeout> | null = null;
  const armTimer = (sec: number) => {
    if (refreshTimer) clearTimeout(refreshTimer);
    const ms = Math.max(sec * 1000 - 15000, 10000);
    refreshTimer = setTimeout(() => refreshToken().catch(resetLogout), ms);
  };

  const login = async (payload: { email: string; password: string }) => {
    const { data } = await authApi.login(payload);
    accessToken.value = data.access_token;
    expiresIn.value = data.expires_in;
    sessionStorage.setItem(SESSION_KEY, "1");
    armTimer(expiresIn.value);
  };

  const refreshToken = async () => {
    const { data } = await authApi.refresh();
    accessToken.value = data.access_token;
    expiresIn.value = data.expires_in;
    sessionStorage.setItem(SESSION_KEY, "1");
    armTimer(expiresIn.value);
  };

  const hydrateMe = async () => {
    if (hydrated.value) return;
    try {
      const { data: user } = await authApi.getMe();
      if (!user.isActive) {
        await logout();
        return;
      }
      loggedUser.value = user;
      loggedUserId.value = user._id;
      userPermissions.value = user.role?.permissions ?? [];
      hydrated.value = true;
    } catch (e) {
      throw e;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      stopMqttClient();
      resetLogout();
    }
  };

  const resetLogout = () => {
    if (refreshTimer) clearTimeout(refreshTimer);
    loggedUser.value = null;
    loggedUserId.value = "";
    userPermissions.value = [];
    accessToken.value = "";
    expiresIn.value = 0;
    hydrated.value = false;
    sessionStorage.removeItem(SESSION_KEY);
  };

  return {
    // State
    loggedUser,
    loggedUserId,
    userPermissions,
    accessToken,
    expiresIn,

    // Actions
    login,
    logout,
    refreshToken,
    resetLogout,
    hydrateMe,
  };
});
