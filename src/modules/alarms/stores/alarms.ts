export const useAlarmsStore = defineStore("alarms", () => {
  const alarms = ref<IAlarmRule[]>([]);
  const total = ref(0);
  const loading = ref(false);

  const setList = (list: IAlarmRule[], t: number) => {
    alarms.value = list;
    total.value = t;
  };

  return {
    alarms,
    total,
    loading,
    setList,
  };
});
