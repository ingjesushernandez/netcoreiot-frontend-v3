import useVuelidate from "@vuelidate/core";
import { required, minLength, email, maxLength } from "@vuelidate/validators";

import { usersAxios } from "~/api/users.api";

export default function () {
  const authStore = useAuthStore();
  const api = usersAxios();

  const userId = computed(() => authStore.loggedUserId ?? authStore.loggedUser?._id);
  const loading = ref(false);
  const submitting = ref(false);

  const form = ref<IProfileForm>({
    firstName: "",
    lastName: "",
    dni: "",
    phone: "",
    email: "",
  });
  const initial = ref<IProfileForm | null>(null);
  const rules = computed(() => ({
    firstName: { required, minLength: minLength(3) },
    lastName: { required, minLength: minLength(3) },
    dni: { required },
    email: { required, email },
    phone: { required, minLength: minLength(10), maxLength: maxLength(20), phoneRegex },
  }));
  const v$ = useVuelidate(rules, form);

  const selectFields = "firstName,lastName,phone,email,dni";

  const fetchProfile = async () => {
    if (!userId.value) return;
    try {
      loading.value = true;
      const { data } = await api.findById(userId.value, selectFields);
      const u = data?.data ?? {};
      const payload: IProfileForm = {
        firstName: u.firstName ?? "",
        lastName: u.lastName ?? "",
        dni: u.dni ?? "",
        phone: u.phone ?? "",
        email: u.email ?? "",
      };
      form.value = { ...payload };
      initial.value = { ...payload };
    } catch (err: any) {
      notifyApiError(err, "No fue posible cargar tu perfil");
    } finally {
      loading.value = false;
    }
  };

  const handleUpdate = async () => {
    if (!userId.value) return;
    await v$.value.$validate();
    if (v$.value.$invalid) return;

    const Swal = (await import("sweetalert2")).default;
    const res = await Swal.fire({
      title: "¿Guardar cambios?",
      text: "Se actualizará la información del usuario.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar",
    });
    if (!res.isConfirmed) return;

    try {
      submitting.value = true;
      const payload: IProfileForm = { ...form.value };
      const { data } = await api.update(userId.value, payload);
      if (data?.message === "USER_UPDATED") {
        notifyApiSuccess("Cambios guardados");
        initial.value = { ...form.value };
        authStore.loggedUser = { ...(authStore.loggedUser as any), ...form.value };
      }
    } catch (err: any) {
      notifyApiError(err, "No fue posible guardar los cambios");
    } finally {
      submitting.value = false;
    }
  };

  const handleCancel = () => {
    if (initial.value) form.value = { ...initial.value };
    v$.value.$reset();
  };

  return {
    loading,
    submitting,
    form,
    v$,
    fetchProfile,
    handleUpdate,
    handleCancel,
  };
}
