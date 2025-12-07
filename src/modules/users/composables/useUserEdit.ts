import useVuelidate from "@vuelidate/core";
import { required, minLength, maxLength, email as vEmail } from "@vuelidate/validators";

import { rolesAxios } from "~/api/roles.api";
import { usersAxios } from "~/api/users.api";

export default function () {
  const router = useRouter();
  const route = useRoute();
  const apiUsers = usersAxios();
  const apiRoles = rolesAxios();

  const id = computed(() => String(route.params.id || ""));

  // ---- state
  const loadingRoles = ref(false);
  const loadingUser = ref(false);
  const submitting = ref(false);
  const roles = ref<IRoleOption[]>([]);
  const roleOptions = computed(() => roles.value.map((r) => ({ value: r._id, label: r.name })));

  // ---- Form
  const form = ref<ICreateUser>({
    role: "",
    firstName: "",
    lastName: "",
    dni: "",
    phone: "",
    email: "",
    avatar: null,
  });
  const rules = computed(() => ({
    role: { required },
    firstName: { required, minLength: minLength(3) },
    lastName: { required, minLength: minLength(3) },
    dni: { required },
    email: { required, vEmail },
    phone: { required, phoneRegex, minLength: minLength(13), maxLength: maxLength(13) },
  }));
  const v$ = useVuelidate(rules, form);

  const fetchRoles = async () => {
    try {
      loadingRoles.value = true;
      const { data } = await apiRoles.findAll({ select: "name,key" });
      if (data.message === "ROLES_FOUND") {
        roles.value = data.data ?? [];
      }
    } catch (err: any) {
      notifyApiError(err, "No fue posible cargar los roles");
    } finally {
      loadingRoles.value = false;
    }
  };

  const loadUser = async () => {
    if (!id.value) return router.push({ name: "users-index" });
    try {
      loadingUser.value = true;
      const { data } = await apiUsers.findById(id.value);
      if (data.message === "USER_FOUND") {
        form.value = mapUserToForm(data.data);
        v$.value.$reset();
      }
    } catch (err: any) {
      notifyApiError(err);
      await router.push({ name: "users-index" });
    } finally {
      loadingUser.value = false;
    }
  };

  const handleUpdate = async () => {
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
      const payload: Partial<ICreateUser> = form.value;
      const { data } = await apiUsers.update(id.value, payload);
      if (data.message === "USER_UPDATED") {
        notifyApiSuccess("Usuario actualizado correctamente.");
        await router.push({ name: "users-index" });
      }
    } catch (err: any) {
      notifyApiError(err);
    } finally {
      submitting.value = false;
    }
  };

  const handleCancel = async () => {
    await router.push({ name: "users-index" });
  };

  const mapUserToForm = (u: any): ICreateUser => ({
    role: u?.role?._id || u?.role || "",
    firstName: u?.firstName ?? "",
    lastName: u?.lastName ?? "",
    dni: u?.dni ?? "",
    phone: u?.phone ?? "",
    email: u?.email ?? "",
    avatar: u?.avatar ?? null,
  });

  return {
    // State
    form,
    v$,
    roleOptions,
    loadingRoles,
    loadingUser,
    submitting,

    // Actions
    loadUser,
    fetchRoles,
    handleUpdate,
    handleCancel,
  };
}
