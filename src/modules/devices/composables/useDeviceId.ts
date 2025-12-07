import { devicesAxios } from "~/api/devices.api";

export default function () {
  const router = useRouter();
  const route = useRoute();
  const api = devicesAxios();

  const id = computed(() => String(route.params.id || ""));

  // ---- State
  const loading = ref(false);
  const device = ref<IDevice | null>(null);

  const load = async () => {
    if (!id.value) return router.push({ name: "devices-index" });
    try {
      loading.value = true;
      const { data } = await api.findById(id.value);
      if (data.message === "DEVICE_FOUND") {
        device.value = data.data;
      }
    } catch (err: any) {
      notifyApiError(err);
      await router.push({ name: "devices-index" });
    } finally {
      loading.value = false;
    }
  };

  const goBack = () => router.push({ name: "devices-index" });
  const goEdit = () => router.push({ name: "devices-edit", params: { id: id.value } });

  // Presentation
  const baseTopic = computed(() => (device.value ? `${device.value.user}/${device.value._id}` : ""));
  const topicInPattern = computed(() => (baseTopic.value ? `${baseTopic.value}/+/sdata` : ""));
  const topicOutPattern = computed(() => (baseTopic.value ? `${baseTopic.value}/+/relay` : ""));
  const topicInFor = (wid?: string) => (wid && baseTopic.value ? `${baseTopic.value}/${wid}/sdata` : "");
  const topicOutFor = (wid?: string) => (wid && baseTopic.value ? `${baseTopic.value}/${wid}/relay` : "");

  const hasAlarms = computed(() => (device.value?.alarmRules?.length ?? 0) > 0);
  return {
    // State
    loading,
    device,

    // Presentation
    topicInPattern,
    topicOutPattern,
    topicInFor,
    topicOutFor,
    hasAlarms,

    // Actions
    load,
    goBack,
    goEdit,
  };
}
