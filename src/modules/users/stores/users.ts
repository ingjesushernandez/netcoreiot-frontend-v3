export const useUsersStore = defineStore("users", () => {
  const users = ref<IUser[]>([]);
  const total = ref(0);
  const loading = ref(false);

  const setList = (items: IUser[], t: number) => {
    users.value = items;
    total.value = t;
  };

  return {
    users,
    total,
    loading,
    setList,
  };
});
