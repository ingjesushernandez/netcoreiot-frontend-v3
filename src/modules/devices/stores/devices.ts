export const useDevicesStore = defineStore("devices", () => {
  const devices = ref<IDevice[]>([]);
  const total = ref(0);
  const loading = ref(false);

  const setList = (list: IDevice[], t: number) => {
    devices.value = list;
    total.value = t;
  };

  return {
    devices,
    total,
    loading,
    setList,
  };
});
