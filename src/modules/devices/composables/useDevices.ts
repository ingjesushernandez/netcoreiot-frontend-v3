import type { IParams } from "~/api/api.interfaces";

import { devicesAxios } from "~/api/devices.api";
import { mqttAxios } from "~/api/mqtt.api";

export default function () {
  const router = useRouter();
  const api = devicesAxios();
  const apiMqtt = mqttAxios();
  const store = useDevicesStore();
  const authStore = useAuthStore();

  const isSuper = computed<boolean>(() => {
    const perms = authStore.userPermissions ?? [];
    return perms.includes("*");
  });

  const { search, serverOptions, rowLoading, setSelectFields, setDateRange, onUpdateServerOptions, fetchList } =
    useListController<IDevice>({
      fetcher: async (q) => {
        const finalQuery: IParams & { user?: string } = { ...q };

        if (!isSuper.value) {
          const uid = authStore.loggedUserId ?? authStore.loggedUser?._id;
          if (uid) finalQuery.user = uid as string;
        }

        const { data } = await api.findAll(finalQuery);
        return { items: data.data ?? [], total: data.total ?? 0 };
      },
      setList: (list, total) => store.setList(list, total),
      loadingRef: toRef(store, "loading"),
    });

  const devices = computed(() => store.devices);
  const totalItems = computed(() => store.total);
  const loading = computed(() => store.loading);

  const findLocal = (id: string) => devices.value.find((d) => d._id === id);

  const handleDelete = async (id: string) => {
    const Swal = (await import("sweetalert2")).default;
    const res = await Swal.fire({
      title: "¿Eliminar dispositivo?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!res.isConfirmed) return;

    try {
      const { data } = await api.delete(id);
      if (data.message === "DEVICE_DELETED") {
        notifyApiSuccess("Dispositivo eliminado correctamente.");
        await fetchList();
      }
    } catch (err: any) {
      notifyApiError(err, "No fue posible eliminar el dispositivo");
    }
  };

  const handleEnableRule = async (id: string, next: boolean) => {
    try {
      rowLoading.value[id] = true;
      const local = findLocal(id);

      if (local) {
        local.saveRule.status = next;
        const { data } = await apiMqtt.saveRuleEnable({ emqxRuleId: local.saveRule.emqxRuleId, enable: next });
        if (data.message === "SAVE_RULE_ENABLE") {
          notifyApiSuccess(next ? "Regla activada." : "Regla desactivada.");
        }
      }
    } catch (err: any) {
      const local = findLocal(id);
      if (local) local.saveRule.status = !next;
      notifyApiError(err, "No fue posible actualizar la regla");
    } finally {
      rowLoading.value[id] = false;
    }
  };

  const goNew = () => router.push({ name: "devices-new" });
  const goView = (id: string) => router.push({ name: "devices-id", params: { id } });

  return {
    // State
    devices,
    totalItems,
    loading,
    search,
    serverOptions,
    setSelectFields,
    setDateRange,
    onUpdateServerOptions,
    fetchList,
    rowLoading,

    // Actions
    handleDelete,
    handleEnableRule,
    goNew,
    goView,
  };
}
