import useVuelidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";

import { authAxios } from "~/api/auth.api";

const REMEMBER_KEY = "auth:remember";

export default function () {
  const api = authAxios();
  const route = useRoute();
  const store = useAuthStore();

  const token = computed(() => String(route.params.token || ""));

  // ---- State
  const remember = ref(false);
  const loading = ref(false);
  const isComfirmAccount = ref(false);
  const userVerified = ref({ firstName: "", lastName: "" });

  // ---- Form
  const loginForm = ref<ILoginForm>({ email: "", password: "" });
  const rLogin = computed(() => ({
    email: { required, email },
    password: { required, passwordPolicy },
  }));
  const vLogin$ = useVuelidate(rLogin, loginForm);

  const handleLogin = async () => {
    await vLogin$.value.$validate();
    if (vLogin$.value.$invalid) return;

    try {
      loading.value = true;
      await store.login(loginForm.value);
      await navigateTo((route.query.redirect as string) || { name: "home-index" });
    } catch (err: any) {
      notifyApiError(err, "Error de autenticación");
    } finally {
      loading.value = false;
    }
  };

  const handleLogout = async () => {
    try {
      loading.value = true;
      await store.logout();
      await navigateTo({ name: "auth-login" });
      notifyApiSuccess("USER_LOGOUT");
    } catch (err: any) {
      notifyApiError(err);
    } finally {
      loading.value = false;
    }
  };

  const loadRemember = () => {
    try {
      const raw = localStorage.getItem(REMEMBER_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { email: string; remember: boolean };
      remember.value = !!parsed.remember;
      if (remember.value) loginForm.value.email = parsed.email || "";
    } catch {}
  };

  const persistRemember = () => {
    try {
      const payload = remember.value
        ? { email: loginForm.value.email, remember: true }
        : { email: "", remember: false };
      localStorage.setItem(REMEMBER_KEY, JSON.stringify(payload));
    } catch {}
  };

  const verifyAccount = async () => {
    if (!token.value) return;
    try {
      const { data } = await api.verifyEmail({ token: token.value });
      if (data?.message === "VERIFIED_EMAIL") {
        isComfirmAccount.value = true;
        userVerified.value = data.data;
      }
    } catch (err: any) {
      notifyApiError(err);
      isComfirmAccount.value = false;
    }
  };

  return {
    // State
    loading,
    remember,
    isComfirmAccount,
    userVerified,

    // Form
    loginForm,
    vLogin$,
    loadRemember,
    persistRemember,

    // Actions
    handleLogin,
    handleLogout,
    verifyAccount,
  };
}
