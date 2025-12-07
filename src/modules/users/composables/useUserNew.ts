import useVuelidate from "@vuelidate/core";
import { required, minLength, maxLength, email as vEmail } from "@vuelidate/validators";

import { rolesAxios } from "~/api/roles.api";
import { usersAxios } from "~/api/users.api";

export default function () {
  const router = useRouter();
  const api = usersAxios();
  const apiRoles = rolesAxios();

  // ---- state
  const submitting = ref(false);
  const loadingRoles = ref(false);
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
      const { data } = await apiRoles.findAll({ limit: 0, select: "name,key" });
      if (data.message === "ROLES_FOUND") {
        roles.value = data.data ?? [];
      }
    } catch (err: any) {
      notifyApiError(err, "No fue posible cargar los roles");
    } finally {
      loadingRoles.value = false;
    }
  };

  const handleSubmit = async () => {
    await v$.value.$validate();
    if (v$.value.$invalid) return;

    try {
      submitting.value = true;
      const { data } = await api.create(form.value);
      if (data.message === "USER_CREATED") {
        notifyApiSuccess("Usuario creado correctamente.");
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

  return {
    // State
    form,
    v$,
    loadingRoles,
    submitting,
    roleOptions,

    // Actions
    fetchRoles,
    handleSubmit,
    handleCancel,
  };
}
