import useVuelidate from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";

import { templatesAxios } from "~/api/templates.api";
import { usersAxios } from "~/api/users.api";
import { devicesAxios } from "~/api/devices.api";
import type { IParams } from "~/api/api.interfaces";

export default function () {
  const router = useRouter();
  const api = devicesAxios();
  const apiUsers = usersAxios();
  const apiTemplates = templatesAxios();

  // ---- state
  const submitting = ref(false);

  // Users
  const loadingUsers = ref(false);
  const users = ref<IUserOption[]>([]);
  const userOptions = computed(() => users.value.map((u) => ({ value: u._id, label: u.email })));

  // Templates
  const loadingTemplates = ref(false);
  const templates = ref<ITemplateOption[]>([]);
  const templateOptions = computed(() => templates.value.map((t: any) => ({ value: t._id, label: t.name })));

  // ---- Form
  const form = ref<ICreateDevice>({
    user: "",
    template: "",
    serial: "",
    name: "",
    description: "",
  });
  const rules = computed(() => ({
    user: { required },
    template: { required },
    serial: { required, minLength: minLength(17), maxLength: maxLength(17) },
    name: { required, minLength: minLength(3), maxLength: maxLength(50) },
    description: { required, minLength: minLength(5), maxLength: maxLength(120) },
  }));
  const v$ = useVuelidate(rules, form);

  // ---- Loaders
  const fetchUsers = async () => {
    try {
      loadingUsers.value = true;
      const { data } = await apiUsers.findAll({ limit: 0, select: "email" });
      if (data.message === "USERS_FOUND") {
        users.value = data.data ?? [];
      }
    } catch (err: any) {
      notifyApiError(err, "No fue posible cargar los usuarios");
    } finally {
      loadingUsers.value = false;
    }
  };

  const fetchTemplatesByUser = async (user?: string) => {
    try {
      templates.value = [];
      if (!user) return;
      loadingTemplates.value = true;

      const finalQuery: IParams & { user?: string } = { user, limit: 0, select: "name" };

      const { data } = await apiTemplates.findAll(finalQuery);
      if (data.message === "TEMPLATES_FOUND") {
        templates.value = (data.data ?? []).map((t: any) => ({ _id: t._id, name: t.name }));
      }
    } catch (err: any) {
      notifyApiError(err, "No fue posible cargar los templates");
    } finally {
      loadingTemplates.value = false;
    }
  };

  watch(
    () => form.value.user,
    async (u) => {
      form.value.template = "";
      await fetchTemplatesByUser(u);
    }
  );

  const handleSubmit = async () => {
    await v$.value.$validate();
    if (v$.value.$invalid) return;

    try {
      submitting.value = true;
      const { data } = await api.create(form.value);
      if (data.message === "DEVICE_CREATED") {
        notifyApiSuccess("Dispositivo creado correctamente.");
        await router.push({ name: "devices-index" });
      }
    } catch (err: any) {
      notifyApiError(err);
    } finally {
      submitting.value = false;
    }
  };

  const handleCancel = async () => {
    await router.push({ name: "devices-index" });
  };

  return {
    // State
    form,
    v$,
    submitting,
    loadingUsers,
    users,
    userOptions,
    loadingTemplates,
    templates,
    templateOptions,

    // Actions
    fetchUsers,
    handleSubmit,
    handleCancel,
  };
}
