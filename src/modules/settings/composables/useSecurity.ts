import useVuelidate from "@vuelidate/core";
import { required, sameAs } from "@vuelidate/validators";

import { usersAxios } from "~/api/users.api";

export default function () {
  const api = usersAxios();
  const authStore = useAuthStore();

  // ---- state
  const submitting = ref(false);

  // ---- Form
  const form = ref({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const rules = computed(() => ({
    oldPassword: { required, passwordPolicy },
    newPassword: { required, passwordPolicy },
    confirmPassword: { required, sameAsPassword: sameAs(form.value.newPassword) },
  }));
  const v$ = useVuelidate(rules, form);

  const handleSubmit = async () => {
    await v$.value.$validate();
    if (v$.value.$invalid) return;

    try {
      submitting.value = true;
      const payload = {
        oldPassword: form.value.oldPassword,
        newPassword: form.value.newPassword,
      };
      const { data } = await api.updatePassword(authStore.loggedUserId, payload);
      if (data.message === "PASSWORD_UPDATED") {
        notifyApiSuccess("Contraseña actualizada.");
        resetForm();
      }
    } catch (err: any) {
      notifyApiError(err, "No fue posible actualizar la contraseña");
    } finally {
      submitting.value = false;
    }
  };

  // ---- helpers
  const resetForm = () => {
    form.value = { oldPassword: "", newPassword: "", confirmPassword: "" };
    v$.value.$reset();
  };

  return { form, v$, submitting, handleSubmit, resetForm };
}
