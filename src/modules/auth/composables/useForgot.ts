import useVuelidate from "@vuelidate/core";
import { required, email, sameAs } from "@vuelidate/validators";

import { authAxios } from "~/api/auth.api";

export default function () {
  const api = authAxios();
  const route = useRoute();

  const token = computed(() => String(route.params.token || ""));

  // ---- State
  const loadingForgot = ref(false);
  const loadingReset = ref(false);
  const isValidToken = ref(false);

  // ---- Forms
  const forgotForm = ref({ email: "" });
  const resetForm = ref({ password: "", confirmPassword: "" });
  const rForgot = computed(() => ({
    email: { required, email },
  }));
  const rReset = computed(() => ({
    password: { required, passwordPolicy },
    confirmPassword: {
      required,
      sameAsPassword: sameAs(resetForm.value.password),
    },
  }));
  const vForgot$ = useVuelidate(rForgot, forgotForm);
  const vReset$ = useVuelidate(rReset, resetForm);

  const handleForgot = async () => {
    await vForgot$.value.$validate();
    if (vForgot$.value.$invalid) return;

    try {
      loadingForgot.value = true;
      const { data } = await api.forgotPassword({
        email: forgotForm.value.email,
      });

      if (data?.message === "TOKEN_SEND_FORGOT") {
        clearForm();
        notifyApiSuccess("TOKEN_SEND_FORGOT", "", { timeout: 10000 });
        await navigateTo({ name: "auth-login" });
      }
    } catch (err: any) {
      notifyApiError(err);
    } finally {
      loadingForgot.value = false;
    }
  };

  const handleReset = async () => {
    if (!token.value) return;
    await vReset$.value.$validate();
    if (vReset$.value.$invalid) return;

    try {
      const { data } = await api.resetPassword({ token: token.value, password: resetForm.value.password });
      if (data?.message === "PASSWORD_UPDATED") {
        clearForm();
        notifyApiSuccess("PASSWORD_UPDATED");
        await navigateTo({ name: "auth-login" });
      }
    } catch (err: any) {
      notifyApiError(err);
    } finally {
      loadingReset.value = false;
    }
  };

  const verifyToken = async () => {
    if (!token.value) return;
    try {
      const { data } = await api.verifyToken({ token: token.value });
      if (data?.message === "TOKEN_VALID") {
        isValidToken.value = true;
      }
    } catch (err: any) {
      notifyApiError(err);
      isValidToken.value = false;
    }
  };

  const clearForm = () => {
    forgotForm.value = { email: "" };
    resetForm.value = { password: "", confirmPassword: "" };
    vForgot$.value.$reset();
    vReset$.value.$reset();
  };

  return {
    // State
    loadingForgot,
    loadingReset,
    isValidToken,

    // Forms
    vForgot$,
    vReset$,
    forgotForm,
    resetForm,

    // Actions
    handleForgot,
    handleReset,
    verifyToken,
  };
}
