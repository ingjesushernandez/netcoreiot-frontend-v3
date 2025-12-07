import useVuelidate from "@vuelidate/core";
import { required, minLength, maxLength, helpers } from "@vuelidate/validators";

import { templatesAxios } from "~/api/templates.api";
import { usersAxios } from "~/api/users.api";

import { makeWidget, clone } from "~/utils/constants/templates";

export default function () {
  const router = useRouter();
  const api = templatesAxios();
  const apiUsers = usersAxios();

  // ---- state
  const submitting = ref(false);
  const loadingUsers = ref(false);
  const users = ref<IUserOption[]>([]);
  const userOptions = computed(() => users.value.map((u) => ({ value: u._id, label: u.email })));

  // ---- Form
  const form = ref<ICreateTemplate>({
    user: "",
    name: "",
    description: "",
    widgets: [],
  });
  const rules = computed(() => ({
    user: { required },
    name: { required, minLength: minLength(5) },
    description: { required, minLength: minLength(5), maxLength: maxLength(50) },
    widgets: {
      required: helpers.withMessage("Agrega al menos un Widget.", (v: any[]) => Array.isArray(v) && v.length > 0),
    },
  }));
  const v$ = useVuelidate(rules, form);

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

  const handleSubmit = async () => {
    await v$.value.$validate();
    if (v$.value.$invalid) return;

    try {
      submitting.value = true;
      const { data } = await api.create(form.value);
      if (data.message === "TEMPLATE_CREATED") {
        notifyApiSuccess("Template creado correctamente.");
        await router.push({ name: "templates-index" });
      }
    } catch (err: any) {
      notifyApiError(err);
    } finally {
      submitting.value = false;
    }
  };

  const handleCancel = async () => {
    form.value.name = "";
    form.value.description = "";
    form.value.widgets = [];
    widgetType.value = "";
    currentConfig.value = null;
    await router.push({ name: "templates-index" });
  };

  // ----- WIDGET SELECCIONADO -----
  const widgetType = ref<WidgetType | "">("");
  const currentConfig = ref<IWidgetSub | null>(null);

  const addWidget = async () => {
    if (!currentConfig.value || !widgetType.value) return;
    if (!form.value.user) {
      notifyApiError(null as any, "Selecciona un usuario para el widget.");
      return;
    }
    const ready = {
      ...currentConfig.value,
      widgetId: await makeId(10),
    };
    form.value.widgets.push(clone(ready));
  };

  const deleteWidget = (idx: number) => {
    form.value.widgets.splice(idx, 1);
  };

  watch(
    widgetType,
    (t) => {
      if (!t) {
        currentConfig.value = null;
        return;
      }
      currentConfig.value = makeWidget(t, {});
    },
    { immediate: true }
  );

  return {
    // State
    form,
    v$,
    submitting,
    loadingUsers,
    userOptions,
    widgetType,
    currentConfig,

    // Actions
    fetchUsers,
    handleSubmit,
    handleCancel,
    addWidget,
    deleteWidget,
  };
}
