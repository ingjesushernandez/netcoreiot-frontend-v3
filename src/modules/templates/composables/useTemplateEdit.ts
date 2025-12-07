import useVuelidate from "@vuelidate/core";
import { required, minLength, maxLength, helpers } from "@vuelidate/validators";

import { templatesAxios } from "~/api/templates.api";
import { makeWidget, clone } from "~/utils/constants/templates";

export default function () {
  const router = useRouter();
  const route = useRoute();
  const api = templatesAxios();

  const id = computed(() => String(route.params.id || ""));

  // ---- state
  const submitting = ref(false);
  const loading = ref(false);

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

  const loadTemplate = async () => {
    if (!id.value) return router.push({ name: "templates-index" });
    try {
      loading.value = true;
      const { data } = await api.findById(id.value);
      if (data.message === "TEMPLATE_FOUND") {
        form.value = mapTemplateToForm(data.data);
        v$.value.$reset();
      }
    } catch (err: any) {
      notifyApiError(err, "No fue posible cargar el template");
      await router.push({ name: "templates-index" });
    } finally {
      loading.value = false;
    }
  };

  const handleUpdate = async () => {
    await v$.value.$validate();
    if (v$.value.$invalid) return;

    const Swal = (await import("sweetalert2")).default;
    const res = await Swal.fire({
      title: "¿Guardar cambios?",
      text: "Se actualizará la información del template.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar",
    });
    if (!res.isConfirmed) return;

    try {
      submitting.value = true;
      const payload: Partial<ICreateTemplate> = {
        name: form.value.name,
        description: form.value.description,
        widgets: form.value.widgets,
      };
      const { data } = await api.update(id.value, payload);
      if (data.message === "TEMPLATE_UPDATED") {
        notifyApiSuccess("Template actualizado correctamente.");
        await router.push({ name: "templates-index" });
      }
    } catch (err: any) {
      notifyApiError(err);
    } finally {
      submitting.value = false;
    }
  };

  const handleCancel = async () => {
    await router.push({ name: "templates-index" });
  };

  const mapTemplateToForm = (t: any): ICreateTemplate => ({
    user: (t.user as any) ?? "",
    name: t.name ?? "",
    description: t.description ?? "",
    widgets: t.widgets ?? [],
  });

  // ----- WIDGET SELECCIONADO -----
  const widgetType = ref<WidgetType | "">("");
  const currentConfig = ref<IWidgetSub | null>(null);

  const addWidget = async () => {
    if (!currentConfig.value || !widgetType.value) return;
    if (!form.value.user) {
      notifyApiError(null as any, "El template no tiene usuario asignado.");
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
    loading,
    widgetType,
    currentConfig,

    // Actions
    loadTemplate,
    handleUpdate,
    handleCancel,
    addWidget,
    deleteWidget,
  };
}
