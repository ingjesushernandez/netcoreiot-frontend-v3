import type { IUser } from "../interfaces";

export const useUsersStore = defineStore("users", () => {
  const users = ref<IUser[]>([]);
  const total = ref(0);
  const loading = ref(false);

  const byId = (id: string) => users.value.find((u) => u._id === id) ?? null;

  const setList = (items: IUser[], t: number) => {
    users.value = items;
    total.value = t;
  };

  return {
    users,
    total,
    loading,
    byId,
    setList,
  };
});
