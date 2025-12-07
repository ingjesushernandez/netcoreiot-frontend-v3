export const useNotificationsStore = defineStore("notifications", () => {
  const items = ref<INotification[]>([]);
  const total = ref(0);
  const loading = ref(false);

  const setList = (list: INotification[], t: number) => {
    items.value = list;
    total.value = t;
  };

  const prepend = (n: INotification) => {
    items.value = [n, ...items.value].slice(0, 20);
    total.value = Math.max(1, total.value + 1);
  };

  const removeOne = (id: string) => {
    const prev = items.value.length;
    items.value = items.value.filter((x) => x._id !== id);
    if (items.value.length < prev) total.value = Math.max(0, total.value - 1);
  };

  return {
    // state
    items,
    total,
    loading,
    // setters
    setList,
    prepend,
    removeOne,
  };
});
