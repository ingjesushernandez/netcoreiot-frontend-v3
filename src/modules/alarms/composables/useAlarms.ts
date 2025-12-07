import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

import type { IParams } from "~/api/api.interfaces";

import { mqttAxios } from "~/api/mqtt.api";
import { devicesAxios } from "~/api/devices.api";

const emptyForm = (): ICreateAlarm => ({
  user: "",
  device: "",
  deviceName: "",
  widgetId: "",
  widgetTitle: "",
  unit: "",
  condition: "",
  setPoint: null,
  triggerTime: null,
  email: "",
});

export default function () {
  const api = mqttAxios();
  const apiDevices = devicesAxios();
  const store = useAlarmsStore();
  const authStore = useAuthStore();

  const isSuper = computed<boolean>(() => {
    const perms = authStore.userPermissions ?? [];
    return perms.includes("*");
  });

  const { search, serverOptions, rowLoading, setSelectFields, setDateRange, onUpdateServerOptions, fetchList } =
    useListController<IAlarmRule>({
      fetcher: async (q) => {
        const finalQuery: IParams & { user?: string } = { ...q };

        if (!isSuper.value) {
          const uid = authStore.loggedUserId ?? authStore.loggedUser?._id;
          if (uid) finalQuery.user = uid as string;
        }

        const { data } = await api.findAllAlarms(finalQuery);
        return { items: data.data ?? [], total: data.total ?? 0 };
      },
      setList: (list, total) => store.setList(list, total),
      loadingRef: toRef(store, "loading"),
    });

  const alarms = computed(() => store.alarms);
  const totalItems = computed(() => store.total);
  const loading = computed(() => store.loading);

  const findLocal = (id: string) => alarms.value.find((d) => d._id === id);

  const handleDelete = async (id: string) => {
    const Swal = (await import("sweetalert2")).default;
    const res = await Swal.fire({
      title: "¿Eliminar alarma?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!res.isConfirmed) return;

    try {
      const { data } = await api.alarmRuleDelete(id);
      if (data.message === "ALARM_DELETED") {
        notifyApiSuccess("Alarma eliminada correctamente.");
        await fetchList();
      }
    } catch (err: any) {
      notifyApiError(err, "No fue posible eliminar la alarma");
    }
  };

  const handleEnableRule = async (id: string, next: boolean) => {
    try {
      rowLoading.value[id] = true;
      const local = findLocal(id);

      if (local) {
        local.status = next;
        const { data } = await api.alarmRuleEnable({ emqxRuleId: local.emqxRuleId, enable: next });
        if (data.message === "ALARM_RULE_ENABLE") {
          notifyApiSuccess(next ? "Regla activada." : "Regla desactivada.");
        }
      }
    } catch (err: any) {
      const local = findLocal(id);
      if (local) local.status = !next;
      notifyApiError(err, "No fue posible actualizar la regla");
    } finally {
      rowLoading.value[id] = false;
    }
  };

  // ==================================
  // ========== MODAL / FORM ==========
  // ==================================
  const modalOpen = ref(false);
  const submitting = ref(false);

  const loadingDevices = ref(false);
  const devices = ref<IDeviceOption[]>([]);
  const devicesOptions = computed(() => devices.value.map((d) => ({ value: d._id, label: d.name })));

  const ALARMABLE_WIDGETS: WidgetType[] = ["number_chart", "number_indicator", "status_indicator"];
  const widgets = ref<IWidgetSub[]>([]);
  const widgetOptions = computed(() =>
    widgets.value.filter((w) => ALARMABLE_WIDGETS.includes(w.type)).map((w) => ({ value: w.widgetId, label: w.title }))
  );

  const form = ref<ICreateAlarm>(emptyForm());
  const rules = computed(() => ({
    user: { required },
    device: { required },
    deviceName: { required },
    widgetId: { required },
    widgetTitle: { required },
    unit: { required },
    condition: { required },
    setPoint: { required },
    triggerTime: { required },
    email: { required },
  }));
  const v$ = useVuelidate(rules, form);

  const loadDevices = async () => {
    try {
      devices.value = [];
      const uid = authStore.loggedUserId ?? authStore.loggedUser?._id;
      if (!uid) return;
      loadingDevices.value = true;

      const finalQuery: IParams & { user?: string } = { user: uid, limit: 0, select: "name template" };

      const { data } = await apiDevices.findAll(finalQuery);
      if (data.message === "DEVICES_FOUND") {
        devices.value = (data.data ?? []).map((d: any) => ({
          _id: d._id,
          name: d.name,
          widgets: d.template?.widgets ?? [],
        }));
      }
    } catch (err: any) {
      notifyApiError(err, "No fue posible cargar los dispositivos");
    } finally {
      loadingDevices.value = false;
    }
  };

  const loadWidgets = async (deviceId: string) => {
    const d = devices.value.find((x) => x._id === deviceId);
    widgets.value = d?.widgets ?? [];
    form.value.deviceName = d?.name ?? "";
  };

  const openModal = async () => {
    form.value = emptyForm();
    await loadDevices();
    form.value.user = (authStore.loggedUserId ?? authStore.loggedUser?._id) || "";
    form.value.email = authStore.loggedUser?.email || "";
    modalOpen.value = true;
  };

  const closeModal = () => {
    modalOpen.value = false;
    nextTick(() => (form.value = emptyForm()));
    v$.value.$reset();
    widgets.value = [];
  };

  watch(
    () => form.value.device,
    async (d) => {
      form.value.widgetId = "";
      form.value.widgetTitle = "";
      form.value.unit = "";
      await loadWidgets(d || "");
    }
  );

  watch(
    () => form.value.widgetId,
    (wid) => {
      const w = widgets.value.find((x) => x.widgetId === wid);
      form.value.widgetTitle = w?.title || "";
      form.value.unit = w?.unit || "";
    }
  );

  const handleSubmit = async () => {
    await v$.value.$validate();
    if (v$.value.$invalid) return;

    try {
      submitting.value = true;

      const payload: ICreateAlarm = { ...form.value };
      const { data } = await api.alarmRuleCreate(payload);

      if (data.message === "ALARM_RULE_CREATED") {
        notifyApiSuccess("Alarma creada correctamente.");
        closeModal();
        await fetchList();
      }
    } catch (err: any) {
      notifyApiError(err, "No fue posible guardar la alarma");
    } finally {
      submitting.value = false;
    }
  };

  return {
    // Listado / tabla
    alarms,
    totalItems,
    loading,
    search,
    serverOptions,
    setSelectFields,
    setDateRange,
    onUpdateServerOptions,
    fetchList,
    rowLoading,

    // Modal / Form
    form,
    v$,
    openModal,
    closeModal,
    modalOpen,
    submitting,

    // Dispositivos & Widgets
    loadingDevices,
    devices,
    devicesOptions,
    widgets,
    widgetOptions,

    // Acciones
    handleDelete,
    handleEnableRule,
    handleSubmit,
  };
}
