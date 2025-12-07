import type { IParams } from "~/api/api.interfaces";
import { devicesAxios } from "~/api/devices.api";

export default function () {
  const api = devicesAxios();
  const auth = useAuthStore();

  const loadingDevices = ref(false);
  const selecting = ref(false);
  const devices = ref<IDeviceSelected[]>([]);
  const selectedId = ref<string>("");
  const hydrated = ref(false);

  const hasDevices = computed(() => devices.value.length > 0);
  const devSelectedOpts = computed(() => devices.value.map((d) => ({ value: d._id, label: d.name })));

  const selectedDevice = computed<IDeviceSelected | undefined>(() =>
    devices.value.find((d) => d._id === selectedId.value)
  );

  const widgetsForView = computed<IWidgetSub[]>(() => {
    const uid = auth.loggedUserId ?? auth.loggedUser?._id;
    const d = selectedDevice.value;
    const t = d?.template;

    if (!uid || !d || !t?.widgets?.length) return [];

    return t.widgets.map(
      (w) =>
        ({
          ...w,
          user: uid,
          selectedDevice: {
            id: d._id,
            name: d.name,
            serial: d.serial,
          },
          demo: false,
        } as IWidgetSub)
    );
  });

  const loadDevices = async () => {
    try {
      devices.value = [];
      selectedId.value = "";
      loadingDevices.value = true;

      const uid = auth.loggedUserId ?? auth.loggedUser?._id;
      if (!uid) return;

      const finalQuery: IParams & { user?: string } = { user: uid, limit: 0, select: "name serial selected template" };

      const { data } = await api.findAll(finalQuery);
      if (data.message === "DEVICES_FOUND") {
        devices.value = data.data ?? [];
        const pre = devices.value.find((d) => d.selected) ?? devices.value[0];
        selectedId.value = pre?._id ?? "";
      }
    } catch (err: any) {
      notifyApiError(err, "No fue posible cargar los dispositivos");
    } finally {
      loadingDevices.value = false;
      hydrated.value = true;
    }
  };

  const selectDevice = async (id: string) => {
    if (!hydrated.value) return;
    if (!id) return;
    if (selectedDevice.value?._id === id && selectedDevice.value?.selected) return;

    try {
      selecting.value = true;
      const { data } = await api.selectDevice(id);
      if (data.message === "DEVICE_SELECTED") {
        devices.value = devices.value.map((d) => ({
          ...d,
          selected: d._id === id,
        }));
        selectedId.value = id;
      }
    } catch (err: any) {
      notifyApiError(err, "No fue posible seleccionar el dispositivo");
      const prev = devices.value.find((d) => d.selected);
      selectedId.value = prev?._id ?? selectedId.value;
    } finally {
      selecting.value = false;
    }
  };

  watch(selectedId, (id) => {
    if (!id) return;
    void selectDevice(id);
  });

  return {
    // state
    loadingDevices,
    selecting,
    devices,
    selectedId,
    selectedDevice,
    hasDevices,
    widgetsForView,
    devSelectedOpts,

    // actions
    loadDevices,
    selectDevice,
  };
}
